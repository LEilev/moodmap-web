// src/app/page.js
import {
  Map,
  BellRing,
  Sparkles,
  HeartHandshake,
  Shield,
  Smartphone,
  RefreshCcw,
} from "lucide-react";
import { FaApple, FaGooglePlay } from "react-icons/fa";
import { PROOF_EXAMPLE } from "../lib/proofContent";

const APP_STORE_URL =
  "https://apps.apple.com/no/app/moodmap-moodcoaster/id6746102626?l=nb";
const GOOGLE_PLAY_URL =
  "https://play.google.com/store/apps/details?id=com.eilev.moodmapnextgen";

const FEATURES = [
  {
    Icon: Map,
    title: "Cycle Overview",
    copy:
      "See the cycle mapped out clearly — calibrated to her cycle length (21–35 days), not a generic 28-day model.",
  },
  {
    Icon: BellRing,
    title: "Timing Alerts",
    badge: "Premium+",
    copy:
      "Timely heads-ups for critical moments (PMS, ovulation, fertile window). Bring warmth, or give space — before it’s needed.",
  },
  {
    Icon: Sparkles,
    title: "Daily Tips",
    copy:
      "Short, specific guidance — from supportive gestures to intimacy ideas — matched to the day.",
  },
  {
    Icon: HeartHandshake,
    title: "Self-Care",
    copy:
      "Quick daily check-ins and rituals so you stay grounded — calmer, steadier, and better for both of you.",
  },
];

