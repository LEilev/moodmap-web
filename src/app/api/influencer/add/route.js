export const runtime = 'edge';

import { redis } from '@/lib/redis';
import { INF_QUEUE, INF_UNSUB, infKey, nowISO } from '@/lib/inf-keys';

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

function normEmail(v) {
  return String(v || '').trim().toLowerCase();
}

export async function POST(req) {
  const url = new URL(req.url);
  const token = url.searchParams.get('token');
  if (token !== process.env.CRON_TOKEN) return new Response('Forbidden', { status: 403 });

  try {
    const body = await req.json();
    const items = Array.isArray(body) ? body : (body?.contacts || [body]);
    let added = 0, skipped = 0, unsub = 0;

    for (const it of items) {
      const email = normEmail(it?.email ?? it);
      if (!email) { skipped++; continue; }

      const isUnsub = await redis.sismember(INF_UNSUB, email);
      if (isUnsub) { unsub++; continue; }

      const key = infKey(email);
      const exists = await redis.exists(key);
      if (exists) { skipped++; continue; }

      await redis.hset(key, {
        email,
        name: (it?.name ?? '').toString(),
        handle: (it?.handle ?? '').toString(),
        followers: Number(it?.followers ?? 0) || 0,

        status: 'queued',
        attempts: 0,

        createdAt: nowISO(),
        processingAt: '',
        lastError: '',

        lastSent: '',
        followupsSent: 0,

        openedAt: '',
        clickedAt: '',
        opens: 0,
        clicks: 0,
      });

      await redis.rpush(INF_QUEUE, email);
      added++;
    }

    return json({ added, skipped, unsub }, 200);
  } catch (e) {
    return json({ error: 'bad_request', message: String(e?.message ?? e) }, 400);
  }
}
