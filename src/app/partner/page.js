const SITE_URL = "https://moodmap-app.com";
const PAGE_PATH = "/partner";
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;

const PARTNER_PORTAL_URL = "https://moodmap.promotekit.com";

// NOTE: Current intro prices (subject to change as pricing is tested/optimized).
const INTRO_MONTHLY_PRICE = 7.99;
const INTRO_YEARLY_PRICE = 49.99;
const REV_SHARE = 0.5;

// Keep these as numbers so we can use them for illustrative examples.
const MONTHLY_EARNING = INTRO_MONTHLY_PRICE * REV_SHARE;
const YEARLY_EARNING = INTRO_YEARLY_PRICE * REV_SHARE;

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
      "Earn 50% lifetime recurring revenue share. Subscriptions via Stripe. Tracking & payouts via PromoteKit.",
    images: ["/icon.png"],
  },
};

function Eyebrow({ children }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
      {children}
    </p>
  );
}

function MetaPill({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 text-[11px] text-white/80 shadow-sm shadow-black/20">
      {children}
    </span>
  );
}

function TagPill({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] text-white/70">
      {children}
    </span>
  );
}

function StepCard({ step, title, detail }) {
  return (
    <div className="flex-1 rounded-2xl border border-white/20 bg-white/[0.06] px-5 py-4 text-center shadow-sm shadow-black/30 backdrop-blur-md transition-all duration-200 hover:border-white/30 hover:bg-white/[0.09] hover:shadow-md hover:shadow-black/40">
      <div className="flex items-center justify-center gap-2">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/[0.16] text-[12px] font-semibold text-white/90 ring-1 ring-white/10">
          {step}
        </span>
        <span className="text-xs font-semibold text-white/90">{title}</span>
      </div>
      <p className="mt-1 text-[11px] leading-snug text-white/65">{detail}</p>
    </div>
  );
}

function StepArrow() {
  return (
    <span className="mx-auto select-none sm:mx-0" aria-hidden="true">
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-white/60 shadow-sm shadow-black/20">
        <span className="text-base leading-none sm:hidden">↓</span>
        <span className="hidden text-lg leading-none sm:inline">→</span>
      </span>
    </span>
  );
}

