const SITE_URL = "https://moodmap-app.com";
const PAGE_PATH = "/partner";
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;

const PARTNER_PORTAL_URL = "https://moodmap.promotekit.com";

export const metadata = {
  title: "Partner Program — MoodMap",
  description:
    "Join the MoodMap Partner Program. Earn 50% lifetime recurring revenue share for every subscriber attributed to your link. Subscriptions via Stripe. Tracking & payouts via PromoteKit.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    title: "Partner Program — MoodMap",
    description:
      "Earn 50% lifetime recurring revenue share for every subscriber attributed to your link. Subscriptions via Stripe. Tracking & payouts via PromoteKit.",
    siteName: "MoodMap",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "MoodMap",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Partner Program — MoodMap",
    description:
      "Earn 50% lifetime recurring. Subscriptions via Stripe. Tracking & payouts via PromoteKit.",
    images: ["/icon.png"],
  },
};

function AccentCheck() {
  return (
    <span
      className="mt-[3px] inline-flex h-4 w-4 flex-none items-center justify-center rounded-full
      border border-emerald-300/20 bg-emerald-400/10 text-[10px] text-emerald-200"
      aria-hidden="true"
    >
      ✓
    </span>
  );
}

function CheckList({ items }) {
  return (
    <ul className="mt-3 space-y-2 text-sm leading-relaxed text-white/70">
      {items.map((t) => (
        <li key={t} className="flex gap-2">
          <AccentCheck />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

function Section({ id, title, subtitle, children }) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] backdrop-blur md:p-10">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-white md:text-2xl">{title}</h2>
          {subtitle ? (
            <p className="max-w-3xl text-sm leading-relaxed text-white/70 md:text-base">
              {subtitle}
            </p>
          ) : null}
        </div>

        <div className="mt-6 md:mt-8">{children}</div>
      </div>
    </section>
  );
}

function FaqItem({ q, children }) {
  return (
    <details className="group rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
      <summary className="cursor-pointer list-none">
        <div className="flex items-start justify-between gap-4">
          <p className="text-sm font-semibold text-white">{q}</p>
          <span className="mt-0.5 text-white/45 transition group-open:rotate-45" aria-hidden="true">
            +
          </span>
        </div>
        <p className="mt-2 text-sm text-white/60">{/* reserve space for stability */}</p>
      </summary>

      <div className="-mt-2 text-sm leading-relaxed text-white/70">{children}</div>
    </details>
  );
}

function MobileStickyCTA() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#070A12]/80 backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold text-white">50% lifetime recurring</p>
          <p className="truncate text-[11px] text-white/60">
            Subscriptions via Stripe • Tracking & payouts via PromoteKit
          </p>
        </div>
        <a
          href={PARTNER_PORTAL_URL}
          className="shrink-0 rounded-full bg-gradient-to-r from-emerald-400 to-blue-500 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-emerald-500/10 transition hover:opacity-95"
        >
          Get link
        </a>
      </div>
    </div>
  );
}

