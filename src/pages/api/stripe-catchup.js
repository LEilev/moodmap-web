import { createHash, timingSafeEqual } from "node:crypto";
import { getStripeClient, stripeId, subscriptionIdFor } from "../../lib/stripe-client.js";
import { stripeEventStore } from "../../lib/redis-dedupe.js";
import { rcSync } from "../../lib/rcSync.js";

export const config = { maxDuration: 300 };
const constantEqual = (a, b) => timingSafeEqual(createHash("sha256").update(a).digest(), createHash("sha256").update(b).digest());
export function catchupAuthorization(req, env = process.env) {
  const required = env.STRIPE_CATCHUP_TOKEN || env.CATCHUP_TOKEN || env.CRON_SECRET;
  if (!required) return { ok: false, status: 503 };
  const auth = typeof req.headers?.authorization === "string" ? req.headers.authorization : "";
  const bearer = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  // Kept only for existing operational callers. New calls should use the header.
  const legacy = typeof req.query?.token === "string" ? req.query.token : "";
  const supplied = bearer || legacy;
  return { ok: !!supplied && supplied.length <= 1024 && constantEqual(supplied, required), status: 401 };
}

export function createCatchupHandler({ getStripe = getStripeClient, store = stripeEventStore, sync = rcSync, env = process.env } = {}) {
  return async function handler(req, res) {
    res.setHeader("Cache-Control", "private, no-store");
    if (!["GET", "POST"].includes(req.method)) return res.setHeader("Allow", "GET, POST").status(405).end();
    const auth = catchupAuthorization(req, env);
    if (!auth.ok) return res.status(auth.status).json({ ok: false, error: auth.status === 503 ? "Recovery service is not configured" : "Unauthorized" });
    const rawHours = Number.parseInt(String(req.query?.hours || req.body?.hours || "72"), 10);
    const hours = Number.isFinite(rawHours) ? Math.max(1, Math.min(720, rawHours)) : 72;
    const force = String(req.query?.force || req.body?.force || "") === "1";
    const stats = { processedEvents: 0, synced: 0, skipped: 0, failed: 0 };
    const started = Date.now();
    let cursor = "";
    try {
      const stripe = getStripe();
      while (true) {
        const page = await stripe.events.list({ type: "invoice.paid", created: { gte: Math.floor(Date.now() / 1000) - hours * 3600 }, limit: 100, ...(cursor ? { starting_after: cursor } : {}) });
        for (const event of page.data) {
          // Leave room for a clean response before the runtime deadline. Repeating
          // the call safely skips completed events; failures remain available.
          if (Date.now() - started > 240000) return res.status(stats.failed ? 503 : 200).json({ ok: stats.failed === 0, partial: true, hours, ...stats });
          stats.processedEvents++;
          const invoice = event.data?.object;
          const subscriptionId = subscriptionIdFor(invoice);
          if (!subscriptionId) { stats.skipped++; continue; }
          // Explicit force operations get a separate durable identity. They never
          // overwrite a normal webhook lease or pretend an in-flight event is done.
          const eventId = force ? `recovery_${event.id}_${Math.floor(started / 300000)}` : event.id;
          let lease;
          let complete = false;
          try {
            lease = await store.acquire(eventId);
            if (lease.state !== "acquired") { stats.skipped++; continue; }
            const subscription = await stripe.subscriptions.retrieve(subscriptionId, { expand: ["customer"] });
            let customer = typeof subscription.customer === "object" ? subscription.customer : null;
            let userId = subscription.metadata?.app_user_id || invoice.metadata?.app_user_id || "";
            if (!userId && !customer && stripeId(subscription.customer)) customer = await stripe.customers.retrieve(stripeId(subscription.customer));
            if (customer?.deleted) customer = null;
            userId ||= customer?.metadata?.app_user_id || "";
            const email = customer?.email || invoice.customer_email || "";
            if (!userId && email) userId = createHash("sha256").update(email.trim().toLowerCase()).digest("hex");
            if (!userId || !await sync({ appUserId: userId, fetchToken: subscriptionId })) throw new Error("Recovery sync failed");
            await store.complete(eventId, lease.token);
            complete = true;
            stats.synced++;
          } catch { stats.failed++; }
          finally {
            if (lease?.token && !complete) {
              try { await store.release(eventId, lease.token); } catch { /* lease expires */ }
            }
          }
        }
        if (!page.has_more || !page.data.length) break;
        cursor = page.data[page.data.length - 1].id;
      }
      return res.status(stats.failed ? 503 : 200).json({ ok: stats.failed === 0, hours, force, ...stats });
    } catch {
      return res.status(503).json({ ok: false, error: "Recovery is temporarily unavailable", ...stats });
    }
  };
}
export default createCatchupHandler();
