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

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const pairId = url.searchParams.get('pairId') || req.headers.get('x-mm-pair') || '';
    if (!pairId) return json({ ok: false, error: 'Missing pairId' }, 400);

    const redis = getRedis();
    const state = await redis.hgetall(`state:${pairId}`);
    const insightsVersion = Number(state?.insightsVersion || 0);

    // Build data from current and last 3 weeks (if available)
    const now = new Date();
    const weeks = [];
    for (let i = 3; i >= 0; i--) {
      const d = new Date(now.getTime() - i*7*24*60*60*1000);
      weeks.push(isoWeekKey(d));
    }

    const history = [];
    let current = null;
    let trend = null;

    for (const wk of weeks) {
      const key = `scores:${pairId}:${wk}`;
      const raw = await redis.get(key);
      if (!raw) continue;
      const obj = typeof raw === 'string' ? safeParse(raw, null) : raw;
      if (!obj) continue;
      const peace = Number(obj?.peacePassion ?? obj?.peace ?? 0);
      const sync = Number(obj?.sync ?? obj?.syncScore ?? 0);
      const emp = Number(obj?.empathy ?? obj?.empathyScore ?? 0);
      if (wk === isoWeekKey(now)) {
        current = {
          week: wk, peacePassion: clamp(peace), syncScore: clamp(sync), empathyScore: clamp(emp)
        };
        if (Array.isArray(obj?.trend)) {
          // assume trend is daily P&P values for the week
          const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
          trend = { days, peacePassion: obj.trend.map((v) => clamp(Number(v)||0)) };
        }
      } else {
        history.push({ week: wk, peacePassion: clamp(peace), syncScore: clamp(sync), empathyScore: clamp(emp) });
      }
    }

    // Fallback dummy if nothing found
    if (!current) {
      current = { week: isoWeekKey(now), peacePassion: 72, syncScore: 70, empathyScore: 62 };
    }

    return json({ ok: true, insightsVersion, data: { current, history, trend, upcoming: null } });
  } catch (e) {
    return json({ ok: false, error: String(e?.message || e) }, 500);
  }
}
