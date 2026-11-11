import { test, expect, GA_TEST_ID, TOP_GUIDES, events } from "./fixtures.mjs";

test("essential-only choice keeps analytics off through navigation", async ({ page, analyticsCalls }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Your privacy choices" })).toBeVisible();
  await expect(page.locator("#mm-ga4")).toHaveCount(0);
  expect(events(analyticsCalls, "page_view")).toHaveLength(0);
  await page.getByRole("button", { name: "Essential only", exact: true }).click();
  await page.goto(TOP_GUIDES[0]);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator("#mm-ga4")).toHaveCount(0);
  expect(events(analyticsCalls, "page_view")).toHaveLength(0);
  await page.getByRole("button", { name: "Privacy choices", exact: true }).click();
  await expect(page.getByRole("checkbox", { name: /Analytics/ })).not.toBeChecked();
  await expect(page.getByRole("checkbox")).toHaveCount(1);
});

test("opt-in sends one sanitized page view and one real store click", async ({ page, analyticsCalls }) => {
  const path = TOP_GUIDES[1];
  await page.goto(`${path}?email=browser-private%40example.invalid&session_id=browser-secret#questions`);
  await page.getByRole("button", { name: "Allow analytics", exact: true }).click();
  await expect(page.locator("#mm-ga4")).toHaveAttribute("src", `https://www.googletagmanager.com/gtag/js?id=${GA_TEST_ID}`);
  await expect.poll(() => events(analyticsCalls, "page_view").length).toBe(1);
  const initial = events(analyticsCalls, "page_view")[0][2];
  expect(initial.page_location).toBe(`https://moodmap-app.com${path}`);
  expect(initial.page_path).toBe(path);
  expect(initial.send_to).toBe(GA_TEST_ID);
  const toc = page.getByRole("navigation", { name: "On this page" }).getByRole("link").first();
  await toc.click();
  await expect.poll(() => new URL(page.url()).hash).toBe(await toc.getAttribute("href"));
  expect(events(analyticsCalls, "page_view")).toHaveLength(1);
  const store = page.locator('main a[href*="apps.apple.com"]').first();
  await store.click();
  await expect.poll(() => events(analyticsCalls, "store_click").length).toBe(1);
  const hit = events(analyticsCalls, "store_click")[0][2];
  expect(hit).toMatchObject({ platform: "ios", content_path: path, page_path: path });
  expect(hit.placement).toMatch(/^guide-/);
  expect(JSON.stringify(analyticsCalls)).not.toMatch(/browser-private|browser-secret|session_id|email=/);
});

test("revoking analytics reloads without its script or cookies", async ({ page, context, analyticsCalls }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Allow analytics", exact: true }).click();
  await expect.poll(() => events(analyticsCalls, "page_view").length).toBe(1);
  await context.addCookies([{ name: "_ga_browser_test", value: "test-only", url: "http://127.0.0.1:4173" }]);
  await page.getByRole("button", { name: "Privacy choices", exact: true }).click();
  await page.getByRole("checkbox", { name: /Analytics/ }).uncheck();
  await Promise.all([
    page.waitForEvent("domcontentloaded"),
    page.getByRole("button", { name: "Save choices", exact: true }).click(),
  ]);
  await expect(page.locator("#mm-ga4")).toHaveCount(0);
  await expect.poll(async () => page.evaluate(() => JSON.parse(localStorage.getItem("mm_web_privacy_v1")).analytics)).toBe(false);
  expect((await context.cookies()).some((cookie) => cookie.name.startsWith("_ga"))).toBe(false);
  expect(events(analyticsCalls, "page_view")).toHaveLength(1);
});

test("private account route never initializes analytics after an earlier opt-in", async ({ page, analyticsCalls }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Allow analytics", exact: true }).click();
  await expect.poll(() => events(analyticsCalls, "page_view").length).toBe(1);
  await page.goto("/account?email=browser-private%40example.invalid");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator("#mm-ga4")).toHaveCount(0);
  expect(events(analyticsCalls, "page_view")).toHaveLength(1);
  expect(JSON.stringify(analyticsCalls)).not.toContain("browser-private");
});
