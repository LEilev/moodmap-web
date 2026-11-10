import crypto from "node:crypto";

// Preserve the released app's u/s/exp/sig wire format. Only verified server
// payment flows may issue links. RevenueCat remains the entitlement authority.
export function generateHmacSignature(userId, sessionId, exp) {
  const secret = process.env.HMAC_SECRET;
  if (!secret) throw new Error("Activation signing is not configured");
  if (typeof userId !== "string" || !userId || userId.length > 256 || typeof sessionId !== "string" || !sessionId || !Number.isSafeInteger(Number(exp))) throw new Error("Invalid activation parameters");
  return crypto.createHmac("sha256", secret).update(`${sessionId}:${userId}:${exp}`).digest("hex");
}
export function verifyHmacSignature(userId, sessionId, exp, sig) {
  const ts = Number(exp);
  if (typeof sig !== "string" || !/^[a-f0-9]{64}$/i.test(sig) || !Number.isSafeInteger(ts) || ts <= Math.floor(Date.now() / 1000)) return false;
  try {
    const expected = generateHmacSignature(userId, sessionId, ts);
    return crypto.timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(sig, "hex"));
  } catch { return false; }
}
export function buildActivationLink(userId, sessionId, exp = Math.floor(Date.now() / 1000) + 600) {
  const sig = generateHmacSignature(userId, sessionId, exp);
  const query = new URLSearchParams({ u: userId, s: sessionId, exp: String(exp), sig });
  return `https://moodmap-app.com/activate?${query}`;
}
