// pages/api/stripe-webhook.js
// -----------------------------------------------------------------------------
// Stripe ➜ RevenueCat ➜ Resend‑mail (universal‑link)
// -----------------------------------------------------------------------------
//  v4.0.0   •  2025‑08‑05
//  ------------------------------------------
//  ✓ Dedup via Upstash REST  (lib/redis‑dedupe)
//  ✓ RevenueCat‑sync + e‑post kjøres parallelt
//  ✓ Svarer Stripe med HTTP 202 etter RC‑sync
//  ✓ maxDuration 25 s  → ingen 504‑timeouts
//  ✓ Logger mail: started | success | timeout | fail
//
//  ENV  (Vercel):
//    STRIPE_SECRET_KEY
//    STRIPE_WEBHOOK_SECRET_PROD
//    RC_STRIPE_PUBLIC_API_KEY
//    UNIVERSAL_LINK_SECRET
//    RESEND_API_KEY
//    UPSTASH_REDIS_REST_URL
//    UPSTASH_REDIS_REST_TOKEN
// -----------------------------------------------------------------------------

import Stripe from 'stripe';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import { generateHmacSignature } from '../../lib/universal-link';
import { alreadyProcessed, markProcessed } from '../../lib/redis-dedupe';

export const config = { api: { bodyParser: false }, maxDuration: 25 };

/* ---------- Stripe ---------- */
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-04-10',
});

/* ---------- Axios global retry ---------- */
axiosRetry(axios, {
  retries: 3,
  retryDelay: (n) => n * 300, // 0.3 s → 0.6 s → 0.9 s
  retryCondition: (e) =>
    e.code === 'ECONNABORTED' ||
    e.response?.status >= 500 ||
    e.response?.status === 429,
});

/* ---------- Interessante Stripe‑events ---------- */
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

  /* ------------------------------------------------------------ */
  /* 0 · Verifiser webhook‑signatur                               */
  /* ------------------------------------------------------------ */
  const raw = await getRaw(req);
  const sigHeader = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      raw,
      sigHeader,
      process.env.STRIPE_WEBHOOK_SECRET_PROD,
    );
  } catch (err) {
    console.error('[wh] ❌ Bad signature', err.message);
    return res.status(400).end();
  }

  if (!EVENTS.has(event.type)) return res.status(200).end();

  /* ------------------------------------------------------------ */
  /* 1 · Dedup – hopp over hvis eventet allerede er behandlet     */
  /* ------------------------------------------------------------ */
  if (await alreadyProcessed(event.id)) return res.status(200).end();

  try {
    /* ---------------------------------------------------------- */
    /* 2 · Klargjør RC‑ og mail‑promises                          */
    /* ---------------------------------------------------------- */
    const { appUserId, fetchToken } = await rcKeys(event);
    if (!appUserId || !fetchToken)
      throw new Error('Missing appUserId / fetchToken');

    /* --- RevenueCat‑sync (primær) ----------------------------- */
    const rcPromise = axios.post(
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

    /* --- Kvitterings‑mail (kun ved checkout.session.completed) */
    let mailStatus = 'skipped';
    let mailPromise = Promise.resolve();

    if (event.type === 'checkout.session.completed') {
      mailStatus = 'started';
      mailPromise = sendReceiptMail(event, appUserId)
        .then(() => (mailStatus = 'success'))
        .catch((e) => {
          mailStatus = e.name === 'AbortError' ? 'timeout' : 'fail';
          console.warn('[wh] mail', mailStatus, e.message);
        });
    }

    /* ---------------------------------------------------------- */
    /* 3 · Vent KUN på RC‑sync → svar Stripe                       */
    /* ---------------------------------------------------------- */
    await rcPromise;
    await markProcessed(event.id);           // ikke dedup før RC er OK
    res.status(202).json({ ok: true });      // ↩︎ Stripe får raskt svar

    /* ---------------------------------------------------------- */
    /* 4 · La mailPromise fullføre (maks 6 s)                      */
    /* ---------------------------------------------------------- */
    await Promise.allSettled([mailPromise]);
    console.info('[wh] ✅', {
      id: event.id,
      type: event.type,
      mailStatus,
    });
  } catch (err) {
    console.error('[wh] ❌', err);
    // Stripe vil retry’e på 5xx, så vi markerer IKKE som ferdig her
    return res.status(500).end();
  }
}

/* -------------------------------------------------------------------------- */
/* H E L P E R S                                                              */
/* -------------------------------------------------------------------------- */

/** Les rå body‑bytes (bodyParser er av) */
function getRaw(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req
      .on('data', (c) => chunks.push(c))
      .on('end', () => resolve(Buffer.concat(chunks)))
      .on('error', reject);
  });
}

/** Finn appUserId + fetchToken for alle relevante event‑typer */
async function rcKeys(event) {
  switch (event.type) {
    /* Checkout – hovedflowen */
    case 'checkout.session.completed': {
      const cs = event.data.object;
      return {
        appUserId: cs.client_reference_id || cs.metadata?.app_user_id,
        fetchToken: cs.id,
      };
    }

    /* Subs opprettes / slettes av Stripe Billing */
    case 'customer.subscription.created':
    case 'customer.subscription.deleted': {
      const sub = event.data.object;
      return {
        appUserId:
          sub.metadata?.app_user_id || sub.metadata?.client_reference_id,
        fetchToken: sub.id,
      };
    }

    /* Invoices dekker renewals, upgrades, trial‑end osv. */
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

    /* Refund – trenger å fjerne entitlement */
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

/** Send universal‑link‑e‑post med 6 s AbortController‑timeout */
async function sendReceiptMail(event, userId) {
  const cs = event.data.object;
  const email = cs.customer_details?.email;
  if (!email) return;

  const exp = Math.floor(Date.now() / 1000) + 600; // 10 min TTL
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
