import { useEffect, useMemo, useRef, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { checkoutHref } from "../lib/checkout-links.mjs";
import { checkoutReferral } from "../lib/referral-attribution.mjs";
import { hasConsent, PRIVACY_CHANGE_EVENT } from "../lib/site-consent.mjs";
import { trackWebEvent } from "../lib/site-analytics.mjs";

const first = (value) => Array.isArray(value) ? value[0] : value;
const knownEntry = (value) => ["web", "homepage", "guide", "article", "pro", "paywall"].includes(value) ? value : "web";
const isInAppBrowser = () => typeof navigator !== "undefined" &&
  /Instagram|FBAN|FBAV|TikTok|Twitter|Snapchat|Pinterest|Line\/|KAKAOTALK/i.test(navigator.userAgent || "");

export async function getServerSideProps({ res, query }) {
  res.setHeader("X-Robots-Tag", "noindex, nofollow");
  res.setHeader("Cache-Control", "private, no-store, max-age=0, must-revalidate");
  return { props: { initialType: first(query?.type) === "yearly" ? "yearly" : "monthly" } };
}

export default function BuyClient({ initialType = "monthly" }) {
  const router = useRouter();
  const [inApp, setInApp] = useState(false);
  const [referralEnabled, setReferralEnabled] = useState(false);
  const [finalHref, setFinalHref] = useState("");
  const [affiliateNote, setAffiliateNote] = useState("");
  const automaticLink = useRef(null);
  const checkoutTracked = useRef(false);
  const ctx = useMemo(() => {
    const query = router.isReady ? router.query : {};
    return {
      type: router.isReady ? first(query.type) === "yearly" ? "yearly" : "monthly" : initialType,
      entry: knownEntry(first(query.entry)),
      pkParams: Object.fromEntries(Object.entries(query).filter(([key]) => key.startsWith("pk_"))),
    };
  }, [router.isReady, router.query, initialType]);
  const baseHref = useMemo(() => checkoutHref({ plan: ctx.type, pkParams: ctx.pkParams, referralEnabled }), [ctx, referralEnabled]);

  useEffect(() => {
    setInApp(isInAppBrowser());
    const sync = () => {
      setReferralEnabled(hasConsent(window, "referral"));
      setFinalHref("");
    };
    sync();
    window.addEventListener(PRIVACY_CHANGE_EVENT, sync);
    return () => window.removeEventListener(PRIVACY_CHANGE_EVENT, sync);
  }, []);

  const trackCheckout = () => {
    if (checkoutTracked.current) return;
    checkoutTracked.current = true;
    trackWebEvent("begin_checkout", { plan: ctx.type, entry: ctx.entry });
  };

  useEffect(() => {
    if (!router.isReady) return;
    const timer = window.setTimeout(() => {
      const enabled = hasConsent(window, "referral");
      const referral = checkoutReferral(window);
      const href = checkoutHref({ plan: ctx.type, pkParams: ctx.pkParams, referralEnabled: enabled, referral });
      setFinalHref(href);
      setAffiliateNote(referral ? "Applying referral…" : "");

      if (enabled && referral?.slug && referral.id !== referral.slug) {
        const query = new URLSearchParams({ uid: referral.id, slug: referral.slug });
        fetch(`/api/pk-stash?${query}`, { method: "GET", keepalive: true }).catch(() => {});
      }
      if (!checkoutTracked.current) {
        checkoutTracked.current = true;
        trackWebEvent("begin_checkout", { plan: ctx.type, entry: ctx.entry });
      }
      if (automaticLink.current) {
        automaticLink.current.href = href;
        automaticLink.current.click();
      }
    }, inApp ? 1500 : 1200);
    return () => window.clearTimeout(timer);
  }, [router.isReady, ctx, inApp, referralEnabled]);

  return (
    <>
      <Head>
        <title>Secure checkout · MoodMap</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <main className="mm-handoff-main">
        <div className="mm-handoff-card">
          <Link href="/" className="mm-handoff-brand">MoodMap</Link>
          <h1>Continue to secure checkout</h1>
          <p>You’re choosing Premium+ {ctx.type === "yearly" ? "annual" : "monthly"} access. Stripe will show the final price before you pay.</p>
          <p role="status" aria-live="polite" className="mm-handoff-status">{affiliateNote || "Opening Stripe…"}</p>
          <a ref={automaticLink} href={finalHref || baseHref} tabIndex={-1} aria-hidden="true" hidden>Continue</a>
          <a className="mm-handoff-primary" href={finalHref || baseHref} onClick={(event) => {
            const enabled = hasConsent(window, "referral");
            event.currentTarget.href = checkoutHref({ plan: ctx.type, pkParams: ctx.pkParams, referralEnabled: enabled, referral: checkoutReferral(window) });
            trackCheckout();
          }}>Continue to Stripe</a>
          {inApp && <p className="mm-handoff-help">If checkout does not open, choose “Open in Browser” from this browser’s menu, then try the button.</p>}
          <noscript><p>Use the button above to continue. Optional referral tracking is off.</p></noscript>
          <Link href="/pro" className="mm-link mm-handoff-back">Back to plans</Link>
        </div>
      </main>
    </>
  );
}
