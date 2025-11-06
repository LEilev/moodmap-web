// app/api/partner-reaction/route.js — Harmony Patch 1
// - Adds optional 'note' (<=48 chars) persisted in reactions:<pairId>:<yyyy-mm-dd>
// - Preserves idempotency via updateId
// - TTL ~48h for reactions key
export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

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

function getHeader(req, name) { return req.headers.get(name) || req.headers.get(name.toLowerCase()); }

function getPairId(req, body) {
  return body?.pairId ||
    getHeader(req, 'x-mm-pair') ||
    getHeader(req, 'x-partner-id') ||
    (() => {
      try {
        const cookie = req.headers.get('cookie') || '';
        const m = /(?:^|;\s*)mm_pair\s*=\s*([^;]+)/.exec(cookie);
        return m ? decodeURIComponent(m[1]) : null;
      } catch { return null; }
    })() ||
    'anon';
}

function isoDayKey(d = new Date()) { return d.toISOString().slice(0, 10); }
function nowISO() { return new Date().toISOString(); }
function sanitizeNote(s) {
  if (typeof s !== 'string') return '';
  let t = s.replace(/\s+/g, ' ').trim();
  if (t.length > 48) t = t.slice(0, 48);
  return t;
}

export async function POST(req) {
  try {
    if (!UPSTASH_URL || !UPSTASH_TOKEN) {
      return new Response(JSON.stringify({ ok: false, error: 'Missing Upstash env' }), { status: 500, headers: noStoreHeaders() });
    }

    let body = {};
    try { body = await req.json(); } catch {}
    const pairId = getPairId(req, body);
    const reaction = (body?.reaction || '').toString();
    const note = sanitizeNote(body?.note || '');
    const updateId = body?.updateId || null;
    if (!pairId) return new Response(JSON.stringify({ ok:false, error:'pairId required' }), { status: 400, headers: noStoreHeaders() });
    if (!reaction) return new Response(JSON.stringify({ ok:false, error:'reaction required' }), { status: 400, headers: noStoreHeaders() });

    const dayKey = isoDayKey();
    const stateKey = `state:${pairId}`;
    const reactKey = `reactions:${pairId}:${dayKey}`;

    // Idempotency for the specific update
    if (updateId) {
      const idemKey = `idem:${pairId}:${dayKey}:kudos:${updateId}`;
      const setRes = await redis('set', idemKey, '1', 'EX', String(3 * 24 * 60 * 60), 'NX');
      if (!setRes) {
        return new Response(JSON.stringify({ ok: true, idempotent: true }), { status: 200, headers: noStoreHeaders() });
      }
    }

    // Store reaction (hash fields: type, time, note)
    await redis('hset', reactKey, 'type', reaction, 'time', nowISO(), 'note', note);
    // TTL ~48h
    await redis('expire', reactKey, String(2 * 24 * 60 * 60));

    // Small P&P boost (+2), if weekly scores object exists
    try {
      // compute iso week like partner-scores
      const now = new Date();
      const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
      const dayNr = (date.getUTCDay() + 6) % 7;
      date.setUTCDate(date.getUTCDate() - dayNr + 3);
      const firstThursday = new Date(Date.UTC(date.getUTCFullYear(), 0, 4));
      const firstDayNr = (firstThursday.getUTCDay() + 6) % 7;
      firstThursday.setUTCDate(firstThursday.getUTCDate() - firstDayNr + 3);
      const week = 1 + Math.round((date - firstThursday) / (7 * 24 * 60 * 60 * 1000));
      const yyyy = date.getUTCFullYear();
      const ww = String(week).padStart(2, '0');
      const weekKey = `${yyyy}-W${ww}`;

      const scoresKey = `scores:${pairId}:${weekKey}`;
      const raw = await redis('get', scoresKey);
      if (raw) {
        let obj = null;
        try { obj = JSON.parse(raw); } catch {}
        if (obj && typeof obj === 'object' && typeof obj.peacePassion === 'number') {
          const next = Math.max(0, Math.min(100, Math.round(obj.peacePassion + 2)));
          obj.peacePassion = next;
          await redis('set', scoresKey, JSON.stringify(obj), 'EX', String(8 * 24 * 60 * 60));
          await redis('hincrby', stateKey, 'scoresVersion', '1');
        }
      }
    } catch {}

    // Bump versions
    await redis('hincrby', stateKey, 'reactionsVersion', '1');
    await redis('hincrby', stateKey, 'version', '1');
    await redis('hincrby', stateKey, 'ecologyVersion', '1'); // glow/cooldown effects in ecology

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: noStoreHeaders() });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: String(err?.message || err) }), { status: 500, headers: noStoreHeaders() });
  }
}
