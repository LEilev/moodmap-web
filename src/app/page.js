import Link from "next/link";
import { FaApple, FaGooglePlay } from "react-icons/fa";

import ScrollReveal from "../components/ScrollReveal";
import ProductShowcase from "../components/ProductShowcase";

const APPSTORE_URL =
  "https://apps.apple.com/no/app/moodmap-moodcoaster/id6746102626?l=nb";
const PLAYSTORE_URL =
  "https://play.google.com/store/apps/details?id=com.eilev.moodmapnextgen";

const CYCLE_SIGNALS = [
  ["Menstrual", "Reset support"],
  ["Follicular", "Talk window"],
  ["Ovulation", "High connection"],
  ["Luteal", "Load shift"],
  ["PMS", "Soft landing"],
];

const APP_SURFACES = [
  {
    screenshotPath: "/screenshots/daily-briefing.webp",
    shotClass: "mm-device-shot--daily-briefing",
    kicker: "Daily Briefing",
    title: "What changed today.",
    quote: "Land it soft. Warmth, easy food, short support.",
    meta: "Phase + capacity",
    alt: "MoodMap Daily Briefing screen showing PMS day 28, capacity, hormones, risk, and brief.",
  },
  {
    screenshotPath: "/screenshots/sitrep.webp",
    shotClass: "mm-device-shot--sitrep",
    kicker: "Room Read",
    title: "What matters now.",
    quote: "Close it softly. Warmth, simple food, low light, short support.",
    meta: "Context layer",
    alt: "MoodMap Room Read screen showing guidance for a low-capacity day.",
  },
  {
    screenshotPath: "/screenshots/risk-radar.webp",
    shotClass: "mm-device-shot--risk-radar",
    kicker: "Friction Risk",
    title: "What not to step on.",
    quote: "Your need for closure is the fresh war.",
    meta: "Avoid layer",
    alt: "MoodMap Friction Risk screen showing tripwire and containment guidance.",
  },
  {
    screenshotPath: "/screenshots/commanddeck-main.webp",
    secondaryScreenshotPath: "/screenshots/commanddeck.webp",
    shotClass: "mm-device-shot--commanddeck-main",
    kicker: "Move + Reason",
    systemLabel: "Move + Reason",
    title: "What to do — and why.",
    quote: "A real issue can still be opened at the wrong hour.",
    meta: "Action layer",
    alt: "MoodMap Move and Reason screen showing key insight cards and why prompts.",
    secondaryAlt: "MoodMap WHY layer explaining the reasoning behind a move.",
    secondaryLabel: "WHY layer",
    secondaryCaption: "Tap WHY. See the reason before you move.",
    reasonTitle: "See the reason before you move.",
    reasonBody: "A real issue can still be valid and still land badly at the wrong hour.",
    reasonBullets: [
      "Check the hour before the topic becomes the fight.",
      "Separate the real issue from the timing problem.",
      "Make one cleaner move before repair work starts.",
    ],
    defaultActive: true,
  },
];

const PROOF_STRIP_ITEMS = [
  ["Live on iOS + Android", "Direct App Store and Google Play links."],
  ["Full-cycle context", "Menstrual, follicular, ovulation, luteal, and PMS."],
  ["Private by design", "Built for his timing, not her identity."],
  ["Clear boundaries", "Relationship timing, outside medical advice."],
];

const CONSEQUENCE_ITEMS = [
  [
    "Wrong-hour talks",
    "A serious topic opened at the wrong hour can become the second fight.",
  ],
  [
    "Closure pressure",
    "Low capacity does not reward pressure. It turns clarity into resistance.",
  ],
  [
    "Missed reset windows",
    "Food, warmth, silence, or one clean support move can save hours of repair.",
  ],
  [
    "Autopilot moves",
    "The joke, fix, push, or explanation that feels natural can make the room heavier.",
  ],
];

const PREMIUM_LAYERS = [
  ["Fewer wrong-hour talks", "Know when a real issue needs better timing."],
  ["Less repair work", "Catch pressure before it becomes the second fight."],
  ["Cleaner support", "Choose warmth, space, talk, or restraint with context."],
  ["Better intimacy timing", "Read connection, capacity, and pace before he initiates."],
];

const WHY_LAYER_POINTS = [
  [
    "Timing signals",
    "Phase and hormone context is translated into timing signals — not medical readings.",
  ],
  [
    "Practical interpretation",
    "Biology, consequence, and interpretation stay connected to the move he actually makes.",
  ],
  [
    "Cleaner response",
    "Use the context to choose tone, timing, support, restraint, or intimacy pace.",
  ],
];

const HOW_STEPS = [
  ["01", "Set the cycle once", "Save the basics. MoodMap handles the daily read."],
  ["02", "Check today’s signal", "See phase, capacity, risk, and timing before the room gets expensive."],
  ["03", "Move cleaner", "Support, talk, initiate, or hold steady with the right pace."],
];

const TRUST_ITEMS = [
  ["Private by design", "Built for a private daily read. Not a public scorecard."],
  ["Cycle-aware, not medical", "Context for timing, outside diagnosis, contraception, and fertility planning."],
  ["Built for his response", "The product guides his timing, not her identity, mood, or worth."],
];

const FAQ_ITEMS = [
  [
    "How does MoodMap read the day?",
    "MoodMap reads menstrual cycle context — phase, capacity, risk, and timing — so he can respond with more care. It gives context for his timing, not a verdict on her.",
  ],
  [
    "What kind of guidance is MoodMap?",
    "MoodMap is relationship timing guidance: practical context for support, conversation, intimacy, and restraint. Medical care, contraception, and fertility planning stay outside the product.",
  ],
  [
    "Why is the daily read worth paying for?",
    "The value sits before the mistake: fewer wrong-hour conversations, less repair work, and fewer avoidable friction loops from a cleaner move.",
  ],
  [
    "How does this keep the relationship human?",
    "MoodMap reduces guesswork so he can be less reactive, more careful, and better timed. The point is steadier presence, not mechanical behavior.",
  ],
];

