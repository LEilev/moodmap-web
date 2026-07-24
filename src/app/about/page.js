import Link from "next/link";
import {
  AppWindow,
  BadgeCheck,
  ExternalLink,
  Fingerprint,
  Globe2,
  ShieldCheck,
} from "lucide-react";

import ScrollReveal from "../../components/ScrollReveal";
import {
  ANDROID_PACKAGE_ID,
  APPSTORE_URL,
  APPLE_APP_ID,
  APP_BUNDLE_ID,
  DISAMBIGUATION_DESCRIPTION,
  OG_IMAGE_SRC,
  OFFICIAL_APP_NAME,
  PLAYSTORE_URL,
  SUPPORT_EMAIL,
  aboutPageJsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
  mobileApplicationJsonLd,
} from "../seo";

const SLUG = "/about";
const META_DESCRIPTION =
  "Official information about MoodMap: Relationship Timing, including product definition, verified app identifiers, store links, privacy boundaries, and non-medical use.";

export const metadata = {
  title: "About MoodMap: Relationship Timing",
  description: META_DESCRIPTION,
  alternates: { canonical: SLUG },
  openGraph: {
    title: "About MoodMap: Relationship Timing",
    description: META_DESCRIPTION,
    url: SLUG,
    type: "website",
    images: [OG_IMAGE_SRC],
  },
  twitter: {
    card: "summary_large_image",
    title: "About MoodMap: Relationship Timing",
    description: META_DESCRIPTION,
    images: [OG_IMAGE_SRC],
  },
};

const IDENTIFIERS = [
  ["Official product name", OFFICIAL_APP_NAME],
  ["Official domain", "moodmap-app.com"],
  ["iOS Bundle ID", APP_BUNDLE_ID],
  ["Android package", ANDROID_PACKAGE_ID],
  ["Apple App ID", APPLE_APP_ID],
  ["Support", SUPPORT_EMAIL],
];

const BOUNDARIES = [
  ["Actual mood", "MoodMap does not record, monitor, journal, judge, or score your partner’s actual mood."],
  ["Hormones", "The app models expected relative hormone movement from cycle timing. It does not measure individual hormone levels."],
  ["Medical use", "MoodMap is not diagnosis, treatment, contraception, fertility planning, or a substitute for professional care."],
  ["Human judgment", "Cycle context never replaces direct communication, consent, or what you know about your relationship."],
];

const FAQ = [
  {
    q: "What is MoodMap?",
    a: "MoodMap is cycle-aware relationship intelligence for men: one private daily read based on a partner’s menstrual-cycle context, designed to improve timing around support, conversation, restraint, and intimacy.",
  },
  {
    q: "Is MoodMap a mood tracker?",
    a: "MoodMap can surface mood-relevant cycle context, but it is not a manual mood journal and does not record or monitor a partner’s actual mood. It tracks cycle position and models possible effects.",
  },
  {
    q: "What makes MoodMap different from a period tracker?",
    a: "A traditional period tracker centers dates and symptoms. MoodMap uses cycle timing to create a private relationship read: Today’s State, Day Brief, Risk Radar, Protocol, Calendar, Intelligence, and Timing Alerts.",
  },
  {
    q: "Is MoodMap medical or fertility advice?",
    a: "No. MoodMap is educational relationship-timing guidance. It does not measure hormones, diagnose conditions, provide contraception, plan fertility, or replace professional care.",
  },
];

