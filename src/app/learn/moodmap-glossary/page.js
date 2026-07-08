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
  "Definitions for MoodMap terms including Daily Read, Room Read, Friction Risk, Move + Reason, Hormone Graph Intelligence, capacity, and Premium+.";

export const metadata = {
  title: "Relationship Timing Glossary and App Terms",
  description: META_DESCRIPTION,
  alternates: {
    canonical: SLUG,
  },
  openGraph: {
    title: "MoodMap Relationship Timing Glossary and App Terms",
    description: META_DESCRIPTION,
    url: SLUG,
    type: "article",
    images: [OG_IMAGE_SRC],
  },
  twitter: {
    card: "summary_large_image",
    title: "MoodMap Relationship Timing Glossary and App Terms",
    description: META_DESCRIPTION,
    images: [OG_IMAGE_SRC],
  },
};

const TERMS = [
  {
    slug: "moodmap",
    name: "MoodMap",
    short: "Cycle-aware relationship intelligence for men.",
    definition:
      "MoodMap is a private relationship-timing app for men. It translates menstrual-cycle context into one daily read for support, conversation, restraint, and intimacy.",
  },
  {
    slug: "cycle-aware-relationship-intelligence",
    name: "Cycle-aware relationship intelligence",
    short: "The category MoodMap is built to own.",
    definition:
      "Cycle-aware relationship intelligence uses menstrual-cycle phase, modeled hormone activity, capacity, stress sensitivity, and timing context to guide better relationship decisions.",
  },
  {
    slug: "daily-read",
    name: "Daily Read",
    short: "One private read before he moves.",
    definition:
      "The Daily Read is MoodMap’s main daily output: phase context, capacity, friction risk, timing guidance, and the cleaner move for the day.",
  },
  {
    slug: "sitrep-room-read",
    name: "SitRep / Room Read",
    short: "The situation layer.",
    definition:
      "SitRep, also presented as Room Read, is MoodMap’s daily situation read: what matters now, what the room can absorb, and what kind of pace is cleaner.",
  },
  {
    slug: "risk-radar-friction-risk",
    name: "Risk Radar / Friction Risk",
    short: "The avoid layer.",
    definition:
      "Risk Radar, also presented as Friction Risk, flags tripwires, accelerants, and containment moves before a poorly timed action makes the room heavier.",
  },
  {
    slug: "commanddeck-move-reason",
    name: "CommandDeck / Move + Reason",
    short: "The action layer.",
    definition:
      "CommandDeck, also presented as Move + Reason, turns the read into practical action: what to do, what to avoid, and why that move fits today’s context.",
  },
  {
    slug: "hormone-graph-intelligence",
    name: "Hormone Graph Intelligence",
    short: "The interpretation layer behind the chart.",
    definition:
      "Hormone Graph Intelligence translates cycle phase, modeled hormone activity, capacity, and stress sensitivity into practical timing context. It is not hormone measurement or diagnosis.",
  },
  {
    slug: "capacity",
    name: "Capacity",
    short: "How much the day can realistically absorb.",
    definition:
      "Capacity is MoodMap’s practical read of bandwidth: how much load, complexity, noise, pressure, or emotional demand the day may absorb cleanly.",
  },
  {
    slug: "stress-sensitivity",
    name: "Stress Sensitivity",
    short: "How loudly friction may land.",
    definition:
      "Stress Sensitivity is MoodMap’s read of stress buffer and friction cost. Higher sensitivity means tone, ambiguity, and unresolved tension may require more care.",
  },
  {
    slug: "premium-plus",
    name: "Premium+",
    short: "The full MoodMap daily stack.",
    definition:
      "Premium+ unlocks MoodMap’s full private daily read, including the complete situation layer, friction layer, action layer, intimacy context, and the intelligence behind the read.",
  },
  {
    slug: "discreet-mode",
    name: "Discreet Mode",
    short: "A privacy-first presentation mode.",
    definition:
      "Discreet Mode is a privacy-oriented way to make MoodMap feel less exposed in everyday use, keeping the product focused on his private timing read.",
  },
  {
    slug: "phase-alerts",
    name: "Phase Alerts",
    short: "Low-noise timing signals.",
    definition:
      "Phase Alerts are optional timing signals around important cycle windows, built to help him prepare without turning the relationship into a dashboard.",
  },
];

