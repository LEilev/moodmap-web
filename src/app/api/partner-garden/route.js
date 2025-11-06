// app/api/partner-garden/route.js — Harmony Patch 2
// Returns garden ecology snapshot for UI overlays
export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

function noStoreHeaders(extra = {}) {
  return { 'Cache-Control': 'no-store', 'Content-Type': 'application/json; charset=utf-8', ...extra };
}

async function redis(cmd, ...args) {
  const url = `${UPSTASH_URL}/${cmd}/${args.map(a => encodeURIComponent(String(a))).join('/')}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` } });
  if (!res.ok) throw new Error(`Upstash ${cmd} failed: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data.result;
}

function dayIso(d = new Date()) { return d.toISOString().slice(0,10); }
function addDays(d, n) { const x = new Date(d); x.setUTCDate(x.getUTCDate()+n); return x; }
function clamp(n, lo=0, hi=100) { return Math.max(lo, Math.min(hi, n)); }

async function computeSyncEnergy7d(pairId, endDate = new Date()) {
  let kudosDays = 0, daysWithMissions = 0, missionsDone = 0, missionsTotal = 0;
  for (let i=0;i<7;i++) {
    const dKey = dayIso(addDays(endDate, -i));
    try {
      const mraw = await redis('get', `missions:${pairId}:${dKey}`);
      if (mraw) {
        let list = []; try { list = JSON.parse(mraw) || []; } catch {}
        if (Array.isArray(list) && list.length > 0) {
          daysWithMissions += 1;
          missionsTotal += list.length;
          missionsDone += list.filter(m => m && m.status === 'done').length;
        }
      }
    } catch {}
    try {
      const r = await redis('hgetall', `reactions:${pairId}:${dKey}`);
      if (r && (r.type || r.note || r.time)) kudosDays += 1;
    } catch {}
  }
  const missionPct = missionsTotal > 0 ? clamp(Math.round((missionsDone / missionsTotal) * 100)) : (daysWithMissions > 0 ? 0 : 50);
  const kudosPct = clamp(Math.round((kudosDays / 7) * 100));
  return clamp(Math.round(0.5 * missionPct + 0.5 * kudosPct));
}

function energyToWeather(e) { if (e < 40) return 'stormy'; if (e < 55) return 'rainy'; if (e < 80) return 'cloudy'; return 'sunny'; }
function energyToMood(e) { if (e < 40) return 'stormy'; if (e > 80) return 'vibrant'; return 'calm'; }

export async function GET(req) {
  try {
    if (!UPSTASH_URL || !UPSTASH_TOKEN) {
      return new Response(JSON.stringify({ ok:false, error: 'Missing Upstash env' }), { status: 500, headers: noStoreHeaders() });
    }
    const url = new URL(req.url);
    const pairId = url.searchParams.get('pairId') || req.headers.get('x-mm-pair') || '';
    if (!pairId) return new Response(JSON.stringify({ ok:false, error:'Missing pairId' }), { status: 400, headers: noStoreHeaders() });

    const energy = await computeSyncEnergy7d(pairId, new Date());
    let glowUntil = null;
    try {
      const react = await redis('hgetall', `reactions:${pairId}:${dayIso(new Date())}`);
      if (react && react.time) {
        const t = Date.parse(String(react.time));
        if (!Number.isNaN(t)) {
          const until = new Date(t + 2 * 60 * 60 * 1000);
          if (until > new Date()) glowUntil = until.toISOString();
        }
      }
    } catch {}

    const gardenMood = energyToMood(energy);
    const weatherState = energyToWeather(energy);

    // Persist ecology and optionally bump gardenMoodVersion if changed
    try {
      const ecoKey = `ecology:${pairId}`;
      const raw = await redis('hgetall', ecoKey);
      const prevMood = raw?.gardenMood || null;
      const prevWeather = raw?.weatherState || null;
      await redis('hset', ecoKey, 'gardenMood', gardenMood, 'weatherState', weatherState, 'syncEnergy', String(energy), 'glowUntil', glowUntil || '');
      if (prevMood !== gardenMood || prevWeather !== weatherState) {
        await redis('hincrby', `state:${pairId}`, 'gardenMoodVersion', '1');
      }
    } catch {}

    return new Response(JSON.stringify({ ok:true, gardenMood, syncEnergy: energy, weatherState, glowUntil }), { status: 200, headers: noStoreHeaders() });
  } catch (err) {
    return new Response(JSON.stringify({ ok:false, error: String(err?.message || err) }), { status: 500, headers: noStoreHeaders() });
  }
}
