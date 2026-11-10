import Stripe from "stripe";
let client;
let configuredKey;
export function getStripeClient() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Stripe is not configured");
  if (!client || configuredKey !== key) {
    client = new Stripe(key, { apiVersion: "2024-06-20", timeout: 8000, maxNetworkRetries: 1 });
    configuredKey = key;
  }
  return client;
}
export const stripeId = (value) => typeof value === "string" ? value : value?.id || "";
export function subscriptionIdFor(invoice) {
  return stripeId(invoice?.subscription)
    || stripeId(invoice?.parent?.subscription_details?.subscription)
    || stripeId(invoice?.lines?.data?.[0]?.subscription)
    || stripeId(invoice?.lines?.data?.[0]?.parent?.subscription_item_details?.subscription);
}
