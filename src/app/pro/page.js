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
import { PRODUCT, FREE_FEATURES, PREMIUM_FEATURES, WEB_PLANS } from "../../lib/product";
import { OG_IMAGE_SRC, mobileApplicationJsonLd } from "../seo";

const META_DESCRIPTION =
  "Explore MoodMap Premium+: fuller Brief and Risk content, the complete PLAN, READ, BOND, and SELF Command Deck, deeper insights, and additional optional alerts.";

// Only bounded attribution fields reach checkout; arbitrary URL values never pass through.
function buildPlanHref(planType, searchParams) {
  const qs = new URLSearchParams({ type: planType === "yearly" ? "yearly" : "monthly" });
  const attributionKeys = new Set(["via", "ref", "ref_code", "pk_campaign", "pk_source", "pk_medium", "pk_content", "pk_keyword"]);
  const append = (key, value) => {
    if (typeof value !== "string" || !value || value.length > 100) return;
    if (key === "entry") {
      if (["pro", "article", "paywall"].includes(value)) qs.set(key, value);
      return;
    }
    if (attributionKeys.has(key) && /^[a-zA-Z0-9._~-]+$/.test(value)) qs.set(key, value);
  };
  if (searchParams && typeof searchParams.forEach === "function") {
    searchParams.forEach((value, key) => append(key, value));
  } else if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => append(key, Array.isArray(value) ? value[0] : value));
  }
  if (!qs.has("entry")) qs.set("entry", "pro");
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
    title: "Complete Command Deck + WHY",
    body: "Open the full PLAN, READ, BOND, and SELF guidance. READ is HOW TO SURVIVE; BOND covers sex, flirting, and intimacy.",
  },
  {
    icon: CalendarDays,
    title: "Deeper cycle insights",
    body: "Explore more of the reasoning behind the daily read and how modeled cycle changes may matter for energy and pace.",
  },
  {
    icon: BellRing,
    title: "Risk Radar + Timing Alerts",
    body: "Open fuller Risk content and additional optional heads-ups around the daily read and cycle windows.",
  },
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
              {PRODUCT.premiumSummary}
            </p>
            <p className="mm-v2-boundary">Full context for your response. Still not a verdict on her.</p>

            <div className="mm-v2-plan-grid" data-mm-placement="pro-plans" data-mm-context="/pro">
              <PlanCard name="Annual" price={WEB_PLANS.yearly.displayPrice} cadence={WEB_PLANS.yearly.cadence} href={yearlyHref} primary />
              <PlanCard name="Monthly" price={WEB_PLANS.monthly.displayPrice} cadence={WEB_PLANS.monthly.cadence} href={monthlyHref} />
            </div>

            <p className="mm-v2-purchase-note">
              Web subscription prices in USD. Renews automatically until canceled. App Store and Google Play prices may differ by country and purchase channel. Check the final amount at checkout.
            </p>
          </div>

          <div className="mm-v2-subhero__visual" data-reveal>
            <div className="mm-v2-subhero__badge"><Crown aria-hidden="true" /><span>Premium+</span></div>
            <div className="mm-v2-poster mm-v2-poster--pro">
              <div className="mm-v2-poster__glow" aria-hidden="true" />
              <img
                width={828} height={1792}
                src="/screenshots/web-2026/protocol-why.webp"
                alt="MoodMap Command Deck WHY screen showing reciprocity, signal, and how to use the guidance."
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
              <p>{PRODUCT.freeSummary}</p>
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
          <p>Choose an annual or monthly web subscription, then follow the activation steps to open Premium+ in MoodMap.</p>
          <div className="mm-v2-final-plan-row" data-mm-placement="pro-end" data-mm-context="/pro">
            <Link href={yearlyHref} prefetch={false} className="mm-v2-primary-link">Annual · {WEB_PLANS.yearly.displayPrice} <ArrowRight aria-hidden="true" /></Link>
            <Link href={monthlyHref} prefetch={false} className="mm-v2-secondary-link">Monthly · {WEB_PLANS.monthly.displayPrice}</Link>
          </div>
          <Link href="/" className="mm-v2-final-cta__secondary">← Back to Home</Link>
        </div>
      </section>
    </main>
  );
}
