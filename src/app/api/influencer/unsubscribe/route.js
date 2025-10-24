export const runtime = 'edge';

import { redis } from '@/lib/redis';
import { INF_UNSUB, infKey } from '@/lib/inf-keys';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = (searchParams.get('email') || '').toLowerCase();
  if (!email) return new Response('Missing email', { status: 400 });

  await redis.sadd(INF_UNSUB, email);
  const key = infKey(email);
  if (await redis.exists(key)) await redis.hset(key, { status: 'unsubscribed' });

  const html = `<html><body style="font-family:system-ui">
    <h3>Avmeldt</h3><p>${email} er avmeldt fra videre henvendelser.</p></body></html>`;
  return new Response(html, { status: 200, headers: { 'Content-Type': 'text/html' } });
}
