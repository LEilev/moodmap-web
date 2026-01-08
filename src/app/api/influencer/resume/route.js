export const runtime = 'edge';

import { redis } from '@/lib/redis';
import { INF_PAUSE } from '@/lib/inf-keys';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');
  if (token !== process.env.CRON_TOKEN) return new Response('Forbidden', { status: 403 });

  await redis.del(INF_PAUSE);
  return new Response(JSON.stringify({ paused: false }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
  });
}
