// src/app/layout.js
import "./globals.css";
import "./polish.css";
import Link from "next/link";
import Script from "next/script";
import MobileMenu from "../components/MobileMenu";
import {
  BRAND_MARK_SRC,
  DEFAULT_META_DESCRIPTION,
  OG_IMAGE_ALT,
  OG_IMAGE_SRC,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
  organizationJsonLd,
  websiteJsonLd,
} from "./seo";

export const metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },

  description: DEFAULT_META_DESCRIPTION,

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    type: "website",
    url: SITE_URL,
    title: SITE_TITLE,
    description: DEFAULT_META_DESCRIPTION,
    siteName: SITE_NAME,
    images: [
      {
        url: OG_IMAGE_SRC,
        width: 1200,
        height: 630,
        alt: OG_IMAGE_ALT,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: DEFAULT_META_DESCRIPTION,
    images: [OG_IMAGE_SRC],
  },

  icons: {
    icon: [
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-48x48.png", type: "image/png", sizes: "48x48" },
      { url: "/favicon-96x96.png", type: "image/png", sizes: "96x96" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

function BrandLockup({ className = "", footer = false }) {
  return (
    <Link href="/" className={["mm-brand-lockup", className].filter(Boolean).join(" ")} aria-label="MoodMap home">
      <span className="mm-brand-mark" aria-hidden="true">
        <img src={BRAND_MARK_SRC} alt="" width={footer ? 30 : 34} height={footer ? 30 : 34} />
      </span>
      <span>{SITE_NAME}</span>
    </Link>
  );
}

export default function RootLayout({ children }) {
  const PK_SITE_ID = "88e4dc38-2a9b-412b-905d-5b91bb454187"; // LIVE

  const orgJsonLd = organizationJsonLd();
  const siteJsonLd = websiteJsonLd();

  return (
    <html lang="en" className="h-full scroll-smooth" suppressHydrationWarning>
      <head>
        {/* JSON-LD: Organization / Website */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
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
          <header className="mm-site-header sticky top-0 z-40">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
              <BrandLockup />

              {/* Desktop nav */}
              <nav className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.045] p-1 text-sm font-medium text-white/68 shadow-2xl shadow-black/20 backdrop-blur-xl lg:flex">
                <Link href="/#product" className="mm-nav-link">
                  Product
                </Link>
                <Link href="/#how-it-works" className="mm-nav-link">
                  How it works
                </Link>
                <Link href="/intelligence" className="mm-nav-link">
                  Intelligence
                </Link>
                <Link href="/learn" className="mm-nav-link">
                  Guides
                </Link>
                <Link href="/pro" className="mm-nav-link mm-nav-link--strong">
                  Premium+
                </Link>
              </nav>

              <MobileMenu />
            </div>
          </header>

          <main className="flex-1">{children}</main>

          <footer className="mm-site-footer">
            <div className="mx-auto max-w-7xl px-6 py-10">
              <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                <div className="max-w-xl">
                  <BrandLockup footer />
                  <p className="mt-4 text-sm leading-relaxed text-white/58">
                    Built in Norway. Private by design. Cycle-aware relationship intelligence. Context for your response—not a verdict on her.
                  </p>
                </div>

                <div className="text-left md:text-right">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/68 md:justify-end">
                    <Link className="mm-link" href="/learn">
                      Guides
                    </Link>
                    <Link className="mm-link" href="/intelligence">
                      Intelligence
                    </Link>
                    <Link className="mm-link" href="/about">
                      About
                    </Link>
                    <Link className="mm-link" href="/support">
                      Support
                    </Link>
                    <Link className="mm-link" href="/pro">
                      Premium+
                    </Link>
                    <Link className="mm-link" href="/privacy-policy">
                      Privacy Policy
                    </Link>
                    <Link className="mm-link" href="/terms">
                      Terms
                    </Link>
                  </div>

                  <p className="mt-4 text-sm text-white/62">
                    Contact:{" "}
                    <a className="mm-link" href="mailto:support@moodmap-app.com">
                      support@moodmap-app.com
                    </a>
                  </p>

                  <p className="mt-5 text-xs text-white/40">
                    © 2026 {SITE_NAME}. All rights reserved.
                  </p>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
