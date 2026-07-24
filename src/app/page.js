import Link from "next/link";
import { FaApple, FaGooglePlay } from "react-icons/fa";
import {
  BellRing,
  CalendarDays,
  Check,
  ChevronRight,
  Layers3,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import ScrollReveal from "../components/ScrollReveal";
import ProductShowcase from "../components/ProductShowcase";
import {
  APPSTORE_URL,
  DEFAULT_META_DESCRIPTION,
  PLAYSTORE_URL,
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
    kicker: "Protocol + WHY",
    title: "Get the move—and the reason.",
    caption: "PLAN, READ, BOND, and SELF with deeper reasoning.",
    meta: "Practical guidance",
    alt: "MoodMap Protocol showing PLAN, READ, BOND, and SELF guidance with WHY and HOW layers.",
  },
];

const PROOF_ITEMS = [
  ["One date to start", "Use only a date she chose to share."],
  ["Read any cycle day", "Today or the full cycle, without losing your place."],
  ["Four practical lanes", "PLAN, READ, BOND, and SELF."],
  ["Private, bounded context", "No mood recording, diagnosis, or fertility planning."],
];

const BENEFITS = [
  {
    title: "Support without overcorrecting",
    body: "See whether comfort, space, practical help, conversation, or simple steadiness is the cleaner first layer.",
  },
  {
    title: "Conversations at a better hour",
    body: "Separate a valid topic from a poor window so the timing does not become the second problem.",
  },
  {
    title: "Intimacy that follows reciprocity",
    body: "Read pace, mutual energy, and response rather than forcing a moment because the calendar says it should work.",
  },
  {
    title: "Restraint before friction compounds",
    body: "Catch the joke, explanation, push, or repair attempt that would make a small issue larger than it needs to be.",
  },
];

const INTELLIGENCE_POINTS = [
  ["Today’s shift", "What the modeled cycle pattern is doing now."],
  ["Biology", "The cycle mechanics behind the day, stated as context rather than measurement."],
  ["Possible effects", "How energy, sensitivity, recovery demand, connection, and pace may be affected."],
];

const PREMIUM_FEATURES = [
  "Full Day Brief",
  "Complete PLAN, READ, BOND, and SELF Protocol",
  "Deeper WHY explanations",
  "Full Cycle Calendar",
  "Cycle Intelligence",
  "Risk Radar and Timing Alerts",
];

const HOW_STEPS = [
  ["01", "Set one date", "Start with the first day of her last period—or her best estimate of the next one."],
  ["02", "Read the day", "See phase, capacity, intelligence, risk, direction, and the full brief."],
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
    "Today’s State combines cycle day, phase, cycle-based capacity, hormone context, risk, and direction. You can then open the full Day Brief, Risk Radar, Protocol, Calendar, and Intelligence layers.",
  ],
  [
    "What is included with Premium+?",
    "Premium+ unlocks the full Day Brief, complete Protocol access, deeper WHY explanations, full Cycle Calendar, Intelligence, Risk Radar, and Timing Alerts. The app remains free to download.",
  ],
  [
    "Can MoodMap tell me exactly how she feels?",
    "No. MoodMap provides modeled cycle-based context, not certainty about an individual person. The point is to make your response more careful—not to replace her words with an app.",
  ],
];

function StoreButtons({ compact = false }) {
  return (
    <div id={compact ? undefined : "download"} className={["mm-store-row", compact ? "mm-store-row--center" : ""].filter(Boolean).join(" ")}>
      <a href={APPSTORE_URL} className="store-btn" aria-label="Download MoodMap for iPhone on the App Store">
        <span className="store-btn__icon" aria-hidden="true"><FaApple /></span>
        <span className="store-btn__copy"><small>App Store</small><strong>Download for iPhone</strong></span>
      </a>
      <a href={PLAYSTORE_URL} className="store-btn" aria-label="Get MoodMap on Google Play">
        <span className="store-btn__icon" aria-hidden="true"><FaGooglePlay /></span>
        <span className="store-btn__copy"><small>Google Play</small><strong>Get on Google Play</strong></span>
      </a>
    </div>
  );
}

function SectionLabel({ children }) {
  return <span className="mm-section-label">{children}</span>;
}

function Poster({ src, alt, className = "", priority = false }) {
  return (
    <div className={["mm-v2-poster", className].filter(Boolean).join(" ")}>
      <div className="mm-v2-poster__glow" aria-hidden="true" />
      <img src={src} alt={alt} loading={priority ? "eager" : "lazy"} decoding="async" fetchPriority={priority ? "high" : "auto"} />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="mm-v2-hero">
      <div className="mm-container mm-v2-hero__grid">
        <div className="mm-v2-hero__copy" data-reveal>
          <SectionLabel>Cycle-aware relationship intelligence for men</SectionLabel>
          <h1>Read the day before you react.</h1>
          <p className="mm-v2-hero__lead">
            One private daily read based on your partner’s cycle—what changed, what matters, what to avoid, and the cleaner response.
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
    </section>
  );
}

