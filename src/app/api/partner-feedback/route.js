// src/app/api/partner-feedback/route.js
// Partner Mode v4.3 — feedback endpoint (Edge).
// Changes:
// - Cross‑day persistence: remove TTL on feedback/state (keep data indefinitely). // FIX
// - Align tip‑ID regex to allow [A‑Za‑z0‑9 . _ - :] (defense in depth).         // FIX
// - Preserve idempotency via updateId and version increment semantics.          // FIX

import { redis, hincr } from '@/lib/redis';
import { FeedbackSchema, validate } from '@/lib/validate';

// --- helpers --- //
const TIP_RE = /^[A-Za-z0-9][A-Za-z0-9:._-]{0,63}$/;  // FIX: allow _, -, : and .
const DATE_RE = /^[0-9]{8}$/;

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
    const k = v.trim();
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
      await redis.expire(k, windowSec);
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
    const tips = normalizeTips(v.value);

    // Allow full ID character set
    const TIP_ID_REGEX = /^[A-Za-z0-9:._-]{1,64}$/;
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
      await redis.hset(stateKey, { currentDate: ownerDate, version: String(version), lastUpdated });
      console.log('[partner-feedback] Duplicate updateId (NO-OP)', { pairId, ownerDate, version, tips });
      const etag = buildETag(version);
      return json({ ok: true, version, lastUpdated, tipCount: tips.length }, 200, { ETag: etag });
    }

    // Write new feedback fields
    const tipsJson = JSON.stringify(tips);
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

    // Update state mirror (no TTL in v4.3)                               // FIX
    await redis.hset(stateKey, {
      currentDate: ownerDate,
      version: String(version),
      lastUpdated: nowIso,
    });

    console.log('[partner-feedback] Saved', { pairId, ownerDate, version, tips });
    const etag = buildETag(version);
    return json({ ok: true, version, lastUpdated: nowIso, tipCount: tips.length }, 200, { ETag: etag });
  } catch (err) {
    console.error('[partner-feedback][POST] error:', err?.message || err);
    return json({ ok: false, error: 'Internal error' }, 500);
  }
}

/* ---------------------------------------------------------------------------
v4.3 Verification Summary (partner-feedback/route.js)
- Removed TTL on feedback/state keys to preserve cross‑day history.           // FIX
- Kept unlink flow (separate route) responsible for data purge on disconnect.
- Aligned tip‑ID filtering with extended character set: [A‑Za‑z0‑9:._-].      // FIX
- Preserved idempotency semantics and ETag = W/"<version>".
--------------------------------------------------------------------------- */
