// pages/api/share-reward.js
import crypto from 'crypto';

const WEEK_SECONDS = 7 * 24 * 60 * 60;

function json(res, status, body) {
  res.status(status).json(body);
}

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
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
  return crypto.createHmac('sha256', secret)
               .update(String(payload), 'utf8')
               .digest('hex');
}

async function upstashSetNxEx(url, token, key, value, ttlSec) {
  // Send the whole command in the request body as a JSON array.
  const command = ['SET', key, value, 'EX', String(ttlSec), 'NX'];
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(command),
  });
  if (!resp.ok) {
    const txt = await resp.text().catch(() => '');
    throw new Error(`Upstash SET NX EX failed: ${resp.status} ${txt}`);
  }
  const data = await resp.json().catch(() => ({}));
  return data?.result === 'OK'; // true if set; false if key already existed returns null
}

async function upstashDel(url, token, key) {
  // Send the DEL command in the request body as a JSON array.
  try {
    await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(['DEL', key]),
    });
  } catch {
    // best effort (ignore errors)
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

    // 1. Verify HMAC signature if secret is configured
    if (HMAC_SECRET) {
      if (!sig || typeof sig !== 'string') {
        return json(res, 401, { ok: false, error: 'Missing signature' });
      }
      const expected = hmacHexSha256(userId, HMAC_SECRET);
      const valid = timingSafeEqualHex(expected, sig);
      if (!valid) {
        return json(res, 401, { ok: false, error: 'Invalid signature' });
      }
    } else {
      console.warn('[share-reward] HMAC_SECRET is not set — signature check is disabled!');
    }

    // 2. Check required server config
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

    // 3. Attempt to set Redis key with NX (no overwrite) and EX (expiration in 7 days)
    const reserved = await upstashSetNxEx(
      UPSTASH_REDIS_REST_URL,
      UPSTASH_REDIS_REST_TOKEN,
      claimKey,
      String(nowMs),
      WEEK_SECONDS
    );
    if (!reserved) {
      // Key already exists -> user has claimed within the last 7 days
      return json(res, 429, {
        ok: false,
        code: 'already_claimed',
        message: 'Reward already claimed this week',
      });
    }

    // 4. Grant 7-day Pro entitlement via RevenueCat
    try {
      const entitlement = encodeURIComponent(RC_ENTITLEMENT_ID);
      const rcUrl = `https://api.revenuecat.com/v1/subscribers/${encodeURIComponent(userId)}/entitlements/${entitlement}`;
      const expiresAtMs = nowMs + WEEK_SECONDS * 1000; // 7 days from now in milliseconds

      const rcResp = await fetch(rcUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${RC_SECRET_API_KEY}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          // RevenueCat promotional entitlement with explicit expiration time
          end_time_ms: expiresAtMs,
        }),
      });
      const rcBody = await rcResp.json().catch(() => ({}));

      if (!rcResp.ok) {
        console.error('[share-reward] RC error', rcResp.status, rcBody);
        // Roll back Redis key so user can retry later if granting failed
        await upstashDel(UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN, claimKey);
        return json(res, 500, { ok: false, error: 'Failed to grant entitlement' });
      }

      // 5. Success – return expiration date to client
      return json(res, 200, { ok: true, expiresAt: new Date(expiresAtMs).toISOString() });
    } catch (e) {
      console.error('[share-reward] RC grant threw', e);
      // Roll back Redis lock on exception
      await upstashDel(UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN, claimKey);
      return json(res, 500, { ok: false, error: 'Grant failed' });
    }
  } catch (err) {
    console.error('[share-reward] Unexpected error', err);
    return json(res, 500, { ok: false, error: 'Internal server error' });
  }
}
