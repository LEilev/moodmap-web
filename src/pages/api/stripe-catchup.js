// pages/api/stripe-catchup.js
// Backfill Stripe -> RevenueCat for recent successful subscription invoices.
// Fixes previous bug where rcSync was called with the whole Stripe event.
// - Scans Stripe events (invoice.paid) for the last N hours
// - Extracts subscription id (fetchToken) + app_user_id (appUserId)
// - Calls rcSync({ appUserId, fetchToken }) to grant/refresh "pro" entitlement
//
// Query params:
//   ?hours=72        Lookback window (default 72, max 720)
//   ?force=1         Ignore dedupe and re-run rcSync even if event was previously processed
//   ?token=...       Optional auth token if STRIPE_CATCHUP_TOKEN is set (also supports Authorization: Bearer)
//
// Notes:
// - Prefers subscription metadata.app_user_id (stable). If missing, hashes email (trim+lower) with sha256.
// - Best-effort: will NOT mutate Stripe metadata (keeps catchup non-invasive).
// - Intended for operational recovery after webhook downtime or RevenueCat mapping changes.

import Stripe from 'stripe';
import { createHash } from 'crypto';
import { rcSync } from '../../lib/rcSync';
import { isDuplicate } from '../../lib/dedupe';

export const config = { maxDuration: 300 }; // 5 min timeout (Vercel/Next)

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-04-10',
});

const clampInt = (v, min, max, fallback) => {
  const n = Number.parseInt(String(v ?? ''), 10);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
};

const normalizeEmail = (email) =>
  typeof email === 'string' ? email.trim().toLowerCase() : '';

const sha256Hex = (s) => createHash('sha256').update(String(s)).digest('hex');

const getMeta = (obj, keys) => {
  const md = obj?.metadata;
  if (!md || typeof md !== 'object') return '';
  for (const k of keys) {
    const v = md?.[k];
    if (typeof v === 'string' && v.trim()) return v.trim();
  }
  return '';
};

async function getSubscriptionCached(stripeClient, subscriptionId, cache) {
  if (!subscriptionId) return null;
  if (cache.has(subscriptionId)) return cache.get(subscriptionId);
  const sub = await stripeClient.subscriptions.retrieve(subscriptionId, {
    expand: ['customer'],
  });
  cache.set(subscriptionId, sub);
  return sub;
}

async function getCustomerCached(stripeClient, customerId, cache) {
  if (!customerId) return null;
  if (cache.has(customerId)) return cache.get(customerId);
  const cust = await stripeClient.customers.retrieve(customerId);
  cache.set(customerId, cust);
  return cust;
}

