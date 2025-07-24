// lib/dedupe.js
import { Redis } from '@upstash/redis';

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_URL.includes('upstash')
    ? Redis.fromEnv()
    : null;

/**
 * @param {string} id
 * @returns {boolean} true hvis allerede prosessert
 */
export async function isDuplicate(id) {
  if (!redis) return false;
  const set = await redis.set(id, 1, { nx: true, ex: 86_400 });
  return set === null;
}

export async function markProcessed(id) {
  if (!redis) return;
  await redis.set(id, 1, { nx: true, ex: 86_400 });
}
