// src/app/partner/page.js

export const metadata = {
  title: "Ambassador Program – MoodMap",
  description: "Help couples understand each other better — and earn as a MoodMap partner.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

const PROMOTEKIT_URL = "https://moodmap.promotekit.com";

export default function PartnerPage() {
  return (
    <main className="relative isolate bg-primary-blue text-white">
      {/* Glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 -top-24 h-[34rem] w-[34rem] rounded-full bg-gradient-to-br from-emerald-400/18 to-blue-500/18 blur-[170px] sm:blur-[220px] md:opacity-30 -z-10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-44 top-28 h-[36rem] w-[36rem] rounded-full bg-gradient-to-tr from-blue-500/18 to-emerald-400/16 blur-[180px] sm:blur-[240px] md:opacity-30 -z-10"
      />

      {/* Hero */}
      <section className="px-6 pt-14 pb-10 sm:pt-18 text-center">
        <h1 className="mx-auto max-w-4xl text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight">
          <span className="bg-gradient-to-r from-emerald-300 via-emerald-400 to-blue-400 bg-clip-text text-transparent">
            MoodMap Ambassador Program
          </span>
        </h1>

        <p className="mt-4 mx-auto max-w-2xl text-base sm:text-lg text-white/75 leading-relaxed">
          Help couples understand each other better — and get rewarded for it.
        </p>

        <div className="mt-7 flex justify-center">
          <a
            href={PROMOTEKIT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            Apply / Join Program
          </a>
        </div>

        <p className="mt-4 text-sm text-white/55">
          This page isn’t listed in the main navigation and is not indexed by search engines.
        </p>
      </section>

      {/* Content */}
      <section className="px-6 pb-14">
        <div className="mx-auto max-w-5xl grid gap-6">
          {/* 3 bullets */}
          <div className="grid gap-6 md:grid-cols-3">
            <div className="glass-card glass-card-hover p-6">
              <h2 className="text-lg font-semibold">Make an impact</h2>
              <p className="mt-2 text-sm text-white/70 leading-relaxed">
                Every share helps more couples build empathy and better timing — day by day.
              </p>
            </div>

            <div className="glass-card glass-card-hover p-6">
              <h2 className="text-lg font-semibold">Earn 50% revenue share</h2>
              <p className="mt-2 text-sm text-white/70 leading-relaxed">
                You earn 50% of subscription revenue from users you refer — recurring while they stay
                subscribed.
              </p>
            </div>

            <div className="glass-card glass-card-hover p-6">
              <h2 className="text-lg font-semibold">Simple & transparent</h2>
              <p className="mt-2 text-sm text-white/70 leading-relaxed">
                Free to join. You’ll get a personal link and tracking via PromoteKit.
              </p>
            </div>
          </div>

          {/* 3 steps */}
          <div className="glass-card p-6 sm:p-8">
            <h2 className="text-2xl font-semibold">How it works</h2>
            <ol className="mt-4 grid gap-4 sm:grid-cols-3">
              <li className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4">
                <div className="text-sm font-semibold text-white">1) Apply</div>
                <p className="mt-1 text-sm text-white/70">
                  Join through the portal. You’ll get set up in minutes.
                </p>
              </li>
              <li className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4">
                <div className="text-sm font-semibold text-white">2) Get your link</div>
                <p className="mt-1 text-sm text-white/70">
                  Share it in content, newsletters, or directly with your audience.
                </p>
              </li>
              <li className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4">
                <div className="text-sm font-semibold text-white">3) Earn</div>
                <p className="mt-1 text-sm text-white/70">
                  Earn recurring revenue on subscriptions attributed to your link.
                </p>
              </li>
            </ol>

            <p className="mt-5 text-xs text-white/55">
              Compliance: Partners must clearly disclose affiliate links/paid promotions where
              required (e.g. “ad”, “affiliate link”).
            </p>
          </div>

          {/* CTA */}
          <div className="text-center pt-2">
            <a
              href={PROMOTEKIT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Apply / Join Program
            </a>
            <p className="mt-4 text-sm text-white/60">
              Questions? <a className="mm-link" href="/support">Contact us</a> or join{" "}
              <a
                className="mm-link"
                href="https://discord.gg/eeP9vBK6Vn"
                target="_blank"
                rel="noopener noreferrer"
              >
                the MoodMap Discord
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
