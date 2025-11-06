// app/api/challenge/start/route.js — Harmony Patch 2
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

function sanitizeText(s) {
  if (typeof s !== 'string') return '';
  let t = s.replace(/\s+/g, ' ').trim();
  if (t.length > 120) t = t.slice(0, 120);
  return t;
}

function nowISO() { return new Date().toISOString(); }

export async function POST(req) {
  try {
    if (!UPSTASH_URL || !UPSTASH_TOKEN) {
      return new Response(JSON.stringify({ ok:false, error:'Missing Upstash env' }), { status: 500, headers: noStoreHeaders() });
    }
    let body = {}; try { body = await req.json(); } catch {}
    const pairId = body?.pairId || req.headers.get('x-mm-pair') || req.headers.get('x-partner-id') || null;
    const text = sanitizeText(body?.text || '');
    const updateId = body?.updateId || null;
    let challengeId = (body?.challengeId || '').toString().trim();

    if (!pairId) return new Response(JSON.stringify({ ok:false, error:'pairId required' }), { status: 400, headers: noStoreHeaders() });
    if (!text) return new Response(JSON.stringify({ ok:false, error:'text required' }), { status: 400, headers: noStoreHeaders() });

    // idempotency
    if (updateId) {
      const idemKey = `idem:${pairId}:challenge:start:${updateId}`;
      const setRes = await redis('set', idemKey, '1', 'EX', String(3*24*60*60), 'NX');
      if (!setRes) return new Response(JSON.stringify({ ok:true, idempotent:true }), { status: 200, headers: noStoreHeaders() });
    }

    if (!challengeId) {
      const rnd = Math.random().toString(36).slice(2,8);
      challengeId = `qc_${Date.now().toString(36)}_${rnd}`;
    }

    const createdAt = nowISO();
    const expiresAt = new Date(Date.now() + 24*60*60*1000).toISOString();
    const item = { text, status: 'pending', createdAt, expiresAt };
    const key = `challenges:${pairId}:${challengeId}`;
    await redis('set', key, JSON.stringify(item), 'EX', String(24*60*60));

    // bump versions
    const stateKey = `state:${pairId}`;
    await redis('hincrby', stateKey, 'challengesVersion', '1');
    await redis('hincrby', stateKey, 'ecologyVersion', '1');

    return new Response(JSON.stringify({ ok:true, challenge: { id: challengeId, ...item } }), { status: 200, headers: noStoreHeaders() });
  } catch (err) {
    return new Response(JSON.stringify({ ok:false, error: String(err?.message || err) }), { status: 500, headers: noStoreHeaders() });
  }
}
