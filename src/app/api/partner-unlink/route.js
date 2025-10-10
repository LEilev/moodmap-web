// src/app/api/partner-unlink/route.js
export const runtime = 'edge';

import { redis, expire } from '@/lib/redis.js';

const UUID_REGEX =
  /^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}$/;

const RL_IP_LIMIT_PER_MIN = 30;
const RL_PAIR_LIMIT_PER_MIN = 12;
const RL_WINDOW_SEC = 60;
const BLOCKLIST_TTL_SEC = 2 * 24 * 60 * 60; // 172800 (48h)

/** JSON response helper */
function json(body, status = 200, extra = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store, private, max-age=0',
      ...extra,
    },
  });
}

function getClientIP(req) {
  const h = req.headers;
  const xff = h.get('x-forwarded-for');
  if (xff) {
    const first = xff.split(',')[0].trim();
    if (first) return first;
  }
  return (
    h.get('x-real-ip') ||
    h.get('cf-connecting-ip') ||
    h.get('x-client-ip') ||
    '0.0.0.0'
  );
}

/** Fixed-window RL using Redis INCR + EXPIRE. Fail-open on errors. */
async function limitByKey(key, limit, windowSec) {
  try {
    if (!redis) return { allowed: true, retryAfter: 0 };
    const windowId = Math.floor(Date.now() / (windowSec * 1000));
    const k = `${key}:${windowId}`;
    const count = await redis.incr(k);
    if (count === 1) {
      await expire(k, windowSec);
    }
    if (count > limit) {
      const ttl = await redis.ttl(k);
      return { allowed: false, retryAfter: Math.max(1, ttl ?? windowSec) };
    }
    return { allowed: true, retryAfter: 0 };
  } catch (err) {
    console.error('[unlink][limitByKey] error:', err?.message || err);
    return { allowed: true, retryAfter: 0 };
  }
}

/**
 * POST /api/partner-unlink
 * Body: { pairId }
 * Effects: SET blocklist:<pairId> "1" EX 172800
 * Success: { ok: true }
 * Errors: 400 invalid pairId, 429 RL, 503 service unavailable
 */
export async function POST(req) {
  try {
    if (!redis) {
      return json({ ok: false, error: 'Service unavailable (Redis not configured)' }, 503);
    }

    // Parse body
    let body;
    try {
      body = await req.json();
    } catch {
      return json({ ok: false, error: 'Invalid JSON' }, 400);
    }

    const pairId = (body?.pairId || '').trim();
    if (!UUID_REGEX.test(pairId)) {
      return json({ ok: false, error: 'Invalid or missing pairId' }, 400);
    }

    // RL: per IP + per pair
    const ip = getClientIP(req);
    const ipRL = await limitByKey(`rl:partner-unlink:ip:${ip}`, RL_IP_LIMIT_PER_MIN, RL_WINDOW_SEC);
    if (!ipRL.allowed) {
      return json({ ok: false, error: 'Rate limit exceeded' }, 429, {
        'Retry-After': String(ipRL.retryAfter ?? RL_WINDOW_SEC),
      });
    }

    const pairRL = await limitByKey(`rl:partner-unlink:pair:${pairId}`, RL_PAIR_LIMIT_PER_MIN, RL_WINDOW_SEC);
    if (!pairRL.allowed) {
      return json({ ok: false, error: 'Rate limit exceeded' }, 429, {
        'Retry-After': String(pairRL.retryAfter ?? RL_WINDOW_SEC),
      });
    }

    // Blocklist: set (overwrites/refreshes TTL)
    await redis.set(`blocklist:${pairId}`, '1', { ex: BLOCKLIST_TTL_SEC });

    console.log('[unlink] Blocklisted pairId', pairId, 'for', BLOCKLIST_TTL_SEC, 'sec');
    return json({ ok: true }, 200);
  } catch (err) {
    console.error('[partner-unlink][POST] error:', err?.message || err);
    return json({ ok: false, error: 'Internal error' }, 500);
  }
}
