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
    copy: "Late luteal load can make small friction feel louder.",
    meta: "Phase terrain",
    tone: "emerald",
  },
  {
    screenshotPath: "/screenshots/sitrep.webp",
    kicker: "SitRep",
    title: "What matters now.",
    copy: "Keep the plan simple. Do not make her manage your uncertainty.",
    meta: "Room read",
    tone: "blue",
  },
  {
    screenshotPath: "/screenshots/risk-radar.webp",
    kicker: "Risk Radar",
    title: "What not to step on.",
    copy: "Tone debate costs more when the real issue is capacity.",
    meta: "Friction risk",
    tone: "rose",
  },
  {
    screenshotPath: "/screenshots/commanddeck.webp",
    kicker: "CommandDeck",
    title: "The move to make.",
    copy: "If the room feels tight, lower your volume first.",
    meta: "Next move",
    tone: "violet",
  },
];

const HERO_ROWS = [
  ["Briefing", "Late luteal load can make small friction feel louder."],
  ["SitRep", "Keep the plan simple and lower the ask."],
  ["Risk Radar", "Do not turn capacity into a tone debate."],
  ["CommandDeck", "Remove one task, then check in cleanly."],
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

function HeroPhone() {
  return (
    <div className="mm-phone-stage" aria-label="MoodMap daily read preview" data-reveal>
      <div className="mm-phone" role="img" aria-label="MoodMap app screen showing one daily read">
        <div className="mm-phone__speaker" aria-hidden="true" />
        <div className="mm-phone__screen">
          <div className="mm-phone__topbar">
            <span>Daily Read</span>
            <span>Luteal · Day 23</span>
          </div>

          <div className="mm-phone__hero-card">
            <span className="mm-live-dot">Private read</span>
            <h2>Read the day before you react.</h2>
            <p>
              Same behavior. Different phase. Different outcome. Start with context, then choose the move.
            </p>
          </div>

          <div className="mm-phone__rows">
            {HERO_ROWS.map(([label, copy], index) => (
              <div key={label} className="mm-phone-row">
                <span className="mm-phone-row__index">0{index + 1}</span>
                <div>
                  <strong>{label}</strong>
                  <p>{copy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AppSurface({ surface, index }) {
  return (
    <article
      className={["mm-app-surface", `mm-app-surface--${surface.tone}`].join(" ")}
      data-screenshot={surface.screenshotPath}
      data-reveal
    >
      <div className="mm-app-surface__chrome" aria-hidden="true">
        <span />
        <span />
      </div>
      <div className="mm-app-surface__meta">
        <span>{surface.kicker}</span>
        <span>{surface.meta}</span>
      </div>
      <div className="mm-app-surface__body">
        <span className="mm-app-surface__number">0{index + 1}</span>
        <h3>{surface.title}</h3>
        <p>{surface.copy}</p>
      </div>
    </article>
  );
}

function ProductProof() {
  return (
    <section id="product" className="mm-section mm-product-proof">
      <div className="mm-container">
        <div className="mm-section-heading" data-reveal>
          <SectionLabel>Product proof</SectionLabel>
          <h2>One daily read. Four useful layers.</h2>
          <p>
            MoodMap keeps the daily loop compact: what changed, what matters, what not to step on, and what move to make.
          </p>
        </div>

        <div className="mm-proof-strip" aria-label="MoodMap app surfaces">
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
