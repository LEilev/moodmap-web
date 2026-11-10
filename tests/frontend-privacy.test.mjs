import test from "node:test";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { CONSENT_KEY, CONSENT_MAX_AGE_MS, parseConsent, readConsent, saveConsent } from "../src/lib/site-consent.mjs";
import { analyticsPageAllowed, clickEventForLink, createAnalyticsController, safePagePath, sanitizeAnalyticsEvent } from "../src/lib/site-analytics.mjs";
import { checkoutReferral, rememberReferral, referralPageAllowed } from "../src/lib/referral-attribution.mjs";
import { checkoutHref, PLAN_LINKS } from "../src/lib/checkout-links.mjs";

function browser(path = "/") {
  return new JSDOM("<!doctype html><html><head></head><body></body></html>", {
    url: `https://moodmap-app.com${path}`,
    referrer: "https://example.com/private?email=someone@example.com",
  });
}
function events(win) {
  return (win.dataLayer || []).map((args) => Array.from(args)).filter((row) => row[0] === "event");
}

test("no optional scripts or analytics are queued before consent, or after essential-only choice", () => {
  const dom = browser("/learn/period-tracking-for-men?email=private@example.com&sig=secret");
  const controller = createAnalyticsController(dom.window, "G-TEST1234");
  assert.equal(controller.pageView(), false);
  assert.equal(controller.track("store_click", { platform: "ios" }), false);
  assert.equal(dom.window.document.scripts.length, 0);
  assert.equal(dom.window.dataLayer, undefined);
  saveConsent(dom.window, { analytics: false, referral: false });
  assert.equal(controller.pageView(), false);
  assert.equal(dom.window.document.scripts.length, 0);
  dom.window.close();
});

