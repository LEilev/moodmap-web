export const runtime = 'edge';

import { redis } from '@/lib/redis';
import { INF_QUEUE, INF_UNSUB, infKey, nowISO } from '@/lib/inf-keys';
import { initialTemplate, followupTemplate } from '@/lib/email-templates';

const RESEND_API = 'https://api.resend.com/emails';

async function sendEmail({ to, subject, html, listUnsub, from, apiKey }) {
  const res = await fetch(RESEND_API, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to, subject, html, headers: { 'List-Unsubscribe': listUnsub } })
  });
  if (!res.ok) throw new Error(`Resend ${res.status}`);
  return await res.json();
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');
  if (token !== process.env.CRON_TOKEN) return new Response('Forbidden', { status: 403 });

  const batch = parseInt(searchParams.get('batch') || '10', 10);
  const doFollowups = searchParams.get('followups') === '1';

  const baseUrl = process.env.BASE_URL;
  const from = process.env.EMAIL_FROM;
  const apiKey = process.env.RESEND_API_KEY;

  const results = { sent: [], followups: 0, skipped: [], errors: [] };

  if (!doFollowups) {
    for (let i = 0; i < batch; i++) {
      const email = await redis.lpop(INF_QUEUE);
      if (!email) break;

      const isUnsub = await redis.sismember(INF_UNSUB, email);
      if (isUnsub) { results.skipped.push({ email, reason: 'unsubscribed' }); continue; }

      const key = infKey(email);
      const inf = await redis.hgetall(key);
      if (inf?.status === 'unsubscribed') { results.skipped.push({ email, reason: 'unsubscribed' }); continue; }

      const { subject, html, listUnsub } = initialTemplate({
        baseUrl, email, name: inf?.name, handle: inf?.handle
      });

      try {
        await sendEmail({ to: email, subject, html, listUnsub, from, apiKey });
        await redis.hset(key, { status: 'sent', lastSent: nowISO(), followupsSent: inf?.followupsSent || 0 });
        results.sent.push(email);
      } catch (e) {
        results.errors.push({ email, error: e.message });
        await redis.rpush(INF_QUEUE, email); // retry neste runde
      }
    }
  } else {
    // Enkel follow-up scan (OK for små volumer)
    const keys = await redis.keys('inf:*');
    const sevenDaysAgo = Date.now() - 7*24*60*60*1000;

    let count = 0;
    for (const key of keys) {
      if (!key.startsWith('inf:')) continue;
      const inf = await redis.hgetall(key);
      if (!inf) continue;
      if (inf.status !== 'sent') continue;
      if (parseInt(inf.followupsSent || '0', 10) > 0) continue;
      if (!inf.lastSent || Date.parse(inf.lastSent) > sevenDaysAgo) continue;

      const email = inf.email;
      const isUnsub = await redis.sismember(INF_UNSUB, email);
      if (isUnsub) continue;

      const { subject, html, listUnsub } = followupTemplate({
        baseUrl, email, name: inf?.name, handle: inf?.handle
      });

      try {
        await sendEmail({ to: email, subject, html, listUnsub, from, apiKey });
        await redis.hset(key, { lastSent: nowISO(), followupsSent: 1 });
        results.followups++;
        count++;
        if (count >= batch) break;
      } catch (e) {
        results.errors.push({ email, error: e.message });
      }
    }
  }

  return new Response(JSON.stringify(results), { status: 200 });
}
