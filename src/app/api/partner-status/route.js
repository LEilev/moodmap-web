// app/api/partner-status/route.js
// Harmony² Feedback Visibility Mini-Patch — 2025-11-09
//
// Scope: Readiness detection & flexible truthy parsing in checkFeedback()
// - Accept both string and numeric readiness (e.g. "7" or 7)
// - Consider hasFeedback=true when any of: vibe(non-empty), readiness(numeric or string numeric), tips(non-empty array), reactionAck:true
// - Robustly parse Upstash HGETALL result whether it's an array [field,value,...] or an object
//
// Preserves: Edge runtime, Redis key lookup, latestFeedbackDate derivation, featureFlags, ETag, TTL refresh, and all other logic.

import { sanitizeEtag } from '../_utils/sanitizeEtag.js';
export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const STATE_TTL_SEC = 7 * 24 * 60 * 60;

function noStore(extra = {}) {
  return {
    'Cache-Control': 'no-store',
    'Content-Type': 'application/json; charset=utf-8',
    ...extra
  };
}
async function redis(cmd, ...args) {
  const url = `${UPSTASH_URL}/${cmd}/${args.map(a => encodeURIComponent(String(a))).join('/')}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` }
  });
  if (!res.ok) throw new Error(`Upstash ${cmd} failed: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data.result;
}

// ---- Date helpers ----
function normalizeOwnerDate(input) {
  if (!input) return null;
  const s = String(input).trim();
  if (/^\d{8}$/.test(s))
    return `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`;
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const dt = new Date(s);
  if (!Number.isNaN(dt)) return dt.toISOString().slice(0, 10);
  return null;
}
function todayKeyUTC() {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
}
function todayKeyLocal() {
  const now = new Date();
  const offsetMin = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offsetMin * 60000);
  return local.toISOString().slice(0, 10);
}

// ---- Helpers for HGETALL result normalization & truthiness ----
function objectFromHGetAll(raw) {
  if (!raw) return null;
  if (Array.isArray(raw)) {
    const obj = {};
    for (let i = 0; i < raw.length; i += 2) {
      const k = raw[i];
      const v = raw[i + 1];
      if (typeof k === 'string') obj[k] = v;
    }
    return obj;
  }
  if (typeof raw === 'object') return raw;
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') return parsed;
    } catch {}
  }
  return null;
}
function toBooleanFlexible(v) {
  if (typeof v === 'boolean') return v;
  if (typeof v === 'number') return v !== 0;
  if (typeof v === 'string') {
    const s = v.trim().toLowerCase();
    return s === '1' || s === 'true' || s === 'yes' || s === 'y' || s === 'on';
  }
  return false;
}
function parseTips(value) {
  if (value == null) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    const s = value.trim();
    if (!s) return [];
    if (s.startsWith('[') || s.startsWith('{')) {
      try {
        const parsed = JSON.parse(s);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    // Fallback: comma-separated list
    return s.split(',').map(t => t.trim()).filter(Boolean);
  }
  return [];
}

// ---- Feedback checker (patched) ----
async function checkFeedback(pairId, dateKey) {
  const fbKey = `feedback:${pairId}:${dateKey}`;
  const raw = await redis('hgetall', fbKey);
  if (!raw) return false;

  const fb = objectFromHGetAll(raw);
  if (!fb) return false;

  // vibe: non-empty string (accept non-string by coercion to string)
  const vibeStr = fb.vibe != null ? String(fb.vibe).trim() : '';
  const hasVibe = vibeStr.length > 0;

  // readiness: accept number or numeric string (e.g. 7 or "7")
  let hasReadiness = false;
  if (fb.readiness != null) {
    if (typeof fb.readiness === 'number') {
      hasReadiness = !Number.isNaN(fb.readiness);
    } else {
      const n = Number(String(fb.readiness).trim());
      hasReadiness = !Number.isNaN(n);
    }
  }

  // tips: non-empty array (accept JSON string or comma-separated)
  const tips = parseTips(fb.tips);
  const hasTips = Array.isArray(tips) && tips.length > 0;

  // reactionAck: true (accept true/"true"/1/"1"/yes/y/on)
  const hasReactionAck = toBooleanFlexible(fb.reactionAck);

  return hasVibe || hasReadiness || hasTips || hasReactionAck;
}

export async function GET(req) {
  try {
    if (!UPSTASH_URL || !UPSTASH_TOKEN) {
      return new Response(JSON.stringify({ ok: false, error: 'Missing Upstash env' }), { status: 500, headers: noStore() });
    }

    const url = new URL(req.url);
    const pairId = url.searchParams.get('pairId') || req.headers.get('x-mm-pair') || '';
    if (!pairId) {
      return new Response(JSON.stringify({ ok: false, error: 'Missing pairId' }), { status: 400, headers: noStore() });
    }

    // Blocklist
    const blocked = await redis('get', `blocklist:${pairId}`);
    if (blocked) {
      return new Response(JSON.stringify({ ok: false, isValidConnection: false, error: 'blocked' }), { status: 403, headers: noStore() });
    }

    const stateKey = `state:${pairId}`;
    const state = (await redis('hgetall', stateKey)) || {};
    try {
      // refresh TTL
      await redis('expire', stateKey, STATE_TTL_SEC);
      await redis('expire', `ecology:${pairId}`, STATE_TTL_SEC);
    } catch {}

    const missionsVersion    = Number(state.missionsVersion)   || 0;
    const scoresVersion      = Number(state.scoresVersion)     || 0;
    const ecologyVersion     = Number(state.ecologyVersion)    || 0;
    const challengesVersion  = Number(state.challengesVersion) || 0;
    const reactionsVersion   = Number(state.reactionsVersion)  || 0;
    const reactionType       = state.reactionType || state.lastReactionType || null;

    // Weather state
    let weatherState = state.weatherState || null;
    let forecast72h = [];
    if (!weatherState) {
      const e = Number(state.syncEnergy) || 50;
      weatherState = e < 40 ? 'stormy' : e < 55 ? 'rainy' : e < 80 ? 'cloudy' : 'sunny';
    }
    if (state.forecast72h) {
      try { forecast72h = JSON.parse(state.forecast72h); } catch {}
    }

    // Feature flags (ensure defaults true if undefined)
    let featureFlags = {};
    try {
      featureFlags = state.featureFlags ? JSON.parse(state.featureFlags) : {};
    } catch {}
    for (const key of ['ff_garden','ff_challenges','ff_insights','ff_badges','ff_missions']) {
      if (featureFlags[key] === undefined) featureFlags[key] = true;
    }

    // Signal check (last 7 days for any reactions or missions)
    let hasSignal = false;
    try {
      for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setUTCDate(d.getUTCDate() - i);
        const dKey = d.toISOString().slice(0, 10);
        const r = await redis('hgetall', `reactions:${pairId}:${dKey}`);
        const m = await redis('get', `missions:${pairId}:${dKey}`);
        if ((r && (r.type || r.note || r.time)) || m) {
          hasSignal = true;
          break;
        }
      }
    } catch {}

    // Feedback visibility (Timezone-Independent Final Fix stays unchanged)
    let hasFeedback = false;
    let latestFeedbackDate = null;
    try {
      const fbKeys = await redis('keys', `feedback:${pairId}:*`);
      if (Array.isArray(fbKeys) && fbKeys.length > 0) {
        // find lexicographically latest key (keys are in YYYY-MM-DD format)
        let latestKey = '';
        for (const k of fbKeys) {
          if (typeof k === 'string' && k.localeCompare(latestKey) > 0) {
            latestKey = k;
          }
        }
        if (latestKey) {
          latestFeedbackDate = latestKey.split(':').pop();
          hasFeedback = await checkFeedback(pairId, latestFeedbackDate);
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
      reactionsVersion,
      reactionType,
      weatherState,
      forecast72h,
      activeChallenges: await (async () => {
        let active = [];
        try {
          const keys = await redis('keys', `challenges:${pairId}:*`);
          for (const k of Array.isArray(keys) ? keys : []) {
            const raw = await redis('get', k);
            if (!raw) continue;
            let obj = null;
            try { obj = JSON.parse(raw); } catch {}
            if (obj && obj.status !== 'approved') {
              active.push({
                id: k.split(':').slice(-1)[0],
                text: obj.text,
                status: obj.status,
                expiresAt: obj.expiresAt
              });
            }
          }
          active.sort((a, b) => (a.expiresAt || '').localeCompare(b.expiresAt || ''));
        } catch {}
        return active;
      })(),
      isValidConnection: true,
      hasData: Boolean(hasFeedback || hasSignal),
      latestFeedbackDate
    };

    const rawEtag = `W/"v.${missionsVersion}.${scoresVersion}.${ecologyVersion}.${challengesVersion}.${weatherState || ''}"`;
    const etag = sanitizeEtag(rawEtag);
    return new Response(JSON.stringify(payload), { status: 200, headers: noStore({ ETag: etag }) });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: String(err.message || err) }), { status: 500, headers: noStore() });
  }
}