test("opt-in creates one GA script, exactly one initial pageview, and no raw URL or caller PII", () => {
  const dom = browser("/learn/period-tracking-for-men?ce=private@example.com&sig=secret#token");
  const win = dom.window;
  saveConsent(win, { analytics: true, referral: false });
  const controller = createAnalyticsController(win, "G-TEST1234");
  assert.equal(controller.pageView(), true);
  assert.equal(controller.pageView(), false);
  assert.equal(win.document.querySelectorAll("#mm-ga4").length, 1);
  controller.track("begin_checkout", { plan: "yearly", entry: "pro", email: "private@example.com", ref_code: "private-id", client_reference_hint: "customer-secret" });
  const rows = events(win);
  assert.deepEqual(rows.map((row) => row[1]), ["page_view", "begin_checkout"]);
  assert.equal(rows[0][2].page_location, "https://moodmap-app.com/learn/period-tracking-for-men");
  assert.equal(rows[0][2].page_referrer, "https://example.com");
  assert.equal(rows[1][2].plan, "yearly");
  assert.doesNotMatch(JSON.stringify(win.dataLayer), /private@example|customer-secret|private-id|sig=|#token/);
  win.history.replaceState({}, "", "/pro?email=other@example.com");
  assert.equal(controller.pageView(), true);
  win.history.replaceState({}, "", "/pro?email=third@example.com");
  assert.equal(controller.pageView(), false);
  dom.window.close();
});

test("transaction/token and dynamic pages never initialize GA; an existing controller stops there", () => {
  for (const path of ["/thanks?s=cs_secret", "/activate?sig=secret", "/account", "/partner?code=private", "/users/private-person"]) {
    const dom = browser(path);
    saveConsent(dom.window, { analytics: true, referral: true });
    const controller = createAnalyticsController(dom.window, "G-TEST1234");
    assert.equal(controller.pageView(), false, path);
    assert.equal(controller.track("thanks_opened", { deep_link_rendered: true }), false, path);
    assert.equal(dom.window.document.scripts.length, 0, path);
    dom.window.close();
  }
  const dom = browser("/");
  saveConsent(dom.window, { analytics: true, referral: false });
  const controller = createAnalyticsController(dom.window, "G-TEST1234");
  controller.pageView();
  dom.window.history.replaceState({}, "", "/thanks?s=cs_secret");
  assert.equal(controller.track("thanks_opened", { deep_link_rendered: true }), false);
  assert.equal(dom.window["ga-disable-G-TEST1234"], true);
  assert.equal(events(dom.window).length, 1);
  dom.window.close();
});

test("GPC and DNT override stored acceptance, including a change after analytics loaded", () => {
  for (const [key, value] of [["globalPrivacyControl", true], ["doNotTrack", "1"]]) {
    const dom = browser("/?via=creator");
    saveConsent(dom.window, { analytics: true, referral: true });
    const controller = createAnalyticsController(dom.window, "G-TEST1234");
    controller.pageView();
    Object.defineProperty(dom.window.navigator, key, { configurable: true, value });
    assert.equal(readConsent(dom.window).analytics, false);
    assert.equal(readConsent(dom.window).referral, false);
    assert.equal(controller.track("store_click", { platform: "ios" }), false);
    assert.equal(dom.window["ga-disable-G-TEST1234"], true);
    assert.equal(checkoutReferral(dom.window), null);
    const saved = saveConsent(dom.window, { analytics: true, referral: true });
    assert.equal(saved.analytics, false);
    assert.equal(saved.referral, false);
    dom.window.close();
  }
});

test("invalid, expired and future consent never enable tracking; unavailable storage has session-only choice", () => {
  const now = Date.now();
  for (const raw of ["bad json", null, { version: 1, analytics: "yes", referral: true, updatedAt: now },
    { version: 1, analytics: true, referral: true, updatedAt: now - CONSENT_MAX_AGE_MS },
    { version: 1, analytics: true, referral: true, updatedAt: now + 120000 }]) {
    assert.equal(parseConsent(raw, now), null);
  }
  const dom = browser("/");
  Object.defineProperty(dom.window, "localStorage", { configurable: true, value: {
    getItem() { return null; }, setItem() { throw new Error("storage unavailable"); },
  } });
  saveConsent(dom.window, { analytics: true, referral: false });
  assert.equal(readConsent(dom.window).analytics, true);
  saveConsent(dom.window, { analytics: false, referral: false });
  delete dom.window.__mmPrivacySession;
  assert.equal(readConsent(dom.window).analytics, false, "A saved session fallback survives a document reload without restoring stale consent");
  dom.window.close();
});

test("referral data is neither read for checkout nor persisted until its separate category is accepted", () => {
  const dom = browser("/?via=creator_7");
  dom.window.promotekit_referral = "unique-id-123";
  assert.equal(rememberReferral(dom.window), "");
  assert.equal(checkoutReferral(dom.window), null);
  assert.equal(dom.window.sessionStorage.length, 0);
  saveConsent(dom.window, { analytics: true, referral: false });
  assert.equal(checkoutReferral(dom.window), null);
  saveConsent(dom.window, { analytics: false, referral: true });
  assert.deepEqual(checkoutReferral(dom.window), { id: "unique-id-123", slug: "creator_7", source: "promotekit_referral" });
  dom.window.history.replaceState({}, "", "/pro");
  assert.equal(checkoutReferral(dom.window).slug, "creator_7");
  assert.equal(referralPageAllowed("/thanks"), false);
  dom.window.close();
});

test("existing payment links are preserved; opt-out cannot forward affiliate identifiers or pk parameters", () => {
  const input = { plan: "yearly", pkParams: { pk_referral: "unique-id", pk_email: "private@example.com" }, referral: { id: "unique-id" } };
  const declined = new URL(checkoutHref(input));
  assert.equal(declined.origin + declined.pathname, PLAN_LINKS.yearly);
  assert.equal(declined.searchParams.get("client_reference_id"), "default");
  assert.equal(declined.searchParams.has("pk_referral"), false);
  const granted = new URL(checkoutHref({ ...input, referralEnabled: true }));
  assert.equal(granted.searchParams.get("client_reference_id"), "unique-id");
  assert.equal(granted.searchParams.get("pk_referral"), "unique-id");
  assert.equal(granted.searchParams.has("pk_email"), false);
});

test("delegated link classification distinguishes store, Premium and checkout clicks without sending their query", () => {
  const dom = browser("/learn/period-tracking-for-men");
  const a = dom.window.document.createElement("a");
  a.dataset.mmPlacement = "guide-end";
  a.dataset.mmContext = "/learn/period-tracking-for-men";
  dom.window.document.body.append(a);
  a.href = "https://apps.apple.com/us/app/moodmap/id6746102626?token=secret";
  let result = clickEventForLink(a, dom.window.location.href);
  assert.equal(result.name, "store_click");
  assert.equal(result.params.platform, "ios");
  a.href = "/pro?via=creator";
  result = clickEventForLink(a, dom.window.location.href);
  assert.equal(result.name, "premium_click");
  a.href = "/buy?type=yearly&ce=private@example.com";
  result = clickEventForLink(a, dom.window.location.href);
  assert.equal(result.name, "checkout_click");
  assert.notEqual(result.name, "begin_checkout");
  assert.equal(sanitizeAnalyticsEvent(result.name, result.params).plan, "yearly");
  assert.doesNotMatch(JSON.stringify(result), /private@example|secret|creator/);
  assert.equal(sanitizeAnalyticsEvent("some_arbitrary_event", { email: "private" }), null);
  assert.deepEqual(sanitizeAnalyticsEvent("thanks_opened", null), { source: "web", deep_link_rendered: false });
  assert.equal(safePagePath("/private-person@example.com?sig=secret"), "/other");
  assert.equal(analyticsPageAllowed("/thanks"), false);
  assert.ok(dom.window.localStorage.getItem(CONSENT_KEY) === null);
  dom.window.close();
});
