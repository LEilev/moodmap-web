// src/app/learn/page.js
import Link from "next/link";
import {
  CalendarDays,
  Shield,
  Sparkles,
  Map,
  HeartHandshake,
  Layers,
} from "lucide-react";

export const metadata = {
  title: "Guides",
  description:
    "Short, high-signal guides for men and partners: respectful cycle tracking, why MoodMap is different, PMS support, cycle phases, and fertile-window context. Relationship guidance, not medical advice.",
  alternates: {
    canonical: "/learn",
  },
};

const SITE_URL = "https://moodmap-app.com";

const GUIDES = [
  {
    href: "/learn/period-tracking-for-men",
    title: "Period tracking for men",
    description:
      "A respectful, practical guide: what to track, how to ask, and how to use timing as context (not control).",
    Icon: CalendarDays,
  },
  {
    href: "/learn/why-moodmap",
    title: "Why MoodMap",
    description:
      "MoodMap covers cycle-tracking basics — and adds a partner layer of daily context and practical guidance for men.",
    Icon: Layers,
  },
  {
    href: "/learn/support-partner-during-pms",
    title: "How to support your partner during PMS",
    description:
      "Timing-aware support without walking on eggshells. What helps, what hurts, and what to say.",
    Icon: HeartHandshake,
  },
  {
    href: "/learn/menstrual-cycle-phases-for-partners",
    title: "Menstrual cycle phases explained for partners",
    description:
      "A clear overview of cycle phases — what changes, why timing matters, and how to show up well.",
    Icon: Map,
  },
  {
    href: "/learn/fertile-window-explained",
    title: "Fertile window explained for partners",
    description:
      "A calm explanation of the fertile window and why it can matter for relationship timing.",
    Icon: Sparkles,
  },
];

export default function LearnIndexPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: GUIDES.map((g, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: g.title,
      url: `${SITE_URL}${g.href}`,
    })),
  };

  return (
    <main className="relative isolate bg-primary-blue text-white">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Subtle premium glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 -top-24 h-[34rem] w-[34rem] rounded-full bg-gradient-to-br from-emerald-400/18 to-blue-500/18 blur-[170px] sm:blur-[220px] md:opacity-30 -z-10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-44 top-28 h-[36rem] w-[36rem] rounded-full bg-gradient-to-tr from-blue-500/18 to-emerald-400/16 blur-[180px] sm:blur-[240px] md:opacity-30 -z-10"
      />

      {/* Hero */}
      <section className="px-6 pt-12 pb-10 sm:pt-16 sm:pb-12">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs sm:text-sm text-white/70 ring-1 ring-white/12 backdrop-blur">
            <Shield className="h-4 w-4 opacity-90" aria-hidden />
            Relationship guidance — not medical advice
          </div>

          <h1 className="mt-5 text-balance text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
            MoodMap Guides
          </h1>
          <p className="mt-4 mx-auto max-w-2xl text-pretty text-base sm:text-lg text-white/75 leading-relaxed">
            Short, partner-friendly explanations and practical playbooks — designed for men who want
            better timing, calmer communication, and more trust.
          </p>
        </div>
      </section>

      {/* Guide list */}
      <section className="px-6 pb-14 sm:pb-16">
        <div className="mx-auto max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {GUIDES.map(({ href, title, description, Icon }) => (
            <article key={href} className="glass-card glass-card-hover p-6 text-left group">
              <span className="glass-icon">
                <Icon className="h-6 w-6 text-white drop-shadow" aria-hidden />
              </span>
              <h2 className="mt-3 text-base sm:text-lg font-semibold">{title}</h2>
              <p className="mt-2 text-sm sm:text-[15px] text-white/70 leading-relaxed">
                {description}
              </p>

              <div className="mt-4">
                <Link href={href} className="mm-link text-sm text-white/80">
                  Read guide →
                </Link>
              </div>

              <div aria-hidden="true" className="glass-gloss" />
            </article>
          ))}
        </div>

        {/* Bottom nav */}
        <div className="mt-10 text-center">
          <Link href="/" className="btn-primary">
            ← Back to Home
          </Link>
        </div>
      </section>
    </main>
  );
}
