// Harmony Patch 2 — ETag ASCII sanitization + optional ecology TTL (30h) and safer 304/long‑poll
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { Redis } from '@upstash/redis';
import { sanitizeEtag } from '@/lib/etag.js';

function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) throw new Error('Missing Upstash Redis env');
  return new Redis({ url, token });
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

async function computeSyncEnergy7d(redis, pairId, endDate = new Date()) {
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
        let list = [];
        try { list = JSON.parse(mraw) || []; } catch {}
        if (Array.isArray(list) && list.length > 0) {
          daysWithMissions += 1;
          missionsTotal += list.length;
          missionsDone += list.filter(m => m && m.status === 'done').length;
        }
      }
    } catch {}
    try {
      const r = await redis.hgetall(`reactions:${pairId}:${dKey}`);
      if (r && (r.type || r.note || r.time)) kudosDays += 1;
    } catch {}
  }
  const missionPct = missionsTotal > 0
    ? clamp(Math.round((missionsDone / missionsTotal) * 100))
    : (daysWithMissions > 0 ? 0 : 50);
  const kudosPct = clamp(Math.round((kudosDays / 7) * 100));
  return clamp(Math.round(0.5 * missionPct + 0.5 * kudosPct));
}

function energyToWeather(e) {
  if (e < 40) return 'stormy';
  if (e < 55) return 'rainy';
  if (e < 80) return 'cloudy';
  return 'sunny';
}
function energyToMood(e) {
  if (e < 40) return 'stormy';
  if (e > 80) return 'vibrant';
  return 'calm';
}

async function resolveGarden(redis, pairId, syncEnergyScore) {
  // Derive glow from today's last reaction (2h window)
  let glowUntil = null;
  try {
    const react = await redis.hgetall(`reactions:${pairId}:${todayKeyUTC()}`);
    if (react && react.time) {
      const t = Date.parse(String(react.time));
      if (!Number.isNaN(t)) {
        const until = new Date(t + 2 * 60 * 60 * 1000);
        if (until > new Date()) glowUntil = until.toISOString();
      }
    }
  } catch {}

  // Base mapping
  let gardenMood = energyToMood(syncEnergyScore);
  let weatherState = energyToWeather(syncEnergyScore);

  // Persist ecology:{pairId} and bump gardenMoodVersion if changed
  let shouldBumpGarden = false;
  try {
    const ecoKey = `ecology:${pairId}`;
    const cur = await redis.hgetall(ecoKey);
    const prevMood = cur?.gardenMood || null;
    const prevWeather = cur?.weatherState || null;
    await redis.hset(ecoKey, { gardenMood, weatherState, syncEnergy: String(syncEnergyScore), glowUntil: glowUntil || '' });
    // Harmony Patch 2: ensure TTL ~30h
    try { await redis.expire(ecoKey, 108000); } catch {}
    if (prevMood !== gardenMood || prevWeather !== weatherState) {
      shouldBumpGarden = true;
    }
  } catch {}

  return { gardenMood, weatherState, glowUntil, shouldBumpGarden };
}

async function listActiveChallenges(redis, pairId, limit=3) {
  // scan for keys challenges:{pairId}:*
  let cursor = 0;
  const keys = [];
  try {
    do {
      const res = await redis.scan(cursor, { match: `challenges:${pairId}:*`, count: 50 });
      cursor = Number(res[0]);
      const batch = res[1] || [];
      for (const k of batch) {
        // ignore non-item keys if any
        if (typeof k === 'string' && k.startsWith(`challenges:${pairId}:`)) {
          keys.push(k);
        }
      }
    } while (cursor !== 0 && keys.length < 24);
  } catch {}

  const items = [];
  for (const k of keys) {
    try {
      const raw = await redis.get(k);
      if (!raw) continue;
      const obj = JSON.parse(raw);
      if (!obj || !obj.expiresAt) continue;
      if (Date.parse(obj.expiresAt) <= Date.now()) continue; // expired by time (belt+suspenders; TTL should drop key)
      // derive id from key tail
      const id = k.split(':').slice(-1)[0];
      items.push({ id, text: obj.text || '', status: obj.status || 'pending', createdAt: obj.createdAt || null, expiresAt: obj.expiresAt || null });
    } catch {}
  }
  items.sort((a,b) => (Date.parse(a.expiresAt||0) - Date.parse(b.expiresAt||0)));
  return items.slice(0, limit);
}

function forecastFromEnergy(e0) {
  const ease = (a,b,alpha) => a + (b - a) * alpha;
  const e1 = clamp(Math.round(ease(e0, 50, 0.10))); // regress slightly to mean
  const e2 = clamp(Math.round(ease(e1, 50, 0.10)));
  const e3 = clamp(Math.round(ease(e2, 50, 0.10)));
  return [energyToWeather(e1), energyToWeather(e2), energyToWeather(e3)];
}

