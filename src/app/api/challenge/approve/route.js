// app/api/challenge/approve/route.js — Harmony Implementation & Improvement Pack
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
function isoDayKey(d=new Date()) { return d.toISOString().slice(0,10); }
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
      const idemKey = `idem:${pairId}:challenge:approve:${updateId}`;
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
    if (obj.status === 'approved') {
      return new Response(JSON.stringify({ ok:true, syncEnergyDelta: 0 }), { status: 200, headers: noStore() });
    }
    if (obj.status !== 'completed') {
      // If it's still pending or already handled differently, cannot approve
      return new Response(JSON.stringify({ ok:false, error:'challenge not completed' }), { status: 400, headers: noStore() });
    }
    // Mark as approved
    obj.status = 'approved';
    obj.approvedAt = new Date().toISOString();
    await redis('set', key, JSON.stringify(obj), 'EX', String(await redis('ttl', key) || 86400));
    // Compute sync energy delta (similar to kudos, counting this as a mission done)
    let syncEnergyDelta = 0;
    try {
      // Add challenge as completed mission for today
      const todayKey = isoDayKey();
      const missionsKey = `missions:${pairId}:${todayKey}`;
      let missionsList = [];
      const mraw = await redis('get', missionsKey);
      if (mraw) {
        try { missionsList = JSON.parse(mraw) || []; } catch { missionsList = []; }
      }
      missionsList.push({ id: challengeId, status: 'done', text: obj.text || 'Quick challenge' });
      await redis('set', missionsKey, JSON.stringify(missionsList), 'EX', String(48*60*60));
      // Compute energy before and after
      const computeEnergy = async () => {
        let kudosDays = 0, daysWithMissions = 0, missionsDone = 0, missionsTotal = 0;
        for (let i = 0; i < 7; i++) {
          const dKey = isoDayKey(new Date(Date.now() - i*24*3600*1000));
          try {
            const mraw2 = await redis('get', `missions:${pairId}:${dKey}`);
            if (mraw2) {
              let list = []; try { list = JSON.parse(mraw2) || []; } catch {}
              if (Array.isArray(list) && list.length > 0) {
                daysWithMissions += 1; missionsTotal += list.length;
                missionsDone += list.filter(m => m && m.status === 'done').length;
              }
            }
          } catch {}
          try {
            const r = await redis('hgetall', `reactions:${pairId}:${dKey}`);
            if (r && (r.type || r.note || r.time)) {
              kudosDays += 1;
            }
          } catch {}
        }
        const missionPct = missionsTotal > 0 ? Math.round((missionsDone / missionsTotal) * 100) : (daysWithMissions > 0 ? 0 : 50);
        const kudosPct = Math.round((kudosDays / 7) * 100);
        return Math.max(0, Math.min(100, Math.round(0.5 * missionPct + 0.5 * kudosPct)));
      };
      const prevEnergy = await computeEnergy();
      // now that mission is added, compute new energy
      const newEnergy = await computeEnergy();
      if (Number.isFinite(prevEnergy) && Number.isFinite(newEnergy)) {
        syncEnergyDelta = newEnergy - prevEnergy;
      }
    } catch {}
    // Bump versions
    await redis('hincrby', `state:${pairId}`, 'challengesVersion', '1');
    await redis('hincrby', `state:${pairId}`, 'missionsVersion', '1');
    await redis('hincrby', `state:${pairId}`, 'scoresVersion', '1'); // scores might be indirectly affected via energy
    await redis('hincrby', `state:${pairId}`, 'ecologyVersion', '1');
    return new Response(JSON.stringify({ ok:true, syncEnergyDelta }), { status: 200, headers: noStore() });
  } catch (err) {
    return new Response(JSON.stringify({ ok:false, error: String(err?.message || err) }), { status: 500, headers: noStore() });
  }
}
