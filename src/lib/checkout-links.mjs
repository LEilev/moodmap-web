// Public Stripe Payment Links; values intentionally match the existing web checkout.
export const PLAN_LINKS = {
  monthly: "https://buy.stripe.com/9B69AU4nN3rogkebjz3ks05",
  yearly: "https://buy.stripe.com/6oUcN66vVaTQgke87n3ks06",
};

export function checkoutHref({ plan, pkParams = {}, referralEnabled = false, referral = null }) {
  const type = plan === "yearly" ? "yearly" : "monthly";
  const url = new URL(PLAN_LINKS[type]);
  url.searchParams.set("type", type);
  if (referralEnabled) {
    Object.entries(pkParams).forEach(([key, raw]) => {
      const value = Array.isArray(raw) ? raw[0] : raw;
      if (/^pk_[a-z0-9_]{1,40}$/i.test(key) && typeof value === "string" && /^[A-Za-z0-9._~-]{1,200}$/.test(value)) {
        url.searchParams.set(key, value);
      }
    });
  }
  const id = referralEnabled && typeof referral?.id === "string" && /^[A-Za-z0-9_-]{1,128}$/.test(referral.id)
    ? referral.id : "default";
  url.searchParams.set("client_reference_id", id);
  return url.toString();
}
