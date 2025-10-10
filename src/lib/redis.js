// src/lib/redis.js
/**
 * Purpose:
 *   Unified, Edge-safe Upstash Redis helper used by all Partner Mode routes.
 *   Consolidates dedupe patterns (SET NX EX) and common Redis ops into one module.
 *
 * Usage:
 *   import { redis, setNX, get, getdel, hincr, expire } from '@/lib/redis.js';
 *
 *   const ok = await setNX(`pairCode:${code}`, pairId, 600);
 *   const v  = await get(`feedback:${pairId}:${date}`);
 *   const x  = await getdel(`pairCode:${code}`);
 *   const n  = await hincr(`feedback:${pairId}:${date}`, 'version', 1);
 *   const e  = await expire(`feedback:${pairId}:${date}`, 26*3600);
 */

import { Redis } from '@upstash/redis';

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

/** Singleton client (Edge-safe). Will be `null` if env vars are missing. */
export const redis = (url && token) ? new Redis({ url, token }) : /** @type {null} */ (null);

/**
 * setNX - Set a key only if it does not exist (dedupe/lock), with TTL.
 * @param {string} key
 * @param {string|number|boolean|object} value - Will be stringified if object.
 * @param {number} ttlSec - Expiration (seconds)
 * @returns {Promise<boolean>} true if set (acquired), false if key already exists or on error.
 */
export async function setNX(key, value, ttlSec) {
  try {
    if (!redis) throw new Error('Upstash Redis not configured');
    const v = (typeof value === 'string') ? value : JSON.stringify(value);
    // Upstash returns "OK" when SET succeeds, null when NX fails.
    const res = await redis.set(key, v, { nx: true, ex: ttlSec });
    return res === 'OK';
  } catch (err) {
    console.error('[redis.setNX] error:', err?.message || err);
    return false;
  }
}

/**
 * get - Get a key's string value.
 * @param {string} key
 * @returns {Promise<string|null>} value or null on miss/error.
 */
export async function get(key) {
  try {
    if (!redis) throw new Error('Upstash Redis not configured');
    const res = await redis.get(key);
    // Upstash SDK returns string or null
    return (typeof res === 'string') ? res : (res ?? null);
  } catch (err) {
    console.error('[redis.get] error:', err?.message || err);
    return null;
  }
}

/**
 * getdel - Atomically get and delete a key (uses GETDEL where available).
 * Falls back to non-atomic GET+DEL if GETDEL is not supported.
 * @param {string} key
 * @returns {Promise<string|null>} previous value, or null if missing/error.
 */
export async function getdel(key) {
  try {
    if (!redis) throw new Error('Upstash Redis not configured');
    if (typeof redis.getdel === 'function') {
      const res = await redis.getdel(key);
      return (typeof res === 'string') ? res : (res ?? null);
    }
    // Fallback (non-atomic): best-effort
    const v = await redis.get(key);
    await redis.del(key);
    return (typeof v === 'string') ? v : (v ?? null);
  } catch (err) {
    console.error('[redis.getdel] error:', err?.message || err);
    return null;
  }
}

/**
 * hincr - Increment a hash field by n (HINCRBY).
 * @param {string} key
 * @param {string} field
 * @param {number} n
 * @returns {Promise<number|null>} new integer value, or null on error.
 */
export async function hincr(key, field, n) {
  try {
    if (!redis) throw new Error('Upstash Redis not configured');
    const res = await redis.hincrby(key, field, n);
    // Upstash returns a number
    return typeof res === 'number' ? res : (res ?? null);
  } catch (err) {
    console.error('[redis.hincr] error:', err?.message || err);
    return null;
  }
}

/**
 * expire - Set a TTL on a key (in seconds).
 * @param {string} key
 * @param {number} ttlSec
 * @returns {Promise<boolean>} true if TTL set (key exists), false otherwise or on error.
 */
export async function expire(key, ttlSec) {
  try {
    if (!redis) throw new Error('Upstash Redis not configured');
    const res = await redis.expire(key, ttlSec);
    // Redis EXPIRE returns 1 on success, 0 on failure/missing key
    return res === 1;
  } catch (err) {
    console.error('[redis.expire] error:', err?.message || err);
    return false;
  }
}
