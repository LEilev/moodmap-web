import { test, expect, CORE_PATHS, capturePage, expectPageGeometry } from "./fixtures.mjs";

test("important content and store links remain readable without JavaScript", async ({ browser }, testInfo) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  await context.route("**/*", (route) => new URL(route.request().url()).origin === "http://127.0.0.1:4173"
    ? route.continue() : route.abort("blockedbyclient"));
  const page = await context.newPage();
  try {
    for (const path of CORE_PATHS) {
      await page.goto(`http://127.0.0.1:4173${path}`);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      const store = page.locator('main a[href*="apps.apple.com"]').first();
      await store.scrollIntoViewIfNeeded();
      await expect(store).toBeVisible();
      await expectPageGeometry(page);
    }
    await capturePage(page, testInfo, "article-without-javascript");
  } finally { await context.close(); }
});

test("reduced motion keeps reveal content visible", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("html")).not.toHaveClass(/motion-ready/);
  const panels = page.locator("[data-reveal]");
  expect(await panels.count()).toBeGreaterThan(0);
  for (const panel of await panels.all()) await expect(panel).toHaveCSS("opacity", "1");
});
