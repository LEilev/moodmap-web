#!/usr/bin/env node

import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { PRODUCT, PUBLIC_PAGES } from "../src/lib/product.js";

const ORIGIN = new URL(PRODUCT.siteUrl).origin;
const HOST = new URL(ORIGIN).host;
const DEFAULT_KEY = "4189cd7043523c810f00bc1b94b8f0d2";
const ENDPOINT = "https://api.indexnow.org/indexnow";
const PUBLIC_PATHS = new Set([
  ...PUBLIC_PAGES.map(({ path }) => path),
  "/llms.txt",
  "/llms-full.txt",
]);

const HELP = `Usage: npm run submit:indexnow -- [--dry-run] [URL ...]

Without URLs, submit the public-page registry and the two public product texts.
With URLs, submit only those pages. Paths such as /learn are also accepted.
Only known public pages on ${ORIGIN} are allowed; query strings, fragments,
credentials and private routes are rejected before any request is made.

  --dry-run  Print the exact JSON payload without contacting IndexNow.
  --help     Show this help without contacting IndexNow.

INDEXNOW_KEY may override the existing key. Its matching UTF-8 key file must
already be published at https://${HOST}/<key>.txt before submission.
An accepted submission does not guarantee crawling or indexing.`;

function normalizePublicUrl(input) {
  const value = String(input).trim();
  let url;
  try {
    if (!value || /[\u0000-\u0020\u007f]/.test(value)) throw new Error();
    url = value.startsWith("/") ? new URL(value, ORIGIN) : new URL(value);
  } catch {
    throw new Error("Invalid URL argument. Use --help for the supported public URLs.");
  }

  if (
    url.origin !== ORIGIN || url.username || url.password ||
    url.href.includes("?") || url.href.includes("#") ||
    !PUBLIC_PATHS.has(url.pathname)
  ) {
    // Do not echo a rejected URL: it could contain an account ID or signed token.
    throw new Error("Only known public MoodMap URLs without credentials, query strings or fragments can be submitted.");
  }
  return url.href;
}

export async function runIndexNow(args = [], {
  env = process.env,
  fetchImpl = globalThis.fetch,
  log = console.log,
  error = console.error,
  timeoutMs = 10_000,
} = {}) {
  let payload;
  let dryRun = false;
  try {
    const inputs = [];
    let help = false;
    for (const arg of args) {
      if (arg === "--dry-run") dryRun = true;
      else if (arg === "--help" || arg === "-h") help = true;
      else if (arg.startsWith("-")) throw new Error("Unknown option. Use --help for usage.");
      else inputs.push(arg);
    }
    if (help) {
      log(HELP);
      return 0;
    }

    // Validate every explicit argument before building or sending a request.
    // A typo must never become a full-site submission or a partial submission.
    const urlList = inputs.length
      ? [...new Set(inputs.map(normalizePublicUrl))]
      : [...PUBLIC_PATHS].map((path) => `${ORIGIN}${path}`);
    const key = env.INDEXNOW_KEY || DEFAULT_KEY;
    if (!/^[a-zA-Z0-9-]{8,128}$/.test(key)) {
      throw new Error("INDEXNOW_KEY must contain 8–128 letters, numbers or hyphens and match its published key file.");
    }
    payload = { host: HOST, key, keyLocation: `${ORIGIN}/${key}.txt`, urlList };
  } catch (cause) {
    error(`[IndexNow] ${cause.message}`);
    return 1;
  }

  if (dryRun) {
    log(JSON.stringify(payload, null, 2));
    return 0;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchImpl(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
      signal: controller.signal,
      redirect: "error",
    });
    // Consume the response within the timeout, but do not print server content
    // that could reflect the verification key or submitted data.
    await response.text();
    if (!response.ok) {
      error(`[IndexNow] Submission rejected (HTTP ${response.status}). Check the public URLs and published key file before retrying.`);
      return 1;
    }

    const result = response.status === 202
      ? "Queued; key validation is pending."
      : "Received successfully.";
    log(`[IndexNow] ${payload.urlList.length} URL(s): ${result} Receipt does not guarantee crawling or indexing.`);
    return 0;
  } catch {
    error(controller.signal.aborted
      ? "[IndexNow] Request timed out. Receipt could not be confirmed."
      : "[IndexNow] Request failed. Receipt could not be confirmed.");
    return 1;
  } finally {
    clearTimeout(timer);
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = await runIndexNow(process.argv.slice(2));
}
