import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Brain,
  Gauge,
  Layers3,
  LineChart,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  OG_IMAGE_SRC,
  SourceTrustBlock,
  absoluteUrl,
  breadcrumbJsonLd,
  faqJsonLd,
  mobileApplicationJsonLd,
} from "../seo";

const SLUG = "/intelligence";
const META_DESCRIPTION =
  "MoodMap turns cycle phase, modeled hormone activity, capacity, and stress sensitivity into cycle-aware relationship intelligence for men.";

export const metadata = {
  title: "Hormone Graph Intelligence",
  description: META_DESCRIPTION,
  alternates: {
    canonical: SLUG,
  },
  openGraph: {
    title: "MoodMap Hormone Graph Intelligence",
    description: META_DESCRIPTION,
    url: SLUG,
    type: "website",
    images: [OG_IMAGE_SRC],
  },
  twitter: {
    card: "summary_large_image",
    title: "MoodMap Hormone Graph Intelligence",
    description: META_DESCRIPTION,
    images: [OG_IMAGE_SRC],
  },
};

const MODEL_LAYERS = [
  {
    icon: LineChart,
    title: "Modeled hormone activity",
    body: "MoodMap reads relative shifts across the cycle — estrogen, progesterone, testosterone, LH, and FSH — as timing context, not lab values.",
  },
  {
    icon: Gauge,
    title: "Capacity + stress sensitivity",
    body: "The graph is interpreted through bandwidth, stress buffer, recovery demand, and how much friction the day can realistically absorb.",
  },
  {
    icon: Layers3,
    title: "Biology → consequence → interpretation",
    body: "The intelligence layer connects the biological background to practical guidance: what may cost more, what may land cleaner, and when restraint is the move.",
  },
];

const SIGNALS = [
  ["Menstruation", "Lower reserve and repair load can make pressure, noise, and heavy asks cost more."],
  ["Follicular rise", "Rising estrogen can make planning, initiative, and outward rhythm easier for some."],
  ["Ovulation window", "High estrogen and LH timing can coincide with stronger outward momentum and responsiveness."],
  ["Luteal rise", "Progesterone-driven pacing can make complexity, clutter, and emotional load feel denser."],
  ["PMS withdrawal", "Falling progesterone and lower stress buffer can make tone, ambiguity, and unresolved tension land harder."],
];

const FAQ = [
  {
    q: "What is MoodMap’s intelligence layer?",
    a: "MoodMap’s intelligence layer translates menstrual-cycle phase, modeled hormone activity, capacity, and stress sensitivity into cycle-aware relationship intelligence for men.",
  },
  {
    q: "Does MoodMap measure hormones?",
    a: "MoodMap does not measure hormones or provide lab values. It uses modeled relative hormone activity as non-medical timing context.",
  },
  {
    q: "Does MoodMap predict her mood?",
    a: "MoodMap does not predict emotions or judge intent. It gives context around timing, capacity, stress sensitivity, and friction risk so a man can respond more carefully.",
  },
  {
    q: "Is this medical or fertility advice?",
    a: "MoodMap is cycle-aware relationship intelligence for relationship timing. It is not diagnosis, contraception, fertility planning, hormone measurement, or medical treatment.",
  },
];

