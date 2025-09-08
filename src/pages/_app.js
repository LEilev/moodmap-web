// pages/_app.js
// Loads PromoteKit and injects client_reference_id on Stripe links/embeds
// + GA4 gtag bootstrap (send_page_view=false) + global mmGaEvent helper (no PII)

import { useEffect } from "react";
import Script from "next/script";
import { useRouter } from "next/router";

export default function MyApp({ Component, pageProps }) {
  const PK_SITE_ID = "88e4dc38-2a9b-412b-905d-5b91bb454187"; // LIVE
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const router = useRouter();

  // Send page_view på ruteendringer (vi styrer dette selv)
  useEffect(() => {
    const handleRoute = (url) => {
      try {
        if (typeof window !== "undefined" && typeof window.gtag === "function" && GA_MEASUREMENT_ID) {
          window.gtag("event", "page_view", {
            page_location: window.location.href,
            page_path: url,
            send_to: GA_MEASUREMENT_ID,
          });
        }
      } catch {}
    };
    router.events.on("routeChangeComplete", handleRoute);
    return () => router.events.off("routeChangeComplete", handleRoute);
  }, [router.events, GA_MEASUREMENT_ID]);

  return (
    <>
      {/* ---------- GA4 (gtag) ---------- */}
      {GA_MEASUREMENT_ID && (
        <>
          <Script
            id="ga4-src"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){ dataLayer.push(arguments); }
              gtag('js', new Date());
              // send_page_view=false → vi styrer page_view selv for å unngå duplikater
              gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false${
                process.env.NODE_ENV !== "production" ? ", debug_mode: true" : ""
              } });

              // Global, trygg helper (ingen PII)
              window.mmGaEvent = function(name, params) {
                try {
                  if (!name) return;
                  params = params || {};
                  gtag('event', name, params);
                  ${process.env.NODE_ENV !== "production" ? "console.log('[GA4]', name, params);" : ""}
                } catch (_) {}
              };
            `}
          </Script>
        </>
      )}

      {/* ---------- PromoteKit (uendret) ---------- */}
      <Script
        id="promotekit-loader"
        src="https://cdn.promotekit.com/promotekit.js"
        strategy="afterInteractive"
        data-promotekit={PK_SITE_ID}
      />

      {/* Helper: ensure client_reference_id is added to Stripe links/embeds */}
      <Script id="promotekit-helper" strategy="afterInteractive">
        {`
(function () {
  if (window.__promotekitHelperInstalled) return;
  window.__promotekitHelperInstalled = true;

  function safeGetQuery() {
    try { return new URL(window.location.href).searchParams; } catch (_) { return null; }
  }

  function pickReferral() {
    try {
      if (window.promotekit_referral) return String(window.promotekit_referral);
      var sp = safeGetQuery();
      if (!sp) return "";
      var via = sp.get("via") || sp.get("ref") || "";
      if (!via || via === "default") return "";
      return via;
    } catch (_) { return ""; }
  }

  function addClientRefToBuyLinks(ref) {
    if (!ref) return;
    var links = document.querySelectorAll('a[href^="https://buy.stripe.com/"]');
    links.forEach(function (link) {
      try {
        var href = link.getAttribute("href");
        if (!href) return;
        var url = new URL(href);
        if (!url.searchParams.has("client_reference_id")) {
          url.searchParams.set("client_reference_id", ref);
          link.setAttribute("href", url.toString());
        }
      } catch (_) {}
    });
  }

  function setClientRefOnEmbeds(ref) {
    if (!ref) return;
    document.querySelectorAll("[pricing-table-id]").forEach(function (el) {
      if (!el.getAttribute("client-reference-id")) el.setAttribute("client-reference-id", ref);
    });
    document.querySelectorAll("[buy-button-id]").forEach(function (el) {
      if (!el.getAttribute("client-reference-id")) el.setAttribute("client-reference-id", ref);
    });
  }

  function applyRef() {
    var ref = pickReferral();
    if (!ref) return;
    addClientRefToBuyLinks(ref);
    setClientRefOnEmbeds(ref);
  }

  document.addEventListener("DOMContentLoaded", function () { setTimeout(applyRef, 1500); });
  var retries = 0;
  var t = setInterval(function () { retries++; applyRef(); if (retries >= 3) clearInterval(t); }, 1200);
})();
        `}
      </Script>

      {/* Viktig: Sett "checkout.stripe.com" som Unwanted referral i GA4 UI (Admin → Data Streams → Web → Tag settings) */}

      <Component {...pageProps} />
    </>
  );
}
