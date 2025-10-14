// src/app/api/partner-feedback/route.ts
import { redis, hincr, expire } from '@/lib/redis';
import { FeedbackSchema, validate } from '@/lib/validate';
import { nextMidnightPlus2h } from '@/lib/date';

export const runtime = 'edge';

function json(body: any, status = 200, extra: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store, private, max-age=0',
      ...extra,
    },
  });
}

async function limitByKey(key: string, limit = 60, windowSec = 60) {
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
 * Body: { pairId, ownerDate (YYYYMMDD), updateId, vibe, readiness, tips[] }
 * Success: { ok: true, version, lastUpdated, tipCount }
 * Idempotent: same updateId => NO-OP (same version)
 */
export async function POST(req: Request) {
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
    const readiness = v.value.readiness;
    const tips = Array.isArray(v.value.tips) ? v.value.tips : [];

    // Additional whitelist check for tip IDs (defense in depth)
    const TIP_ID_REGEX = /^[A-Za-z0-9:_-]{1,64}$/;
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
      await expire(stateKey, 30 * 60 * 60);
      console.log('[partner-feedback] Duplicate updateId -> no new data for', feedbackKey, '(version', version, ')');
      return json({ ok: true, version, lastUpdated, tipCount: tips.length }, 200);  // FIX: include tipCount in duplicate response
    }

    // Write new feedback fields (overwriting vibe/readiness/tips)
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

    // Ensure TTL ≈ next local midnight + 2h (fallback to 26h if tz unknown)
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

    // Update state mirror (current date, version, lastUpdated)
    await redis.hset(stateKey, {
      currentDate: ownerDate,
      version: String(version),
      lastUpdated: nowIso,
    });
    await expire(stateKey, 30 * 60 * 60);

    console.log('[partner-feedback] Saved feedback for', feedbackKey, 'version', version, 'tipsCount', tips.length);  // FIX: log tip count for verification
    return json({ ok: true, version, lastUpdated: nowIso, tipCount: tips.length }, 200);  // FIX: include tipCount in success response
  } catch (err) {
    console.error('[partner-feedback][POST] error:', err?.message || err);
    return json({ ok: false, error: 'Internal error' }, 500);
  }
}
