export const runtime = 'edge';

import { redis } from '@/lib/redis';
import { INF_UNSUB, infKey } from '@/lib/inf-keys';

export async function POST(req) {
  const url = new URL(req.url);
  const token = url.searchParams.get('token');
  // Webhook token må URL-enkodes i dashboard ( @ → %40  # → %23 )
  if (token !== process.env.WEBHOOK_TOKEN) return new Response('Forbidden', { status: 403 });

  let payload;
  try { payload = await req.json(); } catch { return new Response('Bad JSON', { status: 400 }); }

  const events = Array.isArray(payload) ? payload : [payload];

  for (const ev of events) {
    const type = (ev.type || ev.event || '').toLowerCase();
    const email = (ev.to || ev.email || ev.recipient || ev?.data?.email || '').toLowerCase();
    if (!email) continue;

    const key = infKey(email);

    if (type.includes('bounce')) {
      await redis.hset(key, { status: 'bounced' });
      await redis.sadd(INF_UNSUB, email);
    } else if (type.includes('complaint') || type.includes('spam') || type.includes('unsubscribe')) {
      await redis.hset(key, { status: 'unsubscribed' });
      await redis.sadd(INF_UNSUB, email);
    } else if (type.includes('open')) {
      await redis.hset(key, { openedAt: new Date().toISOString() });
      await redis.hincrby(key, 'opens', 1);
    } else if (type.includes('click')) {
      await redis.hset(key, { clickedAt: new Date().toISOString() });
      await redis.hincrby(key, 'clicks', 1);
    }
  }

  return new Response('OK', { status: 200 });
}