async function snapshot(redis, pairId, ownerDate) {
  const state = await redis.hgetall(`state:${pairId}`);
  const version = Number(state?.version || 0);
  const missionsVersion = Number(state?.missionsVersion || 0);
  const scoresVersion = Number(state?.scoresVersion || 0);
  const reactionsVersion = Number(state?.reactionsVersion || 0);
  const insightsVersion = Number(state?.insightsVersion || 0);
  const ecologyVersion = Number(state?.ecologyVersion || 0);
  const challengesVersion = Number(state?.challengesVersion || 0);
  const gardenMoodVersion = Number(state?.gardenMoodVersion || 0);

  // Feature flags
  const ff_coachMode = true;
  const ff_missions = true;
  const ff_scores = true;
  const ff_badges = String(state?.ff_badges || '').toLowerCase() === 'true' || false;
  const ff_insights = String(process.env.FF_INSIGHTS || '').toLowerCase() === 'true' ? true : false;
  const ff_reactions = String(process.env.FF_REACTIONS || '').toLowerCase() === 'true' ? true : false;
  const ff_challenges = String(process.env.FF_CHALLENGES || '').toLowerCase() === 'true' ? true : false;
  const ff_garden = String(process.env.FF_GARDEN || process.env.FF_ECOLOGY || '').toLowerCase() === 'true' ? true : false;
  const featureFlags = { ff_coachMode, ff_missions, ff_scores, ff_badges, ff_insights, ff_reactions, ff_challenges, ff_garden };

  // Feedback (tips/vibe/readiness)
  const fbKey = `feedback:${pairId}:${ownerDate || todayKeyUTC().replaceAll('-','')}`; // legacy compat
  const fb = await redis.hgetall(fbKey);
  let tips = [];
  let vibe = null;
  let readiness = null;
  try { tips = Array.isArray(fb?.tips) ? fb.tips : (fb?.tips ? JSON.parse(fb.tips) : []); } catch { tips = []; }
  vibe = fb?.vibe ?? null;
  readiness = fb?.readiness != null ? Number(fb.readiness) : null;

  // Reaction today
  const reactKey = `reactions:${pairId}:${todayKeyUTC()}`;
  const react = await redis.hgetall(reactKey);
  const reactionType = react?.type || null;

  // Harmony: compute syncEnergyScore (cheap 7d scan)
  const syncEnergyScore = await computeSyncEnergy7d(redis, pairId, new Date());

  // Garden resolve (mood/weather/glow) + optionally bump gardenMoodVersion
  const { gardenMood, weatherState, glowUntil, shouldBumpGarden } = await resolveGarden(redis, pairId, syncEnergyScore);
  if (shouldBumpGarden) {
    await redis.hincrby(`state:${pairId}`, 'gardenMoodVersion', 1);
  }
  const curGardenMoodVersion = shouldBumpGarden ? (gardenMoodVersion + 1) : gardenMoodVersion;

  // Active challenges
  const activeChallenges = featureFlags.ff_challenges ? await listActiveChallenges(redis, pairId, 3) : [];

  // Lightweight 72h forecast (3 slots)
  const forecast72h = forecastFromEnergy(syncEnergyScore);

  const payload = {
    ok: true,
    hasData: Boolean(tips && tips.length),
    version, missionsVersion, scoresVersion, reactionsVersion, insightsVersion,
    ecologyVersion, challengesVersion, gardenMoodVersion: curGardenMoodVersion, syncEnergyScore,
    featureFlags,
    tips, vibe, readiness,
    reactionType,
    weatherState,
    forecast72h,
    activeChallenges,
  };

  // Compact signature so that challenge expiry also breaks ETag
  const chCount = activeChallenges.length;
  const nextExp = chCount ? Math.floor(Math.min(...activeChallenges.map(c => Date.parse(c.expiresAt||0))) / 60000) : 0;
  const simpleEtag = `W/"${version}.${missionsVersion}.${scoresVersion}.${reactionsVersion}.${insightsVersion}.${ecologyVersion}.${challengesVersion}.${curGardenMoodVersion}.${syncEnergyScore}.${(tips?.length||0)}.${String(vibe||'')}.${String(readiness||'')}.${weatherState}.${chCount}.${nextExp}.${featureFlags.ff_insights?'1':'0'}${featureFlags.ff_reactions?'1':'0'}${featureFlags.ff_badges?'1':'0'}${featureFlags.ff_challenges?'1':'0'}${featureFlags.ff_garden?'1':'0'}"`;
  return { payload, etag: simpleEtag };
}

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const pairId = url.searchParams.get('pairId') || req.headers.get('x-mm-pair') || '';
    const ownerDate = url.searchParams.get('ownerDate') || null;
    const wait = Math.min(25, Math.max(0, Number(url.searchParams.get('wait') || 0)));
    if (!pairId) return json({ ok:false, error: 'Missing pairId' }, 400);

    const redis = getRedis();
    let { payload, etag } = await snapshot(redis, pairId, ownerDate);
    let safeEtag = sanitizeEtag(String(etag || ''));

    const ifNoneMatch = req.headers.get('if-none-match');
    if (ifNoneMatch && ifNoneMatch === safeEtag) {
      if (wait <= 0) {
        return new Response(null, { status: 304, headers: { ETag: safeEtag, 'Cache-Control': 'no-store' } });
      }
      // Long-poll until changed or timeout
      const started = Date.now();
      while ((Date.now() - started) < wait * 1000) {
        const snap2 = await snapshot(redis, pairId, ownerDate);
        if (snap2.etag !== etag) {
          payload = snap2.payload;
          etag = snap2.etag;
          safeEtag = sanitizeEtag(String(etag || ''));
          break;
        }
        // small async pause
        await new Promise(r => setTimeout(r, 350));
      }
    }

    const hdr = safeEtag ? { ETag: safeEtag } : {};
    return json(payload, 200, hdr);
  } catch (e) {
    return json({ ok:false, error: String(e?.message || e) }, 500);
  }
}
