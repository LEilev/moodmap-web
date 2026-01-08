export const runtime = 'edge';

import { redis } from '@/lib/redis';
import {
  INF_QUEUE,
  INF_UNSUB,
  INF_DEAD,
  INF_PAUSE
} from '@/lib/inf-keys';

/**
 * Edge-safe stats endpoint for Upstash REST client.
 * - Auth via ?token=CRON_TOKEN
 * - Uses manual SCAN loop (redis.scan) instead of KEYS / scanIterator
 * - Skips utility keys (inf:queue, inf:unsubscribed, inf:dead)
 * - Counts: total, queued, processing, sent, failed, unsubscribed, bounced, opened, clicked
 * - Returns { counts, queueLen, deadCount, paused }
 */
export async function GET(req) {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get('token');
    if (token !== process.env.CRON_TOKEN) {
      return new Response('Forbidden', { status: 403 });
    }

    const counts = {
      total: 0,
      queued: 0,
      processing: 0,
      sent: 0,
      failed: 0,
      unsubscribed: 0,
      bounced: 0,
      opened: 0,
      clicked: 0,
    };

    // Manual SCAN loop
    let cursor = '0';
    let guard = 0;

    do {
      const res = await redis.scan(cursor, { match: 'inf:*', count: 200 });
      let nextCursor = '0';
      let keys = [];

      if (Array.isArray(res)) {
        nextCursor = String(res[0] ?? '0');
        keys = Array.isArray(res[1]) ? res[1] : [];
      } else if (res && typeof res === 'object') {
        nextCursor = String(res.cursor ?? res[0] ?? '0');
        keys = Array.isArray(res.keys) ? res.keys : (Array.isArray(res.values) ? res.values : []);
      }

      for (const key of keys) {
        if (!key) continue;
        if (key === INF_QUEUE || key === INF_UNSUB || key === INF_DEAD) continue;

        let h;
        try {
          h = await redis.hgetall(key);
        } catch {
          continue;
        }
        if (!h || Object.keys(h).length === 0) continue;

        counts.total++;

        const st = (h.status || 'queued').toLowerCase();
        if (Object.prototype.hasOwnProperty.call(counts, st)) {
          counts[st]++;
        }

        const opensNum = parseInt(h.opens ?? '0', 10);
        const clicksNum = parseInt(h.clicks ?? '0', 10);
        if (h.openedAt || (Number.isFinite(opensNum) && opensNum > 0)) counts.opened++;
        if (h.clickedAt || (Number.isFinite(clicksNum) && clicksNum > 0)) counts.clicked++;
      }

      cursor = nextCursor;
      guard++;
      if (guard > 1000) break;
    } while (cursor !== '0');

    let queueLen = 0;
    try { queueLen = await redis.llen(INF_QUEUE); } catch { queueLen = 0; }

    let deadCount = 0;
    try { deadCount = await redis.scard(INF_DEAD); } catch { deadCount = 0; }

    let paused = false;
    try { paused = Boolean(await redis.get(INF_PAUSE)); } catch { paused = false; }

    return new Response(JSON.stringify({ counts, queueLen, deadCount, paused }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: 'stats_failed', message: String(e?.message ?? e) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
