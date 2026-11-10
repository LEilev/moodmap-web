import { getStripeClient } from "../../lib/stripe-client.js";
import { stripeEventStore } from "../../lib/redis-dedupe.js";
import { fulfillStripeEvent, SUPPORTED_STRIPE_EVENTS } from "../../lib/stripe-fulfillment.js";

export const config = { api: { bodyParser: false }, maxDuration: 60 };
async function readRawBody(req) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 1024 * 1024) throw new Error("Webhook body too large");
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

export function createStripeWebhookHandler({ getStripe = getStripeClient, store = stripeEventStore, fulfill = fulfillStripeEvent, env = process.env } = {}) {
  return async function handler(req, res) {
    res.setHeader("Cache-Control", "no-store");
    if (req.method !== "POST") return res.setHeader("Allow", "POST").status(405).end();
    if (!env.STRIPE_WEBHOOK_SECRET) return res.status(503).json({ ok: false, error: "Webhook is not configured" });
    let stripe;
    try { stripe = getStripe(); }
    catch { return res.status(503).json({ ok: false, error: "Payment service unavailable" }); }
    let event;
    try { event = stripe.webhooks.constructEvent(await readRawBody(req), req.headers["stripe-signature"], env.STRIPE_WEBHOOK_SECRET); }
    catch { return res.status(400).json({ ok: false, error: "Invalid webhook signature or body" }); }
    if (!SUPPORTED_STRIPE_EVENTS.has(event.type)) return res.status(200).json({ ok: true, ignored: true });
    let lease;
    let completed = false;
    try {
      lease = await store.acquire(event.id);
      if (lease.state === "processed") return res.status(200).json({ ok: true, deduped: true });
      if (lease.state === "busy") {
        res.setHeader("Retry-After", "10");
        return res.status(503).json({ ok: false, error: "Event is processing; retry later" });
      }
      await fulfill(event, { stripe });
      await store.complete(event.id, lease.token);
      completed = true;
      return res.status(200).json({ ok: true });
    } catch (error) {
      // No payment/email/activation data is logged or reflected to the caller.
      console.error("[stripe] event remains retryable", { event: event.id, type: event.type, code: error?.code || "processing_failed" });
      return res.status(500).json({ ok: false, error: "Processing failed; retry required" });
    } finally {
      if (lease?.token && !completed) {
        try { await store.release(event.id, lease.token); }
        catch { console.error("[stripe] failed lease will expire", { event: event.id }); }
      }
    }
  };
}
export default createStripeWebhookHandler();
