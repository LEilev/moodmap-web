// src/app/page.js
import { Map, BellRing, Sparkles, HeartHandshake } from "lucide-react";
import { FaApple, FaGooglePlay } from "react-icons/fa";

import { SAMPLE_GUIDANCE } from "../lib/proofContent";

// Matches app deck tint for OPS/PLAN (from cockpitMaterialTokens.js)
const PLAN_TINT = "#22C55E";

function AnchorDivider({ variant = "neutral" }) {
  const isPlan = variant === "plan";

  return (
    <div aria-hidden="true" className="mx-auto my-10 flex items-center justify-center">
      <div className="relative h-px w-16 bg-white/15">
        <span
          className={[
            "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-2 w-2 rounded-full",
            isPlan ? "bg-green-500/80 ring-1 ring-green-500/25" : "bg-white/35 ring-1 ring-white/15",
          ].join(" ")}
        />
      </div>
    </div>
  );
}

const FEATURES = [
  {
    Icon: Map,
    title: "Cycle Overview",
    copy:
      "See the cycle mapped clearly — calibrated to her cycle length (21–35 days), not a generic 28-day template.",
    isPrimary: true,
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
            <span className="store-btn__icon" aria-hidden="true">
              <FaApple />
            </span>
            Download on the App Store
          </a>

          <a
            href="https://play.google.com/store/apps/details?id=com.eilev.moodmapnextgen"
            className="store-btn"
          >
            <span className="store-btn__icon" aria-hidden="true">
              <FaGooglePlay />
            </span>
            Get it on Google Play
          </a>
        </div>
      </section>

      {/* Single sample (P1 polish: anchors + deck tint cues) */}
      <section className="px-6 pb-14 sm:pb-16">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] sm:text-[11px] font-semibold tracking-[0.28em] uppercase text-white/70">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-green-500/90"
                style={{ boxShadow: `0 0 0 6px ${PLAN_TINT}1A` }}
              />
              Sample guidance
            </span>

            <h2 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-semibold">
              A daily briefing — in context
            </h2>

            <p className="mt-4 mx-auto max-w-3xl text-white/70 leading-relaxed">
              One real example of how MoodMap writes: a clear prompt, then the reasoning — tuned to
              her phase and the day.
            </p>
          </div>

          {/* Section anchor (hairline + dot) */}
          <AnchorDivider variant="plan" />

          <div className="mx-auto max-w-[980px]">
            <article className="glass-card overflow-hidden relative ring-1 ring-white/25">
              {/* Rim light + subtle gradients (depth) */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-white/0 to-transparent"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  background: `radial-gradient(900px 360px at 90% 0%, ${PLAN_TINT}33 0%, transparent 60%)`,
                }}
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-10 right-10 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full blur-3xl"
                style={{ backgroundColor: `${PLAN_TINT}14` }}
              />

              {/* Top block */}
              <div className="relative p-6 sm:p-8">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold tracking-[0.18em] uppercase"
                      style={{
                        borderColor: `${PLAN_TINT}66`,
                        backgroundColor: `${PLAN_TINT}10`,
                        color: "rgba(240,253,244,0.92)",
                      }}
                    >
                      <span
                        aria-hidden="true"
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: PLAN_TINT }}
                      />
                      PLAN
                    </span>

                    <span className="text-[11px] sm:text-xs text-white/55">Action Plan</span>
                  </div>

                  <span className="text-[11px] sm:text-xs font-medium text-white/55">
                    {SAMPLE_GUIDANCE.phase} • Day {SAMPLE_GUIDANCE.day}
                  </span>
                </div>

                <h3 className="mt-5 text-xl sm:text-2xl md:text-[26px] font-semibold tracking-tight text-white leading-snug">
                  {SAMPLE_GUIDANCE.text}
                </h3>

                <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />
              </div>

              {/* WHY block (separate surface) */}
              <div className="relative px-6 sm:px-8 py-6 bg-gradient-to-b from-white/[0.06] to-black/20 border-t border-white/10">
                {/* Deck identity hairline (subtle, app-like) */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute left-0 top-0 bottom-0 w-px"
                  style={{
                    background: `linear-gradient(to bottom, transparent, ${PLAN_TINT}66, transparent)`,
                  }}
                />
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-white/50 font-semibold">
                    Why it works
                  </p>
                  <p className="text-[11px] text-white/35">5 notes</p>
                </div>

                <ul className="mt-4">
                  {SAMPLE_GUIDANCE.why.map((bullet, i) => {
                    const isPrimary = i === 0;

                    return (
                      <li
                        key={`${SAMPLE_GUIDANCE.id}-${i}`}
                        className={[
                          "flex gap-3",
                          isPrimary ? "mb-4" : "mb-[11px]",
                        ].join(" ")}
                      >
                        {/* App-like bullet: outer ring + inner dot (tinted) */}
                        <span className="mt-[0.22em] flex h-5 w-5 items-center justify-center">
                          <span
                            className="flex h-[18px] w-[18px] items-center justify-center rounded-full border"
                            style={{
                              borderColor: `${PLAN_TINT}66`,
                              backgroundColor: `${PLAN_TINT}10`,
                            }}
                          >
                            <span
                              className="h-[7px] w-[7px] rounded-full"
                              style={{
                                backgroundColor: PLAN_TINT,
                                opacity: isPrimary ? 1 : 0.85,
                              }}
                            />
                          </span>
                        </span>

                        <span
                          className={[
                            "leading-relaxed",
                            isPrimary
                              ? "text-sm sm:text-[15px] text-white/85 font-medium"
                              : "text-sm sm:text-[15px] text-white/72",
                          ].join(" ")}
                        >
                          {bullet}
                        </span>
                      </li>
                    );
                  })}
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

      {/* Section anchor between Sample and Benefits */}
      <AnchorDivider />

      {/* About + Features (P1: anchors + less “template” grid) */}
      <section id="about" className="relative px-6 pb-12 sm:pb-14">
        {/* Subtle section glows to avoid a flat, uniform dark field */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-24 top-14 h-[420px] w-[420px] rounded-full bg-gradient-to-br from-emerald-500/10 via-sky-500/5 to-transparent blur-3xl" />
          <div className="absolute -right-24 bottom-6 h-[360px] w-[360px] rounded-full bg-gradient-to-br from-sky-500/10 via-emerald-500/5 to-transparent blur-3xl" />
        </div>
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] sm:text-[11px] font-semibold tracking-[0.28em] uppercase text-white/70">
              Benefits
            </span>

            <h2 className="mt-4 text-2xl sm:text-3xl font-semibold">Why MoodMap</h2>
            <p className="mt-4 mx-auto max-w-3xl text-white/75 leading-relaxed">
              Built for men who want to lead with timing — not tiptoe with guesswork. MoodMap turns
              her cycle into clear, daily guidance so you know when to offer warmth, when to give
              space, and how to stay steady through it all.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-7">
            {FEATURES.map(({ Icon, title, copy, isPrimary }) => (
              <article
                key={title}
                className={[
                  "glass-card glass-card-hover p-6 text-left group relative overflow-hidden ring-1",
                  isPrimary ? "ring-green-500/25" : "ring-white/18",
                ].join(" ")}
              >
                {isPrimary ? (
                  <>
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full blur-3xl"
                      style={{ backgroundColor: `${PLAN_TINT}14` }}
                    />
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-white/0 to-transparent"
                    />
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute left-10 right-10 top-0 h-px"
                      style={{ background: `linear-gradient(to right, transparent, ${PLAN_TINT}99, transparent)` }}
                    />
                  </>
                ) : null}

                <span className="glass-icon transition-transform duration-300 group-hover:scale-[1.03]">
                  <Icon className="h-6 w-6 text-white drop-shadow" aria-hidden="true" />
                </span>

                <h3 className="text-base sm:text-lg font-semibold text-white flex flex-wrap items-center gap-2">
                  <span>{title}</span>
                </h3>

                <p className="mt-2 text-sm sm:text-[15px] text-white/70 leading-relaxed">{copy}</p>

                <div aria-hidden="true" className="glass-gloss" />
              </article>
            ))}
          </div>

          <p className="mt-6 text-center text-xs sm:text-sm text-white/55">
            Notifications are optional — the daily briefing works even if you keep it silent.
          </p>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-6 pt-2 pb-16 sm:pb-20 text-center">
        <div className="mx-auto max-w-3xl">
          <AnchorDivider />

          <h2 className="text-2xl sm:text-3xl font-semibold">Ready to strengthen your bond?</h2>
          <p className="mt-3 text-white/75 leading-relaxed">
            Download MoodMap and start with today’s phase-aware briefing.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row justify-center items-stretch gap-3 sm:gap-4">
            <a
              href="https://apps.apple.com/no/app/moodmap-moodcoaster/id6746102626?l=nb"
              className="store-btn"
            >
              <span className="store-btn__icon" aria-hidden="true">
                <FaApple />
              </span>
              Download on the App Store
            </a>

            <a
              href="https://play.google.com/store/apps/details?id=com.eilev.moodmapnextgen"
              className="store-btn"
            >
              <span className="store-btn__icon" aria-hidden="true">
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
