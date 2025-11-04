// /app/api/partner-scores/route.js
export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /api/partner-scores
 * - Returnerer ukens score for pairId (dummy bootstrap ved første kall).
 * - Lagrer i Redis og HINCRBY state:<pairId> scoresVersion (+1) ved nyopprettelse.
 * - Respons: { ok:true, scoresVersion, data }
 *
 * Redis keys:
 *   scores:<pairId>:<week>  -> JSON.stringify({ week, peacePassion, sync, empathy, trend })
 *   state:<pairId> (hash)   -> fields: version, missionsVersion, scoresVersion
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
  // ISO uke: YYYY-Www (UTC)
  const date = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  // Thursday in current week decides the year.
  const dayNr = (date.getUTCDay() + 6) % 7; // 0=Mon..6=Sun
  date.setUTCDate(date.getUTCDate() - dayNr + 3); // move to Thu
  const firstThursday = new Date(Date.UTC(date.getUTCFullYear(), 0, 4));
  const firstDayNr = (firstThursday.getUTCDay() + 6) % 7;
  firstThursday.setUTCDate(firstThursday.getUTCDate() - firstDayNr + 3);
  const week = 1 + Math.round((date - firstThursday) / (7 * 24 * 60 * 60 * 1000));
  const yyyy = date.getUTCFullYear();
  const ww = String(week).padStart(2, '0');
  return `${yyyy}-W${ww}`;
}

function generateDummyScores(weekKey) {
  // Dummy, men stabil per uke
  const base = [...weekKey].reduce((a, c) => (a + c.charCodeAt(0)) % 1000, 0);
  const clamp = (n) => Math.max(20, Math.min(95, n));
  const peacePassion = clamp((base % 70) + 25);
  const sync = clamp(((base * 3) % 65) + 22);
  const empathy = clamp(((base * 7) % 60) + 25);

  // En enkel 7‑dagers trend (dummy)
  const trend = {
    days: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    peacePassion: Array.from({ length: 7 }, (_, i) => clamp(peacePassion + ((i - 3) * 2))),
    sync:          Array.from({ length: 7 }, (_, i) => clamp(sync + ((i - 2) * 2))),
    empathy:       Array.from({ length: 7 }, (_, i) => clamp(empathy + ((i - 4) * 2))),
  };

  return { week: weekKey, peacePassion, sync, empathy, trend };
}

export async function GET(req) {
  try {
    if (!UPSTASH_URL || !UPSTASH_TOKEN) {
      return new Response(JSON.stringify({ ok: false, error: 'Missing Upstash env' }), { status: 500, headers: noStoreHeaders() });
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
      // Lagres i 8 dager for å dekke hele uke + litt margin
      await redis('set', scoresKey, JSON.stringify(data), 'EX', String(8 * 24 * 60 * 60));
      await redis('hincrby', stateKey, 'scoresVersion', '1');
      created = true;
    } else {
      const raw = await redis('get', scoresKey);
      try { data = JSON.parse(raw || '{}'); } catch { data = {}; }
    }

    let scoresVersion = Number(await redis('hget', stateKey, 'scoresVersion')) || 0;
    if (!exists && !created) {
      await redis('hincrby', stateKey, 'scoresVersion', '1');
      scoresVersion += 1;
    }

    return new Response(JSON.stringify({ ok: true, scoresVersion, data }), {
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
