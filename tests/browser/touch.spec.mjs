import { test, expect, expectPageGeometry } from "./fixtures.mjs";

test("Chromium touch navigation works at phone width", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await context.route("**/*", (route) => new URL(route.request().url()).origin === "http://127.0.0.1:4173"
    ? route.continue() : route.abort("blockedbyclient"));
  const page = await context.newPage();
  try {
    await page.goto("http://127.0.0.1:4173");
    await page.getByRole("button", { name: "Essential only", exact: true }).tap();
    await page.getByRole("button", { name: "Open menu", exact: true }).tap();
    const menu = page.getByRole("dialog", { name: "Navigation menu" });
    await expect(menu).toBeVisible();
    await menu.getByRole("link", { name: "Guides", exact: true }).tap();
    await expect(page).toHaveURL("http://127.0.0.1:4173/learn");
    await expect(menu).toBeHidden();
    await expectPageGeometry(page);
  } finally { await context.close(); }
});
