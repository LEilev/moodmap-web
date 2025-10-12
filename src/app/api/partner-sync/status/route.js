// src/app/api/partner-sync/status/route.js
export const runtime = 'edge';

import { redis } from '@/lib/redis.js';

const CODE_REGEX = /^[A-HJ-NP-Z2-9]{10,12}$/;

/** JSON helper */
function json(body, status = 200, extra = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store, max-age=0',
      ...extra,
    },
  });
}

export async function GET(req) {
  try {
    if (!redis) {
      return json({ ok: false, error: 'Service unavailable (Redis not configured)' }, 503);
    }
    const { searchParams } = new URL(req.url);
    const raw = (searchParams.get('code') || '').trim().toUpperCase();
    if (!CODE_REGEX.test(raw)) {
      return json({ ok: false, error: 'Invalid or missing code' }, 400);
    }

    // If code still present, it's unclaimed → 204 (keep polling)
    const codeKey = `pairCode:${raw}`;
    const stillActive = await redis.get(codeKey);
    if (stillActive) {
      return new Response(null, {
        status: 204,
        headers: { 'cache-control': 'no-store, max-age=0' },
      });
    }

    // After /partner-connect consumes the code, we expose a short-lived reverse mapping
    const pid = await redis.get(`pairIdByCode:${raw}`);
    if (pid) {
      return json({ ok: true, pairId: pid }, 200);
    }

    // Not active and no reverse mapping → expired/invalid
    return json({ ok: false, error: 'Code expired or not found' }, 410);
  } catch (err) {
    console.error('[partner-sync/status][GET] error:', err?.message || err);
    return json({ ok: false, error: 'Internal error' }, 500);
  }
}
