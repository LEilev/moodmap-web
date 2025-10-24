export const runtime = 'edge';

import { redis } from '@/lib/redis';
import { INF_QUEUE, INF_UNSUB, infKey, nowISO } from '@/lib/inf-keys';

export async function POST(req) {
  try {
    const body = await req.json();
    const items = Array.isArray(body) ? body : (body?.contacts || [body]);
    let added = 0, skipped = 0, unsub = 0;

    for (const it of items) {
      const email = (it.email || '').trim().toLowerCase();
      if (!email) { skipped++; continue; }

      const isUnsub = await redis.sismember(INF_UNSUB, email);
      if (isUnsub) { unsub++; continue; }

      const key = infKey(email);
      const exists = await redis.exists(key);
      if (exists) { skipped++; continue; }

      await redis.hset(key, {
        email, name: it.name || '', handle: it.handle || '', followers: it.followers || 0,
        status: 'queued', createdAt: nowISO(), lastSent: '', followupsSent: 0, openedAt: '', clickedAt: ''
      });
      await redis.rpush(INF_QUEUE, email);
      added++;
    }

    return new Response(JSON.stringify({ added, skipped, unsub }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 400 });
  }
}
