import { CheckoutError, validSessionId, verifyCheckout } from "../../lib/checkout-access.js";
import { buildActivationLink } from "../../lib/universal-link.js";
import { paymentRateLimit } from "../../lib/payment-redis.js";

export const config = { api: { bodyParser: { sizeLimit: "4kb" } } };

export function createUniversalLinkHandler({ verify = verifyCheckout, makeLink = buildActivationLink, limit = paymentRateLimit } = {}) {
  return async function handler(req, res) {
    res.setHeader("Cache-Control", "private, no-store");
    if (req.method !== "POST") return res.setHeader("Allow", "POST").status(405).end();
    const { userId, sessionId } = req.body || {};
    if (!validSessionId(sessionId)) return res.status(400).json({ error: "Invalid checkout session" });
    try {
      if (!await limit(`activation:rate:${sessionId}`, 30, 3600)) {
        res.setHeader("Retry-After", "3600");
        return res.status(429).json({ error: "Please try again later" });
      }
      const checkout = await verify(sessionId);
      // Compatibility: old callers may send userId, but never choose the identity.
      if (userId !== undefined && userId !== checkout.userId) return res.status(403).json({ error: "Checkout identity does not match" });
      return res.status(200).json({ url: makeLink(checkout.userId, sessionId) });
    } catch (error) {
      if (error instanceof CheckoutError) return res.status(error.status).json({ error: error.code });
      console.error("[activation] verification unavailable", { code: error?.code || "service_error" });
      return res.status(503).json({ error: "Activation is temporarily unavailable. Please try again." });
    }
  };
}
export default createUniversalLinkHandler();
