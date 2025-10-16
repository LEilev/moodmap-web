// src/app/api/partner-feedback/route.js
// Partner Mode v4.2 — feedback endpoint (Edge).
// FIX: Accept missing vibe/readiness (defaults), normalize tips, increment version, set tz-aware TTL, and log pairId/ownerDate/tips.

import { redis, hincr, expire } from '@/lib/redis';
import { FeedbackSchema, validate } from '@/lib/validate';

// --- helpers --- //
const TIP_RE = /^[a-z0-9]+(\.[a-z0-9]+)*$/i;
const DATE_RE = /^[0-9]{8}$/;
const HOURS = 60 * 60;

// FIX: compute TTL (seconds) until 02:00 LOCAL time on the day after ownerDate,
// using tzOffsetMin where local = UTC + tzOffsetMin
function ttlUntilNextLocal2am(ownerDate, tzOffsetMin) {
  try {
    if (!DATE_RE.test(ownerDate)) return 26 * HOURS;
    const y = Number(ownerDate.slice(0, 4));
    const m = Number(ownerDate.slice(4, 6)) - 1;
    const d = Number(ownerDate.slice(6, 8));
    const safe = Number.isFinite(tzOffsetMin) ? Math.max(-14*60, Math.min(14*60, Math.trunc(tzOffsetMin))) : 0;
    const localTargetUTCms = Date.UTC(y, m, d + 1, 2, 0, 0); // 02:00 local next day (in "local wall clock")
    const targetUtcMs = localTargetUTCms - safe * 60 * 1000; // convert local -> UTC
    const secs = Math.max(0, Math.floor((targetUtcMs - Date.now()) / 1000));
    return Math.max(secs, 26 * HOURS); // minimum 26h
  } catch { return 26 * HOURS; }
}

function normalizeTips(body) {
  let src = body?.tips ?? body?.highlightedTips ?? body?.tipsJson ?? [];
  if (typeof src === 'string') {
    try { src = JSON.parse(src); }
    catch { console.warn('[partner-feedback] tips payload malformed'); src = []; }
  }
  const arr = Array.isArray(src) ? src : [];
  const seen = new Set();
  const out = [];
  for (const v of arr) {
    if (typeof v !== 'string') continue;
    const k = v.trim().toLowerCase();
    if (!k || !TIP_RE.test(k)) continue;
    if (!seen.has(k)) { seen.add(k); out.push(k); }
  }
  return out.slice(0, 32);
}

function buildETag(version) {
  return `W/"${String(version)}"`;
}

export const runtime = 'edge';

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

async function limitByKey(key, limit = 60, windowSec = 60) {
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
    console.error('[partner-feedback][limitByKey] error:', err?.message || err);
    return { allowed: true, retryAfter: 0 };
  }
}

/**
 * POST /api/partner-feedback
 * Body: { pairId, ownerDate (YYYYMMDD), updateId, vibe?, readiness?, tips[] }
 * Success: { ok: true, version, lastUpdated, tipCount }
 * Idempotent: same updateId => NO-OP (same version)
 */
export async function POST(req) {
  try {
    if (!redis) {
      return json({ ok: false, error: 'Service unavailable (Redis not configured)' }, 503);
    }

    // Parse + validate body (includes <1KB size and tips ≤ 10 constraints)
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
    const tzOffsetMin = Number.isFinite(body?.tzOffsetMin) ? Math.trunc(body.tzOffsetMin) : undefined; // FIX: accept tz offset
    const readiness = v.value.readiness;
    // Use normalizeTips() instead of direct array cast
    const tips = normalizeTips(v.value);

    // Additional whitelist check for tip IDs (defense in depth)
    const TIP_ID_REGEX = /^[A-Za-z0-9:._-]{1,64}$/; // FIX: allow dot
    for (const t of tips) {
      if (!TIP_ID_REGEX.test(t)) {
        return json({ ok: false, error: 'Invalid tip id' }, 400);
      }
    }

    // Per-pair rate limit (≤ 60/min)
    const rl = await limitByKey(`rl:partner-feedback:pair:${pairId}`, 60, 60);
    if (!rl.allowed) {
      console.warn('[partner-feedback] Rate limit exceeded for pairId', pairId);
      return json({ ok: false, error: 'Rate limit exceeded' }, 429, {
        'Retry-After': String(rl.retryAfter ?? 60),
      });
    }

    // Blocklist check
    const blocked = await redis.get(`blocklist:${pairId}`);
    if (blocked) {
      console.log('[partner-feedback] Blocked pairId', pairId, '- update rejected');
      return json({ ok: false, error: 'Partner disconnected' }, 403);
    }

    const feedbackKey = `feedback:${pairId}:${ownerDate}`;
    const stateKey = `state:${pairId}`;
    const nowIso = new Date().toISOString();

    // Read current feedback state (if any)
    const current = await redis.hgetall(feedbackKey);
    const currentLastUpdateId = current?.lastUpdateId || null;
    const currentVersion = current?.version != null ? Number(current.version) : null;

    // Idempotency: if same updateId seen, return existing version without incrementing
    if (currentLastUpdateId && currentLastUpdateId === updateId) {
      const lastUpdated = current?.lastUpdated || nowIso;
      const version = (currentVersion != null && Number.isFinite(currentVersion)) ? currentVersion : 1;

      // Refresh state (optional on NO-OP)
      await redis.hset(stateKey, {
        currentDate: ownerDate,
        version: String(version),
        lastUpdated,
      });

      // FIX: log idempotent hit with full context
      console.log('[partner-feedback] Duplicate updateId (NO-OP)', {
        pairId, ownerDate, version, tips,
      });

      const etag = buildETag(version);
      return json({ ok: true, version, lastUpdated, tipCount: tips.length }, 200, { ETag: etag });
    }

    // Write new feedback fields (overwriting vibe/readiness/tips)
    const tipsJson = JSON.stringify(tips); // FIX: stringify exactly once
    await redis.hset(feedbackKey, {
      vibe,
      readiness: String(readiness),
      tips: tipsJson,
      lastUpdateId: updateId,
      lastUpdated: nowIso,
    });

    // Atomically increment or initialize the version counter
    const newVersion = await hincr(feedbackKey, 'version', 1);
    const version = newVersion != null ? Number(newVersion) : (currentVersion ? currentVersion + 1 : 1);

    // Ensure TTL with tzOffsetMin (min 26h) for both feedback and state // FIX: align TTLs
    try {
      const ttl = ttlUntilNextLocal2am(ownerDate, tzOffsetMin);
      await expire(feedbackKey, ttl);
      await expire(stateKey, ttl);
    } catch (e) {
      console.error('[partner-feedback][ttl] error:', e?.message || e);
    }

    // Update state mirror (current date, version, lastUpdated)
    await redis.hset(stateKey, {
      currentDate: ownerDate,
      version: String(version),
      lastUpdated: nowIso,
    });

    // FIX: log with explicit pairId/ownerDate and full tips[] for diagnostics
    console.log('[partner-feedback] Saved', {
      pairId, ownerDate, version, tips,
    });

    const etag = buildETag(version);
    return json({ ok: true, version, lastUpdated: nowIso, tipCount: tips.length }, 200, { ETag: etag });
  } catch (err) {
    console.error('[partner-feedback][POST] error:', err?.message || err);
    return json({ ok: false, error: 'Internal error' }, 500);
  }
}
