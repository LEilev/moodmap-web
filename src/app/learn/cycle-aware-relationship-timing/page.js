import Link from "next/link";
import {
  Brain,
  CalendarDays,
  Clock,
  HeartHandshake,
  MessageCircle,
  Shield,
  Sparkles,
} from "lucide-react";
import {
  OG_IMAGE_SRC,
  SourceTrustBlock,
  articleJsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
} from "../../seo";

const SLUG = "/learn/cycle-aware-relationship-timing";
const META_DESCRIPTION =
  "Learn how cycle-aware relationship timing uses menstrual-cycle context to choose better support, conversations, restraint, and intimacy pacing.";

export const metadata = {
  title: "Cycle-Aware Relationship Timing for Partners",
  description: META_DESCRIPTION,
  alternates: {
    canonical: SLUG,
  },
  openGraph: {
    title: "MoodMap Cycle-Aware Relationship Timing for Partners",
    description: META_DESCRIPTION,
    url: SLUG,
    type: "article",
    images: [OG_IMAGE_SRC],
  },
  twitter: {
    card: "summary_large_image",
    title: "MoodMap Cycle-Aware Relationship Timing for Partners",
    description: META_DESCRIPTION,
    images: [OG_IMAGE_SRC],
  },
};

const PRINCIPLES = [
  {
    icon: Clock,
    title: "Timing is part of the message",
    body: "A valid topic can still be opened at the wrong hour. Cycle-aware timing helps separate the real issue from the bad window.",
  },
  {
    icon: HeartHandshake,
    title: "Support beats pressure",
    body: "When capacity is narrow, the cleaner move is often food, warmth, space, or one practical assist — not a long explanation.",
  },
  {
    icon: MessageCircle,
    title: "Tone carries more weight on low-margin days",
    body: "Stress sensitivity can make ambiguity, sarcasm, and closure-chasing land louder than intended.",
  },
  {
    icon: Sparkles,
    title: "Intimacy needs context",
    body: "Desire, comfort, recovery demand, and openness can shift across the cycle. Timing helps him read pace before he initiates.",
  },
];

const WINDOWS = [
  ["Menstruation", "Lower reserve, more physical load, and stronger need for practical support for some."],
  ["Follicular", "Often a cleaner window for planning, initiative, and forward movement."],
  ["Ovulation", "Can bring more outward energy and connection for some, but never assume."],
  ["Luteal", "Complexity and load can feel denser; tone and follow-through matter more."],
  ["PMS", "Lower stress buffer can make pressure, ambiguity, and unresolved tension cost more."],
];

const FAQ = [
  {
    q: "What is cycle-aware relationship timing?",
    a: "Cycle-aware relationship timing means using menstrual-cycle context to choose better timing for support, conversations, restraint, and intimacy — without predicting mood or blaming hormones.",
  },
  {
    q: "Is this the same as period tracking?",
    a: "Period tracking usually records dates and symptoms. Cycle-aware relationship timing translates phase and timing context into practical relationship guidance instead of a symptom log.",
  },
  {
    q: "Can a boyfriend use cycle timing without being weird?",
    a: "Yes, if it is respectful, private, and consent-aware. The goal is to support better, pressure less, and communicate more carefully — not monitor or control her.",
  },
  {
    q: "Does cycle-aware timing replace communication?",
    a: "It improves timing around communication. Direct consent, conversation, and respect stay central.",
  },
];

export default function CycleAwareRelationshipTimingPage() {
  const articleSchema = articleJsonLd({
    path: SLUG,
    headline: "Cycle-Aware Relationship Timing for Partners",
    description: META_DESCRIPTION,
  });
  const breadcrumbSchema = breadcrumbJsonLd([
    { name: "Home", href: "/" },
    { name: "Learn", href: "/learn" },
    { name: "Cycle-aware relationship timing", href: SLUG },
  ]);
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
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs sm:text-sm text-white/70 ring-1 ring-white/12 backdrop-blur">
            <Shield className="h-4 w-4 opacity-90" aria-hidden />
            Relationship guidance — not medical advice
          </div>

          <h1 className="mt-6 text-balance text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
            Cycle-aware relationship timing
          </h1>

          <p className="mt-4 text-pretty text-base sm:text-lg text-white/75 leading-relaxed">
            Most relationship advice treats timing like a personality issue. MoodMap treats timing
            as context: cycle phase, capacity, stress sensitivity, and recovery demand can change
            how a conversation, request, joke, repair attempt, or bid for intimacy lands.
          </p>

          <p className="mt-3 text-sm text-white/60">
            The point is not to predict her. The point is to choose a cleaner move.
          </p>
        </div>
      </section>

      <section className="px-6 pb-14">
        <div className="mx-auto max-w-4xl grid gap-6">
          <article className="glass-card p-6 sm:p-7 text-left">
            <div className="flex items-start gap-4">
              <span className="glass-icon">
                <Brain className="h-6 w-6 text-white" aria-hidden />
              </span>
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold">
                  The short definition
                </h2>
                <p className="mt-2 text-white/75 leading-relaxed">
                  Cycle-aware relationship timing is the practice of using menstrual-cycle context
                  to choose better timing for support, conversations, restraint, and intimacy. It is
                  context, not control; timing, not diagnosis; awareness, not mind-reading.
                </p>
              </div>
            </div>
          </article>

          <div className="grid gap-6 sm:grid-cols-2">
            {PRINCIPLES.map(({ icon: Icon, title, body }) => (
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

          <article className="glass-card p-6 sm:p-7 text-left">
            <div className="flex items-start gap-4">
              <span className="glass-icon">
                <CalendarDays className="h-6 w-6 text-white" aria-hidden />
              </span>
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold">
                  How timing changes across the cycle
                </h2>
                <p className="mt-2 text-white/75 leading-relaxed">
                  Every woman is different, and no phase explains a person. But cycle phase can be
                  useful context for capacity, energy, stress buffer, and recovery demand.
                </p>
                <div className="mt-5 grid gap-3">
                  {WINDOWS.map(([phase, body]) => (
                    <div key={phase} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                      <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-emerald-100/85">
                        {phase}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-white/68">{body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </article>

          <article className="glass-card p-6 sm:p-7 text-left">
            <h2 className="text-xl sm:text-2xl font-semibold">What this looks like in practice</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                <h3 className="font-semibold text-white">Support</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/68">
                  Do one concrete thing before asking for emotional bandwidth: food, warmth, cleanup,
                  logistics, or quiet presence.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                <h3 className="font-semibold text-white">Conversation</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/68">
                  Save heavy topics for windows with more margin. If it must happen now, make it
                  shorter, cleaner, and easier to pause.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                <h3 className="font-semibold text-white">Intimacy</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/68">
                  Read pace before he initiates. Connection is cleaner when comfort, context, and
                  recovery demand are respected.
                </p>
              </div>
            </div>
          </article>

          <section className="grid gap-4 md:grid-cols-2" aria-label="Cycle-aware relationship timing questions">
            {FAQ.map(({ q, a }) => (
              <article key={q} className="glass-card p-5 text-left">
                <h2 className="text-base font-semibold text-white">{q}</h2>
                <p className="mt-2 text-sm leading-relaxed text-white/68">{a}</p>
              </article>
            ))}
          </section>

          <SourceTrustBlock />

          <div className="text-center">
            <Link href="/intelligence" className="btn-primary">
              Explore Hormone Graph Intelligence
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
