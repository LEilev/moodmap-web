import { test, expect, dismissPrivacy } from "./fixtures.mjs";

test("privacy contents work after navigating away and returning without a page reload", async ({ page }) => {
  await page.setViewportSize({ width: 820, height: 1180 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/privacy-policy");
  await dismissPrivacy(page);

  const contents = page.locator('[data-pp-toc]:visible');
  await expect(contents.locator('a[aria-current="true"]')).toHaveCount(1);
  await page.evaluate(() => { window.__mmPolicyNavigationMarker = true; });

  await page.locator("footer").getByRole("link", { name: "Guides", exact: true }).click();
  await expect(page).toHaveURL(/\/learn$/);
  await page.locator("footer").getByRole("link", { name: "Privacy Policy", exact: true }).click();
  await expect(page).toHaveURL(/\/privacy-policy$/);
  expect(await page.evaluate(() => window.__mmPolicyNavigationMarker)).toBe(true);

  await expect(contents.locator('a[aria-current="true"]')).toHaveCount(1);
  const secondSection = contents.locator('a[href="#section2"]');
  await secondSection.click();
  await expect(page).toHaveURL(/\/privacy-policy#section2$/);
  // Scroll position may put the next short section in the observer's active band.
  await expect(contents.locator('a[aria-current="true"]')).toHaveCount(1);
  await expect(page.locator("#section2")).toBeInViewport();
});
