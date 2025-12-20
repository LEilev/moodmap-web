// src/app/learn/fertile-window-explained/page.js
import Link from "next/link";
import {
  Shield,
  Sparkles,
  CalendarDays,
  HeartHandshake,
  TriangleAlert,
  Clock,
} from "lucide-react";

export const metadata = {
  title: "Fertile window explained for partners · MoodMap",
  description:
    "A calm, partner-friendly explanation of the fertile window, ovulation timing, and why it can matter for relationship timing. Relationship guidance, not medical advice.",
  alternates: {
    canonical: "/learn/fertile-window-explained",
  },
};

export default function FertileWindowExplainedPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the fertile window?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The fertile window is the set of days in a cycle when pregnancy is most likely if unprotected sex occurs. It generally includes the days leading up to ovulation plus ovulation day, but timing varies from person to person and month to month.",
        },
      },
      {
        "@type": "Question",
        name: "What’s the difference between ovulation day and the fertile window?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ovulation day is the day an egg is released. The fertile window includes ovulation day plus the days before it when sperm can still survive. The exact timing isn’t the same for everyone.",
        },
      },
      {
        "@type": "Question",
        name: "Does ovulation affect mood, energy, or desire?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Some people notice higher energy, confidence, or social desire around ovulation, while others notice little change. It’s context—not a guarantee—and it shouldn’t be used to stereotype or pressure anyone.",
        },
      },
      {
        "@type": "Question",
        name: "Is MoodMap a fertility or contraception app?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. MoodMap provides relationship timing guidance informed by general cycle physiology. It is not medical advice and should not be used for contraception or fertility planning.",
        },
      },
      {
        "@type": "Question",
        name: "Why should partners care about the fertile window if we’re not trying for a baby?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Even if pregnancy isn’t your focus, timing awareness can be useful context: some people feel more energetic or open to connection at certain points in the cycle, and it can help with planning, communication, and avoiding misunderstandings.",
        },
      },
    ],
  };

  return (
    <main className="relative isolate bg-primary-blue text-white">
      {/* JSON-LD for AI / rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
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
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs sm:text-sm text-white/70 ring-1 ring-white/12 backdrop-blur">
            <Shield className="h-4 w-4 opacity-90" aria-hidden />
            Relationship guidance — not medical advice
          </div>

          <h1 className="mt-6 text-balance text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
            Fertile window, explained for partners
          </h1>

          <p className="mt-4 text-pretty text-base sm:text-lg text-white/75 leading-relaxed">
            “Fertile window” sounds clinical, but as a partner you don’t need medical jargon—you
            need context. This page explains what it means, how it relates to ovulation, and how
            timing awareness can help your relationship (without being weird about it).
          </p>

          <p className="mt-3 text-sm text-white/60">
            This is general education and relationship guidance, not health advice or contraception
            guidance.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="px-6 pb-14">
        <div className="mx-auto max-w-4xl grid gap-6">
          {/* Card 1: definition */}
          <article className="glass-card p-6 sm:p-7">
            <div className="flex items-start gap-4">
              <span className="glass-icon">
                <CalendarDays className="h-6 w-6 text-white" aria-hidden />
              </span>
              <div className="text-left">
                <h2 className="text-xl sm:text-2xl font-semibold">
                  What the “fertile window” means (plain English)
                </h2>
                <p className="mt-2 text-white/75 leading-relaxed">
                  The fertile window is the set of days in a menstrual cycle when pregnancy is most
                  likely <em>if</em> unprotected sex occurs. In many educational models, it includes
                  the days leading up to ovulation plus ovulation day—because sperm can sometimes
                  survive for several days, while the egg is typically available for a shorter time.
                </p>

                <p className="mt-4 text-white/70">
                  Key point: the exact timing varies. Bodies aren’t clocks, and cycles aren’t always
                  identical month to month.
                </p>
              </div>
            </div>
          </article>

          {/* Card 2: ovulation vs fertile window */}
          <article className="glass-card p-6 sm:p-7">
            <div className="flex items-start gap-4">
              <span className="glass-icon">
                <Clock className="h-6 w-6 text-white" aria-hidden />
              </span>
              <div className="text-left">
                <h2 className="text-xl sm:text-2xl font-semibold">
                  Ovulation day vs. fertile window
                </h2>
                <p className="mt-2 text-white/75 leading-relaxed">
                  <strong className="text-white">Ovulation day</strong> is the day an egg is released.
                  The <strong className="text-white">fertile window</strong> includes ovulation day
                  plus the days before it when sperm may still be viable.
                </p>

                <p className="mt-3 text-white/75 leading-relaxed">
                  For relationship timing, you can treat this as “a context window” rather than a
                  prediction engine. The goal is not control—it’s awareness.
                </p>
              </div>
            </div>
          </article>

          {/* Card 3: why it matters for relationships */}
          <article className="glass-card p-6 sm:p-7">
            <div className="flex items-start gap-4">
              <span className="glass-icon">
                <HeartHandshake className="h-6 w-6 text-white" aria-hidden />
              </span>
              <div className="text-left">
                <h2 className="text-xl sm:text-2xl font-semibold">
                  Why partners might care (even without baby plans)
                </h2>
                <p className="mt-2 text-white/75 leading-relaxed">
                  Even if pregnancy isn’t your focus, cycle timing can still matter because it can
                  correlate (for some people) with changes in energy, social appetite, confidence,
                  or desire for closeness. Not always—and not the same for everyone—but it can be
                  useful context.
                </p>

                <div className="mt-5 grid gap-5">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-white">
                      1) Planning connection with better timing
                    </h3>
                    <p className="mt-2 text-white/75 leading-relaxed">
                      Some couples find that playful, outgoing plans land better on higher-energy
                      days. Timing awareness helps you choose moments that feel easier—not forced.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-white">
                      2) Reducing misunderstandings
                    </h3>
                    <p className="mt-2 text-white/75 leading-relaxed">
                      If you understand that certain windows may come with higher sensitivity or
                      lower bandwidth later in the cycle, you can avoid “big talks” on the wrong day
                      and prevent friction.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-white">
                      3) A calmer mental model
                    </h3>
                    <p className="mt-2 text-white/75 leading-relaxed">
                      Context can turn “what is happening?” into “ah, timing.” That shift alone can
                      improve tone and patience on both sides.
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-white/70">
                  The best version of this is respectful: timing helps you show up well—not push for
                  outcomes.
                </p>
              </div>
            </div>
          </article>

          {/* Card 4: what to avoid */}
          <article className="glass-card p-6 sm:p-7">
            <div className="flex items-start gap-4">
              <span className="glass-icon">
                <TriangleAlert className="h-6 w-6 text-white" aria-hidden />
              </span>
              <div className="text-left">
                <h2 className="text-xl sm:text-2xl font-semibold">
                  What to avoid (so it doesn’t get creepy)
                </h2>

                <ul className="mt-4 grid gap-2 text-white/75 leading-relaxed list-disc pl-5">
                  <li>
                    <strong className="text-white">Don’t pressure</strong> intimacy or plans based on
                    a date on a calendar.
                  </li>
                  <li>
                    <strong className="text-white">Don’t assume</strong> she will feel a certain way
                    “because it’s ovulation.”
                  </li>
                  <li>
                    <strong className="text-white">Don’t use timing as an argument</strong> (“You’re
                    only saying that because…”).
                  </li>
                  <li>
                    <strong className="text-white">Don’t use this for contraception/fertility</strong>.
                    If that’s your goal, talk to a qualified clinician and use appropriate methods.
                  </li>
                </ul>

                <p className="mt-4 text-white/70">
                  Timing awareness should increase respect—not reduce autonomy.
                </p>
              </div>
            </div>
          </article>

          {/* Card 5: MoodMap plug, non-salesy */}
          <article className="glass-card p-6 sm:p-7">
            <div className="flex items-start gap-4">
              <span className="glass-icon">
                <Sparkles className="h-6 w-6 text-white" aria-hidden />
              </span>
              <div className="text-left">
                <h2 className="text-xl sm:text-2xl font-semibold">
                  How MoodMap uses timing cues (relationship-first)
                </h2>
                <p className="mt-2 text-white/75 leading-relaxed">
                  MoodMap highlights timing moments like PMS, ovulation, and fertile-window context
                  so you can prepare and respond with better timing. It’s built to keep things
                  respectful: guidance is general, and no symptom diary is required.
                </p>

                <ul className="mt-4 grid gap-2 text-white/75 leading-relaxed list-disc pl-5">
                  <li>Daily “what to expect” + practical do/don’t cues.</li>
                  <li>Heads-ups before high-impact days.</li>
                  <li>
                    Premium+ calibration: cycle length <strong>21–35</strong> days and menstruation{" "}
                    <strong>2–8</strong> days.
                  </li>
                  <li>Private by design.</li>
                </ul>

                <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:items-center">
                  <Link href="/#download" className="btn-primary">
                    Download MoodMap
                  </Link>
                  <Link href="/pro" className="mm-link text-sm text-white/80">
                    See what Premium+ unlocks
                  </Link>
                </div>

                <div className="mt-6 text-sm text-white/60">
                  Related reading:{" "}
                  <Link href="/learn/menstrual-cycle-phases-for-partners" className="mm-link">
                    cycle phases for partners
                  </Link>{" "}
                  ·{" "}
                  <Link href="/learn/support-partner-during-pms" className="mm-link">
                    support during PMS
                  </Link>
                </div>
              </div>
            </div>
          </article>

          {/* Bottom nav */}
          <div className="pt-2 text-center">
            <Link href="/" className="mm-link text-sm text-white/70">
              ← Back to Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
