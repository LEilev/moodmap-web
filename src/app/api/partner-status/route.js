// app/api/partner-status/route.js — Harmony Patch 1
// - Adds ecologyVersion, challengesVersion, syncEnergyScore to payload
// - ETag now includes these fields to break on change
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { Redis } from '@upstash/redis';

function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) throw new Error('Missing Upstash Redis env');
  return new Redis({ url, token });
}

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...extraHeaders },
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
  // last 7 days inclusive of endDate
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

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

async function snapshot(redis, pairId, ownerDate) {
  const state = await redis.hgetall(`state:${pairId}`);
  const version = Number(state?.version || 0);
  const missionsVersion = Number(state?.missionsVersion || 0);
  const scoresVersion = Number(state?.scoresVersion || 0);
  const reactionsVersion = Number(state?.reactionsVersion || 0);
  const insightsVersion = Number(state?.insightsVersion || 0);
  const ecologyVersion = Number(state?.ecologyVersion || 0);
  const challengesVersion = Number(state?.challengesVersion || 0);

  // Feature flags
  const ff_coachMode = true;
  const ff_missions = true;
  const ff_scores = true;
  const ff_badges = String(state?.ff_badges || '').toLowerCase() === 'true' || false;
  const ff_insights = String(process.env.FF_INSIGHTS || '').toLowerCase() === 'true' ? true : false;
  const ff_reactions = String(process.env.FF_REACTIONS || '').toLowerCase() === 'true' ? true : false;
  const featureFlags = { ff_coachMode, ff_missions, ff_scores, ff_badges, ff_insights, ff_reactions };

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

  const payload = {
    ok: true,
    hasData: Boolean(tips && tips.length),
    version, missionsVersion, scoresVersion, reactionsVersion, insightsVersion,
    ecologyVersion, challengesVersion, syncEnergyScore,
    featureFlags,
    tips, vibe, readiness,
    reactionType,
  };

  const simpleEtag = `W/"${version}.${missionsVersion}.${scoresVersion}.${reactionsVersion}.${insightsVersion}.${ecologyVersion}.${challengesVersion}.${syncEnergyScore}.${(tips?.length||0)}.${String(vibe||'')}.${String(readiness||'')}.${featureFlags.ff_insights?'1':'0'}${featureFlags.ff_reactions?'1':'0'}${featureFlags.ff_badges?'1':'0'}"`;
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

    const ifNoneMatch = req.headers.get('if-none-match');
    if (ifNoneMatch && ifNoneMatch === etag) {
      if (wait <= 0) {
        return new Response(null, { status: 304, headers: { ETag: etag, 'Cache-Control': 'no-store' } });
      }
      // Long-poll until changed or timeout
      const started = Date.now();
      while ((Date.now() - started) < wait * 1000) {
        const snap2 = await snapshot(redis, pairId, ownerDate);
        if (snap2.etag !== etag) {
          payload = snap2.payload;
          etag = snap2.etag;
          break;
        }
        await new Promise(r => setTimeout(r, 350));
      }
    }

    return json(payload, 200, { ETag: etag });
  } catch (e) {
    return json({ ok:false, error: String(e?.message || e) }, 500);
  }
}
