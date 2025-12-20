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
    copy: "See the cycle mapped out clearly — an instant read on her current phase and mood.",
  },
  {
    Icon: BellRing,
    title: "Timing Alerts",
    copy: "Timely heads-ups for critical moments (PMS, ovulation, etc.). Bring warmth, or give space.",
  },
  {
    Icon: Sparkles,
    title: "Tips & Intimacy",
    copy: "Daily blunt advice and playful suggestions — from sweet gestures to intimacy ideas.",
  },
  {
    Icon: HeartHandshake,
    title: "Self‑Care",
    copy: "Quick daily check-ins and rituals so you stay grounded — for her, and for you.",
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
          Daily, cycle-aware guidance that helps you time support, space, and intimacy with clarity —
          without guesswork.
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

      {/* About */}
      <section id="about" className="px-6 pb-14 sm:pb-18">
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

          {/* Feature cards */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
            {FEATURES.map(({ Icon, title, copy }) => (
              <article key={title} className="glass-card glass-card-hover p-6 text-left group">
                <span className="glass-icon transition-transform duration-300 group-hover:scale-[1.03]">
                  <Icon className="h-6 w-6 text-white drop-shadow" aria-hidden />
                </span>

                <h3 className="text-base sm:text-lg font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm sm:text-[15px] text-white/70 leading-relaxed">{copy}</p>

                <div aria-hidden="true" className="glass-gloss" />
              </article>
            ))}
          </div>

          <p className="mt-10 text-center text-sm text-white/55">
            When her rhythm is respected, everyday life gets a little gentler for you both.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-primary-blue/70 backdrop-blur-sm px-6 py-10">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-sm text-white/60">Built with quiet engineering and everyday empathy.</p>

          <p className="mt-2 text-sm text-white/70">
            Contact us:{" "}
            <a className="mm-link" href="mailto:support@moodmap-app.com">
              support@moodmap-app.com
            </a>
          </p>

          <div className="mt-3 text-sm text-white/60">
            <Link className="mm-link" href="/privacy-policy">
              Privacy Policy
            </Link>
          </div>

          <p className="mt-4 text-xs text-white/45">© 2025 MoodMap. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
