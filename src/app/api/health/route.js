// app/api/_health/route.js
import { Redis } from '@upstash/redis';

export const runtime = 'edge';

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

// Reuse a single client across invocations on the edge
const redis = url && token ? new Redis({ url, token }) : null;

function json(body, status = 200, extraHeaders) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store, max-age=0',
      ...(extraHeaders || {})
    }
  });
}

export async function GET() {
  try {
    if (!url || !token || !redis) {
      return json(
        { ok: false, error: 'Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN' },
        500
      );
    }

    // Minimal connectivity check to Upstash Redis (no writes)
    if (typeof redis.ping === 'function') {
      await redis.ping();
    } else {
      // Fallback: harmless read to ensure connectivity
      await redis.get('__healthcheck__');
    }

    return json({ ok: true }, 200);
  } catch (err) {
    const message = (err && err.message) ? err.message : 'Unknown error';
    return json({ ok: false, error: message }, 500);
  }
}

// Optional: allow HEAD for lightweight liveness probes
export async function HEAD() {
  const res = await GET();
  return new Response(null, { status: res.status, headers: res.headers });
}
