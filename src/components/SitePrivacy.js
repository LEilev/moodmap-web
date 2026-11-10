"use client";

import { useEffect, useRef, useState } from "react";
import {
  CONSENT_KEY, PRIVACY_CHANGE_EVENT, PRIVACY_OPEN_EVENT,
  browserRequestsPrivacy, readConsent, saveConsent,
} from "../lib/site-consent.mjs";
import { analyticsPageAllowed, clickEventForLink, createAnalyticsController } from "../lib/site-analytics.mjs";
import {
  PROMOTEKIT_SITE_ID, applyReferralToLinks, clearReferral,
  referralPageAllowed, rememberReferral,
} from "../lib/referral-attribution.mjs";

const MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export function PrivacyPreferencesButton({ className = "mm-link" }) {
  return (
    <button type="button" className={className}
      onClick={() => window.dispatchEvent(new CustomEvent(PRIVACY_OPEN_EVENT))}>
      Privacy choices
    </button>
  );
}

function clearAnalyticsCookies() {
  const domains = ["", window.location.hostname, `.${window.location.hostname}`];
  document.cookie.split(";").forEach((cookie) => {
    const name = cookie.trim().split("=")[0];
    if (!/^_ga(?:_|$)|^promotekit(?:_|$)/.test(name)) return;
    domains.forEach((domain) => {
      document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax${domain ? `; Domain=${domain}` : ""}`;
    });
  });
}

/** Shared by both Next routers. Optional scripts are inserted only after an explicit choice. */
export default function SitePrivacy({ path }) {
  const [ready, setReady] = useState(false);
  const [choice, setChoice] = useState(null);
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [draft, setDraft] = useState({ analytics: false, referral: false });
  const currentChoice = useRef(null);
  const heading = useRef(null);
  const returnFocus = useRef(null);

  useEffect(() => {
    const controller = window.__mmWebAnalytics || createAnalyticsController(window, MEASUREMENT_ID);
    window.__mmWebAnalytics = controller;
    const eventHelper = (name, params) => controller.track(name, params);
    window.mmGaEvent = eventHelper;

    const sync = () => {
      const next = readConsent(window);
      const previous = currentChoice.current;
      currentChoice.current = next;
      setChoice(next);
      setDraft({ analytics: next?.analytics === true, referral: next?.referral === true });
      if (!next) setVisible(true);
      if (!next?.analytics) controller.disable();
      if (!next?.referral) clearReferral(window);

      const revoked = (previous?.analytics && !next?.analytics) || (previous?.referral && !next?.referral);
      if (revoked && !window.__mmOptionalResetting && document.querySelector("#mm-ga4, #mm-promotekit")) {
        window.__mmOptionalResetting = true;
        clearAnalyticsCookies();
        // A loaded third-party script cannot reliably be unloaded. Reload under the new choice.
        window.location.reload();
      }
    };
    const open = () => {
      returnFocus.current = document.activeElement;
      setVisible(true);
      setExpanded(true);
    };
    const storage = (event) => { if (event.key === CONSENT_KEY || event.key === null) sync(); };
    const visibility = () => { if (document.visibilityState === "visible") sync(); };
    const protectPrivateNavigation = (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (!anchor || anchor.target === "_blank" || !document.querySelector("#mm-ga4, #mm-promotekit")) return;
      try {
        const target = new URL(anchor.href, window.location.href);
        if (target.origin !== window.location.origin || referralPageAllowed(target.pathname)) return;
        event.preventDefault();
        event.stopPropagation();
        controller.disable();
        window.location.assign(target.href);
      } catch { /* Keep the original link available. */ }
    };
    const click = (event) => {
      if (event.defaultPrevented || event.button !== 0) return;
      const anchor = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (!anchor) return;
      const hit = clickEventForLink(anchor, window.location.href);
      if (hit) controller.track(hit.name, hit.params);
      if (currentChoice.current?.referral && referralPageAllowed(window.location.pathname)) {
        applyReferralToLinks(window);
      }
    };
    sync();
    setReady(true);
    window.addEventListener(PRIVACY_OPEN_EVENT, open);
    window.addEventListener(PRIVACY_CHANGE_EVENT, sync);
    window.addEventListener("storage", storage);
    document.addEventListener("visibilitychange", visibility);
    document.addEventListener("click", protectPrivateNavigation, true);
    document.addEventListener("click", click);
    return () => {
      window.removeEventListener(PRIVACY_OPEN_EVENT, open);
      window.removeEventListener(PRIVACY_CHANGE_EVENT, sync);
      window.removeEventListener("storage", storage);
      document.removeEventListener("visibilitychange", visibility);
      document.removeEventListener("click", protectPrivateNavigation, true);
      document.removeEventListener("click", click);
      if (window.mmGaEvent === eventHelper) delete window.mmGaEvent;
    };
  }, []);

  useEffect(() => {
    if (!ready || referralPageAllowed(window.location.pathname) || window.__mmOptionalResetting) return;
    if (document.querySelector("#mm-ga4, #mm-promotekit")) {
      window.__mmOptionalResetting = true;
      window.__mmWebAnalytics?.disable();
      // Defensive fallback for programmatic SPA navigation into a token-bearing page.
      // The fresh document will not initialize either optional vendor on this route.
      window.location.reload();
    }
  }, [ready, path]);

  useEffect(() => {
    if (!ready) return;
    if (!choice?.analytics || !analyticsPageAllowed(window.location.pathname)) {
      window.__mmWebAnalytics?.disable();
      return;
    }
    window.__mmWebAnalytics?.pageView();
  }, [ready, choice, path]);

  useEffect(() => {
    if (!ready || !choice?.referral || !referralPageAllowed(window.location.pathname)) return;
    rememberReferral(window);
    let script = document.getElementById("mm-promotekit");
    const apply = () => applyReferralToLinks(window);
    if (!script) {
      script = document.createElement("script");
      script.id = "mm-promotekit";
      script.async = true;
      script.referrerPolicy = "origin";
      script.src = "https://cdn.promotekit.com/promotekit.js";
      script.dataset.promotekit = PROMOTEKIT_SITE_ID;
      document.head.append(script);
    }
    script.addEventListener("load", apply);
    apply();
    const timers = [400, 1200, 2400].map((delay) => window.setTimeout(apply, delay));
    return () => {
      script.removeEventListener("load", apply);
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [ready, choice?.referral, path]);

  useEffect(() => {
    if (expanded && visible) heading.current?.focus({ preventScroll: true });
  }, [expanded, visible]);

  const close = () => {
    setVisible(false);
    setExpanded(false);
    returnFocus.current?.focus({ preventScroll: true });
  };
  const choose = (value) => {
    saveConsent(window, value);
    close();
  };
  if (!ready || !visible) return null;
  const browserOptOut = browserRequestsPrivacy(window);

  return (
    <section className="mm-privacy-panel" aria-labelledby="privacy-choice-heading">
      <h2 ref={heading} tabIndex={-1} id="privacy-choice-heading">Your privacy choices</h2>
      <p>
        Optional analytics help improve MoodMap. Referral cookies credit the creator who sent you.
        Both stay off until you choose. <a className="mm-link" href="/privacy-policy#website">Privacy policy</a>
      </p>
      {browserOptOut && <p className="mm-privacy-note">Your browser’s privacy signal keeps optional tracking off.</p>}
      {expanded && (
        <fieldset className="mm-privacy-options" disabled={browserOptOut}>
          <legend className="sr-only">Optional tracking</legend>
          <label>
            <input type="checkbox" checked={draft.analytics}
              onChange={(event) => setDraft((value) => ({ ...value, analytics: event.target.checked }))} />
            <span><strong>Analytics</strong><small>Understand which pages and download links are useful.</small></span>
          </label>
          <label>
            <input type="checkbox" checked={draft.referral}
              onChange={(event) => setDraft((value) => ({ ...value, referral: event.target.checked }))} />
            <span><strong>Referral attribution</strong><small>Credit a referral when you choose a subscription.</small></span>
          </label>
        </fieldset>
      )}
      <div className="mm-privacy-actions">
        <button type="button" onClick={() => choose({ analytics: false, referral: false })}>Essential only</button>
        {expanded
          ? <button type="button" onClick={() => choose(draft)}>Save choices</button>
          : <button type="button" disabled={browserOptOut} onClick={() => choose({ analytics: true, referral: true })}>Accept optional</button>}
        {expanded
          ? choice && <button type="button" onClick={close}>Cancel</button>
          : <button type="button" onClick={() => setExpanded(true)}>Choose</button>}
      </div>
    </section>
  );
}
