// lib/dedupe.js
// Lightweight Upstash Redis helper – HTTP driver, null‑safe in dev.

import { Redis } from '@upstash/redis';

const redis =
  process.env.REDIS_URL && process.env.REDIS_URL.includes('upstash')
    ? Redis.fromEnv()        // uses UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN
    : null;

/**
 * @param {string} id  Stripe event‑id
 * @returns {boolean}  true hvis allerede prosessert
 */
export async function isDuplicate(id) {
  if (!redis) return false;
  const set = await redis.set(id, 1, { nx: true, ex: 86_400 });
  return set === null; // null == nøkkel fantes ⇒ duplikat
}

export async function markProcessed(id) {
  if (!redis) return;
  await redis.set(id, 1, { nx: true, ex: 86_400 });
}
