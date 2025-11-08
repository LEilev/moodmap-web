// app/api/challenge/complete/route.js — Harmony Implementation & Improvement Pack
export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

function noStore(extra={}) {
  return { 'Cache-Control': 'no-store', 'Content-Type': 'application/json; charset=utf-8', ...extra };
}
async function redis(cmd, ...args) {
  const url = `${UPSTASH_URL}/${cmd}/${args.map(a => encodeURIComponent(String(a))).join('/')}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` } });
  if (!res.ok) throw new Error(`Upstash ${cmd} failed: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data.result;
}
export async function POST(req) {
  try {
    if (!UPSTASH_URL || !UPSTASH_TOKEN) {
      return new Response(JSON.stringify({ ok:false, error:'Missing Upstash env' }), { status: 500, headers: noStore() });
    }
    const body = await req.json().catch(() => ({}));
    const pairId = body?.pairId || req.headers.get('x-mm-pair') || req.headers.get('x-partner-id') || null;
    const challengeId = (body?.challengeId || '').toString().trim();
    const updateId = body?.updateId || null;
    if (!pairId) return new Response(JSON.stringify({ ok:false, error:'pairId required' }), { status: 400, headers: noStore() });
    if (!challengeId) return new Response(JSON.stringify({ ok:false, error:'challengeId required' }), { status: 400, headers: noStore() });
    // Blocklist check
    try {
      const blocked = await redis('get', `blocklist:${pairId}`);
      if (blocked) {
        return new Response(JSON.stringify({ ok:false, error:'blocked' }), { status: 403, headers: noStore() });
      }
    } catch {}
    // Idempotency
    if (updateId) {
      const idemKey = `idem:${pairId}:challenge:complete:${updateId}`;
      const setRes = await redis('set', idemKey, '1', 'EX', String(3*24*60*60), 'NX');
      if (!setRes) {
        return new Response(JSON.stringify({ ok:true, idempotent:true }), { status: 200, headers: noStore() });
      }
    }
    const key = `challenges:${pairId}:${challengeId}`;
    const raw = await redis('get', key);
    if (!raw) {
      return new Response(JSON.stringify({ ok:false, error:'challenge not found or expired' }), { status: 404, headers: noStore() });
    }
    let obj = null;
    try { obj = JSON.parse(raw); } catch {}
    if (!obj || typeof obj !== 'object') {
      return new Response(JSON.stringify({ ok:false, error:'invalid challenge data' }), { status: 500, headers: noStore() });
    }
    if (obj.status === 'completed' || obj.status === 'approved') {
      // Already marked completed or beyond
      return new Response(JSON.stringify({ ok:true, awaitingApproval: obj.status !== 'approved' }), { status: 200, headers: noStore() });
    }
    // Mark as completed
    obj.status = 'completed';
    await redis('set', key, JSON.stringify(obj), 'EX', String(await redis('ttl', key) || 86400));
    // Bump version
    await redis('hincrby', `state:${pairId}`, 'challengesVersion', '1');
    // No ecology bump here since no immediate effect on environment until approval
    return new Response(JSON.stringify({ ok:true, awaitingApproval:true }), { status: 200, headers: noStore() });
  } catch (err) {
    return new Response(JSON.stringify({ ok:false, error: String(err?.message || err) }), { status: 500, headers: noStore() });
  }
}
