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
  return crypto.createHmac('sha256', secret).update(String(payload), 'utf8').digest('hex');
}

// Upstash REST helpers (send command as JSON array body)
async function upstashSetNxEx(url, token, key, value, ttlSec) {
  const command = ['SET', key, value, 'EX', String(ttlSec), 'NX'];
  const resp = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(command),
  });
  if (!resp.ok) {
    const txt = await resp.text().catch(() => '');
    throw new Error(`Upstash SET NX EX failed: ${resp.status} ${txt}`);
  }
  const data = await resp.json().catch(() => ({}));
  return data?.result === 'OK'; // true if set; false/null if key already exists
}

async function upstashDel(url, token, key) {
  try {
    await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(['DEL', key]),
    });
  } catch {
    // best-effort
  }
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(405).end('Method Not Allowed');
  }

  let currentUserId = undefined;

  try {
    const {
      HMAC_SECRET,
      RC_SECRET_API_KEY,
      RC_ENTITLEMENT_ID = 'pro',
      UPSTASH_REDIS_REST_URL,
      UPSTASH_REDIS_REST_TOKEN,
    } = process.env;

    const { userId, sig } = req.body || {};
    currentUserId = userId;

    // Request arrival log (never prints secrets)
    console.log(
      '[share-reward] Incoming request:',
      `userId=${userId || 'none'}`,
      `sig_provided=${!!sig}`
    );

    if (!userId || typeof userId !== 'string') {
      return json(res, 400, { ok: false, error: 'Missing userId' });
    }

    // 1) HMAC signature verification (if configured)
    if (HMAC_SECRET) {
      if (!sig || typeof sig !== 'string') {
        console.warn('[share-reward] Missing signature for userId', userId);
        return json(res, 401, { ok: false, error: 'Missing signature' });
      }
      const expected = hmacHexSha256(userId, HMAC_SECRET);
      const valid = timingSafeEqualHex(expected, sig);
      if (!valid) {
        console.warn('[share-reward] Invalid signature for userId', userId);
        return json(res, 401, { ok: false, error: 'Invalid signature' });
      }
    } else {
      console.warn('[share-reward] HMAC_SECRET is not set — signature check is disabled!');
    }

    // 2) Required server config
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

    // 3) Weekly rate limit via Redis (SET NX EX 7d)
    const reserved = await upstashSetNxEx(
      UPSTASH_REDIS_REST_URL,
      UPSTASH_REDIS_REST_TOKEN,
      claimKey,
      String(nowMs),
      WEEK_SECONDS
    );
    if (!reserved) {
      console.log('[share-reward] Already claimed within 7 days:', userId);
      return json(res, 429, { ok: false, code: 'already_claimed', message: 'Reward already claimed this week' });
    }

    // 4) Grant 7-day promotional entitlement via RevenueCat
    const expiresAtISO = new Date(nowMs + WEEK_SECONDS * 1000).toISOString();
    const entitlementId = RC_ENTITLEMENT_ID;
    const rcUrl = 'https://api.revenuecat.com/v1/promotional_entitlements';
    const rcPayload = {
      entitlement_id: entitlementId,
      app_user_id: userId,
      expires_at: expiresAtISO,
    };

    console.log('[share-reward] RC request', { url: rcUrl, entitlement_id: entitlementId, expiresAt: expiresAtISO });

    let rcResp, rcBody;
    try {
      rcResp = await fetch(rcUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${RC_SECRET_API_KEY}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(rcPayload),
      });
      rcBody = await rcResp.json().catch(() => ({}));
    } catch (e) {
      console.error('[share-reward] RC network error for userId', userId, e);
      // Roll back Redis reservation so user can retry
      await upstashDel(UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN, claimKey);
      return json(res, 500, { ok: false, error: 'RevenueCat network error' });
    }

    if (!rcResp.ok) {
      console.error('[share-reward] RC error for userId', userId, rcResp.status, rcBody);
      // Roll back Redis reservation so user can retry later
      await upstashDel(UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN, claimKey);
      return json(res, 500, { ok: false, error: 'Failed to grant entitlement' });
    }

    console.log('[share-reward] Pro granted to userId', userId, 'expiresAt', expiresAtISO);

    // 5) Success
    return json(res, 200, { ok: true, expiresAt: expiresAtISO });

  } catch (err) {
    console.error('[share-reward] Unexpected error for userId', typeof currentUserId !== 'undefined' ? currentUserId : 'unknown', err);
    return json(res, 500, { ok: false, error: 'Internal server error' });
  }
}
