export const runtime = 'edge';

import { redis } from '@/lib/redis';
import { INF_QUEUE, INF_DEAD, INF_PAUSE } from '@/lib/inf-keys';

function bearerToken(req) {
  const h = req.headers.get('authorization') || '';
  const m = h.match(/^Bearer\s+(.+)$/i);
  return (m?.[1] || '').trim();
}

/**
 * Auth strategy:
 * - Preferred: Authorization: Bearer <CRON_SECRET>
 * - Legacy fallback (only if CRON_SECRET is not set): ?token=<CRON_TOKEN>
 */
function cronAuthorized(req, url) {
  const cronSecret = (process.env.CRON_SECRET || '').trim();
  if (cronSecret) {
    return bearerToken(req) === cronSecret;
  }

  const token = (url.searchParams.get('token') || '').trim();
  const expected = (process.env.CRON_TOKEN || '').trim();
  return Boolean(token && expected && token === expected);
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}

export async function GET(req) {
  const url = new URL(req.url);
  if (!cronAuthorized(req, url)) return new Response('Forbidden', { status: 403 });

  let queueLen = 0;
  let deadCount = 0;
  let paused = false;

  try { queueLen = await redis.llen(INF_QUEUE); } catch {}
  try { deadCount = await redis.scard(INF_DEAD); } catch {}
  try { paused = Boolean(await redis.get(INF_PAUSE)); } catch {}

  return json({ ok: true, paused, queueLen, deadCount }, 200);
}
