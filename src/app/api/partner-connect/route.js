// src/app/api/partner-connect/route.js
export const runtime = 'edge';

import { getdel, redis } from '@/lib/redis.js';
import * as RL from '@/lib/ratelimit.js';

const RL_IP_LIMIT_PER_MIN = 30;   // ≤ 30 / minute / IP
const RL_CODE_LIMIT_PER_MIN = 10; // ≤ 10 / minute / code
const RL_WINDOW_SEC = 60;

// Unambiguous Base32 (no I, O, 0, 1), length 10–12
const CODE_REGEX = /^[A-HJ-NP-Z2-9]{10,12}$/;

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
 * Fallback fixed-window rate limit using Redis INCR + EXPIRE.
 * Returns { allowed: boolean, retryAfter: number }
 */
async function fallbackLimitByKey(key, limit, windowSec) {
  try {
    if (!redis) return { allowed: true, retryAfter: 0 }; // fail open if no Redis
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
    console.error('[partner-connect][fallbackLimitByKey] error:', err?.message || err);
    return { allowed: true, retryAfter: 0 };
  }
}

/**
 * Wrapper: prefer RL.limitByIP / RL.limitByKey if available; otherwise fallback.
 */
async function rateLimitIP(ip, limit, windowSec) {
  if (typeof RL.limitByIP === 'function') {
    try {
      return await RL.limitByIP(ip, limit, windowSec);
    } catch (e) {
      console.error('[partner-connect][limitByIP helper] error:', e?.message || e);
    }
  }
  return fallbackLimitByKey(`rl:partner-connect:ip:${ip}`, limit, windowSec);
}

async function rateLimitCode(code, limit, windowSec) {
  if (typeof RL.limitByKey === 'function') {
    try {
      // Pass a stable key string to helper
      return await RL.limitByKey(`rl:partner-connect:code:${code}`, limit, windowSec);
    } catch (e) {
      console.error('[partner-connect][limitByKey helper] error:', e?.message || e);
    }
  }
  return fallbackLimitByKey(`rl:partner-connect:code:${code}`, limit, windowSec);
}

/**
 * POST /api/partner-connect
 * Body: { code }
 * Success: { ok: true, pairId }
 * Failure: 400 { ok: false, error: "Invalid or expired code" } | 429 with Retry-After
 */
export async function POST(req) {
  try {
    // Rate limit by IP
    const ip = getClientIP(req);
    const ipRL = await rateLimitIP(ip, RL_IP_LIMIT_PER_MIN, RL_WINDOW_SEC);
    if (ipRL && ipRL.allowed === false) {
      return json({ ok: false, error: 'Rate limit exceeded' }, 429, {
        'Retry-After': String(ipRL.retryAfter ?? RL_WINDOW_SEC)
      });
    }

    // Parse and validate body
    let body;
    try {
      body = await req.json();
    } catch {
      return json({ ok: false, error: 'Invalid JSON' }, 400);
    }
    const rawCode = (body && typeof body.code === 'string') ? body.code.trim().toUpperCase() : '';
    if (!CODE_REGEX.test(rawCode)) {
      return json({ ok: false, error: 'Invalid code format' }, 400);
    }

    // Rate limit by code (to prevent brute force)
    const codeRL = await rateLimitCode(rawCode, RL_CODE_LIMIT_PER_MIN, RL_WINDOW_SEC);
    if (codeRL && codeRL.allowed === false) {
      return json({ ok: false, error: 'Too many attempts for this code' }, 429, {
        'Retry-After': String(codeRL.retryAfter ?? RL_WINDOW_SEC)
      });
    }

    // Ensure Redis is configured
    if (!redis) {
      return json({ ok: false, error: 'Service unavailable (Redis not configured)' }, 503);
    }

    // Atomically consume the pairing code
    const pairId = await getdel(`pairCode:${rawCode}`);
    if (!pairId) {
      console.log('[partner-connect] Invalid or expired code:', rawCode);
      return json({ ok: false, error: 'Invalid or expired code' }, 400);
    }

    // Initialize state for the pair session
    await redis.hset(`state:${pairId}`, { version: '0' });
    await redis.expire(`state:${pairId}`, 30 * 60 * 60);

    console.log('[partner-connect] Code', rawCode, 'consumed -> pairId', pairId);
    return json({ ok: true, pairId }, 200);
  } catch (err) {
    console.error('[partner-connect][POST] error:', err?.message || err);
    return json({ ok: false, error: 'Internal error' }, 500);
  }
}
