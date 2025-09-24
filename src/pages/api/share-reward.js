// pages/api/share-reward.js
import fetch from 'node-fetch';  // (If using Node 18+, the global fetch is available and this import can be removed)

// This API route grants a 7-day "pro" entitlement to a user who shared, if eligible.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const { userId } = req.body || {};
  if (!userId) {
    return res.status(400).json({ ok: false, error: 'userId is required' });
  }

  // Load environment variables for RevenueCat and Upstash
  const RC_SECRET_KEY = process.env.RC_SECRET_API_KEY || process.env.RC_API_KEY;
  const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
  const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!RC_SECRET_KEY) {
    console.error('[share-reward] Missing RevenueCat secret API key');
    return res.status(500).json({ ok: false, error: 'Server configuration error' });
  }

  // Redis rate-limit check (1 reward per user per week)
  const redisKey = `share-reward:${userId}`;
  if (UPSTASH_URL && UPSTASH_TOKEN) {
    try {
      const url = `${UPSTASH_URL}/get/${encodeURIComponent(redisKey)}`;
      const redisRes = await fetch(url, {
        headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
        cache: 'no-store',
      });
      if (redisRes.ok) {
        const data = await redisRes.json().catch(() => null);
        if (data?.result) {
          // Key exists means user already claimed within TTL
          return res.status(429).json({ ok: false, error: 'Already claimed in the last 7 days' });
        }
      }
      // (If Redis returns nothing or key missing, proceed)
    } catch (err) {
      console.warn('[share-reward] Redis check failed:', err);
      // If Redis fails, we choose to proceed rather than block, to not penalize user.
    }
  }

  // Prepare RevenueCat API call to grant entitlement
  const entitlement = 'pro';
  const now = Date.now();
  const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;
  const expiresAtMs = now + ONE_WEEK_MS;
  const rcUrl = `https://api.revenuecat.com/v1/subscribers/${encodeURIComponent(userId)}/entitlements/${entitlement}`;
  const body = {
    // Grant promotional entitlement until a specific time
    end_time_ms: expiresAtMs
    // (We could also use "duration": {"unit": "day", "value": 7}, but end_time_ms is more direct.)
  };

  try {
    const rcResponse = await fetch(`${rcUrl}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RC_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const rcData = await rcResponse.json().catch(() => null);

    if (rcResponse.status >= 200 && rcResponse.status < 300) {
      // Successfully granted in RevenueCat
      console.info('[share-reward] Granted 7-day Pro to user:', userId);
      // Set Redis key to prevent another claim for 7 days
      if (UPSTASH_URL && UPSTASH_TOKEN) {
        const setUrl = `${UPSTASH_URL}/setex`;
        const ttlSeconds = 7 * 24 * 60 * 60;  // 7 days in seconds
        const value = '1';
        try {
          await fetch(setUrl, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${UPSTASH_TOKEN}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify([redisKey, value, ttlSeconds]),
          });
        } catch (err) {
          console.error('[share-reward] Failed to set Redis TTL key:', err);
          // Not critical if this fails; just logs.
        }
      }
      // Respond with success and the expiration timestamp (ISO string for convenience)
      return res.status(200).json({ ok: true, expiresAt: new Date(expiresAtMs).toISOString() });
    } else {
      // RevenueCat API returned an error (e.g., invalid user or other issue)
      console.error('[share-reward] RevenueCat API error:', rcResponse.status, rcData);
      const errorMsg = rcData?.message || rcData?.error || 'Failed to grant entitlement';
      return res.status(500).json({ ok: false, error: errorMsg });
    }
  } catch (err) {
    console.error('[share-reward] Request failed:', err);
    return res.status(500).json({ ok: false, error: 'Internal server error' });
  }
}
