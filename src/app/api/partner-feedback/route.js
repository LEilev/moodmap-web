// Harmony v5.1.2 — First Sync Fix (2025-11-XX)
export const runtime = 'edge';

import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const DEV = process.env.NODE_ENV !== 'production';
function devLog(...args) { if (DEV) { try { console.log('[HarmonyDev][partner-feedback]', ...args); } catch {} } }

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

function todayKeyUTC() {
  const d = new Date();
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`; // yyyy-mm-dd
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

    if (!pairId || !updateId) {
      return new Response(JSON.stringify({ ok: false, error: 'pairId and updateId required' }), {
        status: 400, headers: headersNoStore,
      });
    }

    const blocked = await redis.get(`blocklist:${pairId}`);
    if (blocked) {
      devLog('403 blocklist hit', { pairId });
      return new Response(JSON.stringify({ ok: false, error: 'blocked' }), { status: 403, headers: headersNoStore });
    }

    // Load state for potential fallback
    const state = await getState(pairId);

    // Normalize ownerDate → canonical YYYY-MM-DD; fallback to state.currentDate, else UTC today
    let ownerDate = normalizeOwnerDate(ownerDateRaw);
    if (!ownerDate) {
      const fromState = state?.currentDate ? normalizeOwnerDate(state.currentDate) : null;
      ownerDate = fromState || todayKeyUTC();
    }
    devLog('ownerDateUsed', ownerDate);

    // Idempotency – 24h window
    const idemKey = `idemp:${pairId}:${updateId}`;
    const idem = await redis.set(idemKey, 1, { nx: true, ex: 60 * 60 * 24 });
    if (idem === null) {
      devLog('idempotent-hit', { updateId });
      const prev = state;
      return new Response(JSON.stringify({ ok: true, version: prev.version, idempotent: true }), {
        status: 200, headers: { ...headersNoStore, ETag: weakETag(prev.version) },
      });
    }

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
      try { await redis.expire(feedback.key, 108000); devLog('feedbackTTL', { ttl: 108000 }); } catch {} 
    }

    if (Object.keys(statePatch).length > 0 || herTouched || ('reactionAck' in body)) {
      const writePatch = { currentDate: ownerDate, ...statePatch };
      await redis.hset(state.key, writePatch);
    }

    // First Sync Fix: prevent double version bump on identical owner POSTs
    // Only bump when herTouched && changed; still bump for explicit reactionAck or statePatch updates.
    let newVersion = state.version;
    let bump = false;
    if (herTouched && changed) bump = true;
    if (!bump && ('reactionAck' in body)) bump = true;
    if (!bump && Object.keys(statePatch).length > 0) bump = true;
    if (bump) newVersion = await redis.hincrby(state.key, 'version', 1);

    return new Response(JSON.stringify({ ok: true, version: newVersion }), {
      status: 200, headers: { ...headersNoStore, ETag: weakETag(newVersion) },
    });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: 'server_error', detail: String(err) }), {
      status: 500, headers: headersNoStore,
    });
  }
}
