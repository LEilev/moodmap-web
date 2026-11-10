import { redis } from '@/lib/redis';
import { readLimitedText } from '@/lib/influencer-crypto';
import {
  applyInfluencerEvent,
  importResendWebhookKey,
  parseInfluencerEvent,
  verifyResendWebhook,
} from '@/lib/influencer-webhook';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

function reply(body, status = 200) {
  return new Response(body, {
    status,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

export async function POST(req) {
  let key;
  try {
    // Copy this signing secret from the Resend webhook dashboard. A shared
    // query-string token cannot authenticate the payload and is never a fallback.
    key = await importResendWebhookKey((process.env.RESEND_WEBHOOK_SECRET || '').trim());
  } catch {
    return reply('Service temporarily unavailable', 503);
  }
  if (!redis) return reply('Service temporarily unavailable', 503);

  let id;
  let event;
  try {
    const body = await readLimitedText(req, 128 * 1024);
    id = await verifyResendWebhook({ key, headers: req.headers, body });
    event = parseInfluencerEvent(JSON.parse(body));
  } catch (error) {
    return reply('Invalid webhook', error?.status || 400);
  }
  if (!event) return reply('Ignored');

  try {
    await applyInfluencerEvent(redis, { id, ...event });
    return reply('OK');
  } catch {
    // Non-2xx lets the provider retry; failed business work is never acknowledged.
    return reply('Service temporarily unavailable', 503);
  }
}
