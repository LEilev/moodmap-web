// src/app/page.js
import { Map, BellRing, Sparkles, HeartHandshake } from "lucide-react";
import { FaApple, FaGooglePlay } from "react-icons/fa";
import { SAMPLE_BRIEFING } from "../lib/proofContent";

const FEATURES = [
  {
    Icon: Map,
    title: "Cycle Overview",
    copy:
      "See the cycle mapped out clearly — calibrated to her cycle length (21–35 days), not a generic 28-day template.",
  },
  {
    Icon: BellRing,
    title: "Timing Alerts",
    copy:
      "Timely heads-ups for critical moments (PMS, ovulation, fertile window) so you can lead with warmth — or give space — before it’s needed.",
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
      "Short daily check-ins so you stay grounded — calmer tone, steadier pacing, better timing.",
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

      {/* Sample Guidance */}
      <section className="px-6 pb-12 sm:pb-16 text-center">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col items-center">
            <span className="inline-flex items-center rounded-full border border-white/12 bg-white/5 px-3 py-1 text-[11px] font-semibold tracking-[0.28em] text-white/65 uppercase">
              Sample guidance
            </span>

            <h2 className="mt-5 text-2xl sm:text-3xl font-semibold">
              A daily briefing — in context
            </h2>

            <p className="mt-4 max-w-2xl text-sm sm:text-[15px] text-white/70 leading-relaxed">
              One real example of how MoodMap writes: a clear prompt, then the reasoning — tuned to
              her phase and the day.
            </p>
          </div>

          <div className="mt-9 mx-auto max-w-[980px]">
            <div className="relative overflow-hidden rounded-2xl border border-white/12 bg-white/[0.06] backdrop-blur-xl shadow-2xl">
              {/* Glass gloss + top hairline */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-400/10 via-transparent to-blue-500/10"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
              />
              <div className="relative p-7 sm:p-9 text-left">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold tracking-[0.2em] text-white/75 uppercase">
                      {SAMPLE_BRIEFING.deckNav}
                    </span>
                    <span className="text-xs text-white/55">{SAMPLE_BRIEFING.deckFull}</span>
                  </div>

                  <div className="text-xs text-white/55 tracking-wide">
                    {SAMPLE_BRIEFING.phase} • Day {SAMPLE_BRIEFING.day}
                  </div>
                </div>

                <h3 className="mt-5 text-xl sm:text-2xl font-semibold text-white/90 leading-snug">
                  {SAMPLE_BRIEFING.text}
                </h3>

                <div className="mt-5 h-px w-full bg-white/10" />

                <div className="mt-5">
                  <p className="text-[11px] font-semibold tracking-[0.22em] text-white/55 uppercase">
                    Notes
                  </p>

                  <ul className="mt-3 space-y-2 text-sm sm:text-[15px] text-white/70 leading-relaxed">
                    {SAMPLE_BRIEFING.suggestions.map((line, idx) => (
                      <li key={idx} className="flex gap-3">
                        <span
                          aria-hidden="true"
                          className="mt-[0.55rem] h-1.5 w-1.5 flex-none rounded-full bg-white/35"
                        />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <p className="mt-4 text-xs sm:text-sm text-white/55">
              MoodMap delivers a full daily briefing tuned to her rhythm — with timing alerts when
              notifications matter.
            </p>
          </div>
        </div>
      </section>

      {/* About + Features */}
      <section id="about" className="scroll-mt-24 px-6 pb-12 sm:pb-16">
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
              <article key={title} className="glass-card glass-card-hover p-6 text-left group">
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

                <p className="mt-2 text-sm sm:text-[15px] text-white/70 leading-relaxed">{copy}</p>
                <div aria-hidden="true" className="glass-gloss" />
              </article>
            ))}
          </div>

          <p className="mt-4 text-center text-xs sm:text-sm text-white/55">
            Timing alerts are delivered via optional notifications.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 pt-6 pb-14 sm:pt-8 sm:pb-16 text-center">
        <div className="mx-auto max-w-3xl">
          <div aria-hidden="true" className="mx-auto mb-7 h-px w-24 bg-white/10" />
          <h2 className="text-2xl sm:text-3xl font-semibold">Ready to strengthen your bond?</h2>
          <p className="mt-3 text-sm sm:text-[15px] text-white/70">
            Download MoodMap and start with today’s phase-aware briefing.
          </p>

          <div className="mt-7 flex flex-col sm:flex-row justify-center items-stretch gap-3 sm:gap-4">
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

          <p className="mt-6 text-xs sm:text-sm text-white/55">
            When her rhythm is respected, everyday life gets a little gentler for you both.
          </p>
        </div>
      </section>
    </main>
  );
}
