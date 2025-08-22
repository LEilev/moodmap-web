// FILE: pages/_app.js
// Loads PromoteKit and injects client_reference_id on Stripe links/embeds
// - Prioritizes window.promotekit_referral over via/ref
// - Does not overwrite an existing client_reference_id
// - Applies after a short delay with a few retries

import Script from "next/script";

export default function MyApp({ Component, pageProps }) {
  const PK_SITE_ID = "88e4dc38-2a9b-412b-905d-5b91bb454187"; // LIVE

  return (
    <>
      {/* PromoteKit (Option 2: Stripe Payment Links) */}
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
      // Prefer PromoteKit's unique ID
      if (window.promotekit_referral) return String(window.promotekit_referral);
      // Fallback: human slug (?via/ref), but avoid injecting "default"
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
        // Do not overwrite an existing client_reference_id
        if (!url.searchParams.has("client_reference_id")) {
          url.searchParams.set("client_reference_id", ref);
          link.setAttribute("href", url.toString());
        }
      } catch (_) {}
    });
  }

  function setClientRefOnEmbeds(ref) {
    if (!ref) return;
    // Stripe elements
    document.querySelectorAll("[pricing-table-id]").forEach(function (el) {
      if (!el.getAttribute("client-reference-id")) {
        el.setAttribute("client-reference-id", ref);
      }
    });
    document.querySelectorAll("[buy-button-id]").forEach(function (el) {
      if (!el.getAttribute("client-reference-id")) {
        el.setAttribute("client-reference-id", ref);
      }
    });
  }

  function applyRef() {
    var ref = pickReferral();
    if (!ref) return;
    addClientRefToBuyLinks(ref);
    setClientRefOnEmbeds(ref);
  }

  // Wait a moment so promotekit.js can populate window.promotekit_referral
  document.addEventListener("DOMContentLoaded", function () {
    setTimeout(applyRef, 1500);
  });

  // A couple of retries to catch slow renders; never overwrite existing values
  var retries = 0;
  var t = setInterval(function () {
    retries++;
    applyRef();
    if (retries >= 3) clearInterval(t);
  }, 1200);
})();
        `}
      </Script>

      <Component {...pageProps} />
    </>
  );
}
