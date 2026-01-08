const SITE_URL = "https://moodmap-app.com";
const PAGE_PATH = "/partner";
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;

const PARTNER_PORTAL_URL = "https://moodmap.promotekit.com";

// NOTE: Current intro prices (subject to change as pricing is tested/optimized).
const INTRO_MONTHLY_PRICE = 7.99;
const INTRO_YEARLY_PRICE = 49.99;
const REV_SHARE = 0.5;

const MONTHLY_EARNING = (INTRO_MONTHLY_PRICE * REV_SHARE).toFixed(2);
const YEARLY_EARNING = (INTRO_YEARLY_PRICE * REV_SHARE).toFixed(2);

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

function Eyebrow({ children }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
      {children}
    </p>
  );
}

function StepCard({ step, title, detail }) {
  return (
    <div className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center shadow-sm shadow-black/20 backdrop-blur-sm">
      <div className="flex items-center justify-center gap-2">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-[11px] font-semibold text-white/70">
          {step}
        </span>
        <span className="text-xs font-semibold text-white/85">{title}</span>
      </div>
      <p className="mt-1 text-[11px] leading-snug text-white/55">{detail}</p>
    </div>
  );
}

function StepArrow() {
  return (
    <span
      className="mx-auto select-none text-white/35 sm:mx-0"
      aria-hidden="true"
    >
      <span className="sm:hidden">↓</span>
      <span className="hidden sm:inline">→</span>
    </span>
  );
}

function EarningsCard() {
  return (
    <div className="w-full max-w-xl">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left shadow-sm shadow-black/20 backdrop-blur-sm">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
          <p className="text-xs font-semibold text-white/80">
            Earnings (intro pricing)
          </p>
          <p className="text-[11px] text-white/45">Prices may change over time.</p>
        </div>

        <div className="mt-3 overflow-hidden rounded-xl border border-white/10">
          <div className="overflow-x-auto">
            <table className="min-w-[360px] w-full text-left text-xs">
              <thead className="bg-white/5 text-white/60">
                <tr>
                  <th scope="col" className="px-3 py-2 font-medium">
                    Plan
                  </th>
                  <th scope="col" className="px-3 py-2 text-right font-medium">
                    Price
                  </th>
                  <th scope="col" className="px-3 py-2 text-right font-medium">
                    Your 50%
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-white/80">
                <tr>
                  <td className="px-3 py-2">Monthly</td>
                  <td className="px-3 py-2 text-right">
                    {INTRO_MONTHLY_PRICE.toFixed(2)}/mo
                  </td>
                  <td className="px-3 py-2 text-right">~{MONTHLY_EARNING}/mo</td>
                </tr>
                <tr>
                  <td className="px-3 py-2">Annual</td>
                  <td className="px-3 py-2 text-right">
                    {INTRO_YEARLY_PRICE.toFixed(2)}/yr
                  </td>
                  <td className="px-3 py-2 text-right">~{YEARLY_EARNING}/yr</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-3 text-[11px] leading-relaxed text-white/45">
          Earnings are per active subscriber attributed to your link.
        </p>
      </div>
    </div>
  );
}

function MetaPill({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-white/60">
      {children}
    </span>
  );
}

export default function PartnerPage() {
  return (
    <main className="relative overflow-hidden bg-[#070A12] text-white">
      {/* Background glow */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-260px] h-[620px] w-[900px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute left-1/2 top-[120px] h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 pb-16 pt-14 md:pb-24 md:pt-20">
        {/* HERO ONLY */}
        <div className="mx-auto max-w-4xl text-center">
          <Eyebrow>MoodMap Partner Program</Eyebrow>

          <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight text-emerald-300 md:text-6xl">
            Earn 50% lifetime recurring.
          </h1>

          <p className="mx-auto mt-4 max-w-3xl text-pretty text-base leading-relaxed text-white/85 md:text-lg">
            <span className="block">
              Promote MoodMap — a premium daily relationship briefing for men.
            </span>
            <span className="block">
              Her cycle timing, translated into practical relationship context.
            </span>
          </p>

          <p className="mt-4 text-sm text-white/70">
            Built for men. Better timing for both partners.
          </p>

          {/* Proof anchor (over the fold) */}
          <p className="mt-3 text-xs text-white/60">
            Private by design. Built in Norway.
          </p>

          <div className="mt-7 flex flex-col items-center gap-5">
            <a
              href={PARTNER_PORTAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-emerald-400 to-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/10 transition hover:opacity-95 sm:w-auto"
            >
              Get your link
            </a>

            {/* 3-step flow (boxed) */}
            <div className="w-full max-w-3xl">
              <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-center sm:gap-3">
                <StepCard
                  step="1"
                  title="Get your link"
                  detail="Instant access via PromoteKit"
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
                  title="Earn recurring"
                  detail="50% on active subscribers"
                />
              </div>
            </div>

            {/* Earnings table */}
            <EarningsCard />

            {/* Infrastructure / trust pills */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <MetaPill>Subscriptions via Stripe</MetaPill>
              <MetaPill>Tracking & payouts via PromoteKit</MetaPill>
            </div>

            <p className="mt-1 text-xs leading-relaxed text-white/55">
              Context, not certainty. Not contraception. Not fertility planning.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