export default function PartnerPage() {
  return (
    <main className="relative overflow-hidden bg-[#070A12] text-white">
      <MobileStickyCTA />

      {/* Background glow */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-260px] h-[620px] w-[900px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute left-1/2 top-[120px] h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />
      </div>

      {/* Extra bottom padding so content isn't hidden behind mobile sticky CTA */}
      <div className="relative mx-auto max-w-6xl px-6 pb-28 pt-14 md:pb-24 md:pt-20">
        {/* HERO (decision UI, not a manual) */}
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
            MoodMap Partner Program
          </p>

          <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight text-emerald-300 md:text-6xl">
            Earn 50% lifetime recurring.
          </h1>

          <p className="mx-auto mt-4 max-w-3xl text-pretty text-base leading-relaxed text-white/85 md:text-lg">
            Promote MoodMap — a premium daily briefing that turns cycle timing into practical
            relationship context, so couples communicate better with less guesswork.
          </p>

          <p className="mt-4 text-sm text-white/70">Built for men. Better timing for both partners.</p>

          <div className="mt-7 flex flex-col items-center gap-3">
            <a
              href={PARTNER_PORTAL_URL}
              className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-emerald-400 to-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/10 transition hover:opacity-95 sm:w-auto"
            >
              Get your link
            </a>

            <p className="text-xs text-white/60">
              Subscriptions via Stripe • Tracking & payouts via PromoteKit
            </p>

            <p className="mt-2 text-xs leading-relaxed text-white/55">
              Relationship guidance — not medical advice, not contraception, not fertility planning.
            </p>
          </div>
        </div>

        {/* MAIN CONTENT (tight, conversion-relevant) */}
        <div className="mx-auto mt-10 max-w-5xl space-y-6 md:mt-12 md:space-y-8">
          <Section
            id="what-you-get"
            title="What you get"
            subtitle="Simple: your tracked link, transparent attribution, and recurring payouts."
          >
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <CheckList
                items={[
                  "50% lifetime recurring commission on subscribers attributed to your link",
                  "A unique tracked link and real-time dashboard (PromoteKit)",
                  "Clear visibility into attributed subscriptions and earnings",
                  "Payout status and timing are visible inside your partner account",
                ]}
              />
              <p className="mt-4 text-xs leading-relaxed text-white/50">
                We keep the program lightweight and high-trust — use common sense, keep claims
                accurate, and avoid absolute/medical guarantees.
              </p>
            </div>
          </Section>

          <Section
            id="what-you-point-to"
            title="What you’re pointing people to"
            subtitle="Your audience gets the full story on moodmap-app.com. This is the one‑sentence version."
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <p className="text-sm font-semibold text-white">One‑liner you can use</p>
                <p className="mt-3 text-sm leading-relaxed text-white/70">
                  “MoodMap is a premium daily briefing for men that turns cycle timing into
                  relationship context — helping couples avoid misreads and improve conversation
                  timing.”
                </p>
                <p className="mt-4 text-xs leading-relaxed text-white/55">
                  Keep it truthful: context, not prediction. Cycles vary person to person.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <p className="text-sm font-semibold text-white">Where your audience lands</p>
                <CheckList
                  items={[
                    "They learn what MoodMap is (and what it isn’t) on the website",
                    "They download via the official store links from there",
                    "They subscribe through the standard flow",
                  ]}
                />

                <div className="mt-5">
                  <a
                    href={SITE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white/85 transition hover:bg-white/10 md:w-auto"
                  >
                    Open moodmap-app.com ↗
                  </a>
                </div>
              </div>
            </div>
          </Section>

          <Section
            id="faq"
            title="FAQ (2 minutes)"
            subtitle="The only questions most creators need answered before joining."
          >
            <div className="grid grid-cols-1 gap-4">
              <FaqItem q="How does attribution work?">
                <p>
                  Attribution is tracked in your PromoteKit dashboard. Your dashboard is the source
                  of truth for what is attributed to you (signups/subscriptions and earnings).
                </p>
              </FaqItem>

              <FaqItem q="How do payouts work?">
                <p>
                  Payouts are handled through the partner system. Your partner account shows payout
                  status and timing. If there is a minimum threshold or payout cadence, it will be
                  visible there.
                </p>
              </FaqItem>

              <FaqItem q="What promotion methods are allowed?">
                <p>
                  Use common sense and keep claims accurate (avoid medical or absolute guarantees).
                  Organic content is the typical fit. If you want to run paid ads, brand bidding, or
                  anything that could be ambiguous, email support first.
                </p>
              </FaqItem>
            </div>

            <div className="mt-6 flex flex-col items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur md:flex-row md:text-left">
              <div>
                <p className="text-sm font-semibold text-white">Ready?</p>
                <p className="mt-1 text-sm text-white/70">
                  Create your account and get your tracked link in minutes.
                </p>
              </div>
              <a
                href={PARTNER_PORTAL_URL}
                className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-emerald-400 to-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/10 transition hover:opacity-95 md:w-auto"
              >
                Get your link
              </a>
            </div>
          </Section>
        </div>
      </div>
    </main>
  );
}
