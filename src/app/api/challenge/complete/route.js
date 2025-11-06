// app/api/challenge/complete/route.js — Harmony Patch 2
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

function nowISO() { return new Date().toISOString(); }

export async function POST(req) {
  try {
    if (!UPSTASH_URL || !UPSTASH_TOKEN) {
      return new Response(JSON.stringify({ ok:false, error:'Missing Upstash env' }), { status: 500, headers: noStoreHeaders() });
    }
    let body = {}; try { body = await req.json(); } catch {}
    const pairId = body?.pairId || req.headers.get('x-mm-pair') || req.headers.get('x-partner-id') || null;
    const challengeId = (body?.challengeId || '').toString().trim();
    const updateId = body?.updateId || null;

    if (!pairId) return new Response(JSON.stringify({ ok:false, error:'pairId required' }), { status: 400, headers: noStoreHeaders() });
    if (!challengeId) return new Response(JSON.stringify({ ok:false, error:'challengeId required' }), { status: 400, headers: noStoreHeaders() });

    // idempotency
    if (updateId) {
      const idemKey = `idem:${pairId}:challenge:complete:${challengeId}:${updateId}`;
      const setRes = await redis('set', idemKey, '1', 'EX', String(3*24*60*60), 'NX');
      if (!setRes) return new Response(JSON.stringify({ ok:true, idempotent:true }), { status: 200, headers: noStoreHeaders() });
    }

    const key = `challenges:${pairId}:${challengeId}`;
    const raw = await redis('get', key);
    if (!raw) return new Response(JSON.stringify({ ok:false, error: 'challenge not found or expired' }), { status: 404, headers: noStoreHeaders() });
    let obj = null; try { obj = JSON.parse(raw); } catch {}
    if (!obj) return new Response(JSON.stringify({ ok:false, error: 'invalid challenge item' }), { status: 500, headers: noStoreHeaders() });

    if (obj.status === 'approved') {
      return new Response(JSON.stringify({ ok:true, challenge: { id: challengeId, ...obj }, idempotent:true }), { status: 200, headers: noStoreHeaders() });
    }

    if (obj.status !== 'pending') {
      // If already completed, idempotent
      if (obj.status === 'completed') {
        return new Response(JSON.stringify({ ok:true, challenge: { id: challengeId, ...obj }, idempotent:true }), { status: 200, headers: noStoreHeaders() });
      }
    }

    obj.status = 'completed';
    obj.completedAt = nowISO();

    // preserve TTL
    let ttl = Number(await redis('ttl', key));
    if (ttl < 0) ttl = 24*60*60;
    await redis('set', key, JSON.stringify(obj), 'EX', String(ttl));

    const stateKey = `state:${pairId}`;
    await redis('hincrby', stateKey, 'challengesVersion', '1');
    await redis('hincrby', stateKey, 'ecologyVersion', '1');

    return new Response(JSON.stringify({ ok:true, challenge: { id: challengeId, ...obj } }), { status: 200, headers: noStoreHeaders() });
  } catch (err) {
    return new Response(JSON.stringify({ ok:false, error: String(err?.message || err) }), { status: 500, headers: noStoreHeaders() });
  }
}
