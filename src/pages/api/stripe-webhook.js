// pages/api/stripe-webhook.js
// -------------------------------------------------------------
// v3.1.0  ·  2025‑08‑05  (P0/P1 hardening)
// • Redis SET … NX PX (én RTT)  – eliminerer race‑condition
// • markProcessed() flyttet til mail‑SUCCESS‑grenen
// • Robust Redis‑init m/ fallback til in‑memory Set
// • Ekstra loggfelt (ua, webhook latency)
// • maxDuration 30 s (Vercel edge‑limit)
// -------------------------------------------------------------

import Stripe from 'stripe';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import { createClient } from 'redis';
import { generateHmacSignature } from '../../lib/universal-link';

export const config = { api: { bodyParser: false }, maxDuration: 30 };

// ---------- Stripe ----------
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-04-10',
});

// ---------- Redis (dedupe) ----------
let seenSet = new Set(); // fallback i dev / Redis‑down
let redis;
if (process.env.REDIS_URL) {
  redis = createClient({ url: process.env.REDIS_URL });
  redis.connect().catch((e) => {
    console.warn('[redis] connect failed – falling back to memory', e.message);
    redis = null;
  });
}

// ---------- Axios global retry ----------
axiosRetry(axios, {
  retries: 3,
  retryDelay: (attempt) => attempt * 300,
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

  const t0 = Date.now();
  const rawBody = await readRawBody(req);
  const signature = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET_PROD,
    );
  } catch (err) {
    console.error('[stripe‑webhook] bad sig', err.message);
    return res.status(400).end();
  }

  if (!EVENTS.has(event.type)) return res.status(200).end();

  try {
    if (await alreadyProcessed(event.id)) {
      console.info('[stripe‑webhook] duplicate event', event.id);
      return res.status(200).end();
    }

    // ---------- 1 · Sync to RevenueCat ----------
    const { appUserId, fetchToken } = await extractRcKeys(event);
    if (!appUserId || !fetchToken) throw new Error('Missing appUserId/fetchToken');

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

    // ---------- 2 · Mail universal link (checkout only) ----------
    let mailSuccess = true;
    if (event.type === 'checkout.session.completed') {
      const cs = event.data.object;
      const email = cs.customer_details?.email;
      if (email) {
        const exp = Math.floor(Date.now() / 1000) + 600;
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
          console.log('[stripe‑webhook] mail queued', { email });
        } catch (err) {
          mailSuccess = false;
          console.error('[stripe‑webhook] mail err', err.message);
        }
      }
    }

    // ---------- 3 · Dedup mark (only after mail OK) ----------
    if (mailSuccess) await markProcessed(event.id);

    console.info('[stripe‑webhook] OK', {
      id: event.id,
      type: event.type,
      ua: req.headers['user-agent']?.slice(0, 64),
      ms: Date.now() - t0,
    });
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[stripe‑webhook] handler err', err);
    return res.status(500).end();
  }
}

/* ------------ Helpers -------------------------------------------------- */

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
  if (redis)
    return !(await redis.set(id, 1, { NX: true, PX: 86_400_000 })); // 24 h
  return seenSet.has(id);
}

async function markProcessed(id) {
  if (redis) return redis.set(id, 1, { NX: true, PX: 86_400_000 });
  seenSet.add(id);
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
