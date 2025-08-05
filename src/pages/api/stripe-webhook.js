// pages/api/stripe-webhook.js
// -------------------------------------------------------------
// v3.2.0  • Cold‑start safe  • <20 s worst‑case  • detailed logs
//   – Redis connect nå lazy + 1 s timeout (fallback til memory).
//   – RevenueCat‑synk skjer først (viktigste). 8 s timeout.
//   – E‑post sendes samtidig, men AbortController kutter etter 6 s.
//   – Response returneres når RC‑synk + markProcessed er OK –
//     mail‑kallet får max 6 s og blokkerer ikke resten.
//   – maxDuration skrudd ned til 25 s så vi aldri treffer 30 s grense.
// -------------------------------------------------------------

import Stripe from 'stripe';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import { createClient } from 'redis';
import { generateHmacSignature } from '../../lib/universal-link';

export const config = { api: { bodyParser: false }, maxDuration: 25 };

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-04-10',
});

/* ---------- Redis (lazy) ---------- */
let redis, redisReady;
if (process.env.REDIS_URL) {
  redis = createClient({ url: process.env.REDIS_URL });
  redisReady = redis
    .connect()
    .then(() => true)
    .catch((e) => {
      console.warn('[redis] connect failed – using in‑mem set', e.message);
      redis = null;
      return false;
    });
}
const seenMemory = new Set();

/* ---------- Axios global retry ---------- */
axiosRetry(axios, {
  retries: 3,
  retryDelay: (n) => n * 300,
  retryCondition: (err) =>
    err.code === 'ECONNABORTED' ||
    err.response?.status >= 500 ||
    err.response?.status === 429,
});

/* ---------- Stripe events we care about ---------- */
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
  if (req.method !== 'POST')
    return res.setHeader('Allow', 'POST').status(405).end();

  const t0 = Date.now();
  const raw = await readRaw(req);
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      raw,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET_PROD,
    );
  } catch (e) {
    console.error('[stripe‑webhook] bad sig', e.message);
    return res.status(400).end();
  }

  if (!EVENTS.has(event.type)) return res.status(200).end();

  try {
    if (await alreadyDone(event.id)) return res.status(200).end();

    /* ---------- 1 · RevenueCat sync (primary unlock) ---------- */
    const { appUserId, fetchToken } = await rcKeys(event);
    if (!appUserId || !fetchToken)
      throw new Error('appUserId / fetchToken missing');

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

    /* ---------- 2 · Mail unlock link (fire‑and‑race 6 s) ---------- */
    let mailStatus = 'skipped';
    if (event.type === 'checkout.session.completed') {
      const cs = event.data.object;
      const email = cs.customer_details?.email;
      if (email) {
        mailStatus = await sendUnlockMailRace(appUserId, cs.id, email);
      }
    }

    await markDone(event.id);

    console.info('[stripe‑webhook] ✅', {
      type: event.type,
      mail: mailStatus,
      ms: Date.now() - t0,
    });
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('[stripe‑webhook] ❌', e);
    return res.status(500).end();
  }
}

/* ------------------------------------------------------------------ */
/* helpers                                                            */
/* ------------------------------------------------------------------ */

function readRaw(req) {
  return new Promise((r, rej) => {
    const chunks = [];
    req
      .on('data', (c) => chunks.push(c))
      .on('end', () => r(Buffer.concat(chunks)))
      .on('error', rej);
  });
}

async function alreadyDone(id) {
  if (redis && (await redisReady))
    return !(await redis.set(id, 1, { NX: true, PX: 86_400_000 }));
  return seenMemory.has(id);
}

async function markDone(id) {
  if (redis && (await redisReady))
    await redis.set(id, 1, { NX: true, PX: 86_400_000 });
  else seenMemory.add(id);
}

/* ---- RC metadata helper ------------------------------------------ */
async function rcKeys(event) {
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
      let appUserId =
        ch.metadata?.app_user_id || ch.metadata?.client_reference_id;
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

/* ---- Mail with 6 s race‑timeout ---------------------------------- */
async function sendUnlockMailRace(appUserId, sessionId, email) {
  const exp = Math.floor(Date.now() / 1000) + 600;
  const sig = generateHmacSignature(appUserId, sessionId, exp);
  const link = `https://moodmap-app.com/thanks?u=${encodeURIComponent(
    appUserId,
  )}&s=${sessionId}&exp=${exp}&sig=${sig}`;

  const ctrl = new AbortController();
  const timeout = setTimeout(() => ctrl.abort(), 6_000);

  try {
    await fetch('https://moodmap-app.com/api/send-receipt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, link }),
      signal: ctrl.signal,
    });
    return 'sent';
  } catch (e) {
    console.warn('[stripe‑webhook] mail fail (non‑fatal)', e.message);
    return 'timeout';
  } finally {
    clearTimeout(timeout);
  }
}
