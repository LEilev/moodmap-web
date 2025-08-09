// pages/_app.js
import Script from "next/script";

export default function MyApp({ Component, pageProps }) {
  const PK_SITE_ID = "88e4dc38-2a9b-412b-905d-5b91bb454187"; // same as in app/layout.js (LIVE)

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

  function findReferral() {
    try {
      if (window.promotekit_referral) return String(window.promotekit_referral);
      const u = new URL(window.location.href);
      return u.searchParams.get("via") || u.searchParams.get("ref") || "";
    } catch (_) { return ""; }
  }

  function addClientRefToBuyLinks(ref) {
    if (!ref) return;
    document.querySelectorAll('a[href^="https://buy.stripe.com/"]').forEach(function (link) {
      try {
        const url = new URL(link.getAttribute("href"));
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
      el.setAttribute("client-reference-id", ref);
    });
    document.querySelectorAll("[buy-button-id]").forEach(function (el) {
      el.setAttribute("client-reference-id", ref);
    });
  }

  function applyRef() {
    var ref = findReferral();
    if (!ref) return;
    addClientRefToBuyLinks(ref);
    setClientRefOnEmbeds(ref);
  }

  document.addEventListener("DOMContentLoaded", function () {
    setTimeout(applyRef, 1200);
  });

  var retries = 0;
  var t = setInterval(function () {
    retries++;
    applyRef();
    if (retries >= 3) clearInterval(t);
  }, 2000);
})();
        `}
      </Script>

      <Component {...pageProps} />
    </>
  );
}
