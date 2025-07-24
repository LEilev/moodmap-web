// pages/api/stripe-catchup.js
import Stripe from 'stripe';
import { rcSync } from '../../lib/rcSync';
import { isDuplicate } from '../../lib/dedupe';

export const config = { maxDuration: 300 }; // 5 min timeout

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-04-10',
});

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end('Method Not Allowed');
  }

  const since = Math.floor(Date.now() / 1000) - 60 * 60 * 72; // siste 72 timer
  let hasMore = true;
  let startingAfter = null;
  let processed = 0;
  let resent = 0;

  try {
    while (hasMore) {
      const params = {
        created: { gte: since },
        type: 'invoice.paid',
        limit: 100,
        ...(startingAfter ? { starting_after: startingAfter } : {}),
      };

      const page = await stripe.events.list(params);

      for (const evt of page.data) {
        processed++;
        if (await isDuplicate(evt.id)) continue;

        if (await rcSync(evt)) resent++;
      }

      hasMore = page.has_more;
      startingAfter = page.data.at(-1)?.id || null;
    }

    console.log('[stripe-catchup] ✅ done', { processed, resent });
    return res.status(200).json({ processed, resent });
  } catch (err) {
    console.error('[stripe-catchup] ❌ error', err);
    return res.status(500).json({ error: err.message });
  }
}
