// app/partner/page.js
import Link from "next/link";

const PARTNER_PORTAL_URL = "https://moodmap.promotekit.com";

export const metadata = {
  title: "Partner Program — MoodMap",
  description:
    "Join the MoodMap Partner Program. Earn 50% recurring revenue share — lifetime — for every subscriber attributed to your link.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

function Chip({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/80">
      {children}
    </span>
  );
}

function Section({ id, title, subtitle, children }) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] backdrop-blur md:p-10">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-white md:text-2xl">
            {title}
          </h2>
          {subtitle ? (
            <p className="max-w-3xl text-sm leading-relaxed text-white/70 md:text-base">
              {subtitle}
            </p>
          ) : null}
        </div>

        <div className="mt-6 md:mt-8">{children}</div>
      </div>
    </section>
  );
}

function Card({ title, children }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] backdrop-blur">
      <h3 className="text-base font-semibold text-white">{title}</h3>
      <div className="mt-2 text-sm leading-relaxed text-white/70">
        {children}
      </div>
    </div>
  );
}

function CheckList({ items }) {
  return (
    <ul className="mt-3 space-y-2 text-sm leading-relaxed text-white/70">
      {items.map((t) => (
        <li key={t} className="flex gap-2">
          <span className="mt-[3px] inline-flex h-4 w-4 flex-none items-center justify-center rounded-full border border-white/10 bg-white/5 text-[10px] text-white/80">
            ✓
          </span>
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

export default function PartnerPage() {
  return (
    <main className="relative overflow-hidden bg-[#070A12] text-white">
      {/* Background glow */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-260px] h-[620px] w-[900px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute left-1/2 top-[120px] h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 pb-16 pt-14 md:pb-24 md:pt-20">
        {/* Hero */}
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-balance text-4xl font-semibold tracking-tight text-emerald-300 md:text-6xl">
            Built for him. Better for both of you.
          </h1>

          <p className="mt-5 text-pretty text-base leading-relaxed text-white/75 md:text-lg">
            MoodMap turns cycle physiology into practical relationship context —
            delivered as a short daily briefing that helps him show up better{" "}
            <span className="text-white">today</span>.
          </p>

          <p className="mx-auto mt-4 max-w-2xl text-pretty text-sm leading-relaxed text-white/80 md:text-base">
            <span className="font-semibold text-white">
              Partners earn 50% recurring revenue share — lifetime.
            </span>{" "}
            You get paid every billing cycle{" "}
            <span className="text-white">
              for as long as the subscriber remains active
            </span>{" "}
            (attributed to your link).
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <Chip>Premium product</Chip>
            <Chip>Science‑informed</Chip>
            <Chip>Fertility‑aware timing</Chip>
            <Chip>Relationship‑first</Chip>
            <Chip>50% recurring (lifetime)</Chip>
            <Chip>Tracked via Partner Portal (PromoteKit)</Chip>
          </div>

          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={PARTNER_PORTAL_URL}
              className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-emerald-400 to-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/10 transition hover:opacity-95 sm:w-auto"
            >
              Join the Partner Program
            </a>

            <Link
              href="#details"
              className="inline-flex w-full items-center justify-center rounded-full border border-white/12 bg-white/5 px-6 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/8 sm:w-auto"
            >
              See details first
            </Link>
          </div>

          <p className="mt-3 text-xs text-white/50">
            Private page (not in navigation, not indexed).
          </p>
        </div>

        {/* Above-the-fold 3 cards */}
        <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-4 md:mt-14 md:grid-cols-3">
          <Card title="A real upgrade for couples">
            MoodMap helps couples avoid misreads by giving him the right context
            at the right time — clearer timing, better communication, fewer
            unnecessary conflicts.
          </Card>

          <Card title="50% recurring — lifetime">
            Earn <span className="text-white">50% of subscription revenue</span>{" "}
            from every subscriber attributed to your link —{" "}
            <span className="text-white">each billing cycle</span>, for as long
            as they stay subscribed.
          </Card>

          <Card title="Clean tracking, transparent payouts">
            You’ll get your own tracked link + dashboard through the partner
            portal (PromoteKit), with signups and subscriptions shown in real
            time.
          </Card>
        </div>

        {/* Details */}
        <div className="mt-10 space-y-6 md:mt-12 md:space-y-8">
          <Section
            id="details"
            title="What you’re promoting"
            subtitle="A premium daily briefing that translates cycle timing into relationship context — so you know what matters today."
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <h3 className="text-sm font-semibold text-white">For him</h3>
                <CheckList
                  items={[
                    "Fewer misreads, better timing",
                    "Clear “what matters today” context",
                    "Practical language for communication",
                    "Less guessing, more confidence",
                  ]}
                />
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <h3 className="text-sm font-semibold text-white">For her</h3>
                <CheckList
                  items={[
                    "Feeling understood (without explaining everything)",
                    "Better emotional timing and support",
                    "Less friction from “wrong moment” conversations",
                    "More empathy in daily life",
                  ]}
                />
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <h3 className="text-sm font-semibold text-white">
                  For the relationship
                </h3>
                <CheckList
                  items={[
                    "Fewer unnecessary conflicts",
                    "More alignment and closeness",
                    "Better conversations, better outcomes",
                    "A calmer baseline over time",
                  ]}
                />
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm leading-relaxed text-white/75 backdrop-blur">
              <span className="font-semibold text-white">
                He uses it — she feels it.
              </span>{" "}
              MoodMap is designed for men, but the payoff is shared: more
              empathy, better timing, and fewer avoidable misreads.
            </div>
          </Section>

          {/* Updated Trust & Science */}
          <Section
            title="Trust & science"
            subtitle="Grounded in reproductive endocrinology — translated into practical, relationship‑first context. Clear about uncertainty."
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm leading-relaxed text-white/75 backdrop-blur">
                <p>
                  MoodMap is informed by{" "}
                  <span className="text-white">
                    reproductive endocrinology, neuroendocrinology, and
                    psychophysiology
                  </span>
                  , using the canonical phase model{" "}
                  <span className="text-white">
                    (follicular → ovulatory → luteal → menstrual)
                  </span>{" "}
                  plus{" "}
                  <span className="text-white">
                    fertility‑aware timing (fertile window + ovulation
                    estimates)
                  </span>{" "}
                  used across modern cycle and fertility education.
                </p>

                <p className="mt-3">
                  Then we translate that biology through{" "}
                  <span className="text-white">
                    behavioral psychology and relationship science
                  </span>{" "}
                  into a short daily context briefing — practical, respectful,
                  and immediately usable.
                </p>

                <p className="mt-3">
                  Cycles vary. Ovulation is an{" "}
                  <span className="text-white">estimate</span>, not a timestamp.
                  MoodMap models timing as{" "}
                  <span className="text-white">windows</span>, not certainties —
                  and focuses on what to do{" "}
                  <span className="text-white">today</span>, without pretending
                  to predict a body with perfect precision.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm leading-relaxed text-white/75 backdrop-blur">
                <p className="font-semibold text-white">
                  What this means in practice
                </p>
                <CheckList
                  items={[
                    "Phase + fertile‑window awareness (without chart obsession)",
                    "Better timing for conversations, support, and intimacy",
                    "Actionable daily briefings (quick to read, easy to share)",
                    "Premium tone: practical, respectful, non‑moralizing",
                  ]}
                />
                <p className="mt-4 text-xs text-white/55">
                  Educational tool — not medical advice or a contraceptive
                  method. Timing is modeled as estimates and windows.
                </p>
              </div>
            </div>
          </Section>

          {/* Updated Best-fit */}
          <Section
            title="Best‑fit creators & audiences"
            subtitle="Relationship content, couples content, and cycle education — positioned for a premium, practical audience."
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <h3 className="text-sm font-semibold text-white">Where it wins</h3>
                <CheckList
                  items={[
                    "Relationship, dating, and communication creators (men, women, or couples)",
                    "Women’s health / cycle educators who want a partner‑friendly framing",
                    "Men’s lifestyle / self‑improvement with a relationship audience",
                    "Couples creators focused on practical tools and dynamics",
                    "Audiences 25–45: committed relationships, dating seriously, or married",
                  ]}
                />
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <h3 className="text-sm font-semibold text-white">
                  Not the best fit if
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">
                  Your content requires you to provide clinical guidance,
                  diagnosis, or treatment recommendations. MoodMap is a consumer
                  product built for everyday context — not a substitute for
                  medical care.
                </p>
                <p className="mt-4 text-sm leading-relaxed text-white/70">
                  Creators who frame cycle timing as{" "}
                  <span className="text-white">context</span> (not blame) tend to
                  perform best.
                </p>
              </div>
            </div>
          </Section>

          {/* How it works (unchanged) */}
          <Section
            title="How it works"
            subtitle="Simple flow. Clean attribution. Transparent payouts."
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <p className="text-xs font-semibold text-white/60">1) Join</p>
                <h3 className="mt-2 text-sm font-semibold text-white">
                  Apply in the partner portal
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">
                  Join via PromoteKit (free). Setup takes minutes.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <p className="text-xs font-semibold text-white/60">
                  2) Get your link
                </p>
                <h3 className="mt-2 text-sm font-semibold text-white">
                  Use it anywhere
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">
                  You’ll get a tracked link you can use in content, newsletters,
                  or your bio.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <p className="text-xs font-semibold text-white/60">3) Earn</p>
                <h3 className="mt-2 text-sm font-semibold text-white">
                  50% recurring revenue share — lifetime
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">
                  Earn <span className="text-white">50% recurring</span>{" "}
                  subscription revenue for every subscriber attributed to your
                  link — <span className="text-white">every billing cycle</span>
                  , for as long as they remain subscribed.
                </p>
              </div>
            </div>
          </Section>

          {/* Updated Creator quick start */}
          <Section
            title="Creator quick start"
            subtitle="Creator‑ready angles + a copy‑paste script you can use today."
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <h3 className="text-sm font-semibold text-white">Angles that work</h3>
                <ul className="mt-3 space-y-2 text-sm leading-relaxed text-white/70">
                  <li>
                    <span className="text-white">“The wrong day” problem.</span>{" "}
                    Same conversation, different day → totally different outcome.
                    Timing is leverage.
                  </li>
                  <li>
                    <span className="text-white">“He uses it — she feels it.”</span>{" "}
                    A small daily habit that changes how he shows up.
                  </li>
                  <li>
                    <span className="text-white">Fertility‑aware, relationship‑first.</span>{" "}
                    Phase timing + fertile window / ovulation estimates — translated into what
                    matters today.
                  </li>
                </ul>

                <p className="mt-4 text-xs text-white/55">
                  More assets and tracking are available in the partner portal.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <h3 className="text-sm font-semibold text-white">
                  Copy‑paste story script
                </h3>
                <div className="mt-3 rounded-xl border border-white/10 bg-black/20 p-4 text-sm leading-relaxed text-white/75">
                  <p>
                    I’ve been testing MoodMap — it’s a premium app that gives a
                    short daily “context briefing” based on cycle timing, so you
                    don’t misread the moment.
                  </p>
                  <p className="mt-3">
                    It’s fertility‑aware (phase timing + fertile window / ovulation
                    estimates), but honest about variability — timing is modeled
                    as windows, not certainties.
                  </p>
                  <p className="mt-3">
                    If you’re in a relationship and want things to feel easier,
                    check it out.
                  </p>
                </div>
              </div>
            </div>
          </Section>
        </div>

        {/* Final CTA */}
        <div className="mx-auto mt-10 max-w-3xl text-center md:mt-12">
          <a
            href={PARTNER_PORTAL_URL}
            className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-emerald-400 to-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/10 transition hover:opacity-95 sm:w-auto"
          >
            Join the Partner Program
          </a>

          <p className="mt-4 text-sm text-white/65">
            Questions?{" "}
            <a
              href="mailto:support@moodmap-app.com"
              className="underline decoration-white/20 underline-offset-4 hover:decoration-white/40"
            >
              Contact us
            </a>{" "}
            (support@moodmap-app.com).
          </p>
        </div>
      </div>
    </main>
  );
}