function ProofStrip() {
  return (
    <section className="mm-v2-proof-section" aria-label="MoodMap product proof">
      <div className="mm-container">
        <div className="mm-v2-proof-grid" data-reveal>
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
    <section className="mm-section mm-v2-product-section" aria-labelledby="product-heading">
      <div className="mm-container">
        <ProductShowcase surfaces={APP_SURFACES} />
      </div>
    </section>
  );
}

function IntelligenceSection() {
  return (
    <section id="intelligence-layer" className="mm-section mm-v2-intelligence">
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
                src="/screenshots/web-2026/intelligence-graph.webp"
                alt="MoodMap modeled hormone graph across the cycle."
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="mm-v3-phone-frame mm-v3-phone-frame--front">
              <img
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

function AlertsOnboardingSection() {
  return (
    <section className="mm-section mm-v2-dual-section">
      <div className="mm-container">
        <div className="mm-v2-dual-grid">
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
      </div>
    </section>
  );
}

function BenefitsSection() {
  return (
    <section className="mm-section mm-v2-benefits">
      <div className="mm-container">
        <div className="mm-v2-section-heading" data-reveal>
          <SectionLabel>What better timing changes</SectionLabel>
          <h2>More understanding. Less guesswork.</h2>
          <p>MoodMap is not only about avoiding conflict. It helps you notice where support, initiative, conversation, connection, or restraint can land better.</p>
        </div>
        <div className="mm-v2-benefit-grid">
          {BENEFITS.map((item, index) => (
            <article key={item.title} data-reveal>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function PremiumSection() {
  return (
    <section id="premium" className="mm-section mm-v2-premium">
      <div className="mm-container">
        <div className="mm-v2-premium-panel" data-reveal>
          <div className="mm-v2-premium-copy">
            <SectionLabel>Premium+</SectionLabel>
            <h2>Unlock the full read.</h2>
            <p>Go beyond the daily headline with the full Day Brief, complete Protocol, deeper WHY explanations, Cycle Intelligence, Risk Radar, and Timing Alerts.</p>
            <div className="mm-v2-price-row" aria-label="MoodMap Premium Plus prices">
              <div><span>Monthly</span><strong>$2.99</strong><small>per month</small></div>
              <div><span>Annual</span><strong>$24.99</strong><small>per year</small></div>
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

function HowItWorks() {
  return (
    <section id="how-it-works" className="mm-section mm-v2-how">
      <div className="mm-container">
        <div className="mm-v2-section-heading mm-v2-section-heading--center" data-reveal>
          <SectionLabel>How it works</SectionLabel>
          <h2>One date. One read. A cleaner response.</h2>
        </div>
        <div className="mm-v2-step-grid">
          {HOW_STEPS.map(([number, title, body]) => (
            <article key={number} data-reveal><span>{number}</span><h3>{title}</h3><p>{body}</p></article>
          ))}
        </div>
      </div>
    </section>
  );
}

function TrustSection() {
  return (
    <section id="trust" className="mm-section mm-v2-trust">
      <div className="mm-container">
        <div className="mm-v2-trust-panel" data-reveal>
          <div className="mm-v2-trust-intro">
            <span className="mm-v2-icon-chip"><ShieldCheck aria-hidden="true" /></span>
            <SectionLabel>Clear boundaries</SectionLabel>
            <h2>Private, careful, and narrower than certainty.</h2>
            <p>MoodMap gives you context for your own response. It does not turn your partner into a score, diagnosis, or dashboard.</p>
          </div>
          <div className="mm-v2-trust-grid">
            {TRUST_ITEMS.map(([title, body]) => <article key={title}><h3>{title}</h3><p>{body}</p></article>)}
          </div>
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  return (
    <section id="questions" className="mm-section mm-v2-faq">
      <div className="mm-container mm-v2-faq-grid">
        <div className="mm-v2-faq-intro" data-reveal>
          <SectionLabel>Questions</SectionLabel>
          <h2>What MoodMap does—and what it does not.</h2>
          <p>A precise product is easier to trust. These are the boundaries that keep the daily read useful.</p>
        </div>
        <div className="mm-v2-faq-list" data-reveal>
          {FAQ_ITEMS.map(([question, answer], index) => (
            <details key={question} open={index === 0}><summary>{question}</summary><p>{answer}</p></details>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="mm-v2-final-cta">
      <div className="mm-container" data-reveal>
        <span className="mm-v2-final-cta__icon"><Sparkles aria-hidden="true" /></span>
        <h2>Read the day before you react.</h2>
        <p>One private daily read based on cycle context. Available on iOS and Android.</p>
        <StoreButtons compact />
        <Link href="/learn" className="mm-v2-final-cta__secondary">Explore the guides <ChevronRight aria-hidden="true" /></Link>
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

      <div className="mm-page mm-v2-page mm-v3-page relative isolate overflow-x-hidden text-white">
        <div aria-hidden="true" className="mm-background-field" />
        <HeroSection />
        <ProofStrip />
        <ProductSection />
        <IntelligenceSection />
        <AlertsOnboardingSection />
        <BenefitsSection />
        <PremiumSection />
        <HowItWorks />
        <TrustSection />
        <FaqSection />
        <FinalCta />
      </div>
    </>
  );
}
