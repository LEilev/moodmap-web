import { FaApple, FaGooglePlay } from "react-icons/fa";

import ScrollReveal from "../components/ScrollReveal";
import ProductShowcase from "../components/ProductShowcase";

const APPSTORE_URL =
  "https://apps.apple.com/no/app/moodmap-moodcoaster/id6746102626?l=nb";
const PLAYSTORE_URL =
  "https://play.google.com/store/apps/details?id=com.eilev.moodmapnextgen";

const APP_SURFACES = [
  {
    screenshotPath: "/screenshots/daily-briefing.webp",
    shotClass: "mm-device-shot--daily-briefing",
    kicker: "Daily Briefing",
    title: "What changed today.",
    quote: "Land it soft. Warmth, easy food, short support.",
    meta: "PMS · Day 28",
    alt: "MoodMap Daily Briefing screen showing PMS day 28, capacity, hormones, risk, and brief.",
  },
  {
    screenshotPath: "/screenshots/sitrep.webp",
    shotClass: "mm-device-shot--sitrep",
    kicker: "SitRep",
    title: "What matters now.",
    quote: "Close it softly. Warmth, simple food, low light, short support.",
    meta: "Room read",
    alt: "MoodMap SitRep screen showing guidance for day 3 in PMS.",
  },
  {
    screenshotPath: "/screenshots/risk-radar.webp",
    shotClass: "mm-device-shot--risk-radar",
    kicker: "Risk Radar",
    title: "What not to step on.",
    quote: "Your need for closure is the fresh war.",
    meta: "Friction risk",
    alt: "MoodMap Risk Radar screen showing tripwire and containment guidance.",
  },
  {
    screenshotPath: "/screenshots/commanddeck-main.webp",
    secondaryScreenshotPath: "/screenshots/commanddeck.webp",
    shotClass: "mm-device-shot--commanddeck-main",
    kicker: "CommandDeck",
    title: "The move to make.",
    quote: "A real issue can still be opened at the wrong hour.",
    meta: "Next move",
    alt: "MoodMap CommandDeck screen showing key insight cards and why prompts.",
    secondaryAlt: "MoodMap CommandDeck why layer explaining the reasoning behind a move.",
    secondaryLabel: "Why layer",
    secondaryCaption: "Tap WHY. See the reason behind the move.",
  },
];

const PROOF_STRIP_ITEMS = [
  ["Live on iOS + Android", "Open it where you already use apps."],
  ["Private daily read", "Built for him, not a public scorecard."],
  ["Cycle-aware context", "Patterns help timing. They do not define her."],
  ["Not medical advice", "No diagnosis, contraception, or fertility planning."],
];

const CONSEQUENCE_ITEMS = [
  [
    "Wrong-hour talks",
    "A real issue can turn into a second fight when it is opened at the wrong capacity.",
  ],
  [
    "Closure pressure",
    "When her system is low, pushing for resolution often creates resistance instead.",
  ],
  [
    "Missed reset windows",
    "Small support, food, warmth, or silence can prevent repair work later.",
  ],
  [
    "Default reactions",
    "MoodMap gives him one cleaner move before impulse, jokes, or fixes make it worse.",
  ],
];

const HOW_STEPS = [
  ["01", "Set the cycle once", "Save the basics. MoodMap handles the daily context."],
  ["02", "Read the signal", "See phase, capacity, risk, and timing before you move."],
  ["03", "Choose the cleaner move", "Support, talk, initiate, or hold steady with better timing."],
];

const TRUST_ITEMS = [
  ["Private by design", "Built for a private daily read, not a public scorecard."],
  ["Cycle-aware, not predictive", "Patterns create context. They do not define her."],
  ["Guidance, not diagnosis", "Not medical advice, contraception, or fertility planning."],
];

const FAQ_ITEMS = [
  [
    "Is MoodMap predicting her mood?",
    "No. It gives cycle-aware context, risk, and timing guidance. It is not a verdict on her or a replacement for talking to her.",
  ],
  [
    "Is this medical or fertility advice?",
    "No. MoodMap is relationship timing guidance, not diagnosis, contraception, fertility planning, or medical treatment.",
  ],
  [
    "Why would this be worth paying for?",
    "Because one badly timed conversation can cost more than a month of clean daily reads. The product is built to reduce avoidable friction before it starts.",
  ],
  [
    "Does this make relationships mechanical?",
    "No. It does the opposite: it gives context so he can be more careful, less reactive, and more human in the moment.",
  ],
];

function StoreButtons({ compact = false }) {
  return (
    <div
      id={compact ? undefined : "download"}
      className={["mm-store-row", compact ? "mm-store-row--center" : ""].join(" ")}
    >
      <a href={APPSTORE_URL} className="store-btn" aria-label="Download MoodMap on the App Store">
        <span className="store-btn__icon" aria-hidden="true">
          <FaApple />
        </span>
        <span className="store-btn__copy">
          <small>Download on the</small>
          <strong>App Store</strong>
        </span>
      </a>

      <a href={PLAYSTORE_URL} className="store-btn" aria-label="Get MoodMap on Google Play">
        <span className="store-btn__icon" aria-hidden="true">
          <FaGooglePlay />
        </span>
        <span className="store-btn__copy">
          <small>Get it on</small>
          <strong>Google Play</strong>
        </span>
      </a>
    </div>
  );
}

function SectionLabel({ children }) {
  return <span className="mm-section-label">{children}</span>;
}

