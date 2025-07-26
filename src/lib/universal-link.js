// lib/universal-link.js
// -------------------------------------------------------------
// Shared HMAC helpers for MoodMap universal links
//
// Link format
//   moodmap-app://activate?u=<userId>&s=<sessionId>&exp=<ts>&sig=<hmac>
//
// Payload used for HMAC
//   `${sessionId}:${userId}:${exp}`
//
// © 2025 MoodMap. MIT
// -------------------------------------------------------------
import crypto from 'crypto';

/**
 * Generate a hex‑encoded SHA‑256 HMAC for the universal link.
 * @param {string} userId    (u)
 * @param {string} sessionId (s)  – Stripe session or subscription.id
 * @param {number|string} exp      Unix timestamp (seconds)
 * @returns {string} hex digest
 */
export function generateHmacSignature(userId, sessionId, exp) {
  const secret = process.env.UNIVERSAL_LINK_SECRET;
  if (!secret) throw new Error('Missing UNIVERSAL_LINK_SECRET');
  const payload = `${sessionId}:${userId}:${exp}`;
  return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}

/**
 * Verify that a given signature matches the expected value **and**
 * that the link has not expired.  Returns `true` when both checks pass.
 * @param {string} userId
 * @param {string} sessionId
 * @param {number|string} exp        Unix timestamp (seconds)
 * @param {string} sig               Hex digest from URL
 * @returns {boolean}
 */
export function verifyHmacSignature(userId, sessionId, exp, sig) {
  if (!sig) return false;
  const now = Math.floor(Date.now() / 1000);
  if (Number(exp) < now) return false;                // TTL check
  const expected = generateHmacSignature(userId, sessionId, exp);
  return crypto.timingSafeEqual(
    Buffer.from(expected, 'hex'),
    Buffer.from(sig, 'hex'),
  );
}