export default function IntelligencePage() {
  const breadcrumbSchema = breadcrumbJsonLd([
    { name: "Home", href: "/" },
    { name: "Hormone Graph Intelligence", href: SLUG },
  ]);
  const faqSchema = faqJsonLd(FAQ);
  const appSchema = mobileApplicationJsonLd(SLUG);
  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "MoodMap Hormone Graph Intelligence",
    description: META_DESCRIPTION,
    url: absoluteUrl(SLUG),
    inLanguage: "en",
    about: [
      { "@type": "Thing", name: "Cycle-aware relationship intelligence" },
      { "@type": "Thing", name: "Relationship timing" },
      { "@type": "Thing", name: "Menstrual cycle context" },
      { "@type": "Thing", name: "Hormone graph" },
    ],
  };

  return (
    <main className="relative isolate bg-primary-blue text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }}
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
            <Brain className="h-4 w-4 opacity-90" aria-hidden />
            Cycle-aware relationship intelligence
          </div>

          <h1 className="mt-6 text-balance text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
            Hormone Graph Intelligence
          </h1>

          <p className="mt-5 mx-auto max-w-3xl text-pretty text-base sm:text-lg text-white/75 leading-relaxed">
            MoodMap does not predict her mood. It reads the background conditions: cycle phase,
            modeled hormone activity, capacity, stress sensitivity, and timing context — then turns
            that into one private daily read for support, conversation, restraint, and intimacy.
          </p>

          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/#download" className="btn-primary">
              Download MoodMap
            </Link>
            <Link href="/learn/cycle-aware-relationship-timing" className="mm-link text-sm text-white/78">
              Learn the category →
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 pb-14">
        <div className="mx-auto max-w-5xl grid gap-6">
          <article className="glass-card p-6 sm:p-8 text-left">
            <div className="flex items-start gap-4">
              <span className="glass-icon">
                <Sparkles className="h-6 w-6 text-white" aria-hidden />
              </span>
              <div>
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                  What the intelligence layer does
                </h2>
                <p className="mt-3 text-white/75 leading-relaxed">
                  MoodMap turns a cycle chart into a relationship read. It looks at where she is in
                  the cycle, how the modeled hormone pattern is shifting, what that can mean for
                  capacity and stress buffer, and which move is cleaner today.
                </p>
                <p className="mt-3 text-white/68 leading-relaxed">
                  The output is not a medical interpretation. It is a timing interpretation: what may
                  cost more, what may land better, where pressure is risky, and when support or space
                  is the stronger move.
                </p>
              </div>
            </div>
          </article>

          <div className="grid gap-6 md:grid-cols-3">
            {MODEL_LAYERS.map(({ icon: Icon, title, body }) => (
              <article key={title} className="glass-card glass-card-hover p-6 text-left">
                <span className="glass-icon">
                  <Icon className="h-6 w-6 text-white" aria-hidden />
                </span>
                <h2 className="mt-4 text-lg font-semibold text-white">{title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-white/70">{body}</p>
                <div aria-hidden="true" className="glass-gloss" />
              </article>
            ))}
          </div>

          <article className="glass-card p-6 sm:p-8 text-left">
            <div className="flex items-start gap-4">
              <span className="glass-icon">
                <Activity className="h-6 w-6 text-white" aria-hidden />
              </span>
              <div>
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                  The timing map underneath the daily read
                </h2>
                <p className="mt-3 text-white/72 leading-relaxed">
                  The same conversation, joke, request, repair attempt, or bid for intimacy can land
                  differently depending on the cycle window. MoodMap makes that context visible
                  before the move happens.
                </p>
                <div className="mt-6 grid gap-3">
                  {SIGNALS.map(([phase, copy]) => (
                    <div
                      key={phase}
                      className="rounded-2xl border border-white/10 bg-white/[0.035] p-4"
                    >
                      <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-emerald-100/85">
                        {phase}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-white/68">{copy}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </article>

          <article className="glass-card p-6 sm:p-8 text-left">
            <div className="flex items-start gap-4">
              <span className="glass-icon">
                <ShieldCheck className="h-6 w-6 text-white" aria-hidden />
              </span>
              <div>
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                  Context, not prediction
                </h2>
                <p className="mt-3 text-white/75 leading-relaxed">
                  MoodMap does not tell him what she feels. It tells him what the background
                  conditions may make more expensive: pressure, ambiguity, noise, heavy asks,
                  closure-chasing, or poorly timed intimacy.
                </p>
                <p className="mt-3 text-white/68 leading-relaxed">
                  The point is not control. The point is a cleaner response: more support when the
                  margin is narrow, better timing when the topic matters, and more restraint when his
                  instinct would make the room heavier.
                </p>
              </div>
            </div>
          </article>

          <section className="grid gap-4 md:grid-cols-2" aria-label="Hormone Graph Intelligence questions">
            {FAQ.map(({ q, a }) => (
              <article key={q} className="glass-card p-5 text-left">
                <h2 className="text-base font-semibold text-white">{q}</h2>
                <p className="mt-2 text-sm leading-relaxed text-white/68">{a}</p>
              </article>
            ))}
          </section>

          <SourceTrustBlock />

          <div className="text-center">
            <Link href="/pro" className="btn-primary inline-flex items-center gap-2">
              See Premium+ <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
