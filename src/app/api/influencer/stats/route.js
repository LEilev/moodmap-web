export const runtime = 'edge';

import { redis } from '@/lib/redis';

export async function GET(req) {
  const url = new URL(req.url);
  const token = url.searchParams.get('token');
  if (token !== process.env.CRON_TOKEN) return new Response('Forbidden', { status: 403 });

  const keys = await redis.keys('inf:*');
  let counts = { total: 0, queued: 0, sent: 0, unsubscribed: 0, bounced: 0, opened: 0, clicked: 0 };
  for (const k of keys) {
    if (!k.startsWith('inf:')) continue;
    const h = await redis.hgetall(k);
    if (!h) continue;
    counts.total++;
    const st = h.status || 'queued';
    if (counts[st] !== undefined) counts[st]++;
    if (h.openedAt) counts.opened++;
    if (h.clickedAt) counts.clicked++;
  }
  const queueLen = await redis.llen('inf:queue');
  return new Response(JSON.stringify({ counts, queueLen }), { status: 200 });
}
