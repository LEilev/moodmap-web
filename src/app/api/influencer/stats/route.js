export const runtime = 'edge';

import { redis } from '@/lib/redis';
import { INF_QUEUE, INF_UNSUB } from '@/lib/inf-keys';

/**
 * Edge-safe stats endpoint.
 * - Auth via ?token=CRON_TOKEN
 * - Uses scanIterator({ match: 'inf:*' }) instead of KEYS
 * - Skips non-hash keys (inf:queue, inf:unsubscribed)
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

    // SCAN over inf:* keys (Edge-safe). Skip non-hash utility keys.
    // Chunk size (count) is a hint; small volumes are fine.
    for await (const key of redis.scanIterator({ match: 'inf:*', count: 200 })) {
      if (key === INF_QUEUE || key === INF_UNSUB) continue;

      // hgetall on non-hash keys would throw; guard with try/catch.
      let h;
      try {
        h = await redis.hgetall(key);
      } catch {
        continue; // not a hash or transient issue; skip
      }
      if (!h || Object.keys(h).length === 0) continue;

      counts.total++;

      // status bucket
      const st = (h.status || 'queued').toLowerCase();
      if (Object.prototype.hasOwnProperty.call(counts, st)) {
        counts[st]++;
      }

      // opened / clicked heuristics (either timestamp or counters present)
      const opens = parseInt(h.opens ?? '0', 10);
      const clicks = parseInt(h.clicks ?? '0', 10);
      if (h.openedAt || (Number.isFinite(opens) && opens > 0)) counts.opened++;
      if (h.clickedAt || (Number.isFinite(clicks) && clicks > 0)) counts.clicked++;
    }

    const queueLen = await redis.llen(INF_QUEUE);

    return new Response(JSON.stringify({ counts, queueLen }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    // Ensure JSON on unexpected errors (avoid Next.js default 500 page)
    return new Response(JSON.stringify({ error: 'stats_failed', message: String(e?.message || e) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
