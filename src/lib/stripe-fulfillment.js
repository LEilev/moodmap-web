import { hashCheckoutEmail } from "./checkout-access.js";
import { stripeId, subscriptionIdFor } from "./stripe-client.js";
import { paymentRedis } from "./payment-redis.js";
import { rcSync } from "./rcSync.js";

export const SUPPORTED_STRIPE_EVENTS = new Set([
  "checkout.session.completed", "checkout.session.async_payment_succeeded",
  "invoice.created", "invoice.finalized", "invoice.paid", "invoice.payment_succeeded",
  "invoice.payment_action_required", "invoice.payment_failed",
  "customer.subscription.updated", "customer.subscription.deleted", "charge.refunded",
]);

const metadataValue = (object, key) => typeof object?.metadata?.[key] === "string" ? object.metadata[key].trim().slice(0, 256) : "";
async function optionalHint(key, command) {
  if (!key) return null;
  try {
    const value = await command(["GET", key]);
    return typeof value === "string" ? JSON.parse(value) : value;
  } catch { return null; }
}

async function bestEffortMetadata(stripe, { subscriptionId, customerId, invoiceId, userId, refCode, refSlug }) {
  const metadata = { app_user_id: userId };
  if (refCode && refCode !== "default") metadata.ref_code = refCode;
  if (refSlug) metadata.ref_slug = refSlug;
  const operations = [];
  if (subscriptionId) operations.push(stripe.subscriptions.update(subscriptionId, { metadata }));
  if (customerId) operations.push(stripe.customers.update(customerId, { metadata }));
  if (invoiceId) operations.push(stripe.invoices.update(invoiceId, { metadata }));
  const results = await Promise.allSettled(operations);
  if (results.some((result) => result.status === "rejected")) console.warn("[stripe] optional attribution metadata could not be fully updated");
}

// All identity and subscription data is obtained from signed events / Stripe.
// Receipt synchronization is idempotent, but a false result is still a failure
// and must reach Stripe as retryable instead of being recorded as completed.
export async function fulfillStripeEvent(event, { stripe, sync = rcSync, command = paymentRedis } = {}) {
  let session = null;
  let invoice = null;
  let subscription = null;
  let subscriptionId = "";
  const object = event.data?.object;
  if (!object) throw new Error("Missing signed event object");

  if (event.type.startsWith("checkout.session.")) {
    session = object;
    if (session.mode !== "subscription") return;
    subscriptionId = stripeId(session.subscription);
    if (typeof session.subscription === "object") subscription = session.subscription;
  } else if (event.type.startsWith("invoice.")) {
    invoice = object;
    subscriptionId = subscriptionIdFor(invoice);
  } else if (event.type.startsWith("customer.subscription.")) {
    subscription = object;
    subscriptionId = stripeId(subscription);
  } else if (event.type === "charge.refunded") {
    const invoiceId = stripeId(object.invoice);
    if (!invoiceId) return; // Standalone charges are outside subscription fulfillment.
    invoice = await stripe.invoices.retrieve(invoiceId);
    subscriptionId = subscriptionIdFor(invoice);
  } else return;
  if (!subscriptionId) return;
  if (!subscription) subscription = await stripe.subscriptions.retrieve(subscriptionId);

  const invoiceId = stripeId(invoice) || stripeId(session?.invoice);
  const customerId = stripeId(subscription.customer) || stripeId(session?.customer) || stripeId(invoice?.customer);
  let customer = typeof subscription.customer === "object" ? subscription.customer
    : typeof session?.customer === "object" ? session.customer : null;
  let userId = metadataValue(subscription, "app_user_id") || metadataValue(session, "app_user_id") || metadataValue(invoice, "app_user_id");
  let email = session?.customer_details?.email || session?.customer_email || invoice?.customer_email || "";
  if (!userId && customerId && !customer) customer = await stripe.customers.retrieve(customerId);
  if (customer?.deleted) customer = null;
  userId ||= metadataValue(customer, "app_user_id");
  email ||= customer?.email || "";
  if (!userId && typeof email === "string" && email.includes("@")) userId = hashCheckoutEmail(email);
  if (!userId) throw new Error("Subscription identity is unavailable; retry required");

  const hint = await optionalHint(invoiceId ? `inv:${invoiceId}` : "", command);
  const candidateRef = metadataValue(session, "ref_code") || session?.client_reference_id || metadataValue(invoice, "ref_code") || metadataValue(subscription, "ref_code") || hint?.ref_code || "";
  const refCode = typeof candidateRef === "string" && /^[A-Za-z0-9_-]{1,256}$/.test(candidateRef) ? candidateRef : "";
  const refHint = refCode && refCode !== "default" ? await optionalHint(`ref:${refCode}`, command) : null;
  const candidateSlug = metadataValue(session, "ref_slug") || metadataValue(invoice, "ref_slug") || metadataValue(subscription, "ref_slug") || refHint?.slug || hint?.ref_slug || "";
  const refSlug = typeof candidateSlug === "string" && /^[A-Za-z0-9_-]{1,32}$/.test(candidateSlug) ? candidateSlug : "";

  // Attribution failures cannot turn a valid paid subscription into a failure.
  // This cache is optional; durable event handling uses the separate strict store.
  if (session && invoiceId) {
    try {
      const result = await command(["SETEX", `inv:${invoiceId}`, "900", JSON.stringify({ ref_code: refCode || undefined, ref_slug: refSlug || undefined, app_user_id: userId })]);
      if (result !== "OK") console.warn("[stripe] optional invoice hint was not stored");
    } catch { console.warn("[stripe] optional invoice hint was not stored"); }
  }
  // Updating subscription metadata can itself emit subscription.updated. Never
  // write back to that subscription while handling one of its own lifecycle events.
  await bestEffortMetadata(stripe, { subscriptionId: event.type.startsWith("customer.subscription.") ? "" : subscriptionId, customerId, invoiceId, userId, refCode, refSlug });

  const primingOnly = event.type === "invoice.created" || event.type === "invoice.finalized";
  const paymentPending = session && !["paid", "no_payment_required"].includes(session.payment_status);
  if (primingOnly || paymentPending) return;

  // RevenueCat retrieves the current subscription state, including renewals,
  // billing problems and cancellations. Its Stripe integration remains the
  // authority for store-level refund/revocation behavior.
  const ok = await sync({ appUserId: userId, fetchToken: subscriptionId });
  if (!ok) throw new Error("RevenueCat sync failed; retry required");
}