function StoreButtons({ compact = false, official = false }) {
  return (
    <div
      id={compact ? undefined : "download"}
      className={[
        "mm-store-row",
        compact ? "mm-store-row--center" : null,
        official ? "mm-store-row--official" : null,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <a href={APPSTORE_URL} className="store-btn" aria-label="Download MoodMap for iPhone on the App Store">
        <span className="store-btn__icon" aria-hidden="true">
          <FaApple />
        </span>
        <span className="store-btn__copy">
          <small>App Store</small>
          <strong>Download for iPhone</strong>
        </span>
      </a>

      <a href={PLAYSTORE_URL} className="store-btn" aria-label="Get MoodMap on Google Play">
        <span className="store-btn__icon" aria-hidden="true">
          <FaGooglePlay />
        </span>
        <span className="store-btn__copy">
          <small>Google Play</small>
          <strong>Get on Google Play</strong>
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

      <div className="mm-cycle-strip" aria-label="MoodMap adapts across the full cycle">
        <span className="mm-cycle-strip__eyebrow">Full-cycle read</span>
        <div className="mm-cycle-strip__track">
          {CYCLE_SIGNALS.map(([phase, signal]) => (
            <span key={phase} className="mm-cycle-strip__item">
              <strong>{phase}</strong>
              <small>{signal}</small>
            </span>
          ))}
        </div>
      </div>
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
    <section className="mm-section mm-product-proof" aria-labelledby="product-heading">
      <div className="mm-container">
        <ProductShowcase surfaces={APP_SURFACES} />
      </div>
    </section>
  );
}

function WhyLayer() {
  return (
    <section id="why-layer" className="mm-section mm-depth-section" aria-labelledby="why-layer-heading">
      <div className="mm-container">
        <div className="mm-depth-panel" data-reveal>
          <div className="mm-depth-copy">
            <SectionLabel>Why layer</SectionLabel>
            <h2 id="why-layer-heading">The why behind the read.</h2>
            <p>
              MoodMap turns menstrual cycle context into practical timing: what changed, why it matters, and what to do with it. Context, not diagnosis. Timing guidance, not prediction. Not a verdict on her.
            </p>

            <div className="mm-depth-points" aria-label="MoodMap why layer value">
              {WHY_LAYER_POINTS.map(([title, copy]) => (
                <article key={title} className="mm-depth-point">
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="mm-depth-visual" aria-label="MoodMap hormone chart and insight preview">
            <div className="mm-depth-chart-card" aria-hidden="true">
              <img
                src="/screenshots/hormone-chart-depth.webp"
                alt=""
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="mm-depth-insight-card">
              <img
                src="/screenshots/hormone-insight-depth.webp"
                alt="MoodMap insight screen translating menstrual cycle context into biology, consequence, and interpretation."
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

function CostSection() {
  return (
    <section id="cost" className="mm-section mm-cost-section">
      <div className="mm-container">
        <div className="mm-cost-panel" data-reveal>
          <div className="mm-cost-intro">
            <SectionLabel>Why it matters</SectionLabel>
            <h2>Bad timing is expensive.</h2>
            <p>
              The cost is not the read. The cost is the wrong-hour talk, the pressure fix, the reflex joke, and the repair work that did not need to happen.
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

function PremiumStack() {
  return (
    <section id="premium" className="mm-section mm-premium-section">
      <div className="mm-container">
        <div className="mm-premium-panel" data-reveal>
          <div className="mm-premium-copy">
            <SectionLabel>Premium+</SectionLabel>
            <h2>The full daily read before the moment gets expensive.</h2>
            <p>
              Premium+ gives him the full daily read: phase, room read, friction risk, cleaner move, and the reason behind it — built to reduce wrong-hour talks, pressure moves, and avoidable repair.
            </p>
            <Link href="/pro" className="mm-premium-link">
              See Premium+
            </Link>
          </div>

          <div className="mm-premium-stack" aria-label="Premium+ daily value">
            {PREMIUM_LAYERS.map(([title, copy], index) => (
              <article key={title} className="mm-premium-layer">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </div>
              </article>
            ))}
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
            <p>Context for his timing. Not a verdict on her. Practical guidance with clear boundaries.</p>
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
            <h2 className="mm-faq-headline">
              <span>Private context.</span>
              <span>Careful guidance.</span>
              <span>Better timing.</span>
            </h2>
            <p>Built to make him steadier before he moves.</p>
          </div>

          <div className="mm-faq-list">
            {FAQ_ITEMS.map(([question, answer], index) => (
              <details key={question} className="mm-faq-item" open={index === 0}>
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
        <h2>Read the room before you enter it.</h2>
        <p>Thirty seconds now. Less repair later.</p>
        <StoreButtons compact official />
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
                MoodMap gives men one private read from their partner’s menstrual cycle — phase, capacity, risk, and the cleaner move before timing costs more than it should.
              </p>
              <p className="mm-hero-boundary">Context for his timing. Not a verdict on her.</p>
              <StoreButtons />
              <p className="mm-hero-trust">Live on iOS and Android. Relationship timing around the menstrual cycle with clear, non-medical boundaries.</p>
            </div>

            <HeroPhone />
          </div>
        </section>

        <ProofStrip />
        <ProductProof />
        <WhyLayer />
        <CostSection />
        <PremiumStack />
        <HowItWorks />
        <TrustSection />
        <FaqSection />
        <FinalCta />
      </div>
    </>
  );
}
