// src/app/partner/page.js
import Link from "next/link";
import { FaApple, FaGooglePlay } from "react-icons/fa";

const SITE_URL = "https://moodmap-app.com";
const PAGE_PATH = "/partner";
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;

const PARTNER_PORTAL_URL = "https://moodmap.promotekit.com";

// Keep consistent with layout.js
const APPSTORE_URL = "https://apps.apple.com/app/moodmap-moodcoaster/id6746102626";
const PLAYSTORE_URL =
  "https://play.google.com/store/apps/details?id=com.eilev.moodmapnextgen";

/**
 * Optional env vars for showing concrete examples / hard program facts.
 * (If not provided, we show truthful “shown in portal” language.)
 *
 * - NEXT_PUBLIC_MOODMAP_SUBSCRIPTION_PRICE (e.g. "19.99")
 * - NEXT_PUBLIC_MOODMAP_SUBSCRIPTION_CURRENCY (e.g. "USD", "NOK", "EUR")
 * - NEXT_PUBLIC_MOODMAP_SUBSCRIPTION_PERIOD (e.g. "mo", "month")
 *
 * - NEXT_PUBLIC_MOODMAP_ATTRIBUTION_MODEL (e.g. "Last-click")
 * - NEXT_PUBLIC_MOODMAP_ATTRIBUTION_WINDOW_DAYS (e.g. "30")
 * - NEXT_PUBLIC_MOODMAP_PAYOUT_SCHEDULE (e.g. "Monthly (Net-30)")
 * - NEXT_PUBLIC_MOODMAP_PAYOUT_THRESHOLD (e.g. "USD 25")
 * - NEXT_PUBLIC_MOODMAP_LEGAL_ENTITY (e.g. "MoodMap AS")
 * - NEXT_PUBLIC_MOODMAP_ORG_NO (e.g. "123 456 789")
 */
const SUB_PRICE_RAW = process.env.NEXT_PUBLIC_MOODMAP_SUBSCRIPTION_PRICE;
const SUB_CURRENCY = process.env.NEXT_PUBLIC_MOODMAP_SUBSCRIPTION_CURRENCY || "USD";
const SUB_PERIOD = process.env.NEXT_PUBLIC_MOODMAP_SUBSCRIPTION_PERIOD || "mo";

const ATTRIBUTION_MODEL = process.env.NEXT_PUBLIC_MOODMAP_ATTRIBUTION_MODEL || "";
const ATTRIBUTION_WINDOW_DAYS = process.env.NEXT_PUBLIC_MOODMAP_ATTRIBUTION_WINDOW_DAYS || "";
const PAYOUT_SCHEDULE = process.env.NEXT_PUBLIC_MOODMAP_PAYOUT_SCHEDULE || "";
const PAYOUT_THRESHOLD = process.env.NEXT_PUBLIC_MOODMAP_PAYOUT_THRESHOLD || "";
const LEGAL_ENTITY = process.env.NEXT_PUBLIC_MOODMAP_LEGAL_ENTITY || "";
const ORG_NO = process.env.NEXT_PUBLIC_MOODMAP_ORG_NO || "";

export const metadata = {
  title: "Partner Program — MoodMap",
  description:
    "Join the MoodMap Partner Program. Earn 50% lifetime recurring revenue share for every subscriber attributed to your link.",
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
      "Earn 50% lifetime recurring revenue share for every subscriber attributed to your link. Free to join. Tracking & payouts via PromoteKit.",
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

function formatMoney(amount, currency) {
  const n = Number(amount);
  if (!Number.isFinite(n)) return null;
  return `${currency} ${n.toFixed(2)}`;
}

function earningsExampleLine() {
  const price = Number(SUB_PRICE_RAW);
  if (Number.isFinite(price) && price > 0) {
    const share = price * 0.5;
    return `Example: ${formatMoney(price, SUB_CURRENCY)}/${SUB_PERIOD} → you earn ${formatMoney(
      share,
      SUB_CURRENCY
    )}/${SUB_PERIOD} per active subscriber.`;
  }
  return null;
}

function compactJoinTermsLine() {
  return (
    <>
      <span className="text-white/80">50% lifetime recurring</span> (as long as the subscriber stays
      active).{" "}
      <Link
        href="/terms"
        className="underline decoration-white/20 underline-offset-4 hover:decoration-white/40"
      >
        Terms apply
      </Link>
      .
    </>
  );
}

function attributionSummary() {
  const parts = [];
  if (ATTRIBUTION_MODEL) parts.push(ATTRIBUTION_MODEL);
  if (ATTRIBUTION_WINDOW_DAYS) parts.push(`${ATTRIBUTION_WINDOW_DAYS}-day window`);
  return parts.length ? parts.join(" • ") : null;
}

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

function Card({ title, children, accent = false }) {
  return (
    <div
      className={[
        "rounded-2xl border bg-white/5 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] backdrop-blur",
        accent ? "border-emerald-300/20" : "border-white/10",
      ].join(" ")}
    >
      <h3 className="text-base font-semibold text-white">{title}</h3>
      <div className="mt-2 text-sm leading-relaxed text-white/70">{children}</div>
    </div>
  );
}

function MiniKpi({ label, value }) {
  if (!value) return null;
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-white/80">{value}</p>
    </div>
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
        <p className="mt-2 text-sm text-white/60">
          {/* reserve space so the click target feels stable */}
        </p>
      </summary>

      <div className="-mt-2 text-sm leading-relaxed text-white/70">{children}</div>
    </details>
  );
}

