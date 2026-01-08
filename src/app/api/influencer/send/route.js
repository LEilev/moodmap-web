export const runtime = 'edge';

import { redis } from '@/lib/redis';
import { INF_QUEUE, INF_UNSUB, infKey, nowISO } from '@/lib/inf-keys';
import { initialTemplate, followupTemplate } from '@/lib/email-templates';

const RESEND_API = 'https://api.resend.com/emails';

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function sendEmail({ to, subject, html, listUnsub, from, apiKey }) {
  const res = await fetch(RESEND_API, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to,
      subject,
      html,
      headers: { 'List-Unsubscribe': listUnsub },
    }),
  });

  if (!res.ok) {
    // Surface status explicitly (we need 429 handling)
    throw new Error(`Resend ${res.status}`);
  }

  return await res.json();
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');
  if (token !== process.env.CRON_TOKEN) return new Response('Forbidden', { status: 403 });

  // Batch + safety cap
  const requestedBatch = parseInt(searchParams.get('batch') || '10', 10);
  const batch = Number.isFinite(requestedBatch) ? Math.max(0, Math.min(requestedBatch, 250)) : 10;

  const doFollowups = searchParams.get('followups') === '1';

  const baseUrl = process.env.BASE_URL;
  const from = process.env.EMAIL_FROM;
  const apiKey = process.env.RESEND_API_KEY;

  // Throttle controls
  const DELAY_MS = Number(process.env.DELAY_MS || 15000); // 15s default
  const BACKOFF_429_MS = Number(process.env.BACKOFF_429_MS || 45000); // 45s default

  const results = { sent: [], followups: 0, skipped: [], errors: [] };

  if (!baseUrl || !from || !apiKey) {
    return new Response(
      JSON.stringify({ error: 'missing_env', need: ['BASE_URL', 'EMAIL_FROM', 'RESEND_API_KEY'] }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (!doFollowups) {
    for (let i = 0; i < batch; i++) {
      const email = await redis.lpop(INF_QUEUE);
      if (!email) break;

      const isUnsub = await redis.sismember(INF_UNSUB, email);
      if (isUnsub) {
        results.skipped.push({ email, reason: 'unsubscribed' });
        continue;
      }

      const key = infKey(email);
      const inf = await redis.hgetall(key);
      if (inf?.status === 'unsubscribed') {
        results.skipped.push({ email, reason: 'unsubscribed' });
        continue;
      }

      const { subject, html, listUnsub } = initialTemplate({
        baseUrl,
        email,
        name: inf?.name,
        handle: inf?.handle,
      });

      try {
        await sendEmail({ to: email, subject, html, listUnsub, from, apiKey });
        await redis.hset(key, {
          status: 'sent',
          lastSent: nowISO(),
          followupsSent: inf?.followupsSent || 0,
        });
        results.sent.push(email);

        // Throttle between sends
        if (i < batch - 1) await sleep(DELAY_MS);
      } catch (e) {
        const msg = String(e?.message ?? e);
        results.errors.push({ email, error: msg });

        // Put back for retry
        await redis.rpush(INF_QUEUE, email);

        // If rate limited, back off harder
        if (msg.includes('Resend 429')) {
          await sleep(BACKOFF_429_MS);
        } else {
          // Small delay to avoid hot-looping on other failures
          await sleep(Math.min(5000, DELAY_MS));
        }
      }
    }
  } else {
    // Follow-ups: still OK for small volumes; keep but note this uses KEYS
    const keys = await redis.keys('inf:*');
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

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
        baseUrl,
        email,
        name: inf?.name,
        handle: inf?.handle,
      });

      try {
        await sendEmail({ to: email, subject, html, listUnsub, from, apiKey });
        await redis.hset(key, { lastSent: nowISO(), followupsSent: 1 });
        results.followups++;
        count++;

        if (count >= batch) break;
        await sleep(DELAY_MS);
      } catch (e) {
        const msg = String(e?.message ?? e);
        results.errors.push({ email, error: msg });
        if (msg.includes('Resend 429')) await sleep(BACKOFF_429_MS);
        else await sleep(Math.min(5000, DELAY_MS));
      }
    }
  }

  return new Response(JSON.stringify(results), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
