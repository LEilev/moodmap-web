/**
 * src/lib/ratelimit.js
 *
 * Purpose:
 *   Lightweight, Edge-safe rate limiting and lock primitives built on the unified Redis helper.
 *
 * Usage:
 *   import { tryAcquire, release, limitByKey, limitByIP } from '@/lib/ratelimit.js';
 */

import { setNX, redis } from './redis.js';

/**
 * tryAcquire - Attempts to acquire a lock for ttlSec seconds.
 * @param {string} key
 * @param {number} ttlSec
 * @returns {Promise<boolean>} true if acquired (first caller), false if already locked or on error.
 */
export async function tryAcquire(key, ttlSec) {
  try {
    return await setNX(key, '1', ttlSec);
  } catch (err) {
    console.error('[ratelimit.tryAcquire] error:', err?.message || err);
    return false;
  }
}

/**
 * release - Best-effort lock release (delete key).
 * @param {string} key
 * @returns {Promise<boolean>} true on success, false on error.
 */
export async function release(key) {
  try {
    if (!redis) throw new Error('Upstash Redis not configured');
    const n = await redis.del(key);
    return n === 1;
  } catch (err) {
    console.error('[ratelimit.release] error:', err?.message || err);
    return false;
  }
}

/**
 * limitByKey - Generic counter-based rate limiter.
 * Creates a rolling window based on the current timestamp and limits calls per key.
 *
 * @param {string} key - Unique key for the resource (e.g. rl:ip:1.2.3.4)
 * @param {number} limit - Max allowed calls per window.
 * @param {number} windowSec - Length of window in seconds.
 * @returns {Promise<{allowed: boolean, retryAfter: number}>}
 */
export async function limitByKey(key, limit = 30, windowSec = 60) {
  try {
    if (!redis) return { allowed: true, retryAfter: 0 };
    const windowId = Math.floor(Date.now() / (windowSec * 1000));
    const k = `${key}:${windowId}`;
    const count = await redis.incr(k);

    // first hit → start TTL
    if (count === 1) await redis.expire(k, windowSec);

    if (count > limit) {
      const ttl = await redis.ttl(k);
      return { allowed: false, retryAfter: Math.max(1, ttl ?? windowSec) };
    }

    return { allowed: true, retryAfter: 0 };
  } catch (err) {
    console.error('[ratelimit.limitByKey] error:', err?.message || err);
    return { allowed: true, retryAfter: 0 };
  }
}

/**
 * limitByIP - IP-specific rate limiter (uses limitByKey internally).
 *
 * @param {string} ip
 * @param {number} limit - Max requests per window.
 * @param {number} windowSec - Window length in seconds.
 * @returns {Promise<{allowed: boolean, retryAfter: number}>}
 */
export async function limitByIP(ip, limit = 30, windowSec = 60) {
  try {
    const key = `rl:ip:${ip}`;
    return await limitByKey(key, limit, windowSec);
  } catch (err) {
    console.error('[ratelimit.limitByIP] error:', err?.message || err);
    return { allowed: true, retryAfter: 0 };
  }
}

/**
 * Convenience wrapper for direct inline use:
 * Example:
 *   const { allowed, retryAfter } = await limitByKey('rl:test', 5, 60);
 *   if (!allowed) return new Response('Rate limit', { status: 429 });
 */

