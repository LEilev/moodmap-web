// FILE: src/app/layout.js
/*
PromoteKit helper (Option 2) with guard + priority + regex fallback.
- Prioritizes window.promotekit_referral (unique ID)
- Falls back to human slug from ?via/ref (ignores "default")
- Also parses via/ref from full href (handles bad '?type=...?...via=...' links)
- Never overwrites an existing client_reference_id
- Applies after a short delay with a few retries
*/

import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import MobileMenu from "../components/MobileMenu";

export const metadata = {
  title: "MoodMap",
  description:
    "Understand her cycle. Strengthen your bond. MoodMap provides daily, cycle-aware guidance with clarity and empathy.",
};

export default function RootLayout({ children }) {
  const PK_SITE_ID = "88e4dc38-2a9b-412b-905d-5b91bb454187"; // LIVE

  return (
    <html lang="en" className="h-full scroll-smooth" suppressHydrationWarning>
      <head>
        {/* PromoteKit (Option 2: Stripe Payment Links) */}
        <Script
          id="promotekit-loader"
          src="https://cdn.promotekit.com/promotekit.js"
          strategy="afterInteractive"
          data-promotekit={PK_SITE_ID}
        />

        {/* Helper: inject client_reference_id on Stripe links/embeds without overwriting existing values */}
        <Script id="promotekit-helper" strategy="afterInteractive">
          {`
(function () {
  if (window.__promotekitHelperInstalled) return;
  window.__promotekitHelperInstalled = true;

  function safeSearchParams() {
    try { return new URL(window.location.href).searchParams; } catch (_) { return null; }
  }

  function hrefParam(name) {
    try {
      var m = window.location.href.match(new RegExp('[?&]'+name+'=([^&#]+)','i'));
      return m ? decodeURIComponent(m[1]) : '';
    } catch (_) { return ''; }
  }

  function isValidSlug(s) {
    return /^[A-Za-z0-9_-]{1,32}$/.test(s || '');
  }

  // Prefer PromoteKit's unique ID; fallback to human slug (?via/ref), then from full href; ignore "default"
  function pickReferral() {
    try {
      if (window.promotekit_referral) return String(window.promotekit_referral);

      var via = '';
      var sp = safeSearchParams();
      if (sp) via = sp.get('via') || sp.get('ref') || '';
      if (!via) via = hrefParam('via') || hrefParam('ref');

      if (!via || via === 'default' || !isValidSlug(via)) return '';
      return via;
    } catch (_) { return ''; }
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
    // Stripe elements: only set if attribute not already present
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

  // Allow promotekit.js and embeds time to mount; retry a few times (never overwriting existing values)
  document.addEventListener("DOMContentLoaded", function () {
    setTimeout(applyRef, 1500);
  });

  var retries = 0;
  var t = setInterval(function () {
    retries++;
    applyRef();
    if (retries >= 3) clearInterval(t);
  }, 1200);
})();
          `}
        </Script>
      </head>

      <body className="flex flex-col min-h-full bg-primary-blue text-white">
        <header className="sticky top-0 z-50 bg-primary-blue/75 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-6xl mx-auto flex items-center justify-between py-4 px-6">
            <Link
              href="/"
              className="flex items-center text-2xl font-bold tracking-tight text-white/95 hover:text-white transition"
            >
              MoodMap
              <Image
                src="/icon.png"
                alt="MoodMap logo"
                width={28}
                height={28}
                className="ml-2"
                priority
              />
            </Link>

            <div className="flex items-center gap-3">
              {/* Desktop nav */}
              <nav className="hidden sm:flex gap-6 text-sm font-medium text-white/80">
                <Link href="/#about" className="hover:text-white transition">
                  About
                </Link>
                <Link href="/#download" className="hover:text-white transition">
                  Download
                </Link>
                <Link href="/support" className="hover:text-white transition">
                  Support
                </Link>
                <Link href="/pro" className="hover:text-white transition">
                  Pro
                </Link>
                {/* Partner intentionally removed from primary nav (premium positioning) */}
              </nav>

              {/* Mobile hamburger */}
              <MobileMenu />
            </div>
          </div>
        </header>

        <main className="flex-grow">{children}</main>
      </body>
    </html>
  );
}
