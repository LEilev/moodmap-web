import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import React, { act } from "react";
import { cleanup, fireEvent, render } from "@testing-library/react";
import { installDom } from "./helpers/dom.mjs";
import { loadJsx } from "./helpers/load-jsx.mjs";
import { saveConsent } from "../src/lib/site-consent.mjs";

const require = createRequire(import.meta.url);
const Link = require("next/link");
const { RouterContext } = require("next/dist/shared/lib/router-context.shared-runtime");
const previousMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = "G-TEST1234";
const { default: SitePrivacy } = await loadJsx("src/components/SitePrivacy.js");
if (previousMeasurementId === undefined) delete process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
else process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = previousMeasurementId;

const h = React.createElement;
const GUIDE = "/learn/period-tracking-for-men";
const events = (win) => (win.dataLayer || []).map((args) => Array.from(args)).filter((row) => row[0] === "event");

function routerFor(path, navigations) {
  return {
    pathname: path, asPath: path, route: path,
    push: (...args) => { navigations.push(args); return Promise.resolve(true); },
    replace: () => Promise.resolve(true),
    prefetch: () => Promise.resolve(),
  };
}

test("a real Next Link records one Premium click from its source, then one destination page view", async () => {
  const dom = installDom(`https://moodmap-app.com${GUIDE}?email=private@example.com#secret`);
  try {
    const win = dom.window;
    saveConsent(win, { analytics: true });
    const navigations = [];
    const router = routerFor(GUIDE, navigations);
    const tree = (path) => h(RouterContext.Provider, { value: router },
      h("div", { "data-mm-placement": "guide-inline", "data-mm-context": GUIDE },
        h(SitePrivacy, { path }),
        h(Link, { href: "/pro", prefetch: false }, "Explore Premium+")));
    const first = render(tree(GUIDE));
    // A mount change must remove the old document listener, without duplicating the page view.
    first.unmount();
    const result = render(tree(GUIDE));
    let defaultPrevented;
    win.document.addEventListener("click", (event) => { defaultPrevented = event.defaultPrevented; }, { once: true });
    fireEvent.click(result.getByRole("link", { name: "Explore Premium+" }));

    assert.equal(defaultPrevented, true, "Next handles navigation by canceling the native browser default");
    assert.equal(navigations.length, 1);
    assert.equal(navigations[0][0], "/pro");
    let hits = events(win);
    assert.deepEqual(hits.map((row) => row[1]), ["page_view", "premium_click"]);
    assert.equal(hits[1][2].page_path, GUIDE);
    assert.equal(hits[1][2].page_location, `https://moodmap-app.com${GUIDE}`);
    assert.equal(hits[1][2].content_path, GUIDE);
    assert.equal(hits[1][2].placement, "guide-inline");

    await act(async () => {
      win.history.pushState({}, "", "/pro?email=private@example.com#secret");
      result.rerender(tree("/pro"));
    });
    hits = events(win);
    assert.deepEqual(hits.map((row) => row[1]), ["page_view", "premium_click", "page_view"]);
    assert.equal(hits[2][2].page_path, "/pro");
    assert.doesNotMatch(JSON.stringify(win.dataLayer), /private@example|email=|#secret/);

    result.unmount();
    const detachedLink = win.document.createElement("a");
    detachedLink.href = "/pro";
    detachedLink.addEventListener("click", (event) => event.preventDefault());
    win.document.body.append(detachedLink);
    fireEvent.click(detachedLink);
    assert.equal(events(win).length, 3, "Unmount releases delegated tracking");
  } finally { cleanup(); dom.restore(); }
});

test("canceled external store links and foreign-origin Premium links do not produce click hits", () => {
  for (const origin of ["https://moodmap-app.com", "https://preview.example.com"]) {
    const dom = installDom(`${origin}/`);
    try {
      const win = dom.window;
      saveConsent(win, { analytics: true });
      const cancel = (event) => event.preventDefault();
      const foreignPremium = origin === "https://moodmap-app.com" ? "https://example.com/pro" : "https://moodmap-app.com/pro";
      const result = render(h("div", null, h(SitePrivacy, { path: "/" }),
        h("a", { href: "https://apps.apple.com/app/id6746102626", onClick: cancel }, "Canceled App Store"),
        h("a", { href: "https://play.google.com/store/apps/details?id=com.eilev.moodmapnextgen", onClick: cancel }, "Canceled Google Play"),
        h("a", { href: foreignPremium, onClick: cancel }, "Foreign Premium"),
        h("a", { href: "/pro", target: "_blank", onClick: cancel }, "Canceled new tab")));
      for (const link of result.getAllByRole("link")) fireEvent.click(link);
      assert.deepEqual(events(win).map((row) => row[1]), ["page_view"]);

      // Keep JSDOM from navigating after the document has processed a genuine store click.
      win.addEventListener("click", cancel);
      const store = win.document.createElement("a");
      store.href = "https://apps.apple.com/app/id6746102626";
      win.document.body.append(store);
      fireEvent.click(store);
      assert.deepEqual(events(win).map((row) => row[1]), ["page_view", "store_click"]);
    } finally { cleanup(); dom.restore(); }
  }
});

test("Next navigation still works while no choice, essential-only, DNT or a private source keeps analytics off", () => {
  for (const scenario of ["no-choice", "essential-only", "dnt", "private-source"]) {
    const path = scenario === "private-source" ? "/account" : GUIDE;
    const dom = installDom(`https://moodmap-app.com${path}`);
    try {
      const win = dom.window;
      if (scenario !== "no-choice") saveConsent(win, { analytics: scenario !== "essential-only" });
      if (scenario === "dnt") Object.defineProperty(win.navigator, "doNotTrack", { configurable: true, value: "1" });
      const navigations = [];
      const result = render(h(RouterContext.Provider, { value: routerFor(path, navigations) },
        h("div", null, h(SitePrivacy, { path }), h(Link, { href: "/pro", prefetch: false }, "Explore Premium+"))));
      fireEvent.click(result.getByRole("link", { name: "Explore Premium+" }));
      assert.equal(navigations.length, 1, scenario);
      assert.deepEqual(events(win), [], scenario);
      assert.equal(win.document.querySelector("#mm-ga4"), null, scenario);
    } finally { cleanup(); dom.restore(); }
  }
});