/**
 * Trust element that is always true (official links + clear “what it is / isn't”)
 */
function VerifyMoodMapCard() {
  const example = earningsExampleLine();
  const attrib = attributionSummary();

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] backdrop-blur">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold text-white/70">Verify MoodMap</p>
        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-medium text-white/70">
          Official links
        </span>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-white/70">
        Sanity‑check the product before joining. These are the official listings.
      </p>

      <div className="mt-4 grid gap-3">
        <a
          href={APPSTORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/85 transition hover:bg-white/10"
        >
          <span className="inline-flex items-center gap-2">
            <FaApple aria-hidden="true" />
            App Store listing
          </span>
          <span className="text-white/45" aria-hidden="true">
            ↗
          </span>
        </a>

        <a
          href={PLAYSTORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/85 transition hover:bg-white/10"
        >
          <span className="inline-flex items-center gap-2">
            <FaGooglePlay aria-hidden="true" />
            Google Play listing
          </span>
          <span className="text-white/45" aria-hidden="true">
            ↗
          </span>
        </a>

        <a
          href={SITE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/85 transition hover:bg-white/10"
        >
          <span className="inline-flex items-center gap-2">
            <span className="text-white/70" aria-hidden="true">
              🌐
            </span>
            Website
          </span>
          <span className="text-white/45" aria-hidden="true">
            ↗
          </span>
        </a>
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
        <p className="text-xs font-semibold text-white/80">Partner economics</p>
        <p className="mt-1 text-xs leading-relaxed text-white/60">
          Earn <span className="text-white/80">50% lifetime recurring</span> for every subscriber
          attributed to your link — paid each billing cycle while they stay active.
        </p>

        <p className="mt-2 text-[11px] leading-relaxed text-white/50">
          Commission is calculated on <span className="text-white/70">eligible subscription revenue</span>{" "}
          (handling of platform fees, taxes, refunds/chargebacks is defined in the program terms).
        </p>

        {example ? <p className="mt-2 text-xs text-white/55">{example}</p> : null}

        <p className="mt-2 text-[11px] text-white/45">
          {attrib ? (
            <>
              Attribution: <span className="text-white/60">{attrib}</span>. Full details in the
              portal.
            </>
          ) : (
            <>Attribution settings are shown in the partner portal.</>
          )}
        </p>

        <p className="mt-2 text-[11px] text-white/45">
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
            Privacy
          </Link>
        </p>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-white/55">
        Built in Norway. Private by design. Tracking & payouts via the partner portal (PromoteKit).
      </p>

      <p className="mt-3 text-[11px] leading-relaxed text-white/45">
        Not medical advice. Not contraception. MoodMap provides timing context — it does not diagnose
        or predict individual outcomes.
      </p>
    </div>
  );
}

function MobileStickyCTA() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#070A12]/80 backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold text-white">50% lifetime recurring</p>
          <p className="truncate text-[11px] text-white/60">
            Join free • Tracking via PromoteKit • Terms apply
          </p>
        </div>
        <a
          href={PARTNER_PORTAL_URL}
          className="shrink-0 rounded-full bg-gradient-to-r from-emerald-400 to-blue-500 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-emerald-500/10 transition hover:opacity-95"
        >
          Join
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
        {/* HERO */}
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-10">
            {/* Left */}
            <div className="text-center md:text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
                MoodMap Partner Program
              </p>

              <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight text-emerald-300 md:text-6xl">
                Earn 50% lifetime recurring.
              </h1>

              <p className="mt-4 text-pretty text-base leading-relaxed text-white/85 md:text-lg">
                Promote a premium daily briefing that turns cycle timing into relationship context —
                so partners communicate better with less guesswork.
              </p>

              <p className="mt-3 text-sm text-white/70">
                <span className="italic text-white/70">Built for him. Better for both of you.</span>
              </p>

              {/* Offer callout (tight + trust-forward) */}
              <div className="mt-6 rounded-2xl border border-emerald-300/20 bg-emerald-400/10 p-4 text-left">
                <p className="text-sm font-semibold text-white">
                  {compactJoinTermsLine()}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-white/80">
                  Free to join. Setup takes minutes. Tracking & payouts via PromoteKit.
                </p>
                <p className="mt-3 text-xs leading-relaxed text-white/60">
                  Educational relationship tool — not medical advice, not contraception, not fertility
                  planning.
                </p>
              </div>

              {/* Primary CTA */}
              <div className="mt-6 flex flex-col items-center gap-2 md:items-start">
                <a
                  href={PARTNER_PORTAL_URL}
                  className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-emerald-400 to-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/10 transition hover:opacity-95 sm:w-auto"
                >
                  Join free
                </a>

                <div className="flex items-center gap-3 text-sm font-semibold">
                  <Link
                    href="#faq"
                    className="inline-flex items-center gap-2 text-white/75 underline decoration-white/20 underline-offset-4 hover:text-white hover:decoration-white/40"
                  >
                    Read the FAQ <span aria-hidden="true">↓</span>
                  </Link>

                  <span className="text-white/30" aria-hidden="true">
                    •
                  </span>

                  <Link
                    href="#details"
                    className="inline-flex items-center gap-2 text-white/75 underline decoration-white/20 underline-offset-4 hover:text-white hover:decoration-white/40"
                  >
                    What you’re promoting <span aria-hidden="true">↓</span>
                  </Link>
                </div>
              </div>

              {/* Legitimacy strip (short, not salesy) */}
              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <MiniKpi
                  label="Tracking"
                  value="PromoteKit portal + dashboard"
                />
                <MiniKpi
                  label="Policies"
                  value="Terms + Privacy on-site"
                />
                <MiniKpi
                  label="Support"
                  value="support@moodmap-app.com"
                />
                <MiniKpi
                  label="Company"
                  value={
                    LEGAL_ENTITY && ORG_NO
                      ? `${LEGAL_ENTITY} • Org. no. ${ORG_NO}`
                      : LEGAL_ENTITY
                      ? LEGAL_ENTITY
                      : ORG_NO
                      ? `Org. no. ${ORG_NO}`
                      : ""
                  }
                />
              </div>
            </div>

            {/* Right */}
            <div className="mx-auto w-full max-w-sm md:mx-0 md:justify-self-end">
              <VerifyMoodMapCard />
            </div>
          </div>
        </div>

        {/* 3 cards (tight + conversion-relevant) */}
        <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-4 md:mt-12 md:grid-cols-3">
          <Card title="Recurring offer that retains">
            MoodMap is a daily habit product — strong fit for recurring revenue share when retention
            is driven by real day‑to‑day utility.
          </Card>

          <Card title="Clear positioning" accent>
            Designed for men, payoff shared: clearer timing, better conversations, fewer misreads.
            Easy to explain in one sentence.
          </Card>

          <Card title="Clean tracking, transparent payouts">
            Your tracked link + dashboard in PromoteKit. See attributed signups/subscribers and payouts
            in one place.
          </Card>
        </div>

        {/* DETAILS */}
        <div className="mt-10 space-y-6 md:mt-12 md:space-y-8">
          <Section
            id="details"
            title="What you’re promoting"
            subtitle="A premium daily briefing for couples. Cycle timing → practical relationship context."
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <h3 className="text-sm font-semibold text-white">
                  For the partner using MoodMap
                </h3>
                <CheckList
                  items={[
                    "Better timing, fewer misreads",
                    "Clear “what matters today” context",
                    "Practical language for communication",
                  ]}
                />
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <h3 className="text-sm font-semibold text-white">
                  For the partner who benefits
                </h3>
                <CheckList
                  items={[
                    "Feels understood (without over-explaining)",
                    "Better emotional timing & support",
                    "Less friction from “wrong moment” talks",
                  ]}
                />
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <h3 className="text-sm font-semibold text-white">For the relationship</h3>
                <CheckList
                  items={[
                    "Fewer avoidable conflicts",
                    "More alignment and closeness",
                    "Calmer baseline over time",
                  ]}
                />
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm leading-relaxed text-white/75 backdrop-blur">
              <span className="font-semibold text-white">He uses it — she feels it.</span> MoodMap is
              designed for men, but the payoff is shared: more empathy, better timing, fewer avoidable
              misreads.
            </div>
          </Section>

          <Section
            title="What creators get"
            subtitle="Creator-ready assets and guardrails — so you can promote confidently and accurately."
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <h3 className="text-sm font-semibold text-white">In the partner portal</h3>
                <CheckList
                  items={[
                    "Tracked link + real-time dashboard",
                    "Attributed signups / subscribers visibility",
                    "Payout history + reporting",
                    "Swipe copy + hooks you can adapt",
                    "Media kit (logos, screenshots, b-roll)",
                    "Claim guidelines (what to say / avoid)",
                  ]}
                />
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm leading-relaxed text-white/75 backdrop-blur">
                <p className="font-semibold text-white">Why this matters</p>
                <p className="mt-2 text-white/70">
                  Creators win when tracking is clean and messaging is safe. We optimize for long-term
                  trust: realistic claims, clear disclaimers, and transparent attribution.
                </p>

                <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs font-semibold text-white/80">Plain-English terms summary</p>
                  <ul className="mt-2 space-y-2 text-xs leading-relaxed text-white/60">
                    <li>
                      • <span className="text-white/75">50% lifetime recurring</span> while the subscriber
                      stays active (attributed to your link).
                    </li>
                    <li>
                      • Commission is calculated on <span className="text-white/70">eligible subscription revenue</span>{" "}
                      (fees/taxes/refunds handled per terms).
                    </li>
                    <li>
                      • Full terms, attribution rules, and payouts are shown inside the portal.
                    </li>
                  </ul>
                </div>

                <p className="mt-4 text-[11px] text-white/45">
                  See{" "}
                  <Link
                    href="/terms"
                    className="underline decoration-white/20 underline-offset-4 hover:decoration-white/40"
                  >
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy-policy"
                    className="underline decoration-white/20 underline-offset-4 hover:decoration-white/40"
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
            </div>
          </Section>

          <Section
            id="faq"
            title="FAQ (2 minutes)"
            subtitle="The practical questions creators ask before they promote."
          >
            <div className="grid grid-cols-1 gap-4">
              <FaqItem q="How does attribution work (cookie window / model)?">
                <p>
                  Attribution is tracked via the PromoteKit portal.{" "}
                  {attributionSummary() ? (
                    <>
                      Current settings: <span className="text-white/80">{attributionSummary()}</span>.
                    </>
                  ) : (
                    <>
                      The exact attribution model and window are shown in your dashboard.
                    </>
                  )}{" "}
                  You’ll be able to verify attributed subscribers and earnings directly in the portal.
                </p>
              </FaqItem>

              <FaqItem q="What about App Store / Google Play installs?">
                <p>
                  We use official store listings (no unofficial APKs). If a user comes through your
                  tracked flow and later subscribes, attribution is reflected in the partner portal
                  where technically possible. Your dashboard is the source of truth for which
                  subscribers are attributed to you.
                </p>
              </FaqItem>

              <FaqItem q="When do you pay?">
                <p>
                  {PAYOUT_SCHEDULE ? (
                    <>
                      Payout schedule: <span className="text-white/80">{PAYOUT_SCHEDULE}</span>.
                    </>
                  ) : (
                    <>
                      Payout timing is shown in the partner portal (including the payout cadence and
                      any processing delays).
                    </>
                  )}{" "}
                  All payout details are visible inside your account.
                </p>
              </FaqItem>

              <FaqItem q="Is there a minimum payout threshold?">
                <p>
                  {PAYOUT_THRESHOLD ? (
                    <>
                      Minimum payout: <span className="text-white/80">{PAYOUT_THRESHOLD}</span>.
                    </>
                  ) : (
                    <>
                      Any minimum payout threshold (if applicable) is shown in the partner portal.
                    </>
                  )}
                </p>
              </FaqItem>

              <FaqItem q="What happens on refunds, cancellations, or chargebacks?">
                <p>
                  Earnings are paid for active, eligible subscriptions. Refunds/chargebacks and early
                  cancellations are handled according to the program terms and may adjust the
                  associated commission in your payout history.
                </p>
              </FaqItem>

              <FaqItem q="What traffic is allowed (paid ads, email, brand bidding)?">
                <p>
                  Allowed promotion methods are defined in the program terms inside the portal. In
                  practice, most creators use organic social content, podcasts, newsletters, and owned
                  communities. If you want to run paid search or brand bidding, check the portal rules
                  first (or email support).
                </p>
              </FaqItem>
            </div>

            <div className="mt-6 flex flex-col items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur md:flex-row md:text-left">
              <div>
                <p className="text-sm font-semibold text-white">Ready to join?</p>
                <p className="mt-1 text-sm text-white/70">
                  Get your link + dashboard via PromoteKit. Start earning 50% lifetime recurring.
                </p>
              </div>
              <a
                href={PARTNER_PORTAL_URL}
                className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-emerald-400 to-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/10 transition hover:opacity-95 md:w-auto"
              >
                Join free
              </a>
            </div>
          </Section>

          <Section
            title="Creator-safe framing"
            subtitle="Keep it accurate, high-trust, and platform-friendly."
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <h3 className="text-sm font-semibold text-white">What you can say</h3>
                <CheckList
                  items={[
                    "Daily briefings that provide timing context (not certainty)",
                    "Helps reduce misreads and improve conversation timing",
                    "Models timing as windows — cycles vary",
                    "Relationship guidance, not medical advice",
                  ]}
                />
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <h3 className="text-sm font-semibold text-white">Avoid claims like</h3>
                <CheckList
                  items={[
                    "“Predicts mood/behavior”",
                    "“Explains or justifies reactions”",
                    "“Contraception” or fertility planning guarantees",
                    "Medical/clinical diagnosis or treatment claims",
                  ]}
                />
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-xs font-semibold text-white/80">Copy‑paste (safe description)</p>
              <p className="mt-2 text-sm leading-relaxed text-white/70">
                “MoodMap is a premium daily briefing that turns cycle timing into relationship context —
                helping couples avoid misreads and bad timing. It models timing as windows (cycles vary)
                and is for relationship guidance — not medical advice or contraception.”
              </p>
            </div>
          </Section>

          <Section
            title="Creator quick start"
            subtitle="3 angles + one short script you can use today."
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <h3 className="text-sm font-semibold text-white">Angles that work</h3>
                <ul className="mt-3 space-y-2 text-sm leading-relaxed text-white/70">
                  <li>
                    <span className="text-white">“Same message. Wrong day.”</span> Timing is leverage.
                  </li>
                  <li>
                    <span className="text-white">“He uses it — she feels it.”</span> Small daily habit,
                    shared payoff.
                  </li>
                  <li>
                    <span className="text-white">“Context, not prediction.”</span> It’s about better
                    interpretation, not certainty.
                  </li>
                </ul>

                <p className="mt-4 text-xs text-white/55">
                  More assets and tracking are available in the partner portal.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <h3 className="text-sm font-semibold text-white">Short script</h3>
                <div className="mt-3 rounded-xl border border-white/10 bg-black/20 p-4 text-sm leading-relaxed text-white/75">
                  <p>
                    I’ve been testing MoodMap — it’s a premium daily “context briefing” based on cycle
                    timing, so you don’t misread the moment.
                  </p>
                  <p className="mt-3">
                    It models timing as windows (cycles vary). It’s relationship guidance — not medical
                    advice or contraception.
                  </p>
                  <p className="mt-3">If you’re in a relationship and want things to feel easier, check it out.</p>
                </div>
              </div>
            </div>
          </Section>
        </div>

        {/* Final CTA */}
        <div className="mx-auto mt-10 max-w-3xl text-center md:mt-12">
          <a
            href={PARTNER_PORTAL_URL}
            className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-emerald-400 to-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/10 transition hover:opacity-95 sm:w-auto"
          >
            Join free
          </a>

          <p className="mt-3 text-xs text-white/55">
            {compactJoinTermsLine()} Tracking & payouts via PromoteKit.
          </p>

          <p className="mt-4 text-sm text-white/65">
            Questions?{" "}
            <a
              href="mailto:support@moodmap-app.com"
              className="underline decoration-white/20 underline-offset-4 hover:decoration-white/40"
            >
              support@moodmap-app.com
            </a>
          </p>

          <p className="mt-4 text-xs text-white/35">Invitation link • Not indexed.</p>
        </div>
      </div>
    </main>
  );
}
