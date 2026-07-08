export const SITE_NAME = "MoodMap";
export const SITE_URL = "https://moodmap-app.com";
export const SITE_TITLE = `${SITE_NAME} — Cycle-Aware Relationship Intelligence`;
export const BRAND_MARK_SRC = "/brand/moodmap-mark.png";
export const OG_IMAGE_SRC = "/og/moodmap-og.jpg";
export const OG_IMAGE_ALT =
  "MoodMap — cycle-aware relationship intelligence for men. One private daily read from her cycle.";
export const UPDATED_ISO = "2026-07-08";
export const UPDATED_DISPLAY = "July 8, 2026";

export const OFFICIAL_APP_NAME = "MoodMap: Relationship Timing";
export const APPLE_APP_ID = "6746102626";
export const APP_BUNDLE_ID = "com.eilev.moodmapnextgen";
export const ANDROID_PACKAGE_ID = "com.eilev.moodmapnextgen";
export const SUPPORT_EMAIL = "support@moodmap-app.com";
export const DISAMBIGUATION_DESCRIPTION =
  "MoodMap at moodmap-app.com is a cycle-aware relationship intelligence app for men, not a mood tracker, location tracker, emotional journaling app, or workplace coaching tool.";
export const ENTITY_ALTERNATE_NAMES = [
  "MoodMap: Relationship Timing",
  "MoodMap Relationship Timing",
  "MoodMap menstrual cycle read for men",
  "MoodMap cycle-aware relationship intelligence",
  "MoodMap relationship timing for men",
];

export const APPSTORE_URL = "https://apps.apple.com/app/id6746102626";
export const PLAYSTORE_URL =
  `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE_ID}`;

export const DEFAULT_META_DESCRIPTION =
  "MoodMap is cycle-aware relationship intelligence for men: one private daily read from menstrual-cycle context, capacity, stress sensitivity, and timing.";

export const SOURCE_LINKS = [
  {
    label: "ACOG — Your Menstrual Cycle",
    href: "https://www.acog.org/womens-health/faqs/your-menstrual-cycle",
  },
  {
    label: "NHS — Periods and fertility in the menstrual cycle",
    href: "https://www.nhs.uk/conditions/periods/fertility-in-the-menstrual-cycle/",
  },
  {
    label: "Office on Women’s Health — Premenstrual syndrome",
    href: "https://womenshealth.gov/menstrual-cycle/premenstrual-syndrome",
  },
  {
    label: "Cleveland Clinic — Premenstrual syndrome",
    href: "https://my.clevelandclinic.org/health/diseases/24288-pms-premenstrual-syndrome",
  },
];

export function absoluteUrl(path = "/") {
  if (!path) return SITE_URL;
  if (/^https?:\/\//i.test(path)) return path;
  if (path === "/") return `${SITE_URL}/`;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}#organization`,
    name: SITE_NAME,
    alternateName: ENTITY_ALTERNATE_NAMES,
    disambiguatingDescription: DISAMBIGUATION_DESCRIPTION,
    url: SITE_URL,
    logo: absoluteUrl(BRAND_MARK_SRC),
    email: SUPPORT_EMAIL,
    availableLanguage: ["en"],
    areaServed: "Worldwide",
    knowsAbout: [
      "Cycle-aware relationship intelligence",
      "Relationship timing",
      "Menstrual cycle context",
      "PMS support for partners",
      "Hormone Graph Intelligence",
      "Capacity and stress sensitivity",
    ],
    sameAs: [APPSTORE_URL, PLAYSTORE_URL],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}#website`,
    url: SITE_URL,
    name: SITE_NAME,
    publisher: { "@id": `${SITE_URL}#organization` },
    inLanguage: "en",
  };
}

