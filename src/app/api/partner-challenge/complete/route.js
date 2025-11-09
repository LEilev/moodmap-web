export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

const WEEK_TTL_SEC = 7 * 24 * 60 * 60;

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
function isoDayKey(d=new Date()) { return d.toISOString().slice(0,10); }
function endOfDayISO(d = new Date()) {
  const x = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 23, 59, 59, 999));
  return x.toISOString();
}
function nowISO() { return new Date().toISOString(); }

export async function POST(req) {
  try {
    if (!UPSTASH_URL || !UPSTASH_TOKEN) {
      return new Response(JSON.stringify({ ok:false, error:'Missing Upstash env' }), { status: 500, headers: noStore() });
    }
    const body = await req.json().catch(() => ({}));
    const pairId = body?.pairId || req.headers.get('x-mm-pair') || req.headers.get('x-partner-id') || null;
    const challengeId = (body?.challengeId || '').toString().trim();
    const candidateMissionId = (body?.missionId || '').toString().trim(); // optional, bridge checks both
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
        const curVer = Number(await redis('hget', `state:${pairId}`, 'challengesVersion')) || 0;
        return new Response(JSON.stringify({ ok:true, idempotent:true, version: curVer }), { status: 200, headers: noStore() });
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
    if (obj.status === 'approved') {
      const curVer = Number(await redis('hget', `state:${pairId}`, 'challengesVersion')) || 0;
      return new Response(JSON.stringify({ ok:true, awaitingApproval:false, version: curVer }), { status: 200, headers: noStore() });
    }
    if (obj.status === 'completed') {
      // Already marked completed; still ensure bridge exists if missions list is present but missing entry
      try {
        const dayKey = isoDayKey();
        const missionsKey = `missions:${pairId}:${dayKey}`;
        const mraw = await redis('get', missionsKey);
        if (mraw) {
          let list = []; try { list = JSON.parse(mraw) || []; } catch { list = []; }
          const wantId = candidateMissionId || challengeId;
          const has = Array.isArray(list) && list.some(m => m && (m.id === wantId || m.id === `bridge-${challengeId}`));
          if (!has) {
            const now = Date.now();
            const bridge = {
              id: `bridge-${challengeId}`,
              title: (obj.text || 'Challenge task'),
              difficulty: 2,
              points: 10,
              phase: 'general',
              status: 'completed',
              createdAt: now,
              completedAt: now,
              expiresAt: endOfDayISO(new Date()),
            };
            list.push(bridge);
            await redis('set', missionsKey, JSON.stringify(list), 'EX', String(WEEK_TTL_SEC));
          }
        }
      } catch {}
      const curVer = Number(await redis('hget', `state:${pairId}`, 'challengesVersion')) || 0;
      return new Response(JSON.stringify({ ok:true, awaitingApproval:true, version: curVer }), { status: 200, headers: noStore() });
    }
    // Mark as completed (keep original challenge TTL if present, else default 24h)
    obj.status = 'completed';
    obj.completedAt = nowISO();
    const ttl = Number(await redis('ttl', key)) || 86400;
    await redis('set', key, JSON.stringify(obj), 'EX', String(ttl));

    // --- Auto-bridge: if today's missions list exists but no mission matches, add synthetic mission ---
    try {
      const dayKey = isoDayKey();
      const missionsKey = `missions:${pairId}:${dayKey}`;
      const mraw = await redis('get', missionsKey);
      if (mraw) {
        let list = []; try { list = JSON.parse(mraw) || []; } catch { list = []; }
        const wantId = candidateMissionId || challengeId;
        const has = Array.isArray(list) && list.some(m => m && (m.id === wantId || m.id === `bridge-${challengeId}`));
        if (!has) {
          const now = Date.now();
          const bridge = {
            id: `bridge-${challengeId}`,
            title: (obj.text || 'Challenge task'),
            difficulty: 2,
            points: 10,
            phase: 'general',
            status: 'completed',
            createdAt: now,
            completedAt: now,
            expiresAt: endOfDayISO(new Date()),
          };
          list.push(bridge);
          await redis('set', missionsKey, JSON.stringify(list), 'EX', String(WEEK_TTL_SEC));
        }
      }
    } catch {}

    // Bump versions (domain + global), refresh TTLs
    const stateKey = `state:${pairId}`;
    const newChallengesVersion = await redis('hincrby', stateKey, 'challengesVersion', '1');
    await redis('hincrby', stateKey, 'version', '1'); // global
    await redis('expire', stateKey, String(WEEK_TTL_SEC));
    await redis('expire', `ecology:${pairId}`, String(WEEK_TTL_SEC));

    return new Response(JSON.stringify({ ok:true, awaitingApproval:true, version: Number(newChallengesVersion) }), { status: 200, headers: noStore() });
  } catch (err) {
    return new Response(JSON.stringify({ ok:false, error: String(err?.message || err) }), { status: 500, headers: noStore() });
  }
}
