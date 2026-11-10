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
  "An illustrative 28-day menstrual cycle grouped into six windows, with practical support ideas for partners and clear limits on calendar predictions.";

export const metadata = {
  title: "Menstrual Cycle Day-by-Day: An Illustrative Overview",
  description: META_DESCRIPTION,
  alternates: { canonical: SLUG },
  openGraph: {
    title: "MoodMap Menstrual Cycle Day-by-Day: An Illustrative Overview",
    description: META_DESCRIPTION,
    url: SLUG,
    type: "article",
    images: [OG_IMAGE_SRC],
  },
  twitter: {
    card: "summary_large_image",
    title: "MoodMap Menstrual Cycle Day-by-Day: An Illustrative Overview",
    description: META_DESCRIPTION,
    images: [OG_IMAGE_SRC],
  },
};

const WINDOWS = [
  {
    range: "Days 1–5",
    title: "Menstruation",
    body: "Bleeding, cramps, or fatigue may make practical comfort useful. Symptoms and period length vary; ask how she is feeling.",
    moves: ["Make food, warmth, and logistics easier.", "Keep talks short unless she opens them.", "Do not confuse quiet with rejection."],
  },
  {
    range: "Days 6–12",
    title: "After bleeding: follicular phase",
    body: "The follicular phase starts on day 1 and continues until ovulation. After bleeding ends, some people feel more energetic. Use the energy she actually has when making plans.",
    moves: ["Bring simple plans and options.", "Use the easier window for practical conversations.", "Match momentum without flooding the room."],
  },
  {
    range: "Days 13–15",
    title: "Illustrative ovulation window",
    body: "Ovulation does not reliably fall on day 14. Some people notice changes in desire or energy around this time, but a calendar cannot confirm ovulation or tell you whether intimacy is wanted.",
    moves: ["Read consent and pace, not just energy.", "Use warmth and presence, not assumptions.", "Keep intimacy responsive, not entitled."],
  },
  {
    range: "Days 16–18",
    title: "Early luteal transition",
    body: "After ovulation, the luteal phase begins. There is no universal change in mood or connection on these particular days. Keep plans flexible and follow through on what you agreed.",
    moves: ["Ask what pace works today.", "Keep follow-through clean.", "Notice when either of you wants more quiet."],
  },
  {
    range: "Days 19–25",
    title: "Later luteal phase",
    body: "For some people, premenstrual symptoms begin in the days or weeks before the next period. Practical help can be useful when symptoms are present, regardless of the date.",
    moves: ["Reduce open loops and practical load.", "Do the thing without announcing it as help.", "Do not chase closure when capacity is tight."],
  },
  {
    range: "Days 26–28",
    title: "Before the next period",
    body: "PMS is not confined to these three days and is not experienced by everyone. If she is uncomfortable, ask what would help; keep valid concerns separate from assumptions about hormones.",
    moves: ["Lower noise, lower pressure, lower stakes.", "Repair lightly and return later if needed.", "Choose warmth, food, space, and clean follow-through."],
  },
];

const FAQ = [
  {
    q: "Is every menstrual cycle exactly 28 days?",
    a: "No. The 28-day structure is a simple map, not a rule. Real cycles vary. This page groups an illustrative cycle into six windows; it does not give 28 individual predictions.",
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
    headline: "Menstrual Cycle Day-by-Day: An Illustrative Overview",
    description: META_DESCRIPTION,
  });
  const breadcrumbSchema = breadcrumbJsonLd([
    { name: "Home", href: "/" },
    { name: "Learn", href: "/learn" },
    { name: "Menstrual cycle day by day for partners", href: SLUG },
  ]);
  const faqSchema = faqJsonLd(FAQ);

  return (
    <main className="mm-guide-article relative isolate bg-primary-blue text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div aria-hidden="true" className="pointer-events-none absolute -left-40 -top-24 h-[34rem] w-[34rem] rounded-full bg-gradient-to-br from-emerald-400/18 to-blue-500/18 blur-[170px] sm:blur-[220px] md:opacity-30 -z-10" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-44 top-28 h-[36rem] w-[36rem] rounded-full bg-gradient-to-tr from-blue-500/18 to-emerald-400/16 blur-[180px] sm:blur-[240px] md:opacity-30 -z-10" />

      <section className="px-6 pt-12 pb-10 sm:pt-16 sm:pb-12">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs sm:text-sm text-white/70 ring-1 ring-white/12 backdrop-blur">
            <CalendarDays className="h-4 w-4 opacity-90" aria-hidden />
            Six windows in an illustrative 28-day cycle
          </div>
          <h1 className="mt-6 text-balance text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
            Menstrual cycle day by day: an overview for partners
          </h1>
          <p className="mt-4 mx-auto max-w-2xl text-pretty text-base sm:text-lg text-white/75 leading-relaxed">
            A 28-day example grouped into six broad windows, with ways to offer support and make plans together. These dates illustrate one cycle; they are not a schedule of how your partner will feel.
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
                  Cycle length, bleeding, ovulation timing, and symptoms vary. The windows below do not adapt to a specific person and cannot confirm ovulation. Start with the four-phase guide for the biology, then use this overview for practical ideas.
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

          <SourceTrustBlock path={SLUG} />

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
