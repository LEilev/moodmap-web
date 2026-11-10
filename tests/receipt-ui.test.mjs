import test from "node:test";
import assert from "node:assert/strict";
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { JSDOM } from "jsdom";
import { loadJsx } from "./helpers/load-jsx.mjs";

test("receipt UI renders genuine HTTP/network failures and allows a successful retry; QR stays local", async () => {
  const dom = new JSDOM("<html><body><div id='root'></div></body></html>", { url: "https://moodmap-app.com/thanks?s=cs_test_local_12345&ce=private@example.com&sig=old" });
  const saved = new Map();
  for (const [name, value] of Object.entries({ window: dom.window, document: dom.window.document, navigator: dom.window.navigator, HTMLElement: dom.window.HTMLElement, IS_REACT_ACT_ENVIRONMENT: true })) {
    saved.set(name, Object.getOwnPropertyDescriptor(globalThis, name));
    Object.defineProperty(globalThis, name, { value, configurable: true, writable: true });
  }
  const originalFetch = globalThis.fetch;
  const requests = [], qrInputs = [];
  const outcomes = [400, 429, 500, "network", 200];
  globalThis.fetch = async (url, init) => {
    requests.push({ url, body: JSON.parse(init.body) });
    const status = outcomes.shift();
    if (status === "network") throw new TypeError("Connection failed. Please try again.");
    return { ok: status === 200, json: async () => status === 200 ? { ok: true } : { error: `Delivery error ${status}` } };
  };
  let root;
  try {
    const { default: ThanksClient } = await loadJsx("src/app/thanks/client.js", {
      "next/image": ({ priority: _priority, ...props }) => React.createElement("img", props),
      qrcode: { toDataURL: async (input) => { qrInputs.push(input); return "data:image/png;base64,localfixture"; } },
    });
    root = createRoot(document.getElementById("root"));
    await act(async () => { root.render(React.createElement(ThanksClient, { state: "ready", deepLink: "https://moodmap-app.com/activate?s=local&sig=local", sessionId: "cs_test_local_12345", receiptToken: "server_proof", maskedEmail: "b•••@example.com" })); });
    assert.equal(new URL(window.location.href).searchParams.has("ce"), false);
    assert.equal(new URL(window.location.href).searchParams.has("sig"), false);
    assert.equal(requests.length, 0);
    assert.equal(qrInputs.length, 1);
    assert.match(document.querySelector("img[alt^='Scan']").src, /^data:/);
    const sendButton = () => [...document.querySelectorAll("button")].find((button) => /Email my activation|Try sending|Email sent|Sending/.test(button.textContent));
    for (const status of [400, 429, 500, "network"]) {
      await act(async () => { sendButton().click(); });
      assert.equal(sendButton().disabled, false, String(status));
      assert.equal(sendButton().textContent, "Try sending again");
      assert.ok(document.querySelector("[role='alert']").textContent.length > 0);
    }
    await act(async () => { sendButton().click(); });
    assert.equal(sendButton().textContent, "Email sent"); assert.equal(sendButton().disabled, true);
    assert.equal(requests.length, 5);
    for (const request of requests) {
      assert.equal(request.url, "/api/send-receipt");
      assert.deepEqual(request.body, { sessionId: "cs_test_local_12345", receiptToken: "server_proof" });
    }
    await act(async () => { root.render(React.createElement(ThanksClient, { state: "pending" })); });
    assert.match(document.querySelector("h1").textContent, /processing/);
    assert.equal(document.querySelector("a[href^='https://moodmap-app.com/activate']"), null);
  } finally {
    if (root) await act(async () => root.unmount());
    globalThis.fetch = originalFetch;
    for (const [key, descriptor] of saved) { if (descriptor) Object.defineProperty(globalThis, key, descriptor); else delete globalThis[key]; }
    dom.window.close();
  }
});
