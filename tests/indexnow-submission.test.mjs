import test from "node:test";
import assert from "node:assert/strict";
import { PRODUCT, PUBLIC_PAGES } from "../src/lib/product.js";
import { runIndexNow } from "../scripts/submit-indexnow.mjs";

function harness({ status = 200, body = "", fetchImpl, env = {}, timeoutMs } = {}) {
  const calls = [];
  const logs = [];
  const errors = [];
  return {
    calls, logs, errors,
    run: (args = []) => runIndexNow(args, {
      env,
      log: (message) => logs.push(message),
      error: (message) => errors.push(message),
      ...(timeoutMs === undefined ? {} : { timeoutMs }),
      fetchImpl: async (url, options) => {
        calls.push({ url, options, payload: JSON.parse(options.body) });
        if (fetchImpl) return fetchImpl(url, options);
        return { status, ok: status >= 200 && status < 300, text: async () => body };
      },
    }),
  };
}

test("IndexNow defaults follow the public registry and preserve both product texts", async () => {
  const h = harness();
  assert.equal(await h.run(), 0);
  assert.equal(h.calls.length, 1);
  const { payload, url, options } = h.calls[0];
  assert.equal(url, "https://api.indexnow.org/indexnow");
  assert.equal(options.method, "POST");
  assert.equal(options.redirect, "error");
  assert.deepEqual(payload.urlList, [
    ...PUBLIC_PAGES.map(({ path }) => `${PRODUCT.siteUrl}${path}`),
    `${PRODUCT.siteUrl}/llms.txt`,
    `${PRODUCT.siteUrl}/llms-full.txt`,
  ]);
  assert.equal(payload.host, new URL(PRODUCT.siteUrl).host);
  assert.equal(payload.keyLocation, `${PRODUCT.siteUrl}/${payload.key}.txt`);
  assert.match(h.logs[0], /does not guarantee crawling or indexing/);
});

test("IndexNow normalizes a bare origin and deduplicates equivalent public URLs", async () => {
  const h = harness();
  assert.equal(await h.run([
    PRODUCT.siteUrl, `${PRODUCT.siteUrl}/`, "/",
    "/learn/period-tracking-for-men", `${PRODUCT.siteUrl}/learn/period-tracking-for-men`,
  ]), 0);
  assert.deepEqual(h.calls[0].payload.urlList, [
    `${PRODUCT.siteUrl}/`, `${PRODUCT.siteUrl}/learn/period-tracking-for-men`,
  ]);
});

test("IndexNow refuses invalid or private URL arguments without sending or echoing them", async () => {
  const rejected = [
    "", "not-a-url", "https://example.com/", `http://${new URL(PRODUCT.siteUrl).host}/`,
    "//example.com/learn", `${PRODUCT.siteUrl}.example.com/`,
    "/activate?u=private-user&sig=private-signature", "/account", "/thanks", "/api/version",
    "/unknown-page", "/learn?email=private@example.com", "/learn#private-fragment",
    `${PRODUCT.siteUrl}/?`, `${PRODUCT.siteUrl}/#`,
    `https://private-user:private-password@${new URL(PRODUCT.siteUrl).host}/learn`,
    "/le\tarn",
  ];
  for (const input of rejected) {
    const h = harness();
    assert.equal(await h.run([input]), 1, `Unexpected acceptance of test input ${rejected.indexOf(input)}`);
    assert.equal(h.calls.length, 0);
    assert.equal(h.logs.length, 0);
    assert.equal(h.errors.length, 1);
    assert.doesNotMatch(h.errors[0], /private-user|private-signature|private-password|private@example|private-fragment/);
  }
});

test("IndexNow rejects a whole mixed input batch instead of silently dropping bad URLs", async () => {
  for (const args of [["/learn", "not-a-url"], ["not-a-url", "/learn"], ["/learn", "/account"]]) {
    const h = harness();
    assert.equal(await h.run(args), 1);
    assert.equal(h.calls.length, 0);
    assert.equal(h.logs.length, 0);
  }
});

test("IndexNow dry-run prints only the validated payload and never sends a request", async () => {
  const h = harness({ env: { INDEXNOW_KEY: "test-key-123" } });
  assert.equal(await h.run(["--dry-run", "/learn", "/llms.txt"]), 0);
  assert.equal(h.calls.length, 0);
  assert.deepEqual(JSON.parse(h.logs[0]), {
    host: new URL(PRODUCT.siteUrl).host,
    key: "test-key-123",
    keyLocation: `${PRODUCT.siteUrl}/test-key-123.txt`,
    urlList: [`${PRODUCT.siteUrl}/learn`, `${PRODUCT.siteUrl}/llms.txt`],
  });
  const invalid = harness();
  assert.equal(await invalid.run(["--dry-run", "/account?u=private-user"]), 1);
  assert.equal(invalid.calls.length, 0);
  assert.equal(invalid.logs.length, 0);
});

test("IndexNow help and unknown options cannot submit URLs", async () => {
  const help = harness();
  assert.equal(await help.run(["--help"]), 0);
  assert.equal(help.calls.length, 0);
  assert.match(help.logs[0], /--dry-run/);
  const invalid = harness();
  assert.equal(await invalid.run(["--unknown-option"]), 1);
  assert.equal(invalid.calls.length, 0);
});

test("IndexNow validates custom key syntax before making a request", async () => {
  for (const key of ["short", "a".repeat(129), "private/key", "private key"]) {
    const h = harness({ env: { INDEXNOW_KEY: key } });
    assert.equal(await h.run(["/learn"]), 1);
    assert.equal(h.calls.length, 0);
    assert.doesNotMatch(h.errors.join("\n"), /private\/key|private key/);
  }
  const valid = harness({ env: { INDEXNOW_KEY: "custom-key-123" } });
  assert.equal(await valid.run(["/learn"]), 0);
  assert.equal(valid.calls[0].payload.keyLocation, `${PRODUCT.siteUrl}/custom-key-123.txt`);
});

test("IndexNow distinguishes pending key validation from an indexing guarantee", async () => {
  const h = harness({ status: 202 });
  assert.equal(await h.run(["/learn"]), 0);
  assert.match(h.logs[0], /Queued; key validation is pending/);
  assert.match(h.logs[0], /does not guarantee crawling or indexing/);
});

test("IndexNow rejects HTTP errors without reflecting server response contents", async () => {
  for (const status of [400, 403, 422, 429, 500]) {
    const h = harness({ status, body: "reflected private-key-or-query" });
    assert.equal(await h.run(["/learn"]), 1);
    assert.equal(h.calls.length, 1);
    assert.equal(h.logs.length, 0);
    assert.match(h.errors[0], new RegExp(`HTTP ${status}`));
    assert.doesNotMatch(h.errors[0], /private-key-or-query/);
  }
});

test("IndexNow bounds request time and handles network failures without exposing details", async () => {
  const stalled = harness({
    timeoutMs: 10,
    fetchImpl: (_url, { signal }) => new Promise((_, reject) => {
      signal.addEventListener("abort", () => reject(signal.reason), { once: true });
    }),
  });
  assert.equal(await stalled.run(["/learn"]), 1);
  assert.equal(stalled.calls[0].options.signal.aborted, true);
  assert.match(stalled.errors[0], /timed out/);
  assert.match(stalled.errors[0], /Receipt could not be confirmed/);
  const failed = harness({ fetchImpl: () => { throw new Error("network private-query"); } });
  assert.equal(await failed.run(["/learn"]), 1);
  assert.match(failed.errors[0], /Request failed/);
  assert.doesNotMatch(failed.errors[0], /private-query/);
});
