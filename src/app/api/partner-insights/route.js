// app/api/partner-insights/route.js — Harmony Implementation & Improvement Pack
import { sanitizeEtag } from '../_utils/sanitizeEtag.js';
export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

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
function isoWeekKey(d=new Date()) {
  const date = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const dayNr = (date.getUTCDay() + 6) % 7;
  date.setUTCDate(date.getUTCDate() - dayNr + 3);
  const firstThursday = new Date(Date.UTC(date.getUTCFullYear(), 0, 4));
  const firstDayNr = (firstThursday.getUTCDay() + 6) % 7;
  firstThursday.setUTCDate(firstThursday.getUTCDate() - firstDayNr + 3);
  const week = 1 + Math.round((date - firstThursday) / (7 * 24 * 60 * 60 * 1000));
  const yyyy = date.getUTCFullYear();
  const ww = String(week).padStart(2, '0');
  return `${yyyy}-W${ww}`;
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
      return new Response(JSON.stringify({ ok:false, error:'blocked', isValidConnection:false }), { status: 403, headers: noStore() });
    }
    // Fetch weekly scores (if none, generate dummy via partner-scores)
    const weekKey = isoWeekKey();
    const scoresKey = `scores:${pairId}:${weekKey}`;
    let scoresData = null;
    const rawScores = await redis('get', scoresKey);
    if (!rawScores) {
      // Create dummy scores if not exist
      await fetch(`${url.origin}/api/partner-scores?pairId=${encodeURIComponent(pairId)}`).catch(()=>{});
    }
    const scoresRaw2 = await redis('get', scoresKey);
    try { scoresData = JSON.parse(scoresRaw2 || '{}'); } catch { scoresData = {}; }
    // Compute sync energy and forecast
    // Compute current sync energy (0-100) and determine weatherState
    let energy = 50;
    let weatherState = 'cloudy';
    try {
      let kudosDays=0, daysWithMissions=0, missionsDone=0, missionsTotal=0;
      for (let i=0;i<7;i++) {
        const d = new Date(); d.setUTCDate(d.getUTCDate() - i);
        const dKey = d.toISOString().slice(0,10);
        const mraw = await redis('get', `missions:${pairId}:${dKey}`);
        if (mraw) {
          let list=[]; try { list = JSON.parse(mraw) || []; } catch {}
          if (list.length>0) {
            daysWithMissions+=1;
            missionsTotal += list.length;
            missionsDone += list.filter(m=>m&&m.status==='done').length;
          }
        }
        const rraw = await redis('hgetall', `reactions:${pairId}:${dKey}`);
        if (rraw && (rraw.type || rraw.note || rraw.time)) {
          kudosDays += 1;
        }
      }
      const missionPct = missionsTotal>0 ? Math.round((missionsDone/missionsTotal)*100) : (daysWithMissions>0 ? 0 : 50);
      const kudosPct = Math.round((kudosDays/7)*100);
      energy = Math.max(0, Math.min(100, Math.round(0.5*missionPct + 0.5*kudosPct)));
      if (energy < 40) weatherState = 'stormy'; else if (energy < 55) weatherState = 'rainy'; else if (energy < 80) weatherState = 'cloudy'; else weatherState = 'sunny';
    } catch {}
    // Build forecast72h (simple heuristic based on current weather)
    const forecast = [];
    if (weatherState === 'sunny') {
      forecast.push({ t: '+24h', state: 'sunny' }, { t: '+48h', state: 'cloudy' }, { t: '+72h', state: 'rainy' });
    } else if (weatherState === 'cloudy') {
      forecast.push({ t: '+24h', state: 'sunny' }, { t: '+48h', state: 'sunny' }, { t: '+72h', state: 'cloudy' });
    } else if (weatherState === 'rainy') {
      forecast.push({ t: '+24h', state: 'sunny' }, { t: '+48h', state: 'cloudy' }, { t: '+72h', state: 'rainy' });
    } else { // stormy or default
      forecast.push({ t: '+24h', state: 'rainy' }, { t: '+48h', state: 'cloudy' }, { t: '+72h', state: 'cloudy' });
    }
    // Determine phase micro-texts for HER and HIM based on energy/mood
    let phaseTextHer = '';
    let phaseTextHim = '';
    const moodCategory = energy < 40 ? 'stormy' : (energy > 80 ? 'vibrant' : 'calm');
    if (moodCategory === 'vibrant') {
      phaseTextHer = 'Hagen glitrer – si ja til en liten tur.';
      phaseTextHim = 'Momentum på din side – planlegg mini‑date.';
    } else if (moodCategory === 'stormy') {
      phaseTextHer = 'Stormen minner oss om å søke ly.';
      phaseTextHim = 'Beskytt basen – skap ro før prat.';
    } else {
      phaseTextHer = 'La roen legge seg, jeg er her.';
      phaseTextHim = 'Hold tempo lavt – ett omtanke‑move er nok.';
    }
    const data = {
      week: weekKey,
      peacePassion: scoresData?.peacePassion ?? null,
      sync: scoresData?.sync ?? null,
      empathy: scoresData?.empathy ?? null,
      trend: scoresData?.trend ?? null,
      syncEnergyScore: energy,
      energyDelta: scoresData?.energyDelta ?? 0,
      weatherState,
      forecast72h: forecast,
      phaseTexts: { her: phaseTextHer, him: phaseTextHim }
    };
    return new Response(JSON.stringify({ ok:true, data }), { status: 200, headers: noStore() });
  } catch (err) {
    return new Response(JSON.stringify({ ok:false, error:String(err.message||err) }), { status: 500, headers: noStore() });
  }
}
