// src/app/learn/why-moodmap/page.js
import Link from "next/link";
import {
  Shield,
  Sparkles,
  Map,
  BellRing,
  HeartHandshake,
  Users,
  Lock,
  ListChecks,
  ArrowRight,
} from "lucide-react";

export const metadata = {
  title: "Why MoodMap",
  description:
    "MoodMap covers the cycle-tracking basics you’d expect — and adds a partner layer: daily, phase-aware context and practical guidance for men. Relationship guidance, not medical advice.",
  alternates: {
    canonical: "/learn/why-moodmap",
  },
};

export default function WhyMoodMapPage() {
  const COMPARISON = [
    {
      label: "Designed for",
      typical:
        "Primarily the person experiencing the cycle (personal tracking and insights).",
      moodmap:
        "Men in relationships who want phase-aware context and better timing for support and communication.",
    },
    {
      label: "Primary goal",
      typical:
        "Track dates, predict the next period, and optionally support fertility or health journaling.",
      moodmap:
        "Provide cycle-aware context that helps a partner show up better — calmer timing, clearer expectations, steadier support.",
    },
    {
      label: "What you see day-to-day",
      typical:
        "Calendars, cycle charts, logs, and raw phase labels (often requiring interpretation).",
      moodmap:
        "Short daily briefings that translate timing into practical cues (without stereotypes).",
    },
    {
      label: "Input burden",
      typical:
        "Often expects ongoing symptom logging (mood, flow, pain, etc.).",
      moodmap:
        "Optimized for minimal input and partner usability — the goal is context, not a detailed symptom diary.",
    },
    {
      label: "Best for",
      typical:
        "Personal self-tracking, journaling, and health discussions (including with clinicians when relevant).",
      moodmap:
        "Relationship timing and partner behavior: support, tone, pacing, and planning with better context.",
    },
    {
      label: "Not designed for",
      typical:
        "Giving a partner practical relationship cues (most are not written for men).",
      moodmap:
        "Medical advice, diagnosis, contraception, or fertility planning.",
    },
  ];

  const FAQ = [
    {
      q: "Is MoodMap a real period tracker — or only “relationship tips”?",
      a: "MoodMap covers the cycle-tracking basics you’d expect (cycle overview and optional timing alerts). The difference is that it also adds a partner layer: daily, phase-aware context and practical guidance for men.",
    },
    {
      q: "Is MoodMap meant to replace my partner’s period tracker?",
      a: "Not necessarily. Many couples use MoodMap as the partner-facing layer while she uses any tracker she prefers for her own needs. MoodMap’s job is to translate timing into context for you.",
    },
    {
      q: "Does MoodMap predict ovulation or the fertile window precisely?",
      a: "MoodMap can highlight timing windows as general context. It is not medical advice and should not be used for contraception or fertility planning.",
    },
    {
      q: "What makes MoodMap different from a typical period tracking app?",
      a: "Typical trackers focus on the individual user and often rely on ongoing logs. MoodMap is written for men: it focuses on timing, self-regulation, and practical cues — helping you show up better in real life.",
    },
    {
      q: "Is this creepy or invasive?",
      a: "It’s supportive when done with consent and transparency. The boundary is simple: ask first, track minimally, and never weaponize timing in arguments.",
    },
    {
      q: "Is this medical advice?",
      a: "No. MoodMap provides relationship guidance informed by general physiology. If there are health concerns, consult a qualified clinician.",
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
    <main className="relative isolate overflow-x-hidden bg-primary-blue text-white">
      {/* FAQ JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Subtle premium glows (consistent with site) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 -top-24 h-[34rem] w-[34rem] rounded-full bg-gradient-to-br from-emerald-400/18 to-blue-500/18 blur-[170px] sm:blur-[220px] md:opacity-30 -z-10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-44 top-28 h-[36rem] w-[36rem] rounded-full bg-gradient-to-tr from-blue-500/18 to-emerald-400/16 blur-[180px] sm:blur-[240px] md:opacity-30 -z-10"
      />

      {/* HERO */}
      <section className="px-6 pt-12 pb-10 sm:pt-16 sm:pb-12">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs sm:text-sm text-white/70 ring-1 ring-white/12 backdrop-blur">
            <Shield className="h-4 w-4 opacity-90" aria-hidden />
            Relationship guidance — not medical advice
          </div>

          <h1 className="mt-6 text-balance text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
            Why MoodMap
          </h1>

          <p className="mt-4 mx-auto max-w-2xl text-pretty text-base sm:text-lg text-white/75 leading-relaxed">
            MoodMap covers the cycle-tracking basics you’d expect — and adds a partner layer:
            <strong className="text-white"> daily, phase-aware context and practical guidance for men</strong>.
            <span className="block mt-2 text-white/65">
              It’s built for better timing, calmer communication, and more respect — not stereotypes.
            </span>
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/#download" className="btn-primary">
              Download MoodMap
            </Link>
            <Link href="/pro" className="mm-link text-sm text-white/75">
              See what Premium+ unlocks →
            </Link>
          </div>

          <p className="mt-4 mx-auto max-w-2xl text-xs sm:text-sm text-white/55 leading-relaxed">
            Not for contraception or fertility planning. If there are health concerns, consult a qualified clinician.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="px-6 pb-14 sm:pb-16">
        <div className="mx-auto max-w-5xl grid gap-6">
          {/* 1) Two approaches */}
          <article className="glass-card p-6 sm:p-7 text-left">
            <div className="flex items-start gap-4">
              <span className="glass-icon">
                <Users className="h-6 w-6 text-white" aria-hidden />
              </span>

              <div>
                <h2 className="text-xl sm:text-2xl font-semibold">
                  Two approaches, two audiences
                </h2>
                <p className="mt-2 text-white/75 leading-relaxed">
                  Most period trackers are designed for the person experiencing the cycle — which makes perfect sense.
                  They help her track timing and, in many apps, log symptoms or personal data for her own use.
                </p>
                <p className="mt-3 text-white/75 leading-relaxed">
                  MoodMap is different in purpose: it’s written for <strong className="text-white">men in relationships</strong>.
                  The goal isn’t “more data.” The goal is <strong className="text-white">better timing</strong>:
                  knowing when to slow down, when to avoid pushing tough conversations, and how to stay steady.
                </p>

                <div className="mt-5 text-sm text-white/60">
                  If you’re new to the concept, start here:{" "}
                  <Link href="/learn/period-tracking-for-men" className="mm-link">
                    period tracking for men
                  </Link>
                  .
                </div>
              </div>
            </div>

            <div aria-hidden="true" className="glass-gloss" />
          </article>

          {/* 2) Comparison table */}
          <article className="glass-card p-6 sm:p-7 text-left">
            <h2 className="text-xl sm:text-2xl font-semibold">
              MoodMap vs typical period trackers (a clear comparison)
            </h2>
            <p className="mt-2 text-white/75 leading-relaxed">
              This isn’t about “better” in general — it’s about the right tool for the job.
              Here’s the difference at a glance:
            </p>

            <div className="mt-5 overflow-x-auto rounded-xl ring-1 ring-white/10 bg-white/5">
              <table className="w-full min-w-[760px] border-collapse text-sm">
                <thead>
                  <tr className="text-left">
                    <th className="p-4 font-semibold text-white/80">Aspect</th>
                    <th className="p-4 font-semibold text-white/80">Typical period tracker</th>
                    <th className="p-4 font-semibold text-white/80">MoodMap</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON.map((row) => (
                    <tr key={row.label} className="border-t border-white/10 align-top">
                      <td className="p-4 font-semibold text-white/85">{row.label}</td>
                      <td className="p-4 text-white/75 leading-relaxed">{row.typical}</td>
                      <td className="p-4 text-white/75 leading-relaxed">{row.moodmap}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-4 text-xs sm:text-sm text-white/55">
              Note: many apps are excellent at what they’re designed for. MoodMap is focused on partner context and behavior.
            </p>
          </article>

          {/* 3) Basics + Partner layer */}
          <div className="grid gap-6 lg:grid-cols-2">
            <article className="glass-card p-6 sm:p-7 text-left">
              <div className="flex items-start gap-4">
                <span className="glass-icon">
                  <Map className="h-6 w-6 text-white" aria-hidden />
                </span>
                <div>
                  <h2 className="text-xl sm:text-2xl font-semibold">
                    What MoodMap includes (the cycle-tracking basics)
                  </h2>
                  <p className="mt-2 text-white/75 leading-relaxed">
                    MoodMap includes the timing foundation people expect from a tracker: cycle overview and a clear sense of
                    where she is in the month — without forcing you into medical jargon.
                  </p>

                  <ul className="mt-4 list-disc pl-5 grid gap-2 text-white/75 leading-relaxed">
                    <li>
                      <strong className="text-white">Cycle overview</strong> (not a confusing chart wall).
                    </li>
                    <li>
                      <strong className="text-white">Phase framing</strong> (so timing has meaning).
                    </li>
                    <li>
                      <strong className="text-white">Optional alerts</strong> for key windows (so you can prepare).
                    </li>
                  </ul>

                  <div className="mt-5 text-sm text-white/60">
                    Related reading:{" "}
                    <Link href="/learn/menstrual-cycle-phases-for-partners" className="mm-link">
                      cycle phases explained
                    </Link>
                    .
                  </div>
                </div>
              </div>
              <div aria-hidden="true" className="glass-gloss" />
            </article>

            <article className="glass-card p-6 sm:p-7 text-left">
              <div className="flex items-start gap-4">
                <span className="glass-icon">
                  <Sparkles className="h-6 w-6 text-white" aria-hidden />
                </span>
                <div>
                  <h2 className="text-xl sm:text-2xl font-semibold">
                    What MoodMap adds (the partner layer for men)
                  </h2>
                  <p className="mt-2 text-white/75 leading-relaxed">
                    This is the difference: MoodMap translates timing into practical cues — small guardrails that help you
                    choose a better tone, pace, and plan for the day.
                  </p>

                  <ul className="mt-4 list-disc pl-5 grid gap-2 text-white/75 leading-relaxed">
                    <li>
                      <strong className="text-white">Daily phase-aware briefings</strong> (short and usable).
                    </li>
                    <li>
                      <strong className="text-white">Practical do/don’t guidance</strong> (without stereotypes).
                    </li>
                    <li>
                      <strong className="text-white">Self-regulation prompts</strong> (stay steady when timing is sensitive).
                    </li>
                  </ul>

                  <div className="mt-5 text-sm text-white/60">
                    Related reading:{" "}
                    <Link href="/learn/support-partner-during-pms" className="mm-link">
                      support during PMS
                    </Link>
                    .
                  </div>
                </div>
              </div>
              <div aria-hidden="true" className="glass-gloss" />
            </article>
          </div>

          {/* 4) Timing alerts (clarify without being creepy) */}
          <article className="glass-card p-6 sm:p-7 text-left">
            <div className="flex items-start gap-4">
              <span className="glass-icon">
                <BellRing className="h-6 w-6 text-white" aria-hidden />
              </span>

              <div>
                <h2 className="text-xl sm:text-2xl font-semibold">
                  Timing alerts are optional — respect stays mandatory
                </h2>
                <p className="mt-2 text-white/75 leading-relaxed">
                  MoodMap can surface optional timing windows (like PMS or fertile-window context) so you can prepare.
                  The goal is <strong className="text-white">better support</strong>, not pressure, and never control.
                </p>

                <div className="mt-4 rounded-xl bg-white/5 ring-1 ring-white/10 p-4">
                  <p className="text-white/80 leading-relaxed">
                    <strong className="text-white">Rule of thumb:</strong> use timing as{" "}
                    <em>your</em> reminder to be more patient — not as a label you put on her.
                  </p>
                </div>

                <div className="mt-5 text-sm text-white/60">
                  Related reading:{" "}
                  <Link href="/learn/fertile-window-explained" className="mm-link">
                    fertile window explained (respectfully)
                  </Link>
                  .
                </div>
              </div>
            </div>

            <div aria-hidden="true" className="glass-gloss" />
          </article>

          {/* 5) Who it's for / not for */}
          <div className="grid gap-6 lg:grid-cols-2">
            <article className="glass-card p-6 sm:p-7 text-left">
              <div className="flex items-start gap-4">
                <span className="glass-icon">
                  <ListChecks className="h-6 w-6 text-white" aria-hidden />
                </span>
                <div>
                  <h2 className="text-xl sm:text-2xl font-semibold">Who MoodMap is for</h2>
                  <ul className="mt-3 list-disc pl-5 grid gap-2 text-white/75 leading-relaxed">
                    <li>Men who want to support their partner with better timing and calmer tone.</li>
                    <li>Couples who want fewer misunderstandings around sensitive weeks.</li>
                    <li>People who prefer practical cues over dense charts and constant logging.</li>
                  </ul>
                </div>
              </div>
            </article>

            <article className="glass-card p-6 sm:p-7 text-left">
              <div className="flex items-start gap-4">
                <span className="glass-icon">
                  <Lock className="h-6 w-6 text-white" aria-hidden />
                </span>
                <div>
                  <h2 className="text-xl sm:text-2xl font-semibold">Who it’s not for</h2>
                  <ul className="mt-3 list-disc pl-5 grid gap-2 text-white/75 leading-relaxed">
                    <li>Anyone looking for medical advice, diagnosis, or treatment.</li>
                    <li>Anyone looking for contraception guidance or fertility planning.</li>
                    <li>Anyone who wants to track a partner secretly (consent comes first).</li>
                  </ul>
                </div>
              </div>
            </article>
          </div>

          {/* 6) How to use it (actionable) */}
          <article className="glass-card p-6 sm:p-7 text-left">
            <h2 className="text-xl sm:text-2xl font-semibold">
              How to use MoodMap well (in real life)
            </h2>
            <p className="mt-2 text-white/75 leading-relaxed">
              The goal is not “perfect prediction.” It’s consistent behavior: steadier pacing, better timing, and more respect.
              A simple playbook:
            </p>

            <ol className="mt-4 list-decimal pl-5 grid gap-3 text-white/75 leading-relaxed">
              <li>
                <strong className="text-white">Ask first.</strong> Be explicit about your intention: support and planning, not monitoring.
              </li>
              <li>
                <strong className="text-white">Track minimally.</strong> Focus on windows that help you show up better (not “explaining” her feelings).
              </li>
              <li>
                <strong className="text-white">Use the briefing as a guardrail.</strong> Let it change your tone and timing — not your respect.
              </li>
            </ol>

            <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
              <Link href="/learn/period-tracking-for-men" className="mm-link text-sm text-white/80">
                Read: Period tracking for men →
              </Link>
              <Link href="/learn" className="mm-link text-sm text-white/80">
                Explore all Guides →
              </Link>
            </div>
          </article>

          {/* CTA */}
          <article className="glass-card p-6 sm:p-7 text-center">
            <h2 className="text-2xl sm:text-3xl font-semibold">
              Ready to try the “partner layer”?
            </h2>
            <p className="mt-3 mx-auto max-w-2xl text-white/75 leading-relaxed">
              MoodMap is built for men who want to lead with timing — not tiptoe with guesswork.
              Start with today’s phase-aware briefing.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/#download" className="btn-primary">
                Download MoodMap
              </Link>
              <Link href="/pro" className="mm-link text-sm text-white/75">
                Premium+ details <ArrowRight className="inline h-4 w-4" aria-hidden />
              </Link>
            </div>

            <p className="mt-4 text-xs sm:text-sm text-white/55">
              Relationship guidance — not medical advice. Not for contraception or fertility planning.
            </p>
          </article>

          {/* Visible FAQs */}
          <section className="mt-2">
            <div className="glass-card p-6 sm:p-7 text-left">
              <h2 className="text-lg sm:text-xl font-semibold text-white">FAQs</h2>
              <p className="mt-2 text-sm text-white/60">
                Short answers to common questions.
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
