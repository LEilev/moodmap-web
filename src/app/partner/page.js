// src/app/partner/page.js
import Link from "next/link";

const SITE_URL = "https://moodmap-app.com";
const PAGE_PATH = "/partner";
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;

const PARTNER_PORTAL_URL = "https://moodmap.promotekit.com";

// Keep consistent with layout.js
const APPSTORE_URL = "https://apps.apple.com/app/moodmap-moodcoaster/id6746102626";
const PLAYSTORE_URL =
  "https://play.google.com/store/apps/details?id=com.eilev.moodmapnextgen";

/**
 * Optional env vars for showing concrete program facts.
 * If not provided, we keep language truthful (“shown in portal/terms”).
 *
 * - NEXT_PUBLIC_MOODMAP_ATTRIBUTION_MODEL (e.g. "Last-click")
 * - NEXT_PUBLIC_MOODMAP_ATTRIBUTION_WINDOW_DAYS (e.g. "30")
 * - NEXT_PUBLIC_MOODMAP_PAYOUT_SCHEDULE (e.g. "Monthly (Net-30)")
 * - NEXT_PUBLIC_MOODMAP_PAYOUT_THRESHOLD (e.g. "USD 25")
 */
const ATTRIBUTION_MODEL = process.env.NEXT_PUBLIC_MOODMAP_ATTRIBUTION_MODEL || "";
const ATTRIBUTION_WINDOW_DAYS = process.env.NEXT_PUBLIC_MOODMAP_ATTRIBUTION_WINDOW_DAYS || "";
const PAYOUT_SCHEDULE = process.env.NEXT_PUBLIC_MOODMAP_PAYOUT_SCHEDULE || "";
const PAYOUT_THRESHOLD = process.env.NEXT_PUBLIC_MOODMAP_PAYOUT_THRESHOLD || "";

export const metadata = {
  title: "Partner Program — MoodMap",
  description:
    "Join the MoodMap Partner Program. Earn 50% lifetime recurring revenue share for every subscriber attributed to your link. Tracking via PromoteKit. Billing via Stripe.",
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
      "Earn 50% lifetime recurring revenue share for every subscriber attributed to your link. Free to join. Tracking via PromoteKit. Billing via Stripe.",
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
      "Earn 50% lifetime recurring revenue share for every subscriber attributed to your link. Free to join.",
    images: ["/icon.png"],
  },
};

function attributionSummary() {
  const parts = [];
  if (ATTRIBUTION_MODEL) parts.push(ATTRIBUTION_MODEL);
  if (ATTRIBUTION_WINDOW_DAYS) parts.push(`${ATTRIBUTION_WINDOW_DAYS}-day window`);
  return parts.length ? parts.join(" • ") : null;
}

function FaqItem({ q, children }) {
  return (
    <details className="group rounded-xl border border-white/10 bg-white/5 p-4">
      <summary className="cursor-pointer list-none">
        <div className="flex items-start justify-between gap-4">
          <p className="text-sm font-semibold text-white">{q}</p>
          <span className="mt-0.5 text-white/50 transition group-open:rotate-45" aria-hidden="true">
            +
          </span>
        </div>
      </summary>

      <div className="mt-3 text-sm leading-relaxed text-white/70">{children}</div>
    </details>
  );
}

function MobileStickyCTA() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#070A12]/80 backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-3">
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold text-white">50% lifetime recurring</p>
          <p className="truncate text-[11px] text-white/60">
            PromoteKit tracking • Stripe billing
          </p>
        </div>

        <a
          href={PARTNER_PORTAL_URL}
          className="shrink-0 rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#070A12] transition hover:opacity-90"
        >
          Join free
        </a>
      </div>
    </div>
  );
}

