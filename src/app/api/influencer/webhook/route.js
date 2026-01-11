export const runtime = 'edge';

import { redis } from '@/lib/redis';
import { INF_UNSUB, infKey, nowISO } from '@/lib/inf-keys';

function norm(v) {
  return String(v || '').trim().toLowerCase();
}

function unique(arr) {
  return [...new Set(arr)];
}

/**
 * Resend-format (viktig):
 * - type: "email.bounced" / "email.delivered" / "email.opened" / "email.clicked" ...
 * - recipient(er): ev.data.to (ofte array)
 */
function recipients(ev) {
  const data = ev?.data ?? {};

  const tos = Array.isArray(data.to)
    ? data.to
    : (data.to ? [data.to] : []);

  const out = [
    ...tos,
    ev?.to,
    ev?.email,
    ev?.recipient,
    data?.email,
    data?.recipient,
  ]
    .filter(Boolean)
    .map(norm);

  return unique(out).filter(Boolean);
}

function classify(type) {
  const t = norm(type);

  // Resend canonical-ish
  if (t === 'email.bounced' || t.includes('bounce') || t.includes('suppressed')) return 'bounce';
  if (t === 'email.complained' || t.includes('complaint') || t.includes('spam') || t.includes('unsubscribe')) return 'unsub';
  if (t === 'email.opened' || t.includes('open')) return 'open';
  if (t === 'email.clicked' || t.includes('click')) return 'click';

  return 'ignore';
}

export async function POST(req) {
  const url = new URL(req.url);
  const token = url.searchParams.get('token');

  // Webhook token må URL-enkodes i Resend dashboard ( @ → %40, # → %23 )
  if (token !== process.env.WEBHOOK_TOKEN) {
    return new Response('Forbidden', { status: 403 });
  }

  let payload;
  try {
    payload = await req.json();
  } catch {
    return new Response('Bad JSON', { status: 400 });
  }

  const events = Array.isArray(payload) ? payload : [payload];

  for (const ev of events) {
    const type = ev?.type || ev?.event || '';
    const kind = classify(type);
    if (kind === 'ignore') continue;

    const emails = recipients(ev);
    if (emails.length === 0) continue;

    for (const email of emails) {
      const key = infKey(email);

      if (kind === 'bounce') {
        await redis.hset(key, { status: 'bounced', bouncedAt: nowISO() });
        await redis.sadd(INF_UNSUB, email);
      } else if (kind === 'unsub') {
        await redis.hset(key, { status: 'unsubscribed', unsubscribedAt: nowISO() });
        await redis.sadd(INF_UNSUB, email);
      } else if (kind === 'open') {
        await redis.hset(key, { openedAt: nowISO() });
        await redis.hincrby(key, 'opens', 1);
      } else if (kind === 'click') {
        await redis.hset(key, { clickedAt: nowISO() });
        await redis.hincrby(key, 'clicks', 1);
      }
    }
  }

  return new Response('OK', { status: 200 });
}
