// src/app/api/partner-connect/route.js
export const runtime = 'edge';

import { getdel, redis } from '@/lib/redis.js';
import * as RL from '@/lib/ratelimit.js';

const RL_IP_LIMIT_PER_MIN = 30;   // ≤ 30 / minute / IP
const RL_CODE_LIMIT_PER_MIN = 10; // ≤ 10 / minute / code
const RL_WINDOW_SEC = 60;

// Unambiguous Base32 (no I, O, 0, 1), length 10–12
const CODE_REGEX = /^[A-HJ-NP-Z2-9]{10,12}$/;

/** JSON response helper */
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

async function fallbackLimitByKey(key, limit, windowSec) {
  try {
    if (!redis) return { allowed: true, retryAfter: 0 };
    const windowId = Math.floor(Date.now() / (windowSec * 1000));
    const k = `${key}:${windowId}`;
    const count = await redis.incr(k);
    if (count === 1) await redis.expire(k, windowSec);
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

async function rateLimitIP(ip, limit, windowSec) {
  if (typeof RL.limitByIP === 'function') {
    try { return await RL.limitByIP(ip, limit, windowSec); }
    catch (e) { console.error('[partner-connect][limitByIP helper] error:', e?.message || e); }
  }
  return fallbackLimitByKey(`rl:partner-connect:ip:${ip}`, limit, windowSec);
}

async function rateLimitCode(code, limit, windowSec) {
  if (typeof RL.limitByKey === 'function') {
    try { return await RL.limitByKey(`rl:partner-connect:code:${code}`, limit, windowSec); }
    catch (e) { console.error('[partner-connect][limitByKey helper] error:', e?.message || e); }
  }
  return fallbackLimitByKey(`rl:partner-connect:code:${code}`, limit, windowSec);
}

/**
 * POST /api/partner-connect
 * Body: { code }
 * Success: { ok: true, pairId }
 */
export async function POST(req) {
  try {
    const ip = getClientIP(req);
    const ipRL = await rateLimitIP(ip, RL_IP_LIMIT_PER_MIN, RL_WINDOW_SEC);
    if (ipRL && ipRL.allowed === false) {
      return json({ ok: false, error: 'Rate limit exceeded' }, 429, {
        'Retry-After': String(ipRL.retryAfter ?? RL_WINDOW_SEC)
      });
    }

    let body;
    try { body = await req.json(); }
    catch { return json({ ok: false, error: 'Invalid JSON' }, 400); }

    const rawCode = (body && typeof body.code === 'string') ? body.code.trim().toUpperCase() : '';
    if (!CODE_REGEX.test(rawCode)) {
      return json({ ok: false, error: 'Invalid code format' }, 400);
    }

    const codeRL = await rateLimitCode(rawCode, RL_CODE_LIMIT_PER_MIN, RL_WINDOW_SEC);
    if (codeRL && codeRL.allowed === false) {
      return json({ ok: false, error: 'Too many attempts for this code' }, 429, {
        'Retry-After': String(codeRL.retryAfter ?? RL_WINDOW_SEC)
      });
    }

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

    // NEW: allow HIM to discover pairId by polling /partner-sync/status
    try {
      const revKey = `pairIdByCode:${rawCode}`;
      await redis.set(revKey, pairId);
      await redis.expire(revKey, 60); // short TTL is enough for the polling window
    } catch (e) {
      console.warn('[partner-connect] Warning: could not set pairIdByCode:', e);
    }

    console.log('[partner-connect] Code', rawCode, 'consumed -> pairId', pairId);
    return json({ ok: true, pairId }, 200);
  } catch (err) {
    console.error('[partner-connect][POST] error:', err?.message || err);
    return json({ ok: false, error: 'Internal error' }, 500);
  }
}