export function mobileApplicationJsonLd(path = "/") {
  return {
    "@context": "https://schema.org",
    "@type": "MobileApplication",
    "@id": `${SITE_URL}#mobile-application`,
    name: SITE_NAME,
    alternateName: ENTITY_ALTERNATE_NAMES,
    disambiguatingDescription: DISAMBIGUATION_DESCRIPTION,
    url: absoluteUrl(path),
    description: DEFAULT_META_DESCRIPTION,
    operatingSystem: "iOS, Android",
    applicationCategory: "LifestyleApplication",
    applicationSubCategory: "Cycle-aware relationship intelligence",
    inLanguage: "en",
    audience: {
      "@type": "Audience",
      audienceType: "Men in relationships",
    },
    identifier: [
      {
        "@type": "PropertyValue",
        propertyID: "iOS Bundle ID",
        value: APP_BUNDLE_ID,
      },
      {
        "@type": "PropertyValue",
        propertyID: "Android Package",
        value: ANDROID_PACKAGE_ID,
      },
      {
        "@type": "PropertyValue",
        propertyID: "Apple App ID",
        value: APPLE_APP_ID,
      },
    ],
    featureList: [
      "Cycle-aware relationship intelligence",
      "Hormone Graph Intelligence",
      "Modeled hormone activity context",
      "Capacity and stress sensitivity signals",
      "Daily Briefing",
      "Room Read / SitRep",
      "Friction Risk / Risk Radar",
      "Move + Reason / CommandDeck",
      "Menstrual cycle relationship timing",
      "PMS timing awareness",
      "Luteal load context",
      "Intimacy timing context",
      "Discreet Mode",
      "Phase Alerts",
    ],
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    publisher: { "@id": `${SITE_URL}#organization` },
    downloadUrl: absoluteUrl("/#download"),
    installUrl: [APPSTORE_URL, PLAYSTORE_URL],
    sameAs: [APPSTORE_URL, PLAYSTORE_URL],
  };
}

export function articleJsonLd({
  path,
  headline,
  description,
  datePublished = UPDATED_ISO,
  dateModified = UPDATED_ISO,
}) {
  const url = absoluteUrl(path);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    inLanguage: "en",
    datePublished,
    dateModified,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    url,
    image: absoluteUrl(OG_IMAGE_SRC),
    author: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl(BRAND_MARK_SRC),
      },
    },
    isAccessibleForFree: true,
  };
}

export function breadcrumbJsonLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map(({ name, href }, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name,
      item: absoluteUrl(href),
    })),
  };
}

export function faqJsonLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

export function definedTermSetJsonLd({ path, name, description, terms }) {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "@id": `${absoluteUrl(path)}#defined-term-set`,
    name,
    description,
    url: absoluteUrl(path),
    inLanguage: "en",
    publisher: { "@id": `${SITE_URL}#organization` },
    hasDefinedTerm: terms.map((term) => ({
      "@type": "DefinedTerm",
      name: term.name,
      description: term.definition,
      termCode: term.slug,
      inDefinedTermSet: `${absoluteUrl(path)}#defined-term-set`,
      url: `${absoluteUrl(path)}#${term.slug}`,
    })),
  };
}

export function aboutPageJsonLd() {
  const path = "/about";
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${absoluteUrl(path)}#about-page`,
    name: "About MoodMap: Official Relationship Timing App",
    description: DISAMBIGUATION_DESCRIPTION,
    url: absoluteUrl(path),
    inLanguage: "en",
    isPartOf: { "@id": `${SITE_URL}#website` },
    publisher: { "@id": `${SITE_URL}#organization` },
    about: { "@id": `${SITE_URL}#mobile-application` },
    mainEntity: {
      "@type": "MobileApplication",
      "@id": `${SITE_URL}#mobile-application`,
      name: SITE_NAME,
      alternateName: ENTITY_ALTERNATE_NAMES,
      disambiguatingDescription: DISAMBIGUATION_DESCRIPTION,
      operatingSystem: "iOS, Android",
      applicationCategory: "LifestyleApplication",
      applicationSubCategory: "Cycle-aware relationship intelligence",
      identifier: [
        { "@type": "PropertyValue", propertyID: "iOS Bundle ID", value: APP_BUNDLE_ID },
        { "@type": "PropertyValue", propertyID: "Android Package", value: ANDROID_PACKAGE_ID },
        { "@type": "PropertyValue", propertyID: "Apple App ID", value: APPLE_APP_ID },
      ],
      url: SITE_URL,
      sameAs: [APPSTORE_URL, PLAYSTORE_URL],
    },
  };
}

export function SourceTrustBlock() {
  return (
    <section className="mt-2">
      <div className="glass-card p-6 sm:p-7 text-left">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
          Updated: {UPDATED_DISPLAY} · Reviewed for product accuracy by MoodMap
        </p>
        <h2 className="mt-3 text-lg sm:text-xl font-semibold text-white">
          Sources and boundaries
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-white/65">
          MoodMap keeps the product guidance non-medical. These references anchor the basic cycle
          education; the app translates that context into relationship timing, not diagnosis,
          contraception, fertility planning, or hormone measurement.
        </p>
        <ul className="mt-4 grid gap-2 text-sm text-white/70 leading-relaxed list-disc pl-5">
          {SOURCE_LINKS.map(({ label, href }) => (
            <li key={href}>
              <a className="mm-link" href={href} target="_blank" rel="noopener noreferrer">
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
