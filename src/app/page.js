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

export default function HomePage() {
  return (
    <>
      {/* ───────── Hero ───────── */}
      <section
        id="hero"
        className="relative isolate bg-primary-blue text-center px-6 pt-20 pb-14 sm:pt-24 sm:pb-16"
      >
        {/* Subtle premium glows (emerald→blue) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-40 -top-24 h-[34rem] w-[34rem] rounded-full
                     bg-gradient-to-br from-emerald-400/18 to-blue-500/18 blur-[160px] sm:blur-[200px] md:opacity-30 -z-10"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 top-32 h-[36rem] w-[36rem] rounded-full
                     bg-gradient-to-tr from-blue-500/18 to-emerald-400/18 blur-[180px] sm:blur-[220px] md:opacity-30 -z-10"
        />

        {/* Headline */}
        <h1 className="mx-auto max-w-4xl text-balance text-4xl sm:text-5xl font-bold leading-tight tracking-tight">
          <span className="bg-gradient-to-r from-emerald-200 via-emerald-300 to-blue-300 bg-clip-text text-transparent">
            Understand her cycle.
          </span>{" "}
          <span className="block bg-gradient-to-r from-emerald-200 via-emerald-300 to-blue-300 bg-clip-text text-transparent">
            Strengthen your bond.
          </span>
        </h1>

        <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-white/80">
          Daily, cycle-aware guidance that helps you time support, space, and
          intimacy with clarity — without guesswork.
        </p>

        {/* Store CTA buttons */}
        <div
          className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4"
          id="download"
        >
          <a
            href="https://apps.apple.com/no/app/moodmap-moodcoaster/id6746102626?l=nb"
            className="store-btn store-btn--apple"
          >
            Download on the App Store
          </a>

          <a
            href="https://play.google.com/store/apps/details?id=com.eilev.moodmapnextgen"
            className="store-btn store-btn--google"
          >
            Get it on Google Play
          </a>
        </div>

        {/* Trust strip */}
        <div className="mt-9 flex justify-center">
          <div className="flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-[13px] text-white/75 ring-1 ring-white/10 backdrop-blur">
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

      {/* ───────── About ───────── */}
      <section
        id="about"
        className="max-w-3xl mx-auto text-center my-16 sm:my-20 px-6"
      >
        <h2 className="text-2xl font-semibold mb-3">Why MoodMap</h2>

        <p className="text-white/80">
          Built for men who want to thrive — not tiptoe — through their partner’s
          cycle. MoodMap blends science with empathy to deliver clear daily cues,
          so you know when to lean in, when to give space, and how to keep the
          connection strong. Quiet engineering beneath; warmth and small joys
          above.
        </p>

        <p className="text-white/55 text-sm italic mt-6">
          Coming soon: Partner Mode — a shared space where couples grow together,
          one small action at a time.
        </p>
      </section>

      {/* ───────── Feature Cards ───────── */}
      <section id="features" className="bg-primary-blue pb-24">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
          {[
            {
              Icon: Map,
              title: "Cycle Overview",
              copy: "See the cycle at a glance. No guessing — just clarity on the phase.",
            },
            {
              Icon: BellRing,
              title: "Timing Alerts",
              copy: "Timely heads‑ups for PMS, ovulation, and key windows — so you’re prepared.",
            },
            {
              Icon: Sparkles,
              title: "Tips & Intimacy",
              copy: "Daily suggestions to keep the spark alive — from sweet gestures to intimacy ideas.",
            },
            {
              Icon: HeartHandshake,
              title: "Self‑Care",
              copy: "Quick check‑ins to keep you grounded — show up solid, for her and for you.",
            },
          ].map(({ Icon, title, copy }) => (
            <div
              key={title}
              className="group relative overflow-hidden rounded-2xl bg-white/12 p-5 sm:p-6 text-left
                         ring-1 ring-white/10 backdrop-blur-xl transition-all duration-300
                         hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-black/30"
            >
              <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl
                               bg-gradient-to-br from-emerald-400/40 to-blue-500/40 ring-1 ring-white/20
                               shadow-inner shadow-emerald-500/10 transition-all duration-300
                               group-hover:scale-105 group-hover:from-emerald-300/55 group-hover:to-blue-400/55">
                <Icon className="h-6 w-6 text-white drop-shadow" />
              </span>

              <h3 className="text-base sm:text-lg font-semibold text-white">
                {title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-white/75">
                {copy}
              </p>

              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full
                           bg-gradient-to-br from-white/10 to-transparent blur-2xl transition-opacity duration-300
                           group-hover:opacity-80"
              />
            </div>
          ))}
        </div>
      </section>

      {/* ───────── Closing line ───────── */}
      <section className="max-w-3xl mx-auto text-center px-6 mt-16 mb-6">
        <p className="text-white/60 text-sm">
          When her rhythm is understood and respected, everyday life gets a
          little gentler — for both.
        </p>
      </section>

      {/* ───────── Footer ───────── */}
      <footer id="contact" className="bg-black text-center text-white py-8 px-6">
        <p className="text-white/60 text-sm mb-1">
          Built with quiet engineering and everyday empathy.
        </p>
        <p className="text-white/80">
          Contact us:&nbsp;
          <Link href="mailto:support@moodmap-app.com" className="underline decoration-white/40 hover:decoration-white/70">
            support@moodmap-app.com
          </Link>
        </p>
        <p className="mt-1">
          <Link href="/privacy-policy" className="underline decoration-white/40 hover:decoration-white/70">
            Privacy Policy
          </Link>
        </p>
        <p className="mt-2 text-white/60">
          © {new Date().getFullYear()} MoodMap. All rights reserved.
        </p>
      </footer>
    </>
  );
}
