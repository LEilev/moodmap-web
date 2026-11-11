import { test as base, expect } from "@playwright/test";

export const GUIDE_PATHS = [
  "menstrual-cycle-phases-for-partners", "period-tracking-for-men",
  "luteal-phase-relationships", "pms-relationship-timing", "support-partner-during-pms",
  "fertile-window-explained", "cycle-aware-relationship-timing",
  "menstrual-cycle-day-by-day-for-partners", "moodmap-glossary", "why-moodmap",
].map((slug) => `/learn/${slug}`);
export const TOP_GUIDES = GUIDE_PATHS.slice(0, 2);
export const CORE_PATHS = ["/", "/pro", ...TOP_GUIDES];
export const GA_TEST_ID = "G-MOODMAPTEST";

export const test = base.extend({
  networkIsolation: [async ({ context }, provide) => {
    // No third-party script, analytics request, payment or store request leaves a test.
    await context.route("**/*", async (route) => {
      const url = new URL(route.request().url());
      if (url.origin === "http://127.0.0.1:4173") return route.continue();
      if (url.hostname === "www.googletagmanager.com" && url.pathname === "/gtag/js") {
        return route.fulfill({ status: 200, contentType: "application/javascript", body: "/* analytics test stub */" });
      }
      if (["apps.apple.com", "play.google.com"].includes(url.hostname)) {
        return route.fulfill({ status: 200, contentType: "text/html", body: "<title>Store navigation intercepted</title>" });
      }
      return route.abort("blockedbyclient");
    });
    await provide();
  }, { auto: true }],

  analyticsCalls: async ({ context }, provide) => {
    const calls = [];
    await context.exposeBinding("__mmRecordTestAnalytics", (_source, call) => calls.push(call));
    await context.addInitScript(() => {
      window.dataLayer = [];
      const push = Array.prototype.push;
      window.dataLayer.push = function (...items) {
        for (const item of items) window.__mmRecordTestAnalytics(Array.from(item));
        return push.apply(this, items);
      };
    });
    await provide(calls);
  },
});

export { expect };

export async function dismissPrivacy(page) {
  const essential = page.getByRole("button", { name: "Essential only", exact: true });
  await expect(essential).toBeVisible();
  await essential.click();
  await expect(page.getByRole("heading", { name: "Your privacy choices" })).toBeHidden();
}

export async function expectPageGeometry(page) {
  const geometry = await page.evaluate(() => {
    const width = document.documentElement.clientWidth;
    const outside = Array.from(document.querySelectorAll("h1, h2, main a, main button, header button, footer button"))
      .filter((element) => {
        const bounds = element.getBoundingClientRect();
        return bounds.width > 0 && bounds.height > 0 && getComputedStyle(element).visibility !== "hidden" &&
          (bounds.left < -1 || bounds.right > width + 1);
      })
      .map((element) => ({ text: element.textContent.trim().slice(0, 80), left: element.getBoundingClientRect().left, right: element.getBoundingClientRect().right }));
    return { width, scrollWidth: document.documentElement.scrollWidth, outside };
  });
  expect(geometry.scrollWidth, "document should not scroll horizontally").toBeLessThanOrEqual(geometry.width + 1);
  expect(geometry.outside, "headings and actionable controls should fit the viewport").toEqual([]);
}

export async function capturePage(page, testInfo, name) {
  await testInfo.attach(name, {
    body: await page.screenshot({ animations: "disabled", fullPage: false, scale: "css" }),
    contentType: "image/png",
  });
}

export function events(calls, name) {
  return calls.filter((call) => call[0] === "event" && call[1] === name);
}
