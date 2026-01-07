// app/partner/page.js
import Link from "next/link";
import Image from "next/image";

const PARTNER_PORTAL_URL = "https://moodmap.promotekit.com";

/**
 * Optional: set these env vars to show a concrete earnings example.
 * - NEXT_PUBLIC_MOODMAP_SUBSCRIPTION_PRICE (number, e.g. "19.99")
 * - NEXT_PUBLIC_MOODMAP_SUBSCRIPTION_CURRENCY (e.g. "USD", "NOK", "EUR")
 * - NEXT_PUBLIC_MOODMAP_SUBSCRIPTION_PERIOD (e.g. "mo", "month")
 *
 * Optional: set an image (relative path) to show a real product screenshot in the preview card.
 * - NEXT_PUBLIC_PARTNER_PREVIEW_IMAGE (e.g. "/images/moodmap-briefing.png")
 */
const SUB_PRICE_RAW = process.env.NEXT_PUBLIC_MOODMAP_SUBSCRIPTION_PRICE;
const SUB_CURRENCY = process.env.NEXT_PUBLIC_MOODMAP_SUBSCRIPTION_CURRENCY || "USD";
const SUB_PERIOD = process.env.NEXT_PUBLIC_MOODMAP_SUBSCRIPTION_PERIOD || "mo";
const PREVIEW_IMAGE_SRC = process.env.NEXT_PUBLIC_PARTNER_PREVIEW_IMAGE || "";

