// pages/go.js
// -----------------------------------------------------------------------------
// PromoteKit-friendly redirector (LOW friction, keeps click tracking):
// - Goal: Ensure PromoteKit script runs on /buy so clicks + referrals are tracked.
// - /go (+ query/path variants) -> 302/307 redirect to /buy (NOT /pro)
// - /buy then handles PromoteKit window.promotekit_referral + redirects to Stripe.
//
// Why this works:
// - /go becomes instant (no client delay).
// - /buy still loads your site + PromoteKit script + keeps existing attribution logic.
// -----------------------------------------------------------------------------


const COUPON_KEYS = new Set([
  "coupon", "promo", "promocode", "discount", "code", "ref_code", "refcode",
]);

function first(val) {
  return Array.isArray(val) ? (val[0] ?? "") : (val ?? "");
}

function validSlug(s) {
  return typeof s === "string" && /^[a-z0-9][a-z0-9_-]{1,63}$/i.test(s);
}

/**
 * Parse req.url query and normalize malformed URLs like:
 *   /go?type=yearly?via=Eilev&utm_source=ig
 * by treating all extra '?' as '&' after the first '?'.
 *
 * Returns a map of first-seen values.
 */
function parseReqParams(reqUrl) {
  if (!reqUrl || typeof reqUrl !== "string") return {};
  const qIndex = reqUrl.indexOf("?");
  if (qIndex < 0) return {};
  const raw = reqUrl.slice(qIndex + 1).replace(/\?/g, "&");

  const out = {};
  for (const kv of raw.split("&")) {
    if (!kv) continue;
    const [k, v = ""] = kv.split("=");
    const key = decodeURIComponent(k || "").trim();
    const val = decodeURIComponent(v || "").trim();
    if (!key) continue;
    if (out[key] !== undefined) continue; // keep first
    out[key] = val;
  }
  return out;
}

/** Keep whitelisted passthrough params (pk_* / utm_* / promotekit_* + coupon-like) */
function collectPassthrough(all) {
  const keep = {};
  Object.entries(all || {}).forEach(([k, v]) => {
    const key = String(k);
    const lowKey = key.toLowerCase();
    const val = first(v);

    if (!val) return;

    if (/^(pk_|promotekit_|utm_)/i.test(key) || COUPON_KEYS.has(lowKey)) {
      keep[key] = String(val);
    }
  });
  return keep;
}

function buildUrl(path, params) {
  const sp = new URLSearchParams();
  Object.entries(params || {}).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    const s = String(v);
    if (!s) return;
    sp.set(k, s);
  });
  const qs = sp.toString();
  return qs ? `${path}?${qs}` : path;
}

export async function getServerSideProps(context) {
  const { req, res, query = {}, params = {} } = context;

  // Prevent caching (affiliate redirects should never be cached/shared)
  try {
    res?.setHeader("Cache-Control", "private, no-store, max-age=0, must-revalidate");
  } catch {}

  // Normalized query from req.url (fixes malformed '?type=yearly?via=...')
  const hrefQ = parseReqParams(req?.url);

  // via/ref (sanitize). If present but invalid, set "default".
  const rawVia = first(query.via) || first(query.ref) || hrefQ.via || hrefQ.ref || "";
  const via = validSlug(rawVia) ? rawVia : (rawVia ? "default" : "");

  // plan type: query > href > dynamic route; default monthly
  const rawType =
    (String(first(query.type) || "").toLowerCase()) ||
    (String(hrefQ.type || "").toLowerCase()) ||
    (String(params.type || "").toLowerCase());

  const type = rawType === "yearly" ? "yearly" : rawType === "monthly" ? "monthly" : "monthly";

  // Preserve tracking/campaign params
  const passthrough = {
    ...collectPassthrough(hrefQ),
    ...collectPassthrough(query),
  };

  // Optional: keep an "entry" marker for /buy analytics (if buy.js uses it)
  const entry = String(first(query.entry) || hrefQ.entry || "promotekit");

  // Default behavior: ALWAYS send to /buy (so PromoteKit can run there)
  // If you ever need to force pricing page for debugging:
  // /go?...&to=pro
  const to = String(first(query.to) || hrefQ.to || "").toLowerCase();
  const dest = (to === "pro") ? "/pro" : "/buy";

  const finalParams = {
    ...(via ? { via } : {}),
    type,
    entry,
    ...passthrough,
  };

  return {
    redirect: {
      destination: buildUrl(dest, finalParams),
      permanent: false,
    },
  };
}

// Page should never render due to SSR redirect
export default function GoRedirect() {
  return null;
}
