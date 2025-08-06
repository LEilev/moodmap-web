// pages/api/stripe-webhook.js              v4.0.2   • 2025‑08‑06
// -----------------------------------------------------------------------------
//  +  Copies app_user_id  ➜  subscription.metadata & customer.metadata
//  +  Beholder fail‑soft logikk  (skipper events uten userId / RC‑feil = 200)
//  +  Parallel RC‑sync  +  mail  +  metadataPromise via Promise.allSettled()
// -----------------------------------------------------------------------------
import Stripe from 'stripe';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import { createClient } from 'redis';
import { generateHmacSignature } from '../../lib/universal-link';      // :contentReference[oaicite:3]{index=3}

export const config = { api: { bodyParser: false }, maxDuration: 30 };

/* ---------- Stripe ---------- */
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-04-10',
});

/* ---------- Redis ---------- */
const redis =
  process.env.REDIS_URL ? createClient({ url: process.env.REDIS_URL }) : null;
if (redis) redis.connect().catch(() => console.warn('[redis] connect fail'));

/* ---------- Axios retry ---------- */
axiosRetry(axios, {
  retries: 3,
  retryDelay: (n) => n * 300,
  retryCondition: (e) =>
    e.code === 'ECONNABORTED' ||
    e.response?.status >= 500 ||
    e.response?.status === 429,
});

/* ---------- Event allow‑list ---------- */
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
    return res.setHeader('Allow', 'POST').status(405).end('Method Not Allowed');

  const raw  = await readRawBody(req);
  const sigH = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      raw,
      sigH,
      process.env.STRIPE_WEBHOOK_SECRET_PROD,
    );
  } catch (err) {
    console.error('[wh] bad sig', err.message);
    return res.status(400).end();
  }

  if (!EVENTS.has(event.type)) return res.status(200).end();
  if (await alreadyProcessed(event.id)) return res.status(200).end();

  /* ---------- 1 · Extract keys ---------- */
  const { appUserId, fetchToken, subId, customerId } = await extractRcKeys(event);
  if (!appUserId || !fetchToken) {
    console.warn('[wh] skip – missing userId/token', { id: event.id, type: event.type });
    await markProcessed(event.id);
    return res.status(200).json({ skipped: true });
  }

  /* ---------- 2 · Promises in parallel ---------- */
  const rcPromise = syncRevenueCat(appUserId, fetchToken);
  const mailPromise = maybeSendMail(event, appUserId);
  const metaPromise = maybeCopyMetadata(event.type, appUserId, subId, customerId);

  /* Wait on all three but fail‑soft */
  const settled = await Promise.allSettled([rcPromise, mailPromise, metaPromise]);
  const rcOk       = settled[0].status === 'fulfilled';
  const mailStatus = settled[1].status === 'fulfilled'
    ? 'success'
    : settled[1].reason?.name === 'AbortError'
    ? 'timeout'
    : 'fail';
  const metaOk     = settled[2].status === 'fulfilled';

  await markProcessed(event.id);
  res.status(rcOk ? 202 : 200).json({ ok: rcOk, mailStatus, metaOk });

  console.info('[wh] ✅', {
    id: event.id,
    type: event.type,
    rcOk,
    mailStatus,
    metaOk,
  });
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function readRawBody(req) {
  return new Promise((r, j) => {
    const b = [];
    req
      .on('data', (c) => b.push(c))
      .on('end', () => r(Buffer.concat(b)))
      .on('error', j);
  });
}

async function alreadyProcessed(id) {
  if (!redis) return false;
  return !(await redis.set(id, 1, { NX: true, EX: 86_400 }));
}
async function markProcessed(id) {
  if (redis) await redis.set(id, 1, { NX: true, EX: 86_400 });
}

/* ---------- RevenueCat sync ---------- */
async function syncRevenueCat(appUserId, fetchToken) {
  return axios.post(
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
}

/* ---------- Mail (checkout events only) ---------- */
async function maybeSendMail(event, userId) {
  if (event.type !== 'checkout.session.completed') return Promise.resolve();

  const cs    = event.data.object;
  const email = cs.customer_details?.email;
  if (!email) return Promise.resolve('no‑email');

  const exp = Math.floor(Date.now() / 1000) + 600;
  const sig = generateHmacSignature(userId, cs.id, exp);
  const link = `https://moodmap-app.com/thanks?u=${encodeURIComponent(
    userId,
  )}&s=${cs.id}&exp=${exp}&sig=${sig}`;

  const ctrl = new AbortController();
  setTimeout(() => ctrl.abort(), 6_000);

  return fetch('https://moodmap-app.com/api/send-receipt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, link }),
    signal: ctrl.signal,
  });
}

/* ---------- Copy metadata to Subscription & Customer ---------- */
async function maybeCopyMetadata(type, userId, subId, customerId) {
  if (type !== 'checkout.session.completed') return Promise.resolve();

  const tasks = [];
  if (subId) {
    tasks.push(
      stripe.subscriptions.update(subId, {
        metadata: { app_user_id: userId },
      }),
    );
  }
  if (customerId) {
    tasks.push(
      stripe.customers.update(customerId, {
        metadata: { app_user_id: userId },
      }),
    );
  }
  return Promise.all(tasks); // resolves even if array is empty
}

/* ---------- Extract keys (extended) ---------- */
async function extractRcKeys(event) {                              // :contentReference[oaicite:4]{index=4}
  switch (event.type) {
    case 'checkout.session.completed': {
      const cs = event.data.object;
      return {
        appUserId: cs.client_reference_id || cs.metadata?.app_user_id,
        fetchToken: cs.id,
        subId: cs.subscription || undefined,
        customerId: cs.customer || undefined,
      };
    }
    case 'customer.subscription.created':
    case 'customer.subscription.deleted': {
      const sub = event.data.object;
      return {
        appUserId:
          sub.metadata?.app_user_id || sub.metadata?.client_reference_id,
        fetchToken: sub.id,
        subId: sub.id,
        customerId: sub.customer,
      };
    }
    /* invoice.* events (renewals) */
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
      return {
        appUserId,
        fetchToken: subId || inv.id,
        subId,
        customerId: inv.customer,
      };
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
