export const runtime = 'edge';

import { redis } from '@/lib/redis';
import { INF_QUEUE, INF_UNSUB, infKey, nowISO } from '@/lib/inf-keys';

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
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

  // Accept either:
  // - an array
  // - an object with .contacts array
  // - an object with .contacts single item
  // - a single item
  const items = Array.isArray(body)
    ? body
    : (Array.isArray(body?.contacts)
        ? body.contacts
        : (body?.contacts ? [body.contacts] : [body]));

  const MAX = 500;
  if (items.length > MAX) return json({ error: 'too_many_contacts', max: MAX }, 400);

  let added = 0, skipped = 0, unsub = 0;

  try {
    for (const it of items) {
      const email = normEmail(it?.email ?? it);
      if (!email) { skipped++; continue; }

      const isUnsub = await redis.sismember(INF_UNSUB, email);
      if (isUnsub) { unsub++; continue; }

      const key = infKey(email);
      const exists = await redis.exists(key);
      if (exists) { skipped++; continue; }

      await redis.hset(key, {
        email,
        name: (it?.name ?? '').toString(),
        handle: (it?.handle ?? '').toString(),
        followers: Number(it?.followers ?? 0) || 0,

        status: 'queued',
        attempts: 0,

        createdAt: nowISO(),
        processingAt: '',
        lastError: '',

        lastSent: '',
        followupsSent: 0,

        openedAt: '',
        clickedAt: '',
        opens: 0,
        clicks: 0,
      });

      await redis.rpush(INF_QUEUE, email);
      added++;
    }

    return json({ added, skipped, unsub }, 200);
  } catch (e) {
    return json({ error: 'enqueue_failed', message: String(e?.message ?? e) }, 500);
  }
}
