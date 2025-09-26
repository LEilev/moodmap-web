// pages/api/share-reward.js
// Node 18+ on Vercel: global fetch is available — no need for node-fetch.
// Grants a 7-day promotional Pro entitlement after sharing (with HMAC verification).

import crypto from 'crypto';

const WEEK_SECONDS = 7 * 24 * 60 * 60;

function json(res, status, body) {
  res.status(status).json(body);
}

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*'); // allow all origins (mobile app, etc.)
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'content-type');
}

function timingSafeEqualHex(aHex, bHex) {
  try {
    const ab = Buffer.from(String(aHex).toLowerCase(), 'hex');
    const bb = Buffer.from(String(bHex).toLowerCase(), 'hex');
    if (ab.length !== bb.length) return false;
    return crypto.timingSafeEqual(ab, bb);
  } catch {
    return false;
  }
}

function hmacHexSha256(payload, secret) {
  return crypto.createHmac('sha256', secret).update(String(payload), 'utf8').digest('hex');
}

async function upstashSetNxEx(url, token, key, value, ttlSec) {
  // POST /set with ["key","value","EX","604800","NX"]
  const resp = await fetch(`${url}/set`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([key, value, 'EX', String(ttlSec), 'NX']),
  });
  if (!resp.ok) {
    const txt = await resp.text().catch(() => '');
    throw new Error(`Upstash SET NX EX failed: ${resp.status} ${txt}`);
  }
  const data = await resp.json().catch(() => ({}));
  return data?.result === 'OK'; // true if set; false if key existed
}

async function upstashDel(url, token, key) {
  // POST /del with ["key"]
  try {
    await fetch(`${url}/del`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([key]),
    });
  } catch {
    // best effort (no throw)
  }
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const {
      HMAC_SECRET,
      RC_SECRET_API_KEY,
      RC_ENTITLEMENT_ID = 'pro',
      UPSTASH_REDIS_REST_URL,
      UPSTASH_REDIS_REST_TOKEN,
    } = process.env;

    const { userId, sig } = req.body || {};
    if (!userId || typeof userId !== 'string') {
      return json(res, 400, { ok: false, error: 'Missing userId' });
    }

    // Debug logging for signature verification
    console.log(`[share-reward] userId=${userId}, sig=${sig}, HMAC_SECRET=${HMAC_SECRET}`);

    // Require HMAC if configured (enforced in production)
    if (HMAC_SECRET) {
      if (!sig || typeof sig !== 'string') {
        console.warn(`[share-reward] Missing signature for user ${userId}`);
        return json(res, 401, { ok: false, error: 'Missing signature' });
      }
      const expected = hmacHexSha256(userId, HMAC_SECRET);
      const ok = timingSafeEqualHex(expected, sig);
      if (!ok) {
        console.warn(`[share-reward] Invalid signature for user ${userId}. Expected ${expected}, got ${sig}`);
        return json(res, 401, { ok: false, error: 'Invalid signature' });
      }
    } else {
      // If you see this in logs in production, fix your env ASAP.
      console.warn('[share-reward] HMAC_SECRET is not set — signature check is disabled!');
    }

    if (!RC_SECRET_API_KEY) {
      console.error('[share-reward] Missing RC_SECRET_API_KEY');
      return json(res, 500, { ok: false, error: 'Server configuration error (RC key)' });
    }
    if (!UPSTASH_REDIS_REST_URL || !UPSTASH_REDIS_REST_TOKEN) {
      console.error('[share-reward] Missing Upstash Redis env');
      return json(res, 500, { ok: false, error: 'Server configuration error (Redis)' });
    }

    const claimKey = `share-reward:${userId}`;
    const nowMs = Date.now();

    // 1) Atomic lock – attempt to set a key with 7-day expiry, only if not already set
    const reserved = await upstashSetNxEx(
      UPSTASH_REDIS_REST_URL,
      UPSTASH_REDIS_REST_TOKEN,
      claimKey,
      String(nowMs),
      WEEK_SECONDS
    );

    if (!reserved) {
      // Already claimed within last 7 days
      console.log('[share-reward] User already claimed share-reward in last 7d:', userId);
      return json(res, 429, { ok: false, code: 'already_claimed', message: 'Reward already claimed this week' });
    }

    // 2) Grant via RevenueCat — set Pro entitlement end time to now + 7d
    try {
      const entitlement = encodeURIComponent(RC_ENTITLEMENT_ID);
      const rcUrl = `https://api.revenuecat.com/v1/subscribers/${encodeURIComponent(userId)}/entitlements/${entitlement}`;
      const expiresAtMs = nowMs + WEEK_SECONDS * 1000;

      const rcResp = await fetch(rcUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${RC_SECRET_API_KEY}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          // RevenueCat Promotional Entitlement – set explicit end time
          end_time_ms: expiresAtMs,
        }),
      });

      const rcBody = await rcResp.json().catch(() => ({}));

      if (!rcResp.ok) {
        console.error('[share-reward] RC error for user', userId, rcResp.status, rcBody);
        // Roll back Redis cooldown so user can retry
        await upstashDel(UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN, claimKey);
        return json(res, 500, { ok: false, error: 'Failed to grant entitlement' });
      }

      // 3) Success – log and return result
      console.log('[share-reward] Grant success for user', userId, 'expiresAt', new Date(expiresAtMs).toISOString());
      return json(res, 200, { ok: true, expiresAt: new Date(expiresAtMs).toISOString() });
    } catch (e) {
      console.error('[share-reward] RC grant threw for user', userId, e);
      // Roll back lock on error
      await upstashDel(UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN, claimKey);
      return json(res, 500, { ok: false, error: 'Grant failed' });
    }
  } catch (err) {
    console.error('[share-reward] Unexpected error for user', req.body?.userId, err);
    return json(res, 500, { ok: false, error: 'Internal server error' });
  }
}
