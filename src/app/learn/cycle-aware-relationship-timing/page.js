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

const SLUG = "/learn/cycle-aware-relationship-timing";
const META_DESCRIPTION =
  "Learn how cycle-aware relationship timing uses menstrual-cycle context to choose better support, conversations, restraint, and intimacy pacing.";

export const metadata = {
  title: "Cycle-Aware Relationship Timing for Partners",
  description: META_DESCRIPTION,
  alternates: {
    canonical: SLUG,
  },
  openGraph: {
    title: "MoodMap Cycle-Aware Relationship Timing for Partners",
    description: META_DESCRIPTION,
    url: SLUG,
    type: "article",
    images: [OG_IMAGE_SRC],
  },
  twitter: {
    card: "summary_large_image",
    title: "MoodMap Cycle-Aware Relationship Timing for Partners",
    description: META_DESCRIPTION,
    images: [OG_IMAGE_SRC],
  },
};

const PRINCIPLES = [
  {
    title: "Timing is part of the message",
    body: "A valid topic can still be opened at the wrong hour. Cycle-aware timing helps separate the real issue from the bad window.",
  },
  {
    title: "Support beats pressure",
    body: "When capacity is narrow, the cleaner move is often food, warmth, space, or one practical assist — not a long explanation.",
  },
  {
    title: "Tone carries more weight on low-margin days",
    body: "Stress sensitivity can make ambiguity, sarcasm, and closure-chasing land louder than intended.",
  },
  {
    title: "Intimacy needs context",
    body: "Desire, comfort, recovery demand, and openness can shift across the cycle. Timing helps him read pace before he initiates.",
  },
];

const WINDOWS = [
  ["Menstruation", "Lower reserve, more physical load, and stronger need for practical support for some."],
  ["Follicular", "As period symptoms ease, some people feel more energy for plans. Match the energy she actually has."],
  ["Ovulation", "Some people notice changes in energy or desire around ovulation; others notice little change."],
  ["Luteal", "If tiredness or discomfort is present, practical help and clear communication may be welcome."],
  ["PMS", "Some people experience irritability, sleep changes or discomfort before a period. Ask what would help."],
];

const FAQ = [
  {
    q: "What is cycle-aware relationship timing?",
    a: "Cycle-aware relationship timing means using menstrual-cycle context to choose better timing for support, conversations, restraint, and intimacy — without predicting mood or blaming hormones.",
  },
  {
    q: "Is this the same as period tracking?",
    a: "Period tracking usually records dates and symptoms. Cycle-aware relationship timing translates phase and timing context into practical relationship guidance instead of a symptom log.",
  },
  {
    q: "Can a boyfriend use cycle timing without being weird?",
    a: "Yes, if it is respectful, private, and consent-aware. The goal is to support better, pressure less, and communicate more carefully — not monitor or control her.",
  },
  {
    q: "Does cycle-aware timing replace communication?",
    a: "No. It can prompt you to think about timing, but direct communication, consent and respect stay central.",
  },
];

export default function CycleAwareRelationshipTimingPage() {
  const articleSchema = articleJsonLd({
    path: SLUG,
    headline: "Cycle-Aware Relationship Timing for Partners",
    description: META_DESCRIPTION,
  });
  const breadcrumbSchema = breadcrumbJsonLd([
    { name: "Home", href: "/" },
    { name: "Learn", href: "/learn" },
    { name: "Cycle-aware relationship timing", href: SLUG },
  ]);
  const faqSchema = faqJsonLd(FAQ);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <GuideArticle
        path={SLUG}
        title="Cycle-aware relationship timing"
        lead="Cycle-aware relationship timing uses menstrual-cycle context to make more thoughtful choices about support, conversations, plans and intimacy. Start with the possible background, then respond to the person in front of you."
        contents={[
          { href: "#definition", label: "The idea" },
          { href: "#principles", label: "Four principles" },
          { href: "#across-the-cycle", label: "Across the cycle" },
          { href: "#in-practice", label: "In practice" },
          { href: "#questions", label: "Common questions" },
        ]}
      >
        <GuideSection id="definition" title="Useful context for your next move">
          <div className={styles.summary}><p>The purpose is to get a quick feel for what may be shaping the day, then choose how you show up. A cycle estimate is one piece of context alongside her words, preferences and circumstances.</p></div>
          <p>Sleep, discomfort, energy and the demands of the day can affect how much room either of you has for a plan or conversation. Cycle context can help you remember to check those things instead of taking every change personally.</p>
          <p>Use information your partner chooses to share. For a practical starting point, read <Link href="/learn/period-tracking-for-men">period tracking for men</Link>.</p>
        </GuideSection>
        <GuideSection id="principles" title="Four principles for better timing">
          <div className={styles.phaseGrid}>
            {PRINCIPLES.map(({ title, body }) => <div key={title} className={styles.phase}><h3>{title}</h3><p>{body}</p></div>)}
          </div>
        </GuideSection>
        <GuideSection id="across-the-cycle" title="What the cycle can add to the picture">
          <p>There is no single experience of a phase. These are possible patterns to notice, not a timetable for her mood. PMS describes symptoms before a period, rather than a separate phase that everyone experiences.</p>
          <dl className={styles.definitions}>{WINDOWS.map(([phase, body]) => <div key={phase}><dt>{phase}</dt><dd>{body}</dd></div>)}</dl>
          <p>Read the <Link href="/learn/menstrual-cycle-phases-for-partners">four-phase guide</Link> for the underlying biology and the limits of calendar estimates.</p>
        </GuideSection>
        <GuideProductExample path={SLUG} image="/screenshots/web-2026/read-day.webp"
          alt="MoodMap daily screen with luteal context, estimated capacity and a practical direction for the day."
          title="From a phase label to a daily read">
          <p>{PRODUCT.summary}</p>
          <p>The daily screen connects the possible background to a useful direction. Open the Brief for more context or the Command Deck for PLAN, READ, BOND and SELF.</p>
        </GuideProductExample>
        <GuideSection id="in-practice" title="What this looks like in practice">
          <div className={styles.stepGrid}>
            <div className={styles.step}><h3>Support</h3><p>If she is uncomfortable or tired, offer a concrete task or comfort she wants: food, warmth, help with logistics or quiet company.</p></div>
            <div className={styles.step}><h3>Conversation</h3><p>Ask whether now works. Keep a necessary conversation clear; if you pause a non-urgent topic, agree when to come back.</p></div>
            <div className={styles.step}><h3>Intimacy</h3><p>Notice mutual interest, comfort and pace. Flirt when it is welcome and adapt to the response you receive.</p></div>
          </div>
          <p>{PRODUCT.modelScope} <Link href="/intelligence#model-fit">See where MoodMap’s model fits.</Link></p>
        </GuideSection>
        <GuideFAQ items={FAQ} />
        <SourceTrustBlock path={SLUG} />
        <GuideRelated items={[
          { href: "/learn/menstrual-cycle-phases-for-partners", label: "The menstrual cycle explained for partners" },
          { href: "/learn/pms-relationship-timing", label: "Timing conversations during PMS" },
          { href: "/learn/why-moodmap", label: "What MoodMap adds to a cycle overview" },
        ]} />
        <GuideStoreLinks path={SLUG} />
      </GuideArticle>
    </>
  );
}
