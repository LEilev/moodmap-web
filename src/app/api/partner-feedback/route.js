// src/app/api/partner-feedback/route.js
export const runtime = 'edge';

import { redis, hincr, expire } from '@/lib/redis.js';
import { FeedbackSchema, validate } from '@/lib/validate.js';
import { nextMidnightPlus2h } from '@/lib/date.js';

const STATE_TTL_SEC = 30 * 60 * 60; // ~30h
const RL_PAIR_LIMIT_PER_MIN = 60;
const RL_WINDOW_SEC = 60;
const TIP_ID_REGEX = /^[A-Za-z0-9:_-]{1,64}$/;

/**
 * JSON response helper with proper headers.
 */
function json(body, status = 200, extra = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store, private, max-age=0',
      ...extra
    }
  });
}

/**
 * Fixed-window rate limit using Redis INCR + EXPIRE.
 * Scope: arbitrary key (e.g., per pairId).
 * Returns { allowed: boolean, retryAfter: number }
 */
async function limitByKey(key, limit = RL_PAIR_LIMIT_PER_MIN, windowSec = RL_WINDOW_SEC) {
  try {
    if (!redis) return { allowed: true, retryAfter: 0 }; // fail open if Redis misconfigured
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
    console.error('[partner-feedback][limitByKey] error:', err?.message || err);
    return { allowed: true, retryAfter: 0 };
  }
}

/**
 * POST /api/partner-feedback
 * Body: { pairId, ownerDate (YYYYMMDD), updateId, vibe, readiness, tips[] }
 * Success: { ok:true, version, lastUpdated }
 * Idempotent: same updateId => NO-OP (same version)
 */
export async function POST(req) {
  try {
    if (!redis) {
      return json({ ok: false, error: 'Service unavailable (Redis not configured)' }, 503);
    }

    // Parse + validate body with Zod (includes <1KB enforcement, tips ≤ 10)
    let body;
    try {
      body = await req.json();
    } catch {
      return json({ ok: false, error: 'Invalid JSON' }, 400);
    }

    const v = await validate(FeedbackSchema, body);
    if (!v.success) {
      return json({ ok: false, error: v.error || 'Invalid payload' }, 400);
    }

    const { pairId, ownerDate, updateId, vibe } = v.value;
    const readiness = v.value.readiness;
    const tips = Array.isArray(v.value.tips) ? v.value.tips : [];

    // Additional whitelist-style check for tip IDs (sanity)
    for (const t of tips) {
      if (!TIP_ID_REGEX.test(t)) {
        return json({ ok: false, error: 'Invalid tip id' }, 400);
      }
    }

    // Optional per-pair rate limit (≤ 60/min)
    const rl = await limitByKey(`rl:partner-feedback:pair:${pairId}`, RL_PAIR_LIMIT_PER_MIN, RL_WINDOW_SEC);
    if (!rl.allowed) {
      return json({ ok: false, error: 'Rate limit exceeded' }, 429, {
        'Retry-After': String(rl.retryAfter ?? RL_WINDOW_SEC)
      });
    }

    // Blocklist check
    const blocked = await redis.get(`blocklist:${pairId}`);
    if (blocked) {
      return json({ ok: false, error: 'Partner disconnected' }, 403);
    }

    const feedbackKey = `feedback:${pairId}:${ownerDate}`;
    const stateKey = `state:${pairId}`;
    const nowIso = new Date().toISOString();

    // Read existing state (lastUpdateId, version, lastUpdated)
    // Use HGETALL for simplicity; returns null or object
    const current = await redis.hgetall(feedbackKey);
    const currentLastUpdateId = current?.lastUpdateId || null;
    const currentVersion = current?.version != null ? Number(current.version) : null;

    // Idempotency: if same updateId, return current without increment
    if (currentLastUpdateId && currentLastUpdateId === updateId) {
      const lastUpdated = current?.lastUpdated || nowIso;
      const version = currentVersion != null && Number.isFinite(currentVersion) ? currentVersion : 1;

      // Keep state:<pairId> in sync (optional; not strictly required on NO-OP)
      await redis.hset(stateKey, {
        currentDate: ownerDate,
        version: String(version),
        lastUpdated
      });
      await expire(stateKey, STATE_TTL_SEC);

      return json({ ok: true, version, lastUpdated }, 200);
    }

    // Write new fields (full overwrite semantics for vibe/readiness/tips)
    const tipsJson = JSON.stringify(tips);
    await redis.hset(feedbackKey, {
      vibe,
      readiness: String(readiness),
      tips: tipsJson,
      lastUpdateId: updateId,
      lastUpdated: nowIso
    });

    // Increment or initialize version atomically
    const newVersion = await hincr(feedbackKey, 'version', 1);
    const version = newVersion != null ? Number(newVersion) : (currentVersion ? currentVersion + 1 : 1);

    // Ensure TTL ≈ next local midnight + 2h (or 26h fallback)
    try {
      const ttl = await redis.ttl(feedbackKey);
      if (ttl == null || ttl <= 0) {
        const exp = nextMidnightPlus2h(ownerDate);
        await expire(feedbackKey, exp);
      }
    } catch (e) {
      console.error('[partner-feedback][ttl] error:', e?.message || e);
      // best-effort; continue
    }

    // Update state:<pairId> mirror
    await redis.hset(stateKey, {
      currentDate: ownerDate,
      version: String(version),
      lastUpdated: nowIso
    });
    await expire(stateKey, STATE_TTL_SEC);

    return json({ ok: true, version, lastUpdated: nowIso }, 200);
  } catch (err) {
    console.error('[partner-feedback][POST] error:', err?.message || err);
    return json({ ok: false, error: 'Internal error' }, 500);
  }
}