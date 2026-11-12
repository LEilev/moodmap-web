// src/app/layout.js
import "./globals.css";
import Link from "next/link";
import { getImageProps } from "next/image";
import AppSiteClient from "../components/AppSiteClient";
import { PrivacyPreferencesButton } from "../components/SitePrivacy";
import MobileMenu from "../components/MobileMenu";
import chrome from "../components/SiteChrome.module.css";
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

// Generate responsive URLs on the server; the menu receives plain image attrs.
const { props: brandMarkProps } = getImageProps({
  src: BRAND_MARK_SRC,
  alt: "",
  width: 44,
  height: 44,
});

function BrandLockup({ className = "", footer = false }) {
  return (
    <Link href="/" className={["mm-brand-lockup", chrome.brand, className].filter(Boolean).join(" ")} aria-label="MoodMap home">
      <span className="mm-brand-mark" aria-hidden="true">
        <img {...brandMarkProps} alt="" loading={footer ? "lazy" : "eager"} />
      </span>
      <span>{SITE_NAME}</span>
    </Link>
  );
}

export default function RootLayout({ children }) {
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
      </head>

      <body className="min-h-full bg-primary-blue text-white">
        <div id="site-shell" className="flex min-h-full flex-col">
          <AppSiteClient />
          <a href="#main-content" className="mm-skip-link">Skip to content</a>
          <header className={`mm-site-header sticky top-0 z-40 ${chrome.header}`}>
            <div className={chrome.headerInner}>
              <BrandLockup />

              <nav aria-label="Primary navigation" className={chrome.navigation}>
                <Link href="/#how-it-works" className={`mm-nav-link ${chrome.navLink}`}>
                  How it works
                </Link>
                <Link href="/learn" className={`mm-nav-link ${chrome.navLink}`}>
                  Guides
                </Link>
                <Link href="/pro" className={`mm-nav-link ${chrome.navLink}`}>
                  Premium+
                </Link>
                <Link href="/#download" className={chrome.downloadLink}>
                  Get the app <span aria-hidden="true">↓</span>
                </Link>
              </nav>

              <MobileMenu brandMarkProps={brandMarkProps} className={chrome.menuShell} />
            </div>
          </header>

          <div id="main-content" tabIndex={-1} className="flex-1">{children}</div>

          <footer className={`mm-site-footer ${chrome.footer}`}>
            <div className={chrome.footerInner}>
              <div className={chrome.footerTop}>
                <div className={chrome.footerIdentity}>
                  <BrandLockup footer />
                  <p>Built in Norway. Made for better connection.</p>
                </div>

                <div className={chrome.footerExplore}>
                  <nav className={chrome.footerNav} aria-label="Footer navigation">
                    <Link className="mm-link" href="/about">About</Link>
                    <Link className="mm-link" href="/learn">Guides</Link>
                    <Link className="mm-link" href="/intelligence">The model</Link>
                    <Link className="mm-link" href="/support">Support</Link>
                    <Link className="mm-link" href="/pro">Premium+</Link>
                  </nav>
                  <p className={chrome.contact}>
                    <a className="mm-link" href="mailto:support@moodmap-app.com">
                      support@moodmap-app.com
                    </a>
                  </p>
                </div>
              </div>
              <div className={chrome.footerBottom}>
                <p>© 2026 {SITE_NAME}</p>
                <div className={chrome.legal}>
                  <Link className="mm-link" href="/privacy-policy">Privacy Policy</Link>
                  <Link className="mm-link" href="/terms">Terms</Link>
                  <PrivacyPreferencesButton />
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
