// src/app/page.js
import {
  Activity,
  BellRing,
  Brain,
  ClipboardList,
  Clock,
  Flame,
  HeartHandshake,
  LineChart,
  Map,
  MessageCircle,
  Radar,
  ShieldCheck,
} from "lucide-react";
import { FaApple, FaGooglePlay } from "react-icons/fa";

import CommandDeckPreview from "../components/CommandDeckPreview";
import ScrollReveal from "../components/ScrollReveal";

const APPSTORE_URL =
  "https://apps.apple.com/no/app/moodmap-moodcoaster/id6746102626?l=nb";
const PLAYSTORE_URL =
  "https://play.google.com/store/apps/details?id=com.eilev.moodmapnextgen";

const PRODUCT_STACK = [
  {
    Icon: ClipboardList,
    title: "Daily Briefing",
    label: "What changed",
    copy:
      "A fast terrain read for period timing, PMS, ovulation context, energy, and stress margin.",
    accent: "34 197 94",
  },
  {
    Icon: Brain,
    title: "SitRep",
    label: "What matters",
    copy:
      "The tactical room read: what to lean toward, what to avoid, and what costs more today.",
    accent: "56 189 248",
  },
  {
    Icon: Radar,
    title: "Risk Radar",
    label: "What to avoid",
    copy:
      "Flags common friction traps early: pressure, debate reflex, bad timing, noise, and ambiguity.",
    accent: "248 113 113",
  },
  {
    Icon: Map,
    title: "CommandDeck",
    label: "What to do",
    copy:
      "Turns the read into practical moves for support, communication, intimacy, and core steadiness.",
    accent: "45 212 191",
  },
  {
    Icon: LineChart,
    title: "Hormone Graph Intelligence",
    label: "Why timing shifts",
    copy:
      "Shows general cycle physiology as context: biology → consequence → interpretation.",
    accent: "129 140 248",
  },
  {
    Icon: BellRing,
    title: "Timing Alerts",
    label: "Heads-up",
    copy:
      "Optional alerts for PMS timing, phase shifts, estimated ovulation-window context, and fertile-window awareness.",
    accent: "251 191 36",
  },
];

const TIMING_SIGNALS = [
  {
    Icon: Clock,
    title: "Conversation timing",
    copy:
      "A big talk can land differently when stress margin is low. MoodMap helps you choose the better window — or keep it shorter.",
  },
  {
    Icon: HeartHandshake,
    title: "Support timing",
    copy:
      "Some days need action before questions. The app points you toward the move that reduces load instead of adding more.",
  },
  {
    Icon: Flame,
    title: "Intimacy timing",
    copy:
      "Desire is not a switch. MoodMap gives cycle-aware context for momentum, pressure risk, and when to slow down.",
  },
];

const TRUST_POINTS = [
  {
    title: "Research-informed",
    copy:
      "Built around saved cycle settings, standard cycle-phase modeling, and established menstrual-cycle physiology.",
  },
  {
    title: "Context with variation",
    copy:
      "General cycle patterns can sharpen timing. Sleep, stress, illness, hormonal medication, and life events can still change the day.",
  },
  {
    title: "Private and practical",
    copy:
      "Designed for everyday relationship timing: support, communication, intimacy readiness, PMS, and luteal load.",
  },
];

