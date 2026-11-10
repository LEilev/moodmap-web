import { hasConsent } from "./site-consent.mjs";

const REFERRAL_KEY = "mm_referral_slug_v1";
export const PROMOTEKIT_SITE_ID = "88e4dc38-2a9b-412b-905d-5b91bb454187";
export const validReferralSlug = (value) => typeof value === "string" && /^[A-Za-z0-9_-]{1,32}$/.test(value) && value !== "default";
export const referralPageAllowed = (pathname) => !/^\/(?:activate|thanks|account|partner)(?:\/|$)/.test(pathname || "");

export function rememberReferral(win) {
  if (!hasConsent(win, "referral")) return "";
  const query = new URL(win.location.href).searchParams;
  const slug = query.get("via") || query.get("ref") || "";
  if (!validReferralSlug(slug)) return "";
  try { win.sessionStorage.setItem(REFERRAL_KEY, slug); } catch { /* Attribution still works for this page. */ }
  return slug;
}

export function checkoutReferral(win) {
  if (!hasConsent(win, "referral")) return null;
  let slug = rememberReferral(win);
  if (!slug) {
    try {
      const stored = win.sessionStorage.getItem(REFERRAL_KEY);
      if (validReferralSlug(stored)) slug = stored;
    } catch { /* Storage may be unavailable. */ }
  }
  const uniqueId = typeof win.promotekit_referral === "string" && /^[A-Za-z0-9_-]{1,128}$/.test(win.promotekit_referral)
    ? win.promotekit_referral : "";
  return uniqueId || slug ? { id: uniqueId || slug, slug, source: uniqueId ? "promotekit_referral" : "fallback:slug" } : null;
}

export function clearReferral(win) {
  try { win.sessionStorage.removeItem(REFERRAL_KEY); } catch { /* Best effort. */ }
  delete win.promotekit_referral;
}

export function applyReferralToLinks(win) {
  const referral = checkoutReferral(win);
  if (!referral) return;
  win.document.querySelectorAll('a[href^="https://buy.stripe.com/"]').forEach((link) => {
    try {
      const url = new URL(link.href);
      if (!url.searchParams.has("client_reference_id")) {
        url.searchParams.set("client_reference_id", referral.id);
        link.href = url.toString();
      }
    } catch { /* Leave a valid checkout link unchanged if attribution cannot be added. */ }
  });
  win.document.querySelectorAll("[pricing-table-id], [buy-button-id]").forEach((element) => {
    if (!element.hasAttribute("client-reference-id")) element.setAttribute("client-reference-id", referral.id);
  });
}
