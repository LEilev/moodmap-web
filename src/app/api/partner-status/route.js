// src/app/api/partner-status/route.js
export const runtime = 'edge';

import { redis, expire } from '@/lib/redis.js';

const RL_PAIR_LIMIT_PER_MIN = 60;
const RL_WINDOW_SEC = 60;
const UUID_REGEX =
  /^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}$/;

/** JSON response helper */
function json(body, status = 200, extra = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store, max-age=0',
      ...extra,
    },
  });
}

/** Fixed-window rate limit per key (Redis INCR + EXPIRE). Fail-open on errors. */
async function limitByKey(key, limit = RL_PAIR_LIMIT_PER_MIN, windowSec = RL_WINDOW_SEC) {
  try {
    if (!redis) return { allowed: true, retryAfter: 0 };
    const windowId = Math.floor(Date.now() / (windowSec * 1000));
    const k = `rl:partner-status:${key}:${windowId}`;
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
    console.error('[status][limitByKey] error:', err?.message || err);
    return { allowed: true, retryAfter: 0 };
  }
}

/**
 * GET /api/partner-status?pairId=<uuid>
 * Success: { ok: true, currentDate, version, lastUpdated, vibe, readiness, tips[] }
 * If no state/version: { ok: true, version: 0 }
 */
export async function GET(req) {
  try {
    // --- Validate input ---
    const { searchParams } = new URL(req.url);
    const pairId = (searchParams.get('pairId') || '').trim();
    if (!pairId || !UUID_REGEX.test(pairId)) {
      return json({ ok: false, error: 'Invalid or missing pairId' }, 400);
    }

    // --- Rate limit per pair ---
    const rl = await limitByKey(`pair:${pairId}`, RL_PAIR_LIMIT_PER_MIN, RL_WINDOW_SEC);
    if (!rl.allowed) {
      return json({ ok: false, error: 'Rate limit exceeded' }, 429, {
        'Retry-After': String(rl.retryAfter ?? RL_WINDOW_SEC),
      });
    }

    // --- Service ready? ---
    if (!redis) {
      return json({ ok: false, error: 'Service unavailable (Redis not configured)' }, 503);
    }

    // --- Blocklist ---
    const blocked = await redis.get(`blocklist:${pairId}`);
    if (blocked) {
      console.log('[status] Blocked pairId', pairId, '- access denied');
      return json({ ok: false, error: 'Partner disconnected' }, 403);
    }

    // --- Read state (mirrors latest feedback meta) ---
    const stateKey = `state:${pairId}`;
    const state = await redis.hgetall(stateKey);

    // No feedback yet → version 0
    if (!state || !state.version || state.version === '0') {
      console.log('[status] No feedback for pairId', pairId);
      return json({ ok: true, version: 0 }, 200);
    }

    const currentDateRaw = state.currentDate;
    const versionNum = Number(state.version) || 0;
    const lastUpdated = state.lastUpdated || '';

    // --- Read latest feedback by date referenced in state ---
    const feedbackKey = `feedback:${pairId}:${currentDateRaw}`;
    const feedback = await redis.hgetall(feedbackKey);
    if (!feedback) {
      console.warn('[status] Feedback missing for key', feedbackKey, '(possibly expired)');
      return json({ ok: false, error: 'Feedback not available' }, 404);
    }

    // --- Type-safe projection ---
    // vibe MUST remain a string if present (e.g. "calm"); do NOT cast to Number.
    const vibe =
      typeof feedback.vibe === 'string' && feedback.vibe.length > 0 ? feedback.vibe : null;

    // readiness is numeric (stored as string in Redis) → cast, or null if invalid/missing
    let readiness = null;
    if (feedback.readiness != null) {
      const r = Number(feedback.readiness);
      readiness = Number.isFinite(r) ? r : null;
    }

    // tips stored as JSON string → parse to array<string>
    let tips = [];
    if (typeof feedback.tips === 'string' && feedback.tips.length > 0) {
      try {
        const parsed = JSON.parse(feedback.tips);
        if (Array.isArray(parsed)) tips = parsed;
      } catch {
        tips = [];
      }
    }

    // Output currentDate as number when safe, else pass-through string
    const currentDate =
      Number.isFinite(Number(currentDateRaw)) ? Number(currentDateRaw) : currentDateRaw;

    console.log('[status]', {
      pairId,
      feedbackKey,
      version: versionNum,
      vibe,
      readiness,
      tipsCount: tips.length,
    });

    return json(
      { ok: true, currentDate, version: versionNum, lastUpdated, vibe, readiness, tips },
      200
    );
  } catch (err) {
    console.error('[partner-status][GET] error:', err?.message || err);
    return json({ ok: false, error: 'Internal error' }, 500);
  }
}
