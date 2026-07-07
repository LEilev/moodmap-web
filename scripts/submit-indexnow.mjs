#!/usr/bin/env node

const HOST = "moodmap-app.com";
const KEY = process.env.INDEXNOW_KEY || "4189cd7043523c810f00bc1b94b8f0d2";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

const DEFAULT_URLS = [
  "https://moodmap-app.com/",
  "https://moodmap-app.com/about",
  "https://moodmap-app.com/intelligence",
  "https://moodmap-app.com/pro",
  "https://moodmap-app.com/learn",
  "https://moodmap-app.com/learn/cycle-aware-relationship-timing",
  "https://moodmap-app.com/learn/menstrual-cycle-phases-for-partners",
  "https://moodmap-app.com/learn/menstrual-cycle-day-by-day-for-partners",
  "https://moodmap-app.com/learn/period-tracking-for-men",
  "https://moodmap-app.com/learn/luteal-phase-relationships",
  "https://moodmap-app.com/learn/pms-relationship-timing",
  "https://moodmap-app.com/learn/support-partner-during-pms",
  "https://moodmap-app.com/learn/fertile-window-explained",
  "https://moodmap-app.com/learn/moodmap-glossary",
  "https://moodmap-app.com/learn/why-moodmap",
  "https://moodmap-app.com/llms.txt",
  "https://moodmap-app.com/llms-full.txt",
];

function normalizeUrl(input) {
  const value = String(input || "").trim();
  if (!value) return null;
  if (/^https:\/\/moodmap-app\.com\//i.test(value)) return value;
  if (value.startsWith("/")) return `https://${HOST}${value}`;
  return null;
}

const cliUrls = process.argv.slice(2).map(normalizeUrl).filter(Boolean);
const urlList = [...new Set(cliUrls.length ? cliUrls : DEFAULT_URLS)];

const payload = {
  host: HOST,
  key: KEY,
  keyLocation: KEY_LOCATION,
  urlList,
};

const endpoint = "https://api.indexnow.org/indexnow";

try {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  });

  const body = await response.text();
  if (!response.ok) {
    console.error(`[IndexNow] Failed: ${response.status} ${response.statusText}`);
    if (body) console.error(body);
    process.exit(1);
  }

  console.log(`[IndexNow] Submitted ${urlList.length} URL(s).`);
  if (body) console.log(body);
} catch (error) {
  console.error("[IndexNow] Request failed:", error?.message || error);
  process.exit(1);
}
