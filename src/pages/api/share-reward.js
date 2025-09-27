// pages/api/share-reward.js
// Share → unlock 7d Pro in RevenueCat
// v2.3 — ensures subscriber exists before granting, robust fallbacks + logging

import crypto from 'crypto';

const WEEK_SECONDS = 7 * 24 * 60 * 60;

// ───────────────────────────────────────────────────────────────────────────────
// Helpers
// ───────────────────────────────────────────────────────────────────────────────
function cors(res) {
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
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Upstash
async function upstash(url, token, command) {
  const r = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(command),
  });
  if (!r.ok) throw new Error(`Upstash ${r.status} ${await r.text().catch(()=>'')}`);
  return r.json().catch(() => ({}));
}
async function reserveWeekly(url, token, key, ttlSec) {
  const data = await upstash(url, token, ['SET', key, String(Date.now()), 'EX', String(ttlSec), 'NX']);
  return data?.result === 'OK';
}
async function releaseReserve(url, token, key) {
  try { await upstash(url, token, ['DEL', key]); } catch {}
}

// RevenueCat helpers
async function rcRequest(url, method, apiKey, body) {
  const resp = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  let json;
  try { json = await resp.json(); } catch { json = {}; }
  return { ok: resp.ok, status: resp.status, body: json };
}

// Ensure subscriber exists (GET will create if missing)
async function ensureSubscriberExists(userId, apiKey, reqId) {
  const url = `https://api.revenuecat.com/v1/subscribers/${encodeURIComponent(userId)}`;
  const r = await rcRequest(url, 'GET', apiKey, null);
  console.log(`[share-reward]#${reqId} ensure-subscriber GET status=${r.status}`);
  return r.ok;
}

// Grant promo — primary with duration, fallback to end_time_ms, with retry on 404/7259
async function grantPromo(userId, entitlement, expiresMs, apiKey, reqId) {
  const base = `https://api.revenuecat.com/v1/subscribers/${encodeURIComponent(userId)}/entitlements/${encodeURIComponent(entitlement)}/promotional`;

  // Variant A: duration (widely supported)
  const bodyA = { duration: 'seven_days' };
  console.log(`[share-reward]#${reqId} RC grant (A:duration)`, { url: base, entitlement, duration: bodyA.duration });
  let r = await rcRequest(base, 'POST', apiKey, bodyA);
  if (r.ok) return { ok: true, variant: 'duration' };

  const code = r?.body?.code || r.status;
  const msg = r?.body?.message || '';
  console.warn(`[share-reward]#${reqId} RC grant (A) failed: ${r.status} ${code} ${msg}`);

  // If 404 subscriber not found (7259), try a short backoff + retry A once
  if (r.status === 404 && String(code).includes('7259')) {
    await sleep(350);
    console.log(`[share-reward]#${reqId} retry RC grant (A:duration) after ensure + backoff`);
    r = await rcRequest(base, 'POST', apiKey, bodyA);
    if (r.ok) return { ok: true, variant: 'duration_retry' };
    console.warn(`[share-reward]#${reqId} RC grant (A retry) failed: ${r.status} ${r?.body?.code} ${r?.body?.message}`);
  }

  // Variant B: end_time_ms (custom end date)
  const bodyB = { end_time_ms: expiresMs };
  console.log(`[share-reward]#${reqId} RC grant (B:end_time_ms)`, { url: base, entitlement, end_time_ms: bodyB.end_time_ms });
  r = await rcRequest(base, 'POST', apiKey, bodyB);
  if (r.ok) return { ok: true, variant: 'end_time_ms' };

  // If 404 again, one last retry after a tiny wait
  if (r.status === 404) {
    await sleep(350);
    console.log(`[share-reward]#${reqId} retry RC grant (B:end_time_ms)`);
    const r2 = await rcRequest(base, 'POST', apiKey, bodyB);
    if (r2.ok) return { ok: true, variant: 'end_time_ms_retry' };
    return { ok: false, last: r2 };
  }

  return { ok: false, last: r };
}

// ───────────────────────────────────────────────────────────────────────────────
// Handler
// ───────────────────────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  cors(res);
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
    console.log(`[share-reward]#${reqId} Incoming: userId=${userId || 'null'} sig_present=${!!sig}`);

    // Basic validation + signature
    if (!userId || typeof userId !== 'string') {
      return send(res, 400, { ok: false, code: 'bad_request', error: 'Missing userId' });
    }
    if (HMAC_SECRET) {
      if (!sig || typeof sig !== 'string') {
        return send(res, 401, { ok: false, code: 'missing_sig', error: 'Missing signature' });
      }
      const expected = hmacHexSha256(userId, HMAC_SECRET);
      if (!timingSafeEqualHex(expected, sig)) {
        return send(res, 401, { ok: false, code: 'bad_sig', error: 'Invalid signature' });
      }
    } else {
      console.warn(`[share-reward]#${reqId} HMAC_SECRET not set — signature check disabled`);
    }
    if (!RC_SECRET_API_KEY) {
      console.error(`[share-reward]#${reqId} Missing RC_SECRET_API_KEY`);
      return send(res, 500, { ok: false, code: 'server_config', error: 'Missing RC key' });
    }
    if (!UPSTASH_REDIS_REST_URL || !UPSTASH_REDIS_REST_TOKEN) {
      console.error(`[share-reward]#${reqId} Missing Upstash Redis env`);
      return send(res, 500, { ok: false, code: 'server_config', error: 'Missing Redis config' });
    }

    // Weekly rate-limit
    const claimKey = `share-reward:${userId}`;
    const reserved = await reserveWeekly(UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN, claimKey, WEEK_SECONDS);
    if (!reserved) {
      console.log(`[share-reward]#${reqId} Already claimed within 7d`);
      return send(res, 429, { ok: false, code: 'already_claimed', message: 'Reward already claimed this week' });
    }

    // 1) Ensure subscriber exists (GET will create if missing)
    const ensured = await ensureSubscriberExists(userId, RC_SECRET_API_KEY, reqId);
    if (!ensured) {
      console.error(`[share-reward]#${reqId} ensure-subscriber failed`);
      await releaseReserve(UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN, claimKey);
      return send(res, 500, { ok: false, code: 'rc_get_failed', error: 'Failed to ensure subscriber' });
    }

    // 2) Grant promo (duration first, then end_time_ms)
    const nowMs = Date.now();
    const expiresMs = nowMs + WEEK_SECONDS * 1000;
    const expiresAtISO = new Date(expiresMs).toISOString();

    const result = await grantPromo(userId, RC_ENTITLEMENT_ID, expiresMs, RC_SECRET_API_KEY, reqId);

    if (!result.ok) {
      const last = result.last || {};
      console.error(`[share-reward]#${reqId} RC grant failed`, {
        status: last.status,
        code: last?.body?.code,
        message: last?.body?.message,
      });
      await releaseReserve(UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN, claimKey);
      return send(res, 500, { ok: false, code: 'rc_failed', error: 'Failed to grant entitlement' });
    }

    console.log(
      `[share-reward]#${reqId} Pro granted (variant=${result.variant}) → ${expiresAtISO}`
    );
    return send(res, 200, { ok: true, expiresAt: expiresAtISO });
  } catch (err) {
    console.error(`[share-reward]#${reqId} Unexpected error`, err);
    return send(res, 500, { ok: false, code: 'server_error', error: 'Internal server error' });
  }
}
