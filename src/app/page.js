// src/app/page.js
import Link from "next/link";
import {
  Apple,
  Play,
  HeartHandshake,
  BellRing,
  Sparkles,
  Brain,
  ShieldCheck,
  Smartphone,
  Timer,
} from "lucide-react";

export default function HomePage() {
  return (
    <>
      {/* ───────────────── Hero / Download anchor ───────────────── */}
      <section
        id="hero"
        className="relative isolate overflow-hidden bg-primary-blue px-6 pt-20 pb-16 text-center sm:pt-24 sm:pb-20"
      >
        {/* Anchor for header nav */}
        <span id="download" className="sr-only" />

        {/* Premium glows */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 right-1/2 h-[36rem] w-[36rem] translate-x-1/2 rounded-full blur-3xl opacity-40"
          style={{
            background:
              "radial-gradient(closest-side, rgba(16,185,129,.45), rgba(59,130,246,.35), transparent 70%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-48 left-1/2 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full blur-3xl opacity-40"
          style={{
            background:
              "radial-gradient(closest-side, rgba(59,130,246,.45), rgba(99,102,241,.35), transparent 70%)",
          }}
        />

        <div className="relative mx-auto max-w-5xl">
          <p className="mx-auto mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium text-blue-100 backdrop-blur">
            MoodMap
          </p>

          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight sm:text-6xl">
            Understand the cycle.
            <span className="block">Survive the chaos.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base text-blue-100 sm:text-lg">
            Brutally honest cues, phase‑aware tips, and simple rituals that keep
            connection strong—and your sanity intact.
          </p>

          {/* Store CTA buttons */}
          <div className="mx-auto mt-8 flex max-w-md flex-col items-stretch gap-4 sm:max-w-none sm:flex-row sm:justify-center">
            <a
              href="https://apps.apple.com/no/app/moodmap-moodcoaster/id6746102626?l=nb"
              className="group relative inline-flex items-center justify-center gap-3 rounded-xl bg-gradient-to-b from-neutral-900 to-black px-6 py-3 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_12px_24px_rgba(0,0,0,0.35)] ring-1 ring-white/10 transition will-change-transform hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.16),0_18px_30px_rgba(0,0,0,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
            >
              <Apple className="h-5 w-5 opacity-90" />
              <span className="text-sm font-semibold tracking-wide">
                Download on the App&nbsp;Store
              </span>
            </a>

            <a
              href="https://play.google.com/store/apps/details?id=com.eilev.moodmapnextgen"
              className="group relative inline-flex items-center justify-center gap-3 rounded-xl bg-blue-600 px-6 py-3 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_12px_24px_rgba(0,0,0,0.35)] ring-1 ring-white/10 transition will-change-transform hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.16),0_18px_30px_rgba(0,0,0,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
            >
              <Play className="h-5 w-5 opacity-90" />
              <span className="text-sm font-semibold tracking-wide">
                Get it on Google&nbsp;Play
              </span>
            </a>
          </div>

          {/* Trust strip */}
          <div className="mx-auto mt-6 flex w-full flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-blue-100">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 backdrop-blur">
              <ShieldCheck className="h-4 w-4" /> Private by design
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 backdrop-blur">
              <Timer className="h-4 w-4" /> Cancel anytime
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 backdrop-blur">
              <Smartphone className="h-4 w-4" /> Works on iOS &amp; Android
            </span>
          </div>
        </div>
      </section>

      {/* ───────────────── About ───────────────── */}
      <section id="about" className="mx-auto my-20 max-w-3xl px-6 text-center">
        <h2 className="text-2xl font-semibold">About MoodMap</h2>
        <p className="mt-3 text-blue-100">
          Built for men who want clarity, timing, and calm.
          MoodMap decodes the hormonal cycle and gives you
          clear, phase‑aware guidance so you can support her
          —and show up steady.
        </p>
      </section>

      {/* ───────────────── Features (glass cards) ───────────────── */}
      <section id="features" className="relative bg-primary-blue pb-24 pt-2">
        {/* subtle background glow behind cards */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-24 mx-auto h-72 w-[48rem] rounded-full blur-3xl opacity-40"
          style={{
            background:
              "radial-gradient(closest-side, rgba(16,185,129,.35), rgba(59,130,246,.35), transparent 65%)",
          }}
        />

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 px-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Card 1 */}
          <div className="group rounded-2xl border border-white/10 bg-white/10 p-6 text-white shadow-2xl backdrop-blur-md transition hover:bg-white/15 hover:shadow-[0_0_0_1px_rgba(255,255,255,.2)]">
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/10">
              <HeartHandshake className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold">❤️‍🩹 Cycle Overview</h3>
            <p className="mt-2 text-sm text-blue-100">
              Know the day. Decode the vibe. No more guesswork.
            </p>
          </div>

          {/* Card 2 */}
          <div className="group rounded-2xl border border-white/10 bg-white/10 p-6 text-white shadow-2xl backdrop-blur-md transition hover:bg-white/15 hover:shadow-[0_0_0_1px_rgba(255,255,255,.2)]">
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/10">
              <BellRing className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold">⏰ Survival Alerts</h3>
            <p className="mt-2 text-sm text-blue-100">
              Heads‑up cues on when to lean in, back off—or just bring chocolate.
            </p>
          </div>

          {/* Card 3 */}
          <div className="group rounded-2xl border border-white/10 bg-white/10 p-6 text-white shadow-2xl backdrop-blur-md transition hover:bg-white/15 hover:shadow-[0_0_0_1px_rgba(255,255,255,.2)]">
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/10">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold">🍑 Tips &amp; Intimacy</h3>
            <p className="mt-2 text-sm text-blue-100">
              Straight talk + playful nudges to keep connection—and sex—alive through every phase.
            </p>
          </div>

          {/* Card 4 */}
          <div className="group rounded-2xl border border-white/10 bg-white/10 p-6 text-white shadow-2xl backdrop-blur-md transition hover:bg-white/15 hover:shadow-[0_0_0_1px_rgba(255,255,255,.2)]">
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/10">
              <Brain className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold">🪞 Selfcards</h3>
            <p className="mt-2 text-sm text-blue-100">
              Daily micro‑rituals to sharpen your presence and energy—so you show up at your best, not just for her but for you.
            </p>
          </div>
        </div>
      </section>

      {/* ───────────────── Footer (unchanged structure) ───────────────── */}
      <footer id="contact" className="bg-black px-6 py-10 text-center text-white">
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
