import Link from "next/link";
import { CalendarDays, Compass, HeartHandshake, Shield, Sparkles } from "lucide-react";
import {
  OG_IMAGE_SRC,
  SourceTrustBlock,
  articleJsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
} from "../../seo";

const SLUG = "/learn/menstrual-cycle-day-by-day-for-partners";
const META_DESCRIPTION =
  "A day-by-day menstrual cycle guide for partners, mapping support, conversation, restraint, and intimacy timing across a typical 28-day cycle.";

export const metadata = {
  title: "Menstrual Cycle Day-by-Day Guide for Partners",
  description: META_DESCRIPTION,
  alternates: { canonical: SLUG },
  openGraph: {
    title: "MoodMap Menstrual Cycle Day-by-Day Guide for Partners",
    description: META_DESCRIPTION,
    url: SLUG,
    type: "article",
    images: [OG_IMAGE_SRC],
  },
  twitter: {
    card: "summary_large_image",
    title: "MoodMap Menstrual Cycle Day-by-Day Guide for Partners",
    description: META_DESCRIPTION,
    images: [OG_IMAGE_SRC],
  },
};

const WINDOWS = [
  {
    range: "Days 1–5",
    title: "Menstruation reset",
    body: "Lower reserve, bleeding, cramps, fatigue, and repair demand can make pressure cost more. Practical support usually beats analysis.",
    moves: ["Make food, warmth, and logistics easier.", "Keep talks short unless she opens them.", "Do not confuse quiet with rejection."],
  },
  {
    range: "Days 6–12",
    title: "Follicular rise",
    body: "Energy and outward momentum may lift as the body moves out of reset. This can be a cleaner window for plans, light repair, and forward movement.",
    moves: ["Bring simple plans and options.", "Use the easier window for practical conversations.", "Match momentum without flooding the room."],
  },
  {
    range: "Days 13–15",
    title: "Ovulation window",
    body: "For some, connection, confidence, social energy, and responsiveness can be stronger. It still does not create permission or certainty.",
    moves: ["Read consent and pace, not just energy.", "Use warmth and presence, not assumptions.", "Keep intimacy responsive, not entitled."],
  },
  {
    range: "Days 16–18",
    title: "High connection / transition",
    body: "The post-ovulation shift can still carry connection, but the system may start moving toward more internal pacing and recovery demand.",
    moves: ["Do not overharvest a good window.", "Keep follow-through clean.", "Notice when the room starts asking for less noise."],
  },
  {
    range: "Days 19–25",
    title: "Luteal load",
    body: "Progesterone-led pacing can make complexity, clutter, unresolved tasks, and emotional demand feel denser. Reliability matters more than performance.",
    moves: ["Reduce open loops and practical load.", "Do the thing without announcing it as help.", "Do not chase closure when capacity is tight."],
  },
  {
    range: "Days 26–28",
    title: "PMS soft landing",
    body: "Falling hormones and lower stress buffer can make tone, ambiguity, and pressure land harder. The cleaner move is often less intensity, not more explaining.",
    moves: ["Lower noise, lower pressure, lower stakes.", "Repair lightly and return later if needed.", "Choose warmth, food, space, and clean follow-through."],
  },
];

const FAQ = [
  {
    q: "Is every menstrual cycle exactly 28 days?",
    a: "No. The 28-day structure is a simple map, not a rule. Real cycles vary. Use the day-by-day guide as timing context, not a script.",
  },
  {
    q: "Can a boyfriend use a day-by-day cycle guide respectfully?",
    a: "Yes, if it stays private, supportive, and non-controlling. The goal is to reduce pressure and choose better timing, not monitor or judge her.",
  },
  {
    q: "Does this predict mood by cycle day?",
    a: "No. Cycle day does not determine mood. It can provide background context around capacity, stress sensitivity, recovery demand, and timing.",
  },
  {
    q: "Where does MoodMap fit?",
    a: "MoodMap turns this kind of cycle context into one daily relationship-timing read: support, conversation, restraint, and intimacy context before he moves.",
  },
];

