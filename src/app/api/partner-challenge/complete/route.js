export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * POST /api/partner-mission/complete
 * - Idempotent update of today's mission status.
 * - Patch: ensure missions TTL >= 7d, bump scoresVersion, expire state/ecology, return version.
 */

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

const WEEK_TTL_SEC = 7 * 24 * 60 * 60;

function noStoreHeaders(extra = {}) {
  return {
    'Cache-Control': 'no-store',
    'Content-Type': 'application/json; charset=utf-8',
    ...extra,
  };
}

const DEV = process.env.NODE_ENV !== 'production';
function devLog(...args) { if (DEV) { try { console.log('[HarmonyDev][mission-complete]', ...args); } catch {} } }

async function redis(cmd, ...args) {
  const url = `${UPSTASH_URL}/${cmd}/${args.map(a => encodeURIComponent(String(a))).join('/')}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` } });
  if (!res.ok) {
    throw new Error(`Upstash ${cmd} failed: ${res.status} ${await res.text()}`);
  }
  const data = await res.json();
  return data.result;
}

function getHeader(req, name) { return req.headers.get(name) || req.headers.get(name.toLowerCase()); }

function getFromCookie(req, key) {
  try {
    const cookie = req.headers.get('cookie') || '';
    const m = new RegExp(`(?:^|;\\s*)${key}\\s*=\\s*([^;]+)`).exec(cookie);
    return m ? decodeURIComponent(m[1]) : null;
  } catch { return null; }
}

function getPairId(req, body) {
  return body?.pairId ||
    getHeader(req, 'x-mm-pair') ||
    getHeader(req, 'x-partner-id') ||
    getFromCookie(req, 'mm_pair') ||
    'anon';
}

function getUserId(req, body) {
  return body?.userId ||
    getHeader(req, 'x-mm-user') ||
    getFromCookie(req, 'mm_user') ||
    'anon';
}

function isoDayKey(d = new Date()) { return d.toISOString().slice(0, 10); }
function nowISO() { return new Date().toISOString(); }

export async function POST(req) {
  try {
    if (!UPSTASH_URL || !UPSTASH_TOKEN) {
      return new Response(JSON.stringify({ ok: false, error: 'Missing Upstash env' }), { status: 500, headers: noStoreHeaders() });
    }

    let body = {};
    try { body = await req.json(); } catch {}
    const missionId = body?.missionId;
    const updateId = body?.updateId || null;

    if (!missionId) {
      return new Response(JSON.stringify({ ok: false, error: 'missionId required' }), { status: 400, headers: noStoreHeaders() });
    }

    const pairId = getPairId(req, body);
    const userId = getUserId(req, body);
    const dayKey = isoDayKey();

    const missionsKey = `missions:${pairId}:${dayKey}`;
    const stateKey = `state:${pairId}`;
    const streakKey = `streaks:${userId}`;

    // Load today's missions
    const raw = await redis('get', missionsKey);
    if (!raw) {
      return new Response(JSON.stringify({ ok: false, error: 'missions not found for today' }), { status: 404, headers: noStoreHeaders() });
    }

    let missions = [];
    try { missions = JSON.parse(raw); } catch { missions = []; }

    const idx = missions.findIndex(m => m?.id === missionId);
    if (idx === -1) {
      return new Response(JSON.stringify({ ok: false, error: 'mission not found' }), { status: 404, headers: noStoreHeaders() });
    }

    const alreadyDone = missions[idx]?.status === 'done';

    // Idempotency barrier
    if (updateId) {
      const idemKey = `idem:${pairId}:${dayKey}:${missionId}:${updateId}`;
      const setRes = await redis('set', idemKey, '1', 'EX', String(3 * 24 * 60 * 60), 'NX'); // 3 days
      if (!setRes) {
        const curDays = Number(await redis('hget', streakKey, 'missionDays')) || 0;
        const curVer = Number(await redis('hget', stateKey, 'missionsVersion')) || 0;
        return new Response(JSON.stringify({ ok: true, xpDelta: 0, streak: { missionDays: curDays }, version: curVer }), {
          status: 200, headers: noStoreHeaders(),
        });
      }
    }

    if (alreadyDone) {
      const curDays = Number(await redis('hget', streakKey, 'missionDays')) || 0;
      const curVer = Number(await redis('hget', stateKey, 'missionsVersion')) || 0;
      return new Response(JSON.stringify({ ok: true, xpDelta: 0, streak: { missionDays: curDays }, version: curVer }), {
        status: 200, headers: noStoreHeaders(),
      });
    }

    // Mark done
    const points = Number(missions[idx]?.points || 0);
    missions[idx] = { ...missions[idx], status: 'done', completedAt: nowISO() };

    // Preserve and enforce TTL >= 7d when saving
    let ttl = Number(await redis('ttl', missionsKey));
    if (ttl < WEEK_TTL_SEC) ttl = WEEK_TTL_SEC;
    await redis('set', missionsKey, JSON.stringify(missions), 'EX', String(ttl));

    // Streak & versions
    const missionDays = Number(await redis('hincrby', streakKey, 'missionDays', '1')) || 0;
    const newMissionsVersion = await redis('hincrby', stateKey, 'missionsVersion', '1');
    // bump ecology & scores + global
    await redis('hincrby', stateKey, 'ecologyVersion', '1');
    await redis('hincrby', stateKey, 'scoresVersion', '1'); // mission completion affects Sync Energy
    await redis('hincrby', stateKey, 'version', '1');

    // refresh TTLs
    await redis('expire', stateKey, String(WEEK_TTL_SEC));
    await redis('expire', `ecology:${pairId}`, String(WEEK_TTL_SEC));

    return new Response(JSON.stringify({ ok: true, xpDelta: points, streak: { missionDays }, version: Number(newMissionsVersion) }), {
      status: 200, headers: noStoreHeaders(),
    });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: String(err?.message || err) }), {
      status: 500, headers: noStoreHeaders(),
    });
  }
}
