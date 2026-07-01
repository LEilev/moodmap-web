import { FaApple, FaGooglePlay } from "react-icons/fa";

import ScrollReveal from "../components/ScrollReveal";

const APPSTORE_URL =
  "https://apps.apple.com/no/app/moodmap-moodcoaster/id6746102626?l=nb";
const PLAYSTORE_URL =
  "https://play.google.com/store/apps/details?id=com.eilev.moodmapnextgen";

const APP_SURFACES = [
  {
    screenshotPath: "/screenshots/daily-briefing.webp",
    kicker: "Daily Briefing",
    title: "What changed today.",
    copy: "Phase, risk, and briefing in one private read.",
    meta: "PMS · Day 28",
    tone: "emerald",
    alt: "MoodMap Daily Briefing screen showing PMS day 28, capacity, hormones, risk, and brief.",
  },
  {
    screenshotPath: "/screenshots/sitrep.webp",
    kicker: "SitRep",
    title: "What matters now.",
    copy: "The tactical room read: lean toward, avoid, and what costs more today.",
    meta: "Room read",
    tone: "blue",
    alt: "MoodMap SitRep screen showing guidance for day 3 in PMS.",
  },
  {
    screenshotPath: "/screenshots/risk-radar.webp",
    kicker: "Risk Radar",
    title: "What not to step on.",
    copy: "A clear tripwire, containment move, and why this day needs better timing.",
    meta: "Friction risk",
    tone: "rose",
    alt: "MoodMap Risk Radar screen showing tripwire and containment guidance.",
  },
  {
    screenshotPath: "/screenshots/commanddeck.webp",
    kicker: "CommandDeck",
    title: "The move to make.",
    copy: "Guardrails and practical moves for support, communication, intimacy, and steadiness.",
    meta: "Next move",
    tone: "cyan",
    alt: "MoodMap CommandDeck screen showing key insights and practical daily moves.",
  },
];

const HOW_STEPS = [
  ["01", "Set her cycle", "Save the basics once."],
  ["02", "Read today", "Get the current phase, risk, and timing context."],
  ["03", "Make the cleaner move", "Support, communicate, approach, or hold steady."],
];

const TRUST_ITEMS = [
  ["Private by design", "Built for everyday relationship timing."],
  ["Cycle-aware, not predictive", "General patterns help context. They do not define her."],
  ["Practical, not clinical", "Not diagnosis, contraception, or fertility planning."],
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
        src="/screenshots/daily-briefing.webp"
        alt="MoodMap app showing the Daily Briefing for PMS day 28."
        className="mm-device-shot--hero"
        priority
      />
    </div>
  );
}

function AppSurface({ surface, index }) {
  return (
    <article className={["mm-proof-card", `mm-proof-card--${surface.tone}`].join(" ")} data-reveal>
      <div className="mm-proof-card__copy">
        <span className="mm-proof-card__number">0{index + 1}</span>
        <div>
          <span className="mm-proof-card__meta">{surface.meta}</span>
          <h3>{surface.kicker}</h3>
          <p className="mm-proof-card__title">{surface.title}</p>
          <p>{surface.copy}</p>
        </div>
      </div>

      <DeviceShot
        src={surface.screenshotPath}
        alt={surface.alt}
        className="mm-device-shot--proof"
      />
    </article>
  );
}

function ProductProof() {
  return (
    <section id="product" className="mm-section mm-product-proof">
      <div className="mm-container">
        <div className="mm-section-heading" data-reveal>
          <SectionLabel>Real app proof</SectionLabel>
          <h2>One daily read. Four useful layers.</h2>
          <p>
            The same day, shown as one loop: what changed, what matters, what not to step on, and what move to make.
          </p>
        </div>

        <div className="mm-proof-strip" aria-label="MoodMap app screens">
          {APP_SURFACES.map((surface, index) => (
            <AppSurface key={surface.kicker} surface={surface} index={index} />
          ))}
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

function FinalCta() {
  return (
    <section className="mm-final-cta">
      <div className="mm-container" data-reveal>
        <span className="mm-cta-dot" aria-hidden="true" />
        <h2>Stop guessing the room. Read today first.</h2>
        <p>One daily read. Better timing. Less unnecessary friction.</p>
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
                MoodMap gives men one private daily read from their partner’s cycle context — what changed, what to watch, and the move that lowers friction.
              </p>
              <StoreButtons />
              <p className="mm-hero-trust">Cycle-aware guidance. Not mood prediction. Not medical advice.</p>
            </div>

            <HeroPhone />
          </div>
        </section>

        <ProductProof />
        <WhyItMatters />
        <HowItWorks />
        <TrustSection />
        <FinalCta />
      </div>
    </>
  );
}
