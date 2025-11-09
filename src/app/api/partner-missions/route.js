export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /api/partner-mission
 * - Return today's missions for a pairId.
 * - If missing in Redis, generate deterministic dummy missions and store.
 * - On creation, HINCRBY state:<pairId> missionsVersion (+1) and version (+1).
 * - Response: { ok:true, missions, missionsVersion }
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

async function redis(cmd, ...args) {
  const url = `${UPSTASH_URL}/${cmd}/${args.map(a => encodeURIComponent(String(a))).join('/')}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` } });
  if (!res.ok) throw new Error(`Upstash ${cmd} failed: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data.result;
}

function getPairIdFromRequest(req) {
  const url = new URL(req.url);
  const qp = url.searchParams.get('pairId');
  if (qp) return qp;
  const x1 = req.headers.get('x-mm-pair') || req.headers.get('x-partner-id');
  if (x1) return x1;
  try {
    const cookie = req.headers.get('cookie') || '';
    const found = /(?:^|;\s*)mm_pair\s*=\s*([^;]+)/.exec(cookie);
    if (found) return decodeURIComponent(found[1]);
  } catch {}
  return 'anon';
}

function isoDayKey(date = new Date()) { return date.toISOString().slice(0, 10); }
function endOfDayISO(d = new Date()) {
  const x = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 23, 59, 59, 999));
  return x.toISOString();
}
function pseudoPhaseByDay(date = new Date()) {
  const wd = date.getUTCDay();
  return ['menstruation', 'follicular', 'follicular', 'ovulation', 'luteal', 'luteal', 'luteal'][wd] || 'follicular';
}
function seededRng(seedStr) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seedStr.length; i++) { h ^= seedStr.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
  return () => { h ^= h << 13; h >>>= 0; h ^= h >>> 17; h >>>= 0; h ^= h << 5; h >>>= 0; return (h >>> 0) / 0xffffffff; };
}
function generateDummyMissions({ pairId, dayKey }) {
  const rng = seededRng(`${pairId}:${dayKey}`);
  const phase = pseudoPhaseByDay(new Date(`${dayKey}T00:00:00.000Z`));
  const count = 1 + Math.floor(rng() * 3);
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
      difficulty: c.diff,
      points: c.pts,
      phase,
      status: 'pending',
      expiresAt: endOfDayISO(new Date(`${dayKey}T00:00:00.000Z`)),
    });
  }
  return missions;
}

export async function GET(req) {
  try {
    if (!UPSTASH_URL || !UPSTASH_TOKEN) {
      return new Response(JSON.stringify({ ok: false, missions: [], error: 'Missing Upstash env' }), { status: 500, headers: noStoreHeaders() });
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
      await redis('set', missionsKey, JSON.stringify(missions), 'EX', String(WEEK_TTL_SEC)); // TTL 7 days
      await redis('hincrby', stateKey, 'missionsVersion', '1');
      await redis('hincrby', stateKey, 'version', '1'); // global version on write
      created = true;
      // refresh state TTLs on write
      await redis('expire', stateKey, String(WEEK_TTL_SEC));
      await redis('expire', `ecology:${pairId}`, String(WEEK_TTL_SEC));
    } else {
      const raw = await redis('get', missionsKey);
      try { missions = JSON.parse(raw || '[]'); } catch { missions = []; }
    }

    const missionsVersion = Number(await redis('hget', stateKey, 'missionsVersion')) || 0;
    return new Response(JSON.stringify({ ok: true, missions, missionsVersion }), { status: 200, headers: noStoreHeaders() });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, missions: [], error: String(err?.message || err) }), { status: 500, headers: noStoreHeaders() });
  }
}
