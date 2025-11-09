// app/api/partner-status/route.js
// Harmony² Feedback Visibility Sync Update — 2025-11-09
//
// Change: sets `hasData:true` when daily feedback exists in Redis at
//   feedback:<pairId>:<YYYY-MM-DD>
// using the same field semantics as /api/partner-feedback (vibe/readiness/tips/reactionAck).
//
// Preserves: Edge runtime, version counters, featureFlags, ETag, TTL refresh, and existing signals.
//
// Baseline: Harmony² Fix (reactionsVersion + reactionType + TTL renewal).
//

import { sanitizeEtag } from '../_utils/sanitizeEtag.js';
export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

// Longevity: auto-renew state TTL on activity (GET partner-status)
const STATE_TTL_SEC = 7 * 24 * 60 * 60; // 7 days

function noStore(extra={}) {
  return { 'Cache-Control': 'no-store', 'Content-Type': 'application/json; charset=utf-8', ...extra };
}
async function redis(cmd, ...args) {
  const url = `${UPSTASH_URL}/${cmd}/${args.map(a => encodeURIComponent(String(a))).join('/')}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` } });
  if (!res.ok) throw new Error(`Upstash ${cmd} failed: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data.result;
}

// ---- Date helpers (align with /api/partner-feedback normalization) ----
function normalizeOwnerDate(input) {
  if (!input) return null;
  const s = String(input).trim();
  if (/^\d{8}$/.test(s)) return `${s.slice(0,4)}-${s.slice(4,6)}-${s.slice(6,8)}`;
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const dt = new Date(s);
  if (!Number.isNaN(dt)) return dt.toISOString().slice(0,10);
  return null;
}
function todayKeyUTC() {
  const d = new Date();
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export async function GET(req) {
  try {
    if (!UPSTASH_URL || !UPSTASH_TOKEN) {
      return new Response(JSON.stringify({ ok:false, error:'Missing Upstash env' }), { status: 500, headers: noStore() });
    }
    const url = new URL(req.url);
    const pairId = url.searchParams.get('pairId') || req.headers.get('x-mm-pair') || '';
    if (!pairId) return new Response(JSON.stringify({ ok:false, error:'Missing pairId' }), { status: 400, headers: noStore() });

    // Blocklist check
    const blocked = await redis('get', `blocklist:${pairId}`);
    if (blocked) {
      return new Response(JSON.stringify({ ok:false, isValidConnection:false, error:'blocked' }), { status: 403, headers: noStore() });
    }

    const stateKey = `state:${pairId}`;
    const state = await redis('hgetall', stateKey) || {};

    // Longevity: refresh TTL for active pairs (safe even if key has no TTL)
    try { await redis('expire', stateKey, STATE_TTL_SEC); } catch {}

    // Also attempt to touch ecology TTL (non-fatal if absent)
    const ecologyKey = `ecology:${pairId}`;
    try { await redis('expire', ecologyKey, STATE_TTL_SEC); } catch {}

    const missionsVersion = Number(state.missionsVersion) || 0;
    const scoresVersion = Number(state.scoresVersion) || 0;
    const ecologyVersion = Number(state.ecologyVersion) || 0;
    const challengesVersion = Number(state.challengesVersion) || 0;

    // NEW from baseline: expose kudos-change signals to clients
    const reactionsVersion = Number(state.reactionsVersion) || 0;
    const reactionType = state.reactionType || state.lastReactionType || null;

    // Determine weatherState and forecast from ecology if available
    let weatherState = state.weatherState || null;
    let forecast72h = [];
    if (!weatherState) {
      // Fallback: derive weatherState from syncEnergy if present
      const energyVal = Number(state.syncEnergy) || 50;
      if (energyVal < 40) weatherState = 'stormy'; else if (energyVal < 55) weatherState = 'rainy'; else if (energyVal < 80) weatherState = 'cloudy'; else weatherState = 'sunny';
    }
    // forecast - if any cached or precomputed exists
    if (state.forecast72h) {
      try { forecast72h = JSON.parse(state.forecast72h); } catch {}
    }

    // Feature flags
    let featureFlags = {};
    try {
      featureFlags = state.featureFlags ? JSON.parse(state.featureFlags) : {};
    } catch {
      featureFlags = {};
    }
    if (featureFlags.ff_garden === undefined) featureFlags.ff_garden = true;
    if (featureFlags.ff_challenges === undefined) featureFlags.ff_challenges = true;
    if (featureFlags.ff_insights === undefined) featureFlags.ff_insights = true;
    if (featureFlags.ff_badges === undefined) featureFlags.ff_badges = true;
    if (featureFlags.ff_missions === undefined) featureFlags.ff_missions = true;

    // Existing "signal" heuristic from baseline (reactions/missions in last 7 days)
    let hasSignal = false;
    try {
      for (let i=0;i<7;i++) {
        const d = new Date(); d.setUTCDate(d.getUTCDate()-i);
        const dKey = d.toISOString().slice(0,10);
        const r = await redis('hgetall', `reactions:${pairId}:${dKey}`);
        const m = await redis('get', `missions:${pairId}:${dKey}`);
        if ((r && (r.type || r.note || r.time)) || m) {
          hasSignal = true;
          break;
        }
      }
    } catch {}

    // ---- NEW: Feedback visibility (today or state.currentDate) ----
    const ownerDate = normalizeOwnerDate(state.currentDate) || todayKeyUTC();
    const fbKey = `feedback:${pairId}:${ownerDate}`;

    let hasFeedback = false;
    try {
      const fb = await redis('hgetall', fbKey);
      if (fb) {
        const vibe = (typeof fb.vibe === 'string' && fb.vibe.trim().length > 0) ? fb.vibe.trim() : null;
        let readiness = null;
        if (fb.readiness !== undefined) {
          const n = Number(fb.readiness);
          readiness = Number.isNaN(n) ? null : n;
        }
        let tips = [];
        if (typeof fb.tips === 'string' && fb.tips.length > 0) {
          try { const parsed = JSON.parse(fb.tips); if (Array.isArray(parsed)) tips = parsed; } catch {}
        }
        const reactionAck = (typeof fb.reactionAck === 'string') ? (fb.reactionAck === '1') : null;

        hasFeedback = Boolean(
          (vibe && vibe.length > 0) ||
          (typeof readiness === 'number') ||
          (Array.isArray(tips) && tips.length > 0) ||
          reactionAck === true
        );
      }
    } catch {
      // non-fatal
    }

    const payload = {
      ok: true,
      featureFlags,
      missionsVersion,
      scoresVersion,
      ecologyVersion,
      challengesVersion,
      // kudos signals (baseline)
      reactionsVersion,
      reactionType,
      weatherState,
      forecast72h,
      activeChallenges: await (async () => {
        // Keep baseline behavior for active challenges
        let activeChallenges = [];
        try {
          const keys = await redis('keys', `challenges:${pairId}:*`);
          const challengeKeys = Array.isArray(keys) ? keys : [];
          for (const k of challengeKeys) {
            const raw = await redis('get', k);
            if (!raw) continue;
            let obj = null;
            try { obj = JSON.parse(raw); } catch {}
            if (obj && obj.status !== 'approved') {
              activeChallenges.push({ id: k.split(':').slice(-1)[0], text: obj.text, status: obj.status, expiresAt: obj.expiresAt });
            }
          }
          activeChallenges.sort((a,b) => (a.expiresAt || '').localeCompare(b.expiresAt || ''));
        } catch {}
        return activeChallenges;
      })(),
      isValidConnection: true,
      // FINAL: hasData becomes true when daily feedback OR baseline signals exist
      hasData: Boolean(hasFeedback || hasSignal)
    };

    // Compute ETag from version numbers and weatherState (unchanged)
    const rawEtag = `W/"v.${missionsVersion}.${scoresVersion}.${ecologyVersion}.${challengesVersion}.${weatherState || ''}"`;
    const etag = sanitizeEtag(rawEtag);
    return new Response(JSON.stringify(payload), { status: 200, headers: noStore({ ETag: etag }) });
  } catch (err) {
    return new Response(JSON.stringify({ ok:false, error:String(err.message||err) }), { status: 500, headers: noStore() });
  }
}