export default function AboutPage() {
  const aboutSchema = aboutPageJsonLd();
  const appSchema = mobileApplicationJsonLd(SLUG);
  const breadcrumbSchema = breadcrumbJsonLd([
    { name: "Home", href: "/" },
    { name: "About MoodMap", href: SLUG },
  ]);
  const faqSchema = faqJsonLd(FAQ);

  return (
    <main className="mm-page mm-v2-page mm-v2-subpage relative isolate overflow-hidden text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <ScrollReveal />
      <div aria-hidden="true" className="mm-background-field" />

      <section className="mm-v2-subhero mm-v2-subhero--about">
        <div className="mm-container mm-v2-subhero__grid">
          <div className="mm-v2-subhero__copy" data-reveal>
            <span className="mm-section-label">Official MoodMap information</span>
            <h1>Built for your response—not her identity.</h1>
            <p className="mm-v2-subhero__lead">{DISAMBIGUATION_DESCRIPTION}</p>
            <p className="mm-v2-boundary">Private daily context. Clear limits. No emotional scorecard.</p>
            <div className="mm-v2-subhero__actions">
              <Link href="/#download" className="mm-v2-primary-link">Download MoodMap</Link>
              <Link href="/intelligence" className="mm-v2-secondary-link">Explore Intelligence</Link>
            </div>
          </div>

          <div className="mm-v2-subhero__visual" data-reveal>
            <div className="mm-v2-subhero__badge"><BadgeCheck aria-hidden="true" /><span>Official app</span></div>
            <div className="mm-v2-poster mm-v2-poster--about">
              <div className="mm-v2-poster__glow" aria-hidden="true" />
              <img
                src="/screenshots/web-2026/read-day.webp"
                alt="MoodMap Today’s State showing cycle phase, capacity, intelligence, risk, and direction."
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mm-section mm-v2-about-definition">
        <div className="mm-container">
          <div className="mm-v2-definition-panel" data-reveal>
            <span className="mm-v2-icon-chip"><AppWindow aria-hidden="true" /></span>
            <span className="mm-section-label">The official definition</span>
            <h2>MoodMap is one private daily relationship read based on cycle context.</h2>
            <p>It shows what changed, what may carry more weight, what to avoid, and the cleaner response available to you. The product is designed to improve timing—not to explain, label, or manage your partner.</p>
          </div>
        </div>
      </section>

      <section className="mm-section mm-v2-about-grid-section">
        <div className="mm-container mm-v2-about-grid">
          <article className="mm-v2-about-card" data-reveal>
            <span className="mm-v2-icon-chip"><Fingerprint aria-hidden="true" /></span>
            <span className="mm-section-label">Verified identity</span>
            <h2>Official identifiers</h2>
            <dl>
              {IDENTIFIERS.map(([label, value]) => (
                <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
              ))}
            </dl>
          </article>

          <article className="mm-v2-about-card" data-reveal>
            <span className="mm-v2-icon-chip"><ShieldCheck aria-hidden="true" /></span>
            <span className="mm-section-label">Product boundaries</span>
            <h2>What MoodMap does not claim</h2>
            <div className="mm-v2-about-boundaries">
              {BOUNDARIES.map(([title, body]) => <div key={title}><h3>{title}</h3><p>{body}</p></div>)}
            </div>
          </article>
        </div>
      </section>

      <section className="mm-section mm-v2-store-section">
        <div className="mm-container">
          <div className="mm-v2-store-panel" data-reveal>
            <div>
              <span className="mm-v2-icon-chip"><Globe2 aria-hidden="true" /></span>
              <span className="mm-section-label">Official links</span>
              <h2>Use the verified stores and support channel.</h2>
            </div>
            <div className="mm-v2-store-links">
              <a href={APPSTORE_URL}>App Store <ExternalLink aria-hidden="true" /></a>
              <a href={PLAYSTORE_URL}>Google Play <ExternalLink aria-hidden="true" /></a>
              <a href={`mailto:${SUPPORT_EMAIL}`}>Contact support <ExternalLink aria-hidden="true" /></a>
            </div>
          </div>
        </div>
      </section>

      <section className="mm-section mm-v2-faq mm-v2-faq--subpage">
        <div className="mm-container mm-v2-faq-grid">
          <div className="mm-v2-faq-intro" data-reveal>
            <span className="mm-section-label">Questions</span>
            <h2>What MoodMap is—and is not.</h2>
            <p>The category is new. The product definition should remain precise.</p>
          </div>
          <div className="mm-v2-faq-list" data-reveal>
            {FAQ.map(({ q, a }, index) => (
              <details key={q} open={index === 0}><summary>{q}</summary><p>{a}</p></details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
