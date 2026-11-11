import "./polish.css";
import Link from "next/link";
import {
  BellRing,
  CalendarDays,
  Check,
  ChevronRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import ScrollReveal from "../components/ScrollReveal";
import ProductShowcase from "../components/ProductShowcase";
import StoreButtons from "../components/StoreButtons";
import { PRODUCT, PREMIUM_FEATURES } from "../lib/product";
import {
  DEFAULT_META_DESCRIPTION,
  SITE_TITLE,
  faqJsonLd,
  mobileApplicationJsonLd,
} from "./seo";

export const metadata = {
  title: { absolute: SITE_TITLE },
  description: DEFAULT_META_DESCRIPTION,
  alternates: { canonical: "/" },
};

const APP_SURFACES = [
  {
    screenshotPath: "/screenshots/web-2026/day-brief.webp",
    kicker: "Day Brief",
    title: "See what changed. Choose a cleaner response.",
    caption: "Current picture, best approach, upside, and setup.",
    meta: "Full daily synthesis",
    alt: "MoodMap Day Brief showing Current Picture, Best Approach, What Can Go Well, and Set It Up.",
    defaultActive: true,
  },
  {
    screenshotPath: "/screenshots/web-2026/cycle-calendar.webp",
    kicker: "Cycle Calendar",
    title: "See the full cycle. Read any day.",
    caption: "Phase, capacity, timing windows, and day-level context.",
    meta: "Full-cycle view",
    alt: "MoodMap Cycle Calendar showing period, fertile, ovulation, possible edge, capacity, and cycle signal.",
  },
  {
    screenshotPath: "/screenshots/web-2026/risk-radar.webp",
    kicker: "Risk Radar",
    title: "Catch the tripwire before it escalates.",
    caption: "Signal, likely misread, countermove, and why it escalates.",
    meta: "Friction prevention",
    alt: "MoodMap Risk Radar showing a tripwire, what to notice, likely misread, countermove, and explanation.",
  },
  {
    screenshotPath: "/screenshots/web-2026/protocol-overview.webp",
    kicker: "Command Deck + WHY",
    title: "Get the move—and the reason.",
    caption: "PLAN the day. READ the situation. BOND through intimacy. Manage SELF.",
    meta: "Practical guidance",
    alt: "MoodMap Command Deck showing PLAN, READ, BOND, and SELF guidance with WHY and HOW layers.",
  },
];

const PROOF_ITEMS = [
  ["One date to start", "Use only a date she chose to share."],
  ["Read any cycle day", "Today or the full cycle, without losing your place."],
  ["Private by design", "No mood recording, diagnosis, or fertility planning."],
];

const OUTCOMES = [
  {
    title: "Support with less guesswork",
    body: "See whether comfort, space, practical help, conversation, or steadiness is the cleaner first layer.",
  },
  {
    title: "Better-timed conversations",
    body: "Separate a valid topic from a poor window so timing does not become the second problem.",
  },
  {
    title: "Better-timed intimacy",
    body: "BOND covers sex, flirting, and intimacy, with attention to mutual interest, consent, and pace.",
  },
];

const INTELLIGENCE_POINTS = [
  ["Today’s shift", "What the modeled cycle pattern is doing now."],
  ["Biology", "The cycle mechanics behind the day, stated as context rather than measurement."],
  ["Possible effects", "How energy, sensitivity, recovery demand, connection, and pace may be affected."],
];

const HOW_STEPS = [
  ["01", "Set one date", "Start with the first day of her last period—or her best estimate of the next one."],
  ["02", "Read the day", "Get a quick feel for possible mood, energy, and attitude, then open the detail you need."],
  ["03", "Choose the cleaner response", "Support, speak, initiate, simplify, or hold steady with better timing."],
];

const TRUST_ITEMS = [
  ["Does not record her actual mood", "MoodMap models cycle-based context. It does not monitor, journal, judge, or score how your partner feels."],
  ["Does not measure hormones", "Hormone movement is modeled from cycle timing, not read from a wearable, lab result, or her body."],
  ["Does not replace communication", "Cycle context never explains the whole person. Consent, direct communication, and what you know still lead."],
  ["Not medical or fertility guidance", "MoodMap is not diagnosis, contraception, fertility planning, or a substitute for professional care."],
];

const FAQ_ITEMS = [
  [
    "What does MoodMap actually track?",
    "MoodMap tracks cycle position from the date and cycle settings you enter. It does not record or monitor your partner’s actual mood. It uses cycle timing to model context that may matter for energy, sensitivity, capacity, friction, and connection.",
  ],
  [
    "What appears in the daily read?",
    "Today’s State gives a quick daily read from cycle day, phase, estimated capacity, risk, and direction. Explore Day Brief, Risk Radar, the Command Deck, Calendar, and Intelligence for more context. READ is HOW TO SURVIVE; BOND covers sex, flirting, and intimacy.",
  ],
  [
    "What is included with Premium+?",
    PRODUCT.premiumSummary,
  ],
  [
    "Can MoodMap tell me exactly how she feels?",
    "No. MoodMap provides modeled cycle-based context, not certainty about an individual person. The point is to make your response more careful—not to replace her words with an app.",
  ],
];

function SectionLabel({ children }) {
  return <span className="mm-section-label">{children}</span>;
}

function Poster({ src, alt, className = "", priority = false }) {
  return (
    <div className={["mm-v2-poster", className].filter(Boolean).join(" ")}>
      <div className="mm-v2-poster__glow" aria-hidden="true" />
      <img src={src} alt={alt} width={828} height={1792} loading={priority ? "eager" : "lazy"} decoding="async" fetchPriority={priority ? "high" : "auto"} />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="mm-v2-hero mm-v4-hero">
      <div className="mm-container">
        <div className="mm-v2-hero__grid">
          <div className="mm-v2-hero__copy" data-reveal>
            <SectionLabel>Cycle-aware relationship intelligence for men</SectionLabel>
            <h1>Read the day before you react.</h1>
            <p className="mm-v2-hero__lead">
              A quick daily feel for her possible mood, energy, and attitude, based on cycle context. See what may matter today and choose your response with more care.
            </p>
            <p className="mm-v2-boundary">Context for your response. Not a verdict on her.</p>
            <StoreButtons />
            <div className="mm-v2-hero__microproof" aria-label="MoodMap availability and boundaries">
              <span><Check aria-hidden="true" /> Live on iOS and Android</span>
              <span><Check aria-hidden="true" /> Private by design</span>
              <span><Check aria-hidden="true" /> Non-medical guidance</span>
            </div>
          </div>

          <div className="mm-v2-hero__visual" data-reveal>
            <Poster
              src="/screenshots/web-2026/read-day.webp"
              alt="MoodMap Today’s State showing cycle day, luteal phase, capacity, intelligence, risk, and direction."
              className="mm-v2-poster--hero"
              priority
            />
          </div>
        </div>

        <div className="mm-v4-proof-grid" data-reveal aria-label="MoodMap product proof">
          {PROOF_ITEMS.map(([title, body]) => (
            <article key={title}>
              <span aria-hidden="true" />
              <div><strong>{title}</strong><p>{body}</p></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductSection() {
  return (
    <section className="mm-section mm-v2-product-section mm-v4-product-section" aria-labelledby="product-heading">
      <div className="mm-container">
        <ProductShowcase surfaces={APP_SURFACES} />
      </div>
    </section>
  );
}

function IntelligenceSection() {
  return (
    <section id="intelligence-layer" className="mm-section mm-v2-intelligence mm-v4-intelligence">
      <div className="mm-container mm-v2-feature-grid">
        <div className="mm-v2-feature-copy" data-reveal>
          <SectionLabel>Cycle Intelligence</SectionLabel>
          <h2>Understand the signal behind the day.</h2>
          <p className="mm-v2-feature-lead">
            MoodMap models expected hormone movement from cycle timing, then translates it into possible effects on energy, sensitivity, recovery demand, connection, and pace.
          </p>
          <p className="mm-v2-feature-boundary">
            Modeled context—not an individual hormone measurement, diagnosis, or prediction of how she must feel.
          </p>
          <div className="mm-v2-feature-points">
            {INTELLIGENCE_POINTS.map(([title, body]) => (
              <article key={title}><span aria-hidden="true" /><div><h3>{title}</h3><p>{body}</p></div></article>
            ))}
          </div>
          <Link href="/intelligence" className="mm-v2-text-link">Explore Cycle Intelligence <ChevronRight aria-hidden="true" /></Link>
        </div>
        <div className="mm-v2-feature-visual" data-reveal>
          <div className="mm-v3-intelligence-stack" aria-label="MoodMap Cycle Intelligence screens">
            <div className="mm-v3-phone-frame mm-v3-phone-frame--rear">
              <img
                width={828} height={1792}
                src="/screenshots/web-2026/intelligence-graph.webp"
                alt="MoodMap modeled hormone graph across the cycle."
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="mm-v3-phone-frame mm-v3-phone-frame--front">
              <img
                width={828} height={1792}
                src="/screenshots/web-2026/intelligence.webp"
                alt="MoodMap Intelligence showing Today’s Shift, Biology, and possible effects."
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function JourneySection() {
  return (
    <section id="how-it-works" className="mm-section mm-v4-journey">
      <div className="mm-container">
        <div className="mm-v2-dual-grid mm-v4-dual-grid">
          <article className="mm-v2-dual-card" data-reveal>
            <div className="mm-v2-dual-card__copy">
              <span className="mm-v2-icon-chip"><BellRing aria-hidden="true" /></span>
              <SectionLabel>Timing Alerts</SectionLabel>
              <h2>Know before key windows shift.</h2>
              <p>Optional Daily Brief, cycle-window, and Risk Radar alerts—scheduled around your preferred time and delivery rules.</p>
            </div>
            <Poster src="/screenshots/web-2026/timing-alerts.webp" alt="MoodMap alert settings showing Daily Brief, cycle alerts, Risk Radar, preferred time, and quiet-hour controls." />
          </article>

          <article className="mm-v2-dual-card mm-v2-dual-card--gold" data-reveal>
            <div className="mm-v2-dual-card__copy">
              <span className="mm-v2-icon-chip"><CalendarDays aria-hidden="true" /></span>
              <SectionLabel>Simple setup</SectionLabel>
              <h2>Set one date. Get a daily read.</h2>
              <p>Start with the first day of her last period—or her best estimate of the next one. Use only a date she chose to share. Refine the cycle later.</p>
            </div>
            <Poster src="/screenshots/web-2026/onboarding.webp" alt="MoodMap onboarding showing one-date setup, cycle model, date choice, and Show today’s read button." />
          </article>
        </div>

        <div className="mm-v4-steps" data-reveal aria-label="How MoodMap works">
          {HOW_STEPS.map(([number, title, body]) => (
            <article key={number}>
              <span>{number}</span>
              <div><h3>{title}</h3><p>{body}</p></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ValuePremiumSection() {
  return (
    <section id="premium" className="mm-section mm-v4-value-premium">
      <div className="mm-container">
        <div className="mm-v4-outcome-head mm-v5-outcome-head" data-reveal>
          <SectionLabel>What better timing changes</SectionLabel>
          <h2>More understanding. Less guesswork.</h2>
          <p>MoodMap helps you notice where support, initiative, conversation, connection, or restraint can land better.</p>
        </div>

        <div className="mm-v4-outcome-grid">
          {OUTCOMES.map((item, index) => (
            <article key={item.title} data-reveal>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div><h3>{item.title}</h3><p>{item.body}</p></div>
            </article>
          ))}
        </div>

        <div className="mm-v2-premium-panel mm-v4-premium-panel" data-reveal data-mm-placement="home-premium" data-mm-context="/">
          <div className="mm-v2-premium-copy">
            <SectionLabel>Premium+</SectionLabel>
            <h2>Unlock the full read.</h2>
            <p>{PRODUCT.premiumSummary}</p>
            <div className="mm-v4-plan-note">
              <strong>Premium+ in the app</strong>
              <span>{PRODUCT.purchaseSummary}</span>
            </div>
            <Link href="/pro" className="mm-v2-primary-link">See Premium+ <ChevronRight aria-hidden="true" /></Link>
          </div>

          <div className="mm-v2-premium-list" aria-label="Premium Plus features">
            {PREMIUM_FEATURES.map((feature) => (
              <div key={feature}><span><Check aria-hidden="true" /></span><p>{feature}</p></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustFaqCtaSection() {
  return (
    <section id="trust" className="mm-section mm-v4-trust-faq">
      <div className="mm-container">
        <div className="mm-v2-trust-panel mm-v4-trust-panel" data-reveal>
          <div className="mm-v2-trust-intro">
            <span className="mm-v2-icon-chip"><ShieldCheck aria-hidden="true" /></span>
            <SectionLabel>Clear boundaries</SectionLabel>
            <h2>Useful context. Clear limits.</h2>
            <p>MoodMap gives you context for your own response. It does not turn your partner into a score, diagnosis, or dashboard.</p>
          </div>
          <div className="mm-v2-trust-grid">
            {TRUST_ITEMS.map(([title, body]) => <article key={title}><h3>{title}</h3><p>{body}</p></article>)}
          </div>
        </div>

        <div className="mm-v5-close-stack">
          <div id="questions" className="mm-v4-faq-card mm-v5-faq-card" data-reveal>
            <div className="mm-v4-faq-heading mm-v5-faq-heading">
              <SectionLabel>Questions</SectionLabel>
              <h2>Questions before you start.</h2>
              <p>Four direct answers about what MoodMap tracks, what Premium+ opens, and where the model stops.</p>
            </div>
            <div className="mm-v2-faq-list">
              {FAQ_ITEMS.map(([question, answer], index) => (
                <details key={question} open={index === 0}><summary>{question}</summary><p>{answer}</p></details>
              ))}
            </div>
          </div>

          <div className="mm-v4-download-card mm-v5-download-card" data-reveal>
            <div className="mm-v5-download-copy">
              <span className="mm-v2-final-cta__icon"><Sparkles aria-hidden="true" /></span>
              <div>
                <h2>Read the day before you react.</h2>
                <p>One private daily read based on cycle context. Available on iOS and Android.</p>
              </div>
            </div>
            <div className="mm-v5-download-actions">
              <StoreButtons compact />
              <Link href="/learn" className="mm-v2-final-cta__secondary">Explore the guides <ChevronRight aria-hidden="true" /></Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const appJsonLd = mobileApplicationJsonLd("/");
  const faqSchema = faqJsonLd(FAQ_ITEMS.map(([q, a]) => ({ q, a })));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <ScrollReveal />

      <main className="mm-page mm-v2-page mm-v3-page mm-v4-page mm-v5-page relative isolate overflow-x-hidden text-white">
        <div aria-hidden="true" className="mm-background-field" />
        <HeroSection />
        <ProductSection />
        <IntelligenceSection />
        <JourneySection />
        <ValuePremiumSection />
        <TrustFaqCtaSection />
      </main>
    </>
  );
}
