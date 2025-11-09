// Harmony — Scores route with Sync Energy
export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /api/partner-scores
 * Response: { ok:true, scoresVersion, data: { ...trend, syncEnergyScore, energyDelta } }
 * - On first-week bootstrap, also bump global state.version
 */

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

const WEEK_TTL_SEC = 7 * 24 * 60 * 60;

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

function isoWeekKey(d = new Date()) {
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

function dayIso(d = new Date()) { return d.toISOString().slice(0,10); }
function addDays(d, delta) { const x = new Date(d); x.setUTCDate(x.getUTCDate()+delta); return x; }

function clamp(n, lo=0, hi=100) { return Math.max(lo, Math.min(hi, n)); }

function generateDummyScores(weekKey) {
  const base = [...weekKey].reduce((a, c) => (a + c.charCodeAt(0)) % 1000, 0);
  const clamp70 = (n) => Math.max(20, Math.min(95, n));
  const peacePassion = clamp70((base % 70) + 25);
  const sync = clamp70(((base * 3) % 65) + 22);
  const empathy = clamp70(((base * 7) % 60) + 25);
  const trend = {
    days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    peacePassion: Array.from({ length: 7 }, (_, i) => clamp70(peacePassion + ((i - 3) * 2))),
    sync:          Array.from({ length: 7 }, (_, i) => clamp70(sync + ((i - 2) * 2))),
    empathy:       Array.from({ length: 7 }, (_, i) => clamp70(empathy + ((i - 4) * 2))),
  };
  return { week: weekKey, peacePassion, sync, empathy, trend };
}

async function computeSyncEnergy7d(pairId, endDate = new Date()) {
  // window: endDate inclusive, last 7 days
  let kudosDays = 0;
  let daysWithMissions = 0;
  let missionsDone = 0;
  let missionsTotal = 0;

  for (let i = 0; i < 7; i++) {
    const d = addDays(endDate, -i);
    const dKey = dayIso(d);
    // Missions
    try {
      const mraw = await redis('get', `missions:${pairId}:${dKey}`);
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
    // Kudos / reactions
    try {
      const r = await redis('hgetall', `reactions:${pairId}:${dKey}`);
      if (r && (r.type || r.note || r.time)) {
        // any reaction fields present => count as kudos for the day
        kudosDays += 1;
      }
    } catch {}
  }

  const missionPct = missionsTotal > 0
    ? clamp(Math.round((missionsDone / missionsTotal) * 100))
    : (daysWithMissions > 0 ? 0 : 50); // unknown → neutral 50
  const kudosPct = clamp(Math.round((kudosDays / 7) * 100));
  const energy = clamp(Math.round(0.5 * missionPct + 0.5 * kudosPct));
  return { energy, missionPct, kudosPct };
}

export async function GET(req) {
  try {
    if (!UPSTASH_URL || !UPSTASH_TOKEN) {
      return new Response(JSON.stringify({ ok: false, data: null, error: 'Missing Upstash env' }), { status: 500, headers: noStoreHeaders() });
    }

    const pairId = getPairIdFromRequest(req);
    const weekKey = isoWeekKey();
    const scoresKey = `scores:${pairId}:${weekKey}`;
    const stateKey = `state:${pairId}`;

    const exists = Number(await redis('exists', scoresKey)) === 1;
    let data;
    let created = false;

    if (!exists) {
      data = generateDummyScores(weekKey);
      await redis('set', scoresKey, JSON.stringify(data), 'EX', String(8 * 24 * 60 * 60)); // TTL 8 days
      await redis('hincrby', stateKey, 'scoresVersion', '1');
      await redis('hincrby', stateKey, 'version', '1'); // bump global on creation
      created = true;
      // refresh state TTLs on write
      await redis('expire', stateKey, String(WEEK_TTL_SEC));
      await redis('expire', `ecology:${pairId}`, String(WEEK_TTL_SEC));
    } else {
      const raw = await redis('get', scoresKey);
      try { data = JSON.parse(raw || '{}'); } catch { data = {}; }
    }

    const scoresVersion = Number(await redis('hget', stateKey, 'scoresVersion')) || 0;

    // Compute Sync Energy for current & previous 7d
    const now = new Date();
    const { energy: energyNow } = await computeSyncEnergy7d(pairId, now);

    const prevWindowEnd = new Date(now);
    prevWindowEnd.setUTCDate(prevWindowEnd.getUTCDate() - 7);
    const { energy: energyPrev } = await computeSyncEnergy7d(pairId, prevWindowEnd);

    const energyDelta = (Number.isFinite(energyNow) && Number.isFinite(energyPrev))
      ? (energyNow - energyPrev) : 0;

    data = { ...(data || {}), syncEnergyScore: energyNow, energyDelta };

    return new Response(JSON.stringify({ ok: true, scoresVersion, data }), { status: 200, headers: noStoreHeaders() });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, data: null, error: String(err?.message || err) }), { status: 500, headers: noStoreHeaders() });
  }
}
