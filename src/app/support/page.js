// src/app/support/page.js
import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

export const metadata = {
  title: "Support – MoodMap",
  description: "How to reach the MoodMap team when you need a hand (or a hug).",
};

export default function SupportPage() {
  return (
    <main className="relative isolate min-h-screen flex flex-col items-center bg-primary-blue text-white px-6 py-16">
      {/* Subtile premium glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 -top-24 h-[30rem] w-[30rem] rounded-full bg-gradient-to-br from-emerald-400/25 to-blue-500/25 blur-[140px] sm:blur-[180px] md:opacity-30 -z-10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-44 top-48 h-[32rem] w-[32rem] rounded-full bg-gradient-to-tr from-blue-500/25 to-emerald-400/25 blur-[160px] sm:blur-[200px] md:opacity-30 -z-10"
      />

      <div className="max-w-xl w-full space-y-10">
        {/* ───────────── Header ───────────── */}
        <header className="text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-3">
            Need a hand?
          </h1>
          <p className="text-lg text-blue-100">
            MoodMap is indie‑built (by me 👋 Eilev). I read every single message.
          </p>

          {/* Valgfri personlig lenke – beholder support via e‑post som primær */}
          <p className="mt-2 text-sm text-blue-100/90">
            Prefer DM? I’m also on{" "}
            <a
              className="underline decoration-white/40 hover:decoration-white/70"
              href="https://www.instagram.com/larseilevskiaker/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
            , but email is fastest for support.
          </p>
        </header>

        {/* ───────────── Contact Cards ───────────── */}
        <section className="grid gap-6">
          {/* Email */}
          <article className="group relative overflow-hidden rounded-2xl bg-white/12 p-5 sm:p-6 ring-1 ring-white/10 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/30">
            <span className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400/40 to-blue-500/40 ring-1 ring-white/20 shadow-inner shadow-emerald-500/10 transition-all duration-300 group-hover:scale-105 group-hover:from-emerald-300/55 group-hover:to-blue-400/55">
              <Mail className="h-6 w-6 text-white drop-shadow" aria-hidden />
            </span>
            <h2 className="text-xl font-semibold">Email</h2>
            <p className="mt-1">
              <a
                className="underline decoration-white/40 hover:decoration-white/70"
                href="mailto:support@moodmap-app.com"
              >
                support@moodmap-app.com
              </a>
            </p>
            {/* gloss */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-white/10 to-transparent blur-2xl transition-opacity duration-300 group-hover:opacity-80"
            />
          </article>

          {/* Phone */}
          <article className="group relative overflow-hidden rounded-2xl bg-white/12 p-5 sm:p-6 ring-1 ring-white/10 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/30">
            <span className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400/40 to-blue-500/40 ring-1 ring-white/20 shadow-inner shadow-emerald-500/10 transition-all duration-300 group-hover:scale-105 group-hover:from-emerald-300/55 group-hover:to-blue-400/55">
              <Phone className="h-6 w-6 text-white drop-shadow" aria-hidden />
            </span>
            <h2 className="text-xl font-semibold">Phone</h2>
            <p className="mt-1">
              <a
                className="underline decoration-white/40 hover:decoration-white/70"
                href="tel:+47929972773"
              >
                +47&nbsp;929&nbsp;97&nbsp;273
              </a>
            </p>
            {/* gloss */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-white/10 to-transparent blur-2xl transition-opacity duration-300 group-hover:opacity-80"
            />
          </article>

          {/* Address */}
          <article className="group relative overflow-hidden rounded-2xl bg-white/12 p-5 sm:p-6 ring-1 ring-white/10 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/30">
            <span className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400/40 to-blue-500/40 ring-1 ring-white/20 shadow-inner shadow-emerald-500/10 transition-all duration-300 group-hover:scale-105 group-hover:from-emerald-300/55 group-hover:to-blue-400/55">
              <MapPin className="h-6 w-6 text-white drop-shadow" aria-hidden />
            </span>
            <h2 className="text-xl font-semibold">Mailing address</h2>
            <address className="not-italic leading-relaxed mt-1 text-blue-100">
              MoodMap<br />
              Fageråsveien&nbsp;4<br />
              1415&nbsp;Oppegård<br />
              Norway
            </address>
            {/* gloss */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-white/10 to-transparent blur-2xl transition-opacity duration-300 group-hover:opacity-80"
            />
          </article>
        </section>

        {/* ───────────── Footer: Back to the app (emerald/blue button) ───────────── */}
        <footer className="text-center pt-6">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold
                       text-white bg-gradient-to-r from-emerald-400 to-blue-600 ring-1 ring-white/10
                       shadow-[0_8px_24px_rgba(59,130,246,0.35)] transition-all
                       hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(59,130,246,0.5)]
                       focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
          >
            ← Back to the app
          </Link>
        </footer>
      </div>
    </main>
  );
}
