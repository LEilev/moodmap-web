// FILE: pages/buy.js
// -----------------------------------------------------------------------------
// v3.6.0 • Client-side redirect to Stripe (Monthly & Yearly)
// - Preserves pk_* params and sets client_reference_id with strict priority:
//   1) Respect preexisting client_reference_id on the target URL
//   2) window.promotekit_referral (unique ID) — read right before redirect
//   3) (Optional API resolve skipped by default, see logs)
//   4) Fallback to human slug (?via/ref)
//   5) Final fallback: "default"
// - Works in Instagram/TikTok in-app browsers (small delay + visible fallback)
// - Optional: stashes {uniqueId, slug} for webhook (non-blocking)
// -----------------------------------------------------------------------------

import { useEffect, useMemo, useRef, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

// LIVE Payment Links (allow_promotion_codes=true) — DO NOT CHANGE
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

function validSlug(s) {
  return typeof s === "string" && /^[\w-]{1,32}$/.test(s);
}

export default function BuyClient() {
  const router = useRouter();
  const inApp = isInAppBrowser();

  const [baseHref, setBaseHref] = useState("");
  const [finalHref, setFinalHref] = useState("");
  const visibleLinkRef = useRef(null);
  const hiddenLinkRef = useRef(null);

  // Build a base Stripe URL early (without client_reference_id). Preserve pk_* + type.
  const ctx = useMemo(() => {
    if (!router.isReady) return { type: "monthly", slug: "", pkParams: {} };
    const q = router.query || {};
    const type = first(q.type) === "yearly" ? "yearly" : "monthly";
    const rawSlug = first(q.ref) || first(q.via) || "";
    const slug = validSlug(rawSlug) ? rawSlug : "";
    const pkParams = {};
    Object.entries(q).forEach(([k, v]) => {
      if (k.startsWith("pk_")) pkParams[k] = String(first(v));
    });
    return { type, slug, pkParams };
  }, [router.isReady, router.query]);

  // Compute the base href (without client_reference_id).
  useEffect(() => {
    const base = PLAN_LINKS[ctx.type];
    if (!base) return;
    const url = new URL(base);

    // Lightweight telemetry param for Stripe logs (optional)
    url.searchParams.set("type", ctx.type);

    // Preserve pk_* params
    Object.entries(ctx.pkParams).forEach(([k, v]) => url.searchParams.set(k, v));

    const baseUrl = url.toString();
    setBaseHref(baseUrl);

    // Keep visible fallback valid early
    setFinalHref(baseUrl);
  }, [ctx.type, ctx.pkParams]);

  // Decide final client_reference_id right before redirect; update links; then click.
  useEffect(() => {
    if (!baseHref) return;
    const delay = inApp ? 1500 : 1200;

    const timer = setTimeout(async () => {
      try {
        const url = new URL(baseHref);

        // 1) Respect preexisting client_reference_id
        let clientRef = url.searchParams.get("client_reference_id");
        let source = "preexisting";

        if (!clientRef) {
          // 2) PromoteKit unique ID from window.promotekit_referral (read just-in-time)
          const pkRef =
            typeof window !== "undefined" && window.promotekit_referral
              ? String(window.promotekit_referral)
              : "";

          if (pkRef) {
            clientRef = pkRef;
            source = "promotekit_referral";
          } else {
            // 3) Optional API resolve (slug -> uniqueId) — intentionally skipped to avoid
            //    dependency on undocumented endpoints. If you later add it, keep timeout ≤1000ms.

            // 4) Fallback: human slug from ?via/ref
            if (ctx.slug) {
              clientRef = ctx.slug;
              source = "fallback:slug";
            } else {
              // 5) Final fallback
              clientRef = "default";
              source = "fallback:default";
            }
          }
        }

        // Optional: stash {uniqueId, slug} for webhook if both present and differ
        if (clientRef && clientRef !== "default" && ctx.slug && clientRef !== ctx.slug) {
          try {
            const qs = new URLSearchParams({ uid: clientRef, slug: ctx.slug });
            // Non-blocking; keepalive prevents unload cancellation
            fetch(`/api/pk-stash?${qs}`, { method: "GET", keepalive: true }).catch(() => {});
          } catch {
            /* no-op */
          }
        }

        // Mutate URL only if it doesn't already have client_reference_id
        if (!url.searchParams.get("client_reference_id")) {
          url.searchParams.set("client_reference_id", clientRef);
        }

        const href = url.toString();
        setFinalHref(href);

        // Update both visible + hidden links just-in-time
        const aHidden = hiddenLinkRef.current || document.getElementById("stripeLink");
        const aVisible = visibleLinkRef.current || document.getElementById("stripeVisibleLink");
        if (aHidden) aHidden.setAttribute("href", href);
        if (aVisible) aVisible.setAttribute("href", href);

        // Log once
        const short = clientRef ? String(clientRef).slice(0, 6) + "…" : "(none)";
        console.info("[buy] client_ref", short, { source, type: ctx.type });

        // Kick off the redirect click
        aHidden?.click();
      } catch (e) {
        console.error("[buy] failed to build redirect URL", e?.message || e);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [baseHref, ctx.type, ctx.slug, inApp]);

  return (
    <>
      <Head>
        <title>Buy Pro · MoodMap</title>
        <meta name="robots" content="noindex" />
        <link rel="preconnect" href="https://buy.stripe.com" />
      </Head>

      <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <p className="text-base">Recording your click… redirecting to Stripe</p>

        {baseHref ? (
          <>
            {/* Hidden auto-redirect anchor */}
            <a
              id="stripeLink"
              ref={hiddenLinkRef}
              href={finalHref || baseHref}
              style={{ display: "none" }}
            >
              Continue
            </a>

            {/* Visible fallback (in case the in-app browser blocks auto-nav) */}
            <a
              id="stripeVisibleLink"
              ref={visibleLinkRef}
              className="underline mt-4 text-lg"
              href={finalHref || baseHref}
            >
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
