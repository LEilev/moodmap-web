import GuideArticle, { GuideFAQ, GuideProductExample, GuideRelated, GuideSection, GuideStoreLinks, guideStyles as styles } from "../../../components/GuideArticle";
import { PRODUCT } from "../../../lib/product";
import Link from "next/link";
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
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <GuideArticle
        path={SLUG}
        title="Menstrual cycle day by day: an overview for partners"
        lead="A 28-day example grouped into six broad windows, with ways to offer support and make plans together. These dates illustrate one cycle; they are not a schedule of how your partner will feel."
        contents={[
          { href: "#using-the-overview", label: "Using the overview" },
          { href: "#six-windows", label: "The six windows" },
          { href: "#your-cycle", label: "Different cycle lengths" },
          { href: "#questions", label: "Common questions" },
        ]}
      >
        <GuideSection id="using-the-overview" title="Start with the limits of the dates">
          <div className={styles.summary}><p>This page gives six illustrative windows, not 28 individual predictions. Cycle length, bleeding, ovulation timing and symptoms vary.</p></div>
          <p>The first day of bleeding is cycle day one. The windows below do not adapt to a specific person and cannot confirm ovulation. Read <Link href="/learn/menstrual-cycle-phases-for-partners">the four-phase guide</Link> for the biology, then use this overview for practical ideas.</p>
        </GuideSection>
        <GuideSection id="six-windows" title="An illustrative 28-day cycle">
          <div className={styles.phaseGrid}>
            {WINDOWS.map((window) => (
              <div key={window.range} className={styles.phase}>
                <span className={styles.phaseLabel}>{window.range}</span>
                <h3>{window.title}</h3><p>{window.body}</p>
                <ul>{window.moves.map((move) => <li key={move}>{move}</li>)}</ul>
              </div>
            ))}
          </div>
        </GuideSection>
        <GuideProductExample path={SLUG} image="/screenshots/web-2026/cycle-calendar.webp"
          alt="MoodMap Cycle Calendar with cycle dates, estimated windows and a selected day’s luteal context."
          title="Keep the overview connected to today">
          <p>MoodMap’s calendar lets you open the daily context for a selected date. The daily read turns the estimate into practical guidance for your own response.</p>
          <p>{PRODUCT.settingsSummary}</p>
        </GuideProductExample>
        <GuideSection id="your-cycle" title="What changes when the cycle is different?">
          <p>Changing a cycle setting changes a calendar estimate. It does not establish the date of ovulation or make the same day numbers meaningful for everyone. Keep the starting information current when a new period begins.</p>
          <p>{PRODUCT.modelScope} <Link href="/intelligence#model-fit">Read about the model’s fit and limits.</Link></p>
          <p>When the estimate and her actual experience differ, follow her experience. A practical suggestion should help with what is happening today.</p>
        </GuideSection>
        <GuideFAQ items={FAQ} />
        <SourceTrustBlock path={SLUG} />
        <GuideRelated items={[
          { href: "/learn/menstrual-cycle-phases-for-partners", label: "Understand the four phases" },
          { href: "/learn/luteal-phase-relationships", label: "Luteal-phase relationships" },
          { href: "/learn/period-tracking-for-men", label: "Set up cycle context as a partner" },
        ]} />
        <GuideStoreLinks path={SLUG} />
      </GuideArticle>
    </>
  );
}