export default function HomePage() {
  // Proof flag: default ON (P0 ships proof). Set NEXT_PUBLIC_SHOW_PROOF="false" to disable quickly.
  const showProof = process.env.NEXT_PUBLIC_SHOW_PROOF !== "false";

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

      {/* 1) Hero / CTA */}
      <section className="px-6 pt-12 pb-10 sm:pt-20 sm:pb-14 text-center">
        <h1 className="mx-auto max-w-5xl text-balance text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
          <span className="bg-gradient-to-r from-emerald-300 via-emerald-400 to-blue-400 bg-clip-text text-transparent">
            Understand her cycle.
          </span>{" "}
          <span className="block bg-gradient-to-r from-emerald-300 via-emerald-400 to-blue-400 bg-clip-text text-transparent">
            Strengthen your bond.
          </span>
        </h1>

        <p className="mt-5 mx-auto max-w-2xl text-pretty text-base sm:text-lg text-white/75 leading-relaxed">
          Daily, cycle-aware guidance that helps you anticipate her needs and time your support and
          intimacy — with clarity, not guesswork.
        </p>

        {/* Mobile-first: keep secondary line off small screens to keep CTA above the fold */}
        <p className="mt-3 mx-auto max-w-2xl text-sm text-white/60 hidden sm:block">
          Think of it as relationship intel — phase-aware, respectful, and built for real life.
        </p>

        {/* Download */}
        <div
          id="download"
          className="scroll-mt-28 mt-8 flex flex-col sm:flex-row justify-center items-stretch gap-3 sm:gap-4"
        >
          <a href={APP_STORE_URL} className="store-btn">
            <span className="store-btn__icon" aria-hidden>
              <FaApple />
            </span>
            Download on the App Store
          </a>

          <a href={GOOGLE_PLAY_URL} className="store-btn">
            <span className="store-btn__icon" aria-hidden>
              <FaGooglePlay />
            </span>
            Get it on Google Play
          </a>
        </div>

        {/* Trust disclaimer (front-and-center) */}
        <p className="mt-4 mx-auto max-w-2xl text-xs sm:text-sm text-white/60 leading-relaxed">
          Relationship guidance — not medical advice. Not for contraception or fertility planning.
        </p>
        <p className="mt-2 mx-auto max-w-2xl text-xs sm:text-sm text-white/50 leading-relaxed">
          A support tool, not surveillance. No awkward tracking — just timing and guidance.
        </p>

        {/* Trust strip */}
        <div className="mt-7 flex justify-center">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 rounded-full bg-white/10 px-4 py-2 text-[13px] text-white/70 ring-1 ring-white/12 backdrop-blur">
            <span className="inline-flex items-center gap-1.5">
              <Shield className="h-4 w-4 opacity-90" />
              Private by design
            </span>
            <span className="opacity-30">•</span>
            <span className="inline-flex items-center gap-1.5">
              <RefreshCcw className="h-4 w-4 opacity-90" />
              Cancel anytime
            </span>
            <span className="opacity-30">•</span>
            <span className="inline-flex items-center gap-1.5">
              <Smartphone className="h-4 w-4 opacity-90" />
              Available on iOS &amp; Android
            </span>
          </div>
        </div>
      </section>

      {/* 2) Proof of Output */}
      {showProof && (
        <section id="proof" className="scroll-mt-28 px-6 pb-12 sm:pb-14">
          <div className="mx-auto max-w-5xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start">
              {/* On mobile, show the card first (show, don’t tell) */}
              <div className="order-1 lg:order-2 glass-card p-6 text-left group">
                <div className="text-xs font-semibold tracking-wide text-white/55">
                  Proof of output
                </div>

                <div className="mt-2 text-lg sm:text-xl font-semibold text-white">
                  {PROOF_EXAMPLE.text}
                </div>

                <div className="mt-5 text-xs font-semibold tracking-wide text-white/55">
                  WHY
                </div>

                <ul className="mt-2 space-y-2 text-sm sm:text-[15px] text-white/75 leading-relaxed">
                  {PROOF_EXAMPLE.why.map((line) => (
                    <li key={line} className="flex gap-2">
                      <span aria-hidden className="opacity-70">
                        •
                      </span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>

                <p className="mt-5 text-xs text-white/50">
                  Example shown for illustration. Suggestions vary by day.
                </p>

                <div aria-hidden="true" className="glass-gloss" />
              </div>

              <div className="order-2 lg:order-1 text-center lg:text-left">
                <h2 className="text-2xl sm:text-3xl font-semibold">See what MoodMap actually says</h2>
                <p className="mt-4 text-white/75 leading-relaxed">
                  One concrete suggestion. Clear reasoning. Respectful execution. This is the format
                  MoodMap delivers — fast, actionable, and grounded in timing.
                </p>

                <div className="mt-6 space-y-3 text-sm text-white/70">
                  <p className="inline-flex items-start gap-2">
                    <Sparkles className="mt-0.5 h-4 w-4 opacity-90" aria-hidden />
                    Specific action, not generic advice.
                  </p>
                  <p className="inline-flex items-start gap-2">
                    <Map className="mt-0.5 h-4 w-4 opacity-90" aria-hidden />
                    Matched to her day in the cycle (not a one-size-fits-all model).
                  </p>
                  <p className="inline-flex items-start gap-2">
                    <HeartHandshake className="mt-0.5 h-4 w-4 opacity-90" aria-hidden />
                    Designed for steadiness, not pressure.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3) Benefits */}
      <section id="about" className="scroll-mt-28 px-6 pb-12 sm:pb-14">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-semibold">Benefits</h2>
            <p className="mt-4 mx-auto max-w-3xl text-white/75 leading-relaxed">
              MoodMap turns cycle context into clear daily cues — when to offer warmth, when to give
              space, and how to show up without guesswork.
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
            Timing alerts via notifications are included with Premium+.
          </p>
        </div>
      </section>

      {/* 4) Trust */}
      <section id="trust" className="scroll-mt-28 px-6 pb-12 sm:pb-14">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-semibold">Trust</h2>
            <p className="mt-4 mx-auto max-w-3xl text-white/75 leading-relaxed">
              Clear scope. Clear privacy. Built to help you be a steadier partner — not to track
              someone.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-7">
            <article className="glass-card glass-card-hover p-6 text-left group">
              <span className="glass-icon transition-transform duration-300 group-hover:scale-[1.03]">
                <Shield className="h-6 w-6 text-white drop-shadow" aria-hidden />
              </span>
              <h3 className="mt-3 text-base sm:text-lg font-semibold text-white">
                Private by design
              </h3>
              <p className="mt-2 text-sm sm:text-[15px] text-white/70 leading-relaxed">
                A support tool, not surveillance. No awkward tracking — just timing and guidance.
              </p>
              <div aria-hidden="true" className="glass-gloss" />
            </article>

            <article className="glass-card glass-card-hover p-6 text-left group">
              <span className="glass-icon transition-transform duration-300 group-hover:scale-[1.03]">
                <HeartHandshake className="h-6 w-6 text-white drop-shadow" aria-hidden />
              </span>
              <h3 className="mt-3 text-base sm:text-lg font-semibold text-white">
                Relationship guidance
              </h3>
              <p className="mt-2 text-sm sm:text-[15px] text-white/70 leading-relaxed">
                Not medical advice. Not for contraception or fertility planning.
              </p>
              <div aria-hidden="true" className="glass-gloss" />
            </article>

            <article className="glass-card glass-card-hover p-6 text-left group">
              <span className="glass-icon transition-transform duration-300 group-hover:scale-[1.03]">
                <BellRing className="h-6 w-6 text-white drop-shadow" aria-hidden />
              </span>
              <h3 className="mt-3 text-base sm:text-lg font-semibold text-white">
                Premium+ alerts
              </h3>
              <p className="mt-2 text-sm sm:text-[15px] text-white/70 leading-relaxed">
                Heads-ups for PMS, ovulation, and fertile-window timing cues via notifications.
              </p>
              <div aria-hidden="true" className="glass-gloss" />
            </article>
          </div>
        </div>
      </section>

      {/* 5) Final CTA */}
      <section className="px-6 pb-16 sm:pb-20">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold">Download MoodMap</h2>
          <p className="mt-4 mx-auto max-w-2xl text-white/75 leading-relaxed">
            Start with daily guidance today. Upgrade to Premium+ if you want timing alerts.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row justify-center items-stretch gap-3 sm:gap-4">
            <a href={APP_STORE_URL} className="store-btn">
              <span className="store-btn__icon" aria-hidden>
                <FaApple />
              </span>
              Download on the App Store
            </a>

            <a href={GOOGLE_PLAY_URL} className="store-btn">
              <span className="store-btn__icon" aria-hidden>
                <FaGooglePlay />
              </span>
              Get it on Google Play
            </a>
          </div>

          <p className="mt-4 mx-auto max-w-2xl text-xs sm:text-sm text-white/55 leading-relaxed">
            Relationship guidance — not medical advice. Not for contraception or fertility planning.
          </p>
        </div>
      </section>
    </main>
  );
}
