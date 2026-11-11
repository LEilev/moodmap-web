import test, { afterEach, beforeEach } from "node:test";
import assert from "node:assert/strict";
import React, { act } from "react";
import { cleanup, fireEvent, render, within } from "@testing-library/react";
import { installDom } from "./helpers/dom.mjs";
import { loadJsx } from "./helpers/load-jsx.mjs";
import { CONSENT_KEY, readConsent, saveConsent } from "../src/lib/site-consent.mjs";

const { default: MobileMenu } = await loadJsx("src/components/MobileMenu.js");
const { default: ProductShowcase } = await loadJsx("src/components/ProductShowcase.js");
const previousMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = "G-TEST1234";
const { default: SitePrivacy, PrivacyPreferencesButton } = await loadJsx("src/components/SitePrivacy.js");
if (previousMeasurementId === undefined) delete process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
else process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = previousMeasurementId;
let dom;
beforeEach(() => { dom = installDom(); });
afterEach(() => { cleanup(); dom.restore(); });
const h = React.createElement;

function menuTree() {
  return h("div", { id: "site-shell" },
    h("header", { className: "mm-site-header", style: { backdropFilter: "blur(22px)" } }, h(MobileMenu)),
    h("div", { id: "main-content", tabIndex: -1 }, h("main", null, "Page content")));
}

async function openMenu(result) {
  const trigger = result.getByRole("button", { name: "Open menu" });
  trigger.focus();
  fireEvent.click(trigger);
  await act(() => new Promise((resolve) => setTimeout(resolve, 50)));
  return trigger;
}

test("menu renders outside the filtered header, traps focus, closes on Escape and restores scrolling/focus", async () => {
  const win = dom.window;
  Object.defineProperty(win, "scrollY", { configurable: true, value: 240 });
  win.document.body.style.overflow = "auto";
  win.document.body.style.position = "relative";
  const result = render(menuTree());
  const trigger = await openMenu(result);
  const dialog = within(win.document.body).getByRole("dialog", { name: "Navigation menu" });
  assert.equal(dialog.parentElement, win.document.body);
  assert.equal(dialog.closest(".mm-site-header"), null);
  assert.equal(win.document.getElementById("site-shell").inert, true);
  assert.equal(win.document.body.style.overflow, "hidden");
  assert.equal(win.document.body.style.position, "fixed");
  assert.equal(win.document.body.style.top, "-240px");
  const close = within(dialog).getByRole("button", { name: "Close menu", exact: true });
  const download = within(dialog).getByRole("link", { name: "Download MoodMap" });
  assert.equal(win.document.activeElement, close);
  fireEvent.keyDown(win, { key: "Tab", shiftKey: true });
  assert.equal(win.document.activeElement, download);
  fireEvent.keyDown(win, { key: "Tab" });
  assert.equal(win.document.activeElement, close);
  fireEvent.keyDown(win, { key: "Escape" });
  assert.equal(win.document.querySelector('[role="dialog"]'), null);
  assert.equal(win.document.getElementById("site-shell").inert, false);
  assert.equal(win.document.body.style.overflow, "auto");
  assert.equal(win.document.body.style.position, "relative");
  assert.equal(win.document.body.style.top, "");
  assert.equal(win.document.activeElement, trigger);
  assert.deepEqual(dom.scrollCalls.at(-1), [{ left: 0, top: 240, behavior: "instant" }]);
});

test("crossing the desktop breakpoint closes an open drawer and restores page access", async () => {
  const result = render(menuTree());
  await openMenu(result);
  const desktop = dom.window.matchMedia("(min-width: 1024px)");
  await act(() => desktop.setMatches(true));
  assert.equal(dom.window.document.querySelector('[role="dialog"]'), null);
  assert.equal(dom.window.document.body.style.overflow, "");
  assert.equal(dom.window.document.body.style.position, "");
  assert.equal(dom.window.document.getElementById("site-shell").inert, false);
  assert.equal(dom.window.document.activeElement.id, "main-content");
});

test("unmounting an open menu removes its scroll lock and preserves a previously inert shell", async () => {
  const result = render(menuTree());
  dom.window.document.getElementById("site-shell").inert = true;
  await openMenu(result);
  result.unmount();
  assert.equal(dom.window.document.body.style.overflow, "");
  assert.equal(dom.window.document.body.style.position, "");
  assert.equal(dom.window.document.querySelector('[role="dialog"]'), null);
});

test("product tabs use one tab stop, automatic arrow activation, Home/End and a labelled focusable panel", () => {
  const surfaces = ["Day Brief", "Calendar", "Risk Radar", "Protocol"].map((name, index) => ({
    kicker: name, title: `View ${name}`, meta: name, alt: `${name} screen`,
    screenshotPath: `/screenshots/${index}.webp`, defaultActive: index === 0,
  }));
  const result = render(h(ProductShowcase, { surfaces }));
  const tabs = result.getAllByRole("tab");
  assert.equal(result.getByRole("tablist").getAttribute("aria-orientation"), "vertical");
  assert.deepEqual(tabs.map((tab) => tab.tabIndex), [0, -1, -1, -1]);
  tabs[0].focus();
  fireEvent.keyDown(tabs[0], { key: "ArrowDown" });
  assert.equal(dom.window.document.activeElement, tabs[1]);
  assert.equal(tabs[1].getAttribute("aria-selected"), "true");
  assert.deepEqual(tabs.map((tab) => tab.tabIndex), [-1, 0, -1, -1]);
  fireEvent.keyDown(tabs[1], { key: "End" });
  assert.equal(dom.window.document.activeElement, tabs[3]);
  fireEvent.keyDown(tabs[3], { key: "ArrowDown" });
  assert.equal(dom.window.document.activeElement, tabs[0]);
  fireEvent.keyDown(tabs[0], { key: "ArrowUp" });
  assert.equal(dom.window.document.activeElement, tabs[3]);
  fireEvent.keyDown(tabs[3], { key: "Home" });
  const panel = result.getByRole("tabpanel");
  assert.equal(panel.getAttribute("aria-labelledby"), tabs[0].id);
  assert.equal(panel.tabIndex, 0);
  assert.equal(result.getByAltText("Day Brief screen").getAttribute("width"), "828");
  assert.equal(result.getByAltText("Day Brief screen").getAttribute("height"), "1792");
});

