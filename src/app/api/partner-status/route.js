// Harmony Sync-Fix – 2025-11-10
// Sprint E: Hydration guard + 304 handling + PartnerModeGate crash-fix

// Harmony v5.1.2 — First Sync Fix + Sprint E: Remove 304, always 200 JSON
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { Redis } from '@upstash/redis';
import { sanitizeEtag } from '../_utils/sanitizeEtag.js';

const DEV = process.env.NODE_ENV !== 'production';
function devLog(...args) { if (DEV) { try { console.log('[HarmonyDev][partner-status]', ...args); } catch {} } }

function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) throw new Error('Missing Upstash Redis env');
  return new Redis({ url, token });
}

function readFlag(name, fallback = false) {
  const v = (process.env[name] ?? process.env[`EXPO_PUBLIC_${name}`] ?? '').toString().toLowerCase();
  if (v === 'true') return true;
  if (v === 'false') return false;
  return fallback;
}

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...extraHeaders },
  });
}

function todayKeyUTC() {
  const d = new Date();
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`; // yyyy-mm-dd
}
function addDaysUTC(d, delta) { const x = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())); x.setUTCDate(x.getUTCDate()+delta); return x; }
function isoDay(d=new Date()) { return d.toISOString().slice(0,10); }
function clamp(n, lo=0, hi=100) { return Math.max(lo, Math.min(hi, n)); }

function normalizeOwnerDate(input) {
  if (!input) return null;
  const s = String(input).trim();
  if (/^\d{8}$/.test(s)) return `${s.slice(0,4)}-${s.slice(4,6)}-${s.slice(6,8)}`;
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const dt = new Date(s); if (!Number.isNaN(dt)) return isoDay(dt);
  return null;
}

// --- Emoji-sensitive ASCII representation for ETag slot(s) ---
function fnv1a32Hex(str) {
  let h = 0x811c9dc5 >>> 0;
  for (let i=0; i<str.length; i++) {
    h ^= str.charCodeAt(i);
    h = (h >>> 0) + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24));
  }
  return (h >>> 0).toString(16).padStart(8, '0');
}
function asciiWithEmojiHash(input) {
  if (input == null) return '';
  const s = String(input);
  const ascii = s.replace(/[^\x20-\x7E]/g, '');
  if (ascii.length === s.length) return ascii; // no emoji/non-ascii
  const hex = fnv1a32Hex(s);
  return ascii.length ? `${ascii}~${hex}` : `~${hex}`;
}

async function computeSyncEnergy7d(redis, pairId, endDate = new Date(), todayReaction = null) {
  let kudosDays = 0;
  let daysWithMissions = 0;
  let missionsDone = 0;
  let missionsTotal = 0;
  for (let i=0;i<7;i++) {
    const d = addDaysUTC(endDate, -i);
    const dKey = isoDay(d);
    try {
      const mraw = await redis.get(`missions:${pairId}:${dKey}`);
      if (mraw) {
        let list = []; try { list = JSON.parse(mraw) || []; } catch {} 
        if (Array.isArray(list) && list.length > 0) {
          daysWithMissions += 1; missionsTotal += list.length; missionsDone += list.filter(m => m && m.status === 'done').length;
        }
      }
    } catch {} 
    try {
      if (i === 0 && todayReaction) {
        if (todayReaction.type || todayReaction.note || todayReaction.time) kudosDays += 1;
      } else {
        const r = await redis.hgetall(`reactions:${pairId}:${dKey}`);
        if (r && (r.type || r.note || r.time)) kudosDays += 1;
      }
    } catch {} 
  }
  const missionPct = missionsTotal > 0 ? clamp(Math.round((missionsDone / missionsTotal) * 100)) : (daysWithMissions > 0 ? 0 : 50);
  const kudosPct = clamp(Math.round((kudosDays / 7) * 100));
  return clamp(Math.round(0.5 * missionPct + 0.5 * kudosPct));
}

function energyToWeather(e) { if (e < 40) return 'stormy'; if (e < 55) return 'rainy'; if (e < 80) return 'cloudy'; return 'sunny'; }
function energyToMood(e) { if (e < 40) return 'stormy'; if (e > 80) return 'vibrant'; return 'calm'; }

async function resolveGarden(redis, pairId, syncEnergyScore, todayReaction = null) {
  let glowUntil = null;
  try {
    const react = todayReaction || (await redis.hgetall(`reactions:${pairId}:${todayKeyUTC()}`));
    if (react && react.time) {
      const t = Date.parse(String(react.time));
      if (!Number.isNaN(t)) {
        const until = new Date(t + 30 * 60 * 1000);
        if (until > new Date()) glowUntil = until.toISOString();
      }
    }
  } catch {} 

  let gardenMood = energyToMood(syncEnergyScore);
  let weatherState = energyToWeather(syncEnergyScore);

  let shouldBumpGarden = false;
  try {
    const ecoKey = `ecology:${pairId}`;
    const cur = await redis.hgetall(ecoKey);
    const prevMood = cur?.gardenMood || null;
    const prevWeather = cur?.weatherState || null;
    await redis.hset(ecoKey, { gardenMood, weatherState, syncEnergy: String(syncEnergyScore), glowUntil: glowUntil || '' });
    try { await redis.expire(ecoKey, 108000); } catch {}
    if (prevMood !== gardenMood || prevWeather !== weatherState) shouldBumpGarden = true;
  } catch {} 

  return { gardenMood, weatherState, glowUntil, shouldBumpGarden };
}

async function readFeedback(redis, pairId, dayIso) {
  const dashed = `feedback:${pairId}:${dayIso}`;
  const legacy = `feedback:${pairId}:${dayIso.replaceAll('-','')}`;
  let fb = await redis.hgetall(dashed);
  if (!fb || Object.keys(fb).length === 0) fb = await redis.hgetall(legacy);
  return fb || null;
}

async function snapshot(redis, pairId, ownerDateParam) {
  const stateKey = `state:${pairId}`;
  const state = await redis.hgetall(stateKey);
  const version = Number(state?.version || 0);
  const missionsVersion = Number(state?.missionsVersion || 0);
  const scoresVersion = Number(state?.scoresVersion || 0);
  const reactionsVersion = Number(state?.reactionsVersion || 0);
  const insightsVersion = Number(state?.insightsVersion || 0);
  const ecologyVersion = Number(state?.ecologyVersion || 0);
  const challengesVersion = Number(state?.challengesVersion || 0);
  const gardenMoodVersion = Number(state?.gardenMoodVersion || 0);

  const isValidConnection = !(['false','0'].includes(String(state?.isValidConnection || '').toLowerCase()));

  const featureFlags = {
    ff_coach:      readFlag('FF_COACH', true),
    ff_garden:     readFlag('FF_GARDEN', true),
    ff_ecology:    readFlag('FF_ECOLOGY', true),
    ff_challenges: readFlag('FF_CHALLENGES', true),
    ff_reactions:  readFlag('FF_REACTIONS', true),
    ff_insights:   readFlag('FF_INSIGHTS', true),
    ff_coachMode:  readFlag('FF_COACH', true),
    ff_missions:   true,
    ff_scores:     true,
    ff_badges:     (String(state?.ff_badges || '').toLowerCase() === 'true') || readFlag('FF_BADGES', false),
  };

  const stateDate = state?.currentDate ? normalizeOwnerDate(state.currentDate) : null;
  const reqDate = normalizeOwnerDate(ownerDateParam);
  const dayIso = stateDate || reqDate || todayKeyUTC();

  const fb = await readFeedback(redis, pairId, dayIso);
  let tips = []; let vibe = null; let readiness = null;
  try { tips = Array.isArray(fb?.tips) ? fb.tips : (fb?.tips ? JSON.parse(fb.tips) : []); } catch { tips = []; }
  vibe = fb?.vibe ?? null;
  readiness = fb?.readiness != null ? Number(fb.readiness) : null;

  const reactKey = `reactions:${pairId}:${todayKeyUTC()}`;
  const react = await redis.hgetall(reactKey);
  const reactionType = react?.type || null;

  const syncEnergyScore = await computeSyncEnergy7d(redis, pairId, new Date(), react);

  const { gardenMood, weatherState, glowUntil, shouldBumpGarden } = await resolveGarden(redis, pairId, syncEnergyScore, react);
  if (shouldBumpGarden) await redis.hincrby(stateKey, 'gardenMoodVersion', 1);
  const curGardenMoodVersion = shouldBumpGarden ? (gardenMoodVersion + 1) : gardenMoodVersion;

  // Active challenges
  let _activeChallenges = [];
  try {
    let cursor = 0; const keys = [];
    do {
      const res = await redis.scan(cursor, { match: `challenges:${pairId}:*`, count: 50 });
      cursor = Number(res[0] || 0); const batch = res[1] || [];
      for (const k of batch) if (typeof k === 'string' && k.startsWith(`challenges:${pairId}:`)) keys.push(k);
    } while (cursor !== 0 && keys.length < 24);
    for (const k of keys) {
      try {
        const raw = await redis.get(k); if (!raw) continue;
        const obj = JSON.parse(raw); if (!obj || !obj.expiresAt) continue;
        if (Date.parse(obj.expiresAt) <= Date.now()) continue; // expired
        const id = k.split(':').slice(-1)[0];
        _activeChallenges.push({ id, text: obj.text || '', status: obj.status || 'pending', createdAt: obj.createdAt || null, expiresAt: obj.expiresAt || null });
      } catch {}
    }
    _activeChallenges.sort((a,b) => (Date.parse(a.expiresAt||0) - Date.parse(b.expiresAt||0)));
  } catch {}
  const active = _activeChallenges.slice(0,3);

  const forecast72h = (() => {
    const ease = (a,b,alpha) => a + (b - a) * alpha;
    const e1 = clamp(Math.round(ease(syncEnergyScore, 50, 0.10)));
    const e2 = clamp(Math.round(ease(e1, 50, 0.10)));
    const e3 = clamp(Math.round(ease(e2, 50, 0.10)));
    const toW = (e) => (e < 40 ? 'stormy' : e < 55 ? 'rainy' : e < 80 ? 'cloudy' : 'sunny');
    return [toW(e1), toW(e2), toW(e3)];
  })();

  const hasData = (Array.isArray(tips) && tips.length > 0) ||
                  (typeof vibe === 'string' && vibe.length > 0) ||
                  (typeof readiness === 'number' && readiness > 0);

  const payload = {
    ok: true,
    hasData,
    version, missionsVersion, scoresVersion, reactionsVersion, insightsVersion,
    ecologyVersion, challengesVersion, gardenMoodVersion: curGardenMoodVersion, syncEnergyScore,
    featureFlags,
    tips, vibe, readiness,
    reactionType,
    weatherState,
    forecast72h,
    activeChallenges: active,
    day: dayIso,
    isValidConnection,
  };

  const chCount = active.length;
  const nextExp = chCount ? Math.floor(Math.min(...active.map(c => Date.parse(c.expiresAt||0))) / 60000) : 0;
  const vibeSlot = asciiWithEmojiHash(vibe || '');
  const rawEtag = `W/"${version}.${missionsVersion}.${scoresVersion}.${reactionsVersion}.${insightsVersion}.${ecologyVersion}.${challengesVersion}.${curGardenMoodVersion}.${syncEnergyScore}.${(tips?.length||0)}.${vibeSlot}.${String(readiness||'')}.${weatherState}.${chCount}.${nextExp}.${featureFlags.ff_insights?'1':'0'}${featureFlags.ff_reactions?'1':'0'}${featureFlags.ff_badges?'1':'0'}${featureFlags.ff_challenges?'1':'0'}${featureFlags.ff_garden?'1':'0'}${featureFlags.ff_coach?'1':'0'}${featureFlags.ff_ecology?'1':'0'}"`;

  return { payload, etag: rawEtag };
}

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const pairId = url.searchParams.get('pairId') || req.headers.get('x-mm-pair') || '';
    const ownerDate = url.searchParams.get('ownerDate') || null;
    if (!pairId) return json({ ok:false, error: 'Missing pairId' }, 400);

    const redis = getRedis();

    // Symmetric unlink: immediate 403 when blocklisted
    const blocked = await redis.get(`blocklist:${pairId}`);
    if (blocked) { devLog('403 blocklist hit', { pairId }); return json({ ok:false, error: 'blocked' }, 403); }

    const { payload, etag } = await snapshot(redis, pairId, ownerDate);
    const safeEtag = sanitizeEtag(String(etag || ''));
    // Sprint E: ALWAYS return 200 JSON (no 304), still attach ETag for client-side ref
    return json(payload, 200, safeEtag ? { ETag: safeEtag } : {});
  } catch (e) {
    return json({ ok:false, error: String(e?.message || e) }, 500);
  }
}
