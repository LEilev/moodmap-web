// src/app/api/partner-sync/route.js
export const runtime = 'edge';

import { redis, setNX, expire } from '@/lib/redis.js';

const CODE_TTL_SEC = 600;            // 10 minutes
const RL_LIMIT_PER_MIN = 5;          // ≤ 5 / minute / IP
const RL_WINDOW_SEC = 60;
const CODE_LEN = 12;                 // 10–12 allowed; use 12 for stronger entropy
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // unambiguous Base32 (no I, O, 0, 1)

/**
 * JSON response helper with proper headers.
 */
function json(body, status = 200, extra = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store, max-age=0',
      ...extra
    }
  });
}

/**
 * Extract client IP from request headers (best-effort).
 * X-Forwarded-For may contain a list; take the first hop.
 */
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

/**
 * Per-IP fixed-window rate limit using Redis INCR + EXPIRE.
 * Returns { allowed: boolean, retryAfter: number }
 */
async function limitByIP(ip, limit = RL_LIMIT_PER_MIN, windowSec = RL_WINDOW_SEC) {
  try {
    if (!redis) {
      // If Redis is not configured, fail open (allow) to avoid false 429s.
      return { allowed: true, retryAfter: 0 };
    }
    const windowId = Math.floor(Date.now() / (windowSec * 1000));
    const key = `rl:partner-sync:ip:${ip}:${windowId}`;

    const count = await redis.incr(key);
    if (count === 1) {
      // First hit in this window: set TTL
      await expire(key, windowSec);
    }

    if (count > limit) {
      const ttl = await redis.ttl(key);
      return { allowed: false, retryAfter: Math.max(1, ttl ?? windowSec) };
    }
    return { allowed: true, retryAfter: 0 };
  } catch (err) {
    // On error, fail open but log for observability
    console.error('[partner-sync][limitByIP] error:', err?.message || err);
    return { allowed: true, retryAfter: 0 };
  }
}

/**
 * Generate a cryptographically-strong pairing code of given length.
 * Uses an unambiguous Base32 alphabet. (256 % 32 == 0 → no modulo bias with & 31)
 */
function generateCode(len = CODE_LEN) {
  const bytes = new Uint8Array(len);
  crypto.getRandomValues(bytes);
  let out = '';
  for (let i = 0; i < bytes.length; i++) {
    out += ALPHABET[bytes[i] & 31];
  }
  return out;
}

/**
 * POST /api/partner-sync
 * Response: { ok: true, code, expiresInSec: 600 }
 */
export async function POST(req) {
  try {
    // Rate limit by IP
    const ip = getClientIP(req);
    const rl = await limitByIP(ip, RL_LIMIT_PER_MIN, RL_WINDOW_SEC);
    if (!rl.allowed) {
      return json({ ok: false, error: 'Rate limit exceeded' }, 429, {
        'Retry-After': String(rl.retryAfter)
      });
    }

    // Ensure Redis client exists
    if (!redis) {
      return json({ ok: false, error: 'Service unavailable (Redis not configured)' }, 503);
    }

    // Allocate pairing code with SETNX (retry on rare collisions)
    const pairId = crypto.randomUUID();
    let code = '';
    let acquired = false;
    for (let attempt = 0; attempt < 5 && !acquired; attempt++) {
      code = generateCode(CODE_LEN);
      acquired = await setNX(`pairCode:${code}`, pairId, CODE_TTL_SEC);
    }
    if (!acquired) {
      console.error('[partner-sync] Failed to allocate code for pairId', pairId);
      return json({ ok: false, error: 'Could not allocate pairing code' }, 500);
    }

    console.log('[partner-sync] Allocated pairId', pairId, 'with code', code);
    return json({ ok: true, code, expiresInSec: CODE_TTL_SEC }, 200);
  } catch (err) {
    console.error('[partner-sync][POST] error:', err?.message || err);
    return json({ ok: false, error: 'Internal error' }, 500);
  }
}