test("privacy controls start off, offer only Analytics opt-in, and keep one delegated click listener", () => {
  const tree = (path) => h("div", { id: "site-shell" },
    h(SitePrivacy, { path }), h(PrivacyPreferencesButton),
    h("a", { href: "https://apps.apple.com/app/id6746102626", "data-mm-placement": "guide-end" }, "Download"));
  const preventNavigation = (event) => event.preventDefault();
  dom.window.addEventListener("click", preventNavigation);
  const result = render(tree("/"));
  assert.equal(dom.window.document.scripts.length, 0);
  fireEvent.click(result.getByRole("button", { name: "Choose", exact: true }));
  const analytics = result.getByRole("checkbox", { name: /Analytics/ });
  assert.equal(analytics.checked, false);
  assert.equal(result.getAllByRole("checkbox").length, 1);
  assert.equal(result.queryByRole("checkbox", { name: /Referral attribution/ }), null);
  fireEvent.click(analytics);
  fireEvent.click(result.getByRole("button", { name: "Save choices" }));
  assert.equal(readConsent(dom.window).analytics, true);
  assert.equal(readConsent(dom.window).referral, false);
  assert.equal(dom.window.document.querySelectorAll("#mm-ga4").length, 1);
  assert.equal(dom.window.document.querySelectorAll("#mm-promotekit").length, 0);
  fireEvent.click(result.getByRole("link", { name: "Download" }));
  dom.window.history.replaceState({}, "", "/pro");
  result.rerender(tree("/pro"));
  fireEvent.click(result.getByRole("link", { name: "Download" }));
  const names = dom.window.dataLayer.map((args) => Array.from(args)).filter((row) => row[0] === "event").map((row) => row[1]);
  assert.deepEqual(names, ["page_view", "store_click", "page_view", "store_click"]);
  dom.window.removeEventListener("click", preventNavigation);
});

test("a historical referral opt-in never loads PromoteKit or leaks identifiers, while valid Analytics survives", () => {
  const win = dom.window;
  win.history.replaceState({}, "", "/pro?via=creator_7&pk_referral=old-private-id");
  const previous = { version: 1, analytics: true, referral: true, updatedAt: Date.now() - 10_000 };
  win.localStorage.setItem(CONSENT_KEY, JSON.stringify(previous));
  win.sessionStorage.setItem("mm_referral_slug_v1", "creator_7");
  win.document.cookie = "promotekit_referral=old-private-id; Path=/";
  win.promotekit_referral = "old-private-id";
  render(h(SitePrivacy, { path: "/pro" }));
  assert.equal(win.document.querySelectorAll("#mm-ga4").length, 1);
  assert.equal(win.document.querySelectorAll('#mm-promotekit, script[src*="promotekit"]').length, 0);
  assert.deepEqual(JSON.parse(win.localStorage.getItem(CONSENT_KEY)), { ...previous, referral: false });
  assert.equal(win.sessionStorage.getItem("mm_referral_slug_v1"), null);
  assert.equal(win.promotekit_referral, undefined);
  assert.doesNotMatch(win.document.cookie, /promotekit/);
  assert.doesNotMatch(JSON.stringify(win.dataLayer), /creator_7|old-private-id|pk_referral|via=/);
  assert.equal(readConsent(win).analytics, true);
});

test("privacy UI respects browser opt-out and permits reviewing the disabled optional choices", () => {
  Object.defineProperty(dom.window.navigator, "globalPrivacyControl", { configurable: true, value: true });
  const result = render(h("div", null, h(SitePrivacy, { path: "/" }), h(PrivacyPreferencesButton)));
  assert.equal(result.queryByRole("heading", { name: "Your privacy choices" }), null);
  fireEvent.click(result.getByRole("button", { name: "Privacy choices" }));
  const checkboxes = result.getAllByRole("checkbox");
  assert.ok(checkboxes.every((checkbox) => checkbox.closest("fieldset").disabled));
  fireEvent.click(result.getByRole("button", { name: "Save choices" }));
  assert.equal(readConsent(dom.window).analytics, false);
  assert.equal(readConsent(dom.window).referral, false);
  assert.equal(dom.window.document.scripts.length, 0);
});

test("transaction pages render shared privacy controls without initializing either vendor even after opt-in", () => {
  dom.window.history.replaceState({}, "", "/thanks?s=cs_secret&ce=private@example.com");
  saveConsent(dom.window, { analytics: true, referral: true });
  render(h(SitePrivacy, { path: "/thanks" }));
  assert.equal(dom.window.document.scripts.length, 0);
  assert.equal(dom.window.mmGaEvent("thanks_opened", { source: "stripe_redirect", deep_link_rendered: true }), false);
  assert.equal(dom.window.dataLayer, undefined);
});
