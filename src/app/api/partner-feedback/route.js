// app/api/partner-feedback/route.js
export const runtime = 'edge';

import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// v5.0 Foundation merge: always JSON (no empty body) + content-type
const headersNoStore = {
  'Cache-Control': 'no-store',
  'Content-Type': 'application/json; charset=utf-8',
};

const toBool = (v) => {
  if (typeof v === 'boolean') return v;
  if (typeof v === 'string') return v === 'true' || v === '1';
  if (typeof v === 'number') return v !== 0;
  return false;
};

function weakETag(version) { return `W/"${version}"`; }

async function getState(pairId) {
  const key = `state:${pairId}`;
  const res = await redis.hgetall(key);
  const version = Number(res?.version ?? 0);
  return { key, ...res, version };
}

async function getFeedback(pairId, ownerDate) {
  const key = `feedback:${pairId}:${ownerDate}`;
  const fv = await redis.hgetall(key);
  const out = { key, tips: [], vibe: '', readiness: null, reactionAck: false };
  if (fv) {
    out.vibe = typeof fv.vibe === 'string' ? fv.vibe : '';
    out.readiness = fv.readiness != null ? Number(fv.readiness) : null;
    out.reactionAck = toBool(fv.reactionAck);
    if (fv.tips) { try { out.tips = JSON.parse(fv.tips); } catch {} }
  }
  return out;
}

/**
 * POST body (eksempel):
 * {
 *   pairId: "abc",
 *   ownerDate: "2025-11-02",
 *   updateId: "ulid-123",
 *   vibe: "🙂",
 *   readiness: 6,
 *   tips: ["t1","t2"],
 *   reactionAck: true,           // HIM → HER
 *   missionsVersion: 12,         // (valgfri bump)
 *   scoresVersion: 8             // (valgfri bump)
 * }
 */
export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const pairId = String(body.pairId || '').trim();
    const ownerDate = String(body.ownerDate || '').trim();
    const updateId = String(body.updateId || '').trim();

    if (!pairId || !ownerDate || !updateId) {
      return new Response(JSON.stringify({ ok: false, error: 'pairId, ownerDate, updateId required' }), {
        status: 400, headers: headersNoStore,
      });
    }

    const blocked = await redis.get(`blocklist:${pairId}`);
    if (blocked) {
      return new Response(JSON.stringify({ ok: false, error: 'blocked' }), { status: 403, headers: headersNoStore });
    }

    const idemKey = `idemp:${pairId}:${updateId}`;
    const idem = await redis.set(idemKey, 1, { nx: true, ex: 60 * 60 * 24 });
    if (idem === null) {
      const prevState = await getState(pairId);
      return new Response(JSON.stringify({ ok: true, version: prevState.version, idempotent: true }), {
        status: 200, headers: { ...headersNoStore, ETag: weakETag(prevState.version) }
      });
    }

    const state = await getState(pairId);
    const feedback = await getFeedback(pairId, ownerDate);

    const patch = {};
    let changed = false;

    if ('vibe' in body && typeof body.vibe === 'string') {
      patch.vibe = body.vibe;
      changed = changed || patch.vibe !== feedback.vibe;
    }
    if ('readiness' in body && (typeof body.readiness === 'number' || typeof body.readiness === 'string')) {
      const val = Number(body.readiness);
      patch.readiness = Number.isNaN(val) ? null : val;
      changed = changed || patch.readiness !== feedback.readiness;
    }
    if ('tips' in body && Array.isArray(body.tips)) {
      patch.tips = JSON.stringify(body.tips);
      changed = changed || JSON.stringify(feedback.tips || []) !== patch.tips;
    }

    if ('reactionAck' in body) {
      const ack = toBool(body.reactionAck);
      if (ack !== feedback.reactionAck) {
        patch.reactionAck = ack ? '1' : '0';
        changed = true;
      }
    }

    const statePatch = {};
    if ('missionsVersion' in body && body.missionsVersion != null) {
      const mv = Number(body.missionsVersion);
      if (!Number.isNaN(mv)) statePatch.missionsVersion = mv;
    }
    if ('scoresVersion' in body && body.scoresVersion != null) {
      const sv = Number(body.scoresVersion);
      if (!Number.isNaN(sv)) statePatch.scoresVersion = sv;
    }

    const herTouched = ('vibe' in body) || ('readiness' in body) || ('tips' in body);
    if (herTouched) patch.reactionAck = '0';

    if (Object.keys(patch).length > 0) await redis.hset(feedback.key, patch);

    if (Object.keys(statePatch).length > 0 || herTouched || ('reactionAck' in body)) {
      const writePatch = { currentDate: ownerDate, ...statePatch };
      await redis.hset(state.key, writePatch);
    }

    let newVersion = state.version;
    if (changed || herTouched || ('reactionAck' in body) || Object.keys(statePatch).length > 0) {
      newVersion = await redis.hincrby(state.key, 'version', 1);
    }

    return new Response(JSON.stringify({ ok: true, version: newVersion }), {
      status: 200, headers: { ...headersNoStore, ETag: weakETag(newVersion) },
    });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: 'server_error', detail: String(err) }), {
      status: 500, headers: headersNoStore,
    });
  }
}
