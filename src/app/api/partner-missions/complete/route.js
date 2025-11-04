// /app/api/partner-mission/complete/route.js
export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * POST /api/partner-mission/complete
 * Idempotent oppdatering av dagens mission-status for et par.
 *
 * Body (JSON):
 *   {
 *     pairId?: string,           // valgfritt (kan også komme fra header/cookie)
 *     userId?: string,           // for streaks:<userId>
 *     missionId: string,         // f.eks. "m-2025-11-04-0"
 *     updateId?: string          // idempotency key for retry-scenarier
 *   }
 *
 * Redis keys:
 *   missions:<pairId>:<day>      -> JSON.stringify([...])   // dagens oppdragsliste
 *   streaks:<userId> (hash)      -> missionDays: <int>      // teller for oppdragsdager
 *   state:<pairId> (hash)        -> missionsVersion: <int>  // bumpes ved endring
 *   idem:<pairId>:<day>:<missionId>:<updateId> -> '1'  (EX 3d, NX)
 *
 * Effekt:
 *   - Setter mission.status = "done" (om ikke allerede done)
 *   - HINCRBY streaks:<userId> missionDays (+1) *kun første gang*
 *   - HINCRBY state:<pairId> missionsVersion (+1)
 *   - Returnerer { ok:true, xpDelta, streak: { missionDays } }
 */

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

function noStoreHeaders(extra = {}) {
  return {
    'Cache-Control': 'no-store',
    'Content-Type': 'application/json; charset=utf-8',
    ...extra,
  };
}

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

    // Finn og last dagens missions
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

    // Idempotency barrier (kun nyttig for retrier av samme updateId)
    if (updateId) {
      const idemKey = `idem:${pairId}:${dayKey}:${missionId}:${updateId}`;
      const setRes = await redis('set', idemKey, '1', 'EX', String(3 * 24 * 60 * 60), 'NX'); // 3 dager
      if (!setRes) {
        // Duplicate kall med samme updateId -> returner "ingen endring"
        const curDays = Number(await redis('hget', streakKey, 'missionDays')) || 0;
        return new Response(JSON.stringify({ ok: true, xpDelta: 0, streak: { missionDays: curDays } }), {
          status: 200, headers: noStoreHeaders(),
        });
      }
    }

    // Hvis allerede done -> ingen nye sideeffekter
    if (alreadyDone) {
      const curDays = Number(await redis('hget', streakKey, 'missionDays')) || 0;
      return new Response(JSON.stringify({ ok: true, xpDelta: 0, streak: { missionDays: curDays } }), {
        status: 200, headers: noStoreHeaders(),
      });
    }

    // Marker som ferdig
    const points = Number(missions[idx]?.points || 0);
    missions[idx] = { ...missions[idx], status: 'done', completedAt: nowISO() };

    // Bevar eksisterende TTL på missions:<...> når vi lagrer på nytt
    let ttl = Number(await redis('ttl', missionsKey));
    if (ttl < 0) ttl = 2 * 24 * 60 * 60; // default 2d hvis ingen TTL
    await redis('set', missionsKey, JSON.stringify(missions), 'EX', String(ttl));

    // Øk streak og bump missionsVersion
    const missionDays = Number(await redis('hincrby', streakKey, 'missionDays', '1')) || 0;
    await redis('hincrby', stateKey, 'missionsVersion', '1');

    // Svar
    return new Response(JSON.stringify({ ok: true, xpDelta: points, streak: { missionDays } }), {
      status: 200, headers: noStoreHeaders(),
    });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: String(err?.message || err) }), {
      status: 500, headers: noStoreHeaders(),
    });
  }
}
