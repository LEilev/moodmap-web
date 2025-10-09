/**
 * src/lib/ratelimit.js
 *
 * Purpose:
 *   Lightweight, Edge-safe rate limiting primitives built on the unified Redis helper.
 *
 * Usage:
 *   import { tryAcquire, release } from '@/lib/ratelimit.js';
 *
 *   const allowed = await tryAcquire(`rl:${ip}`, 60); // 60s lock
 *   if (!allowed) return new Response('Rate limit', { status: 429 });
 *
 *   // ... handle request ...
 *   await release(`rl:${ip}`); // optional
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
