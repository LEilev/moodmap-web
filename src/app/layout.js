// src/app/layout.js
import "./globals.css";
import "./polish.css";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import MobileMenu from "../components/MobileMenu";

const SITE_URL = "https://moodmap-app.com";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "MoodMap",
    template: "%s · MoodMap",
  },
  description:
    "Understand her cycle. Strengthen your bond. MoodMap delivers daily, phase-aware guidance — plus optional notification timing cues for PMS, ovulation, and the fertile window. Supports cycle lengths 21–35 days (menstruation 2–8 days).",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "MoodMap",
    description:
      "Daily, phase-aware guidance for better timing and deeper connection — plus optional notification timing cues for PMS, ovulation, and the fertile window. Supports 21–35 day cycles (2–8 day menstruation).",
    siteName: "MoodMap",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "MoodMap",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "MoodMap",
    description:
      "Daily, phase-aware guidance for partners — with optional notification timing cues for PMS, ovulation, and fertile-window timing. Supports 21–35 day cycles (2–8 day menstruation).",
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
    name: "MoodMap",
    url: SITE_URL,
    logo: `${SITE_URL}/icon.png`,
    email: "support@moodmap-app.com",
    availableLanguage: ["en", "no", "de", "fr", "it", "es", "pt-BR", "ja", "zh-Hans"],
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}#website`,
    url: SITE_URL,
    name: "MoodMap",
    publisher: { "@id": `${SITE_URL}#organization` },
    inLanguage: "en",
  };

  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "MobileApplication",
    name: "MoodMap",
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
    installUrl: [
      "https://apps.apple.com/app/moodmap-moodcoaster/id6746102626",
      "https://play.google.com/store/apps/details?id=com.eilev.moodmapnextgen",
    ],
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
                <Link className="mm-link" href="/support">
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

              <p className="mt-5 text-xs text-white/45">© 2025 MoodMap. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
