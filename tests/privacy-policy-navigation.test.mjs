import test, { afterEach, beforeEach } from "node:test";
import assert from "node:assert/strict";
import React, { act } from "react";
import { cleanup, fireEvent, render } from "@testing-library/react";
import { installDom } from "./helpers/dom.mjs";
import { loadJsx } from "./helpers/load-jsx.mjs";

const { default: PrivacyPolicyPage } = await loadJsx("src/app/privacy-policy/page.js");
let dom;
beforeEach(() => { dom = installDom("https://moodmap-app.com/privacy-policy"); });
afterEach(() => { cleanup(); dom.restore(); });

const linksIn = (container) => Array.from(container.querySelectorAll("[data-pp-toc] a"));
const activeState = (links) => links.map((link) => link.getAttribute("aria-current"));
function expectActive(container, id) {
  const links = linksIn(container);
  assert.equal(links.filter((link) => link.getAttribute("aria-current") === "true").length, 2);
  for (const link of links) {
    const active = link.getAttribute("href") === `#${id}`;
    assert.equal(link.getAttribute("aria-current"), String(active));
    assert.equal(link.classList.contains("bg-white/10"), active);
  }
}

test("privacy contents release old DOM and bind fresh mobile and desktop links on a return visit", (t) => {
  const observers = [];
  dom.window.IntersectionObserver = class {
    constructor(callback) {
      this.callback = callback;
      this.targets = new Set();
      this.disconnected = false;
      observers.push(this);
    }
    observe(target) { this.targets.add(target); }
    disconnect() { this.targets.clear(); this.disconnected = true; }
  };

  const first = render(React.createElement(PrivacyPolicyPage));
  expectActive(first.container, "section1");
  assert.equal(observers.length, 1);
  assert.equal(observers[0].targets.size, 11);
  const oldTargets = [...observers[0].targets];
  const oldLinks = linksIn(first.container);
  observers[0].callback([{ target: first.container.querySelector("#section3"), isIntersecting: true }]);
  expectActive(first.container, "section3");
  const oldState = activeState(oldLinks);
  const removals = oldLinks.map((link) => t.mock.method(link, "removeEventListener"));
  const windowRemoval = t.mock.method(dom.window, "removeEventListener");

  first.unmount();
  assert.equal(observers[0].disconnected, true);
  assert.equal(observers[0].targets.size, 0);
  assert.ok(oldTargets.every((target) => !target.isConnected));
  assert.ok(removals.every((spy) => spy.mock.calls.some(({ arguments: args }) => args[0] === "click")));
  assert.ok(windowRemoval.mock.calls.some(({ arguments: args }) => args[0] === "hashchange"));

  // A callback queued before disconnect must not mutate the detached page.
  observers[0].callback([{ target: oldTargets[0], isIntersecting: true }]);
  assert.deepEqual(activeState(oldLinks), oldState);

  const second = render(React.createElement(PrivacyPolicyPage));
  assert.equal(observers.length, 2);
  assert.equal(observers[1].targets.size, 11);
  assert.ok([...observers[1].targets].every((target) => target.isConnected && !oldTargets.includes(target)));
  expectActive(second.container, "section1");
  const newLink = second.container.querySelector('[data-pp-toc] a[href="#section2"]');
  // Cancel only the test's default navigation, after the component's listener ran.
  newLink.addEventListener("click", (event) => event.preventDefault(), { once: true });
  fireEvent.click(newLink);
  expectActive(second.container, "section2");
  assert.deepEqual(activeState(oldLinks), oldState);

  second.unmount();
  assert.equal(observers[1].disconnected, true);
  assert.equal(observers[1].targets.size, 0);
});

test("privacy contents preserve fragment navigation and hash changes without IntersectionObserver", async () => {
  delete dom.window.IntersectionObserver;
  dom.window.history.replaceState({}, "", "/privacy-policy#website");
  const page = render(React.createElement(PrivacyPolicyPage));
  expectActive(page.container, "website");

  const link = page.container.querySelector('[data-pp-toc] a[href="#section5"]');
  const click = new dom.window.MouseEvent("click", { bubbles: true, cancelable: true });
  await act(async () => {
    link.dispatchEvent(click);
    assert.equal(click.defaultPrevented, false);
    expectActive(page.container, "section5");
    await new Promise((resolve) => dom.window.setTimeout(resolve, 0));
  });
  assert.equal(dom.window.location.hash, "#section5");

  dom.window.history.replaceState({}, "", "/privacy-policy#section8");
  dom.window.dispatchEvent(new dom.window.HashChangeEvent("hashchange"));
  expectActive(page.container, "section8");

  dom.window.history.replaceState({}, "", "/privacy-policy");
  dom.window.dispatchEvent(new dom.window.HashChangeEvent("hashchange"));
  expectActive(page.container, "section1");

  const oldLinks = linksIn(page.container);
  const oldState = activeState(oldLinks);
  page.unmount();
  dom.window.history.replaceState({}, "", "/privacy-policy#section8");
  dom.window.dispatchEvent(new dom.window.HashChangeEvent("hashchange"));
  assert.deepEqual(activeState(oldLinks), oldState);
});
