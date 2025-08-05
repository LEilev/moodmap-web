// lib/universal-link.js
// -------------------------------------------------------------
// v1.1.0  ·  Cast exp, reject NaN  ·  Doc secret requirement
// -------------------------------------------------------------
import crypto from 'crypto';

export function generateHmacSignature(userId, sessionId, exp) {
  const secret = process.env.UNIVERSAL_LINK_SECRET;
  if (!secret)
    throw new Error(
      'Missing UNIVERSAL_LINK_SECRET (⚠️ do NOT reuse Stripe secrets)',
    );
  const payload = `${sessionId}:${userId}:${exp}`;
  return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}

export function verifyHmacSignature(userId, sessionId, exp, sig) {
  const ts = Number(exp);
  if (!sig || !Number.isInteger(ts)) return false;
  if (ts < Math.floor(Date.now() / 1000)) return false;

  const expected = generateHmacSignature(userId, sessionId, ts);
  return crypto.timingSafeEqual(
    Buffer.from(expected, 'hex'),
    Buffer.from(sig, 'hex'),
  );
}
