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
import { SAMPLE_GUIDANCE } from "../lib/proofContent";

const APPSTORE_URL =
  "https://apps.apple.com/no/app/moodmap-moodcoaster/id6746102626?l=nb";
const PLAYSTORE_URL =
  "https://play.google.com/store/apps/details?id=com.eilev.moodmapnextgen";

// Matches app deck tint for OPS/PLAN (from cockpitMaterialTokens.js)
const PLAN_TINT = "#22C55E";

function AnchorDivider({ variant = "neutral", tight = false }) {
  const isPlan = variant === "plan";
  const spacing = tight ? "my-7 sm:my-8" : "my-10";

  return (
    <div
      aria-hidden="true"
      className={["mx-auto flex items-center justify-center", spacing].join(" ")}
    >
      <div className="relative h-px w-16 bg-white/15">
        <span
          className={[
            "absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full",
            isPlan
              ? "bg-green-500/80 ring-1 ring-green-500/25"
              : "bg-white/35 ring-1 ring-white/15",
          ].join(" ")}
        />
      </div>
    </div>
  );
}

function StoreButtons({ compact = false }) {
  return (
    <div
      id={compact ? undefined : "download"}
      className={[
        "flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:gap-4",
        compact ? "mt-7" : "mt-7 sm:mt-8",
      ].join(" ")}
    >
      <a href={APPSTORE_URL} className="store-btn">
        <span className="store-btn__icon" aria-hidden="true">
          <FaApple />
        </span>
        Download on the App Store
      </a>

      <a href={PLAYSTORE_URL} className="store-btn">
        <span className="store-btn__icon" aria-hidden="true">
          <FaGooglePlay />
        </span>
        Get it on Google Play
      </a>
    </div>
  );
}

