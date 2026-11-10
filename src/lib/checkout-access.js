import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import validator from "validator";
import { getStripeClient, stripeId } from "./stripe-client.js";

export class CheckoutError extends Error {
  constructor(code, status = 400) { super(code); this.code = code; this.status = status; }
}
export const validSessionId = (id) => typeof id === "string" && /^cs_[A-Za-z0-9_]{10,256}$/.test(id);
export const hashCheckoutEmail = (email) => createHash("sha256").update(email.trim().toLowerCase()).digest("hex");

export async function verifyCheckout(sessionId, { stripe = getStripeClient(), env = process.env } = {}) {
  if (!validSessionId(sessionId)) throw new CheckoutError("invalid_checkout");
  let session;
  try { session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ["subscription", "customer"] }); }
  catch (error) {
    if (error?.statusCode === 404 || error?.code === "resource_missing") throw new CheckoutError("invalid_checkout", 404);
    throw error;
  }
  if (session.mode !== "subscription") throw new CheckoutError("invalid_checkout");
  if (session.status !== "complete" || !["paid", "no_payment_required"].includes(session.payment_status)) throw new CheckoutError("payment_pending", 409);
  let subscription = session.subscription;
  if (typeof subscription === "string") subscription = await stripe.subscriptions.retrieve(subscription);
  if (!subscription?.id || !["active", "trialing"].includes(subscription.status)) throw new CheckoutError("subscription_unavailable", 409);
  // Set this allowlist when the Stripe account also sells unrelated products.
  const allowedPrices = (env.STRIPE_PREMIUM_PRICE_IDS || "").split(",").map((v) => v.trim()).filter(Boolean);
  if (allowedPrices.length && !subscription.items?.data?.some((item) => allowedPrices.includes(stripeId(item.price)))) throw new CheckoutError("invalid_product", 403);
  const customer = typeof session.customer === "object" && !session.customer?.deleted ? session.customer : null;
  const email = (session.customer_details?.email || session.customer_email || customer?.email || "").trim().toLowerCase();
  if (!validator.isEmail(email)) throw new CheckoutError("checkout_email_unavailable", 409);
  const userId = subscription.metadata?.app_user_id || session.metadata?.app_user_id || customer?.metadata?.app_user_id || hashCheckoutEmail(email);
  if (typeof userId !== "string" || !userId || userId.length > 256) throw new CheckoutError("invalid_identity", 409);
  return { session, subscription, sessionId, email, userId };
}
function receiptSecret(env) {
  // Never use the legacy native-client HMAC here. This key stays server-side.
  const key = env.RECEIPT_TOKEN_SECRET || env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Receipt signing is not configured");
  return key;
}
function receiptSignature(payload, env) { return createHmac("sha256", receiptSecret(env)).update(`moodmap:receipt:v1:${payload}`).digest("hex"); }
export function createReceiptToken(sessionId, { env = process.env, now = Date.now() } = {}) {
  if (!validSessionId(sessionId)) throw new CheckoutError("invalid_checkout");
  const iat = Math.floor(now / 1000);
  const payload = Buffer.from(JSON.stringify({ v: 1, s: sessionId, iat, exp: iat + 1800, nonce: randomBytes(16).toString("hex") })).toString("base64url");
  return `${payload}.${receiptSignature(payload, env)}`;
}
export function verifyReceiptToken(token, sessionId, { env = process.env, now = Date.now() } = {}) {
  if (!validSessionId(sessionId) || typeof token !== "string" || token.length > 1024) return null;
  const [payload, sig, extra] = token.split(".");
  if (extra !== undefined || !payload || !/^[a-f0-9]{64}$/.test(sig || "")) return null;
  try {
    const expected = receiptSignature(payload, env);
    if (!timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(sig, "hex"))) return null;
    const claims = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    const ts = Math.floor(now / 1000);
    if (claims.v !== 1 || claims.s !== sessionId || !Number.isSafeInteger(claims.exp) || !Number.isSafeInteger(claims.iat)
      || claims.iat > ts + 30 || claims.exp <= ts || claims.exp - claims.iat !== 1800 || !/^[a-f0-9]{32}$/.test(claims.nonce || "")) return null;
    return claims;
  } catch { return null; }
}
export function maskCheckoutEmail(email) {
  const [local, domain] = email.split("@");
  return `${local.slice(0, 1)}•••@${domain}`;
}
