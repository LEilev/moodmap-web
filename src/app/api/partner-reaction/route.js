// Next 15 Edge API — Sprint D
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { Redis } from '@upstash/redis';

function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) throw new Error('Missing Upstash Redis env');
  return new Redis({ url, token });
}

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...extraHeaders },
  });
}

function todayKeyUTC() {
  const d = new Date();
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`; // yyyy-mm-dd
}

function isoWeekKey(d = new Date()) {
  const date = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(),0,1));
  const weekNo = Math.ceil((((date - yearStart) / 86400000) + 1)/7);
  const wk = String(weekNo).padStart(2, '0');
  return `${date.getUTCFullYear()}-W${wk}`;
}

function clamp(n, min=0, max=100) { return Math.max(min, Math.min(max, n)); }

function safeParse(jsonStr, fallback = null) {
  try { return JSON.parse(jsonStr); } catch { return fallback; }
}

export async function POST(req) {
  try {
    const redis = getRedis();
    const body = await req.json().catch(() => ({}));
    const pairId = String(body?.pairId || '');
    const reaction = String(body?.reaction || '❤️');
    const updateId = String(body?.updateId || '');

    if (!pairId) return json({ ok:false, error:'Missing pairId' }, 400);
    if (!updateId) return json({ ok:false, error:'Missing updateId' }, 400);

    // Idempotency
    const idemKey = `idem:${pairId}:${updateId}`;
    const already = await redis.set(idemKey, '1', { nx: true, ex: 24 * 60 * 60 });
    if (already !== 'OK') {
      return json({ ok: true, idempotent: true });
    }

    // Write reaction of the day
    const today = todayKeyUTC();
    const reactKey = `reactions:${pairId}:${today}`;
    await redis.hset(reactKey, { type: reaction, time: new Date().toISOString() });
    await redis.expire(reactKey, 2 * 24 * 60 * 60); // auto-clean in 2 days

    // Optional: boost Peace & Passion by +2 in current week
    const wk = isoWeekKey(new Date());
    const scoreKey = `scores:${pairId}:${wk}`;
    const existing = await redis.get(scoreKey);
    let obj = (typeof existing === 'string') ? safeParse(existing, null) : existing;
    if (!obj) obj = { week: wk, peacePassion: 0, sync: 0, empathy: 0, trend: [] };
    const pp = clamp(Number(obj?.peacePassion || obj?.peace || 0) + 2);
    obj.peacePassion = pp;
    await redis.set(scoreKey, JSON.stringify(obj));

    // Bump versions
    await redis.hincrby(`state:${pairId}`, 'reactionsVersion', 1);
    await redis.hincrby(`state:${pairId}`, 'scoresVersion', 1);
    const newVersion = await redis.hincrby(`state:${pairId}`, 'version', 1);

    return json({ ok: true, version: Number(newVersion || 0) }, 200, { ETag: `W/"${String(newVersion)}"` });
  } catch (e) {
    return json({ ok:false, error: String(e?.message || e) }, 500);
  }
}