function EarningsExamplesCard() {
  const scenarios = [
    { subs: 10, label: "10 subscribers" },
    { subs: 20, label: "20 subscribers" },
    { subs: 50, label: "50 subscribers" },
    { subs: 100, label: "100 subscribers" },
  ];

  return (
    <div className="w-full max-w-3xl">
      <div className="rounded-2xl border border-white/20 bg-white/[0.06] p-4 text-left shadow-sm shadow-black/30 backdrop-blur-md">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
          <p className="text-xs font-semibold text-white/90">
            Earning potential (illustrative)
          </p>
          <p className="text-[11px] text-white/55">
            Assumes ${INTRO_MONTHLY_PRICE.toFixed(2)}/mo and 50% rev share • USD
          </p>
        </div>

        <div className="mt-3 overflow-hidden rounded-xl border border-white/15">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px] text-left text-xs tabular-nums">
              <thead className="bg-white/[0.06] text-white/65">
                <tr>
                  <th scope="col" className="px-3 py-2 font-medium">
                    Referrals
                  </th>
                  <th scope="col" className="px-3 py-2 text-right font-medium">
                    Recurring to you (per month)
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-2 text-right font-medium text-white/80 bg-white/[0.08] border-l border-white/10"
                  >
                    Why it matters
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-white/90">
                {scenarios.map(({ subs, label }) => {
                  const monthly = (subs * MONTHLY_EARNING).toFixed(0);
                  return (
                    <tr key={subs}>
                      <td className="px-3 py-2">{label}</td>
                      <td className="px-3 py-2 text-right font-semibold">
                        ~${monthly}/mo
                      </td>
                      <td className="px-3 py-2 text-right text-white/80 bg-white/[0.08] border-l border-white/10">
                        Recurring while they stay subscribed
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-3 text-[11px] leading-relaxed text-white/60">
          Illustrative examples only — your actual earnings depend on referrals,
          pricing, and subscriber retention. Annual plan share is ~$
          {YEARLY_EARNING.toFixed(0)} per subscriber per year at current intro
          pricing.
        </p>
      </div>
    </div>
  );
}

function PricingBreakdownCard() {
  return (
    <div className="w-full max-w-3xl">
      <div className="rounded-2xl border border-white/20 bg-white/[0.05] p-4 text-left shadow-sm shadow-black/30 backdrop-blur-md">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
          <p className="text-xs font-semibold text-white/85">
            Current pricing & your share (details)
          </p>
          <p className="text-[11px] text-white/50">
            USD • Prices may change over time.
          </p>
        </div>

        <div className="mt-3 overflow-hidden rounded-xl border border-white/15">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px] text-left text-xs tabular-nums">
              <thead className="bg-white/[0.06] text-white/60">
                <tr>
                  <th scope="col" className="px-3 py-2 font-medium">
                    Plan
                  </th>
                  <th scope="col" className="px-3 py-2 text-right font-medium">
                    Price (USD)
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-2 text-right font-medium text-white/75 bg-white/[0.08] border-l border-white/10"
                  >
                    Your 50% (USD)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-white/85">
                <tr>
                  <td className="px-3 py-2">Monthly</td>
                  <td className="px-3 py-2 text-right">
                    ${INTRO_MONTHLY_PRICE.toFixed(2)}/mo
                  </td>
                  <td className="px-3 py-2 text-right font-semibold text-white bg-white/[0.08] border-l border-white/10">
                    ~${MONTHLY_EARNING.toFixed(2)}/mo
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2">Annual</td>
                  <td className="px-3 py-2 text-right">
                    ${INTRO_YEARLY_PRICE.toFixed(2)}/yr
                  </td>
                  <td className="px-3 py-2 text-right font-semibold text-white bg-white/[0.08] border-l border-white/10">
                    ~${YEARLY_EARNING.toFixed(2)}/yr
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-3 text-[11px] leading-relaxed text-white/55">
          Earnings are per active subscriber attributed to your link (amounts
          rounded).
        </p>
      </div>
    </div>
  );
}

function SecondaryCTA() {
  return (
    <a
      href={PARTNER_PORTAL_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[0.05] px-5 py-2 text-xs font-semibold text-white/85 shadow-sm shadow-black/20 transition hover:bg-white/[0.09] hover:text-white"
    >
      Start earning 50%
    </a>
  );
}

export default function PartnerPage() {
  return (
    <main className="relative overflow-hidden bg-[#070A12] text-white">
      {/* Background glow */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-240px] h-[620px] w-[900px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute left-1/2 top-[120px] h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 pb-14 pt-10 md:pb-20 md:pt-14">
        {/* HERO */}
        <div className="mx-auto max-w-4xl text-center">
          <Eyebrow>MoodMap Partner Program</Eyebrow>

          <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight text-emerald-300 md:text-6xl">
            Earn 50% Lifetime Recurring Revenue
          </h1>

          <p className="mx-auto mt-4 max-w-3xl text-pretty text-base leading-relaxed text-white/85 md:text-lg">
            MoodMap is{" "}
            <span className="font-semibold">relationship‑intelligence</span>{" "}
            delivered daily — it turns her cycle cues into clear, practical
            timing signals for him (better for both partners).
          </p>

          <p className="mt-3 text-sm text-white/70">
            Not therapy. Not fertility tracking. Context, not guarantees.
          </p>

          {/* Trust + positioning */}
          <div className="mt-5 flex flex-col items-center gap-3">
            <p className="text-sm text-white/75">
              Private by design. Made in Norway.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2">
              <MetaPill>Subscriptions via Stripe</MetaPill>
              <MetaPill>Tracking & payouts via PromoteKit</MetaPill>
            </div>
          </div>

          {/* Primary CTA */}
          <div className="mt-7 flex flex-col items-center gap-3">
            <a
              href={PARTNER_PORTAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-emerald-400 to-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/10 transition hover:opacity-95 sm:w-auto"
            >
              Start earning 50%
            </a>

            <p className="text-xs text-white/70">
              No application needed — instant access via PromoteKit.
            </p>
          </div>

          {/* Fit hints (creator relevance) */}
          <div className="mt-6 flex flex-col items-center gap-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/50">
              Great fit for creators in
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <TagPill>Men&apos;s self‑improvement</TagPill>
              <TagPill>Dating & relationships</TagPill>
              <TagPill>Couples communication</TagPill>
              <TagPill>Mental performance</TagPill>
            </div>
          </div>

          {/* Steps + Earnings */}
          <div className="mt-8 flex w-full flex-col items-center gap-4">
            <div className="w-full max-w-3xl">
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/50">
                How it works
              </p>
              <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-center sm:gap-3">
                <StepCard
                  step="1"
                  title="Get your link"
                  detail="Instant access in your PromoteKit dashboard"
                />
                <StepArrow />
                <StepCard
                  step="2"
                  title="Share it"
                  detail="Bio link, posts, newsletter"
                />
                <StepArrow />
                <StepCard
                  step="3"
                  title="Get paid recurring"
                  detail="50% on active subscribers"
                />
              </div>
            </div>

            <EarningsExamplesCard />

            {/* Optional: transparent breakdown without anchoring the main read */}
            <div className="w-full max-w-3xl">
              <details className="group rounded-2xl border border-white/15 bg-white/[0.03] p-4 text-left">
                <summary className="cursor-pointer list-none text-xs font-semibold text-white/80 outline-none transition group-open:text-white">
                  <span className="align-middle">
                    See current pricing & per-subscriber breakdown
                  </span>
                  <span className="ml-2 align-middle text-white/50 group-open:hidden">
                    (optional)
                  </span>
                  <span className="ml-2 hidden align-middle text-white/50 group-open:inline">
                    (hide)
                  </span>
                </summary>
                <div className="mt-4">
                  <PricingBreakdownCard />
                </div>
              </details>
            </div>

            {/* Secondary CTA for bottom-of-hero */}
            <SecondaryCTA />

            <p className="mt-1 max-w-3xl text-center text-xs leading-relaxed text-white/60">
              Provides context, not guarantees. Not contraception. Not fertility
              planning.
            </p>

            {/* NOTE: Footer is handled by the global site layout. */}
          </div>
        </div>
      </div>
    </main>
  );
}
