// Harmony Partner Sync Recovery Patch – 2025-11-11
// Auto-unlink on stale pair + modal stability improvements

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { Redis } from '@upstash/redis';
import { sanitizeEtag } from '../_utils/sanitizeEtag.js';

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...extraHeaders },
  });
}

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

function todayKeyUTC() {
  const d = new Date();
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`; // yyyy-mm-dd
}
function isoDay(d=new Date()) { return d.toISOString().slice(0,10); }

function normalizeOwnerDate(input) {
  if (!input) return null;
  const s = String(input).trim();
  if (/^\d{8}$/.test(s)) return `${s.slice(0,4)}-${s.slice(4,6)}-${s.slice(6,8)}`;
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const dt = new Date(s); if (!Number.isNaN(dt)) return isoDay(dt);
  return null;
}

function clamp(n, lo=0, hi=100) { return Math.max(lo, Math.min(hi, n)); }
function energyToWeather(e) { if (e < 40) return 'stormy'; if (e < 55) return 'rainy'; if (e < 80) return 'cloudy'; return 'sunny'; }

async function readFeedback(redis, pairId, dayIso) {
  const dashed = `feedback:${pairId}:${dayIso}`;
  const legacy = `feedback:${pairId}:${dayIso.replaceAll('-','')}`;
  let fb = await redis.hgetall(dashed);
  if (!fb || Object.keys(fb).length === 0) fb = await redis.hgetall(legacy);
  return fb || null;
}

async function computeSyncEnergy7d(redis, pairId) {
  let kudosDays = 0, daysWithMissions = 0, missionsDone = 0, missionsTotal = 0;
  for (let i=0;i<7;i++) {
    const d = new Date(); d.setUTCDate(d.getUTCDate()-i);
    const dKey = d.toISOString().slice(0,10);
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
  return clamp(Math.round(0.5 * missionPct + 0.5 * kudosPct));
}

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const pairId = url.searchParams.get('pairId') || req.headers.get('x-mm-pair') || '';
    const ownerDate = url.searchParams.get('ownerDate') || null;
    if (!pairId) return json({ ok:false, error: 'Missing pairId', isValidConnection:false }, 400);

    const redis = getRedis();

    // Blocklisted pair → 403
    const blocked = await redis.get(`blocklist:${pairId}`);
    if (blocked) return json({ ok:false, error: 'blocked', isValidConnection:false }, 403);

    const stateKey = `state:${pairId}`;
    const state = await redis.hgetall(stateKey) || {};
    const stateExists = Object.keys(state).length > 0;
    const isValidConnection = stateExists && !(['false','0'].includes(String(state?.isValidConnection || '').toLowerCase()));

    // Missing or invalid state → 403 with explicit flag to trigger client unlink
    if (!stateExists || !isValidConnection) {
      const featureFlags = {
        ff_coach: readFlag('FF_COACH', true),
        ff_garden: readFlag('FF_GARDEN', true),
        ff_ecology: readFlag('FF_ECOLOGY', true),
        ff_challenges: readFlag('FF_CHALLENGES', true),
        ff_reactions: readFlag('FF_REACTIONS', true),
        ff_insights: readFlag('FF_INSIGHTS', true),
        ff_coachMode: readFlag('FF_COACH', true),
        ff_missions: true,
        ff_scores: true,
        ff_badges: readFlag('FF_BADGES', false),
      };
      return json({ ok:false, isValidConnection:false, featureFlags, hasData:false, day: normalizeOwnerDate(ownerDate) || todayKeyUTC() }, 403);
    }

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
    const reqDate = normalizeOwnerDate(ownerDate);
    const dayIso = stateDate || reqDate || todayKeyUTC();

    const fb = await readFeedback(redis, pairId, dayIso);
    let tips = []; let vibe = null; let readiness = null;
    try { tips = Array.isArray(fb?.tips) ? fb.tips : (fb?.tips ? JSON.parse(fb.tips) : []); } catch { tips = []; }
    vibe = fb?.vibe ?? null;
    readiness = fb?.readiness != null ? Number(fb.readiness) : null;

    const syncEnergyScore = await computeSyncEnergy7d(redis, pairId);
    const weatherState = energyToWeather(syncEnergyScore);

    const hasData = (Array.isArray(tips) && tips.length > 0) ||
                    (typeof vibe === 'string' && vibe.length > 0) ||
                    (typeof readiness === 'number' && readiness > 0);

    const payload = {
      ok: true,
      hasData,
      featureFlags,
      isValidConnection: true,
      tips, vibe, readiness,
      weatherState,
      day: dayIso,
    };

    // ALWAYS 200 JSON (no 304)
    const etag = sanitizeEtag(`W/"${String(state?.version || 0)}.${String(syncEnergyScore)}.${hasData?'1':'0'}.${weatherState}"`);
    return json(payload, 200, etag ? { ETag: etag } : {});
  } catch (e) {
    return json({ ok:false, error: String(e?.message || e), isValidConnection:false }, 500);
  }
}
