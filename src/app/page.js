// FILE: src/app/page.js
import Link from "next/link";
import {
  Lock,
  Clock,
  Smartphone,
  Radar,
  BellRing,
  Flame,
  Sparkles,
} from "lucide-react";

export default function HomePage() {
  return (
    <>
      {/* ───────── Hero ───────── */}
      <section
        id="hero"
        className="relative isolate bg-primary-blue text-center px-6 pt-20 pb-14 overflow-hidden"
      >
        {/* Subtile premium glows */}
        <div className="pointer-events-none absolute -left-40 top-16 h-[34rem] w-[34rem] blur-3xl opacity-25 md:opacity-30"
             style={{ backgroundImage: "radial-gradient(ellipse at center, rgba(16,185,129,.35), transparent 60%)" }} />
        <div className="pointer-events-none absolute -right-40 -bottom-10 h-[36rem] w-[36rem] blur-3xl opacity-25 md:opacity-30"
             style={{ backgroundImage: "radial-gradient(ellipse at center, rgba(59,130,246,.35), transparent 60%)" }} />

        {/* Heading with subtle gradient */}
        <h1 className="text-balance mx-auto max-w-4xl text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-300 via-emerald-200 to-blue-200 bg-clip-text text-transparent drop-shadow-[0_1px_0_rgba(0,0,0,0.35)]">
          Understand the cycle.
          <span className="block">Survive the chaos.</span>
        </h1>

        <p className="mt-5 mx-auto max-w-2xl text-base sm:text-lg text-blue-100">
          MoodMap helps you track and survive the hormonal cycle with clarity,
          humor, and daily guidance for staying connected—and sane.
        </p>

        {/* Store buttons */}
        <div id="download" className="mt-9 flex flex-col sm:flex-row justify-center items-center gap-4">
          {/* App Store – premium gradient frame + solid core */}
          <a
            href="https://apps.apple.com/no/app/moodmap-moodcoaster/id6746102626?l=nb"
            className="group inline-flex h-12 items-center rounded-xl bg-gradient-to-r from-emerald-400 to-blue-500 p-[2px] transition-transform hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          >
            <span className="flex h-full w-full items-center justify-center rounded-[10px] bg-neutral-900/95 px-5 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] group-hover:bg-neutral-900/90">
              Download on the App Store
            </span>
          </a>

          {/* Google Play – premium solid */}
          <a
            href="https://play.google.com/store/apps/details?id=com.eilev.moodmapnextgen"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-blue-500 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-900/30 transition hover:bg-blue-600 hover:scale-[1.02] active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          >
            Get it on Google Play
          </a>
        </div>

        {/* Trust strip – mer luft over, tydelig kontrast */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 text-sm">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 ring-1 ring-white/10 text-blue-100">
            <Lock className="size-4" /> Private by design
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 ring-1 ring-white/10 text-blue-100">
            <Clock className="size-4" /> Cancel anytime
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 ring-1 ring-white/10 text-blue-100">
            <Smartphone className="size-4" /> Works on iOS &amp; Android
          </span>
        </div>
      </section>

      {/* ───────── About ───────── */}
      <section id="about" className="max-w-3xl mx-auto text-center px-6 py-20">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-3">About MoodMap</h2>
        <p className="text-blue-100">
          Built for men who want to thrive—not tiptoe—through the hormonal cycle.
          Get brutally honest survival cues, timing windows, and a visual code so
          you can bring warmth when it matters and space when it saves the day.
        </p>
      </section>

      {/* ───────── Feature Cards (glass + punchy) ───────── */}
      <section id="features" className="relative bg-primary-blue pb-24">
        {/* subtle wash behind cards */}
        <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 -top-12 h-64 w-[80%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,.25),transparent_70%)] blur-2xl" />

        <div className="relative max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Cycle Overview",
              body: "Map the mood. Crack the code. No guessing.",
              Icon: Radar,
            },
            {
              title: "Survival Alerts",
              body: "Heads‑up when to lean in, back off — or bring chocolate.",
              Icon: BellRing,
            },
            {
              title: "Tips & Intimacy",
              body: "Blunt advice + playful nudges to keep spark (and sex) alive.",
              Icon: Flame,
            },
            {
              title: "Selfcards",
              body:
                "Daily rituals to sharpen presence — show up solid, for her and for you.",
              Icon: Sparkles, // robust emoji‑safe icon
            },
          ].map(({ title, body, Icon }) => (
            <article
              key={title}
              className="group relative rounded-2xl border border-white/10 bg-neutral-900/40 text-white backdrop-blur-xl p-5 sm:p-6 shadow-[0_10px_40px_rgba(0,0,0,0.35)] transition-transform duration-200 hover:-translate-y-1 hover:scale-[1.025] hover:shadow-[0_18px_60px_rgba(0,0,0,0.45)]"
            >
              {/* Icon + gradient ring */}
              <div className="mb-4 inline-flex items-center">
                <div className="mr-3 grid size-10 place-items-center rounded-xl ring-1 ring-white/15 bg-gradient-to-b from-emerald-400/30 to-blue-500/30 transition-colors group-hover:from-emerald-400/50 group-hover:to-blue-500/50">
                  <Icon className="size-5 text-white/95 transition-transform group-hover:scale-110" />
                </div>
                <h3 className="text-lg font-semibold">{title}</h3>
              </div>
              <p className="text-sm leading-relaxed text-blue-100">
                {body}
              </p>

              {/* subtle shimmer on hover */}
              <span className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300"
                    style={{ background: "linear-gradient(120deg, rgba(255,255,255,0.06), transparent 30%, transparent 70%, rgba(255,255,255,0.06))" }} />
            </article>
          ))}
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
