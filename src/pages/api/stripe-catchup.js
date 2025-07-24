// src/pages/api/stripe-catchup.js
// -------------------------------------------------------------
// Daily cron‑job: re‑sender Stripe‑events de siste 72 timene
// som ikke allerede er prosessert av webhooken.
//
//   Vercel Cron:  0 5 * * *   /api/stripe-catchup
//
// ENV:
//   STRIPE_SECRET_KEY
//   RC_STRIPE_PUBLIC_API_KEY
//   REDIS_URL   rediss://default:<token>@happy-toad-46828.upstash.io:6379
// -------------------------------------------------------------
import Stripe from 'stripe';
import { rcSync } from '../../lib/rcSync';          // gjenbruk helper
import { createClient } from 'redis';

export const config = { maxDuration: 300 };         // 5 min på Vercel

// ---------- Redis -----------------------------------------------------------
function makeRedis(url) {
  if (!url) return null;

  // Upstash krever TLS – sørg for rediss:// eller sett socket.tls = true
  const opts = url.startsWith('rediss://')
    ? { url }
    : { url: url.replace('redis://', 'rediss://'), socket: { tls: true } };

  return createClient(opts);
}

const redis = makeRedis(process.env.REDIS_URL);

// ---------- Stripe ----------------------------------------------------------
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-04-10',
});

// ---------- Handler ---------------------------------------------------------
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
      const page = await stripe.events.list({
        created: { gte: since },
        type: 'invoice.paid',
        limit: 100,
        starting_after: startingAfter,
      });

      for (const evt of page.data) {
        processed++;

        // idempotency via Redis
        const dupe =
          redis && !(await redis.set(evt.id, 1, { NX: true, EX: 86_400 }));
        if (dupe) continue;

        if (await rcSync(evt)) resent++;
      }

      hasMore = page.has_more;
      startingAfter = page.data.at(-1)?.id;
    }

    console.log('[stripe‑catchup] ✅ done', { processed, resent });
    return res.status(200).json({ processed, resent });
  } catch (err) {
    console.error('[stripe‑catchup] ❌ error', err);
    return res.status(500).json({ error: err.message });
  } finally {
    if (redis && redis.isOpen) await redis.disconnect();
  }
}