const FAQ = [
  {
    q: "Is MoodMap a period tracker?",
    a: "MoodMap is not a traditional period tracker. It is a relationship-timing app for men that uses cycle context to guide support, conversation, restraint, and intimacy timing.",
  },
  {
    q: "Why does MoodMap use terms like SitRep and CommandDeck?",
    a: "The product language is designed to make the guidance practical. SitRep reads the room, Risk Radar flags friction, and CommandDeck turns context into a cleaner move.",
  },
  {
    q: "What is the main product category?",
    a: "The clearest category is cycle-aware relationship intelligence: menstrual-cycle context translated into practical relationship timing.",
  },
  {
    q: "Does MoodMap judge or score a partner?",
    a: "MoodMap guides his timing and response. It is not a verdict on her mood, intent, identity, or worth.",
  },
];

export default function MoodMapGlossaryPage() {
  const articleSchema = articleJsonLd({
    path: SLUG,
    headline: "MoodMap Relationship Timing Glossary and App Terms",
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermSchema) }}
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
            <BookOpen className="h-4 w-4 opacity-90" aria-hidden />
            MoodMap product dictionary
          </div>

          <h1 className="mt-6 text-balance text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
            MoodMap glossary
          </h1>

          <p className="mt-4 mx-auto max-w-2xl text-pretty text-base sm:text-lg text-white/75 leading-relaxed">
            Clear definitions for MoodMap’s product language: Daily Read, SitRep, Risk Radar,
            CommandDeck, Hormone Graph Intelligence, capacity, stress sensitivity, and Premium+.
          </p>
        </div>
      </section>

      <section className="px-6 pb-14">
        <div className="mx-auto max-w-5xl grid gap-6">
          <article className="glass-card p-6 sm:p-7 text-left">
            <div className="flex items-start gap-4">
              <span className="glass-icon">
                <Brain className="h-6 w-6 text-white" aria-hidden />
              </span>
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold">
                  The core definition
                </h2>
                <p className="mt-2 text-white/75 leading-relaxed">
                  MoodMap is cycle-aware relationship intelligence for men. It translates menstrual-cycle
                  context into one private daily read for support, conversation, restraint, and intimacy.
                </p>
              </div>
            </div>
          </article>

          <div className="grid gap-4">
            {TERMS.map((term) => (
              <article key={term.slug} id={term.slug} className="glass-card p-5 sm:p-6 text-left scroll-mt-28">
                <div className="flex items-start gap-4">
                  <span className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.055] text-emerald-100">
                    <Sparkles className="h-4 w-4" aria-hidden />
                  </span>
                  <div>
                    <h2 className="text-lg sm:text-xl font-semibold text-white">{term.name}</h2>
                    <p className="mt-1 text-sm font-semibold text-emerald-100/80">{term.short}</p>
                    <p className="mt-2 text-sm sm:text-base leading-relaxed text-white/70">
                      {term.definition}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <article className="glass-card p-6 sm:p-7 text-left">
            <div className="flex items-start gap-4">
              <span className="glass-icon">
                <Shield className="h-6 w-6 text-white" aria-hidden />
              </span>
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold">Boundary language</h2>
                <p className="mt-2 text-white/75 leading-relaxed">
                  MoodMap does not predict emotions, measure hormones, diagnose conditions, provide
                  contraception, or replace consent and communication. Its job is narrower and more
                  useful: context for his timing before he acts.
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
            <Link href="/intelligence" className="btn-primary inline-flex items-center gap-2">
              <Layers3 className="h-4 w-4" aria-hidden />
              Explore Intelligence
            </Link>
            <Link href="/learn/cycle-aware-relationship-timing" className="mm-link inline-flex items-center gap-2 text-sm text-white/76">
              <Compass className="h-4 w-4" aria-hidden />
              Learn cycle-aware timing →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
