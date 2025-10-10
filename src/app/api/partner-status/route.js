// src/app/api/partner-status/route.js
export const runtime = 'edge';

import { redis, expire } from '@/lib/redis.js';
import * as RL from '@/lib/ratelimit.js';

const RL_PAIR_LIMIT_PER_MIN = 60;
const RL_WINDOW_SEC = 60;
const UUID_REGEX = /^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}$/;

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
 * Fixed-window rate limit (fallback) using Redis INCR + EXPIRE.
 * Returns { allowed: boolean, retryAfter: number }
 */
async function fallbackLimitByKey(key, limit, windowSec) {
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
    console.error('[partner-status][fallbackLimitByKey] error:', err?.message || err);
    return { allowed: true, retryAfter: 0 };
  }
}

/**
 * Wrapper: use RL.limitByKey if available; otherwise fallback.
 */
async function rateLimitPair(pairId, limit, windowSec) {
  const key = `rl:partner-status:pair:${pairId}`;
  if (typeof RL.limitByKey === 'function') {
    try {
      return await RL.limitByKey(key, limit, windowSec);
    } catch (e) {
      console.error('[partner-status][limitByKey helper] error:', e?.message || e);
    }
  }
  return fallbackLimitByKey(key, limit, windowSec);
}

/**
 * GET /api/partner-status?pairId=<uuid>
 * Returns the latest feedback status for the pair.
 * Success: { ok: true, currentDate, version, lastUpdated, vibe, readiness, tips[] } (version=0 if none)
 */
export async function GET(req) {
  try {
    // Parse query parameter
    const { searchParams } = new URL(req.url);
    const pairId = searchParams.get('pairId')?.trim() || '';
    if (!pairId || !UUID_REGEX.test(pairId)) {
      return json({ ok: false, error: 'Invalid or missing pairId' }, 400);
    }

    // Rate limit by pair
    const rl = await rateLimitPair(pairId, RL_PAIR_LIMIT_PER_MIN, RL_WINDOW_SEC);
    if (rl && rl.allowed === false) {
      console.warn('[partner-status] Rate limit exceeded for pairId', pairId);
      return json({ ok: false, error: 'Rate limit exceeded' }, 429, {
        'Retry-After': String(rl.retryAfter ?? RL_WINDOW_SEC)
      });
    }

    // Ensure Redis is configured
    if (!redis) {
      return json({ ok: false, error: 'Service unavailable (Redis not configured)' }, 503);
    }

    // Blocklist check
    const blocked = await redis.get(`blocklist:${pairId}`);
    if (blocked) {
      console.log('[partner-status] Blocked pairId', pairId, '- access denied');
      return json({ ok: false, error: 'Partner disconnected' }, 403);
    }

    const stateKey = `state:${pairId}`;
    const state = await redis.hgetall(stateKey);
    if (!state || !state.version || state.version === '0') {
      console.log('[partner-status] No feedback for pairId', pairId);
      return json({ ok: true, version: 0 }, 200);
    }

    const currentDate = state.currentDate;
    const version = state.version != null ? Number(state.version) : 0;
    const lastUpdated = state.lastUpdated || '';
    const feedbackKey = `feedback:${pairId}:${currentDate}`;

    const feedback = await redis.hgetall(feedbackKey);
    if (!feedback) {
      return json({ ok: false, error: 'Feedback not available' }, 404);
    }

    // Parse stored fields
    const vibe = feedback.vibe != null ? Number(feedback.vibe) : null;
    const readiness = feedback.readiness != null ? Number(feedback.readiness) : null;
    let tips = [];
    try {
      tips = feedback.tips ? JSON.parse(feedback.tips) : [];
    } catch {
      tips = [];
    }

    console.log('[partner-status] Returning data for pairId', pairId, 'version', version);
    return json({ ok: true, currentDate, version, lastUpdated, vibe, readiness, tips }, 200);
  } catch (err) {
    console.error('[partner-status][GET] error:', err?.message || err);
    return json({ ok: false, error: 'Internal error' }, 500);
  }
}
