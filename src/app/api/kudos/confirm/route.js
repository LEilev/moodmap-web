// app/api/kudos/confirm/route.js — Harmony Implementation & Improvement Pack
export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

const DEV = process.env.NODE_ENV !== 'production';
function devLog(...args) { if (DEV) { try { console.log('[HarmonyDev][kudos]', ...args); } catch {} } }
function noStore(extra = {}) {
  return { 'Cache-Control': 'no-store', 'Content-Type': 'application/json; charset=utf-8', ...extra };
}
async function redis(cmd, ...args) {
  const url = `${UPSTASH_URL}/${cmd}/${args.map(a => encodeURIComponent(String(a))).join('/')}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` } });
  if (!res.ok) throw new Error(`Upstash ${cmd} failed: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data.result;
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
      return new Response(JSON.stringify({ ok: false, error: 'Missing Upstash env' }), { status: 500, headers: noStore() });
    }
    const body = await req.json().catch(() => ({}));
    const pairId = body?.pairId || req.headers.get('x-mm-pair') || req.headers.get('x-partner-id') || null;
    const emoji = (body?.emoji || body?.reaction || '').toString();
    const note = sanitizeNote(body?.note || '');
    const updateId = body?.updateId || null;
    if (!pairId) return new Response(JSON.stringify({ ok: false, error: 'pairId required' }), { status: 400, headers: noStore() });
    if (!emoji && !note) return new Response(JSON.stringify({ ok: false, error: 'emoji or note required' }), { status: 400, headers: noStore() });
    // Blocklist check
    try {
      const blocked = await redis('get', `blocklist:${pairId}`);
      if (blocked) {
        devLog('403 blocklist hit', { pairId });
        return new Response(JSON.stringify({ ok: false, error: 'blocked', isValidConnection: false }), { status: 403, headers: noStore() });
      }
    } catch {}
    // Idempotency check
    const dayKey = isoDayKey();
    if (updateId) {
      const idemKey = `idem:${pairId}:${dayKey}:kudos:${updateId}`;
      const setRes = await redis('set', idemKey, '1', 'EX', String(3 * 24 * 60 * 60), 'NX');
      if (!setRes) {
        return new Response(JSON.stringify({ ok: true, idempotent: true }), { status: 200, headers: noStore() });
      }
    }
    // Store reaction (type = emoji, note, time)
    const reactKey = `reactions:${pairId}:${dayKey}`;
    await redis('hset', reactKey, 'type', emoji || 'kudos', 'time', nowISO(), 'note', note);
    await redis('expire', reactKey, String(2 * 24 * 60 * 60));
    // Peace & Passion boost (+2) if weekly scores object exists
    try {
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
          const nextPP = Math.max(0, Math.min(100, Math.round(obj.peacePassion + 2)));
          obj.peacePassion = nextPP;
          await redis('set', scoresKey, JSON.stringify(obj), 'EX', String(8 * 24 * 60 * 60));
          await redis('hincrby', `state:${pairId}`, 'scoresVersion', '1');
        }
      }
    } catch {}
    // Compute sync energy delta
    let syncEnergyDelta = 0;
    try {
      // Compute energy before and after this kudos
      const computeEnergy = async (endDate) => {
        let kudosDays = 0, daysWithMissions = 0, missionsDone = 0, missionsTotal = 0;
        for (let i = 0; i < 7; i++) {
          const dKey = isoDayKey(new Date(endDate.getTime() - i*24*3600*1000));
          try {
            const mraw = await redis('get', `missions:${pairId}:${dKey}`);
            if (mraw) {
              let list = []; try { list = JSON.parse(mraw) || []; } catch {}
              if (Array.isArray(list) && list.length > 0) {
                daysWithMissions += 1;
                missionsTotal += list.length;
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
        const energy = Math.max(0, Math.min(100, Math.round(0.5 * missionPct + 0.5 * kudosPct)));
        return energy;
      };
      const now = new Date();
      const prevEnergy = await computeEnergy(new Date(now.getTime() - 1000)); // just before now
      const newEnergy = await computeEnergy(now);
      if (Number.isFinite(prevEnergy) && Number.isFinite(newEnergy)) {
        syncEnergyDelta = newEnergy - prevEnergy;
      }
    } catch (err) {
      devLog('compute energy delta error', String(err));
    }
    // Bump versions
    await redis('hincrby', `state:${pairId}`, 'reactionsVersion', '1');
    await redis('hincrby', `state:${pairId}`, 'version', '1');
    await redis('hincrby', `state:${pairId}`, 'ecologyVersion', '1');
    devLog('Kudos sent', { pairId, emoji, note, syncEnergyDelta });
    const glowUntil = Date.now() + 30 * 60 * 1000;
    return new Response(JSON.stringify({ ok: true, syncEnergyDelta, glowUntil }), { status: 200, headers: noStore() });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: String(err.message || err) }), { status: 500, headers: noStore() });
  }
}
