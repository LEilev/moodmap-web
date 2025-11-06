// Harmony Patch 2 — partner-unlink: also purge ecology:<pairId> and challenges:<pairId>:*
// Keeps RL, blocklist and existing semantics intact.
export const runtime = 'edge';

import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

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
    const windowId = Math.floor(Date.now() / (windowSec * 1000));
    const k = `${key}:${windowId}`;
    const count = await redis.incr(k);
    if (count === 1) {
      await redis.expire(k, windowSec);
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

/** Edge-safe purge: delete state:<pairId>, ecology:<pairId>, feedback:<pairId>:* and challenges:<pairId>:* via SCAN + pipeline. */
async function purgePairData(pairId) {
  try {
    const stateKey = `state:${pairId}`;
    const ecologyKey = `ecology:${pairId}`;
    const toDelete = [stateKey, ecologyKey];

    // feedback keys
    try {
      let cursor = 0;
      const match = `feedback:${pairId}:*`;
      do {
        const res = await redis.scan(cursor, { match, count: 100 });
        const nextCursor = Number(res?.[0] || 0);
        const keys = res?.[1] || [];
        for (const k of keys) toDelete.push(k);
        cursor = nextCursor;
      } while (cursor !== 0);
    } catch (e) {
      console.warn('[unlink] scan feedback error:', e?.message || e);
    }

    // challenges keys
    try {
      let cursor = 0;
      const matchCh = `challenges:${pairId}:*`;
      do {
        const res = await redis.scan(cursor, { match: matchCh, count: 100 });
        const nextCursor = Number(res?.[0] || 0);
        const keys = res?.[1] || [];
        for (const k of keys) toDelete.push(k);
        cursor = nextCursor;
      } while (cursor !== 0);
    } catch (e) {
      console.warn('[unlink] scan challenges error:', e?.message || e);
    }

    if (toDelete.length > 0) {
      const pipe = redis.pipeline();
      for (const k of toDelete) pipe.del(k);
      await pipe.exec();
    }
  } catch (err) {
    console.warn('[unlink] purgePairData error:', err?.message || err);
  }
}

/**
 * POST /api/partner-unlink
 * Body: { pairId }
 * Effects: SET blocklist:<pairId> "1" EX 300 (symmetrisk unlink) + purge state/feedback/ecology/challenges
 * Success: { ok: true }
 * Errors: 400 invalid pairId, 429 RL
 */
export async function POST(req) {
  try {
    let body = {};
    try { body = await req.json(); } catch {}
    const pairId = String(body?.pairId || '').trim();
    if (!pairId) {
      return json({ ok: false, error: 'Missing pairId' }, 400);
    }

    // RL: per IP + per pair
    const RL_IP_LIMIT_PER_MIN = 30;
    const RL_PAIR_LIMIT_PER_MIN = 12;
    const RL_WINDOW_SEC = 60;

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

    // Symmetric blocklist marker (prevents transient reconnect)
    const BLOCKLIST_TTL_SEC = 300;
    await redis.set(`blocklist:${pairId}`, '1', { ex: BLOCKLIST_TTL_SEC });

    // Purge server-side state for this pair (best effort)
    await purgePairData(pairId);

    return json({ ok: true }, 200);
  } catch (err) {
    console.error('[partner-unlink][POST] error:', err?.message || err);
    return json({ ok: false, error: 'Internal error' }, 500);
  }
}
