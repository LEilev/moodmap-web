// /app/api/partner-missions/route.js
export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /api/partner-missions
 * - Returnerer dagens missions for et gitt pairId.
 * - Hvis missions mangler i Redis, genereres dummy (1–3) deterministisk pr dag og lagres.
 * - Ved nyopprettelse HINCRBY state:<pairId> missionsVersion (+1).
 * - Respons: { ok:true, missions, missionsVersion }
 *
 * Redis keys:
 *   missions:<pairId>:<day>   -> JSON.stringify([...])
 *   state:<pairId> (hash)     -> fields: version, missionsVersion, scoresVersion
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

async function hgetallAsObject(key) {
  const res = await redis('hgetall', key);
  if (!res) return {};
  // Upstash returns array like ["field","value",...]
  if (Array.isArray(res)) {
    const obj = {};
    for (let i = 0; i < res.length; i += 2) obj[res[i]] = res[i + 1];
    return obj;
  }
  return res; // sometimes already object
}

function getPairIdFromRequest(req) {
  const url = new URL(req.url);
  const qp = url.searchParams.get('pairId');
  if (qp) return qp;

  const x1 = req.headers.get('x-mm-pair') || req.headers.get('x-partner-id');
  if (x1) return x1;

  // Best effort cookie lookup (works on Edge)
  try {
    const cookie = req.headers.get('cookie') || '';
    const found = /(?:^|;\s*)mm_pair\s*=\s*([^;]+)/.exec(cookie);
    if (found) return decodeURIComponent(found[1]);
  } catch {}
  return 'anon'; // safe fallback for dummy bootstrap
}

function isoDayKey(date = new Date()) {
  // YYYY-MM-DD (UTC)
  return date.toISOString().slice(0, 10);
}

function endOfDayISO(d = new Date()) {
  const x = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 23, 59, 59, 999));
  return x.toISOString();
}

function pseudoPhaseByDay(date = new Date()) {
  // Dummy fase basert på ukedag (deterministisk, kun for dummy missions)
  // 0: søn..6: lør
  const wd = date.getUTCDay(); // 0..6
  return ['menstruation', 'follicular', 'follicular', 'ovulation', 'luteal', 'luteal', 'luteal'][wd] || 'follicular';
}

function seededRng(seedStr) {
  // Enkel deterministisk RNG (xorshift32-ish)
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seedStr.length; i++) {
    h ^= seedStr.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return () => {
    h ^= h << 13; h >>>= 0;
    h ^= h >>> 17; h >>>= 0;
    h ^= h << 5; h >>>= 0;
    return (h >>> 0) / 0xffffffff;
  };
}

function generateDummyMissions({ pairId, dayKey }) {
  const rng = seededRng(`${pairId}:${dayKey}`);
  const phase = pseudoPhaseByDay(new Date(`${dayKey}T00:00:00.000Z`));
  const count = 1 + Math.floor(rng() * 3); // 1..3

  const candidates = [
    { t: 'Five‑minute check‑in', diff: 1, pts: 8 },
    { t: 'Supportive text now', diff: 1, pts: 5 },
    { t: 'Plan tomorrow’s mini‑date', diff: 2, pts: 12 },
    { t: 'Tea & listen (10 min)', diff: 2, pts: 10 },
    { t: 'Handle a chore unprompted', diff: 3, pts: 15 },
  ];

  const missions = [];
  const chosen = new Set();
  for (let i = 0; i < count; i++) {
    let pick = Math.floor(rng() * candidates.length);
    while (chosen.has(pick)) pick = (pick + 1) % candidates.length;
    chosen.add(pick);
    const c = candidates[pick];
    missions.push({
      id: `m-${dayKey}-${i}`,
      title: c.t,
      difficulty: c.diff,     // 1..3
      points: c.pts,          // XP
      phase,                  // aligns with Reisebok schema
      status: 'pending',      // pending | done
      expiresAt: endOfDayISO(new Date(`${dayKey}T00:00:00.000Z`)),
    });
  }
  return missions;
}

export async function GET(req) {
  try {
    if (!UPSTASH_URL || !UPSTASH_TOKEN) {
      return new Response(JSON.stringify({ ok: false, error: 'Missing Upstash env' }), { status: 500, headers: noStoreHeaders() });
    }

    const pairId = getPairIdFromRequest(req);
    const dayKey = isoDayKey();
    const missionsKey = `missions:${pairId}:${dayKey}`;
    const stateKey = `state:${pairId}`;

    const exists = Number(await redis('exists', missionsKey)) === 1;
    let missions;
    let created = false;

    if (!exists) {
      missions = generateDummyMissions({ pairId, dayKey });
      // Store JSON and expire after 2 days
      await redis('set', missionsKey, JSON.stringify(missions), 'EX', String(2 * 24 * 60 * 60));
      // Bump missionsVersion on first creation this day
      await redis('hincrby', stateKey, 'missionsVersion', '1');
      created = true;
    } else {
      const raw = await redis('get', missionsKey);
      try { missions = JSON.parse(raw || '[]'); } catch { missions = []; }
    }

    // Ensure missionsVersion exists
    let missionsVersion = Number(await redis('hget', stateKey, 'missionsVersion')) || 0;
    if (!exists && !created) {
      // safety (shouldn’t happen)
      await redis('hincrby', stateKey, 'missionsVersion', '1');
      missionsVersion += 1;
    }

    return new Response(JSON.stringify({ ok: true, missions, missionsVersion }), {
      status: 200,
      headers: noStoreHeaders(),
    });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: String(err?.message || err) }), {
      status: 500,
      headers: noStoreHeaders(),
    });
  }
}
