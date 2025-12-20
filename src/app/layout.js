import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import MobileMenu from "../components/MobileMenu";

export const metadata = {
  title: "MoodMap",
  description:
    "Understand her cycle. Strengthen your bond. MoodMap is daily, cycle-aware guidance for timing support, space, and intimacy — without guesswork.",
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

      <body className="min-h-full bg-primary-blue text-white">
        <div className="flex min-h-full flex-col">
          {/* Premium header (litt mer solid for å unngå glow “bleed”) */}
          <header className="sticky top-0 z-40 border-b border-white/10 bg-primary-blue/80 backdrop-blur-xl">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
              <Link
                href="/"
                className="flex items-center text-xl font-semibold tracking-tight"
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

              {/* Desktop nav */}
              <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-white/70">
                <Link href="/#about" className="hover:text-white transition-colors">
                  About
                </Link>
                <Link href="/#download" className="hover:text-white transition-colors">
                  Download
                </Link>
                <Link href="/support" className="hover:text-white transition-colors">
                  Support
                </Link>
                <Link href="/pro" className="hover:text-white transition-colors">
                  Premium+
                </Link>
              </nav>

              {/* Mobile hamburger */}
              <MobileMenu />
            </div>
          </header>

          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
