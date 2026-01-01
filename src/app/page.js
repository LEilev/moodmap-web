// src/app/page.js
"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import {
  Map,
  BellRing,
  Sparkles,
  HeartHandshake,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { FaApple, FaGooglePlay } from "react-icons/fa";
import { PROOF_EXAMPLES } from "../lib/proofContent";

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
    title: "Tips & Intimacy",
    copy:
      "Daily blunt advice and playful suggestions — from sweet gestures to intimacy ideas, matched to the day.",
  },
  {
    Icon: HeartHandshake,
    title: "Self-Care",
    copy:
      "Quick daily check-ins and rituals so you stay grounded — calmer, steadier, and better for both of you.",
  },
];

function clampIndex(idx, len) {
  if (len <= 0) return 0;
  const n = idx % len;
  return n < 0 ? n + len : n;
}

export default function HomePage() {
  const examples = PROOF_EXAMPLES;
  const total = examples.length;

  const [activeIndex, setActiveIndex] = useState(0);

  const active = useMemo(
    () => examples[clampIndex(activeIndex, total)],
    [examples, activeIndex, total]
  );

  const goTo = useCallback((idx) => setActiveIndex(() => clampIndex(idx, total)), [total]);

  const next = useCallback(() => setActiveIndex((i) => clampIndex(i + 1, total)), [total]);

  const prev = useCallback(() => setActiveIndex((i) => clampIndex(i - 1, total)), [total]);

  // Touch swipe (mobile)
  const touchStartX = useRef(null);

  const onTouchStart = useCallback((e) => {
    if (!e?.touches?.length) return;
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const onTouchEnd = useCallback(
    (e) => {
      if (touchStartX.current == null) return;
      const endX = e.changedTouches?.[0]?.clientX;
      if (typeof endX !== "number") return;

      const delta = endX - touchStartX.current;
      touchStartX.current = null;

      const SWIPE_THRESHOLD = 55; // px
      if (delta > SWIPE_THRESHOLD) prev();
      if (delta < -SWIPE_THRESHOLD) next();
    },
    [next, prev]
  );

  // Keyboard navigation (when carousel is focused)
  const onCarouselKeyDown = useCallback(
    (e) => {
      if (!e) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      }
      if (e.key === "Home") {
        e.preventDefault();
        goTo(0);
      }
      if (e.key === "End") {
        e.preventDefault();
        goTo(total - 1);
      }
    },
    [goTo, next, prev, total]
  );

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
          Daily, cycle-aware guidance that helps you anticipate her needs and time your support and
          intimacy — with clarity, not guesswork.
        </p>

        <p className="mt-3 mx-auto max-w-2xl text-sm text-white/60">
          Think of it as relationship intel — phase-aware, respectful, and built for real life.
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

      {/* Proof of Output — premium carousel (one card in focus) */}
      <section className="px-6 pb-12 sm:pb-14">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-semibold">What MoodMap actually says</h2>
            <p className="mt-4 mx-auto max-w-3xl text-white/75 leading-relaxed">
              A few real examples of the daily guidance — phase-aware, direct, and designed to be
              acted on.
            </p>
          </div>

          <div className="mt-8">
            <div className="mx-auto w-full max-w-3xl">
              {/* Top row: counter + desktop arrows */}
              <div className="mb-4 flex items-center justify-between gap-4">
                <p className="text-xs sm:text-sm text-white/55">
                  Example <span className="text-white/75 font-semibold">{activeIndex + 1}</span>{" "}
                  <span className="text-white/45">/ {total}</span>
                </p>

                <div className="hidden sm:flex items-center gap-2">
                  <button
                    type="button"
                    onClick={prev}
                    aria-label="Previous example"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15 backdrop-blur hover:bg-white/15 hover:ring-white/25 transition"
                  >
                    <ChevronLeft className="h-5 w-5 text-white/80" aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    aria-label="Next example"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15 backdrop-blur hover:bg-white/15 hover:ring-white/25 transition"
                  >
                    <ChevronRight className="h-5 w-5 text-white/80" aria-hidden />
                  </button>
                </div>
              </div>

              {/* Carousel frame */}
              <div
                role="region"
                aria-roledescription="carousel"
                aria-label="MoodMap guidance examples"
                aria-describedby="proof-instructions"
                tabIndex={0}
                onKeyDown={onCarouselKeyDown}
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
                className="outline-none rounded-2xl focus-visible:ring-2 focus-visible:ring-emerald-400/40 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-blue"
              >
                <article className="glass-card p-6 sm:p-7 text-left relative">
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white/70 tracking-wide">
                      {String(active.category || "").toUpperCase()}
                    </span>
                    <span className="text-[11px] sm:text-xs font-medium text-white/55">
                      {active.phase} • Day {active.day}
                    </span>
                  </div>

                  <p className="text-lg sm:text-xl md:text-[22px] font-semibold text-white leading-snug">
                    {active.text}
                  </p>

                  <ul className="mt-5 space-y-2.5 text-sm sm:text-[15px] text-white/70 leading-relaxed list-disc pl-5">
                    {active.why.map((bullet, i) => (
                      <li key={`${active.id}-${i}`}>{bullet}</li>
                    ))}
                  </ul>

                  {/* Subtle gloss overlay (premium) */}
                  <div aria-hidden="true" className="glass-gloss" />
                </article>
              </div>

              <p id="proof-instructions" className="mt-4 text-center text-xs sm:text-sm text-white/55">
                Use the arrows to browse. On mobile: swipe left/right.
              </p>

              {/* Dots */}
              <div className="mt-4 flex items-center justify-center gap-2">
                {examples.map((_, i) => {
                  const isActive = i === activeIndex;
                  return (
                    <button
                      key={`dot-${i}`}
                      type="button"
                      onClick={() => goTo(i)}
                      aria-label={`Go to example ${i + 1}`}
                      aria-current={isActive ? "true" : "false"}
                      className={[
                        "h-2 rounded-full transition-all",
                        isActive ? "w-7 bg-white/70" : "w-2 bg-white/20 hover:bg-white/35",
                      ].join(" ")}
                    />
                  );
                })}
              </div>

              {/* Mobile arrows (below, to avoid overlay) */}
              <div className="mt-5 flex sm:hidden items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={prev}
                  className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white/80 ring-1 ring-white/15 backdrop-blur hover:bg-white/15 hover:ring-white/25 transition"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden />
                  Prev
                </button>

                <button
                  type="button"
                  onClick={next}
                  className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white/80 ring-1 ring-white/15 backdrop-blur hover:bg-white/15 hover:ring-white/25 transition"
                >
                  Next
                  <ChevronRight className="h-4 w-4" aria-hidden />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About + Features */}
      <section id="about" className="px-6 pb-12 sm:pb-14">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-semibold">Why MoodMap</h2>
            <p className="mt-4 mx-auto max-w-3xl text-white/75 leading-relaxed">
              Built for men who want to thrive — not tiptoe — through their partner’s cycle. MoodMap
              blends science with empathy to deliver honest, day-by-day cues so you’ll know when to
              offer warmth and when to give space. Think of it as emotional intelligence, delivered
              in friendly daily doses. Quiet engineering beneath; warmth and small joys above.
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

      {/* Bottom CTA */}
      <section className="px-6 pt-4 pb-16 sm:pb-20 text-center">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-semibold">Ready to strengthen your bond?</h2>
          <p className="mt-3 text-white/75 leading-relaxed">
            When her rhythm is respected, everyday life gets a little gentler for you both.
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
        </div>
      </section>
    </main>
  );
}
