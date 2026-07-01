// src/app/page.js
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BellRing,
  Brain,
  CheckCircle2,
  ClipboardList,
  Clock,
  Flame,
  Gauge,
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
import { SAMPLE_GUIDANCE } from "../lib/proofContent";

const APPSTORE_URL =
  "https://apps.apple.com/no/app/moodmap-moodcoaster/id6746102626?l=nb";
const PLAYSTORE_URL =
  "https://play.google.com/store/apps/details?id=com.eilev.moodmapnextgen";

const PLAN_TINT = "#22C55E";

const PRODUCT_STACK = [
  {
    Icon: ClipboardList,
    title: "Daily Briefing",
    label: "Read the day",
    copy:
      "A fast terrain read for period timing, PMS awareness, ovulation context, energy, and capacity shifts.",
    accent: "34 197 94",
  },
  {
    Icon: Brain,
    title: "SitRep",
    label: "Read the room",
    copy:
      "A tactical situational read: what to lean toward, what to avoid, and what costs more today.",
    accent: "56 189 248",
  },
  {
    Icon: Radar,
    title: "Risk Radar",
    label: "Spot the traps",
    copy:
      "Flags common male failure modes before they become the problem: pressure, debate reflex, bad timing, noise, and ambiguity.",
    accent: "248 113 113",
  },
  {
    Icon: Map,
    title: "CommandDeck",
    label: "Make the move",
    copy:
      "Turns the read into practical actions for support, communication, intimacy, and self-control.",
    accent: "45 212 191",
  },
  {
    Icon: LineChart,
    title: "Hormone Graph Intelligence",
    label: "Interpret the pattern",
    copy:
      "Shows general cycle physiology as context: biology → consequence → interpretation, without reducing her to hormones.",
    accent: "129 140 248",
  },
  {
    Icon: BellRing,
    title: "Timing Alerts",
    label: "Get the heads-up",
    copy:
      "Optional alerts for PMS timing, ovulation context, phase shifts, and fertile-window awareness — framed as context, not surveillance.",
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
    title: "Context, not verdict",
    copy:
      "Cycle context can explain timing and stress margin. It does not tell you who she is or guarantee how she feels.",
  },
  {
    title: "Variation matters",
    copy:
      "Sleep, stress, illness, contraception, life events, and relationship dynamics can override general cycle patterns.",
  },
  {
    title: "Store-safe by design",
    copy:
      "MoodMap is not medical advice, contraception, fertility planning, diagnosis, therapy, or mood prediction.",
  },
];

