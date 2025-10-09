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

          {/* Discord */}
          <article className="group relative overflow-hidden rounded-2xl bg-white/12 p-5 sm:p-6 ring-1 ring-white/10 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/30">
            <span className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-400/40 to-blue-500/40 ring-1 ring-white/20 shadow-inner shadow-indigo-500/10 transition-all duration-300 group-hover:scale-105 group-hover:from-indigo-300/55 group-hover:to-blue-400/55">
              {/* Discord logo (inline SVG) */}
              <svg
                aria-hidden
                className="h-6 w-6 text-white drop-shadow"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M20.317 4.369A19.791 19.791 0 0016.557 3.5c-.18.333-.37.77-.507 1.12a18.128 18.128 0 00-5.09 0 13.078 13.078 0 00-.517-1.12 19.736 19.736 0 00-3.76.869C3.866 7.363 3.3 10.262 3.5 13.106a19.9 19.9 0 005.965 3.022c.244-.333.465-.686.66-1.056-.363-.139-.716-.308-1.056-.509.089-.064.175-.13.257-.198a13.021 13.021 0 007.256 0c.083.068.169.134.257.198-.34.201-.693.37-1.056.509.195.37.416.723.66 1.056a19.9 19.9 0 005.964-3.022c.336-3.076-.573-5.94-2.296-8.737zM9.438 12.192c-.832 0-1.508-.781-1.508-1.742 0-.96.676-1.742 1.508-1.742.832 0 1.508.781 1.508 1.742 0 .96-.676 1.742-1.508 1.742zm5.125 0c-.832 0-1.508-.781-1.508-1.742 0-.96.676-1.742 1.508-1.742.832 0 1.508.781 1.508 1.742 0 .96-.676 1.742-1.508 1.742z" />
              </svg>
            </span>
            <h2 className="text-xl font-semibold">Discord</h2>
            <p className="mt-1">
              <a
                className="underline decoration-white/40 hover:decoration-white/70"
                href="https://discord.gg/eeP9vBK6Vn"
                target="_blank"
                rel="noopener noreferrer"
              >
                Join the MoodMap Lounge
              </a>
            </p>
            <p className="mt-1.5 text-sm text-blue-100">
              Chat, feedback & early access.
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
