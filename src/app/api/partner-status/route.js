// src/app/api/partner-status/route.js
// :contentReference[oaicite:1]{index=1}
export const runtime = 'edge'; // ✅ Edge-runtime for Upstash

import { redis, expire } from '@/lib/redis.js';

const RL_PAIR_LIMIT_PER_MIN = 60;
const RL_WINDOW_SEC = 60;
const UUID_REGEX =
  /^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}$/;

/* -------------------------------------------------------------------------- */
/*                               Helper functions                             */
/* -------------------------------------------------------------------------- */

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

// ✅ Rate limiter per pairId / minute
async function limitByKey(key, limit = RL_PAIR_LIMIT_PER_MIN, windowSec = RL_WINDOW_SEC) {
  try {
    if (!redis) return { allowed: true, retryAfter: 0 };
    const windowId = Math.floor(Date.now() / (windowSec * 1000));
    const k = `rl:partner-status:${key}:${windowId}`;
    const count = await redis.incr(k);
    if (count === 1) await expire(k, windowSec);
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
 * GET /api/partner-status?pairId=<uuid>&ownerDate=YYYYMMDD
 * Success: { ok: true, currentDate, version, lastUpdated, vibe, readiness, tips[] }
 * If no state/version or no feedback for requested date: { ok: true, version: 0, hasData: false }
 * 304 when If-None-Match matches composite ETag "<date>:<version>" (version > 0 only).
 */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const pairId = (searchParams.get('pairId') || '').trim();
    const ownerDateParam = (searchParams.get('ownerDate') || '').trim(); // FIX: respect ownerDate query param
    if (!pairId || !UUID_REGEX.test(pairId)) {
      return json({ ok: false, error: 'Invalid or missing pairId' }, 400);
    }

    // ✅ Rate limit
    const rl = await limitByKey(`pair:${pairId}`, RL_PAIR_LIMIT_PER_MIN, RL_WINDOW_SEC);
    if (!rl.allowed) {
      return json({ ok: false, error: 'Rate limit exceeded' }, 429, {
        'Retry-After': String(rl.retryAfter ?? RL_WINDOW_SEC),
      });
    }

    // ✅ Redis sanity check
    if (!redis) {
      return json({ ok: false, error: 'Service unavailable (Redis not configured)' }, 503);
    }

    // ✅ Blocklist check
    const blocked = await redis.get(`blocklist:${pairId}`);
    if (blocked) {
      console.log('[status] Blocked pairId', pairId, '- access denied');
      return json({ ok: false, error: 'Partner disconnected' }, 403);
    }

    // ✅ Read current state (for version & default date)
    const stateKey = `state:${pairId}`;
    const state = await redis.hgetall(stateKey);
    const currentVersion = state?.version || '0';
    const stateDate = state?.currentDate || null;
    const lastUpdated = state?.lastUpdated || '';

    // Determine which date to read feedback for
    const effectiveDate = ownerDateParam || stateDate || null; // FIX: explicit date selection

    // If no version or no known date → treat as no data (ETag "0")
    if (!state || !state.version || state.version === '0' || !effectiveDate) {
      console.log('[status] No feedback for pairId', pairId);
      return json({ ok: true, version: 0, hasData: false }, 200, { 'ETag': '"0"' });
    }

    // ✅ Load feedback for effective date BEFORE ETag comparison (FIX)
    const feedbackKey = `feedback:${pairId}:${effectiveDate}`;
    const feedback = await redis.hgetall(feedbackKey);

    // If feedback missing (expired or different day) → return no data (ETag "0")
    if (!feedback) {
      console.warn('[status] Feedback missing for key', feedbackKey, '(possibly expired or different day)');
      return json({ ok: true, version: 0, hasData: false }, 200, { 'ETag': '"0"' }); // FIX
    }

    // Build composite ETag including date to avoid stale 304 on day changes
    const versionNum = Number(currentVersion) || 0;
    const compositeETag = `"${String(effectiveDate)}:${String(versionNum)}"`; // FIX: composite ETag

    // Only allow 304 when version > 0 and If-None-Match matches composite
    const ifNoneMatch = req.headers.get('if-none-match');
    if (versionNum > 0 && ifNoneMatch && ifNoneMatch.replace(/"/g, '') === `${effectiveDate}:${versionNum}`) {
      return new Response(null, {
        status: 304,
        headers: {
          'cache-control': 'no-store, max-age=0',
          'ETag': compositeETag,
        },
      });
    }

    // ✅ Extract safe typed fields
    const vibe =
      typeof feedback.vibe === 'string' && feedback.vibe.length > 0 ? feedback.vibe : null;

    let readiness = null;
    if (feedback.readiness != null) {
      const r = Number(feedback.readiness);
      readiness = Number.isFinite(r) ? r : null;
    }

    // Robust tips parsing with fallback to tipsJson/highlightedTips (FIX)
    let tips = [];
    let rawTips = '';
    if (typeof feedback.tips === 'string' && feedback.tips.length > 0) rawTips = feedback.tips;
    else if (typeof feedback.tipsJson === 'string' && feedback.tipsJson.length > 0) rawTips = feedback.tipsJson;
    else if (typeof feedback.highlightedTips === 'string' && feedback.highlightedTips.length > 0) rawTips = feedback.highlightedTips;

    if (rawTips) {
      try {
        const parsed = JSON.parse(rawTips);
        if (Array.isArray(parsed)) tips = parsed;
      } catch {
        tips = [];
      }
    }

    const currentDate =
      Number.isFinite(Number(effectiveDate)) ? Number(effectiveDate) : effectiveDate;

    // ✅ Structured debug logging (non-sensitive)
    console.log('[status]', {
      pairId,
      feedbackKey,
      version: versionNum,
      vibe,
      readiness,
      tipsCount: tips.length,
    });

    // ✅ Final JSON payload
    return json(
      {
        ok: true,
        currentDate,
        version: versionNum,
        lastUpdated,
        vibe,
        readiness,
        tips,
      },
      200,
      { 'ETag': compositeETag } // FIX: composite ETag
    );
  } catch (err) {
    console.error('[partner-status][GET] error:', err?.message || err);
    return json({ ok: false, error: 'Internal error' }, 500);
  }
}
