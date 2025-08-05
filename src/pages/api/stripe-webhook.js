// pages/api/stripe-webhook.js
// -------------------------------------------------------------
// Stripe  ➜  RevenueCat  ➜  Resend‑mail (universal‑link)
// -------------------------------------------------------------
import Stripe from 'stripe';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import { createClient } from 'redis';
import { generateHmacSignature } from '../../lib/universal-link';      // eksisterer fra før
// Node 18 har global fetch ▶ ingen ekstra import

export const config = { api: { bodyParser: false }, maxDuration: 30 };

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-04-10',
});

/* ---------- Redis – keep a single connection per instance ---------- */
const redis =
 process.env.REDIS_URL ? createClient({ url: process.env.REDIS_URL }) : null;
if (redis) redis.connect().catch(() => console.warn('[redis] connect fail'));
/* ---------- Axios global retry (3x, 0.3 → 0.9 s) ------------------- */
axiosRetry(axios, {
 retries: 3,
 retryDelay: (n) => n * 300,
 retryCondition: (err) =>
 err.code === 'ECONNABORTED' ||
 err.response?.status >= 500 ||
 err.response?.status === 429,
});

const EVENTS = new Set([
  'checkout.session.completed',
  'customer.subscription.created',
  'customer.subscription.deleted',
  'invoice.paid',
  'invoice.payment_succeeded',
  'invoice.updated',
  'invoice.payment_failed',
  'charge.refunded',
]);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.setHeader('Allow', 'POST').status(405).end('Method Not Allowed');
  }

  const rawBody = await readRawBody(req);
  const signature = req.headers['stripe-signature'];
 console.info('[stripe‑webhook] ⏬ payload', {
 len: rawBody.length,
 sig: signature?.slice(0, 16),
 });

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET_PROD,
    );
  } catch (err) {
    console.error('[stripe‑webhook] ❌ Bad sig', err.message);
    return res.status(400).end();
  }
 console.info('[stripe‑webhook] ▶', { id: event.id, type: event.type });

  if (!EVENTS.has(event.type)) return res.status(200).end();

  try {
    if (await alreadyProcessed(event.id)) return res.status(200).end();

    /* ---------- 1. send to RevenueCat ---------- */
    const { appUserId, fetchToken } = await extractRcKeys(event);
    if (!appUserId || !fetchToken) {
      throw new Error('appUserId / fetchToken missing – check metadata.');
    }

    await axios.post(
      'https://api.revenuecat.com/v1/receipts',
      { app_user_id: appUserId, fetch_token: fetchToken },
      {
        headers: {
          'X-Platform': 'stripe',
          Authorization: `Bearer ${process.env.RC_STRIPE_PUBLIC_API_KEY}`,
        },
        timeout: 8_000,
      },
    );

    /* ---------- 2. send universal‑link e‑mail (only for checkout.session.completed) ---------- */
    if (event.type === 'checkout.session.completed') {
      const cs = event.data.object;
      const email = cs.customer_details?.email;
      if (email) {
        const exp = Math.floor(Date.now() / 1000) + 600; // 10 min TTL
        const sig = generateHmacSignature(appUserId, cs.id, exp);
        const thanksUrl = `https://moodmap-app.com/thanks?u=${encodeURIComponent(
          appUserId,
        )}&s=${cs.id}&exp=${exp}&sig=${sig}`;

        try {
          await fetch('https://moodmap-app.com/api/send-receipt', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, link: thanksUrl }),
          });
          console.log('[stripe‑webhook] ✉️  Receipt mail queued');
        } catch (mailErr) {
          // Ikke blocker webhook – bare logg
          console.error('[stripe‑webhook] ✉️  Mail error', mailErr.message);
        }
      }
    }

    /* ---------- 3. log & dedup mark ---------- */
    console.log('[stripe-webhook] ✅ Success', {
      type: event.type,
      user: appUserId,
      token: fetchToken,
    });

    await markProcessed(event.id);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[stripe‑webhook] ❌ Sync error', err);
    return res.status(500).end();
  }
}

/* -------------------------------------------------------------------------- */
/* Helper functions                                                           */
/* -------------------------------------------------------------------------- */

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req
      .on('data', (c) => chunks.push(c))
      .on('end', () => resolve(Buffer.concat(chunks)))
      .on('error', reject);
  });
}

async function alreadyProcessed(id) {
  if (!redis) return false;
  return !(await redis.set(id, 1, { NX: true, EX: 86_400 }));
}

async function markProcessed(id) {
  if (!redis) return;
  await redis.set(id, 1, { NX: true, EX: 86_400 });
}

async function extractRcKeys(event) {
  switch (event.type) {
    case 'checkout.session.completed': {
      const cs = event.data.object;
      return {
        appUserId: cs.client_reference_id || cs.metadata?.app_user_id,
        fetchToken: cs.id,
      };
    }
    case 'customer.subscription.created':
    case 'customer.subscription.deleted': {
      const sub = event.data.object;
      return {
        appUserId:
          sub.metadata?.app_user_id || sub.metadata?.client_reference_id,
        fetchToken: sub.id,
      };
    }
    case 'invoice.paid':
    case 'invoice.payment_succeeded':
    case 'invoice.updated':
    case 'invoice.payment_failed': {
      const inv = event.data.object;
      const subId = inv.subscription;
      const metaId =
        inv.metadata?.app_user_id || inv.metadata?.client_reference_id;
      const appUserId =
        metaId ||
        (subId
          ? (await stripe.subscriptions.retrieve(subId)).metadata?.app_user_id
          : undefined);
      return { appUserId, fetchToken: subId || inv.id };
    }
    case 'charge.refunded': {
      const ch = event.data.object;
      let appUserId = ch.metadata?.app_user_id;
      if (!appUserId && ch.customer) {
        const cust = await stripe.customers.retrieve(ch.customer);
        appUserId = cust.metadata?.app_user_id;
      }
      return { appUserId, fetchToken: ch.invoice || ch.id };
    }
    default:
      return {};
  }
}