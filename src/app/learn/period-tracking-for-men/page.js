// src/app/learn/period-tracking-for-men/page.js
import Link from "next/link";
import {
  CalendarDays,
  HeartHandshake,
  Map,
  MessageCircle,
  Shield,
  Sparkles,
  BellRing,
  TriangleAlert,
  Lock,
} from "lucide-react";

export const metadata = {
  title: "Period tracking for men",
  description:
    "A respectful guide to period tracking for men: what to track, why timing matters, how to ask for consent, and how MoodMap adds phase-aware context. Relationship guidance, not medical advice.",
  alternates: {
    canonical: "/learn/period-tracking-for-men",
  },
};

export default function PeriodTrackingForMenPage() {
  // One source of truth: used for BOTH JSON-LD and visible FAQs
  const FAQ = [
    {
      q: "Is it okay for a man to track his partner’s period?",
      a: "Yes — if it’s done with consent, respect, and clear intent (support, not control). The goal is timing awareness and better communication, not monitoring.",
    },
    {
      q: "What should I track (minimum effective tracking)?",
      a: "Keep it simple: Day 1 (first day of bleeding), her typical cycle length (if she wants to share), and any agreed ‘heads-up’ windows (like a PMS watch window). Use it as context, not certainty.",
    },
    {
      q: "How do I bring it up without sounding creepy?",
      a: "Be direct and supportive: ‘Would it help if I had a reminder so I can plan better and show up well — or would you rather I don’t track anything?’ Let her set the boundary.",
    },
    {
      q: "Does this replace medical advice or fertility planning?",
      a: "No. This is relationship guidance informed by general physiology. It’s not medical advice and should not be used for contraception or fertility planning.",
    },
    {
      q: "What if her cycle isn’t 28 days (or varies)?",
      a: "That’s normal. Avoid rigid calendars. Use flexible expectations, and if you use an app, prefer calibration over a fixed 28‑day template. MoodMap Premium+ supports cycle calibration (21–35 days) and menstruation length (2–8 days).",
    },
    {
      q: "How is MoodMap different from a typical period tracker?",
      a: "MoodMap includes the core timing basics (cycle overview and optional alerts for key windows) and adds a partner layer: daily phase-aware cues, practical do/don’t guidance, and self-regulation prompts — designed for men.",
    },
    {
      q: "Is the data private?",
      a: "MoodMap is designed to be private-by-design. You don’t need to keep a symptom diary, and Premium+ messaging emphasizes that no cycle details leave your device. Only share what you both agree to share.",
    },
  ];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
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

          <h1 className="mt-5 text-balance text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
            Period tracking for men
          </h1>

          <p className="mt-4 mx-auto max-w-2xl text-pretty text-base sm:text-lg text-white/75 leading-relaxed">
            A respectful, practical approach: how to track timing as <em>context</em> (not control),
            how to ask for consent, and how to use what you learn to show up better.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="px-6 pb-14 sm:pb-16">
        <div className="mx-auto max-w-4xl grid gap-6">
          {/* Card 1 */}
          <article className="glass-card p-6 sm:p-7">
            <div className="flex items-start gap-4">
              <span className="glass-icon">
                <CalendarDays className="h-6 w-6 text-white" aria-hidden />
              </span>
              <div className="text-left">
                <h2 className="text-xl sm:text-2xl font-semibold">
                  What “period tracking for men” actually means
                </h2>
                <p className="mt-2 text-white/75 leading-relaxed">
                  In practice, it means having a basic sense of{" "}
                  <strong className="text-white">where she is in her cycle</strong> so you can plan
                  support, communication, and logistics with better timing. It’s not about
                  surveillance — it’s about being less reactive and more considerate.
                </p>

                <ul className="mt-4 grid gap-2 text-white/75 leading-relaxed list-disc pl-5">
                  <li>
                    You track <strong className="text-white">timing windows</strong>, not “moods.”
                  </li>
                  <li>
                    You use it for <strong className="text-white">planning and care</strong>, not
                    arguments.
                  </li>
                  <li>
                    You do it with <strong className="text-white">consent</strong>, every time.
                  </li>
                </ul>
              </div>
            </div>
          </article>

          {/* Card 2 */}
          <article className="glass-card p-6 sm:p-7">
            <div className="flex items-start gap-4">
              <span className="glass-icon">
                <HeartHandshake className="h-6 w-6 text-white" aria-hidden />
              </span>
              <div className="text-left">
                <h2 className="text-xl sm:text-2xl font-semibold">
                  Why it helps (when it’s done right)
                </h2>
                <p className="mt-2 text-white/75 leading-relaxed">
                  Timing awareness is a relationship skill. It helps you match the day — without
                  guessing, tiptoeing, or taking things personally.
                </p>

                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-white">
                      Fewer misunderstandings
                    </h3>
                    <p className="mt-2 text-white/75 leading-relaxed">
                      When sensitivity is higher, small things land bigger. Cleaner tone and less
                      pressure prevents friction.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-white">
                      Better support timing
                    </h3>
                    <p className="mt-2 text-white/75 leading-relaxed">
                      You can prepare before high-impact days instead of “finding out” mid-conflict.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-white">
                      Calmer logistics
                    </h3>
                    <p className="mt-2 text-white/75 leading-relaxed">
                      You plan dates, workload, travel, and conversations with more empathy and
                      realism.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Card 3 */}
          <article className="glass-card p-6 sm:p-7">
            <div className="flex items-start gap-4">
              <span className="glass-icon">
                <Map className="h-6 w-6 text-white" aria-hidden />
              </span>
              <div className="text-left">
                <h2 className="text-xl sm:text-2xl font-semibold">
                  The minimalist framework (track less, do more)
                </h2>
                <p className="mt-2 text-white/75 leading-relaxed">
                  Most men overcomplicate this. You don’t need to “track everything.” You need a
                  shared, simple model you both agree on.
                </p>

                <ul className="mt-4 grid gap-2 text-white/75 leading-relaxed list-disc pl-5">
                  <li>
                    <strong className="text-white">Day 1:</strong> first day of bleeding.
                  </li>
                  <li>
                    <strong className="text-white">Cycle length:</strong> her usual range (if she
                    wants to share).
                  </li>
                  <li>
                    <strong className="text-white">A heads-up window:</strong> an agreed “PMS watch”
                    window (not a stereotype—just a reminder to be extra steady).
                  </li>
                  <li>
                    <strong className="text-white">Optional context windows:</strong> ovulation/fertile
                    context if that’s useful for planning.
                  </li>
                </ul>

                <p className="mt-4 text-white/70">
                  If her cycle varies month-to-month, treat timing as probabilities—not promises.
                </p>

                <div className="mt-6 text-sm text-white/60">
                  Related reading:{" "}
                  <Link href="/learn/menstrual-cycle-phases-for-partners" className="mm-link">
                    cycle phases for partners
                  </Link>
                  {" · "}
                  <Link href="/learn/fertile-window-explained" className="mm-link">
                    fertile window explained
                  </Link>
                </div>
              </div>
            </div>
          </article>

          {/* Card 4 */}
          <article className="glass-card p-6 sm:p-7">
            <div className="flex items-start gap-4">
              <span className="glass-icon">
                <MessageCircle className="h-6 w-6 text-white" aria-hidden />
              </span>
              <div className="text-left">
                <h2 className="text-xl sm:text-2xl font-semibold">Consent and communication</h2>
                <p className="mt-2 text-white/75 leading-relaxed">
                  The line between supportive and creepy is simple:{" "}
                  <strong className="text-white">consent + transparency</strong>.
                </p>

                <div className="mt-4 rounded-xl bg-white/5 ring-1 ring-white/10 p-4">
                  <p className="text-white/80 leading-relaxed">
                    <strong className="text-white">Try this:</strong> “Would it help if I had a
                    reminder so I can plan better and show up well — or would you rather I don’t
                    track anything?”
                  </p>
                </div>

                <ul className="mt-4 grid gap-2 text-white/75 leading-relaxed list-disc pl-5">
                  <li>
                    Ask what she wants you to know (and what she doesn’t).
                  </li>
                  <li>
                    Agree on what “helpful” looks like (space, reassurance, fewer demands, etc.).
                  </li>
                  <li>
                    Never use tracking to win arguments or diagnose her feelings.
                  </li>
                </ul>

                <p className="mt-4 inline-flex items-center gap-2 text-white/70">
                  <Lock className="h-4 w-4" aria-hidden />
                  Respect and autonomy first. Always.
                </p>
              </div>
            </div>
          </article>

          {/* Card 5 */}
          <article className="glass-card p-6 sm:p-7">
            <div className="flex items-start gap-4">
              <span className="glass-icon">
                <Sparkles className="h-6 w-6 text-white" aria-hidden />
              </span>
              <div className="text-left">
                <h2 className="text-xl sm:text-2xl font-semibold">
                  Where MoodMap fits: the basics — plus context for men
                </h2>
                <p className="mt-2 text-white/75 leading-relaxed">
                  MoodMap covers the core timing basics you’d expect (cycle overview + optional
                  alerts for key windows) and adds what most trackers don’t:{" "}
                  <strong className="text-white">daily phase-aware guidance for men</strong> —
                  practical do/don’t cues, steadiness prompts, and connection timing.
                </p>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl bg-white/5 ring-1 ring-white/10 p-4">
                    <div className="flex items-center gap-2 text-white/80 font-semibold">
                      <BellRing className="h-4 w-4" aria-hidden />
                      Timing alerts (optional)
                    </div>
                    <p className="mt-2 text-white/70 leading-relaxed">
                      Heads-up for windows like PMS, ovulation, and fertile-window context — so you
                      can prepare instead of react.
                    </p>
                  </div>

                  <div className="rounded-xl bg-white/5 ring-1 ring-white/10 p-4">
                    <div className="flex items-center gap-2 text-white/80 font-semibold">
                      <Sparkles className="h-4 w-4" aria-hidden />
                      Daily cues for men
                    </div>
                    <p className="mt-2 text-white/70 leading-relaxed">
                      Short, practical guidance to match the day: tone, pacing, support, and
                      connection — without stereotypes.
                    </p>
                  </div>
                </div>

                <ul className="mt-4 grid gap-2 text-white/75 leading-relaxed list-disc pl-5">
                  <li>No symptom diary required.</li>
                  <li>Guidance is general, respectful, and relationship-first.</li>
                  <li>
                    Premium+ calibration: cycle length <strong className="text-white">21–35</strong>{" "}
                    days and menstruation <strong className="text-white">2–8</strong> days.
                  </li>
                  <li>Private by design — and Premium+ messaging states no cycle details leave your device.</li>
                </ul>

                <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:items-center">
                  <Link href="/pro" className="mm-link text-sm text-white/80">
                    See what Premium+ unlocks →
                  </Link>
                  <Link href="/#download" className="mm-link text-sm text-white/80">
                    Download MoodMap →
                  </Link>
                </div>
              </div>
            </div>
          </article>

          {/* Card 6 */}
          <article className="glass-card p-6 sm:p-7">
            <div className="flex items-start gap-4">
              <span className="glass-icon">
                <TriangleAlert className="h-6 w-6 text-white" aria-hidden />
              </span>
              <div className="text-left">
                <h2 className="text-xl sm:text-2xl font-semibold">Common mistakes to avoid</h2>
                <ul className="mt-3 grid gap-2 text-white/75 leading-relaxed list-disc pl-5">
                  <li>
                    <strong className="text-white">Don’t weaponize timing</strong> (“You’re only
                    saying that because…”).
                  </li>
                  <li>
                    <strong className="text-white">Don’t pressure</strong> intimacy or plans based on
                    a date on a calendar.
                  </li>
                  <li>
                    <strong className="text-white">Don’t assume</strong> she will feel a certain way
                    “because it’s ovulation.”
                  </li>
                  <li>
                    <strong className="text-white">Don’t use this for contraception/fertility</strong>.
                    If that’s your goal, talk to a qualified clinician and use appropriate methods.
                  </li>
                </ul>

                <p className="mt-4 text-white/70">
                  Timing awareness should increase respect — not reduce autonomy.
                </p>

                <div className="mt-6 text-sm text-white/60">
                  Related reading:{" "}
                  <Link href="/learn/support-partner-during-pms" className="mm-link">
                    support your partner during PMS
                  </Link>
                </div>
              </div>
            </div>
          </article>

          {/* End-of-guide CTA */}
          <section className="mt-2 text-center">
            <div className="glass-card p-6 sm:p-7">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs sm:text-sm text-white/70 ring-1 ring-white/12 backdrop-blur">
                <Sparkles className="h-4 w-4 opacity-90" aria-hidden />
                Next step: keep it simple for two cycles
              </div>

              <p className="mt-3 mx-auto max-w-2xl text-sm sm:text-[15px] text-white/75 leading-relaxed">
                The goal isn’t “perfect prediction.” It’s calmer communication, better timing, and a
                more supportive baseline — with consent.
              </p>

              <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/#download" className="btn-primary">
                  Download MoodMap
                </Link>
                <Link href="/learn" className="mm-link text-sm text-white/70">
                  Explore more Guides →
                </Link>
              </div>

              <p className="mt-4 text-xs sm:text-sm text-white/55">
                Relationship guidance — not medical advice. Not for contraception or fertility planning.
              </p>
            </div>
          </section>

          {/* Visible FAQs */}
          <section className="mt-2">
            <div className="glass-card p-6 sm:p-7">
              <h2 className="text-lg sm:text-xl font-semibold text-white">FAQs</h2>
              <p className="mt-2 text-sm text-white/60">
                Short answers to common questions. Relationship guidance — not medical advice.
              </p>

              <div className="mt-5 space-y-3">
                {FAQ.map(({ q, a }) => (
                  <details
                    key={q}
                    className="group rounded-xl bg-white/5 ring-1 ring-white/10 px-4 py-3"
                  >
                    <summary className="cursor-pointer select-none list-none font-semibold text-white flex items-center justify-between">
                      <span className="pr-3">{q}</span>
                      <span className="text-white/50 group-open:rotate-180 transition-transform">
                        ▾
                      </span>
                    </summary>
                    <p className="mt-2 text-white/75 leading-relaxed">{a}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          {/* Bottom nav */}
          <div className="pt-2 text-center">
            <Link href="/learn" className="mm-link text-sm text-white/70">
              ← Back to Guides
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
