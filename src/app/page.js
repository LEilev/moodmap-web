// FILE: src/app/page.js
"use client";

import Link from "next/link";
import {
  Apple,
  Smartphone,
  ShieldCheck,
  Clock,
  Activity,
  BellRing,
  HeartHandshake,
  Sparkles,
} from "lucide-react";

// Store links – unchanged
const LINKS = {
  ios: "https://apps.apple.com/no/app/moodmap-moodcoaster/id6746102626?l=nb",
  android: "https://play.google.com/store/apps/details?id=com.eilev.moodmapnextgen",
};

const features = [
  {
    title: "Cycle Overview",
    desc: "Map the mood. Crack the code. No guessing.",
    icon: Activity,
  },
  {
    title: "Survival Alerts",
    desc: "Know when to lean in, back off — or just bring chocolate.",
    icon: BellRing,
  },
  {
    title: "Tips & Intimacy",
    desc: "Blunt advice + playful nudges to keep spark (and sex) alive.",
    icon: HeartHandshake,
  },
  {
    title: "Selfcards",
    desc: "Daily rituals to sharpen presence — show up solid, for her and for you.",
    icon: Sparkles,
  },
];

export default function HomePage() {
  return (
    <>
      {/* ───────── Hero ───────── */}
      <section
        id="hero"
        className="relative isolate overflow-hidden bg-primary-blue"
      >
        {/* Subtle premium background glows (emerald → blue), wide blur + low opacity */}
        <div
          aria-hidden="true"
          className="pointer-events-none select-none absolute -left-40 top-24 h-[36rem] w-[36rem] rounded-full bg-gradient-to-br from-emerald-400/30 to-blue-500/30 blur-3xl opacity-25 sm:opacity-30"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none select-none absolute -right-40 top-56 h-[40rem] w-[40rem] rounded-full bg-gradient-to-tl from-blue-500/30 to-emerald-400/30 blur-3xl opacity-25 sm:opacity-30"
        />

        <div className="relative mx-auto max-w-6xl px-6 pt-20 pb-10 text-center sm:pt-24">
          {/* Gradient headline (emerald → blue) */}
          <h1 className="mx-auto max-w-4xl text-balance text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl">
            <span className="bg-gradient-to-r from-emerald-300 via-emerald-400 to-blue-300 bg-clip-text text-transparent">
              Understand the cycle.
              <br className="hidden sm:block" />
              Survive the chaos.
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
            MoodMap helps you track and survive the hormonal cycle with clarity,
            humor, and daily guidance for staying connected—and sane.
          </p>

          {/* Store buttons */}
          <div
            id="download"
            className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <a
              href={LINKS.ios}
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-black px-5 text-sm font-semibold text-white shadow-[0_10px_30px_-12px_rgba(0,0,0,0.9)] ring-1 ring-white/10 transition-all hover:scale-[1.02] hover:shadow-[0_16px_48px_-12px_rgba(0,0,0,0.9)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            >
              <Apple className="h-5 w-5 shrink-0" />
              Download on the App Store
            </a>
            <a
              href={LINKS.android}
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#34A853] px-5 text-sm font-semibold text-white shadow-[0_10px_30px_-12px_rgba(52,168,83,0.7)] ring-1 ring-white/10 transition-all hover:scale-[1.02] hover:bg-[#2ea04c] hover:shadow-[0_16px_48px_-12px_rgba(52,168,83,0.75)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#34A853]"
            >
              <Smartphone className="h-5 w-5 shrink-0" />
              Get it on Google Play
            </a>
          </div>

          {/* Trust strip – spaced further down so it breathes */}
          <div className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-3">
            <TrustPill icon={ShieldCheck} text="Private by design" />
            <TrustPill icon={Clock} text="Cancel anytime" />
            <TrustPill icon={Smartphone} text="Works on iOS & Android" />
          </div>
        </div>
      </section>

      {/* ───────── About ───────── */}
      <section id="about" className="mx-auto my-20 max-w-3xl px-6 text-center">
        <h2 className="text-2xl font-semibold">About MoodMap</h2>
        <p className="mt-3 text-blue-100">
          Built for men who want to thrive—not tiptoe—through the hormonal cycle.
          Get brutally honest survival cues, timing windows, and a visual code so
          you can bring warmth when it matters and space when it saves the day.
        </p>
      </section>

      {/* ───────── Feature Cards (glassy, higher contrast, hover‑lift) ───────── */}
      <section className="bg-primary-blue pb-24">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </section>

      {/* ───────── Footer (unchanged flow) ───────── */}
      <footer
        id="contact"
        className="bg-black px-6 py-10 text-center text-white"
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

/* ————— UI Partials ————— */

function TrustPill({ icon: Icon, text }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-sm text-white ring-1 ring-white/15 backdrop-blur-md">
      <Icon className="h-4 w-4 opacity-90" />
      <span className="opacity-90">{text}</span>
    </div>
  );
}

function FeatureCard({ title, desc, icon: Icon }) {
  return (
    <article className="group relative rounded-2xl bg-white/10 p-5 ring-1 ring-white/15 backdrop-blur-xl transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-black/30">
      {/* Icon with gradient ring that subtly comes alive on hover */}
      <div className="mb-4 inline-flex items-center gap-3">
        <div className="relative h-11 w-11 shrink-0">
          <div className="absolute -inset-[2px] rounded-full bg-gradient-to-tr from-emerald-400 to-blue-500 opacity-70 transition-all duration-300 group-hover:opacity-100" />
          <div className="relative grid h-11 w-11 place-items-center rounded-full bg-primary-blue ring-1 ring-white/20">
            <Icon className="h-5 w-5 text-white transition-colors duration-300 group-hover:text-emerald-200" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>

      <p className="text-sm leading-relaxed text-blue-100">{desc}</p>

      {/* Soft corner glow on hover for depth */}
      <div className="pointer-events-none absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-gradient-to-br from-emerald-400/0 via-emerald-400/10 to-blue-500/0 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
    </article>
  );
}
