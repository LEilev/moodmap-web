import "../polish.css";
import Link from "next/link";
import pageStyles from "../../components/EditorialPage.module.css";
import {
  BellRing,
  CalendarDays,
  Check,
  Layers3,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import ScrollReveal from "../../components/ScrollReveal";
import StoreButtons from "../../components/StoreButtons";
import heroStyles from "../../components/TextHero.module.css";
import { PRODUCT, FREE_FEATURES, PREMIUM_FEATURES } from "../../lib/product";
import { OG_IMAGE_SRC, mobileApplicationJsonLd } from "../seo";

const META_DESCRIPTION =
  "Explore MoodMap Premium+: fuller Brief and Risk content, the complete PLAN, READ, BOND, and SELF Command Deck, deeper insights, and additional optional alerts.";

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

export default function ProPage() {
  const appJsonLd = mobileApplicationJsonLd("/pro");

  return (
    <main className={`${pageStyles.page} mm-page mm-v2-page mm-v2-subpage relative isolate overflow-hidden`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <ScrollReveal />
      <div aria-hidden="true" className="mm-background-field" />

      <section className={heroStyles.hero}>
        <div className="mm-container">
          <div className={heroStyles.copy} data-reveal>
            <span className="mm-section-label">MoodMap Premium+</span>
            <h1>Unlock the full read.</h1>
            <p className="mm-v2-subhero__lead">
              {PRODUCT.premiumSummary}
            </p>
            <p className="mm-v2-boundary">Full context for your response. Still not a verdict on her.</p>

            <p className="mm-v2-purchase-note">
              {PRODUCT.purchaseSummary}
            </p>
            <StoreButtons placement="pro-hero" context="/pro" />
            <p className="mm-v2-purchase-note">
              Review the local price, billing period, and renewal terms in your app store before subscribing. Manage renewal or cancel in the store where you subscribed.
            </p>
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
          <p>{PRODUCT.purchaseInstructions}</p>
          <StoreButtons compact placement="pro-end" context="/pro" />
          <p className="mm-v2-purchase-note">Free to download. Upgrade to Premium+ in the app when you’re ready.</p>
          <Link href="/" className="mm-v2-final-cta__secondary">← Back to Home</Link>
        </div>
      </section>
    </main>
  );
}
