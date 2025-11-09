// app/api/partner-status/route.js — Harmony² Fix: reactionsVersion + reactionType + TTL renewal
// Based on Harmony Implementation & Improvement Pack
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

    // NEW: expose kudos-change signals to clients
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
    // forecast - if any cached or precomputed exists (for simplicity)
    if (state.forecast72h) {
      try { forecast72h = JSON.parse(state.forecast72h); } catch {}
    }
    // Feature flags (if any stored or default to enabling core features)
    let featureFlags = {};
    try {
      featureFlags = state.featureFlags ? JSON.parse(state.featureFlags) : {};
    } catch {
      featureFlags = {};
    }
    // Ensure known flags present (default true for rollout features)
    if (featureFlags.ff_garden === undefined) featureFlags.ff_garden = true;
    if (featureFlags.ff_challenges === undefined) featureFlags.ff_challenges = true;
    if (featureFlags.ff_insights === undefined) featureFlags.ff_insights = true;
    if (featureFlags.ff_badges === undefined) featureFlags.ff_badges = true;
    if (featureFlags.ff_missions === undefined) featureFlags.ff_missions = true;

    // Active challenges listing
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
      // Sort challenges by expiresAt ascending for consistency
      activeChallenges.sort((a,b) => {
        return (a.expiresAt || '').localeCompare(b.expiresAt || '');
      });
    } catch {}

    // Determine connection hasData flag (if any partner data present)
    // For now, treat presence of any missions or reactions in last week as signal
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

    const payload = {
      ok: true,
      featureFlags,
      missionsVersion,
      scoresVersion,
      ecologyVersion,
      challengesVersion,
      // NEW: kudos signals
      reactionsVersion,
      reactionType,
      weatherState,
      forecast72h,
      activeChallenges,
      isValidConnection: true,
      hasData: hasSignal
    };

    // Compute ETag from version numbers and weatherState (keep stable to avoid over-invalidation)
    const rawEtag = `W/"v.${missionsVersion}.${scoresVersion}.${ecologyVersion}.${challengesVersion}.${weatherState || ''}"`;
    const etag = sanitizeEtag(rawEtag);
    return new Response(JSON.stringify(payload), { status: 200, headers: noStore({ ETag: etag }) });
  } catch (err) {
    return new Response(JSON.stringify({ ok:false, error:String(err.message||err) }), { status: 500, headers: noStore() });
  }
}