function requireAuthIfConfigured(req) {
  const required =
    process.env.STRIPE_CATCHUP_TOKEN ||
    process.env.CATCHUP_TOKEN ||
    process.env.CRON_SECRET;

  if (!required) return { ok: true };

  const qToken = typeof req.query?.token === 'string' ? req.query.token : '';
  const auth = typeof req.headers?.authorization === 'string' ? req.headers.authorization : '';
  const bearer = auth.startsWith('Bearer ') ? auth.slice('Bearer '.length).trim() : '';

  const provided = qToken || bearer;
  if (!provided || provided !== required) return { ok: false };
  return { ok: true };
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end('Method Not Allowed');
  }

  // Optional auth gate
  const auth = requireAuthIfConfigured(req);
  if (!auth.ok) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: 'Missing STRIPE_SECRET_KEY' });
  }

  // Params
  const hours = clampInt(req.query?.hours, 1, 720, 72); // default 72h, max 30d
  const force = String(req.query?.force ?? '') === '1';

  const since = Math.floor(Date.now() / 1000) - 60 * 60 * hours;

  // Stats
  let processedEvents = 0;
  let skippedDuplicates = 0;
  let skippedNonInvoice = 0;
  let skippedNoSubscription = 0;
  let skippedNoUserId = 0;
  let attempted = 0;
  let synced = 0;
  let failed = 0;

  // Caches (reduce Stripe API calls)
  const subCache = new Map();
  const custCache = new Map();

  try {
    let hasMore = true;
    let startingAfter = null;

    while (hasMore) {
      const params = {
        created: { gte: since },
        type: 'invoice.paid',
        limit: 100,
        ...(startingAfter ? { starting_after: startingAfter } : {}),
      };

      const page = await stripe.events.list(params);

      for (const evt of page.data) {
        processedEvents++;

        // Respect dedupe unless force=1
        if (!force) {
          const dup = await isDuplicate(evt.id);
          if (dup) {
            skippedDuplicates++;
            continue;
          }
        }

        // Stripe event payload
        const invoice = evt?.data?.object;

        if (!invoice || invoice.object !== 'invoice') {
          skippedNonInvoice++;
          continue;
        }

        // Only subscription invoices matter for RevenueCat stripe receipts
        const subscriptionId =
          typeof invoice.subscription === 'string'
            ? invoice.subscription
            : (invoice.subscription?.id ?? '');

        if (!subscriptionId) {
          skippedNoSubscription++;
          continue;
        }

        let appUserId = '';

        // Prefer app_user_id already stored on Stripe objects (most stable)
        try {
          const sub = await getSubscriptionCached(stripe, subscriptionId, subCache);

          appUserId =
            getMeta(sub, ['app_user_id', 'appUserId', 'app_userid']) ||
            getMeta(invoice, ['app_user_id', 'appUserId', 'app_userid']);

          // If still missing, compute from email (customer > invoice.customer_email)
          if (!appUserId) {
            let email = '';

            // Expanded customer from subscription.retrieve(expand: ['customer'])
            if (sub?.customer && typeof sub.customer === 'object') {
              email = normalizeEmail(sub.customer.email);
            }

            // If not expanded or missing, fetch customer by id
            if (!email) {
              const custId =
                typeof sub?.customer === 'string'
                  ? sub.customer
                  : (typeof invoice.customer === 'string' ? invoice.customer : '');

              if (custId) {
                const cust = await getCustomerCached(stripe, custId, custCache);
                email = normalizeEmail(cust?.email);
              }
            }

            // Fallback: invoice.customer_email sometimes present
            if (!email) {
              email = normalizeEmail(invoice.customer_email);
            }

            if (email) {
              appUserId = sha256Hex(email);
            }
          }
        } catch (e) {
          // If we can't resolve subscriber identity, skip safely
          console.warn('[stripe-catchup] ⚠️ resolve appUserId failed', {
            event: evt?.id,
            subscriptionId,
            msg: e?.message || String(e),
          });
        }

        if (!appUserId) {
          skippedNoUserId++;
          continue;
        }

        attempted++;

        // The actual fix: call rcSync with the expected shape
        try {
          const ok = await rcSync({ appUserId, fetchToken: subscriptionId });
          if (ok) synced++;
          else failed++;
        } catch (e) {
          failed++;
          console.error('[stripe-catchup] ❌ rcSync threw', {
            event: evt?.id,
            subscriptionId,
            msg: e?.message || String(e),
          });
        }
      }

      hasMore = page.has_more;
      startingAfter = page.data.length ? page.data[page.data.length - 1].id : null;
    }

    console.log('[stripe-catchup] ✅ done', {
      hours,
      force,
      processedEvents,
      skippedDuplicates,
      skippedNonInvoice,
      skippedNoSubscription,
      skippedNoUserId,
      attempted,
      synced,
      failed,
    });

    return res.status(200).json({
      ok: true,
      hours,
      force,
      processedEvents,
      skippedDuplicates,
      skippedNonInvoice,
      skippedNoSubscription,
      skippedNoUserId,
      attempted,
      synced,
      failed,
    });
  } catch (err) {
    console.error('[stripe-catchup] ❌ fatal error', err);
    return res.status(500).json({ ok: false, error: err?.message || String(err) });
  }
}
