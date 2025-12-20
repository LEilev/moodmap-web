// src/app/learn/menstrual-cycle-phases-for-partners/page.js
import Link from "next/link";
import {
  Map,
  CalendarDays,
  Sparkles,
  HeartHandshake,
  Shield,
  Clock,
} from "lucide-react";

export const metadata = {
  title: "Menstrual cycle phases explained for partners · MoodMap",
  description:
    "A clear, partner-friendly explanation of menstrual cycle phases—what happens, why timing matters, and how to show up well. Relationship guidance, not medical advice.",
  alternates: {
    canonical: "/learn/menstrual-cycle-phases-for-partners",
  },
};

export default function CyclePhasesForPartnersPage() {
  // One source of truth: used for BOTH JSON-LD and visible FAQs
  const FAQ = [
    {
      q: "What are the phases of the menstrual cycle?",
      a: "A common model includes Menstruation, Follicular, Ovulation, and Luteal (often including PMS near the end). Phases can influence energy and sensitivity—use it as context, not a stereotype.",
    },
    {
      q: "Why isn’t every cycle exactly 28 days?",
      a: "Cycle length varies naturally from person to person and sometimes month to month. That’s why calibration and flexible expectations matter more than a fixed calendar.",
    },
    {
      q: "Does ovulation affect mood or behavior?",
      a: "For some people, ovulation can coincide with higher energy or confidence, while others notice little change. Patterns vary—timing awareness is about context, not assumptions.",
    },
    {
      q: "Is this medical advice?",
      a: "No. This page (and MoodMap) provides relationship guidance informed by general physiology. It is not medical advice and should not be used for contraception or fertility planning.",
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

          <h1 className="mt-6 text-balance text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
            Menstrual cycle phases, explained for partners
          </h1>

          <p className="mt-4 text-pretty text-base sm:text-lg text-white/75 leading-relaxed">
            If you’ve ever thought “she feels like a different person week to week,” you’re not
            crazy. Timing and context matter. This guide breaks the cycle into simple phases and
            shows what tends to change—so you can respond well, not late.
          </p>

          <p className="mt-3 text-sm text-white/60">
            Everyone is different. Use this as a calm baseline, not a script.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="px-6 pb-14">
        <div className="mx-auto max-w-4xl grid gap-6">
          {/* Card: quick overview */}
          <article className="glass-card p-6 sm:p-7">
            <div className="flex items-start gap-4">
              <span className="glass-icon">
                <Map className="h-6 w-6 text-white" aria-hidden />
              </span>
              <div className="text-left">
                <h2 className="text-xl sm:text-2xl font-semibold">
                  The short version (the 4-phase model)
                </h2>
                <p className="mt-2 text-white/75 leading-relaxed">
                  A common, partner-friendly model is four phases: Menstruation → Follicular →
                  Ovulation → Luteal (often including PMS near the end). Hormone levels shift across
                  the cycle, which can influence energy, sensitivity, and desire for connection.
                </p>

                <ul className="mt-4 grid gap-2 text-white/75 leading-relaxed list-disc pl-5">
                  <li>
                    <strong className="text-white">Menstruation:</strong> lower energy, more physical
                    discomfort for some, more inward days.
                  </li>
                  <li>
                    <strong className="text-white">Follicular:</strong> energy often rises; planning
                    and initiative can feel easier.
                  </li>
                  <li>
                    <strong className="text-white">Ovulation:</strong> some people feel more social,
                    confident, or playful—others feel no change.
                  </li>
                  <li>
                    <strong className="text-white">Luteal/PMS:</strong> sensitivity and stress
                    tolerance can shift; recovery and calm matter more.
                  </li>
                </ul>

                <p className="mt-4 text-white/70">
                  The point isn’t to stereotype. It’s to stop being surprised by predictable timing
                  windows.
                </p>
              </div>
            </div>
          </article>

          {/* Card: why cycles vary */}
          <article className="glass-card p-6 sm:p-7">
            <div className="flex items-start gap-4">
              <span className="glass-icon">
                <CalendarDays className="h-6 w-6 text-white" aria-hidden />
              </span>
              <div className="text-left">
                <h2 className="text-xl sm:text-2xl font-semibold">Why not every cycle is 28 days</h2>
                <p className="mt-2 text-white/75 leading-relaxed">
                  The “28-day cycle” is a teaching average—not a rule. Real cycles vary naturally.
                  Stress, sleep, travel, and illness can also shift timing.
                </p>
                <p className="mt-3 text-white/75 leading-relaxed">
                  That’s why rigid calendar expectations often fail partners: if timing is off, your
                  “big talk” day can land at the worst possible moment.
                </p>

                <p className="mt-4 text-white/70">
                  MoodMap Premium+ supports calibrating cycle length (21–35 days) and menstruation
                  length (2–8 days), so guidance aligns better with her rhythm.
                </p>
              </div>
            </div>
          </article>

          {/* Card: what changes practically */}
          <article className="glass-card p-6 sm:p-7">
            <div className="flex items-start gap-4">
              <span className="glass-icon">
                <Clock className="h-6 w-6 text-white" aria-hidden />
              </span>
              <div className="text-left">
                <h2 className="text-xl sm:text-2xl font-semibold">
                  What “phase-aware” means in a relationship
                </h2>
                <p className="mt-2 text-white/75 leading-relaxed">
                  Phase-aware support isn’t about guessing her emotions. It’s about adjusting timing
                  and approach:
                </p>

                <div className="mt-5 grid gap-5">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-white">
                      1) Timing big conversations
                    </h3>
                    <p className="mt-2 text-white/75 leading-relaxed">
                      If you want a productive talk, choose a day with more bandwidth—not a day when
                      patience and sensitivity are already stretched.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-white">
                      2) Matching “energy level”
                    </h3>
                    <p className="mt-2 text-white/75 leading-relaxed">
                      Some days call for action and plans. Other days call for softness, fewer
                      demands, and calmer logistics.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-white">
                      3) Reducing friction
                    </h3>
                    <p className="mt-2 text-white/75 leading-relaxed">
                      When sensitivity is higher, small things land bigger. Cleaner tone, fewer
                      interruptions, and less pressure can prevent conflict before it starts.
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-white/70">
                  This is why timing awareness helps: you’re not “tiptoeing”—you’re operating with
                  context.
                </p>
              </div>
            </div>
          </article>

          {/* Card: soft plug */}
          <article className="glass-card p-6 sm:p-7">
            <div className="flex items-start gap-4">
              <span className="glass-icon">
                <HeartHandshake className="h-6 w-6 text-white" aria-hidden />
              </span>
              <div className="text-left">
                <h2 className="text-xl sm:text-2xl font-semibold">
                  How MoodMap uses this (without being creepy)
                </h2>
                <p className="mt-2 text-white/75 leading-relaxed">
                  MoodMap turns phase timing into a daily briefing: what phase it is, what may be
                  harder or easier today, and practical do/don’t cues. It can highlight timing
                  moments like PMS, ovulation, and fertile-window context so you’re not guessing.
                </p>

                <ul className="mt-4 grid gap-2 text-white/75 leading-relaxed list-disc pl-5">
                  <li>No symptom diary required.</li>
                  <li>Guidance is general and respectful—built for partners.</li>
                  <li>Premium+ calibration keeps timing aligned to her rhythm.</li>
                </ul>

                {/* Removed duplicate Download CTA (kept the single primary CTA at end-of-guide) */}
                <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:items-center">
                  <Link href="/pro" className="mm-link text-sm text-white/80">
                    See what Premium+ unlocks →
                  </Link>
                  <Link
                    href="/learn/support-partner-during-pms"
                    className="mm-link text-sm text-white/80"
                  >
                    Read: Support your partner during PMS →
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
                Next step: Put this into practice
              </div>

              <p className="mt-3 mx-auto max-w-2xl text-sm sm:text-[15px] text-white/75 leading-relaxed">
                MoodMap gives day-by-day cues synced to her cycle — so you can act with timing,
                steadiness, and respect (without tracking her).
              </p>

              <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/#download" className="btn-primary">
                  Download MoodMap
                </Link>
                <Link href="/learn" className="mm-link text-sm text-white/70">
                  Explore more Guides →
                </Link>
              </div>
            </div>
          </section>

          {/* NEW: Visible FAQs (matches JSON-LD) */}
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
            <Link href="/" className="mm-link text-sm text-white/70">
              ← Back to Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
