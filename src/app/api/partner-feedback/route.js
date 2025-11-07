// Harmony Drop-in Final — Sync Fix Patch (2025-11-07)
// moodmap-web/src/app/api/partner-feedback/route.js
// Changes:
//  • Normalize ownerDate to canonical YYYY-MM-DD for storage
//  • Extend feedback TTL to 30h (108000s)
//  • Keep idempotency (24h idem key) and version bump
export const runtime = 'edge';

import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

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

const weakETag = (v) => `W/"${v}"`;

function normalizeOwnerDate(input) {
  if (!input) return null;
  const s = String(input).trim();
  if (/^\d{8}$/.test(s)) return `${s.slice(0,4)}-${s.slice(4,6)}-${s.slice(6,8)}`;
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const dt = new Date(s); if (!Number.isNaN(dt)) return dt.toISOString().slice(0,10);
  return null;
}

async function getState(pairId) {
  const key = `state:${pairId}`;
  const res = await redis.hgetall(key);
  return { key, version: Number(res?.version ?? 0), ...res };
}

async function getFeedback(pairId, dayIso) {
  const dashed = `feedback:${pairId}:${dayIso}`;
  const legacy = `feedback:${pairId}:${dayIso.replaceAll('-','')}`;
  const fv = (await redis.hgetall(dashed)) || (await redis.hgetall(legacy));
  const out = { key: dashed, tips: [], vibe: '', readiness: null, reactionAck: false };
  if (fv) {
    out.vibe = typeof fv.vibe === 'string' ? fv.vibe : '';
    out.readiness = fv.readiness != null ? Number(fv.readiness) : null;
    out.reactionAck = toBool(fv.reactionAck);
    if (fv.tips) { try { out.tips = JSON.parse(fv.tips); } catch {} }
  }
  return out;
}

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const pairId = String(body.pairId || '').trim();
    const ownerDateRaw = String(body.ownerDate || '').trim();
    const updateId = String(body.updateId || '').trim();

    if (!pairId || !ownerDateRaw || !updateId) {
      return new Response(JSON.stringify({ ok: false, error: 'pairId, ownerDate, updateId required' }), {
        status: 400, headers: headersNoStore,
      });
    }

    const blocked = await redis.get(`blocklist:${pairId}`);
    if (blocked) {
      return new Response(JSON.stringify({ ok: false, error: 'blocked' }), { status: 403, headers: headersNoStore });
    }

    // Normalize ownerDate → canonical YYYY-MM-DD
    const ownerDate = normalizeOwnerDate(ownerDateRaw);
    if (!ownerDate) {
      return new Response(JSON.stringify({ ok: false, error: 'invalid ownerDate' }), { status: 400, headers: headersNoStore });
    }

    // Idempotency – 24h window
    const idemKey = `idemp:${pairId}:${updateId}`;
    const idem = await redis.set(idemKey, 1, { nx: true, ex: 60 * 60 * 24 });
    if (idem === null) {
      const prev = await getState(pairId);
      return new Response(JSON.stringify({ ok: true, version: prev.version, idempotent: true }), {
        status: 200, headers: { ...headersNoStore, ETag: weakETag(prev.version) },
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
      if (ack !== feedback.reactionAck) { patch.reactionAck = ack ? '1' : '0'; changed = true; }
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

    if (Object.keys(patch).length > 0) {
      await redis.hset(feedback.key, patch);
      // Feedback TTL → 30h
      try { await redis.expire(feedback.key, 108000); } catch {} 
    }

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
