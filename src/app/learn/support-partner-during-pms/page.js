import GuideArticle, { GuideFAQ, GuideProductExample, GuideRelated, GuideSection, GuideStoreLinks, guideStyles as styles } from "../../../components/GuideArticle";
// src/app/learn/support-partner-during-pms/page.js
import Link from "next/link";
import { PRODUCT } from "../../../lib/product";
import {
  OG_IMAGE_SRC,
  SourceTrustBlock,
  articleJsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
} from "../../seo";

const SLUG = "/learn/support-partner-during-pms";
const META_DESCRIPTION =
  "Practical PMS support for partners: what helps, what to avoid, and how timing, tone, food, space, and repair can lower late-cycle friction.";

export const metadata = {
  title: "How to Support Your Partner During PMS",
  description: META_DESCRIPTION,
  alternates: {
    canonical: SLUG,
  },
  openGraph: {
    title: "MoodMap Guide: How to Support Your Partner During PMS",
    description: META_DESCRIPTION,
    url: SLUG,
    type: "article",
    images: [OG_IMAGE_SRC],
  },
  twitter: {
    card: "summary_large_image",
    images: [OG_IMAGE_SRC],
    title: "MoodMap Guide: How to Support Your Partner During PMS",
    description: META_DESCRIPTION,
  },
};

export default function SupportPartnerDuringPMSPage() {
  // One source of truth: used for BOTH JSON-LD and visible FAQs
  const FAQ = [
    {
      q: "How can I support my partner during PMS?",
      a: "Start with empathy and timing. Offer practical support, reduce friction (less pressure, fewer big debates), and ask what kind of support she wants today (comfort, space, or help).",
    },
    {
      q: "What should I avoid saying or doing during PMS?",
      a: "Avoid minimizing, teasing, escalating, or forcing heavy conversations. Don’t treat her emotions like a problem to ‘solve’ in the moment—lead with listening and calm.",
    },
    {
      q: "Is MoodMap medical advice or fertility planning?",
      a: "No. MoodMap is relationship guidance informed by general menstrual cycle context—meant for better timing and understanding. It is not medical advice and should not be used for contraception or fertility planning.",
    },
    {
      q: "What if her cycle isn’t 28 days?",
      a: `Cycles vary. ${PRODUCT.settingsSummary} Calendar estimates still cannot confirm ovulation or predict symptoms.`,
    },
  ];

  const faqSchema = faqJsonLd(FAQ);
  const articleSchema = articleJsonLd({
    path: SLUG,
    headline: "How to Support Your Partner During PMS",
    description: META_DESCRIPTION,
  });
  const breadcrumbSchema = breadcrumbJsonLd([
    { name: "Home", href: "/" },
    { name: "Learn", href: "/learn" },
    { name: "How to support your partner during PMS", href: SLUG },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <GuideArticle
        path={SLUG}
        title="How to support your partner during PMS"
        lead="When PMS brings discomfort, tiredness or changes in mood, useful support starts with what she needs today. Offer a concrete choice, handle a practical task and keep your response steady."
        contents={[
          { href: "#what-pms-can-feel-like", label: "Possible symptoms" },
          { href: "#what-helps", label: "What helps" },
          { href: "#what-to-avoid", label: "Common backfires" },
          { href: "#timing", label: "Timing and boundaries" },
          { href: "#questions", label: "Common questions" },
        ]}
      >
        <GuideSection id="what-pms-can-feel-like" title="PMS can feel different each time">
          <p>PMS can include physical discomfort, tiredness, irritability and sleep changes. Some people have few or mild symptoms. The <a href="https://womenshealth.gov/menstrual-cycle/premenstrual-syndrome">Office on Women’s Health describes the variation and common symptoms</a>.</p>
          <ul><li>Discomfort such as bloating, breast tenderness, cramps or headaches.</li><li>Less energy after disrupted sleep or a demanding day.</li><li>Changes in mood or sensitivity to noise and light.</li></ul>
          <div className={styles.summary}><p>Ask what would help instead of deciding what she needs from a phase label. “Would you like comfort, space or help with something?” is a useful starting point.</p></div>
        </GuideSection>
        <GuideSection id="what-helps" title="Make the support specific">
          <div className={styles.stepGrid}>
            <div className={styles.step}><span className={styles.stepNumber}>1</span><h3>Take care of one task</h3><p>Sort dinner, finish a shared chore or handle a piece of planning. Choose something useful and follow through without turning it into another decision for her.</p></div>
            <div className={styles.step}><span className={styles.stepNumber}>2</span><h3>Offer the comfort she wants</h3><p>Ask whether food, warmth, quiet company or some space would help. Offer touch when it is welcome, and make room for a different preference.</p></div>
            <div className={styles.step}><span className={styles.stepNumber}>3</span><h3>Keep your own response steady</h3><p>Slow down if you are getting defensive. Listen to the actual concern before suggesting solutions. You can stay clear about your needs while keeping a warm tone.</p></div>
          </div>
          <p>Try: “I’ll handle dinner. Would you rather have a quiet evening together or some time to yourself?” A specific offer is easier to answer than a long list of possibilities.</p>
        </GuideSection>
        <GuideProductExample path={SLUG} image="/screenshots/web-2026/day-brief.webp"
          alt="MoodMap Day Brief with Current Picture, Best Approach, What Can Go Well and Set It Up sections about comfort and the evening ahead."
          title="Get the day’s context before making a plan">
          <p>{PRODUCT.summary}</p>
          <p>This Brief example starts with comfort, food and the transition home before adding another demand. Use the daily read as a prompt for the support your partner actually wants.</p>
        </GuideProductExample>
        <GuideSection id="what-to-avoid" title="Common ways support can backfire">
          <ul>
            <li><strong>Minimizing:</strong> “It’s just hormones” dismisses the concern instead of addressing it.</li>
            <li><strong>Solving before listening:</strong> ask whether she wants help or simply wants you to understand.</li>
            <li><strong>Adding pressure:</strong> keep social plans, decisions and intimacy responsive to her interest and comfort.</li>
            <li><strong>Arguing about your intention:</strong> if something landed badly, acknowledge it before defending what you meant.</li>
            <li><strong>Taking over:</strong> support her preferences rather than treating her as incapable.</li>
          </ul>
        </GuideSection>
        <GuideSection id="timing" title="Leave room for both people’s needs">
          <p>If a non-urgent conversation can wait, agree on a better time. If it needs to happen now, make it clear and manageable. The <Link href="/learn/pms-relationship-timing">PMS timing guide</Link> focuses on starting, pausing and returning to those conversations.</p>
          <p>Symptoms do not excuse harmful behavior or erase your boundaries. If symptoms regularly interfere with daily life, professional support may be useful; a relationship guide cannot assess or treat them.</p>
          <p>{PRODUCT.settingsSummary} MoodMap’s dates remain estimates, so respond to what she tells you even when it differs from the calendar.</p>
          <p>{PRODUCT.freeSummary} <Link href="/pro">See what Premium+ adds.</Link></p>
        </GuideSection>
        <GuideFAQ items={FAQ} />
        <SourceTrustBlock path={SLUG} />
        <GuideRelated items={[
          { href: "/learn/pms-relationship-timing", label: "Choose a better moment for a difficult conversation" },
          { href: "/learn/luteal-phase-relationships", label: "Luteal-phase relationship context" },
          { href: "/learn/menstrual-cycle-phases-for-partners", label: "Understand the four phases" },
        ]} />
        <GuideStoreLinks path={SLUG} title="Try a daily support cue in MoodMap" />
      </GuideArticle>
    </>
  );
}
