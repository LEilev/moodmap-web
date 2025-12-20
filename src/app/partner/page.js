import Link from "next/link";
import { HeartHandshake, BadgeCheck, Wallet, ArrowRight, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Partner Program – MoodMap",
  description:
    "MoodMap Partner Program (Ambassador/Creator): help couples connect, earn recurring revenue share, and get a clean affiliate portal.",
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    },
  },
};

const JOIN_URL = "https://moodmap.promotekit.com"; // <-- bytt hvis din PromoteKit-URL er annerledes

export default function PartnerPage() {
  return (
    <main className="relative min-h-screen isolate bg-primary-blue text-white">
      {/* premium glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-44 -top-28 h-[36rem] w-[36rem] rounded-full
                   bg-gradient-to-br from-emerald-400/22 to-blue-500/22 blur-[170px] -z-10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-48 top-28 h-[38rem] w-[38rem] rounded-full
                   bg-gradient-to-tr from-blue-500/22 to-emerald-400/22 blur-[190px] -z-10"
      />

      {/* HERO */}
      <section className="px-6 pt-16 pb-10 sm:pt-20 sm:pb-12">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full bg-white/12 ring-1 ring-white/20 px-3 py-1 text-sm font-medium">
            <BadgeCheck className="h-4 w-4" aria-hidden />
            <span>Ambassador / Creator</span>
          </div>

          <h1 className="text-balance text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
            <span className="bg-gradient-to-r from-emerald-300 via-emerald-400 to-blue-400 bg-clip-text text-transparent">
              MoodMap Partner Program
            </span>
          </h1>

          <p className="mt-5 text-pretty text-base sm:text-lg text-white/80">
            Help couples understand each other better — and earn a recurring revenue share when people
            subscribe through your link.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-stretch justify-center gap-3 sm:gap-4">
            <a
              href={JOIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center justify-center rounded-full px-7 py-4 text-base font-semibold
                         text-white bg-gradient-to-r from-emerald-400 to-blue-600 ring-1 ring-white/10
                         shadow-[0_10px_30px_rgba(59,130,246,0.35)] transition
                         hover:-translate-y-0.5 hover:shadow-[0_14px_40px_rgba(59,130,246,0.50)]
                         focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400/80"
            >
              Apply / Join Program
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-0.5" aria-hidden />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background: "linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0.00))",
                }}
              />
            </a>

            <Link
              href="/support"
              className="inline-flex items-center justify-center rounded-full px-7 py-4 text-base font-semibold
                         bg-white/10 text-white/90 ring-1 ring-white/15 backdrop-blur-xl
                         transition hover:bg-white/14 hover:text-white
                         focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400/80"
            >
              Questions? Contact support
            </Link>
          </div>

          <p className="mt-4 text-xs text-white/60">
            Compliance: Partners must clearly disclose affiliate relationships (e.g. #ad / paid partnership) where required.
          </p>
        </div>
      </section>

      {/* 3 bullets */}
      <section className="px-6 pb-10 sm:pb-12">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
          <div className="group relative overflow-hidden rounded-2xl bg-white/12 p-5 sm:p-6 ring-1 ring-white/10 backdrop-blur-xl">
            <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400/40 to-blue-500/40 ring-1 ring-white/20 shadow-inner shadow-emerald-500/10">
              <HeartHandshake className="h-6 w-6 text-white drop-shadow" aria-hidden />
            </span>
            <h2 className="text-lg font-semibold">Impact</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-white/75">
              You’re sharing something genuinely useful: calmer timing, better communication, stronger relationships.
            </p>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-white/12 p-5 sm:p-6 ring-1 ring-white/10 backdrop-blur-xl">
            <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400/40 to-blue-500/40 ring-1 ring-white/20 shadow-inner shadow-emerald-500/10">
              <BadgeCheck className="h-6 w-6 text-white drop-shadow" aria-hidden />
            </span>
            <h2 className="text-lg font-semibold">How it works</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-white/75">
              Apply, get your personal link, share it anywhere. Tracking and attribution happen automatically.
            </p>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-white/12 p-5 sm:p-6 ring-1 ring-white/10 backdrop-blur-xl">
            <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400/40 to-blue-500/40 ring-1 ring-white/20 shadow-inner shadow-emerald-500/10">
              <Wallet className="h-6 w-6 text-white drop-shadow" aria-hidden />
            </span>
            <h2 className="text-lg font-semibold">Revenue share</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-white/75">
              Earn a recurring revenue share on subscriptions you refer — as long as they stay subscribed.
            </p>
          </div>
        </div>
      </section>

      {/* 3 steps */}
      <section className="px-6 pb-16 sm:pb-20">
        <div className="mx-auto max-w-5xl rounded-2xl border border-white/12 bg-white/10 backdrop-blur-xl p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center">How It Works</h2>
          <p className="mt-2 text-center text-white/70">
            Keep it simple. Keep it premium.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
            <div className="rounded-2xl bg-white/10 ring-1 ring-white/10 p-5">
              <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15 text-sm font-semibold">
                1
              </div>
              <h3 className="text-base font-semibold">Apply</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-white/70">
                Join via the Partner Portal. You’ll be up and running in minutes.
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 ring-1 ring-white/10 p-5">
              <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15 text-sm font-semibold">
                2
              </div>
              <h3 className="text-base font-semibold">Get your link</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-white/70">
                Receive a unique referral link + dashboard to track clicks, signups, and earnings.
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 ring-1 ring-white/10 p-5">
              <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15 text-sm font-semibold">
                3
              </div>
              <h3 className="text-base font-semibold">Earn</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-white/70">
                Earn recurring commissions on the subscriptions you refer — paid out automatically.
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-white/70">
            <ShieldCheck className="h-4 w-4" aria-hidden />
            <span>We keep the portal clean and the program transparent.</span>
          </div>

          <div className="mt-8 flex justify-center">
            <a
              href={JOIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center justify-center rounded-full px-7 py-4 text-base font-semibold
                         text-white bg-gradient-to-r from-emerald-400 to-blue-600 ring-1 ring-white/10
                         shadow-[0_10px_30px_rgba(59,130,246,0.35)] transition
                         hover:-translate-y-0.5 hover:shadow-[0_14px_40px_rgba(59,130,246,0.50)]
                         focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400/80"
            >
              Apply / Join Program
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-0.5" aria-hidden />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background: "linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0.00))",
                }}
              />
            </a>
          </div>
        </div>
      </section>

      {/* Footer back */}
      <footer className="px-6 pb-10 text-center">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold
                     text-white bg-white/10 ring-1 ring-white/15 backdrop-blur-xl
                     transition hover:bg-white/14
                     focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400/80"
        >
          ← Back to the app
        </Link>
      </footer>
    </main>
  );
}
