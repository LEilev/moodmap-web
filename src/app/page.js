// src/app/page.js
import Link from "next/link";
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

export default function HomePage() {
  // FAQ schema for the two Q&A blocks on this page (AI/SEO)
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What if her cycle or period length isn’t “average”?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "MoodMap Premium+ adapts to cycle lengths from 21–35 days, and lets you adjust menstruation length from 2–8 days, so daily guidance stays accurate even when her rhythm is shorter or longer.",
        },
      },
      {
        "@type": "Question",
        name: "Is this private — or does it track everything?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "It’s private. MoodMap is a support tool, not surveillance. No symptom logging, no awkward tracking — just timing and guidance.",
        },
      },
    ],
  };

  return (
    <main className="relative isolate bg-primary-blue text-white">
      {/* JSON-LD (FAQ) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

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
      <section className="px-6 pt-14 pb-12 sm:pt-20 sm:pb-14 text-center">
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

          {/* NEW: Premium expectation-setting (quiet + clear) */}
          <p className="mt-4 text-center text-xs sm:text-sm text-white/55">
            Timing alerts via notifications are included with Premium+.
          </p>

          {/* Quiet Q&A (conversion clarity) */}
          <div className="mt-10 max-w-3xl mx-auto text-sm sm:text-[15px] text-white/70 leading-relaxed">
            <p className="mb-4 font-medium text-white/80">
              A couple of things people often ask:
            </p>

            <p className="font-semibold text-white/85">
              What if her cycle or period length isn’t “average”?
            </p>
            <p className="mb-6">
              MoodMap Premium+ adapts to cycle lengths from <strong>21–35 days</strong>, and lets you
              adjust menstruation length from <strong>2–8 days</strong>, so daily guidance stays
              accurate even when her rhythm is shorter or longer.
            </p>

            <p className="font-semibold text-white/85">
              Is this private — or does it track everything?
            </p>
            <p>
              It’s private. MoodMap is a support tool, not surveillance. No symptom logging, no
              awkward tracking — just timing and guidance.
            </p>

            {/* CTA to Guides (premium, subtle) */}
            <div className="mt-7 flex flex-col items-center gap-2 text-sm text-white/60">
              <Link href="/learn" className="mm-link">
                Explore the Guides →
              </Link>
              <p className="text-xs sm:text-sm text-white/55 text-center">
                Short partner guides: PMS support, cycle phases, and fertile-window context.
              </p>
            </div>

            {/* Closing chord */}
            <div className="mt-8 flex flex-col items-center gap-3">
              <div aria-hidden="true" className="h-px w-20 bg-white/10" />
              <p className="text-xs sm:text-sm text-white/60 text-center">
                Informed by human physiology and hormone research — distilled into clear, daily guidance.
              </p>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-white/55">
            When her rhythm is respected, everyday life gets a little gentler for you both.
          </p>
        </div>
      </section>

      {/* No footer here — global footer lives in layout.js */}
    </main>
  );
}