export default function MenstrualCycleDayByDayPage() {
  const articleSchema = articleJsonLd({
    path: SLUG,
    headline: "Menstrual Cycle Day-by-Day Guide for Partners",
    description: META_DESCRIPTION,
  });
  const breadcrumbSchema = breadcrumbJsonLd([
    { name: "Home", href: "/" },
    { name: "Learn", href: "/learn" },
    { name: "Menstrual cycle day by day for partners", href: SLUG },
  ]);
  const faqSchema = faqJsonLd(FAQ);

  return (
    <main className="relative isolate bg-primary-blue text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div aria-hidden="true" className="pointer-events-none absolute -left-40 -top-24 h-[34rem] w-[34rem] rounded-full bg-gradient-to-br from-emerald-400/18 to-blue-500/18 blur-[170px] sm:blur-[220px] md:opacity-30 -z-10" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-44 top-28 h-[36rem] w-[36rem] rounded-full bg-gradient-to-tr from-blue-500/18 to-emerald-400/16 blur-[180px] sm:blur-[240px] md:opacity-30 -z-10" />

      <section className="px-6 pt-12 pb-10 sm:pt-16 sm:pb-12">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs sm:text-sm text-white/70 ring-1 ring-white/12 backdrop-blur">
            <CalendarDays className="h-4 w-4 opacity-90" aria-hidden />
            Day-by-day cycle context
          </div>
          <h1 className="mt-6 text-balance text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
            Menstrual cycle day by day for partners
          </h1>
          <p className="mt-4 mx-auto max-w-2xl text-pretty text-base sm:text-lg text-white/75 leading-relaxed">
            A practical timing map for partners: what may cost more, what may land cleaner, and how support, conversation, restraint, and intimacy can shift across the cycle.
          </p>
        </div>
      </section>

      <section className="px-6 pb-16">
        <div className="mx-auto grid max-w-5xl gap-6">
          <article className="glass-card p-6 sm:p-7 text-left">
            <div className="flex items-start gap-4">
              <span className="glass-icon"><Shield className="h-6 w-6 text-white" aria-hidden /></span>
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold">Use this as context, not a script</h2>
                <p className="mt-2 text-white/75 leading-relaxed">
                  Not every cycle is 28 days. Not every woman feels the same pattern. The value is not prediction — it is helping a partner choose a cleaner hour, lower pressure, and better support.
                </p>
              </div>
            </div>
          </article>

          <div className="grid gap-4">
            {WINDOWS.map((window) => (
              <article key={window.range} className="glass-card p-5 sm:p-6 text-left">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="max-w-2xl">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-100/65">{window.range}</p>
                    <h2 className="mt-2 text-xl font-semibold text-white">{window.title}</h2>
                    <p className="mt-2 text-sm sm:text-base leading-relaxed text-white/72">{window.body}</p>
                  </div>
                  <ul className="grid gap-2 md:max-w-sm">
                    {window.moves.map((move) => (
                      <li key={move} className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/68">
                        {move}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>

          <section className="grid gap-4 md:grid-cols-2" aria-label="Day-by-day cycle guide questions">
            {FAQ.map(({ q, a }) => (
              <article key={q} className="glass-card p-5 text-left">
                <h2 className="text-base font-semibold text-white">{q}</h2>
                <p className="mt-2 text-sm leading-relaxed text-white/68">{a}</p>
              </article>
            ))}
          </section>

          <SourceTrustBlock />

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/intelligence" className="btn-primary inline-flex items-center gap-2">
              <Sparkles className="h-4 w-4" aria-hidden />
              Explore Intelligence
            </Link>
            <Link href="/learn/luteal-phase-relationships" className="mm-link inline-flex items-center gap-2 text-sm text-white/76">
              <Compass className="h-4 w-4" aria-hidden />
              Luteal phase relationships →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
