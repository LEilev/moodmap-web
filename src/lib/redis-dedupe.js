// lib/redis-dedupe.js
// ---------------------------------------------------------------------------
// Ultra‑light dedupe via Upstash Redis REST.
//  → 1 fetch ≈ 40‑60 ms cold  /  5‑10 ms warm
//  → NX + EX=86400  (24 h)   →  same semantics as earlier Redis client
//
// ENV:
//   UPSTASH_REDIS_REST_URL    https://eu1-minimal-chicken-12345.upstash.io
//   UPSTASH_REDIS_REST_TOKEN  upstash:eyJld...   (long JWT)
// ---------------------------------------------------------------------------
const url   = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

const fallback = new Set();                 // dev / offline safeguard

async function req(path) {
  return fetch(`${url}/${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((r) => (r.ok ? r.json() : Promise.reject(r)));
}

export async function alreadyProcessed(id) {
  if (!(url && token)) return fallback.has(id);

  try {
    /* SET id 1 NX EX 86400  */
    const { result } = await req(`set/${id}/1?NX=true&EX=86400`);
    // result === 'OK'  => key was new
    // result === null  => key existed
    return result === null;
  } catch (e) {
    console.warn('[dedupe] Upstash err – using memory', e.message);
    return fallback.has(id);
  }
}

export async function markProcessed(id) {
  if (!(url && token)) return fallback.add(id);
  try {
    await req(`set/${id}/1?EX=86400`);
  } catch (e) {
    console.warn('[dedupe] mark fail – memory fallback');
    fallback.add(id);
  }
}
