// pages/api/stripe-catchup.js
import Stripe from 'stripe';
import { rcSync } from '../../lib/rcSync';
import { createClient } from 'redis';

export const config = { maxDuration: 300 };            // 5 min

/* ---------- Redis (TLS) ---------- */
function makeRedis(url) {
  if (!url) return null;
  const opts = url.startsWith('rediss://')
    ? { url }
    : { url: url.replace('redis://', 'rediss://'), socket: { tls: true } };
  return createClient(opts);
}
const redis = makeRedis(process.env.REDIS_URL);

/* ---------- Stripe ---------- */
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-04-10',
});

/* ---------- Handler ---------- */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.setHeader('Allow', 'GET').status(405).end('Method Not Allowed');
  }

  const since = Math.floor(Date.now() / 1000) - 60 * 60 * 72; // 72 t
  let hasMore = true;
  let startingAfter = null;
  let processed = 0;
  let resent = 0;

  if (redis) await redis.connect();

  try {
    while (hasMore) {
      /* ⬇️  bygg param‑objekt uten tom streng ----------------------- */
      const params = {
        created: { gte: since },
        type: 'invoice.paid',
        limit: 100,
        ...(startingAfter ? { starting_after: startingAfter } : {}),
      };
      const page = await stripe.events.list(params);
      /* ------------------------------------------------------------- */

      for (const evt of page.data) {
        processed++;
        const skip =
          redis &&
          !(await redis.set(evt.id, 1, { NX: true, EX: 86_400 })); // ett døgn
        if (skip) continue;

        if (await rcSync(evt)) resent++;
      }

      hasMore = page.has_more;
      startingAfter = page.data.at(-1)?.id || null; // kan være undefined
    }

    console.log('[stripe‑catchup] done', { processed, resent });
    return res.status(200).json({ processed, resent });
  } catch (err) {
    console.error('[stripe‑catchup] error', err);
    return res.status(500).json({ error: err.message });
  } finally {
    if (redis?.isOpen) await redis.disconnect();
  }
}
