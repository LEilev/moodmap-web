// pages/buy.js
// -------------------------------------------------------------
// v3.1.0 • Mobile-safe client redirect to Stripe
// - Works in Instagram/TikTok in-app browsers
// - Gives PromoteKit ~1.2s to record the click
// - Visible CTA in case auto-navigation is blocked
// - Preserves pk_* params and sets client_reference_id
// -------------------------------------------------------------
import { useEffect, useMemo } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

const PLAN_LINKS = {
  monthly: "https://buy.stripe.com/aFabJ27zZgea0lgfzP3ks03",
  yearly:  "https://buy.stripe.com/6oU5kE2fFgea2to2N33ks04",
};

function isInAppBrowser() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || navigator.vendor || "";
  // Common in-app identifiers: Instagram, Facebook, TikTok, Twitter, Snapchat, Pinterest, Line, Kakao
  return /Instagram|FBAN|FBAV|TikTok|Twitter|Snapchat|Pinterest|Line\/|KAKAOTALK/i.test(ua);
}

export default function BuyClient() {
  const router = useRouter();
  const inApp = isInAppBrowser();

  const href = useMemo(() => {
    if (!router.isReady) return "";
    const q = router.query || {};
    const type = q.type === "yearly" ? "yearly" : "monthly";
    const base = PLAN_LINKS[type];
    if (!base) return "";

    const url = new URL(base);

    // via/ref → client_reference_id (fallback: PromoteKit global → 'default')
    const rawVia = (q.ref || q.via || "").toString();
    const pkRef =
      typeof window !== "undefined" && window.promotekit_referral
        ? String(window.promotekit_referral)
        : "";
    const via = /^[\w-]{1,32}$/.test(rawVia) ? rawVia : pkRef || "default";

    url.searchParams.set("client_reference_id", via);
    url.searchParams.set("type", type);

    // Preserve any PromoteKit params (pk_*)
    Object.entries(q).forEach(([k, v]) => {
      if (k.startsWith("pk_")) url.searchParams.set(k, String(v));
    });

    return url.toString();
  }, [router.isReady, router.query]);

  useEffect(() => {
    if (!href) return;
    // Give PromoteKit time to register the click before leaving the page.
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

        {/* Visible CTA in case auto-navigation is blocked by an in-app browser */}
        {href ? (
          <>
            <a
              id="stripeLink"
              href={href}
              style={{ display: "none" }}
            >
              Continue
            </a>

            <a
              className="underline mt-4 text-lg"
              href={href}
            >
              Continue to Stripe
            </a>

            {inApp && (
              <p className="mt-3 text-sm opacity-80">
                If nothing happens: tap ••• and choose <b>Open in Browser</b> (Safari/Chrome), then try again.
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
