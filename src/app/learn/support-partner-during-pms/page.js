// src/app/learn/support-partner-during-pms/page.js
import Link from "next/link";
import {
  HeartHandshake,
  MessageCircle,
  Clock,
  TriangleAlert,
  Shield,
  Sparkles,
} from "lucide-react";

export const metadata = {
  title: "How to support your partner during PMS · MoodMap",
  description:
    "Practical, respectful tips for partners during PMS: what helps, what to avoid, and why timing matters. Relationship guidance, not medical advice.",
  alternates: {
    canonical: "/learn/support-partner-during-pms",
  },
};

export default function SupportPartnerDuringPMSPage() {
  // One source of truth: used for BOTH JSON-LD and visible FAQs
  const FAQ = [
    {
      q: "How can I support my partner during PMS?",
      a: "Start with empathy and timing. Offer practical support, reduce friction (less pressure, fewer big debates), and ask what kind of support she wants today (comfort, space, or help).",
    },
    {
      q: "What should I avoid saying or doing during PMS?",
      a: "Avoid minimizing, teasing, escalating, or forcing heavy conversations. Don’t treat her emotions like a problem to ‘solve’ in the moment—lead with listening and calm.",
    },
    {
      q: "Is MoodMap medical advice or fertility planning?",
      a: "No. MoodMap is relationship guidance informed by cycle physiology—meant for better timing and understanding. It is not medical advice and should not be used for contraception or fertility planning.",
    },
    {
      q: "What if her cycle isn’t 28 days?",
      a: "That’s common. MoodMap Premium+ supports cycle calibration (21–35 days) and menstruation length (2–8 days) so phase timing and daily cues stay aligned with her rhythm.",
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
            How to support your partner during PMS
          </h1>

          <p className="mt-4 text-pretty text-base sm:text-lg text-white/75 leading-relaxed">
            PMS can compress patience, energy, and emotional bandwidth. This page is a practical
            partner guide: what tends to help, what tends to backfire, and how timing changes the
            whole day.
          </p>

          <p className="mt-3 text-sm text-white/60">
            Everyone is different. Use this as a respectful baseline — and keep communication open.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="px-6 pb-14">
        <div className="mx-auto max-w-4xl grid gap-6">
          {/* Card 1 */}
          <article className="glass-card p-6 sm:p-7">
            <div className="flex items-start gap-4">
              <span className="glass-icon">
                <TriangleAlert className="h-6 w-6 text-white" aria-hidden />
              </span>
              <div className="text-left">
                <h2 className="text-xl sm:text-2xl font-semibold">What PMS can feel like</h2>
                <p className="mt-2 text-white/75 leading-relaxed">
                  PMS isn’t “one mood.” It can show up as a mix of physical and emotional load.
                  Common patterns include:
                </p>

                <ul className="mt-4 grid gap-2 text-white/75 leading-relaxed list-disc pl-5">
                  <li>Lower energy (social battery drains faster; small tasks feel heavier).</li>
                  <li>Higher sensitivity (tone, timing, and pressure land harder than usual).</li>
                  <li>Shorter fuse (less tolerance for chaos, noise, and unresolved conflict).</li>
                  <li>Physical discomfort (bloating, headache, cramps, sleep disruption).</li>
                </ul>

                <p className="mt-4 text-white/70">
                  Your job isn’t to label it. Your job is to reduce friction and increase safety.
                </p>
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
                <h2 className="text-xl sm:text-2xl font-semibold">What usually helps</h2>
                <p className="mt-2 text-white/75 leading-relaxed">
                  These are simple moves that tend to help across most relationships — without
                  being performative.
                </p>

                <div className="mt-5 grid gap-5">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-white">
                      1) Reduce the load
                    </h3>
                    <ul className="mt-2 grid gap-2 text-white/75 leading-relaxed list-disc pl-5">
                      <li>Handle one practical thing without announcing it.</li>
                      <li>Keep plans lighter; give extra buffer time.</li>
                      <li>Make the environment calmer (less noise, less clutter).</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-white">
                      2) Lead with steadiness
                    </h3>
                    <ul className="mt-2 grid gap-2 text-white/75 leading-relaxed list-disc pl-5">
                      <li>Speak 10–20% slower. Keep your tone clean.</li>
                      <li>Assume good intent. Don’t take the first spike personally.</li>
                      <li>Offer warmth in small doses: tea, blanket, quiet company.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-white">
                      3) Ask the one question that matters
                    </h3>
                    <p className="mt-2 text-white/75 leading-relaxed">
                      Instead of guessing, ask:{" "}
                      <span className="font-semibold text-white">
                        “Do you want comfort, space, or help today?”
                      </span>
                    </p>
                    <p className="mt-2 text-white/70">
                      That single question prevents a lot of “I tried, and it got worse.”
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
                <MessageCircle className="h-6 w-6 text-white" aria-hidden />
              </span>
              <div className="text-left">
                <h2 className="text-xl sm:text-2xl font-semibold">
                  What to avoid (common backfires)
                </h2>
                <p className="mt-2 text-white/75 leading-relaxed">
                  These aren’t “rules.” They’re patterns that tend to escalate stress during PMS.
                </p>

                <ul className="mt-4 grid gap-2 text-white/75 leading-relaxed list-disc pl-5">
                  <li>
                    <span className="font-semibold text-white">Minimizing</span> (“You’re overreacting,”
                    “It’s just hormones.”)
                  </li>
                  <li>
                    <span className="font-semibold text-white">Forcing heavy conversations</span>{" "}
                    (relationship audits, money fights, old receipts).
                  </li>
                  <li>
                    <span className="font-semibold text-white">Fixing-mode too fast</span> (solutions
                    before you’ve listened).
                  </li>
                  <li>
                    <span className="font-semibold text-white">Pressure</span> (social plans, intimacy,
                    decisions) when she’s signaling low bandwidth.
                  </li>
                  <li>
                    <span className="font-semibold text-white">Sarcasm & escalation</span> (it lands
                    harder and sticks longer).
                  </li>
                </ul>

                <p className="mt-4 text-white/70">
                  If the moment is hot: lower the temperature first. Then talk.
                </p>
              </div>
            </div>
          </article>

          {/* Card 4 */}
          <article className="glass-card p-6 sm:p-7">
            <div className="flex items-start gap-4">
              <span className="glass-icon">
                <Clock className="h-6 w-6 text-white" aria-hidden />
              </span>
              <div className="text-left">
                <h2 className="text-xl sm:text-2xl font-semibold">
                  Why timing matters (more than you think)
                </h2>
                <p className="mt-2 text-white/75 leading-relaxed">
                  PMS sits in a high-sensitivity window for many people. The same comment can land
                  as “fine” one week and “too much” the next. Timing awareness helps you:
                </p>

                <ul className="mt-4 grid gap-2 text-white/75 leading-relaxed list-disc pl-5">
                  <li>Choose calmer days for big conversations.</li>
                  <li>Plan rest and softness before the day becomes heavy.</li>
                  <li>Respond to sensitivity with support instead of surprise.</li>
                </ul>

                <p className="mt-4 text-white/70">
                  This isn’t about “walking on eggshells.” It’s about operating with context.
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
                  How MoodMap helps (if you want a daily cue)
                </h2>
                <p className="mt-2 text-white/75 leading-relaxed">
                  MoodMap is built for this exact problem: daily, phase-aware guidance for partners.
                  It highlights timing moments like PMS, ovulation, and the fertile window so you’re
                  not guessing.
                </p>

                <ul className="mt-4 grid gap-2 text-white/75 leading-relaxed list-disc pl-5">
                  <li>Daily “what to expect” + practical do/don’t tips.</li>
                  <li>Heads-ups before high-impact days.</li>
                  <li>
                    Premium+ calibration: cycle length <strong>21–35</strong> days and menstruation{" "}
                    <strong>2–8</strong> days.
                  </li>
                  <li>Private by design (no symptom diary required).</li>
                </ul>

                <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:items-center">
                  <Link href="/#download" className="btn-primary">
                    Download MoodMap
                  </Link>
                  <Link href="/pro" className="mm-link text-sm text-white/80">
                    See what Premium+ unlocks
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
                MoodMap gives day-by-day cues synced to her cycle — so you can lead with timing,
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
