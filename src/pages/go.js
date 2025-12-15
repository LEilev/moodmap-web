// pages/go.js
// -----------------------------------------------------------------------------
// PromoteKit → Stripe: Zero-friction server-side redirect
// - /go             → Stripe (defaults to monthly)
// - /go/monthly     → Stripe monthly
// - /go/yearly      → Stripe yearly
//
// Preserves: via/ref + pk_* + utm_* + promotekit_* (+ coupon-like hints)
// Adds: client_reference_id (affiliate slug) + type (telemetry)
//
// IMPORTANT: This is intentionally server-side to avoid client JS delays,
// and to work reliably in in-app browsers (Instagram/TikTok/etc).
// -----------------------------------------------------------------------------

// LIVE Payment Links (allow_promotion_codes=true) — DO NOT CHANGE
const PLAN_LINKS = {
  monthly: "https://buy.stripe.com/aFabJ27zZgea0lgfzP3ks03",
  yearly:  "https://buy.stripe.com/6oU5kE2fFgea2to2N33ks04",
};

// TODO (optional): Move PLAN_LINKS to env vars later if you want rotation without deploy:
// process.env.STRIPE_LINK_MONTHLY / process.env.STRIPE_LINK_YEARLY

const COUPON_KEYS = new Set([
  "coupon", "promo", "promocode", "discount", "code", "ref_code", "refcode",
]);

function first(val) {
  return Array.isArray(val) ? (val[0] ?? "") : (val ?? "");
}

// Match your existing slug style: 2–64 chars, starts with alnum, then alnum/_/-
function validSlug(s) {
  return typeof s === "string" && /^[a-z0-9][a-z0-9_-]{1,63}$/i.test(s);
}

// Normalize malformed query like: ?type=yearly?via=Eilev
// Next will parse it as type = "yearly?via=Eilev" (and via will be missing).
function normalizeMalformedTypeIntoQuery(query, rawType) {
  if (!rawType || typeof rawType !== "string") return rawType;
  const qIndex = rawType.indexOf("?");
  if (qIndex === -1) return rawType;

  const actualType = rawType.slice(0, qIndex);
  const extraStr = rawType.slice(qIndex + 1);

  try {
    const extras = new URLSearchParams(extraStr);
    extras.forEach((val, key) => {
      if (query[key] === undefined) query[key] = val;
    });
  } catch {
    // ignore malformed extras
  }
  return actualType;
}

export async function getServerSideProps(context) {
  const query = { ...(context.query || {}) };
  const params = context.params || {};
  const res = context.res;

  // Prevent caching of affiliate-specific redirects
  try {
    res?.setHeader("Cache-Control", "private, no-store, max-age=0, must-revalidate");
  } catch {}

  // 1) Determine plan type from /go/[type] or ?type=
  let rawType = first(params.type) || first(query.type);
  rawType = normalizeMalformedTypeIntoQuery(query, rawType);
  rawType = String(rawType || "").toLowerCase();

  const planType = rawType === "yearly" ? "yearly" : "monthly";
  const baseUrl = PLAN_LINKS[planType] || PLAN_LINKS.monthly;

  // 2) Determine affiliate slug from ?via or ?ref
  const rawVia = first(query.via) || first(query.ref) || "";
  const via = validSlug(rawVia) ? rawVia : (rawVia ? "default" : "default");

  // 3) Build Stripe URL (whitelisted)
  const stripeUrl = new URL(baseUrl);

  // Lightweight telemetry (optional)
  stripeUrl.searchParams.set("type", planType);

  // Affiliate attribution
  // Only set if not already present (safe), but normally it won't be present on base payment link.
  if (!stripeUrl.searchParams.get("client_reference_id")) {
    stripeUrl.searchParams.set("client_reference_id", via);
  }

  // 4) Preserve allowed tracking params
  // Keep: pk_* / utm_* / promotekit_* + coupon-like hints
  for (const [k, v] of Object.entries(query)) {
    const key = String(k);
    const lowKey = key.toLowerCase();
    const val = first(v);

    if (!val) continue;

    if (/^(pk_|utm_|promotekit_)/i.test(key) || COUPON_KEYS.has(lowKey)) {
      stripeUrl.searchParams.set(key, String(val));
    }
  }

  return {
    redirect: {
      destination: stripeUrl.toString(),
      permanent: false, // Next will issue a temporary redirect (typically 307)
    },
  };
}

// Should never render due to SSR redirect, but keep a harmless component export.
export default function GoRedirect() {
  return null;
}
