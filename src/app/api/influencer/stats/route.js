export const runtime = 'edge';

import { redis } from '@/lib/redis';
import { INF_QUEUE, INF_UNSUB } from '@/lib/inf-keys';

/**
 * Edge-safe stats endpoint for Upstash REST client.
 * - Auth via ?token=CRON_TOKEN
 * - Uses manual SCAN loop (redis.scan) instead of KEYS / scanIterator
 * - Skips utility keys (inf:queue, inf:unsubscribed)
 * - Counts: total, queued, sent, unsubscribed, bounced, opened, clicked
 * - Returns { counts, queueLen } as JSON
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
      sent: 0,
      unsubscribed: 0,
      bounced: 0,
      opened: 0,
      clicked: 0,
    };

    // Manual SCAN loop
    let cursor = '0';
    let guard = 0; // safety guard to avoid infinite loops

    do {
      // Upstash REST client returns either [cursor, keys] (array) or { cursor, keys } (object).
      const res = await redis.scan(cursor, { match: 'inf:*', count: 200 });
      let nextCursor = '0';
      let keys = [];

      if (Array.isArray(res)) {
        // Standard Redis style: [cursor, keys[]]
        nextCursor = String(res[0] ?? '0');
        keys = Array.isArray(res[1]) ? res[1] : [];
      } else if (res && typeof res === 'object') {
        // Upstash object style: { cursor, keys } (or sometimes { cursor, values })
        nextCursor = String(res.cursor ?? res[0] ?? '0');
        keys = Array.isArray(res.keys) ? res.keys : (Array.isArray(res.values) ? res.values : []);
      }

      for (const key of keys) {
        if (!key) continue;
        if (key === INF_QUEUE || key === INF_UNSUB) continue; // skip utility keys

        // Try reading hash; skip non-hash keys gracefully
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
      if (guard > 1000) break; // extreme safety for unexpected server responses
    } while (cursor !== '0');

    // Queue length
    let queueLen = 0;
    try {
      queueLen = await redis.llen(INF_QUEUE);
    } catch {
      queueLen = 0;
    }

    return new Response(JSON.stringify({ counts, queueLen }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: 'stats_failed', message: String(e?.message ?? e) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
