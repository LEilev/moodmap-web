// Harmony Sync-Fix – 2025-11-10
// Sprint E: Hydration guard + 304 handling + Stable Partner Sync

export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { Redis } from '@upstash/redis';
import { sanitizeEtag } from '../_utils/sanitizeEtag.js';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const DEV = process.env.NODE_ENV !== 'production';
function devLog(...args) { if (DEV) { try { console.log('[HarmonyDev][partner-garden]', ...args); } catch {} } }

function noStore(extra = {}) { return { 'Cache-Control': 'no-store', 'Content-Type': 'application/json; charset=utf-8', ...extra }; }
function dayIso(d = new Date()) { return d.toISOString().slice(0,10); }
function addDays(d, n) { const x = new Date(d); x.setUTCDate(x.getUTCDate()+n); return x; }
function clamp(n, lo=0, hi=100) { return Math.max(lo, Math.min(hi, n)); }

async function computeSyncEnergy7d(pairId, endDate = new Date()) {
  let kudosDays = 0, daysWithMissions = 0, missionsDone = 0, missionsTotal = 0;
  for (let i=0;i<7;i++) {
    const dKey = dayIso(addDays(endDate, -i));
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
      const r = await redis.hgetall(`reactions:${pairId}:${dKey}`);
      if (r && (r.type || r.note || r.time)) kudosDays += 1;
    } catch {}
  }
  const missionPct = missionsTotal > 0 ? clamp(Math.round((missionsDone / missionsTotal) * 100)) : (daysWithMissions > 0 ? 0 : 50);
  const kudosPct = clamp(Math.round((kudosDays / 7) * 100));
  return { energy: clamp(Math.round(0.5 * missionPct + 0.5 * kudosPct)), hasSignal: (kudosDays + missionsTotal) > 0 };
}
function energyToWeather(e) { if (e < 40) return 'stormy'; if (e < 55) return 'rainy'; if (e < 80) return 'cloudy'; return 'sunny'; }
function energyToMood(e) { if (e < 40) return 'stormy'; if (e > 80) return 'vibrant'; return 'calm'; }

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const pairId = url.searchParams.get('pairId') || req.headers.get('x-mm-pair') || '';
    if (!pairId) return new Response(JSON.stringify({ ok:false, error:'Missing pairId' }), { status: 400, headers: noStore() });

    const blocked = await redis.get(`blocklist:${pairId}`);
    if (blocked) { return new Response(JSON.stringify({ ok:false, error:'blocked' }), { status: 403, headers: noStore() }); }

    const { energy, hasSignal } = await computeSyncEnergy7d(pairId, new Date());
    let glowUntil = null;
    try {
      const react = await redis.hgetall(`reactions:${pairId}:${dayIso(new Date())}`);
      if (react && react.time) {
        const t = Date.parse(String(react.time));
        if (!Number.isNaN(t)) {
          const until = new Date(t + 30 * 60 * 1000);
          if (until > new Date()) glowUntil = until.toISOString();
        }
      }
    } catch {}

    const gardenMood = energyToMood(energy);
    const weatherState = energyToWeather(energy);

    try {
      const ecoKey = `ecology:${pairId}`;
      const raw = await redis.hgetall(ecoKey);
      const prevMood = raw?.gardenMood || null;
      const prevWeather = raw?.weatherState || null;
      await redis.hset(ecoKey, { gardenMood, weatherState, syncEnergy: String(energy), glowUntil: glowUntil || '' });
      try { await redis.expire(ecoKey, 108000); } catch {}
      if (prevMood !== gardenMood || prevWeather !== weatherState) {
        await redis.hincrby(`state:${pairId}`, 'gardenMoodVersion', 1);
        await redis.hincrby(`state:${pairId}`, 'ecologyVersion', 1);
      }
    } catch {}

    const rawEtag = `W/"g.${gardenMood}.${weatherState}.${energy}.${glowUntil || ''}"`;
    const etag = sanitizeEtag(rawEtag);

    // ALWAYS 200 JSON (no 304)
    return new Response(JSON.stringify({ ok:true, hasData: hasSignal, gardenMood, syncEnergy: energy, weatherState, glowUntil }), {
      status: 200, headers: noStore({ ETag: etag }),
    });
  } catch (err) {
    return new Response(JSON.stringify({ ok:false, error: String(err?.message || err) }), { status: 500, headers: noStore() });
  }
}
