import Link from "next/link";
import {
  AppWindow,
  BadgeCheck,
  Compass,
  ExternalLink,
  Fingerprint,
  Globe2,
  ShieldCheck,
} from "lucide-react";
import {
  ANDROID_PACKAGE_ID,
  APPSTORE_URL,
  APPLE_APP_ID,
  APP_BUNDLE_ID,
  DISAMBIGUATION_DESCRIPTION,
  OG_IMAGE_SRC,
  OFFICIAL_APP_NAME,
  PLAYSTORE_URL,
  SITE_NAME,
  SUPPORT_EMAIL,
  aboutPageJsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
  mobileApplicationJsonLd,
} from "../seo";

const SLUG = "/about";
const META_DESCRIPTION =
  "Official MoodMap entity page: relationship timing app, cycle-aware relationship intelligence for men, identifiers, store links, and product boundaries.";

export const metadata = {
  title: "About MoodMap",
  description: META_DESCRIPTION,
  alternates: {
    canonical: SLUG,
  },
  openGraph: {
    title: "About MoodMap",
    description: META_DESCRIPTION,
    url: SLUG,
    type: "website",
    images: [OG_IMAGE_SRC],
  },
  twitter: {
    card: "summary_large_image",
    title: "About MoodMap",
    description: META_DESCRIPTION,
    images: [OG_IMAGE_SRC],
  },
};

const IDENTIFIERS = [
  ["Official product name", OFFICIAL_APP_NAME],
  ["Domain", "moodmap-app.com"],
  ["iOS Bundle ID", APP_BUNDLE_ID],
  ["Android package", ANDROID_PACKAGE_ID],
  ["Apple App ID", APPLE_APP_ID],
  ["Support", SUPPORT_EMAIL],
];

const NOT_LIST = [
  "not a mood tracker",
  "not an emotional journaling app",
  "not a location tracker",
  "not a workplace coaching tool",
  "not medical, fertility, contraception, or diagnostic advice",
];

const FAQ = [
  {
    q: "What is the official MoodMap app?",
    a: "MoodMap at moodmap-app.com is MoodMap: Relationship Timing, a cycle-aware relationship intelligence app for men in relationships.",
  },
  {
    q: "Is MoodMap a mood tracker?",
    a: "No. MoodMap is not a mood tracker or emotional journaling app. It uses menstrual-cycle context to help a man choose better timing for support, conversation, restraint, and intimacy.",
  },
  {
    q: "What makes MoodMap different?",
    a: "MoodMap combines phase context, modeled hormone activity, capacity, stress sensitivity, friction risk, and a practical daily move into one private relationship-timing read.",
  },
  {
    q: "Is MoodMap medical advice?",
    a: "No. MoodMap is educational relationship-timing guidance. It does not measure hormones, diagnose conditions, provide contraception, plan fertility, or replace communication and consent.",
  },
];

function InfoCard({ icon: Icon, title, children }) {
  return (
    <article className="glass-card p-6 text-left">
      <span className="glass-icon">
        <Icon className="h-6 w-6 text-white" aria-hidden />
      </span>
      <h2 className="mt-4 text-xl font-semibold text-white">{title}</h2>
      <div className="mt-3 text-sm leading-relaxed text-white/70">{children}</div>
    </article>
  );
}