const FAQ_ITEMS = [
  {
    question: "Is MoodMap a period tracker for partners?",
    answer:
      "MoodMap uses saved cycle settings to give cycle-aware relationship guidance for partners. It is closer to a daily cycle-intelligence briefing than a traditional period tracker.",
  },
  {
    question: "Is MoodMap for men?",
    answer:
      "Yes. MoodMap is built for men in relationships who want better timing around period, PMS, ovulation, luteal phase, support, communication, and intimacy context.",
  },
  {
    question: "Does MoodMap predict her mood?",
    answer:
      "No. MoodMap does not claim to know how she feels. It uses general menstrual-cycle patterns as context so you can interpret timing, stress margin, and friction risk more carefully.",
  },
  {
    question: "Is MoodMap medical advice or fertility planning?",
    answer:
      "No. MoodMap is not medical advice, contraception, fertility planning, diagnosis, or therapy. It is cycle-aware relationship guidance and timing context.",
  },
  {
    question: "How does MoodMap use PMS, ovulation, and luteal timing?",
    answer:
      "MoodMap translates PMS timing, ovulation context, luteal-phase friction, period timing, hormone graph patterns, and support cues into practical daily guidance.",
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
      <a href={APPSTORE_URL} className="store-btn">
        <span className="store-btn__icon" aria-hidden="true">
          <FaApple />
        </span>
        <span>Download on the App Store</span>
      </a>

      <a href={PLAYSTORE_URL} className="store-btn">
        <span className="store-btn__icon" aria-hidden="true">
          <FaGooglePlay />
        </span>
        <span>Get it on Google Play</span>
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

function HeroProductTheatre() {
  const cockpitRows = [
    ["Briefing", "Late luteal load can make small friction feel louder."],
    ["SitRep", "Keep the plan simple. Do not make her manage your uncertainty."],
    ["Risk Radar", "Do not debate tone when the real issue is capacity."],
    ["CommandDeck", "Remove one task, lower the noise, then check in."],
  ];

  return (
    <div className="mm-hero-theatre" aria-label="MoodMap product preview" data-reveal>
      <div className="mm-hero-orbit" aria-hidden="true" />
      <div className="mm-hero-curve" aria-hidden="true">
        <svg viewBox="0 0 620 220" preserveAspectRatio="none">
          <path d="M8 170 C 96 168, 118 92, 188 104 C 270 118, 282 28, 356 46 C 430 64, 440 156, 516 130 C 562 114, 590 78, 616 86" />
          <path d="M8 164 C 106 158, 144 132, 220 136 C 308 140, 356 98, 418 108 C 480 118, 526 154, 616 142" />
        </svg>
      </div>

      <div className="mm-cockpit-object">
        <div className="mm-cockpit-topbar">
          <span>Cycle cockpit</span>
          <span>Luteal • Day 23</span>
        </div>

        <div className="mm-cockpit-hero-card">
          <div className="mm-cockpit-card-header">
            <span className="mm-live-dot">Phase-aware</span>
            <span>Context, not verdict</span>
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

        <div className="mm-cockpit-grid">
          {cockpitRows.map(([label, copy]) => (
            <div key={label} className="mm-cockpit-tile">
              <span>{label}</span>
              <p>{copy}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mm-floating-panel mm-floating-panel--left" aria-hidden="true">
        <span>Risk Radar</span>
        <p>Pressure + ambiguity cost more today.</p>
      </div>
      <div className="mm-floating-panel mm-floating-panel--right" aria-hidden="true">
        <span>CommandDeck</span>
        <p>Lower the load. Shorten the ask.</p>
      </div>
    </div>
  );
}

function ProductArchitecture() {
  return (
    <section id="product" className="px-6 pb-16 sm:pb-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div data-reveal>
            <SectionLabel>Product stack</SectionLabel>
            <h2 className="mt-5 max-w-2xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl md:text-5xl">
              A daily cycle-intelligence cockpit — not another soft tip feed.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/72 sm:text-lg">
              MoodMap is built as a layered product system: orientation, tactical read, friction
              prevention, practical action, biology context, and optional timing alerts.
            </p>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/52 sm:text-base">
              The point is better timing with your partner — not mind reading, surveillance, or
              pretending hormones explain everything.
            </p>
          </div>

          <div className="mm-system-map" data-reveal>
            <div className="mm-system-map__rail" aria-hidden="true" />
            {PRODUCT_STACK.map(({ Icon, title, label, copy, accent }, index) => (
              <article
                key={title}
                className="mm-system-layer"
                style={{ "--mm-accent": accent }}
              >
                <div className="mm-system-index">0{index + 1}</div>
                <div className="mm-system-icon">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/38">
                    {label}
                  </p>
                  <h3 className="mt-1 text-base font-semibold text-white sm:text-lg">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-white/66">{copy}</p>
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
    <section id="about" className="px-6 pb-16 sm:pb-20">
      <div className="mx-auto max-w-7xl">
        <div className="mm-timing-scene" data-reveal>
          <div>
            <SectionLabel>Why timing matters</SectionLabel>
            <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl md:text-5xl">
              The same move can land clean — or cost you — depending on the day.
            </h2>
            <p className="mt-5 max-w-2xl leading-relaxed text-white/72">
              MoodMap gives cycle-aware context before interpretation: what may be easier today,
              what may be heavier, and where men often add friction by reacting too fast.
            </p>
          </div>

          <div className="mm-before-after">
            <div className="mm-compare-card mm-compare-card--muted">
              <span>Without context</span>
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

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {TIMING_SIGNALS.map(({ Icon, title, copy }) => (
            <article key={title} className="mm-signal-card" data-reveal>
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

function SampleGuidanceCard() {
  return (
    <article className="mm-guidance-object" data-reveal>
      <div className="mm-guidance-header">
        <div className="flex items-center gap-3">
          <span className="mm-plan-pill">Plan</span>
          <span>CommandDeck sample</span>
        </div>
        <span>
          {SAMPLE_GUIDANCE.phase} • Day {SAMPLE_GUIDANCE.day}
        </span>
      </div>

      <div className="mm-guidance-body">
        <h3>{SAMPLE_GUIDANCE.text}</h3>
        <p>
          The move is deliberately small: reduce one friction point before you ask for emotional
          reporting.
        </p>
      </div>

      <div className="mm-guidance-notes">
        <div className="mm-guidance-notes__top">
          <span>Why it works</span>
          <span>{SAMPLE_GUIDANCE.why.length} notes</span>
        </div>
        <ul>
          {SAMPLE_GUIDANCE.why.map((bullet, index) => (
            <li key={`${SAMPLE_GUIDANCE.id}-${index}`}>
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function SampleSection() {
  return (
    <section className="px-6 pb-16 sm:pb-20">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center" data-reveal>
          <SectionLabel tone="plan">Sample guidance</SectionLabel>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
            The read becomes a move.
          </h2>
          <p className="mx-auto mt-4 max-w-3xl leading-relaxed text-white/70">
            No vague “be supportive” advice. MoodMap compresses cycle context into a practical
            action without making her explain everything first.
          </p>
        </div>

        <AnchorDivider variant="plan" tight />
        <SampleGuidanceCard />

        <p className="mx-auto mt-6 max-w-3xl text-center text-xs leading-relaxed text-white/52 sm:text-sm">
          Daily guidance is phase-aware and framed as context — useful, practical, and non-deterministic.
        </p>
      </div>
    </section>
  );
}

function HormoneGraphScene() {
  const points = [
    ["Period timing", "Lower capacity can make practical support more valuable than questions."],
    ["Ovulation context", "Energy or openness may rise for some people — never treat it as a promise."],
    ["Luteal phase", "Stress margin can narrow, so pressure and ambiguity cost more."],
    ["PMS awareness", "Small friction can become bigger if you add defensiveness, noise, or debate."],
  ];

  return (
    <section className="px-6 pb-16 sm:pb-20">
      <div className="mx-auto max-w-7xl">
        <div className="mm-hormone-scene" data-reveal>
          <div>
            <SectionLabel>Hormone Graph Intelligence</SectionLabel>
            <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl md:text-5xl">
              Biology → consequence → interpretation.
            </h2>
            <p className="mt-5 max-w-xl leading-relaxed text-white/72">
              MoodMap does not reduce her to hormones. It uses general cycle physiology as one layer
              of context: energy, stress margin, intimacy readiness, and friction risk can shift
              across the cycle.
            </p>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/52">
              Individual variation still matters. Sleep, stress, illness, contraception, life events,
              and relationship dynamics can override the pattern.
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
                  <stop offset="48%" stopColor="#22d3ee" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.35" />
                </linearGradient>
                <linearGradient id="progesteroneGradient" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor="#818cf8" stopOpacity="0.18" />
                  <stop offset="60%" stopColor="#a78bfa" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#fb7185" stopOpacity="0.55" />
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
            <div className="mm-graph-legend">
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
    <section id="trust" className="px-6 pb-16 sm:pb-20">
      <div className="mx-auto max-w-6xl text-center" data-reveal>
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs text-white/72 ring-1 ring-white/14 backdrop-blur sm:text-sm">
          <ShieldCheck className="h-4 w-4 opacity-90" aria-hidden="true" />
          Accurate enough to be useful. Careful enough to stay honest.
        </div>

        <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
          Built for better reading, not control.
        </h2>
        <p className="mx-auto mt-4 max-w-3xl leading-relaxed text-white/72">
          MoodMap is for men who want better timing with their partner — without stereotypes,
          surveillance, fertility claims, or mind-reading nonsense.
        </p>

        <div className="mt-9 grid gap-4 text-left md:grid-cols-3">
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
    <section className="px-6 pb-16 sm:pb-20">
      <div className="mx-auto max-w-5xl" data-reveal>
        <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
          <div>
            <SectionLabel>FAQ</SectionLabel>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
              Clear answers before download.
            </h2>
            <p className="mt-4 leading-relaxed text-white/62">
              Compact review-safe answers for men searching for a period app, PMS guide, cycle app,
              or menstrual-cycle guide for partners.
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
          Download MoodMap and start with today’s daily cycle briefing.
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

        <section className="relative px-6 pt-12 pb-16 sm:pt-20 sm:pb-20">
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-10">
            <div className="relative z-10 max-w-3xl text-center lg:text-left" data-reveal>
              <p className="mm-hero-pill mx-auto lg:mx-0">
                Daily cycle intelligence for men in relationships
              </p>

              <h1 className="mt-6 text-balance text-4xl font-extrabold leading-[0.98] tracking-[-0.045em] sm:text-6xl md:text-7xl">
                Understand the phase before you respond.
              </h1>

              <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-white/76 sm:text-lg lg:text-xl">
                MoodMap translates period timing, PMS awareness, ovulation context, luteal-phase
                friction, intimacy timing, and support cues into a daily briefing you can actually use.
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

              <p className="mt-5 max-w-2xl text-xs leading-relaxed text-white/45 sm:text-sm">
                Cycle-aware relationship guidance — not medical advice, contraception, fertility
                planning, diagnosis, therapy, surveillance, or mood prediction.
              </p>
            </div>

            <HeroProductTheatre />
          </div>
        </section>

        <ProductArchitecture />
        <TimingScene />
        <SampleSection />
        <CommandDeckPreview />
        <HormoneGraphScene />
        <TrustSection />
        <FaqSection />
        <BottomCta />
      </div>
    </>
  );
}
