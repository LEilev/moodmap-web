// pages/buy.js
// -----------------------------------------------------------------------------
// v3.2.0 • Client-side redirect to Stripe (Monthly & Yearly)
// - Works in Instagram/TikTok in-app browsers
// - ~1.2–1.5s delay so PromoteKit can record the click
// - Preserves pk_* params and sets client_reference_id
// - Shows visible "Continue to Stripe" fallback
// -----------------------------------------------------------------------------
import { useEffect, useMemo } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

// LIVE Payment Links (allow_promotion_codes=true)
const PLAN_LINKS = {
  monthly: "https://buy.stripe.com/aFabJ27zZgea0lgfzP3ks03",
  yearly:  "https://buy.stripe.com/6oU5kE2fFgea2to2N33ks04",
};

function isInAppBrowser() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || navigator.vendor || "";
  return /Instagram|FBAN|FBAV|TikTok|Twitter|Snapchat|Pinterest|Line\/|KAKAOTALK/i.test(ua);
}

function first(val) {
  return Array.isArray(val) ? (val[0] ?? "") : (val ?? "");
}

export default function BuyClient() {
  const router = useRouter();
  const inApp = isInAppBrowser();

  const href = useMemo(() => {
    if (!router.isReady) return "";
    const q = router.query || {};

    const type = first(q.type) === "yearly" ? "yearly" : "monthly";
    const base = PLAN_LINKS[type];
    if (!base) return "";

    const url = new URL(base);

    // via/ref → client_reference_id  (fallback: PromoteKit global → "default")
    const rawVia = first(q.ref) || first(q.via) || "";
    const pkRef =
      typeof window !== "undefined" && window.promotekit_referral
        ? String(window.promotekit_referral)
        : "";
    const via = /^[\w-]{1,32}$/.test(rawVia) ? rawVia : (pkRef || "default");

    url.searchParams.set("client_reference_id", via);
    url.searchParams.set("type", type); // optional, helps your stripe-side logs

    // Preserve any PromoteKit params (pk_*)
    Object.entries(q).forEach(([k, v]) => {
      if (k.startsWith("pk_")) url.searchParams.set(k, String(first(v)));
    });

    return url.toString();
  }, [router.isReady, router.query]);

  useEffect(() => {
    if (!href) return;
    const delay = inApp ? 1500 : 1200;
    const a = document.getElementById("stripeLink");
    const t = setTimeout(() => a?.click(), delay);
    return () => clearTimeout(t);
  }, [href, inApp]);

  return (
    <>
      <Head>
        <title>Buy Pro · MoodMap</title>
        <meta name="robots" content="noindex" />
        <link rel="preconnect" href="https://buy.stripe.com" />
      </Head>

      <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <p className="text-base">Recording your click… redirecting to Stripe</p>

        {href ? (
          <>
            {/* Hidden auto-redirect anchor */}
            <a id="stripeLink" href={href} style={{ display: "none" }}>
              Continue
            </a>

            {/* Visible fallback (in case the in-app browser blocks auto-nav) */}
            <a className="underline mt-4 text-lg" href={href}>
              Continue to Stripe
            </a>

            {inApp && (
              <p className="mt-3 text-sm opacity-80">
                If nothing happens: open the menu (•••) and choose <b>Open in Browser</b>, then tap the button again.
              </p>
            )}
          </>
        ) : (
          <a className="underline mt-4" href="/pro">
            Go back
          </a>
        )}
      </main>
    </>
  );
}
