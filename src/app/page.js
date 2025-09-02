// src/app/page.js
import Link from "next/link";
import {
  Gauge,
  BellRing,
  Flame,
  Sparkles,
  ShieldCheck,
  Timer,
  Smartphone,
} from "lucide-react";

export default function HomePage() {
  return (
    <>
      {/* ───────── Hero ───────── */}
      <section
        id="hero"
        className="relative isolate overflow-hidden bg-primary-blue text-center px-6 pt-20 pb-12 sm:pt-24 sm:pb-14"
      >
        {/* Subtle background glows */}
        <div className="pointer-events-none absolute -top-32 left-1/2 h-80 w-[38rem] -translate-x-1/2 rounded-full bg-emerald-400/40 blur-3xl"></div>
        <div className="pointer-events-none absolute -bottom-40 right-1/3 h-72 w-[32rem] rounded-full bg-blue-500/40 blur-3xl"></div>

        {/* Headline with subtle gradient */}
        <h1 className="mx-auto max-w-4xl text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
          <span className="bg-gradient-to-r from-emerald-300 via-emerald-400 to-blue-300 bg-clip-text text-transparent">
            Understand the cycle.
          </span>
          <span className="block bg-gradient-to-r from-emerald-300 via-emerald-400 to-blue-300 bg-clip-text text-transparent">
            Survive the chaos.
          </span>
        </h1>

        <p className="mt-5 mx-auto max-w-2xl text-base sm:text-lg text-blue-100/90">
          MoodMap helps you track and survive the hormonal cycle with clarity,
          humor, and daily guidance for staying connected—and sane.
        </p>

        {/* Store buttons */}
        <div
          id="download"
          className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4"
        >
          <a
            href="https://apps.apple.com/no/app/moodmap-moodcoaster/id6746102626?l=nb"
            aria-label="Download on the App Store"
            className="group inline-flex h-12 items-center justify-center rounded-xl px-5 text-sm font-semibold text-white shadow-lg ring-1 ring-white/15 transition-all hover:-translate-y-0.5 hover:shadow-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            style={{
              background:
                "linear-gradient(180deg, rgba(10,10,10,1) 0%, rgba(0,0,0,1) 100%)",
            }}
          >
            <span className="opacity-90 group-hover:opacity-100">
              Download on the App Store
            </span>
          </a>
          <a
            href="https://play.google.com/store/apps/details?id=com.eilev.moodmapnextgen"
            aria-label="Get it on Google Play"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-5 text-sm font-semibold text-white shadow-lg ring-1 ring-white/15 transition-all hover:-translate-y-0.5 hover:shadow-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-200"
          >
            Get it on Google Play
          </a>
        </div>

        {/* Trust strip with more spacing/contrast */}
        <div className="mt-10 sm:mt-12">
          <div className="mx-auto inline-flex max-w-3xl flex-wrap items-center justify-center gap-x-6 gap-y-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-md">
            <div className="flex items-center gap-2 text-sm text-blue-50/90">
              <ShieldCheck className="h-4 w-4" /> Private by design
            </div>
            <span className="hidden sm:block text-blue-200/40">•</span>
            <div className="flex items-center gap-2 text-sm text-blue-50/90">
              <Timer className="h-4 w-4" /> Cancel anytime
            </div>
            <span className="hidden sm:block text-blue-200/40">•</span>
            <div className="flex items-center gap-2 text-sm text-blue-50/90">
              <Smartphone className="h-4 w-4" /> Works on iOS &amp; Android
            </div>
          </div>
        </div>
      </section>

      {/* ───────── About ───────── */}
      <section id="about" className="relative bg-primary-blue">
        {/* stronger corner glow */}
        <div className="pointer-events-none absolute -top-16 left-0 h-56 w-56 rounded-full bg-emerald-400/35 blur-2xl"></div>

        <div className="mx-auto max-w-3xl px-6 py-16 text-center sm:py-20">
          <h2 className="text-2xl sm:text-3xl font-semibold">About MoodMap</h2>
          <p className="mt-4 text-blue-100/95">
            Built for men who want to thrive—not tiptoe—through the hormonal
            cycle. Get brutally honest survival cues, timing windows, and a
            visual code so you can bring warmth when it matters and space when
            it saves the day.
          </p>
        </div>
      </section>

      {/* ───────── Feature Grid (Glass Cards) ───────── */}
      <section id="features" className="relative bg-primary-blue pb-24">
        {/* subtle background wash */}
        <div className="pointer-events-none absolute -z-10 left-1/2 top-0 h-80 w-[48rem] -translate-x-1/2 rounded-full bg-blue-500/35 blur-3xl"></div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 md:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            icon={<Gauge className="h-5 w-5" />}
            title="Cycle Overview"
            copy="Color‑coded map of phase, mood, and timing—at a glance."
          />
          <FeatureCard
            icon={<BellRing className="h-5 w-5" />}
            title="Survival Alerts"
            copy="Heads‑up pings for when to lean in, back off, or bring snacks."
          />
          <FeatureCard
            icon={<Flame className="h-5 w-5" />}
            title="Tips & Intimacy"
            copy="Straight talk + playful cues to keep connection (and sex) alive—without stepping on landmines."
          />
          <FeatureCard
            icon={<Sparkles className="h-5 w-5" />}
            title="Selfcards"
            copy="Daily micro‑rituals to sharpen presence and energy—so you show up at your best, for her and for you."
          />
        </div>
      </section>

      {/* ───────── Footer ───────── */}
      <footer id="contact" className="bg-black text-center text-white py-10 px-6">
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
        <p className="mt-2">© {new Date().getFullYear()} MoodMap. All rights reserved.</p>
      </footer>
    </>
  );
}

/** Local UI helper: premium glass card */
function FeatureCard({ icon, title, copy }) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-white/10 p-5 text-left text-white shadow-xl backdrop-blur-md transition-all hover:-translate-y-1 hover:border-white/20 hover:bg-white/15 hover:shadow-2xl">
      <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-blue-50/80">
        {icon}
        <span className="font-medium">{title}</span>
      </div>
      <p className="text-sm text-blue-50/95">{copy}</p>
    </div>
  );
}
