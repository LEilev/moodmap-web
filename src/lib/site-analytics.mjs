import { hasConsent } from "./site-consent.mjs";

export const SITE_ORIGIN = "https://moodmap-app.com";
const KNOWN_PATHS = new Set([
  "/", "/learn", "/about", "/intelligence", "/pro", "/support", "/privacy-policy", "/terms",
  "/buy", "/thanks", "/activate", "/account",
  ...[
    "menstrual-cycle-phases-for-partners", "period-tracking-for-men", "support-partner-during-pms",
    "fertile-window-explained", "why-moodmap", "cycle-aware-relationship-timing",
    "menstrual-cycle-day-by-day-for-partners", "luteal-phase-relationships", "pms-relationship-timing",
    "moodmap-glossary",
  ].map((slug) => `/learn/${slug}`),
]);
const EVENT_NAMES = new Set(["page_view", "store_click", "premium_click", "checkout_click", "begin_checkout", "thanks_opened"]);
const ENTRIES = new Set(["web", "homepage", "guide", "article", "pro", "paywall", "unknown", "stripe_redirect"]);

export function analyticsPageAllowed(pathname) {
  const path = safePagePath(pathname);
  return path !== "/other" && !["/thanks", "/activate", "/account"].includes(path);
}

/** Unknown/dynamic paths and every query/hash are excluded from telemetry. */
export function safePagePath(input) {
  try {
    const url = new URL(input || "/", SITE_ORIGIN);
    const path = url.pathname === "/" ? "/" : url.pathname.replace(/\/+$/, "");
    return KNOWN_PATHS.has(path) ? path : "/other";
  } catch { return "/other"; }
}

export function safeReferrer(input) {
  if (!input) return "";
  try {
    const url = new URL(input);
    if (!["https:", "http:"].includes(url.protocol)) return "";
    return url.origin === SITE_ORIGIN ? `${SITE_ORIGIN}${safePagePath(url.href)}` : url.origin;
  } catch { return ""; }
}

function safePlacement(value) {
  return typeof value === "string" && /^[a-z][a-z0-9_-]{0,39}$/.test(value) ? value : "unspecified";
}

/** Deliberately do not spread callers' objects: receipts and query strings can contain PII. */
export function sanitizeAnalyticsEvent(name, params = {}) {
  if (!EVENT_NAMES.has(name)) return null;
  if (!params || typeof params !== "object") params = {};
  const safe = {};
  if (["store_click", "premium_click", "checkout_click"].includes(name)) {
    safe.placement = safePlacement(params.placement);
    if (typeof params.context === "string") {
      const context = safePagePath(params.context.startsWith("/") ? params.context : `/learn/${params.context}`);
      if (context !== "/other") safe.content_path = context;
    }
  }
  if (name === "store_click") safe.platform = params.platform === "android" ? "android" : "ios";
  if (["begin_checkout", "checkout_click"].includes(name)) {
    safe.plan = params.plan === "yearly" ? "yearly" : "monthly";
    safe.entry = ENTRIES.has(params.entry) ? params.entry : "unknown";
  }
  if (name === "thanks_opened") {
    safe.source = params.source === "stripe_redirect" ? "stripe_redirect" : "web";
    safe.deep_link_rendered = params.deep_link_rendered === true;
  }
  return safe;
}

export function clickEventForLink(anchor, currentUrl = SITE_ORIGIN) {
  if (!anchor?.getAttribute) return null;
  let url;
  try { url = new URL(anchor.getAttribute("href"), currentUrl); } catch { return null; }
  const scope = anchor.closest("[data-mm-placement]");
  const params = {
    placement: anchor.dataset.mmPlacement || scope?.dataset.mmPlacement ||
      (anchor.closest("header") ? "header" : anchor.closest("footer") ? "footer" : "page"),
    context: anchor.dataset.mmContext || anchor.closest("[data-mm-context]")?.dataset.mmContext,
  };
  if (url.hostname === "apps.apple.com" && /(?:\/|\b)id6746102626(?:\b|\/|$)/.test(url.pathname)) {
    return { name: "store_click", params: { ...params, platform: "ios" } };
  }
  if (url.hostname === "play.google.com" && url.searchParams.get("id") === "com.eilev.moodmapnextgen") {
    return { name: "store_click", params: { ...params, platform: "android" } };
  }
  if (url.origin !== new URL(currentUrl).origin && url.origin !== SITE_ORIGIN) return null;
  if (url.pathname === "/pro") return { name: "premium_click", params };
  if (url.pathname === "/buy") {
    return { name: "checkout_click", params: { ...params, plan: url.searchParams.get("type"), entry: "pro" } };
  }
  return null;
}

export function createAnalyticsController(win, measurementId) {
  const id = /^G-[A-Z0-9]{4,20}$/i.test(measurementId || "") ? measurementId : "";
  let initialized = false;
  let lastPath = null;
  const context = () => {
    const path = safePagePath(win.location.pathname);
    return {
      page_location: `${SITE_ORIGIN}${path}`,
      page_path: path,
      page_title: path === "/" ? "MoodMap" : `MoodMap ${path}`,
      page_referrer: safeReferrer(win.document.referrer),
    };
  };

  function enable() {
    if (!id || !hasConsent(win, "analytics") || !analyticsPageAllowed(win.location.pathname)) {
      if (id) win[`ga-disable-${id}`] = true;
      return false;
    }
    win[`ga-disable-${id}`] = false;
    if (initialized) return true;
    initialized = true;
    win.dataLayer = win.dataLayer || [];
    win.gtag = win.gtag || function () { win.dataLayer.push(arguments); };
    win.gtag("consent", "default", {
      analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied",
    });
    win.gtag("js", new Date());
    win.gtag("config", id, {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      cookie_flags: "SameSite=Lax;Secure",
      ...context(),
    });
    if (!win.document.getElementById("mm-ga4")) {
      const script = win.document.createElement("script");
      script.id = "mm-ga4";
      script.async = true;
      script.referrerPolicy = "origin";
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
      win.document.head.append(script);
    }
    return true;
  }

  function track(name, params) {
    const safe = sanitizeAnalyticsEvent(name, params);
    if (!safe || !enable()) return false;
    win.gtag("event", name, { ...safe, ...context(), send_to: id, transport_type: "beacon" });
    return true;
  }

  function pageView() {
    const path = safePagePath(win.location.pathname);
    if (lastPath === path || !enable()) return false;
    win.gtag("set", context());
    if (!track("page_view")) return false;
    lastPath = path;
    return true;
  }

  function disable() {
    if (id) win[`ga-disable-${id}`] = true;
    lastPath = null;
  }
  return { enable, disable, track, pageView };
}

export function trackWebEvent(name, params) {
  if (typeof window === "undefined") return false;
  return window.mmGaEvent?.(name, params) ?? false;
}
