import { createHash } from "node:crypto";
import { CheckoutError, validSessionId, verifyCheckout, verifyReceiptToken } from "../../lib/checkout-access.js";
import { buildActivationLink } from "../../lib/universal-link.js";
import { createEventStore } from "../../lib/redis-dedupe.js";
import { paymentRateLimit } from "../../lib/payment-redis.js";

export const config = { api: { bodyParser: { sizeLimit: "4kb" } }, maxDuration: 30 };
const receiptStore = createEventStore({ prefix: "receipt:v1", leaseSeconds: 90, retentionSeconds: 86400 });
const escapeHtml = (value) => value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

export function createReceiptHandler({ verify = verifyCheckout, verifyProof = verifyReceiptToken, makeLink = buildActivationLink, store = receiptStore, limit = paymentRateLimit, fetcher = fetch, env = process.env } = {}) {
  return async function handler(req, res) {
    res.setHeader("Cache-Control", "private, no-store");
    if (req.method !== "POST") return res.setHeader("Allow", "POST").status(405).end();
    const { sessionId, receiptToken } = req.body || {};
    if (!validSessionId(sessionId)) return res.status(400).json({ error: "Invalid checkout session" });
    const claims = verifyProof(receiptToken, sessionId);
    if (!claims) return res.status(401).json({ error: "This email request has expired. Refresh this page and try again." });
    if (!env.RESEND_API_KEY) return res.status(503).json({ error: "Email is temporarily unavailable. You can still open the app." });
    const deliveryId = createHash("sha256").update(receiptToken).digest("hex");
    let lease;
    let completed = false;
    try {
      lease = await store.acquire(deliveryId);
      if (lease.state === "processed") return res.status(200).json({ ok: true });
      if (lease.state === "busy") {
        res.setHeader("Retry-After", "5");
        return res.status(409).json({ error: "Your email is being sent. Please try again in a moment." });
      }
      // Both recipient and destination come from verified server data. Incoming
      // email/link fields from the retired open-mail endpoint are never used.
      const checkout = await verify(sessionId);
      const recipientKey = createHash("sha256").update(checkout.email).digest("hex");
      const sessionAllowed = await limit(`receipt:session:${sessionId}`, 10, 3600);
      const recipientAllowed = sessionAllowed && await limit(`receipt:recipient:${recipientKey}`, 20, 86400);
      if (!recipientAllowed) {
        res.setHeader("Retry-After", "3600");
        return res.status(429).json({ error: "Too many email requests. Please try later or contact support." });
      }
      // Stable payload across provider retries; an emailed link lasts 24 hours.
      const link = makeLink(checkout.userId, sessionId, claims.iat + 86400);
      const safeLink = escapeHtml(link);
      const response = await fetcher("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json", "Idempotency-Key": `moodmap-receipt/${deliveryId}` },
        signal: AbortSignal.timeout(10000),
        body: JSON.stringify({
          from: "MoodMap <noreply@moodmap-app.com>", to: checkout.email,
          subject: "Open your MoodMap Premium+ access",
          text: `Open this link on your phone to finish setting up MoodMap Premium+: ${link}\n\nThe link expires in 24 hours. Need help? support@moodmap-app.com`,
          html: `<p>Hi there,</p><p>Open this link on your phone to finish setting up MoodMap Premium+.</p><p><a href="${safeLink}">Open MoodMap</a></p><p>This link expires in 24 hours.</p><p>Need help? <a href="mailto:support@moodmap-app.com">support@moodmap-app.com</a></p>`,
        }),
      });
      if (!response.ok) return res.status(502).json({ error: "The email could not be sent. Please try again." });
      await store.complete(deliveryId, lease.token);
      completed = true;
      return res.status(200).json({ ok: true });
    } catch (error) {
      if (error instanceof CheckoutError) return res.status(error.status).json({ error: error.code });
      console.error("[receipt] delivery unavailable", { code: error?.code || "service_error" });
      return res.status(503).json({ error: "Email is temporarily unavailable. Please try again." });
    } finally {
      if (lease?.token && !completed) {
        try { await store.release(deliveryId, lease.token); }
        catch { console.error("[receipt] lease cleanup delayed"); }
      }
    }
  };
}
export default createReceiptHandler();
