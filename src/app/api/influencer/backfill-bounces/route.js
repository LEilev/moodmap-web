export const runtime = 'edge';

import { redis } from '@/lib/redis';
import { INF_UNSUB, infKey, nowISO } from '@/lib/inf-keys';

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

function normEmail(v) {
  return String(v || '').trim().toLowerCase();
}

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

export async function POST(req) {
  const url = new URL(req.url);
  if (!cronAuthorized(req, url)) return new Response('Forbidden', { status: 403 });

  let body;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'invalid_json' }, 400);
  }

  const emails = Array.isArray(body)
    ? body
    : (Array.isArray(body?.emails) ? body.emails : []);

  const MAX = 5000;
  if (emails.length > MAX) return json({ error: 'too_many_emails', max: MAX }, 400);

  let updated = 0;
  let skipped = 0;

  for (const it of emails) {
    const email = normEmail(it?.email ?? it);
    if (!email) { skipped++; continue; }

    await redis.sadd(INF_UNSUB, email);
    await redis.hset(infKey(email), { email, status: 'bounced', bouncedAt: nowISO() });
    updated++;
  }

  return json({ ok: true, updated, skipped }, 200);
}