export default function PartnerPage() {
  const attrib = attributionSummary();

  return (
    <main className="relative overflow-hidden bg-[#070A12] text-white">
      <MobileStickyCTA />

      {/* Subtle background glow (reduced) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-240px] h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/35" />
      </div>

      {/* Extra bottom padding so content isn't hidden behind mobile sticky CTA */}
      <div className="relative mx-auto max-w-4xl px-6 pb-28 pt-16 md:pb-20 md:pt-24">
        {/* HERO */}
        <header className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
            MoodMap Partner Program
          </p>

          <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight text-white md:text-6xl">
            Earn 50% lifetime recurring.
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed text-white/80 md:text-lg">
            Promote MoodMap — a premium daily relationship “context briefing” based on cycle timing.
          </p>

          {/* Minimal trust line (PromoteKit + Stripe) */}
          <p className="mx-auto mt-4 max-w-2xl text-sm text-white/65">
            Tracking via <span className="text-white/80">PromoteKit</span> • Billing via{" "}
            <span className="text-white/80">Stripe</span> •{" "}
            <Link
              href="/terms"
              className="underline decoration-white/20 underline-offset-4 hover:decoration-white/40"
            >
              Terms apply
            </Link>
          </p>

          {/* Single disclaimer (once) */}
          <p className="mx-auto mt-3 max-w-2xl text-xs leading-relaxed text-white/50">
            Relationship guidance — not medical advice, contraception, or fertility planning.
          </p>

          <div className="mt-7 flex flex-col items-center gap-3">
            <a
              href={PARTNER_PORTAL_URL}
              className="inline-flex w-full max-w-xs items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#070A12] transition hover:opacity-90"
            >
              Join free
            </a>

            <Link
              href="#faq"
              className="text-sm font-semibold text-white/70 underline decoration-white/20 underline-offset-4 hover:text-white hover:decoration-white/40"
            >
              Read the FAQ
            </Link>
          </div>
        </header>

        {/* Minimal “what you’re promoting” (no cards) */}
        <section className="mx-auto mt-12 max-w-2xl">
          <h2 className="text-base font-semibold text-white">What you’re promoting</h2>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-white/70">
            <li>• Cycle timing → practical relationship context (daily).</li>
            <li>• Designed for men; payoff is shared for the couple.</li>
            <li>• Context, not prediction — fewer “wrong moment” conversations.</li>
          </ul>
        </section>

        {/* FAQ (kept to 4) */}
        <section id="faq" className="mx-auto mt-12 max-w-2xl scroll-mt-24">
          <h2 className="text-base font-semibold text-white">FAQ</h2>

          <div className="mt-4 grid gap-3">
            <FaqItem q="How does attribution work?">
              <p>
                Attribution is tracked in the <span className="text-white/80">PromoteKit</span>{" "}
                partner portal.{" "}
                {attrib ? (
                  <>
                    Current settings: <span className="text-white/80">{attrib}</span>.
                  </>
                ) : (
                  <>The exact attribution model and window are shown in your dashboard.</>
                )}
              </p>
            </FaqItem>

            <FaqItem q="When do you pay, and is there a minimum threshold?">
              <p>
                Payouts are defined and shown in your partner portal.{" "}
                {PAYOUT_SCHEDULE ? (
                  <>
                    Schedule: <span className="text-white/80">{PAYOUT_SCHEDULE}</span>.
                  </>
                ) : null}{" "}
                {PAYOUT_THRESHOLD ? (
                  <>
                    Minimum threshold: <span className="text-white/80">{PAYOUT_THRESHOLD}</span>.
                  </>
                ) : (
                  <>
                    Any payout cadence, processing time, and thresholds (if applicable) are visible
                    inside your account.
                  </>
                )}
              </p>
              <p className="mt-2 text-white/65">
                Refunds/chargebacks are handled per terms and may adjust commission in payout history.
              </p>
            </FaqItem>

            <FaqItem q="What promotion methods are allowed (paid ads, brand bidding, email)?">
              <p>
                Allowed traffic rules are defined in the program terms and enforced via the partner
                portal. If you plan paid search or brand bidding, verify the rules first — or ask
                support.
              </p>
            </FaqItem>

            <FaqItem q="Do you provide swipe copy / media kit / claim guidelines?">
              <p>
                Yes — inside the partner portal. You’ll find creator assets and guardrails so your
                messaging stays accurate and platform-friendly.
              </p>
            </FaqItem>
          </div>

          {/* Verify links (collapsed) */}
          <details className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
            <summary className="cursor-pointer list-none">
              <div className="flex items-start justify-between gap-4">
                <p className="text-sm font-semibold text-white">Verify official product links</p>
                <span className="mt-0.5 text-white/50" aria-hidden="true">
                  ↧
                </span>
              </div>
              <p className="mt-1 text-sm text-white/60">
                App Store, Google Play, and the official website.
              </p>
            </summary>

            <div className="mt-4 grid gap-2 text-sm">
              <a
                href={APPSTORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-white/80 hover:bg-black/30"
              >
                App Store listing <span className="text-white/40">↗</span>
              </a>

              <a
                href={PLAYSTORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-white/80 hover:bg-black/30"
              >
                Google Play listing <span className="text-white/40">↗</span>
              </a>

              <a
                href={SITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-white/80 hover:bg-black/30"
              >
                moodmap-app.com <span className="text-white/40">↗</span>
              </a>
            </div>
          </details>
        </section>

        {/* Footer (minimal) */}
        <footer className="mx-auto mt-12 max-w-2xl border-t border-white/10 pt-6 text-center">
          <p className="text-sm text-white/65">
            Questions?{" "}
            <a
              href="mailto:support@moodmap-app.com"
              className="underline decoration-white/20 underline-offset-4 hover:decoration-white/40"
            >
              support@moodmap-app.com
            </a>
          </p>

          <p className="mt-3 text-xs text-white/45">
            <Link
              href="/terms"
              className="underline decoration-white/20 underline-offset-4 hover:decoration-white/40"
            >
              Terms
            </Link>{" "}
            <span className="opacity-40">•</span>{" "}
            <Link
              href="/privacy-policy"
              className="underline decoration-white/20 underline-offset-4 hover:decoration-white/40"
            >
              Privacy Policy
            </Link>
          </p>

          <p className="mt-3 text-[11px] text-white/35">Invitation link • Not indexed.</p>
        </footer>
      </div>
    </main>
  );
}
