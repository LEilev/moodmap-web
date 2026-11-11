import { test, expect, capturePage, dismissPrivacy, expectPageGeometry } from "./fixtures.mjs";

test("mobile menu restores focus and scrolling through a tablet width change", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 820, height: 1180 });
  await page.goto("/");
  await dismissPrivacy(page);
  await page.evaluate(() => window.scrollTo(0, 350));
  const trigger = page.getByRole("button", { name: "Open menu", exact: true });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Navigation menu" });
  await expect(dialog).toBeVisible();
  const bounds = await dialog.boundingBox();
  expect(bounds.height).toBeGreaterThan(1000);
  await expect(page.locator("#site-shell")).toHaveAttribute("inert", "");
  await expect(dialog.getByRole("button", { name: "Close menu", exact: true })).toBeFocused();
  await capturePage(page, testInfo, "tablet-menu-open");

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await page.setViewportSize({ width: 1180, height: 820 });
  await expect(dialog).toBeHidden();
  await expect(page.locator("#site-shell")).not.toHaveAttribute("inert", "");
  await expect(page.locator("#main-content")).toBeFocused();
  await expect(page.locator("body")).not.toHaveCSS("position", "fixed");
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  const before = await page.evaluate(() => window.scrollY);
  await page.evaluate(() => window.scrollBy(0, 300));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(before);
  await expectPageGeometry(page);
});

test("keyboard navigation reaches content and operates product tabs", async ({ page }) => {
  await page.goto("/");
  await dismissPrivacy(page);
  await page.evaluate(() => document.activeElement?.blur());
  await page.getByRole("link", { name: "Skip to content", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();
  const tabs = page.getByRole("tablist", { name: "MoodMap product views" }).getByRole("tab");
  const last = tabs.last();
  await tabs.first().focus();
  await page.keyboard.press("End");
  await expect(last).toBeFocused();
  await expect(last).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("Home");
  await expect(tabs.first()).toBeFocused();
  await expect(tabs.first()).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("ArrowDown");
  await expect(tabs.nth(1)).toBeFocused();
  await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("tabpanel")).toHaveAttribute("aria-labelledby", await tabs.nth(1).getAttribute("id"));
});

test("guide contents links leave their headings below the sticky header", async ({ page }) => {
  await page.goto("/learn/period-tracking-for-men");
  await dismissPrivacy(page);
  const link = page.getByRole("navigation", { name: "On this page" }).getByRole("link").first();
  const href = await link.getAttribute("href");
  await link.click();
  await expect.poll(() => new URL(page.url()).hash).toBe(href);
  const section = page.locator(href);
  await expect(section).toBeInViewport();
  await expect.poll(async () => {
    const bounds = await section.boundingBox();
    const header = await page.locator("#site-shell > header").boundingBox();
    return bounds.y >= (header?.height || 0) - 1;
  }).toBe(true);
});
