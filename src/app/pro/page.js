import Link from "next/link";
import {
  ArrowRight,
  BellRing,
  CalendarDays,
  Check,
  Crown,
  Layers3,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import ScrollReveal from "../../components/ScrollReveal";
import { OG_IMAGE_SRC, mobileApplicationJsonLd } from "../seo";

const META_DESCRIPTION =
  "Unlock MoodMap Premium+: the full Day Brief, complete PLAN, READ, BOND, and SELF Protocol, deeper WHY explanations, Cycle Intelligence, Risk Radar, Calendar, and Timing Alerts.";

function buildPlanHref(planType, searchParams) {
  const qs = new URLSearchParams({ type: planType === "yearly" ? "yearly" : "monthly" });

  const append = (key, value) => {
    if (value == null || value === "") return;
    if (key.toLowerCase() === "type") return;
    qs.append(key, String(value));
  };

  if (searchParams) {
    if (typeof searchParams.forEach === "function") {
      searchParams.forEach((value, key) => append(key, value));
    } else {
      Object.entries(searchParams).forEach(([key, value]) => {
        if (Array.isArray(value)) value.forEach((item) => append(key, item));
        else append(key, value);
      });
    }
  }

  return `/buy?${qs.toString()}`;
}

const VALUE_STACK = [
  {
    icon: Sparkles,
    title: "Full Day Brief",
    body: "Current Picture, Best Approach, What Can Go Well, and Set It Up—integrated into one practical read.",
  },
  {
    icon: Layers3,
    title: "Complete Protocol + WHY",
    body: "Unlock every PLAN, READ, BOND, and SELF card, plus the deeper reasoning behind each move.",
  },
  {
    icon: CalendarDays,
    title: "Calendar + Intelligence",
    body: "Read any cycle day, follow the modeled biological shift, and connect it to possible effects on capacity and pace.",
  },
  {
    icon: BellRing,
    title: "Risk Radar + Timing Alerts",
    body: "See likely tripwires and receive optional heads-ups before key cycle windows and daily reads.",
  },
];

const PREMIUM_FEATURES = [
  "Full Day Brief",
  "All PLAN, READ, BOND, and SELF guidance",
  "Deeper WHY explanations",
  "Full Cycle Calendar",
  "Cycle Intelligence",
  "Complete Risk Radar",
  "Daily Brief, cycle-window, and Risk Radar alerts",
  "Adjustable cycle and notification preferences",
];

const FREE_FEATURES = [
  "Today’s State",
  "Core cycle-day and phase context",
  "A limited daily Protocol sample",
  "Basic app personalization",
];

export const metadata = {
  title: "Premium+: Unlock the Full MoodMap Read",
  description: META_DESCRIPTION,
  alternates: { canonical: "/pro" },
  openGraph: {
    title: "MoodMap Premium+: Unlock the Full Read",
    description: META_DESCRIPTION,
    url: "/pro",
    type: "website",
    images: [OG_IMAGE_SRC],
  },
  twitter: {
    card: "summary_large_image",
    title: "MoodMap Premium+: Unlock the Full Read",
    description: META_DESCRIPTION,
    images: [OG_IMAGE_SRC],
  },
};

function PlanCard({ name, price, cadence, href, primary = false }) {
  return (
    <Link
      href={href}
      prefetch={false}
      aria-label={`Choose MoodMap Premium+ ${name.toLowerCase()} plan`}
      className={["mm-v2-plan-card", primary ? "is-primary" : ""].filter(Boolean).join(" ")}
    >
      <span>{name}</span>
      <strong>{price}</strong>
      <small>{cadence}</small>
      <div>Continue <ArrowRight aria-hidden="true" /></div>
    </Link>
  );
}

export default async function ProPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const yearlyHref = buildPlanHref("yearly", resolvedSearchParams);
  const monthlyHref = buildPlanHref("monthly", resolvedSearchParams);
  const appJsonLd = mobileApplicationJsonLd("/pro");

  return (
    <main className="mm-page mm-v2-page mm-v2-subpage relative isolate overflow-hidden text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <ScrollReveal />
      <div aria-hidden="true" className="mm-background-field" />

      <section className="mm-v2-subhero">
        <div className="mm-container mm-v2-subhero__grid">
          <div className="mm-v2-subhero__copy" data-reveal>
            <span className="mm-section-label">MoodMap Premium+</span>
            <h1>Unlock the full read.</h1>
            <p className="mm-v2-subhero__lead">
              Go beyond the daily headline with the complete Day Brief, full Protocol access, deeper WHY explanations, Cycle Intelligence, Risk Radar, Calendar, and Timing Alerts.
            </p>
            <p className="mm-v2-boundary">Full context for your response. Still not a verdict on her.</p>

            <div className="mm-v2-plan-grid">
              <PlanCard name="Annual" price="$24.99" cadence="per year" href={yearlyHref} primary />
              <PlanCard name="Monthly" price="$2.99" cadence="per month" href={monthlyHref} />
            </div>

            <p className="mm-v2-purchase-note">
              Full access. Renews automatically until canceled. Prices shown in USD; local store pricing may vary.
            </p>
          </div>

          <div className="mm-v2-subhero__visual" data-reveal>
            <div className="mm-v2-subhero__badge"><Crown aria-hidden="true" /><span>Premium+</span></div>
            <div className="mm-v2-poster mm-v2-poster--pro">
              <div className="mm-v2-poster__glow" aria-hidden="true" />
              <img
                src="/screenshots/web-2026/protocol-why.webp"
                alt="MoodMap Protocol WHY screen showing reciprocity, signal, and how to use the guidance."
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mm-section mm-v2-value-section">
        <div className="mm-container">
          <div className="mm-v2-section-heading" data-reveal>
            <span className="mm-section-label">What Premium+ opens</span>
            <h2>The deeper layer behind the day.</h2>
            <p>Every premium surface has one job: turn cycle-based context into a clearer decision before you act.</p>
          </div>

          <div className="mm-v2-value-grid">
            {VALUE_STACK.map(({ icon: Icon, title, body }) => (
              <article key={title} data-reveal>
                <span><Icon aria-hidden="true" /></span>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mm-section mm-v2-comparison-section">
        <div className="mm-container">
          <div className="mm-v2-comparison-panel" data-reveal>
            <div className="mm-v2-comparison-intro">
              <span className="mm-v2-icon-chip"><ShieldCheck aria-hidden="true" /></span>
              <span className="mm-section-label">Free to download</span>
              <h2>Start with the signal. Upgrade for the full system.</h2>
              <p>MoodMap is usable before you subscribe. Premium+ opens the complete practical and intelligence layers.</p>
            </div>

            <div className="mm-v2-comparison-columns">
              <article>
                <span className="mm-v2-comparison-label">Free</span>
                <h3>Core daily context</h3>
                <ul>
                  {FREE_FEATURES.map((item) => <li key={item}><Check aria-hidden="true" />{item}</li>)}
                </ul>
              </article>
              <article className="is-premium">
                <span className="mm-v2-comparison-label">Premium+</span>
                <h3>The complete read</h3>
                <ul>
                  {PREMIUM_FEATURES.map((item) => <li key={item}><Check aria-hidden="true" />{item}</li>)}
                </ul>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="mm-v2-final-cta mm-v2-final-cta--compact">
        <div className="mm-container" data-reveal>
          <span className="mm-v2-final-cta__icon"><ShieldCheck aria-hidden="true" /></span>
          <h2>Open the full read.</h2>
          <p>Choose annual or monthly access, then return to MoodMap with the complete system unlocked.</p>
          <div className="mm-v2-final-plan-row">
            <Link href={yearlyHref} prefetch={false} className="mm-v2-primary-link">Annual · $24.99 <ArrowRight aria-hidden="true" /></Link>
            <Link href={monthlyHref} prefetch={false} className="mm-v2-secondary-link">Monthly · $2.99</Link>
          </div>
          <Link href="/" className="mm-v2-final-cta__secondary">← Back to Home</Link>
        </div>
      </section>
    </main>
  );
}
