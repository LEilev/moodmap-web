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

// ---------- Upstash (rate limit 7d) ----------
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
  return data?.result === 'OK'; // true if reserved; null/false if key exists
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

// ---------- RevenueCat helpers ----------
async function rcJson(url, method, apiKey, bodyObj) {
  const resp = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: bodyObj ? JSON.stringify(bodyObj) : undefined,
  });
  let body;
  try { body = await resp.json(); } catch { body = {}; }
  return { ok: resp.ok, status: resp.status, body };
}

function isPromoEndpointUnavailable({ status, body }) {
  // Common signals when endpoint is not available for the account/plan or route not recognized
  if (status === 404) return true; // "Page not found" (code 7117)
  if (status === 403) return true; // plan/permission block
  if (Number(body?.code) === 7117) return true; // RC "Page not found"
  return false;
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

    console.log(
      '[share-reward] Incoming request:',
      `userId=${userId || 'none'}`,
      `sig_provided=${!!sig}`
    );

    if (!userId || typeof userId !== 'string') {
      return json(res, 400, { ok: false, error: 'Missing userId' });
    }

    // 1) Verify HMAC
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

    // 2) Server config
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

    // 3) Weekly rate-limit
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

    // 4) Try Promotional Entitlements (primary)
    const expiresAtISO = new Date(nowMs + WEEK_SECONDS * 1000).toISOString();
    const promoUrl = 'https://api.revenuecat.com/v1/promotional_entitlements';
    const promoPayload = {
      entitlement_id: RC_ENTITLEMENT_ID, // per your setup (e.g. "pro")
      app_user_id: userId,
      expires_at: expiresAtISO,
    };

    console.log('[share-reward] RC request', { url: promoUrl, entitlement_id: RC_ENTITLEMENT_ID, expiresAt: expiresAtISO });
    let promoResp;
    try {
      promoResp = await rcJson(promoUrl, 'POST', RC_SECRET_API_KEY, promoPayload);
    } catch (e) {
      console.error('[share-reward] RC promo network error for userId', userId, e);
      await upstashDel(UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN, claimKey);
      return json(res, 500, { ok: false, error: 'RevenueCat network error (promo)' });
    }

    if (promoResp.ok) {
      console.log('[share-reward] Pro granted via promo endpoint to userId', userId, 'expiresAt', expiresAtISO);
      return json(res, 200, { ok: true, expiresAt: expiresAtISO });
    }

    // 5) Fallback path if promo endpoint unavailable (404/403/7117)
    if (isPromoEndpointUnavailable(promoResp)) {
      console.warn('[share-reward] Promo endpoint unavailable, falling back to subscriber entitlements path…');

      // 5a) Ensure subscriber exists by posting an attribute (safe no-op if exists)
      const attrUrl = `https://api.revenuecat.com/v1/subscribers/${encodeURIComponent(userId)}/attributes`;
      const attrPayload = {
        attributes: {
          share_reward: {
            value: 'true',
            updated_at_ms: nowMs,
          },
        },
      };
      let attrResp;
      try {
        attrResp = await rcJson(attrUrl, 'POST', RC_SECRET_API_KEY, attrPayload);
      } catch (e) {
        console.warn('[share-reward] RC attributes network error (will still attempt entitlement)', e?.message || e);
      }
      console.log('[share-reward] RC ensure-subscriber (attributes) status', attrResp?.status ?? 'n/a');

      // 5b) Try: POST /v1/subscribers/{id}/entitlements/{entitlement}
      const entUrlA = `https://api.revenuecat.com/v1/subscribers/${encodeURIComponent(userId)}/entitlements/${encodeURIComponent(RC_ENTITLEMENT_ID)}`;
      const entBodyA = { expires_at: expiresAtISO };

      console.log('[share-reward] RC fallback A request', { url: entUrlA, expiresAt: expiresAtISO });
      let entRespA;
      try {
        entRespA = await rcJson(entUrlA, 'POST', RC_SECRET_API_KEY, entBodyA);
      } catch (e) {
        console.error('[share-reward] RC fallback A network error for userId', userId, e);
      }

      if (entRespA?.ok) {
        console.log('[share-reward] Pro granted via fallback A to userId', userId, 'expiresAt', expiresAtISO);
        return json(res, 200, { ok: true, expiresAt: expiresAtISO });
      }

      // 5c) Extra fallback: POST /v1/subscribers/{id}/entitlements (body with identifier)
      const entUrlB = `https://api.revenuecat.com/v1/subscribers/${encodeURIComponent(userId)}/entitlements`;
      const entBodyB = { entitlement_id: RC_ENTITLEMENT_ID, expires_at: expiresAtISO };

      console.log('[share-reward] RC fallback B request', { url: entUrlB, entitlement_id: RC_ENTITLEMENT_ID, expiresAt: expiresAtISO });
      let entRespB;
      try {
        entRespB = await rcJson(entUrlB, 'POST', RC_SECRET_API_KEY, entBodyB);
      } catch (e) {
        console.error('[share-reward] RC fallback B network error for userId', userId, e);
      }

      if (entRespB?.ok) {
        console.log('[share-reward] Pro granted via fallback B to userId', userId, 'expiresAt', expiresAtISO);
        return json(res, 200, { ok: true, expiresAt: expiresAtISO });
      }

      // Fallbacks failed → roll back Redis and bubble up
      console.error('[share-reward] RC fallback failed for userId', userId, {
        promo: { status: promoResp.status, code: promoResp?.body?.code, message: promoResp?.body?.message },
        entA: { status: entRespA?.status, code: entRespA?.body?.code, message: entRespA?.body?.message },
        entB: { status: entRespB?.status, code: entRespB?.body?.code, message: entRespB?.body?.message },
      });
      await upstashDel(UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN, claimKey);
      return json(res, 500, { ok: false, error: 'Failed to grant entitlement (RC fallbacks exhausted)' });
    }

    // Promo endpoint returned some other error (e.g. 400 with validation) → rollback and bubble up
    console.error('[share-reward] RC promo error for userId', userId, promoResp.status, promoResp.body);
    await upstashDel(UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN, claimKey);
    return json(res, 500, { ok: false, error: 'Failed to grant entitlement (promo)' });

  } catch (err) {
    console.error('[share-reward] Unexpected error for userId', typeof currentUserId !== 'undefined' ? currentUserId : 'unknown', err);
    return json(res, 500, { ok: false, error: 'Internal server error' });
  }
}
