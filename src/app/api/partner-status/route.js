// Next 15 Edge API — Sprint D
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

function isoWeekKey(d = new Date()) {
  const date = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(),0,1));
  const weekNo = Math.ceil((((date - yearStart) / 86400000) + 1)/7);
  const wk = String(weekNo).padStart(2, '0');
  return `${date.getUTCFullYear()}-W${wk}`;
}

function clamp(n, min=0, max=100) { return Math.max(min, Math.min(max, n)); }

function safeParse(jsonStr, fallback = null) {
  try { return JSON.parse(jsonStr); } catch { return fallback; }
}

async function snapshot(redis, pairId, ownerDate) {
  const state = await redis.hgetall(`state:${pairId}`);
  const version = Number(state?.version || 0);
  const missionsVersion = Number(state?.missionsVersion || 0);
  const scoresVersion = Number(state?.scoresVersion || 0);
  const reactionsVersion = Number(state?.reactionsVersion || 0);
  const insightsVersion = Number(state?.insightsVersion || 0);

  // Feature flags (global defaults; can later be made pair-specific)
  const ff_coachMode = true;
  const ff_missions = true;
  const ff_scores = true;
  const ff_badges = String(state?.ff_badges || '').toLowerCase() === 'true' || false;
  const ff_insights = String(process.env.FF_INSIGHTS || '').toLowerCase() === 'true' ? true : false;
  const ff_reactions = String(process.env.FF_REACTIONS || '').toLowerCase() === 'true' ? true : false;
  const featureFlags = { ff_coachMode, ff_missions, ff_scores, ff_badges, ff_insights, ff_reactions };

  // Feedback for the given ownerDate (tips/vibe/readiness)
  const fbKey = `feedback:${pairId}:${ownerDate || todayKeyUTC().replaceAll('-','')}`; // legacy used yyyymmdd, fallback to today
  const fb = await redis.hgetall(fbKey);
  let tips = [];
  let vibe = null;
  let readiness = null;
  try { tips = Array.isArray(fb?.tips) ? fb.tips : (fb?.tips ? JSON.parse(fb.tips) : []); } catch { tips = []; }
  vibe = fb?.vibe ?? null;
  readiness = fb?.readiness != null ? Number(fb.readiness) : null;

  // Reaction for today (for HIM to display)
  const reactKey = `reactions:${pairId}:${todayKeyUTC()}`;
  const react = await redis.hgetall(reactKey);
  const reactionType = react?.type || null;

  const payload = {
    ok: true,
    hasData: Boolean(tips && tips.length),
    version, missionsVersion, scoresVersion, reactionsVersion, insightsVersion,
    featureFlags,
    tips, vibe, readiness,
    reactionType,
  };

  const simpleEtag = `W/"${version}.${missionsVersion}.${scoresVersion}.${reactionsVersion}.${insightsVersion}.${(tips?.length||0)}.${String(vibe||'')}.${String(readiness||'')}.${featureFlags.ff_insights?'1':'0'}${featureFlags.ff_reactions?'1':'0'}${featureFlags.ff_badges?'1':'0'}"`;
  return { payload, etag: simpleEtag };
}

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

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
        await sleep(350);
        const snap2 = await snapshot(redis, pairId, ownerDate);
        if (snap2.etag !== etag) {
          payload = snap2.payload;
          etag = snap2.etag;
          break;
        }
      }
    }

    return json(payload, 200, { ETag: etag });
  } catch (e) {
    return json({ ok:false, error: String(e?.message || e) }, 500);
  }
}
