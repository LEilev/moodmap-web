import { test, expect, CORE_PATHS, capturePage, dismissPrivacy, expectPageGeometry } from "./fixtures.mjs";

// The viewport sweep belongs to Chromium only. Other projects cover interactions
// in their own engines instead of multiplying every route by every width.
for (const width of [320, 390, 430, 768, 820, 1024, 1180, 1440]) {
  test(`core pages fit ${width}px without clipped controls`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: width < 768 ? 844 : 900 });
    for (const [index, path] of CORE_PATHS.entries()) {
      await page.goto(path);
      await expect(page.getByRole("main")).toHaveCount(1);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      if (index === 0) await dismissPrivacy(page);
      await page.evaluate(() => document.fonts.ready);
      await expectPageGeometry(page);
      await capturePage(page, testInfo, `${width}-${path.replaceAll("/", "_") || "home"}`);
    }
  });
}

test("enlarged root text keeps article content and download controls available", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(CORE_PATHS[2]);
  await dismissPrivacy(page);
  await page.addStyleTag({ content: "html { font-size: 200% !important; }" });
  await expectPageGeometry(page);
  const store = page.locator('main a[href*="apps.apple.com"]').first();
  await store.scrollIntoViewIfNeeded();
  await expect(store).toBeVisible();
  await capturePage(page, testInfo, "article-enlarged-text");
});
