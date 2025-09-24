// pages/api/share-reward.js (Node/Next.js API Route)
import fetch from 'node-fetch';  // (If node-fetch is not available globally, install or ensure Node 18+ for global fetch)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { userId } = req.body || {};  // expecting JSON body with { userId }
  if (!userId) {
    return res.status(400).json({ ok: false, error: 'Missing userId' });
  }

  // Environment keys
  const RC_SECRET_KEY = process.env.RC_SECRET_KEY;
  const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
  const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!RC_SECRET_KEY) {
    console.error('[share-reward] Missing RC_SECRET_KEY');
    return res.status(500).json({ ok: false, error: 'Server configuration error' });
  }

  try {
    // **1. Rate-limit check** – Has this user claimed in the last 7 days?
    if (UPSTASH_URL && UPSTASH_TOKEN) {
      const key = `share:${userId}`;
      const checkRes = await fetch(`${UPSTASH_URL}/get/${encodeURIComponent(key)}`, {
        headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
        cache: 'no-store'
      });
      if (checkRes.ok) {
        const data = await checkRes.json().catch(() => ({}));
        if (data && data.result) {
          // Key exists => already claimed recently
          console.info(`[share-reward] User ${userId} already claimed a share reward – blocking repeat.`);
          return res.status(200).json({ ok: false, code: 'already_claimed', message: 'Reward already claimed this week' });
        }
      }
      // (If Redis is not configured or checkRes not ok, we proceed without a stored flag – allows reward.)
    }

    // **2. Call RevenueCat API** to grant 7-day "pro" entitlement
    const rcUrl = `https://api.revenuecat.com/v1/subscribers/${encodeURIComponent(userId)}/entitlements/pro/promotional`;
    const rcRes = await fetch(rcUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RC_SECRET_KEY}`,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({ duration: '7d' })
    });
    const rcBody = await rcRes.json().catch(() => ({}));  // parse response if possible
    if (rcRes.ok) {
      console.info(`[share-reward] Granted 7 days Pro via share to user: ${userId}`);
      // Record the claim in Redis with 7-day TTL
      if (UPSTASH_URL && UPSTASH_TOKEN) {
        const key = `share:${userId}`;
        const value = '1';  // could also store timestamp or user info
        // Set key with expiry of 604800 seconds (7 days)
        await fetch(`${UPSTASH_URL}/setex`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${UPSTASH_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify([key, value, 604800])
        });
      }
      // Determine expiration date (7 days from now). We use this for client feedback.
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      return res.status(200).json({ ok: true, expiresAt });
    } else {
      console.error('[share-reward] RevenueCat API error', rcRes.status, rcBody);
      return res.status(500).json({ ok: false, error: 'Failed to grant entitlement', status: rcRes.status });
    }
  } catch (err) {
    console.error('[share-reward] Unexpected error', err);
    return res.status(500).json({ ok: false, error: 'Internal server error', message: String(err) });
  }
}
