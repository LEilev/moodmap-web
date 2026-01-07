// src/app/partner/page.js

export const metadata = {
  title: "Partner Program – MoodMap",
  description:
    "Partner with MoodMap. A premium app that gives men daily relationship context based on cycle timing. 50% recurring revenue share.",
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

function buildPromoteKitUrl(searchParams) {
  if (!searchParams) return PROMOTEKIT_URL;

  const entries = Object.entries(searchParams).flatMap(([k, v]) => {
    if (Array.isArray(v)) return v.map((val) => [k, val]);
    if (typeof v === "string") return [[k, v]];
    return [];
  });

  if (!entries.length) return PROMOTEKIT_URL;

  const qs = new URLSearchParams(entries).toString();
  return `${PROMOTEKIT_URL}?${qs}`;
}

export default function PartnerPage({ searchParams }) {
  const promoteUrl = buildPromoteKitUrl(searchParams);

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
            Daily relationship context, delivered.
          </span>
        </h1>

        <p className="mt-4 mx-auto max-w-3xl text-base sm:text-lg text-white/75 leading-relaxed">
          MoodMap is a <span className="text-white">premium</span> app for{" "}
          <span className="text-white">men in relationships</span>. It gives a clear daily heads‑up
          based on <span className="text-white">cycle timing</span> — so he understands{" "}
          <span className="text-white">today’s</span> context and avoids misreads.
          <span className="block mt-2 text-white/70">
            Not therapy. Not a fertility tracker. Not a mood journal.
          </span>
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs text-white/70">
          <span className="rounded-full bg-white/10 ring-1 ring-white/15 px-3 py-1">
            For men with female partners
          </span>
          <span className="rounded-full bg-white/10 ring-1 ring-white/15 px-3 py-1">
            Daily, time‑sensitive briefings
          </span>
          <span className="rounded-full bg-white/10 ring-1 ring-white/15 px-3 py-1">
            Cycle timing → context
          </span>
          <span className="rounded-full bg-white/10 ring-1 ring-white/15 px-3 py-1">
            Premium product
          </span>
        </div>

        <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={promoteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            Apply / Join via Partner Portal
          </a>
          <a href="#details" className="mm-link text-sm self-center">
            See details first
          </a>
        </div>

        <p className="mt-4 text-sm text-white/55">
          Private page (not in navigation, not indexed).
        </p>
      </section>

      {/* Content */}
      <section id="details" className="px-6 pb-14">
        <div className="mx-auto max-w-5xl grid gap-6">
          {/* Value cards */}
          <div className="grid gap-6 md:grid-cols-3">
            <div className="glass-card glass-card-hover p-6">
              <h2 className="text-lg font-semibold">A concrete value-add for your audience</h2>
              <p className="mt-2 text-sm text-white/70 leading-relaxed">
                MoodMap gives men a daily heads‑up tied to cycle timing — clearer context, fewer
                avoidable misreads, better timing.
              </p>
            </div>

            <div className="glass-card glass-card-hover p-6">
              <h2 className="text-lg font-semibold">50% recurring revenue share</h2>
              <p className="mt-2 text-sm text-white/70 leading-relaxed">
                Earn 50% of subscription revenue from users you refer — recurring while they stay
                subscribed.
              </p>
            </div>

            <div className="glass-card glass-card-hover p-6">
              <h2 className="text-lg font-semibold">Clean setup & transparent tracking</h2>
              <p className="mt-2 text-sm text-white/70 leading-relaxed">
                Free to join. PromoteKit provides your personal link and a real‑time dashboard for
                signups and subscriptions.
              </p>
            </div>
          </div>

          {/* What you’re promoting / Not for */}
          <div className="glass-card p-6 sm:p-8">
            <h2 className="text-2xl font-semibold">What you’re promoting</h2>

            <div className="mt-4 grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="text-sm font-semibold text-white">MoodMap in one line</h3>
                <p className="mt-2 text-sm text-white/70 leading-relaxed">
                  A premium daily briefing that translates cycle timing into relationship context —
                  so he knows what matters today.
                </p>

                <h3 className="mt-5 text-sm font-semibold text-white">Best-fit audiences</h3>
                <ul className="mt-2 text-sm text-white/70 leading-relaxed list-disc pl-5 space-y-1">
                  <li>Men in relationships (25–45), high signal, low patience for fluff</li>
                  <li>Dating / relationships (non‑therapy), masculinity, performance, productivity</li>
                  <li>Creators who can say “timing + context” without moralizing</li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-white">What MoodMap is not</h3>
                <ul className="mt-2 text-sm text-white/70 leading-relaxed list-disc pl-5 space-y-1">
                  <li>Not couples counseling or therapy content</li>
                  <li>Not a fertility tracker</li>
                  <li>Not a mood journal / “how do you feel today” app</li>
                </ul>

                <h3 className="mt-5 text-sm font-semibold text-white">Not a fit if…</h3>
                <p className="mt-2 text-sm text-white/70 leading-relaxed">
                  Your content is primarily clinical/therapeutic, teen‑focused, or centered on
                  fertility/trying‑to‑conceive. MoodMap is built for practical daily context for men.
                </p>
              </div>
            </div>
          </div>

          {/* How it works */}
          <div className="glass-card p-6 sm:p-8">
            <h2 className="text-2xl font-semibold">How it works</h2>
            <ol className="mt-4 grid gap-4 sm:grid-cols-3">
              <li className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4">
                <div className="text-sm font-semibold text-white">1) Apply</div>
                <p className="mt-1 text-sm text-white/70">
                  Apply in the partner portal (free). Setup takes minutes.
                </p>
              </li>
              <li className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4">
                <div className="text-sm font-semibold text-white">2) Get your link</div>
                <p className="mt-1 text-sm text-white/70">
                  You’ll get a tracked link you can use in content, newsletters, or your bio.
                </p>
              </li>
              <li className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4">
                <div className="text-sm font-semibold text-white">3) Earn</div>
                <p className="mt-1 text-sm text-white/70">
                  Earn 50% recurring subscription revenue attributed to your link.
                </p>
              </li>
            </ol>

            <p className="mt-5 text-xs text-white/55">
              Compliance: Partners must clearly disclose affiliate links/paid promotions where
              required (e.g. “ad”, “affiliate link”).
            </p>
          </div>

          {/* Creator quick start */}
          <div className="glass-card p-6 sm:p-8">
            <h2 className="text-2xl font-semibold">Creator quick start</h2>
            <div className="mt-4 grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="text-sm font-semibold text-white">Three angles that work</h3>
                <ul className="mt-2 text-sm text-white/70 leading-relaxed list-disc pl-5 space-y-1">
                  <li>“Same conversation, different day → different outcome. Timing matters.”</li>
                  <li>“Not therapy. Just daily context so you don’t misread the moment.”</li>
                  <li>“Cycle timing as situational intelligence — for men who want clarity.”</li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Copy‑paste story script</h3>
                <div className="mt-2 rounded-2xl bg-white/5 ring-1 ring-white/10 p-4 text-sm text-white/70 leading-relaxed">
                  “I’ve been testing MoodMap. It’s a premium app that gives men a daily heads‑up
                  based on cycle timing — so you understand today’s context and avoid misreads.
                  Not therapy, not a period tracker. Link if you want it.”
                </div>
                <p className="mt-2 text-xs text-white/55">
                  More assets and tracking are available in the partner portal.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center pt-2">
            <a
              href={promoteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Apply / Join via Partner Portal
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
