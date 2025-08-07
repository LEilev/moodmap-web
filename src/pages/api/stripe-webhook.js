// pages/api/stripe-webhook.js
// -----------------------------------------------------------------------------
// MoodMap  •  Stripe  ➜  RevenueCat   (v4.0.3  – mail flyttet til klienten)
// -----------------------------------------------------------------------------
//
//   ✔  fail‑soft: mangler userId/fetchToken ⇒ 200, Stripe retry stopper
//   ✔  RC‑sync  (8 s timeout, 3× retry via axiosRetry)
//   ✔  Kopierer app_user_id → subscription.metadata / customer.metadata
//   ✔  Redis‑basert dedupe 24 h  (NX+EX)
//   ✖  Ingen e‑post‑utsending her – sendes fra /thanks/client.js når bruker klikker
//
//   ENV (prod):
//     STRIPE_SECRET_KEY              sk_live_…
//     STRIPE_WEBHOOK_SECRET_PROD     whsec_…
//     RC_STRIPE_PUBLIC_API_KEY       pub_…
//     REDIS_URL                      rediss://…
// -----------------------------------------------------------------------------

import Stripe from 'stripe';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import { createClient } from 'redis';

export const config = { api: { bodyParser: false }, maxDuration: 30 };

/* ---------- Stripe ---------- */
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-04-10',
});

/* ---------- Redis – single persistent conn ---------- */
const redis =
  process.env.REDIS_URL ? createClient({ url: process.env.REDIS_URL }) : null;
if (redis) redis.connect().catch(() => console.warn('[redis] connect fail'));

/* ---------- Axios global retry ---------- */
axiosRetry(axios, {
  retries: 3,
  retryDelay: (n) => n * 300,
  retryCondition: (e) =>
    e.code === 'ECONNABORTED' ||
    e.response?.status >= 500 ||
    e.response?.status === 429,
});

/* ---------- Interested event types ---------- */
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

  const raw = await getRaw(req);
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      raw,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET_PROD,
    );
  } catch (err) {
    console.error('[wh] bad sig', err.message);
    return res.status(400).end();
  }

  if (!EVENTS.has(event.type)) return res.status(200).end();
  if (await alreadyProcessed(event.id)) return res.status(200).end();

  try {
    /* ---------- 1 · Extract keys ---------- */
    const { appUserId, fetchToken, subId, customerId } =
      await extractRcKeys(event);

    if (!appUserId || !fetchToken) {
      console.warn('[wh] skip – missing userId/token', {
        id: event.id,
        type: event.type,
      });
      await markProcessed(event.id);
      return res.status(200).json({ skipped: true });
    }

    /* ---------- 2 · Parallel tasks ---------- */
    const rcPromise = syncRevenueCat(appUserId, fetchToken);
    const metaPromise = maybeCopyMetadata(event.type, appUserId, subId, customerId);

    const [rcRes, metaRes] = await Promise.allSettled([
      rcPromise,
      metaPromise,
    ]);

    const rcOk = rcRes.status === 'fulfilled';
    const metaOk = metaRes.status === 'fulfilled';

    await markProcessed(event.id);
    res.status(rcOk ? 202 : 200).json({ ok: rcOk, metaOk });

    console.info('[wh] ✅', {
      id: event.id,
      type: event.type,
      rcOk,
      metaOk,
    });
  } catch (err) {
    console.error('[wh] ❌ unhandled', err);
    return res.status(500).end();
  }
}

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

function getRaw(req) {
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

/* ---------- RevenueCat ---------- */
function syncRevenueCat(appUserId, fetchToken) {
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

/* ---------- Copy metadata ---------- */
function maybeCopyMetadata(type, userId, subId, customerId) {
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
  return Promise.all(tasks);
}

/* ---------- Extract keys (incl. sub‑ & customerId) ---------- */
async function extractRcKeys(event) {                               // same logic as previous
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
          ? (
              await stripe.subscriptions.retrieve(subId)
            ).metadata?.app_user_id
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