const PRODUCT_STACK = [
  {
    Icon: ClipboardList,
    title: "Daily Briefing",
    label: "Read the day",
    copy:
      "A top-level terrain read for period timing, PMS risk, ovulation momentum, energy, and capacity shifts.",
    accent: "34 197 94",
    isPrimary: true,
  },
  {
    Icon: Brain,
    title: "SitRep",
    label: "Read the room",
    copy:
      "A tactical situational read: what to lean toward, what to avoid, and what may cost more today.",
    accent: "56 189 248",
  },
  {
    Icon: Radar,
    title: "Risk Radar",
    label: "Spot the traps",
    copy:
      "Flags common failure modes before they happen: pressure, debate reflex, bad jokes, ambiguity, and wrong timing.",
    accent: "248 113 113",
  },
  {
    Icon: Map,
    title: "CommandDeck",
    label: "Make the move",
    copy:
      "Turns the read into practical action for support, communication, intimacy, and self-control.",
    accent: "45 212 191",
  },
  {
    Icon: LineChart,
    title: "Hormone Graph Intelligence",
    label: "Biology → consequence",
    copy:
      "Translates general hormone patterns into plain-language context without turning biology into a verdict.",
    accent: "96 165 250",
  },
  {
    Icon: BellRing,
    title: "Timing Alerts",
    label: "Optional heads-up",
    copy:
      "Optional notifications for phase shifts, PMS timing, ovulation context, and fertile-window awareness.",
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
  "Cycle context is context, not a verdict.",
  "Individual variation matters: sleep, stress, illness, contraception, life context, and relationship dynamics still count.",
  "MoodMap is not medical advice, contraception, fertility planning, diagnosis, or therapy.",
];

function HeroBriefingCard() {
  const rows = [
    ["Briefing", "Late luteal load can make small friction feel louder."],
    ["SitRep", "Keep the plan simple. Do not make her manage your uncertainty."],
    ["Risk Radar", "Do not debate tone when the real issue is capacity."],
    ["CommandDeck", "Remove one task, lower the noise, then check in."],
  ];

  return (
    <div className="mx-auto mt-10 max-w-4xl">
      <div className="glass-card mm-sample-card overflow-hidden p-5 text-left sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-white/45">
              Today’s cycle cockpit
            </p>
            <h2 className="mt-2 text-xl font-semibold text-white sm:text-2xl">
              Read timing before you react to behavior.
            </h2>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-100">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
            Phase-aware
          </span>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {rows.map(([label, copy]) => (
            <div
              key={label}
              className="rounded-2xl border border-white/12 bg-black/20 p-4 shadow-sm shadow-black/20"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/40">
                {label}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-white/76 sm:text-[15px]">
                {copy}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-5 text-xs leading-relaxed text-white/48">
          Representative preview. MoodMap uses general cycle patterns and your saved cycle settings;
          it gives context without claiming certainty about anyone’s mood.
        </p>

        <div aria-hidden="true" className="glass-gloss" />
      </div>
    </div>
  );
}

function SampleGuidanceCard() {
  return (
    <article className="glass-card mm-sample-card relative overflow-hidden ring-1 ring-white/25">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-white/0 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(900px 360px at 90% 0%, ${PLAN_TINT}33 0%, transparent 60%)`,
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background: `linear-gradient(to right, transparent, ${PLAN_TINT}CC, transparent)`,
        }}
      />

      <div className="relative p-6 sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span
              className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]"
              style={{
                borderColor: `${PLAN_TINT}66`,
                backgroundColor: `${PLAN_TINT}10`,
                color: "rgba(240,253,244,0.92)",
              }}
            >
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: PLAN_TINT }}
              />
              PLAN
            </span>

            <span className="text-[11px] text-white/55 sm:text-xs">CommandDeck sample</span>
          </div>

          <span className="text-[11px] font-medium text-white/55 sm:text-xs">
            {SAMPLE_GUIDANCE.phase} • Day {SAMPLE_GUIDANCE.day}
          </span>
        </div>

        <h3 className="mt-5 text-xl font-semibold leading-snug tracking-tight text-white sm:text-2xl md:text-[26px]">
          {SAMPLE_GUIDANCE.text}
        </h3>

        <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-white/18 to-transparent" />
      </div>

      <div className="relative border-t border-white/10 bg-gradient-to-b from-white/[0.06] to-black/20 px-6 py-6 sm:px-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 bottom-0 w-px"
          style={{
            background: `linear-gradient(to bottom, transparent, ${PLAN_TINT}66, transparent)`,
          }}
        />

        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/50">
            Why it works
          </p>
          <p className="text-[11px] text-white/35">{SAMPLE_GUIDANCE.why.length} notes</p>
        </div>

        <ul className="mt-4">
          {SAMPLE_GUIDANCE.why.map((bullet, i) => {
            const isPrimary = i === 0;

            return (
              <li
                key={`${SAMPLE_GUIDANCE.id}-${i}`}
                className={["flex gap-3", isPrimary ? "mb-4" : "mb-[11px]"].join(" ")}
              >
                <span className="mt-[0.22em] flex h-5 w-5 items-center justify-center">
                  <span
                    className="flex h-[18px] w-[18px] items-center justify-center rounded-full border"
                    style={{
                      borderColor: `${PLAN_TINT}66`,
                      backgroundColor: `${PLAN_TINT}10`,
                    }}
                  >
                    <span
                      className="h-[7px] w-[7px] rounded-full"
                      style={{ backgroundColor: PLAN_TINT, opacity: isPrimary ? 1 : 0.85 }}
                    />
                  </span>
                </span>

                <span
                  className={[
                    "leading-relaxed",
                    isPrimary
                      ? "text-sm font-medium text-white/85 sm:text-[15px]"
                      : "text-sm text-white/72 sm:text-[15px]",
                  ].join(" ")}
                >
                  {bullet}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <div aria-hidden="true" className="glass-gloss" />
    </article>
  );
}

export default function HomePage() {
  return (
    <main className="relative isolate overflow-x-hidden bg-primary-blue text-white">
      {/* Subtle premium glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 -top-24 -z-10 h-[34rem] w-[34rem] rounded-full bg-gradient-to-br from-emerald-400/20 to-blue-500/20 blur-[160px] sm:blur-[200px] md:opacity-30"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-44 top-28 -z-10 h-[36rem] w-[36rem] rounded-full bg-gradient-to-tr from-blue-500/20 to-emerald-400/18 blur-[170px] sm:blur-[220px] md:opacity-30"
      />

      {/* Hero */}
      <section className="px-6 pt-14 pb-10 text-center sm:pt-20 sm:pb-14">
        <p className="mx-auto inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-semibold tracking-[0.14em] text-white/70 sm:text-[11px]">
          Daily cycle intelligence for men in relationships
        </p>

        <h1 className="mx-auto mt-5 max-w-5xl text-balance text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl">
          <span className="bg-gradient-to-r from-emerald-300 via-emerald-400 to-blue-400 bg-clip-text text-transparent">
            Understand the phase
          </span>{" "}
          <span className="block bg-gradient-to-r from-emerald-300 via-emerald-400 to-blue-400 bg-clip-text text-transparent">
            before you respond.
          </span>
        </h1>

        <p className="mx-auto mt-5 max-w-3xl text-pretty text-base leading-relaxed text-white/76 sm:text-lg">
          MoodMap translates period timing, PMS awareness, ovulation context, luteal-phase friction,
          intimacy timing, and support cues into a daily briefing you can actually use.
        </p>

        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/56">
          Same behavior. Different phase. Different outcome. Read the day before you react to it.
        </p>

        <StoreButtons />

        <p className="mx-auto mt-5 max-w-3xl text-xs leading-relaxed text-white/45">
          Cycle-aware relationship guidance — not medical advice, contraception, fertility planning,
          diagnosis, or therapy.
        </p>

        <HeroBriefingCard />
      </section>

      <AnchorDivider />

      {/* Product stack */}
      <section id="product" className="relative px-6 pb-14 sm:pb-16">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-24 top-14 h-[420px] w-[420px] rounded-full bg-gradient-to-br from-emerald-500/10 via-sky-500/5 to-transparent blur-3xl" />
          <div className="absolute -right-24 bottom-6 h-[360px] w-[360px] rounded-full bg-gradient-to-br from-sky-500/10 via-emerald-500/5 to-transparent blur-3xl" />
        </div>

        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/70 sm:text-[11px]">
              Product stack
            </span>

            <h2 className="mt-4 text-2xl font-semibold sm:text-3xl md:text-4xl">
              A daily cycle-intelligence cockpit — not a soft tip feed.
            </h2>
            <p className="mx-auto mt-4 max-w-3xl leading-relaxed text-white/75">
              MoodMap is built around layers: fast orientation, tactical room read, friction risk,
              action, biology, and optional alerts. The point is better timing — not mind reading.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PRODUCT_STACK.map(({ Icon, title, label, copy, isPrimary, accent }) => (
              <article
                key={title}
                style={{ "--mm-accent": accent }}
                className={[
                  "glass-card glass-card-hover group relative overflow-hidden p-6 text-left ring-1",
                  isPrimary ? "ring-green-500/25" : "ring-white/18",
                ].join(" ")}
              >
                <div aria-hidden="true" className="mm-card-accent" />

                {isPrimary ? (
                  <>
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full blur-3xl"
                      style={{ backgroundColor: `${PLAN_TINT}14` }}
                    />
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-white/0 to-transparent"
                    />
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute left-10 right-10 top-0 h-px"
                      style={{
                        background: `linear-gradient(to right, transparent, ${PLAN_TINT}99, transparent)`,
                      }}
                    />
                  </>
                ) : null}

                <span className="glass-icon transition-transform duration-300 group-hover:scale-[1.03]">
                  <Icon className="h-6 w-6 text-white drop-shadow" aria-hidden="true" />
                </span>

                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/42">
                  {label}
                </p>
                <h3 className="mt-2 text-base font-semibold text-white sm:text-lg">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70 sm:text-[15px]">
                  {copy}
                </p>

                <div aria-hidden="true" className="glass-gloss" />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Timing thesis */}
      <section id="about" className="px-6 pb-14 sm:pb-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-white/45">
                Why timing matters
              </p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
                The same move can land clean — or cost you — depending on the day.
              </h2>
              <p className="mt-4 leading-relaxed text-white/72">
                MoodMap gives cycle-aware context before interpretation: what may be easier today,
                what may be heavier, and where men often add friction by reacting too fast.
              </p>
              <p className="mt-4 leading-relaxed text-white/58">
                It does not tell you who she is. It helps you understand the terrain so your timing,
                tone, pressure, and expectations are less sloppy.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {TIMING_SIGNALS.map(({ Icon, title, copy }) => (
                <article key={title} className="glass-card p-5 text-left">
                  <div className="flex items-start gap-4">
                    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
                      <Icon className="h-5 w-5 text-white" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="font-semibold text-white">{title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-white/68">{copy}</p>
                    </div>
                  </div>
                  <div aria-hidden="true" className="glass-gloss" />
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Single sample */}
      <section className="px-6 pb-14 sm:pb-16">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/70 sm:text-[11px]">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-green-500/90"
                style={{ boxShadow: `0 0 0 6px ${PLAN_TINT}1A` }}
              />
              Sample guidance
            </span>

            <h2 className="mt-4 text-2xl font-semibold sm:text-3xl md:text-4xl">
              The read becomes a move.
            </h2>

            <p className="mx-auto mt-4 max-w-3xl leading-relaxed text-white/70">
              No vague “be supportive” advice. MoodMap compresses cycle context into an action you
              can execute without making her explain everything first.
            </p>
          </div>

          <AnchorDivider variant="plan" tight />

          <div className="mx-auto max-w-[980px]">
            <SampleGuidanceCard />

            <p className="mt-6 text-center text-xs text-white/55 sm:text-sm">
              Daily guidance is phase-aware and framed as context — useful, practical, and non-deterministic.
            </p>
          </div>
        </div>
      </section>

      <CommandDeckPreview />

      {/* Hormone intelligence */}
      <section className="px-6 pb-14 sm:pb-16">
        <div className="mx-auto max-w-6xl">
          <div className="glass-card overflow-hidden p-6 sm:p-8">
            <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-white/45">
                  Hormone Graph Intelligence
                </p>
                <h2 className="mt-3 text-2xl font-semibold leading-tight sm:text-3xl md:text-4xl">
                  Biology → consequence → interpretation.
                </h2>
                <p className="mt-4 leading-relaxed text-white/72">
                  MoodMap does not reduce her to hormones. It uses general cycle physiology as one
                  layer of context: energy, stress margin, intimacy readiness, and friction risk can
                  shift across the cycle.
                </p>
                <p className="mt-4 text-sm leading-relaxed text-white/52">
                  Individual variation still matters. Sleep, stress, illness, contraception, life
                  events, and relationship dynamics can override the pattern.
                </p>
              </div>

              <div className="grid gap-3">
                {[
                  ["Period timing", "Lower capacity can make practical support more valuable than questions."],
                  ["Ovulation context", "Energy or openness may rise for some people — never treat it as a promise."],
                  ["Luteal phase", "Stress margin can narrow, so pressure and ambiguity cost more."],
                  ["PMS awareness", "Small friction can become bigger if you add defensiveness, noise, or debate."],
                ].map(([title, copy]) => (
                  <div key={title} className="rounded-2xl border border-white/12 bg-black/20 p-4">
                    <div className="flex items-start gap-3">
                      <Activity className="mt-0.5 h-4 w-4 shrink-0 text-white/65" aria-hidden="true" />
                      <div>
                        <h3 className="text-sm font-semibold text-white">{title}</h3>
                        <p className="mt-1 text-sm leading-relaxed text-white/66">{copy}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div aria-hidden="true" className="glass-gloss" />
          </div>
        </div>
      </section>

      {/* Trust */}
      <section id="trust" className="px-6 pb-14 sm:pb-16">
        <div className="mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs text-white/70 ring-1 ring-white/12 backdrop-blur sm:text-sm">
            <ShieldCheck className="h-4 w-4 opacity-90" aria-hidden="true" />
            Accurate enough to be useful. Careful enough to stay honest.
          </div>

          <h2 className="mt-5 text-2xl font-semibold sm:text-3xl">
            Built for better reading, not control.
          </h2>
          <p className="mx-auto mt-4 max-w-3xl leading-relaxed text-white/72">
            MoodMap is for men who want better timing with their partner — without stereotypes,
            surveillance, fertility claims, or mind-reading nonsense.
          </p>

          <div className="mt-8 grid gap-4 text-left sm:grid-cols-3">
            {TRUST_POINTS.map((point) => (
              <article key={point} className="glass-card p-5">
                <MessageCircle className="h-5 w-5 text-white/70" aria-hidden="true" />
                <p className="mt-3 text-sm leading-relaxed text-white/72">{point}</p>
                <div aria-hidden="true" className="glass-gloss" />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-6 pt-2 pb-16 text-center sm:pb-20">
        <div className="mx-auto max-w-3xl">
          <AnchorDivider />

          <h2 className="text-2xl font-semibold sm:text-3xl">
            Stop guessing the room. Read the phase first.
          </h2>
          <p className="mt-3 leading-relaxed text-white/75">
            Download MoodMap and start with today’s daily cycle briefing.
          </p>

          <StoreButtons compact />

          <p className="mt-6 text-center text-sm text-white/55">
            Better timing. Cleaner support. Fewer preventable mistakes.
          </p>
        </div>
      </section>
    </main>
  );
}