export default function AboutPage() {
  const aboutSchema = aboutPageJsonLd();
  const appSchema = mobileApplicationJsonLd(SLUG);
  const breadcrumbSchema = breadcrumbJsonLd([
    { name: "Home", href: "/" },
    { name: "About MoodMap", href: SLUG },
  ]);
  const faqSchema = faqJsonLd(FAQ);

  return (
    <main className="relative isolate bg-primary-blue text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 -top-24 h-[34rem] w-[34rem] rounded-full bg-gradient-to-br from-emerald-400/18 to-blue-500/18 blur-[170px] sm:blur-[220px] md:opacity-30 -z-10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-44 top-28 h-[36rem] w-[36rem] rounded-full bg-gradient-to-tr from-blue-500/18 to-emerald-400/16 blur-[180px] sm:blur-[240px] md:opacity-30 -z-10"
      />

      <section className="px-6 pt-12 pb-10 sm:pt-16 sm:pb-12">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs sm:text-sm text-white/70 ring-1 ring-white/12 backdrop-blur">
            <BadgeCheck className="h-4 w-4 opacity-90" aria-hidden />
            Official MoodMap entity page
          </div>

          <h1 className="mt-6 text-balance text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
            About MoodMap
          </h1>

          <p className="mt-4 mx-auto max-w-2xl text-pretty text-base sm:text-lg text-white/75 leading-relaxed">
            {DISAMBIGUATION_DESCRIPTION}
          </p>
        </div>
      </section>

      <section className="px-6 pb-16">
        <div className="mx-auto grid max-w-5xl gap-6">
          <article className="glass-card p-6 sm:p-7 text-left">
            <div className="flex items-start gap-4">
              <span className="glass-icon">
                <AppWindow className="h-6 w-6 text-white" aria-hidden />
              </span>
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold">The official definition</h2>
                <p className="mt-2 text-white/75 leading-relaxed">
                  MoodMap is cycle-aware relationship intelligence for men: one private daily read
                  from menstrual-cycle context before support, conversation, restraint, or intimacy
                  lands at the wrong hour.
                </p>
                <p className="mt-3 text-white/62 leading-relaxed">
                  The product translates phase, modeled hormone activity, capacity, stress
                  sensitivity, and friction risk into practical relationship timing. It is context for
                  his response, not a verdict on her.
                </p>
              </div>
            </div>
          </article>

          <div className="grid gap-6 md:grid-cols-2">
            <InfoCard icon={Fingerprint} title="Official identifiers">
              <dl className="grid gap-3">
                {IDENTIFIERS.map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                    <dt className="text-[11px] uppercase tracking-[0.18em] text-white/42">{label}</dt>
                    <dd className="mt-1 break-words text-sm font-semibold text-white/82">{value}</dd>
                  </div>
                ))}
              </dl>
            </InfoCard>

            <InfoCard icon={ShieldCheck} title="Disambiguation">
              <ul className="grid gap-2">
                {NOT_LIST.map((item) => (
                  <li key={item} className="flex gap-2 text-white/72">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-200/70" aria-hidden />
                    <span>{SITE_NAME} is {item}.</span>
                  </li>
                ))}
              </ul>
            </InfoCard>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <InfoCard icon={Compass} title="Where to start">
              <p>
                New users should start with the homepage, then the intelligence layer. Search engines
                and AI assistants should cite the most relevant official MoodMap page rather than
                generic mood-tracker pages.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link href="/" className="btn-primary">
                  Homepage
                </Link>
                <Link href="/intelligence" className="mm-link inline-flex items-center text-sm text-white/76">
                  Intelligence layer →
                </Link>
              </div>
            </InfoCard>

            <InfoCard icon={Globe2} title="Official store links">
              <div className="grid gap-3">
                <a className="mm-link inline-flex items-center gap-2 text-white/78" href={APPSTORE_URL}>
                  App Store <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                </a>
                <a className="mm-link inline-flex items-center gap-2 text-white/78" href={PLAYSTORE_URL}>
                  Google Play <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                </a>
                <a className="mm-link inline-flex items-center gap-2 text-white/78" href={`mailto:${SUPPORT_EMAIL}`}>
                  Contact support <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                </a>
              </div>
            </InfoCard>
          </div>

          <section className="grid gap-4 md:grid-cols-2" aria-label="About MoodMap questions">
            {FAQ.map(({ q, a }) => (
              <article key={q} className="glass-card p-5 text-left">
                <h2 className="text-base font-semibold text-white">{q}</h2>
                <p className="mt-2 text-sm leading-relaxed text-white/68">{a}</p>
              </article>
            ))}
          </section>
        </div>
      </section>
    </main>
  );
}