function DeviceShot({ src, alt, className = "", priority = false }) {
  return (
    <div className={["mm-device-shot", className].filter(Boolean).join(" ")}> 
      <div className="mm-device-shot__rail" aria-hidden="true" />
      <div className="mm-device-shot__frame">
        <div className="mm-device-shot__notch" aria-hidden="true" />
        <div className="mm-device-shot__screen">
          <img
            src={src}
            alt={alt}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={priority ? "high" : "auto"}
          />
        </div>
      </div>
    </div>
  );
}

function HeroPhone() {
  return (
    <div className="mm-phone-stage" aria-label="MoodMap daily read preview" data-reveal>
      <DeviceShot
        src="/screenshots/daily-briefing-hero.webp"
        alt="MoodMap app showing the Daily Briefing for PMS day 28."
        className="mm-device-shot--hero"
        priority
      />
    </div>
  );
}

function ProofStrip() {
  return (
    <section className="mm-proof-strip-section" aria-label="MoodMap trust proof">
      <div className="mm-container">
        <div className="mm-proof-strip" data-reveal>
          {PROOF_STRIP_ITEMS.map(([title, copy]) => (
            <article key={title} className="mm-proof-strip__item">
              <strong>{title}</strong>
              <span>{copy}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductProof() {
  return (
    <section id="product" className="mm-section mm-product-proof">
      <div className="mm-container">
        <ProductShowcase surfaces={APP_SURFACES} />
      </div>
    </section>
  );
}

function CostSection() {
  return (
    <section id="cost" className="mm-section mm-cost-section">
      <div className="mm-container">
        <div className="mm-cost-panel" data-reveal>
          <div className="mm-cost-intro">
            <SectionLabel>What this prevents</SectionLabel>
            <h2>Bad timing is expensive.</h2>
            <p>
              MoodMap is not there to diagnose her. It is there to stop him from walking into the wrong conversation, at the wrong hour, with the wrong move.
            </p>
          </div>

          <div className="mm-cost-grid">
            {CONSEQUENCE_ITEMS.map(([title, copy], index) => (
              <article key={title} className="mm-cost-card">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function WhyItMatters() {
  return (
    <section id="why" className="mm-section mm-why-section">
      <div className="mm-container">
        <div className="mm-why-card" data-reveal>
          <div className="mm-why-copy">
            <SectionLabel>Why timing matters</SectionLabel>
            <h2>Timing changes the outcome.</h2>
            <p>
              The same question, joke, fix, or touch can land differently depending on the day. MoodMap helps you read the room before you react to the moment.
            </p>
          </div>

          <div className="mm-compare-stack" aria-label="Timing example">
            <div className="mm-compare-card mm-compare-card--quiet">
              <span>Without context</span>
              <p>“Why are you making this a thing?”</p>
            </div>
            <div className="mm-compare-card mm-compare-card--active">
              <span>With MoodMap</span>
              <p>“I’ll simplify the plan and take one thing off the list.”</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="how-it-works" className="mm-section mm-how-section">
      <div className="mm-container">
        <div className="mm-section-heading mm-section-heading--center" data-reveal>
          <SectionLabel>How it works</SectionLabel>
          <h2>Open. Read. Move cleaner.</h2>
        </div>

        <div className="mm-steps">
          {HOW_STEPS.map(([number, title, copy]) => (
            <article key={title} className="mm-step" data-reveal>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function TrustSection() {
  return (
    <section id="trust" className="mm-section mm-trust-section">
      <div className="mm-container">
        <div className="mm-trust-panel" data-reveal>
          <div className="mm-trust-intro">
            <SectionLabel>Trust</SectionLabel>
            <h2>Private, careful, practical.</h2>
            <p>Private by design. Cycle-aware, not predictive. Practical guidance, not diagnosis.</p>
          </div>

          <div className="mm-trust-list">
            {TRUST_ITEMS.map(([title, copy]) => (
              <article key={title} className="mm-trust-item">
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  return (
    <section id="questions" className="mm-section mm-faq-section">
      <div className="mm-container">
        <div className="mm-faq-panel" data-reveal>
          <div className="mm-faq-intro">
            <SectionLabel>Questions</SectionLabel>
            <h2>Not prediction. Not surveillance. Just timing.</h2>
            <p>Short answers to the doubts that make this category fragile.</p>
          </div>

          <div className="mm-faq-list">
            {FAQ_ITEMS.map(([question, answer]) => (
              <details key={question} className="mm-faq-item">
                <summary>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="mm-final-cta">
      <div className="mm-container" data-reveal>
        <span className="mm-cta-dot" aria-hidden="true" />
        <h2>Stop guessing the room. Read today first.</h2>
        <p>One daily read. Fewer timing mistakes. Less repair work.</p>
        <StoreButtons compact />
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <ScrollReveal />

      <div className="mm-page relative isolate overflow-x-hidden text-white">
        <div aria-hidden="true" className="mm-background-field" />

        <section className="mm-hero-section">
          <div className="mm-container mm-hero-grid">
            <div className="mm-hero-copy" data-reveal>
              <SectionLabel>Private daily read for men in relationships</SectionLabel>
              <h1>Read the day before you react.</h1>
              <p className="mm-hero-subline">
                MoodMap gives men one private read from their partner’s cycle context — phase, capacity, risk, and the cleaner move before timing costs more than it should.
              </p>
              <StoreButtons />
              <p className="mm-hero-trust">Live on iOS and Android. Cycle-aware guidance. Not mood prediction. Not medical advice.</p>
            </div>

            <HeroPhone />
          </div>
        </section>

        <ProofStrip />
        <ProductProof />
        <CostSection />
        <WhyItMatters />
        <HowItWorks />
        <TrustSection />
        <FaqSection />
        <FinalCta />
      </div>
    </>
  );
}
