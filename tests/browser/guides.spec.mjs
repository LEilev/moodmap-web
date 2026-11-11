import { test, expect, GUIDE_PATHS, capturePage, dismissPrivacy, expectPageGeometry } from "./fixtures.mjs";

test("every guide shares a readable article and direct official store links", async ({ page }, testInfo) => {
  test.setTimeout(90_000);
  for (const [index, path] of GUIDE_PATHS.entries()) {
    const response = await page.goto(path);
    expect(response.status()).toBe(200);
    if (index === 0) await dismissPrivacy(page);
    await expect(page.getByRole("main")).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.getByRole("navigation", { name: "Breadcrumb" })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "On this page" })).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://moodmap-app.com${path}`);
    const apple = page.locator('main a[href*="apps.apple.com"]').last();
    const google = page.locator('main a[href*="play.google.com"]').last();
    await expect(apple).toHaveAttribute("href", /\/id6746102626(?:\?|$)/);
    await expect(google).toHaveAttribute("href", /[?&]id=com\.eilev\.moodmapnextgen(?:&|$)/);
    await expect(page.locator('main a[href="/#download"]')).toHaveCount(0);
    await expectPageGeometry(page);
    if ([0, 2, 4].includes(index)) {
      await apple.scrollIntoViewIfNeeded();
      await capturePage(page, testInfo, `${path.split("/").pop()}-download`);
    }
  }
});
