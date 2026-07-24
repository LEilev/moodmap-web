import Link from "next/link";
import { BookOpen, Brain, Compass, Layers3, Shield, Sparkles } from "lucide-react";
import {
  OG_IMAGE_SRC,
  SourceTrustBlock,
  articleJsonLd,
  breadcrumbJsonLd,
  definedTermSetJsonLd,
  faqJsonLd,
} from "../../seo";

const SLUG = "/learn/moodmap-glossary";
const META_DESCRIPTION =
  "Definitions for MoodMap terms including Today’s State, Day Brief, Cycle Calendar, Risk Radar, Protocol, WHY, Cycle Intelligence, capacity, Timing Alerts, and Premium+.";

export const metadata = {
  title: "MoodMap Glossary: Product Terms and Relationship Timing",
  description: META_DESCRIPTION,
  alternates: { canonical: SLUG },
  openGraph: {
    title: "MoodMap Glossary: Product Terms and Relationship Timing",
    description: META_DESCRIPTION,
    url: SLUG,
    type: "article",
    images: [OG_IMAGE_SRC],
  },
  twitter: {
    card: "summary_large_image",
    title: "MoodMap Glossary: Product Terms and Relationship Timing",
    description: META_DESCRIPTION,
    images: [OG_IMAGE_SRC],
  },
};

const TERMS = [
  {
    slug: "moodmap",
    name: "MoodMap",
    short: "One private daily relationship read based on cycle context.",
    definition:
      "MoodMap is a cycle-aware relationship timing app for men. It turns menstrual-cycle context into practical guidance around support, conversation, restraint, and intimacy.",
  },
  {
    slug: "cycle-aware-relationship-intelligence",
    name: "Cycle-aware relationship intelligence",
    short: "The category MoodMap is built around.",
    definition:
      "Cycle-aware relationship intelligence uses cycle position, modeled biological context, capacity, risk, and timing to help a person make more informed relationship decisions without claiming certainty about a partner.",
  },
  {
    slug: "todays-state",
    name: "Today’s State",
    short: "The day-level headline and operating context.",
    definition:
      "Today’s State is the main MoodMap view: cycle day, phase, cycle-based capacity, hormone context, risk, direction, and a concise Daily Brief entry point.",
  },
  {
    slug: "day-brief",
    name: "Day Brief",
    short: "The full practical synthesis for the day.",
    definition:
      "Day Brief integrates Current Picture, Best Approach, What Can Go Well, and Set It Up so the user can move from context to action without opening several disconnected modules.",
  },
  {
    slug: "cycle-calendar",
    name: "Cycle Calendar",
    short: "The full cycle, readable day by day.",
    definition:
      "Cycle Calendar shows period days, fertile-window estimates, estimated ovulation timing, phase progression, cycle signals, capacity, and the daily read for any selected date.",
  },
  {
    slug: "risk-radar",
    name: "Risk Radar",
    short: "Tripwire, signal, misread, and countermove.",
    definition:
      "Risk Radar identifies a likely tripwire, what the user may notice, the interpretation most likely to make it worse, the cleaner countermove, and why the situation can escalate.",
  },
  {
    slug: "protocol",
    name: "Protocol",
    short: "PLAN, READ, BOND, and SELF guidance.",
    definition:
      "Protocol turns the day’s context into practical moves across planning, reading signals, connection, and self-regulation. Each lane has a distinct job rather than repeating the same advice in four forms.",
  },
  {
    slug: "why-layer",
    name: "WHY",
    short: "The reasoning behind a Protocol move.",
    definition:
      "The WHY layer explains why a move fits, what signal to look for, how to use the guidance, what friction it may prevent, and what a well-handled outcome can look like.",
  },
  {
    slug: "cycle-intelligence",
    name: "Cycle Intelligence",
    short: "Modeled biology translated into possible effects.",
    definition:
      "Cycle Intelligence models expected relative hormone movement from cycle timing, then separates Today’s Shift, Biology, and possible effects on energy, sensitivity, recovery demand, connection, and pace. It is not individual hormone measurement.",
  },
  {
    slug: "cycle-signal",
    name: "Cycle Signal",
    short: "A compact description of where the cycle is moving.",
    definition:
      "Cycle Signal summarizes the current part of the phase progression in practical language, such as rising momentum, a steadier plateau, rain starting, or a heavier late-cycle window.",
  },
  {
    slug: "capacity",
    name: "Capacity",
    short: "A practical estimate of how much the day may absorb.",
    definition:
      "Capacity is MoodMap’s cycle-based estimate of bandwidth for complexity, pressure, recovery demand, noise, and emotional or logistical load. It is contextual, not a measurement of a person’s worth or competence.",
  },
  {
    slug: "timing-alerts",
    name: "Timing Alerts",
    short: "Optional heads-ups before important windows and reads.",
    definition:
      "Timing Alerts can surface the Daily Brief, cycle-window changes, and Risk Radar guidance around a preferred time, with delivery rules and quiet-hour controls.",
  },
  {
    slug: "premium-plus",
    name: "Premium+",
    short: "The complete MoodMap system.",
    definition:
      "Premium+ unlocks the full Day Brief, complete Protocol, deeper WHY explanations, full Cycle Calendar, Cycle Intelligence, Risk Radar, Timing Alerts, and expanded preferences.",
  },
];

