// pages/api/share-reward.js
// Drop-in backend for “share to unlock 7 days Pro”
// - HMAC verification (userId + sig)
// - 7d rate-limit via Upstash Redis
// - RevenueCat: POST /v1/subscribers/{id}/entitlements/{entitlement}/promotional
//   Primary body uses end_time_ms; fallback to duration: "seven_days" if needed
// - Structured logging + safe rollback

import crypto from 'crypto';

const WEEK_SECONDS = 7 * 24 * 60 * 60;

function withCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'content-type');
}
function send(res, status, body) {
  res.status(status).json(body);
}
function hmacHexSha256(payload, secret) {
  return crypto.createHmac('sha256', secret).update(String(payload), 'utf8').digest('hex');
}
function timingSafeEqualHex(aHex, bHex) {
  try {
    const a = Buffer.from(String(aHex), 'hex');
    const b = Buffer.from(String(bHex), 'hex');
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

// ---------- Upstash helpers ----------
async function upstashCmd(url, token, command) {
  const r = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(command),
  });
  if (!r.ok) throw new Error(`Upstash error ${r.status}: ${await r.text().catch(()=>'')}`);
  return r.json().catch(() => ({}));
}
async function reserveWeeklyClaim(url, token, key, ttlSec) {
  // SET key value EX ttl NX -> result === 'OK' if reserved, null if already exists
  const data = await upstashCmd(url, token, ['SET', key, String(Date.now()), 'EX', String(ttlSec), 'NX']);
  return data?.result === 'OK';
}
async function releaseReserve(url, token, key) {
  try { await upstashCmd(url, token, ['DEL', key]); } catch {}
}

// ---------- RevenueCat helpers ----------
async function rcPostJson(url, apiKey, body) {
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
  });
  let json;
  try { json = await resp.json(); } catch { json = {}; }
  return { ok: resp.ok, status: resp.status, body: json };
}

export default async function handler(req, res) {
  withCors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(405).end('Method Not Allowed');
  }

  const reqId = Math.random().toString(36).slice(2, 9);

  try {
    const {
      HMAC_SECRET,
      RC_SECRET_API_KEY,
      RC_ENTITLEMENT_ID = 'pro',
      UPSTASH_REDIS_REST_URL,
      UPSTASH_REDIS_REST_TOKEN,
    } = process.env;

    const { userId, sig } = req.body || {};

    console.log(
      `[share-reward]#${reqId} Incoming request: userId=${userId || 'null'} sig_present=${!!sig}`
    );

    // Validate input
    if (!userId || typeof userId !== 'string') {
      return send(res, 400, { ok: false, code: 'bad_request', error: 'Missing userId' });
    }
    if (!HMAC_SECRET) {
      console.warn(`[share-reward]#${reqId} HMAC_SECRET missing – signature check disabled`);
    } else {
      if (!sig || typeof sig !== 'string') {
        console.warn(`[share-reward]#${reqId} Missing signature`);
        return send(res, 401, { ok: false, code: 'missing_sig', error: 'Missing signature' });
      }
      const expected = hmacHexSha256(userId, HMAC_SECRET);
      if (!timingSafeEqualHex(expected, sig)) {
        console.warn(`[share-reward]#${reqId} Invalid signature`);
        return send(res, 401, { ok: false, code: 'bad_sig', error: 'Invalid signature' });
      }
    }
    if (!RC_SECRET_API_KEY) {
      console.error(`[share-reward]#${reqId} Missing RC_SECRET_API_KEY`);
      return send(res, 500, { ok: false, code: 'server_config', error: 'Missing RC key' });
    }
    if (!UPSTASH_REDIS_REST_URL || !UPSTASH_REDIS_REST_TOKEN) {
      console.error(`[share-reward]#${reqId} Missing Upstash env`);
      return send(res, 500, { ok: false, code: 'server_config', error: 'Missing Redis config' });
    }

    // Weekly rate-limit
    const claimKey = `share-reward:${userId}`;
    const reserved = await reserveWeeklyClaim(
      UPSTASH_REDIS_REST_URL,
      UPSTASH_REDIS_REST_TOKEN,
      claimKey,
      WEEK_SECONDS,
    );
    if (!reserved) {
      console.log(`[share-reward]#${reqId} Already claimed last 7d: ${userId}`);
      return send(res, 429, { ok: false, code: 'already_claimed', message: 'Reward already claimed this week' });
    }

    // Compute expiry (7d)
    const nowMs = Date.now();
    const expiresMs = nowMs + WEEK_SECONDS * 1000;
    const expiresAtISO = new Date(expiresMs).toISOString();

    // RC v1: POST /v1/subscribers/{app_user_id}/entitlements/{entitlement_id}/promotional
    const encodedUserId = encodeURIComponent(userId);
    const encodedEnt = encodeURIComponent(RC_ENTITLEMENT_ID);
    const rcUrl = `https://api.revenuecat.com/v1/subscribers/${encodedUserId}/entitlements/${encodedEnt}/promotional`;

    // Primary body: end_time_ms (recommended by RC)
    const bodyEndTime = { end_time_ms: expiresMs };
    console.log(`[share-reward]#${reqId} RC request`, {
      url: rcUrl,
      variant: 'end_time_ms',
      entitlement: RC_ENTITLEMENT_ID,
      expiresAt: expiresAtISO,
    });

    let rcResp = await rcPostJson(rcUrl, RC_SECRET_API_KEY, bodyEndTime);

    if (!rcResp.ok) {
      // If parameter error or endpoint rejects end_time_ms, try duration as fallback
      const code = rcResp?.body?.code || rcResp?.status;
      const msg = rcResp?.body?.message || '';
      console.warn(`[share-reward]#${reqId} RC end_time_ms failed: ${rcResp.status} ${code} ${msg}`);

      // 401/403/404 → permanent error (bad key/route/permission)
      if (rcResp.status === 401 || rcResp.status === 403 || rcResp.status === 404) {
        await releaseReserve(UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN, claimKey);
        return send(res, 500, { ok: false, code: 'rc_auth_or_route', error: 'RevenueCat auth/route not allowed' });
      }

      // Try fallback with duration
      const bodyDuration = { duration: 'seven_days' };
      console.log(`[share-reward]#${reqId} RC retry with duration`, {
        url: rcUrl,
        variant: 'duration',
        entitlement: RC_ENTITLEMENT_ID,
      });
      const rcResp2 = await rcPostJson(rcUrl, RC_SECRET_API_KEY, bodyDuration);

      if (!rcResp2.ok) {
        console.error(
          `[share-reward]#${reqId} RC failed (both variants)`,
          { end_time_ms: { status: rcResp.status, body: rcResp.body }, duration: { status: rcResp2.status, body: rcResp2.body } }
        );
        await releaseReserve(UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN, claimKey);
        return send(res, 500, { ok: false, code: 'rc_failed', error: 'Failed to grant entitlement' });
      }

      // success on duration fallback
      console.log(`[share-reward]#${reqId} Pro granted via RC (duration fallback) → ${expiresAtISO}`);
      return send(res, 200, { ok: true, expiresAt: expiresAtISO });
    }

    // success on primary end_time_ms
    console.log(`[share-reward]#${reqId} Pro granted via RC (end_time_ms) → ${expiresAtISO}`);
    return send(res, 200, { ok: true, expiresAt: expiresAtISO });

  } catch (err) {
    console.error('[share-reward] Unexpected error', err);
    return send(res, 500, { ok: false, code: 'server_error', error: 'Internal server error' });
  }
}
