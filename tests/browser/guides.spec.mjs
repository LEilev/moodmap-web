import { test, expect, GUIDE_PATHS, TOP_GUIDES, capturePage, dismissPrivacy, expectPageGeometry } from "./fixtures.mjs";

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

test("top guides keep section navigation and keyboard answers usable across pages", async ({ page }) => {
  test.setTimeout(120_000);
  await page.goto("/");
  await dismissPrivacy(page);

  for (const path of TOP_GUIDES) {
    // Follow real links so the shared article is also checked after client navigation.
    await page.locator("footer").getByRole("link", { name: "Guides", exact: true }).click();
    await expect.poll(() => new URL(page.url()).pathname).toBe("/learn");
    await expectPageGeometry(page);
    await page.locator(`main a[href="${path}"]`).click();
    await expect.poll(() => new URL(page.url()).pathname).toBe(path);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expectPageGeometry(page);

    const contents = page.getByRole("navigation", { name: "On this page" });
    const anchors = contents.locator('a[href^="#"]');
    const count = await anchors.count();
    expect(count).toBeGreaterThan(0);
    for (let index = 0; index < count; index += 1) {
      const link = anchors.nth(index);
      const href = await link.getAttribute("href");
      await link.click();
      await expect.poll(() => new URL(page.url()).hash).toBe(href);
      const heading = page.locator(href).getByRole("heading", { level: 2 }).first();
      await expect(heading).toBeVisible();
      await expect(heading).toBeInViewport();
      await expect.poll(async () => {
        const bounds = await heading.boundingBox();
        const header = await page.locator("#site-shell > header").boundingBox();
        return bounds !== null && bounds.y >= (header ? header.y + header.height : 0) - 1;
      }, { message: `${path}${href} heading should stay below the sticky header` }).toBe(true);
    }

    const answer = page.locator("#questions details").first();
    const question = answer.locator("summary");
    await question.focus();
    await expect(question).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(answer).toHaveAttribute("open", "");
    await expect(answer.locator("p")).toBeVisible();
    await page.keyboard.press("Enter");
    await expect(answer).not.toHaveAttribute("open", "");
    await expect(answer.locator("p")).toBeHidden();

    await page.getByRole("navigation", { name: "Breadcrumb" }).getByRole("link", { name: "MoodMap", exact: true }).click();
    await expect.poll(() => new URL(page.url()).pathname).toBe("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expectPageGeometry(page);
  }
});
