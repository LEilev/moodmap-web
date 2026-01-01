// src/app/page.js
import { Map, BellRing, Sparkles, HeartHandshake } from "lucide-react";
import { FaApple, FaGooglePlay } from "react-icons/fa";

import { SAMPLE_GUIDANCE } from "../lib/proofContent";

const FEATURES = [
  {
    Icon: Map,
    title: "Cycle Overview",
    copy:
      "See the cycle mapped clearly — calibrated to her cycle length (21–35 days), not a generic 28-day template.",
  },
  {
    Icon: BellRing,
    title: "Timing Alerts",
    copy:
      "Optional notifications for key windows (PMS, ovulation, fertile window) — so you can time support before it’s needed.",
  },
  {
    Icon: Sparkles,
    title: "Tips & Intimacy",
    copy:
      "Daily phase-aware guidance — practical actions, guardrails, and connection cues — matched to the day.",
  },
  {
    Icon: HeartHandshake,
    title: "Self-Regulation",
    copy:
      "Short daily checks to keep you steady — calmer tone, steadier pacing, better timing.",
  },
];

export default function HomePage() {
  return (
    <main className="relative isolate bg-primary-blue text-white">
      {/* Subtle premium glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 -top-24 h-[34rem] w-[34rem] rounded-full bg-gradient-to-br from-emerald-400/20 to-blue-500/20 blur-[160px] sm:blur-[200px] md:opacity-30 -z-10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-44 top-28 h-[36rem] w-[36rem] rounded-full bg-gradient-to-tr from-blue-500/20 to-emerald-400/18 blur-[170px] sm:blur-[220px] md:opacity-30 -z-10"
      />

      {/* Hero */}
      <section className="px-6 pt-14 pb-10 sm:pt-20 sm:pb-12 text-center">
        <h1 className="mx-auto max-w-5xl text-balance text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
          <span className="bg-gradient-to-r from-emerald-300 via-emerald-400 to-blue-400 bg-clip-text text-transparent">
            Understand her cycle.
          </span>{" "}
          <span className="block bg-gradient-to-r from-emerald-300 via-emerald-400 to-blue-400 bg-clip-text text-transparent">
            Strengthen your bond.
          </span>
        </h1>

        <p className="mt-5 mx-auto max-w-2xl text-pretty text-base sm:text-lg text-white/75 leading-relaxed">
          Daily, phase-aware guidance that helps you anticipate her needs — and time your support
          and intimacy — with clarity, not guesswork.
        </p>

        <p className="mt-3 mx-auto max-w-2xl text-sm text-white/60">
          Built for real life: direct, respectful, and actionable in under a minute.
        </p>

        {/* Download */}
        <div
          id="download"
          className="mt-8 flex flex-col sm:flex-row justify-center items-stretch gap-3 sm:gap-4"
        >
          <a
            href="https://apps.apple.com/no/app/moodmap-moodcoaster/id6746102626?l=nb"
            className="store-btn"
          >
            <span className="store-btn__icon" aria-hidden>
              <FaApple />
            </span>
            Download on the App Store
          </a>

          <a
            href="https://play.google.com/store/apps/details?id=com.eilev.moodmapnextgen"
            className="store-btn"
          >
            <span className="store-btn__icon" aria-hidden>
              <FaGooglePlay />
            </span>
            Get it on Google Play
          </a>
        </div>
      </section>

      {/* Single sample (polished) */}
      <section className="px-6 pb-14 sm:pb-16">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-[11px] sm:text-xs uppercase tracking-[0.32em] text-white/40">
              Sample guidance
            </p>
            <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-semibold">
              A daily briefing — in context
            </h2>
            <p className="mt-4 mx-auto max-w-3xl text-white/70 leading-relaxed">
              One real example of how MoodMap writes: a clear prompt, then the reasoning — tuned to
              her phase and the day.
            </p>
          </div>

          <div className="mt-10 mx-auto max-w-[980px]">
            <article className="glass-card overflow-hidden relative">
              {/* Rim light + subtle gradient (depth) */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-white/0 to-transparent"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl"
              />

              {/* Top block */}
              <div className="relative p-6 sm:p-8">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white/75 tracking-[0.18em] uppercase">
                      PLAN
                    </span>
                    <span className="text-[11px] sm:text-xs text-white/55">
                      Action Plan
                    </span>
                  </div>

                  <span className="text-[11px] sm:text-xs font-medium text-white/55">
                    {SAMPLE_GUIDANCE.phase} • Day {SAMPLE_GUIDANCE.day}
                  </span>
                </div>

                <h3 className="mt-5 text-xl sm:text-2xl md:text-[26px] font-semibold tracking-tight text-white leading-snug">
                  {SAMPLE_GUIDANCE.text}
                </h3>

                <div className="mt-6 h-px w-full bg-white/10" />
              </div>

              {/* Notes block (separate surface) */}
              <div className="relative bg-black/10 px-6 sm:px-8 py-6">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-white/45">
                    Why this works
                  </p>
                  <p className="text-[11px] text-white/35">5 notes</p>
                </div>

                <ul className="mt-4 space-y-3 text-sm sm:text-[15px] text-white/70 leading-relaxed">
                  {SAMPLE_GUIDANCE.why.map((bullet, i) => (
                    <li key={`${SAMPLE_GUIDANCE.id}-${i}`} className="flex gap-3">
                      <span
                        aria-hidden="true"
                        className="mt-[0.62em] h-1.5 w-1.5 shrink-0 rounded-full bg-white/35"
                      />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div aria-hidden="true" className="glass-gloss" />
            </article>

            <p className="mt-6 text-center text-xs sm:text-sm text-white/55">
              MoodMap delivers a full daily briefing tuned to her rhythm — plus optional notifications
              for key timing moments.
            </p>
          </div>
        </div>
      </section>

      {/* About + Features */}
      <section id="about" className="px-6 pb-12 sm:pb-14">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-semibold">Why MoodMap</h2>
            <p className="mt-4 mx-auto max-w-3xl text-white/75 leading-relaxed">
              Built for men who want to lead with timing — not tiptoe with guesswork. MoodMap turns
              her cycle into clear, daily guidance so you know when to offer warmth, when to give
              space, and how to stay steady through it all.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
            {FEATURES.map(({ Icon, title, badge, copy }) => (
              <article
                key={title}
                className="glass-card glass-card-hover p-6 text-left group relative"
              >
                <span className="glass-icon transition-transform duration-300 group-hover:scale-[1.03]">
                  <Icon className="h-6 w-6 text-white drop-shadow" aria-hidden />
                </span>

                <h3 className="text-base sm:text-lg font-semibold text-white flex flex-wrap items-center gap-2">
                  <span>{title}</span>
                  {badge ? (
                    <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-[11px] font-semibold text-white/70">
                      {badge}
                    </span>
                  ) : null}
                </h3>

                <p className="mt-2 text-sm sm:text-[15px] text-white/70 leading-relaxed">
                  {copy}
                </p>

                <div aria-hidden="true" className="glass-gloss" />
              </article>
            ))}
          </div>

          <p className="mt-5 text-center text-xs sm:text-sm text-white/55">
            Notifications are optional — the daily briefing works even if you keep it silent.
          </p>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-6 pt-2 pb-16 sm:pb-20 text-center">
        <div className="mx-auto max-w-3xl">
          <div aria-hidden="true" className="mx-auto mb-8 h-px w-20 bg-white/10" />

          <h2 className="text-2xl sm:text-3xl font-semibold">Ready to strengthen your bond?</h2>
          <p className="mt-3 text-white/75 leading-relaxed">
            Download MoodMap and start with today’s phase-aware briefing.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row justify-center items-stretch gap-3 sm:gap-4">
            <a
              href="https://apps.apple.com/no/app/moodmap-moodcoaster/id6746102626?l=nb"
              className="store-btn"
            >
              <span className="store-btn__icon" aria-hidden>
                <FaApple />
              </span>
              Download on the App Store
            </a>

            <a
              href="https://play.google.com/store/apps/details?id=com.eilev.moodmapnextgen"
              className="store-btn"
            >
              <span className="store-btn__icon" aria-hidden>
                <FaGooglePlay />
              </span>
              Get it on Google Play
            </a>
          </div>

          <p className="mt-6 text-center text-sm text-white/55">
            When her rhythm is respected, everyday life gets a little gentler for you both.
          </p>
        </div>
      </section>
    </main>
  );
}
