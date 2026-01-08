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

function Eyebrow({ children }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
      {children}
    </p>
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
           Promote MoodMap — a premium daily relationship briefing for men.
		   Based on her cycle, translated into practical relationship context.
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
              Context, not certainty. Not contraception. Not fertility planning.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
