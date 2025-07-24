// -------------------------------------------------------------
// Runs once per day (Vercel Cron) and re‑sends missed Stripe
// events to RevenueCat.  Pulls last 72h to cover weekend outages.
//
// Vercel:  Settings → Functions → Cron
//       * 0 5 * * *   /api/stripe-catchup
// -------------------------------------------------------------
import Stripe from 'stripe';
import { rcSync } from '../../lib/rcSync';      // section B
import { createClient } from 'redis';

export const config = { maxDuration: 300 };

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-04-10',
});
const redis =
  process.env.REDIS_URL ? createClient({ url: process.env.REDIS_URL }) : null;

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const since = Math.floor(Date.now() / 1000) - 60 * 60 * 72; // 72 h
  let hasMore = true,
    startingAfter = null,
    processed = 0,
    resent = 0;

  await redis?.connect();

  while (hasMore) {
    const page = await stripe.events.list({
      created: { gte: since },
      limit: 100,
      starting_after: startingAfter,
      type: 'invoice.paid',
    });

    for (const evt of page.data) {
      if (!(await redis.set(evt.id, 1, { NX: true, EX: 86_400 }))) continue; // already via webhook
      processed++;
      const ok = await rcSync(evt);
      if (ok) resent++;
    }

    hasMore = page.has_more;
    startingAfter = page.data.at(-1)?.id;
  }

  await redis?.disconnect();
  console.log(
    `[catch‑up] processed=${processed} • resent=${resent} • since=${since}`,
  );
  return res.status(200).json({ processed, resent });
}
