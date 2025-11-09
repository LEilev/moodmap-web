// app/api/partner-status/route.js
// Harmony² Feedback Visibility Final Fix — 2025-11-09
//
// Fix: Instead of guessing local vs UTC dates, this version finds the latest feedback:<pairId>:* key directly via Redis.
// This ensures hasData:true whenever feedback exists, regardless of timezone differences or state.currentDate sync issues.
// Also returns latestFeedbackDate in the JSON response (for debugging and front-end sync).
//
// Preserves: Edge runtime, version counters, featureFlags, ETag, TTL refresh, and all existing signals.

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

// ---- Feedback checker ----
async function checkFeedback(pairId, dateKey) {
  const fbKey = `feedback:${pairId}:${dateKey}`;
  const fb = await redis('hgetall', fbKey);
  if (!fb) return false;
  const vibe = typeof fb.vibe === 'string' && fb.vibe.trim().length > 0 ? fb.vibe.trim() : null;
  const n = Number(fb.readiness);
  const readiness = Number.isNaN(n) ? null : n;
  let tips = [];
  if (typeof fb.tips === 'string' && fb.tips.length > 0) {
    try {
      const parsed = JSON.parse(fb.tips);
      if (Array.isArray(parsed)) tips = parsed;
    } catch {}
  }
  const reactionAck = typeof fb.reactionAck === 'string' && fb.reactionAck === '1';
  return Boolean(
    (vibe && vibe.length > 0) ||
    typeof readiness === 'number' ||
    (Array.isArray(tips) && tips.length > 0) ||
    reactionAck
  );
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

    // Feedback visibility (Timezone-Independent Final Fix)
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
