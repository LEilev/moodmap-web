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

test("reduced motion keeps homepage content and animated subpages readable", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("html")).not.toHaveClass(/motion-ready/);
  const homepageContent = [
    page.getByRole("heading", { level: 1 }),
    page.locator("#product"),
    page.locator("#how-it-works"),
    page.locator("#download"),
  ];
  for (const content of homepageContent) {
    await content.scrollIntoViewIfNeeded();
    await expect(content).toBeVisible();
    await expect(content).toHaveCSS("opacity", "1");
  }
  await expect(page.locator("#product").getByRole("heading").first()).toBeVisible();
  await expect(page.locator("#how-it-works").getByRole("heading").first()).toBeVisible();
  await expect(page.locator("#download").getByRole("link", { name: "Download MoodMap for iPhone on the App Store", exact: true })).toBeVisible();

  // The homepage is static; Premium+ still uses scroll reveals.
  await page.goto("/pro");
  await expect(page.locator("html")).not.toHaveClass(/motion-ready/);
  const panels = page.locator("[data-reveal]");
  expect(await panels.count()).toBeGreaterThan(0);
  for (const panel of await panels.all()) await expect(panel).toHaveCSS("opacity", "1");
});
