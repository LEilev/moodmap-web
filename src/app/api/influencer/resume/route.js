export const runtime = 'edge';

import { redis } from '@/lib/redis';
import { INF_PAUSE } from '@/lib/inf-keys';

function bearerToken(req) {
  const h = req.headers.get('authorization') || '';
  const m = h.match(/^Bearer\s+(.+)$/i);
  return (m?.[1] || '').trim();
}

function cronAuthorized(req, url) {
  const cronSecret = (process.env.CRON_SECRET || '').trim();
  if (cronSecret) {
    return bearerToken(req) === cronSecret;
  }
  const token = (url.searchParams.get('token') || '').trim();
  const expected = (process.env.CRON_TOKEN || '').trim();
  return Boolean(token && expected && token === expected);
}

export async function GET(req) {
  const url = new URL(req.url);
  if (!cronAuthorized(req, url)) return new Response('Forbidden', { status: 403 });

  await redis.del(INF_PAUSE);
  return new Response(JSON.stringify({ paused: false }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
  });
}
