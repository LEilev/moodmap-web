import { defineConfig } from "@playwright/test";

// Always exercise a local production build. These tests never target the live site.
export default defineConfig({
  testDir: "./tests/browser",
  testMatch: "**/*.spec.mjs",
  timeout: 45_000,
  expect: { timeout: 7_500 },
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [["list"], ["html", { open: "never" }]],
  outputDir: "test-results/browser",
  use: {
    baseURL: "http://127.0.0.1:4173",
    locale: "en-US",
    timezoneId: "Europe/Oslo",
    colorScheme: "dark",
    serviceWorkers: "block",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium", viewport: { width: 1440, height: 900 } },
    },
    {
      name: "webkit-touch",
      testIgnore: ["**/layout.spec.mjs", "**/touch.spec.mjs"],
      use: {
        browserName: "webkit", viewport: { width: 390, height: 844 },
        deviceScaleFactor: 1, isMobile: true, hasTouch: true,
      },
    },
    {
      name: "firefox",
      testIgnore: ["**/layout.spec.mjs", "**/touch.spec.mjs"],
      use: { browserName: "firefox", viewport: { width: 1440, height: 900 } },
    },
  ],
  webServer: {
    command: "node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 4173",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: false,
    timeout: 30_000,
    env: { NEXT_TELEMETRY_DISABLED: "1" },
    stdout: "ignore",
    stderr: "pipe",
  },
});
