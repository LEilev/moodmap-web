// src/app/layout.js
import "./globals.css";
import "./polish.css";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import MobileMenu from "../components/MobileMenu";

const SITE_NAME = "MoodMap";

// Viktig: dere har både www og non-www live.
// Velg én canonical. Jeg setter non-www som canonical her (match med eksisterende kodebase).
const SITE_URL = "https://moodmap-app.com";

const SITE_TITLE = `${SITE_NAME} – Understand Her Cycle`;

const APPSTORE_URL = "https://apps.apple.com/app/moodmap-moodcoaster/id6746102626";
const PLAYSTORE_URL = "https://play.google.com/store/apps/details?id=com.eilev.moodmapnextgen";

const META_DESCRIPTION =
  "MoodMap delivers daily, phase-aware briefings for partners — so you can anticipate needs and time support and intimacy with clarity, not guesswork. Optional alerts for PMS, ovulation, and the fertile window. Supports cycle lengths 21–35 days (menstruation 2–8 days).";

export const metadata = {
  metadataBase: new URL(SITE_URL),

  // Canonical er spesielt viktig når både www og non-www er tilgjengelig
  alternates: {
    canonical: SITE_URL,
  },

  title: {
    // Homepage title-tag
    default: SITE_TITLE,

    // Undersider: "Guides | MoodMap" osv.
    template: `%s | ${SITE_NAME}`,
  },

  description: META_DESCRIPTION,

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    type: "website",
    url: SITE_URL,
    title: SITE_TITLE,
    description: META_DESCRIPTION,
    siteName: SITE_NAME,
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: SITE_NAME,
      },
    ],
  },

  twitter: {
    card: "summary",
    title: SITE_TITLE,
    description: META_DESCRIPTION,
    images: ["/icon.png"],
  },

  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({ children }) {
  const PK_SITE_ID = "88e4dc38-2a9b-412b-905d-5b91bb454187"; // LIVE

  // Structured Data (JSON-LD)
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/icon.png`,
    email: "support@moodmap-app.com",
    availableLanguage: ["en", "no", "de", "fr", "it", "es", "pt-BR", "ja", "zh-Hans"],
    sameAs: [APPSTORE_URL, PLAYSTORE_URL],
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}#website`,
    url: SITE_URL,
    name: SITE_NAME,
    publisher: { "@id": `${SITE_URL}#organization` },
    inLanguage: "en",
  };

  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "MobileApplication",
    name: SITE_NAME,
    operatingSystem: "iOS, Android",
    applicationCategory: "LifestyleApplication",
    publisher: { "@id": `${SITE_URL}#organization` },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    downloadUrl: `${SITE_URL}/#download`,
    installUrl: [APPSTORE_URL, PLAYSTORE_URL],
  };

  return (
    <html lang="en" className="h-full scroll-smooth" suppressHydrationWarning>
      <head>
        {/* JSON-LD: Organization / Website / App */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }}
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
          {/* Premium header (litt mer solid for å unngå glow “bleed”) */}
          <header className="sticky top-0 z-40 border-b border-white/10 bg-primary-blue/80 backdrop-blur-xl">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
              <Link
                href="/"
                className="flex items-center text-xl font-semibold tracking-tight"
              >
                {SITE_NAME}
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
                <Link href="/learn" className="hover:text-white transition-colors">
                  Guides
                </Link>
                <Link href="/support.html" className="hover:text-white transition-colors">
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

          {/* Global premium footer (one footer, everywhere) */}
          <footer className="border-t border-white/10 bg-primary-blue/70 backdrop-blur-sm">
            <div className="mx-auto max-w-7xl px-6 py-10 text-center">
              <p className="text-sm text-white/60">
                Built in Norway. Private by design. Informed by physiology and hormone research.
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-white/70">
                <Link className="mm-link" href="/learn">
                  Guides
                </Link>
                <span className="opacity-30">•</span>
                <Link className="mm-link" href="/support.html">
                  Support
                </Link>
                <span className="opacity-30">•</span>
                <Link className="mm-link" href="/pro">
                  Premium+
                </Link>
                <span className="opacity-30">•</span>
                <Link className="mm-link" href="/privacy-policy">
                  Privacy Policy
                </Link>
                <span className="opacity-30">•</span>
                <Link className="mm-link" href="/terms">
                  Terms
                </Link>
              </div>

              <p className="mt-4 text-sm text-white/70">
                Contact:{" "}
                <a className="mm-link" href="mailto:support@moodmap-app.com">
                  support@moodmap-app.com
                </a>
              </p>

              <p className="mt-5 text-xs text-white/45">© 2025 {SITE_NAME}. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
