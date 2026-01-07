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

export const metadata = {
  title: "Partner Program — MoodMap",
  description:
    "Join the MoodMap Partner Program. Earn 50% lifetime recurring revenue share for every subscriber attributed to your link. Subscriptions processed via Stripe. Tracking & payouts via PromoteKit.",
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
      "Earn 50% lifetime recurring revenue share for every subscriber attributed to your link. Subscriptions processed via Stripe. Tracking & payouts via PromoteKit.",
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
      "Earn 50% lifetime recurring revenue share. Subscriptions processed via Stripe. Tracking & payouts via PromoteKit.",
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

function OfficialLinks() {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      <a
        href={APPSTORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/85 transition hover:bg-white/10"
      >
        <span className="inline-flex items-center gap-2">
          <FaApple aria-hidden="true" />
          App Store
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
          Google Play
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
        <span className="inline-flex items-center gap-2">moodmap-app.com</span>
        <span className="text-white/45" aria-hidden="true">
          ↗
        </span>
      </a>
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
            Stripe subscriptions • PromoteKit tracking & payouts
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
        {/* HERO (simplified) */}
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
            MoodMap Partner Program
          </p>

          <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight text-emerald-300 md:text-6xl">
            Earn 50% lifetime recurring.
          </h1>

          <p className="mx-auto mt-4 max-w-3xl text-pretty text-base leading-relaxed text-white/85 md:text-lg">
            Promote a premium daily briefing that turns cycle timing into practical relationship
            context — helping couples communicate better with less guesswork.
          </p>

          <p className="mt-4 text-sm text-white/70">
            Built for men. Better timing for both partners.
          </p>

          <div className="mt-7 flex flex-col items-center gap-3">
            <a
              href={PARTNER_PORTAL_URL}
              className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-emerald-400 to-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/10 transition hover:opacity-95 sm:w-auto"
            >
              Get your link
            </a>

            <p className="text-xs text-white/60">
              Stripe subscriptions • PromoteKit tracking & payouts
            </p>

            <div className="flex items-center gap-3 text-sm font-semibold">
              <Link
                href="#creators"
                className="inline-flex items-center gap-2 text-white/75 underline decoration-white/20 underline-offset-4 hover:text-white hover:decoration-white/40"
              >
                What you get <span aria-hidden="true">↓</span>
              </Link>

              <span className="text-white/30" aria-hidden="true">
                •
              </span>

              <Link
                href="#faq"
                className="inline-flex items-center gap-2 text-white/75 underline decoration-white/20 underline-offset-4 hover:text-white hover:decoration-white/40"
              >
                FAQ <span aria-hidden="true">↓</span>
              </Link>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="mx-auto mt-10 max-w-5xl space-y-6 md:mt-12 md:space-y-8">
          <Section
            id="creators"
            title="What you get"
            subtitle="Simple: your tracked link, transparent attribution, and recurring payouts."
          >
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <CheckList
                items={[
                  "50% lifetime recurring commission for subscribers attributed to your link",
                  "Unique tracked link + real‑time dashboard (PromoteKit)",
                  "Payout timing and thresholds are shown inside your partner portal",
                  "Creator assets + approved claim guidance (logos, screenshots, b‑roll)",
                ]}
              />
              <p className="mt-4 text-xs leading-relaxed text-white/50">
                Full terms, attribution rules, and allowed traffic are shown inside the partner
                portal.
              </p>
            </div>
          </Section>

          <Section
            id="details"
            title="What you’re promoting"
            subtitle="Cycle timing → practical relationship context. Context, not prediction."
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <p className="text-sm font-semibold text-white">The product (in plain English)</p>
                <CheckList
                  items={[
                    "Daily briefings that translate timing into “what matters today” context",
                    "Helps reduce misreads and bad‑timing conversations",
                    "Models timing as windows — cycles vary person to person",
                    "Designed for men; shared payoff for both partners",
                  ]}
                />
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <p className="text-sm font-semibold text-white">Guardrails (important)</p>
                <CheckList
                  items={[
                    "Relationship guidance — not medical advice or diagnosis",
                    "Not contraception and not fertility planning guarantees",
                    "Does not predict individual outcomes — it provides timing context",
                    "Avoid absolute claims (keep it accurate and respectful)",
                  ]}
                />
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
                  Attribution is tracked in the PromoteKit partner portal. Your dashboard is the
                  source of truth for what is attributed to you (signups, subscribers, and earnings).
                </p>
              </FaqItem>

              <FaqItem q="How do payouts work?">
                <p>
                  Subscriptions are processed via Stripe. Tracking and payout reporting is handled in
                  PromoteKit. Your portal shows payout cadence, thresholds (if any), and your full
                  payout history.
                </p>
              </FaqItem>

              <FaqItem q="What promotion methods are allowed?">
                <p>
                  Allowed traffic (organic, email, paid ads, brand bidding, etc.) is defined in the
                  program terms inside the portal. If you’re unsure, email support before running
                  anything at scale.
                </p>
              </FaqItem>
            </div>

            <div className="mt-6 flex flex-col items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur md:flex-row md:text-left">
              <div>
                <p className="text-sm font-semibold text-white">Ready to join?</p>
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

          <Section
            title="Official listings"
            subtitle="For a quick legitimacy check before you promote."
          >
            <OfficialLinks />
          </Section>
        </div>
      </div>
    </main>
  );
}
