// Harmony Sync-Fix – 2025-11-10
// Sprint E: Hydration guard + 304 handling + Stable Partner Sync

export const runtime = 'edge';

import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const headersNoStore = {
  'Cache-Control': 'no-store',
  'Content-Type': 'application/json; charset=utf-8',
};

function normalizeOwnerDate(input) {
  if (!input) return null;
  const s = String(input).trim();
  if (/^\d{8}$/.test(s)) return `${s.slice(0,4)}-${s.slice(4,6)}-${s.slice(6,8)}`;
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const dt = new Date(s); if (!Number.isNaN(dt)) return dt.toISOString().slice(0,10);
  return null;
}
function todayKeyUTC() {
  const d = new Date();
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

async function stateExists(pairId) {
  try { return Number(await redis.exists(`state:${pairId}`)) > 0; } catch { return false; }
}

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const pairId = String(body.pairId || '').trim();
    const ownerDateRaw = String(body.ownerDate || '').trim();
    const updateId = String(body.updateId || '').trim();

    if (!pairId || !updateId) {
      return new Response(JSON.stringify({ ok: false, error: 'pairId and updateId required' }), { status: 400, headers: headersNoStore });
    }

    // Missing/invalid pair → not 403 (only blocklist is 403)
    const exists = await stateExists(pairId);
    if (!exists) {
      return new Response(JSON.stringify({ ok: false, error: 'Missing pair' }), { status: 200, headers: headersNoStore });
    }

    const blocked = await redis.get(`blocklist:${pairId}`);
    if (blocked) {
      return new Response(JSON.stringify({ ok: false, error: 'blocked' }), { status: 403, headers: headersNoStore });
    }

    const stateKey = `state:${pairId}`;
    const state = await redis.hgetall(stateKey);

    // Normalize ownerDate with fallback
    let ownerDate = normalizeOwnerDate(ownerDateRaw);
    if (!ownerDate) {
      const fromState = state?.currentDate ? normalizeOwnerDate(state.currentDate) : null;
      ownerDate = fromState || todayKeyUTC();
    }

    // Idempotency (24h)
    const idemKey = `idemp:${pairId}:${updateId}`;
    const idem = await redis.set(idemKey, 1, { nx: true, ex: 60 * 60 * 24 });
    if (idem === null) {
      const prevVersion = Number(state?.version || 0);
      return new Response(JSON.stringify({ ok: true, version: prevVersion, idempotent: true }), { status: 200, headers: headersNoStore });
    }

    // Upsert feedback
    const fbKey = `feedback:${pairId}:${ownerDate}`;
    const patch = {};
    if ('vibe' in body && typeof body.vibe === 'string') patch.vibe = body.vibe;
    if ('readiness' in body && (typeof body.readiness === 'number' || typeof body.readiness === 'string')) {
      const n = Number(body.readiness);
      patch.readiness = Number.isNaN(n) ? null : n;
    }
    if ('tips' in body && Array.isArray(body.tips)) { patch.tips = JSON.stringify(body.tips); }
    if ('reactionAck' in body) patch.reactionAck = body.reactionAck ? '1' : '0';

    if (Object.keys(patch).length > 0) {
      await redis.hset(fbKey, patch);
      try { await redis.expire(fbKey, 108000); } catch {}
    }

    // State bump rules
    let bump = false;
    if ('vibe' in body || 'readiness' in body || 'tips' in body) bump = true;
    if ('reactionAck' in body) bump = true;
    if ('missionsVersion' in body || 'scoresVersion' in body) bump = true;

    let newVersion = Number(state?.version || 0);
    if (bump) newVersion = await redis.hincrby(stateKey, 'version', 1);
    await redis.hset(stateKey, { currentDate: ownerDate });

    return new Response(JSON.stringify({ ok: true, version: newVersion }), { status: 200, headers: headersNoStore });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: 'server_error', detail: String(err) }), { status: 500, headers: headersNoStore });
  }
}
