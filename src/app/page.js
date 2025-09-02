// src/app/page.js
import Link from "next/link";
import {
  Map,
  BellRing,
  Sparkles,
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
        {/* Subtile premium glows (emerald→blue) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-40 -top-24 h-[34rem] w-[34rem] rounded-full bg-gradient-to-br from-emerald-400/25 to-blue-500/25 blur-[140px] sm:blur-[180px] md:opacity-30 -z-10"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 top-32 h-[36rem] w-[36rem] rounded-full bg-gradient-to-tr from-blue-500/25 to-emerald-400/25 blur-[160px] sm:blur-[200px] md:opacity-30 -z-10"
        />

        {/* Headline */}
        <h1 className="mx-auto max-w-4xl text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight">
          <span className="bg-gradient-to-r from-emerald-300 via-emerald-400 to-blue-400 bg-clip-text text-transparent">
            Understand the cycle.
          </span>{" "}
          <span className="block bg-gradient-to-r from-emerald-300 via-emerald-400 to-blue-400 bg-clip-text text-transparent">
            Survive the chaos.
          </span>
        </h1>

        <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-blue-100">
          MoodMap helps you track and survive the hormonal cycle with clarity,
          humor, and daily guidance for staying connected—and sane.
        </p>

        {/* Store CTA buttons */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
          <a
            href="https://apps.apple.com/no/app/moodmap-moodcoaster/id6746102626?l=nb"
            className="inline-flex h-11 items-center justify-center rounded-full bg-black px-5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(0,0,0,0.35)] ring-1 ring-white/10 transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(0,0,0,0.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          >
            Download on the App Store
          </a>
          <a
            href="https://play.google.com/store/apps/details?id=com.eilev.moodmapnextgen"
            className="inline-flex h-11 items-center justify-center rounded-full bg-blue-600 px-5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(37,99,235,0.35)] ring-1 ring-white/10 transition-all hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-[0_16px_36px_rgba(37,99,235,0.5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400"
          >
            Get it on Google Play
          </a>
        </div>

        {/* Trust strip */}
        <div className="mt-9 flex justify-center">
          <div className="flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-[13px] text-blue-100 ring-1 ring-white/10 backdrop-blur">
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
              Works on iOS &amp; Android
            </span>
          </div>
        </div>
      </section>

      {/* ───────── About ───────── */}
      <section id="about" className="max-w-3xl mx-auto text-center my-16 sm:my-20 px-6">
        <h2 className="text-2xl font-semibold mb-3">About MoodMap</h2>
        <p className="text-blue-100">
          Built for men who want to thrive—not tiptoe—through the hormonal cycle.
          Get brutally honest survival cues, timing windows, and a visual code so
          you can bring warmth when it matters and space when it saves the day.
        </p>
      </section>

      {/* ───────── Feature Cards (glass + motion) ───────── */}
      <section id="features" className="bg-primary-blue pb-24">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
          {/* Card helper */}
          {[
            {
              Icon: Map,
              title: "Cycle Overview",
              copy: "Map the mood. Crack the code. No guessing.",
            },
            {
              Icon: BellRing,
              title: "Survival Alerts",
              copy: "Know when to lean in, back off — or bring chocolate.",
            },
            {
              Icon: Sparkles,
              title: "Tips & Intimacy",
              copy:
                "Blunt advice + playful nudges to keep spark (and sex) alive.",
            },
            {
              Icon: Sparkles,
              title: "Selfcards",
              copy:
                "Daily rituals to sharpen presence — show up solid, for her and for you.",
            },
          ].map(({ Icon, title, copy }, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-2xl bg-white/12 p-5 sm:p-6 text-left ring-1 ring-white/10 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-black/30"
            >
              {/* Icon with gradient ring */}
              <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400/40 to-blue-500/40 ring-1 ring-white/20 shadow-inner shadow-emerald-500/10 transition-all duration-300 group-hover:scale-105 group-hover:from-emerald-300/55 group-hover:to-blue-400/55">
                <Icon className="h-6 w-6 text-white drop-shadow" />
              </span>

              <h3 className="text-base sm:text-lg font-semibold text-white">
                {title}
              </h3>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-blue-100">
                {copy}
              </p>

              {/* subtle corner gloss */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-white/10 to-transparent blur-2xl transition-opacity duration-300 group-hover:opacity-80"
              />
            </div>
          ))}
        </div>
      </section>

      {/* ───────── Footer ───────── */}
      <footer
        id="contact"
        className="bg-black text-center text-white py-8 px-6"
      >
        <p>
          Contact us:&nbsp;
          <Link href="mailto:Moodmap.tech@gmail.com" className="underline">
            Moodmap.tech@gmail.com
          </Link>
        </p>
        <p className="mt-1">
          <Link href="/privacy-policy.html" className="underline">
            Privacy Policy
          </Link>
        </p>
        <p className="mt-2">
          © {new Date().getFullYear()} MoodMap. All rights reserved.
        </p>
      </footer>
    </>
  );
}
