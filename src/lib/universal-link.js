// lib/universal-link.js
// -------------------------------------------------------------
// v2.0.0 · Unified secret naming (HMAC_SECRET) · Improved error docs
// -------------------------------------------------------------
import crypto from 'crypto';

/**
 * Generate a HMAC signature for a universal link.
 * @param {string} userId - The hashed app_user_id (SHA256 of email).
 * @param {string} sessionId - Unique session identifier.
 * @param {number} exp - Expiry timestamp (unix seconds).
 * @returns {string} Hex-encoded HMAC signature.
 */
export function generateHmacSignature(userId, sessionId, exp) {
  const secret = process.env.HMAC_SECRET;
  if (!secret) {
    throw new Error(
      'Missing HMAC_SECRET (must match EXPO_PUBLIC_HMAC_SECRET in Expo). ' +
      'Set this in your Vercel env vars.'
    );
  }
  const payload = `${sessionId}:${userId}:${exp}`;
  return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}

/**
 * Verify a HMAC signature.
 * @param {string} userId
 * @param {string} sessionId
 * @param {number|string} exp
 * @param {string} sig
 * @returns {boolean} True if valid and not expired.
 */
export function verifyHmacSignature(userId, sessionId, exp, sig) {
  const ts = Number(exp);
  if (!sig || !Number.isInteger(ts)) return false;
  if (ts < Math.floor(Date.now() / 1000)) return false;

  const expected = generateHmacSignature(userId, sessionId, ts);
  return crypto.timingSafeEqual(
    Buffer.from(expected, 'hex'),
    Buffer.from(sig, 'hex')
  );
}