export const metadata = {
  title: "Partner Program — MoodMap",
  description:
    "Join the MoodMap Partner Program. Earn 50% lifetime recurring revenue share for every subscriber attributed to your link.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

function formatMoney(amount, currency) {
  // Keep formatting simple & predictable (no locale surprises).
  const n = Number(amount);
  if (!Number.isFinite(n)) return null;
  return `${currency} ${n.toFixed(2)}`;
}

function earningsExampleLine() {
  const price = Number(SUB_PRICE_RAW);
  if (Number.isFinite(price) && price > 0) {
    const share = price * 0.5;
    return `Example math: ${formatMoney(price, SUB_CURRENCY)}/${SUB_PERIOD} → you earn ${formatMoney(
      share,
      SUB_CURRENCY
    )}/${SUB_PERIOD} per active subscriber.`;
  }
  return `Math: subscriber pays $X/${SUB_PERIOD} → you earn $X/2/${SUB_PERIOD} (50%) while they stay subscribed.`;
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

function Chip({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/80">
      {children}
    </span>
  );
}

function ProductPreviewCard() {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] backdrop-blur">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold text-white/70">Product preview</p>
        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-medium text-white/70">
          Daily briefing (sample)
        </span>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-black/20">
        {PREVIEW_IMAGE_SRC ? (
          <div className="relative aspect-[9/16] w-full">
            <Image
              src={PREVIEW_IMAGE_SRC}
              alt="MoodMap daily briefing preview"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 85vw, 360px"
              priority={false}
            />
          </div>
        ) : (
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="h-3 w-24 rounded bg-white/10" />
              <div className="h-3 w-12 rounded bg-white/10" />
            </div>

            <div className="mt-4 space-y-2">
              <div className="h-4 w-3/4 rounded bg-white/10" />
              <div className="h-4 w-5/6 rounded bg-white/10" />
              <div className="h-4 w-2/3 rounded bg-white/10" />
            </div>

            <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="text-[11px] font-semibold text-white/80">Today’s context</p>
              <p className="mt-1 text-[11px] leading-relaxed text-white/65">
                Cycle timing → practical relationship context. Clear, respectful, actionable.
              </p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <p className="text-[10px] font-semibold text-white/70">Phase model</p>
                <p className="mt-1 text-[11px] text-white/60">Follicular → Ovulatory → Luteal → Menstrual</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <p className="text-[10px] font-semibold text-white/70">Fertility-aware</p>
                <p className="mt-1 text-[11px] text-white/60">Fertile window + ovulation estimates</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Chip>Premium</Chip>
        <Chip>Science‑informed</Chip>
        <Chip>Fertility‑aware timing</Chip>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-white/55">
        Built in Norway. Private by design. Tracked & paid via the partner portal (PromoteKit).
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
          <p className="truncate text-[11px] text-white/60">Join free • Tracking via PromoteKit</p>
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
      {/* Sticky CTA (mobile) */}
      <MobileStickyCTA />

      {/* Background glow */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-260px] h-[620px] w-[900px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute left-1/2 top-[120px] h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />
      </div>

      {/* Add extra bottom padding so content isn't hidden behind mobile sticky CTA */}
      <div className="relative mx-auto max-w-6xl px-6 pb-28 pt-14 md:pb-24 md:pt-20">
        {/* HERO (now explicitly a partner page + clearer offer) */}
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-10">
            {/* Left */}
            <div className="text-center md:text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
                MoodMap Partner Program
              </p>

              <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight text-emerald-300 md:text-6xl">
                Built for him. Better for both of you.
              </h1>

              <p className="mt-5 text-pretty text-base leading-relaxed text-white/85 md:text-lg">
                A premium daily briefing that translates cycle timing into relationship context —
                so he knows what matters today.
              </p>

              {/* Offer callout (moved up + higher contrast) */}
              <div className="mt-6 rounded-2xl border border-emerald-300/20 bg-emerald-400/10 p-4 text-left">
                <p className="text-sm font-semibold text-white">
                  Earn 50% lifetime recurring commissions.
                </p>
                <p className="mt-1 text-sm leading-relaxed text-white/80">
                  Paid every billing cycle for as long as the subscriber remains active (attributed
                  to your link).
                </p>

                <p className="mt-3 text-xs leading-relaxed text-white/65">
                  {earningsExampleLine()}{" "}
                  <span className="text-white/50">
                    Exact pricing and payouts are shown in the partner portal.
                  </span>
                </p>
              </div>

              {/* Primary CTA only */}
              <div className="mt-6 flex flex-col items-center gap-2 md:items-start">
                <a
                  href={PARTNER_PORTAL_URL}
                  className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-emerald-400 to-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/10 transition hover:opacity-95 sm:w-auto"
                >
                  Join the Partner Program
                </a>

                <p className="text-xs text-white/55">
                  Free to join. Setup takes minutes. Tracking & payouts via PromoteKit.
                </p>

                {/* Downplayed “details” link */}
                <Link
                  href="#details"
                  className="mt-1 inline-flex items-center gap-2 text-sm font-semibold text-white/75 underline decoration-white/20 underline-offset-4 hover:text-white hover:decoration-white/40"
                >
                  See details <span aria-hidden="true">↓</span>
                </Link>
              </div>

              {/* (De-emphasized: no “private page” line here) */}
            </div>

            {/* Right: proof/preview */}
            <div className="mx-auto w-full max-w-sm md:mx-0 md:justify-self-end">
              <ProductPreviewCard />
            </div>
          </div>
        </div>

        {/* 3 cards (still strong; keep) */}
        <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-4 md:mt-12 md:grid-cols-3">
          <Card title="A real upgrade for couples">
            Helps couples avoid misreads by giving him the right context at the right time — clearer
            timing, better communication, fewer unnecessary conflicts.
          </Card>

          <Card title="50% recurring — lifetime" accent>
            Earn <span className="text-white">50% of subscription revenue</span> from every subscriber
            attributed to your link — <span className="text-white">each billing cycle</span>, for as
            long as they stay subscribed.
          </Card>

          <Card title="Clean tracking, transparent payouts">
            Get your own tracked link + dashboard via the partner portal (PromoteKit). Track signups
            and subscriptions clearly, in real time.
          </Card>
        </div>

        {/* Details */}
        <div className="mt-10 space-y-6 md:mt-12 md:space-y-8">
          <Section
            id="details"
            title="What you’re promoting"
            subtitle="A premium daily briefing for couples. Cycle timing → practical relationship context."
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <h3 className="text-sm font-semibold text-white">For him</h3>
                <CheckList
                  items={[
                    "Fewer misreads, better timing",
                    "Clear “what matters today” context",
                    "Practical language for communication",
                    "Less guessing, more confidence",
                  ]}
                />
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <h3 className="text-sm font-semibold text-white">For her</h3>
                <CheckList
                  items={[
                    "Feeling understood (without explaining everything)",
                    "Better emotional timing and support",
                    "Less friction from “wrong moment” conversations",
                    "More empathy in daily life",
                  ]}
                />
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <h3 className="text-sm font-semibold text-white">For the relationship</h3>
                <CheckList
                  items={[
                    "Fewer unnecessary conflicts",
                    "More alignment and closeness",
                    "Better conversations, better outcomes",
                    "A calmer baseline over time",
                  ]}
                />
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm leading-relaxed text-white/75 backdrop-blur">
              <span className="font-semibold text-white">He uses it — she feels it.</span> MoodMap is
              designed for men, but the payoff is shared: more empathy, better timing, fewer
              avoidable misreads.
            </div>
          </Section>

          <Section
            title="Trust & science"
            subtitle="Reproductive endocrinology → fertility timing → relationship context. Clear about uncertainty."
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm leading-relaxed text-white/75 backdrop-blur">
                <p>
                  MoodMap is informed by{" "}
                  <span className="text-white">
                    reproductive endocrinology, neuroendocrinology, and psychophysiology
                  </span>
                  , using the canonical phase model{" "}
                  <span className="text-white">(follicular → ovulatory → luteal → menstrual)</span>{" "}
                  plus <span className="text-white">fertility‑aware timing</span> (fertile window +
                  ovulation estimates).
                </p>
                <p className="mt-3">
                  We translate that biology through{" "}
                  <span className="text-white">behavioral psychology and relationship science</span>{" "}
                  into short daily context briefings — practical, respectful, immediately usable.
                </p>
                <p className="mt-3">
                  Cycles vary. Ovulation is an <span className="text-white">estimate</span>, not a
                  timestamp. MoodMap models timing as{" "}
                  <span className="text-white">windows</span>, not certainties — focused on what to
                  do <span className="text-white">today</span>.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm leading-relaxed text-white/75 backdrop-blur">
                <p className="font-semibold text-white">What this means in practice</p>
                <CheckList
                  items={[
                    "Phase + fertile‑window awareness (without chart obsession)",
                    "Better timing for conversations, support, and intimacy",
                    "Actionable daily briefings (quick to read, easy to share)",
                    "Premium tone: practical, respectful, non‑moralizing",
                  ]}
                />
                <p className="mt-4 text-xs text-white/55">
                  Educational tool — not medical advice or contraception. Timing is modeled as
                  estimates and windows.
                </p>
              </div>
            </div>

            {/* Mid-page CTA to reduce friction */}
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
            title="Best‑fit creators & audiences"
            subtitle="Broad creator appeal — strongest in relationship content, couples content, and cycle education with a partner‑friendly framing."
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <h3 className="text-sm font-semibold text-white">Where it wins</h3>
                <CheckList
                  items={[
                    "Relationship, dating, and communication creators (men, women, or couples)",
                    "Women’s health / cycle educators who want a partner‑friendly tool",
                    "Men’s lifestyle / self‑improvement with a relationship audience",
                    "Couples creators focused on practical tools and dynamics",
                    "Audiences 25–45: committed relationships, dating seriously, or married",
                  ]}
                />
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <h3 className="text-sm font-semibold text-white">Not the best fit if</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">
                  Your content requires you to provide clinical guidance, diagnosis, or treatment
                  recommendations. MoodMap is a consumer product for everyday context — not a
                  substitute for medical care.
                </p>
                <p className="mt-4 text-sm leading-relaxed text-white/70">
                  Creators who frame cycle timing as <span className="text-white">context</span>{" "}
                  (not blame) tend to perform best.
                </p>
              </div>
            </div>
          </Section>

          <Section title="How it works" subtitle="Simple flow. Clean attribution. Transparent payouts.">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <p className="text-xs font-semibold text-white/60">1) Join</p>
                <h3 className="mt-2 text-sm font-semibold text-white">Sign up in the partner portal</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">
                  Join via PromoteKit (free). Setup takes minutes.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <p className="text-xs font-semibold text-white/60">2) Get your link</p>
                <h3 className="mt-2 text-sm font-semibold text-white">Use it anywhere</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">
                  You’ll get a tracked link you can use in content, newsletters, or your bio.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <p className="text-xs font-semibold text-white/60">3) Earn</p>
                <h3 className="mt-2 text-sm font-semibold text-white">
                  50% recurring revenue share — lifetime
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">
                  Earn <span className="text-white">50% recurring</span> subscription revenue for
                  every subscriber attributed to your link —{" "}
                  <span className="text-white">every billing cycle</span>, for as long as they
                  remain subscribed.
                </p>
              </div>
            </div>
          </Section>

          <Section
            title="Creator quick start"
            subtitle="Creator‑ready angles + a copy‑paste script you can use today."
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <h3 className="text-sm font-semibold text-white">Angles that work</h3>
                <ul className="mt-3 space-y-2 text-sm leading-relaxed text-white/70">
                  <li>
                    <span className="text-white">“Same message. Wrong day. Disaster.”</span>{" "}
                    Timing is leverage.
                  </li>
                  <li>
                    <span className="text-white">“He uses it — she feels it.”</span>{" "}
                    A small daily habit that changes how he shows up.
                  </li>
                  <li>
                    <span className="text-white">“Fertility‑aware, relationship‑first.”</span>{" "}
                    Phase timing + fertile window / ovulation estimates — translated into what
                    matters today.
                  </li>
                </ul>

                <p className="mt-4 text-xs text-white/55">
                  More assets and tracking are available in the partner portal.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <h3 className="text-sm font-semibold text-white">Copy‑paste story script</h3>
                <div className="mt-3 rounded-xl border border-white/10 bg-black/20 p-4 text-sm leading-relaxed text-white/75">
                  <p>
                    I’ve been testing MoodMap — it’s a premium app that gives a short daily “context
                    briefing” based on cycle timing, so you don’t misread the moment.
                  </p>
                  <p className="mt-3">
                    It’s fertility‑aware (phase timing + fertile window / ovulation estimates), but
                    honest about variability — timing is modeled as windows, not certainties.
                  </p>
                  <p className="mt-3">
                    If you’re in a relationship and want things to feel easier, check it out.
                  </p>
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
            Join the Partner Program
          </a>

          <p className="mt-3 text-xs text-white/55">
            Free to join. Tracking & payouts via PromoteKit.
          </p>

          <p className="mt-4 text-sm text-white/65">
            Questions?{" "}
            <a
              href="mailto:support@moodmap-app.com"
              className="underline decoration-white/20 underline-offset-4 hover:decoration-white/40"
            >
              Contact us
            </a>{" "}
            (support@moodmap-app.com).
          </p>

          {/* De-emphasized “private page” note moved down here */}
          <p className="mt-4 text-xs text-white/35">Invitation link • Not indexed.</p>
        </div>
      </div>
    </main>
  );
}