const FAQ = [
  {
    q: "Is MoodMap a period tracker?",
    a: "MoodMap includes cycle tracking and a full calendar, but its primary job is relationship timing: translating cycle context into a daily read for support, conversation, restraint, and intimacy.",
  },
  {
    q: "Is MoodMap a mood tracker?",
    a: "MoodMap can show mood-relevant cycle context, but it does not record or monitor a partner’s actual mood. It tracks cycle position and models possible effects rather than creating a personal mood journal.",
  },
  {
    q: "What is the main product category?",
    a: "The clearest category is cycle-aware relationship intelligence: menstrual-cycle context translated into practical relationship timing for men.",
  },
  {
    q: "Does MoodMap judge or score a partner?",
    a: "No. MoodMap guides the user’s own timing and response. It is not a verdict on a partner’s mood, intent, identity, or worth.",
  },
];

export default function MoodMapGlossaryPage() {
  const articleSchema = articleJsonLd({
    path: SLUG,
    headline: "MoodMap Glossary: Product Terms and Relationship Timing",
    description: META_DESCRIPTION,
  });
  const breadcrumbSchema = breadcrumbJsonLd([
    { name: "Home", href: "/" },
    { name: "Learn", href: "/learn" },
    { name: "MoodMap glossary", href: SLUG },
  ]);
  const definedTermSchema = definedTermSetJsonLd({
    path: SLUG,
    name: "MoodMap glossary",
    description: META_DESCRIPTION,
    terms: TERMS,
  });
  const faqSchema = faqJsonLd(FAQ);

  return (
    <main className="relative isolate bg-primary-blue text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div aria-hidden="true" className="pointer-events-none absolute -left-40 -top-24 h-[34rem] w-[34rem] rounded-full bg-gradient-to-br from-emerald-400/18 to-blue-500/18 blur-[170px] sm:blur-[220px] md:opacity-30 -z-10" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-44 top-28 h-[36rem] w-[36rem] rounded-full bg-gradient-to-tr from-blue-500/18 to-emerald-400/16 blur-[180px] sm:blur-[240px] md:opacity-30 -z-10" />

      <section className="px-6 pt-12 pb-10 sm:pt-16 sm:pb-12">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs sm:text-sm text-white/70 ring-1 ring-white/12 backdrop-blur">
            <BookOpen className="h-4 w-4 opacity-90" aria-hidden />
            Current MoodMap product language
          </div>
          <h1 className="mt-6 text-balance text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">MoodMap glossary</h1>
          <p className="mt-4 mx-auto max-w-3xl text-pretty text-base sm:text-lg text-white/75 leading-relaxed">
            Clear definitions for Today’s State, Day Brief, Cycle Calendar, Risk Radar, Protocol, WHY, Cycle Intelligence, capacity, Timing Alerts, and Premium+.
          </p>
        </div>
      </section>

      <section className="px-6 pb-14">
        <div className="mx-auto max-w-5xl grid gap-6">
          <article className="glass-card p-6 sm:p-7 text-left">
            <div className="flex items-start gap-4">
              <span className="glass-icon"><Brain className="h-6 w-6 text-white" aria-hidden /></span>
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold">The core definition</h2>
                <p className="mt-2 text-white/75 leading-relaxed">
                  MoodMap is cycle-aware relationship intelligence for men: one private daily read based on a partner’s cycle, designed to improve timing around support, conversation, restraint, and intimacy.
                </p>
              </div>
            </div>
          </article>

          <div className="grid gap-4">
            {TERMS.map((term) => (
              <article key={term.slug} id={term.slug} className="glass-card p-5 sm:p-6 text-left scroll-mt-28">
                <div className="flex items-start gap-4">
                  <span className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.055] text-emerald-100"><Sparkles className="h-4 w-4" aria-hidden /></span>
                  <div>
                    <h2 className="text-lg sm:text-xl font-semibold text-white">{term.name}</h2>
                    <p className="mt-1 text-sm font-semibold text-emerald-100/80">{term.short}</p>
                    <p className="mt-2 text-sm sm:text-base leading-relaxed text-white/70">{term.definition}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <article className="glass-card p-6 sm:p-7 text-left">
            <div className="flex items-start gap-4">
              <span className="glass-icon"><Shield className="h-6 w-6 text-white" aria-hidden /></span>
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold">Boundary language</h2>
                <p className="mt-2 text-white/75 leading-relaxed">
                  MoodMap does not record actual mood, measure individual hormones, diagnose conditions, provide contraception, plan fertility, or replace consent and communication. Its narrower job is context for the user’s timing before he acts.
                </p>
              </div>
            </div>
          </article>

          <section className="grid gap-4 md:grid-cols-2" aria-label="MoodMap glossary questions">
            {FAQ.map(({ q, a }) => (
              <article key={q} className="glass-card p-5 text-left">
                <h2 className="text-base font-semibold text-white">{q}</h2>
                <p className="mt-2 text-sm leading-relaxed text-white/68">{a}</p>
              </article>
            ))}
          </section>

          <SourceTrustBlock />

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/intelligence" className="btn-primary inline-flex items-center gap-2"><Layers3 className="h-4 w-4" aria-hidden />Explore Intelligence</Link>
            <Link href="/learn/cycle-aware-relationship-timing" className="mm-link inline-flex items-center gap-2 text-sm text-white/76"><Compass className="h-4 w-4" aria-hidden />Learn cycle-aware timing →</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