const FAQ_ITEMS = [
  {
    question: "Is MoodMap for men?",
    answer:
      "MoodMap is designed primarily for men in relationships who want better timing around period, PMS, ovulation context, luteal load, support, communication, and intimacy.",
  },
  {
    question: "Does MoodMap predict her mood?",
    answer:
      "MoodMap gives phase terrain, not certainty. It uses saved cycle settings and research-informed cycle patterns to help you read timing, stress margin, and friction risk more intelligently.",
  },
  {
    question: "How does MoodMap use ovulation and fertile-window awareness?",
    answer:
      "MoodMap includes estimated ovulation-window and fertile-window context as part of cycle-aware relationship timing. It is for awareness, support, intimacy timing, and practical context — not contraception, medical ovulation confirmation, or clinical fertility planning.",
  },
  {
    question: "Is MoodMap medical advice or fertility planning?",
    answer:
      "MoodMap is built for everyday relationship timing and cycle context. It is not a medical device and does not diagnose, treat, cure, or prevent medical conditions. It is not contraception or a clinical fertility-planning tool.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

function StoreButtons({ compact = false }) {
  return (
    <div
      id={compact ? undefined : "download"}
      className={[
        "flex flex-col items-stretch gap-3 sm:flex-row sm:items-center",
        compact ? "mt-7 justify-center" : "mt-8 justify-start",
      ].join(" ")}
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

function SectionLabel({ children, tone = "neutral" }) {
  return (
    <span
      className={[
        "mm-section-label",
        tone === "plan" ? "mm-section-label--plan" : "",
      ].join(" ")}
    >
      {children}
    </span>
  );
}

function AnchorDivider({ variant = "neutral", tight = false }) {
  return (
    <div
      aria-hidden="true"
      className={["mm-anchor-divider", tight ? "my-7 sm:my-8" : "my-12 sm:my-14"].join(" ")}
    >
      <span className={variant === "plan" ? "is-plan" : ""} />
    </div>
  );
}

function HeroProductSurface() {
  const flow = [
    ["01", "Daily Briefing", "Late luteal load can make small friction feel louder."],
    ["02", "SitRep", "Keep the plan simple. Do not make her manage your uncertainty."],
    ["03", "Risk Radar", "Tone debate costs more when the real issue is capacity."],
    ["04", "CommandDeck", "Remove one task, lower the noise, then check in."],
  ];

  return (
    <div className="mm-hero-theatre mm-hero-theatre--focused" aria-label="MoodMap product preview" data-reveal>
      <div className="mm-hero-orbit" aria-hidden="true" />
      <div className="mm-hero-curve" aria-hidden="true">
        <svg viewBox="0 0 620 220" preserveAspectRatio="none">
          <path d="M8 170 C 96 168, 118 92, 188 104 C 270 118, 282 28, 356 46 C 430 64, 440 156, 516 130 C 562 114, 590 78, 616 86" />
          <path d="M8 164 C 106 158, 144 132, 220 136 C 308 140, 356 98, 418 108 C 480 118, 526 154, 616 142" />
        </svg>
      </div>

      <div className="mm-cockpit-object mm-app-surface-object">
        <div className="mm-cockpit-topbar">
          <span>Daily read</span>
          <span>Luteal • Day 23</span>
        </div>

        <div className="mm-cockpit-hero-card mm-app-briefing-card">
          <div className="mm-cockpit-card-header">
            <span className="mm-live-dot">Phase-aware</span>
            <span>Context first</span>
          </div>

          <h2>Read the day before you react to it.</h2>
          <p>
            Same behavior. Different phase. Different outcome. MoodMap turns cycle context into a
            daily read you can actually use.
          </p>

          <div className="mm-phase-strip" aria-hidden="true">
            {[
              ["Period", "18%"],
              ["Follicular", "42%"],
              ["Ovulation", "68%"],
              ["Luteal", "82%"],
              ["PMS", "92%"],
            ].map(([label, left]) => (
              <span key={label} style={{ left }}>
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className="mm-app-flow">
          {flow.map(([index, label, copy]) => (
            <div key={label} className="mm-app-flow-step">
              <span>{index}</span>
              <div>
                <strong>{label}</strong>
                <p>{copy}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductProof() {
  return (
    <section id="product" className="px-6 pb-14 sm:pb-16">
      <div className="mx-auto max-w-7xl">
        <div className="mm-read-system" data-reveal>
          <div className="mm-read-system__intro">
            <SectionLabel>Daily read</SectionLabel>
            <h2 className="mt-5 max-w-3xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl md:text-5xl">
              One daily read. Four practical moves.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed sm:text-lg">
              MoodMap turns phase terrain into a compact system: what changed, what matters, what trap to avoid, and what move to make.
            </p>
          </div>

          <div className="mm-system-map mm-system-map--compact">
            {PRODUCT_STACK.map(({ Icon, title, label, copy, accent }, index) => (
              <article key={title} className="mm-system-layer" style={{ "--mm-accent": accent }}>
                <div className="mm-system-index">0{index + 1}</div>
                <div className="mm-system-icon">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="mm-system-label">{label}</p>
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

function TimingScene() {
  return (
    <section id="how-it-works" className="px-6 pb-14 sm:pb-16">
      <div className="mx-auto max-w-7xl">
        <div className="mm-timing-scene mm-timing-scene--compact" data-reveal>
          <div>
            <SectionLabel>Why timing matters</SectionLabel>
            <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl md:text-5xl">
              Same behavior. Different phase. Different outcome.
            </h2>
            <p className="mt-5 max-w-2xl leading-relaxed text-white/72">
              Cycle context changes the read: what may be easier today, what may be heavier, and
              where a fast reaction can add friction.
            </p>
          </div>

          <div className="mm-before-after">
            <div className="mm-compare-card mm-compare-card--muted">
              <span>Without cycle context</span>
              <p>“Why are you making this a thing?”</p>
              <small>Turns a capacity issue into a debate about tone.</small>
            </div>
            <div className="mm-compare-card mm-compare-card--active">
              <span>With MoodMap</span>
              <p>“I’ll simplify the plan and take one thing off the list.”</p>
              <small>Reads the room, lowers load, and keeps pressure out of it.</small>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {TIMING_SIGNALS.map(({ Icon, title, copy }) => (
            <article key={title} className="mm-signal-card mm-signal-card--lean" data-reveal>
              <span className="mm-signal-icon">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function HormoneGraphScene() {
  const points = [
    ["Standard phase modeling", "Saved cycle settings estimate likely phase terrain for everyday timing context."],
    ["Ovulation-window context", "Energy or openness may rise for some people — useful context, never a promise."],
    ["Luteal and PMS timing", "Stress margin can narrow, so pressure, noise, and ambiguity can cost more."],
    ["Individual variation", "Sleep, stress, illness, hormonal medication, life events, and relationship dynamics still matter."],
  ];

  return (
    <section id="science" className="px-6 pb-14 sm:pb-16">
      <div className="mx-auto max-w-7xl">
        <div className="mm-hormone-scene" data-reveal>
          <div>
            <SectionLabel>Hormone Graph Intelligence</SectionLabel>
            <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl md:text-5xl">
              Biology → consequence → interpretation.
            </h2>
            <p className="mt-5 max-w-xl leading-relaxed text-white/72">
              MoodMap uses saved cycle settings and standard phase modeling to translate established
              menstrual-cycle physiology into timing context: PMS, estimated ovulation-window terrain,
              fertile-window awareness, luteal load, energy, stress margin, and intimacy readiness.
            </p>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/52">
              It is useful context for daily decisions, not medical diagnosis. Individual variation
              remains part of the read.
            </p>
          </div>

          <div className="mm-graph-object" aria-label="Hormone graph intelligence preview">
            <div className="mm-graph-topbar">
              <span>Cycle graph</span>
              <span>General pattern</span>
            </div>
            <svg viewBox="0 0 680 320" role="img" aria-label="Stylized hormone context curves">
              <defs>
                <linearGradient id="estrogenGradient" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor="#34d399" stopOpacity="0.25" />
                  <stop offset="48%" stopColor="#22d3ee" stopOpacity="0.88" />
                  <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.32" />
                </linearGradient>
                <linearGradient id="progesteroneGradient" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor="#818cf8" stopOpacity="0.16" />
                  <stop offset="60%" stopColor="#a78bfa" stopOpacity="0.78" />
                  <stop offset="100%" stopColor="#fb7185" stopOpacity="0.44" />
                </linearGradient>
              </defs>
              <g className="mm-graph-grid">
                <line x1="48" y1="56" x2="632" y2="56" />
                <line x1="48" y1="132" x2="632" y2="132" />
                <line x1="48" y1="208" x2="632" y2="208" />
                <line x1="48" y1="284" x2="632" y2="284" />
              </g>
              <path
                className="mm-graph-path"
                stroke="url(#estrogenGradient)"
                d="M48 245 C110 242 122 202 168 196 C230 188 264 88 326 74 C390 58 416 150 460 166 C520 188 564 166 632 178"
              />
              <path
                className="mm-graph-path mm-graph-path--soft"
                stroke="url(#progesteroneGradient)"
                d="M48 268 C142 268 198 262 250 244 C328 216 356 150 422 118 C502 80 570 142 632 190"
              />
              <path
                className="mm-graph-path mm-graph-path--risk"
                d="M48 278 C124 276 190 264 248 246 C314 226 356 212 416 226 C500 246 562 240 632 204"
              />
              <g className="mm-graph-markers">
                <circle cx="326" cy="74" r="5" />
                <circle cx="422" cy="118" r="5" />
                <circle cx="632" cy="204" r="5" />
              </g>
            </svg>
            <div className="mm-graph-legend mm-graph-legend--five">
              <span>Period</span>
              <span>Follicular</span>
              <span>Ovulation</span>
              <span>Luteal</span>
              <span>PMS</span>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-4">
          {points.map(([title, copy]) => (
            <article key={title} className="mm-hormone-point" data-reveal>
              <Activity className="h-4 w-4" aria-hidden="true" />
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
    <section id="trust" className="px-6 pb-14 sm:pb-16">
      <div className="mx-auto max-w-6xl text-center" data-reveal>
        <div className="inline-flex items-center gap-2 rounded-full bg-white/[0.08] px-4 py-2 text-xs text-white/72 ring-1 ring-white/[0.12] backdrop-blur sm:text-sm">
          <ShieldCheck className="h-4 w-4 opacity-90" aria-hidden="true" />
          Research-informed. Phase-aware. Practical.
        </div>

        <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
          Better timing starts with better context.
        </h2>
        <p className="mx-auto mt-4 max-w-3xl leading-relaxed text-white/72">
          MoodMap is built for men who want cleaner timing with their partner: confident enough to be
          useful, careful enough to stay honest.
        </p>

        <div className="mt-8 grid gap-4 text-left md:grid-cols-3">
          {TRUST_POINTS.map(({ title, copy }) => (
            <article key={title} className="mm-trust-card">
              <MessageCircle className="h-5 w-5 text-white/70" aria-hidden="true" />
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  return (
    <section className="px-6 pb-14 sm:pb-16">
      <div className="mx-auto max-w-5xl" data-reveal>
        <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
          <div>
            <SectionLabel>FAQ</SectionLabel>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
              Clear answers before download.
            </h2>
            <p className="mt-4 leading-relaxed text-white/62">
              Compact answers on men, phase terrain, ovulation-window context, and medical boundaries.
            </p>
          </div>

          <div className="mm-faq-list">
            {FAQ_ITEMS.map((item, index) => (
              <details key={item.question} open={index === 0}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function BottomCta() {
  return (
    <section className="px-6 pt-2 pb-16 text-center sm:pb-20">
      <div className="mx-auto max-w-3xl" data-reveal>
        <AnchorDivider />
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Stop guessing the room. Read the phase first.
        </h2>
        <p className="mt-4 leading-relaxed text-white/75">
          Start with today’s daily cycle briefing.
        </p>
        <StoreButtons compact />
        <p className="mt-6 text-center text-sm text-white/55">
          Better timing. Cleaner support. Fewer preventable mistakes.
        </p>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <ScrollReveal />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="mm-page relative isolate overflow-x-hidden bg-primary-blue text-white">
        <div aria-hidden="true" className="mm-background-field" />
        <div aria-hidden="true" className="mm-grid-field" />

        <section className="mm-hero-section relative px-6 pt-12 pb-14 sm:pt-20 sm:pb-16">
          <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-10">
            <div className="mm-hero-copy relative z-10 max-w-3xl text-center lg:text-left" data-reveal>
              <p className="mm-hero-pill mx-auto lg:mx-0">
                Daily cycle intelligence for men in relationships
              </p>

              <h1 className="mt-6 text-balance text-4xl font-extrabold leading-[0.98] tracking-[-0.045em] sm:text-6xl md:text-7xl">
                Understand the phase before you respond.
              </h1>

              <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-white/76 sm:text-lg lg:text-xl">
                MoodMap uses saved cycle settings and standard cycle-phase modeling to estimate likely
                phase terrain — then turns research-informed cycle physiology into practical guidance
                for timing, support, intimacy, PMS, ovulation context, and luteal load.
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
                {[
                  "Same behavior",
                  "Different phase",
                  "Different outcome",
                ].map((item) => (
                  <span key={item} className="mm-hero-chip">
                    {item}
                  </span>
                ))}
              </div>

              <StoreButtons />

              <p className="mm-hero-trust mt-5 max-w-2xl text-xs leading-relaxed text-white/48 sm:text-sm">
                Cycle context for better timing. Practical guidance, not diagnosis.
              </p>
            </div>

            <HeroProductSurface />
          </div>
        </section>

        <ProductProof />
        <TimingScene />
        <CommandDeckPreview />
        <HormoneGraphScene />
        <TrustSection />
        <FaqSection />
        <BottomCta />
      </div>
    </>
  );
}
