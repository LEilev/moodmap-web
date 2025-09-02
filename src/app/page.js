// FILE: src/app/page.js
import Link from "next/link";
import {
  LayoutDashboard,
  BellRing,
  HeartPulse,
  Sparkles,
} from "lucide-react";

// NB: Behold lenkene uendret (nedlasting, ikke betalingsflyt)
const STORE = {
  ios: "https://apps.apple.com/no/app/moodmap-moodcoaster/id6746102626?l=nb",
  android: "https://play.google.com/store/apps/details?id=com.eilev.moodmapnextgen",
};

function FeatureCard({ title, desc, Icon }) {
  return (
    <div className="group relative rounded-2xl border border-white/10 bg-white/12 text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-blue-500/10">
      {/* ikon + gradient-ring */}
      <div className="flex items-start gap-4 p-5">
        <div className="relative">
          <div className="absolute inset-0 -m-1 rounded-full bg-gradient-to-br from-emerald-400/45 to-blue-500/45 blur-xl opacity-75 transition-all duration-500 group-hover:opacity-95 group-hover:scale-110" />
          <div className="relative grid h-12 w-12 place-items-center rounded-full bg-white/10 ring-1 ring-white/15 backdrop-blur">
            <Icon className="h-6 w-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3" />
          </div>
        </div>

        <div className="pt-0.5">
          <h3 className="text-base sm:text-lg font-semibold tracking-tight">
            {title}
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-blue-100/90">
            {desc}
          </p>
        </div>
      </div>

      {/* hover-lift glow */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/5" />
    </div>
  );
}

export default function HomePage() {
  const features = [
    {
      title: "Cycle Overview",
      desc: "Color map of mood + timing — at a glance.",
      Icon: LayoutDashboard,
    },
    {
      title: "Survival Alerts",
      desc: "Heads‑up when to lean in, back off — or bring snacks.",
      Icon: BellRing,
    },
    {
      title: "Tips & Intimacy",
      desc: "Straight talk + playful nudges to keep sex and spark alive.",
      Icon: HeartPulse,
    },
    {
      title: "Selfcards",
      desc:
        "Daily micro‑rituals to sharpen presence — show up at your best, for her and for you.",
      Icon: Sparkles, // universell emoji-erstatter (ikke 🪞)
    },
  ];

  return (
    <>
      {/* ───────── Hero ───────── */}
      <section
        id="hero"
        className="relative overflow-hidden bg-primary-blue text-center px-6 pt-24 pb-16"
      >
        {/* Subtile emerald→blue glows (lavere opacity, bred blur) */}
        <div className="pointer-events-none absolute -top-56 -left-40 h-[44rem] w-[44rem] rounded-full bg-emerald-400 opacity-25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-72 -right-56 h-[52rem] w-[52rem] rounded-full bg-blue-500 opacity-30 blur-3xl" />

        {/* Tittel uten ekstra ‘MoodMap’-badge */}
        <h1 className="mx-auto max-w-5xl text-balance text-4xl sm:text-6xl font-extrabold leading-[1.05] tracking-tight">
          <span className="bg-gradient-to-br from-emerald-300 via-teal-200 to-blue-400 bg-clip-text text-transparent">
            Understand the cycle.
            <br className="hidden sm:block" />
            Survive the chaos.
          </span>
        </h1>

        <p className="mt-5 max-w-2xl mx-auto text-base sm:text-lg text-blue-100">
          MoodMap helps you track and survive the hormonal cycle with clarity,
          humor, and daily guidance for staying connected—and sane.
        </p>

        {/* Store‑knapper – premium stil */}
        <div
          id="download"
          className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4"
        >
          <a
            href={STORE.ios}
            aria-label="Download on the App Store"
            className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-black px-5 text-sm font-semibold text-white shadow-lg shadow-black/30 ring-1 ring-white/10 transition-all hover:-translate-y-0.5 hover:ring-white/25 hover:shadow-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          >
            {/* enkel “shine” ved hover */}
            <span className="relative">
              <span className="absolute -inset-1 rounded bg-white/10 blur-md opacity-0 transition group-hover:opacity-100" />
              <span className="relative">Download on the App Store</span>
            </span>
          </a>

          <a
            href={STORE.android}
            aria-label="Get it on Google Play"
            className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-500 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-900/30 ring-1 ring-white/10 transition-all hover:-translate-y-0.5 hover:bg-blue-600 hover:ring-white/25 hover:shadow-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400"
          >
            <span className="relative">
              <span className="absolute -inset-1 rounded bg-white/10 blur-md opacity-0 transition group-hover:opacity-100" />
              <span className="relative">Get it on Google Play</span>
            </span>
          </a>
        </div>

        {/* Trust strip – mer luft over (ikke klemt) */}
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <div className="rounded-full bg-white/10 px-3 py-1 text-sm text-blue-100 ring-1 ring-inset ring-white/10 backdrop-blur">
            🔒 Private by design
          </div>
          <div className="rounded-full bg-white/10 px-3 py-1 text-sm text-blue-100 ring-1 ring-inset ring-white/10 backdrop-blur">
            ⏱ Cancel anytime
          </div>
          <div className="rounded-full bg-white/10 px-3 py-1 text-sm text-blue-100 ring-1 ring-inset ring-white/10 backdrop-blur">
            📱 Works on iOS &amp; Android
          </div>
        </div>
      </section>

      {/* ───────── About ───────── */}
      <section id="about" className="max-w-3xl mx-auto text-center px-6 py-16">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-3">
          About MoodMap
        </h2>
        <p className="text-blue-100">
          Built for men who want to thrive—not tiptoe—through the hormonal
          cycle. Get brutally honest survival cues, timing windows, and a visual
          code so you can bring warmth when it matters and space when it saves
          the day.
        </p>
      </section>

      {/* ───────── Features (glass cards med tydelig kontrast/hover) ───────── */}
      <section className="relative bg-primary-blue pb-20">
        {/* myk wash bak kortene – veldig subtil */}
        <div className="pointer-events-none absolute -z-10 left-1/2 top-0 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-blue-400/25 blur-3xl" />
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </section>

      {/* ───────── Footer ───────── */}
      <footer
        id="contact"
        className="bg-black text-center text-white py-10 px-6"
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
        <p className="mt-2">© {new Date().getFullYear()} MoodMap. All rights reserved.</p>
      </footer>
    </>
  );
}
