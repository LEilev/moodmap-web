import GuideArticle, { GuideFAQ, GuideProductExample, GuideRelated, GuideSection, GuideStoreLinks, guideStyles as styles } from "../../../components/GuideArticle";
import Link from "next/link";
import {
  OG_IMAGE_SRC,
  SourceTrustBlock,
  articleJsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
} from "../../seo";

const SLUG = "/learn/pms-relationship-timing";
const META_DESCRIPTION =
  "PMS relationship timing for partners: reduce pressure, choose cleaner support, pace hard conversations, and repair without making the room heavier.";

export const metadata = {
  title: "PMS Relationship Timing Guide for Partners",
  description: META_DESCRIPTION,
  alternates: { canonical: SLUG },
  openGraph: {
    title: "MoodMap PMS Relationship Timing Guide for Partners",
    description: META_DESCRIPTION,
    url: SLUG,
    type: "article",
    images: [OG_IMAGE_SRC],
  },
  twitter: {
    card: "summary_large_image",
    title: "MoodMap PMS Relationship Timing Guide for Partners",
    description: META_DESCRIPTION,
    images: [OG_IMAGE_SRC],
  },
};

const TIMING_RULES = [
  {
    title: "Do not open the biggest topic at the loudest hour",
    body: "If the room is already narrow, your need for immediate closure can become the accelerant. Park the issue cleanly and return when the margin is better.",
  },
  {
    title: "Make support concrete",
    body: "Offer something useful: food, warmth, quieter surroundings or one practical assist. Ask which would help, then follow through.",
  },
  {
    title: "Use fewer words with cleaner tone",
    body: "Tone, timing, and ambiguity can carry more weight. Make the message shorter, kinder, and easier to absorb.",
  },
  {
    title: "Protect recovery",
    body: "Sleep, space, sensory load, and practical quiet matter. A late-night repair attempt can become another stressor if the body is already asking for less.",
  },
];

const DO_DONT = [
  ["Do", "Lower pressure before you ask for closeness."],
  ["Do", "Use direct, warm language instead of hints."],
  ["Do", "Close practical loops without making them a performance."],
  ["Do", "If a topic can wait, agree on a better time and return to it."],
  ["Avoid", "Debating whether she is being rational."],
  ["Avoid", "Chasing reassurance because you feel uncomfortable."],
  ["Avoid", "Making one sharp comment and then calling it a joke."],
  ["Avoid", "Treating PMS as permission to dismiss what she says."],
];

const FAQ = [
  {
    q: "What is PMS relationship timing?",
    a: "PMS relationship timing means choosing lower-pressure support, cleaner tone, and better timing when capacity and stress buffer may be lower before menstruation.",
  },
  {
    q: "How do I support my partner during PMS without walking on eggshells?",
    a: "Do not become timid or fake. Become cleaner: lower pressure, reduce practical load, keep tone warm, avoid sarcasm, and ask simple questions instead of forcing a long talk.",
  },
  {
    q: "Should serious conversations be avoided during PMS?",
    a: "Not always. Some conversations still need to happen. But timing, tone, length, and pressure matter more when the room has less margin.",
  },
  {
    q: "Does PMS excuse bad behavior?",
    a: "No. MoodMap does not excuse harmful behavior or erase responsibility. It gives timing context so a partner can avoid making a difficult window heavier.",
  },
];

export default function PmsRelationshipTimingPage() {
  const articleSchema = articleJsonLd({
    path: SLUG,
    headline: "PMS Relationship Timing Guide for Partners",
    description: META_DESCRIPTION,
  });
  const breadcrumbSchema = breadcrumbJsonLd([
    { name: "Home", href: "/" },
    { name: "Learn", href: "/learn" },
    { name: "PMS relationship timing", href: SLUG },
  ]);
  const faqSchema = faqJsonLd(FAQ);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <GuideArticle
        path={SLUG}
        title="PMS relationship timing"
        lead="When premenstrual symptoms are part of the day, the moment you choose for a conversation can matter. This guide helps you decide what needs attention now, what can wait, and how to return to a difficult topic."
        contents={[
          { href: "#choose-the-moment", label: "Choose the moment" },
          { href: "#timing-moves", label: "Timing and tone" },
          { href: "#repair", label: "Pause and repair" },
          { href: "#questions", label: "Common questions" },
        ]}
      >
        <GuideSection id="choose-the-moment" title="Check urgency before choosing a time">
          <div className={styles.summary}><p>Keep the real issue in view. Symptoms may make a conversation harder; they do not make her point less valid or remove either person’s responsibility.</p></div>
          <p>PMS experiences vary. If she says she is tired, uncomfortable or overwhelmed, consider whether a long discussion needs to happen right now. Ask directly rather than deciding from a calendar.</p>
          <ol>
            <li><strong>Does it need a decision now?</strong> Deal with urgent matters clearly and briefly.</li>
            <li><strong>Is this a good moment for both of you?</strong> Ask: “Is now okay for ten minutes about tomorrow, or would after dinner work better?”</li>
            <li><strong>If you pause, when will you return?</strong> Agree on a time so the topic does not quietly disappear.</li>
          </ol>
          <p>For practical help with food, tasks, rest and comfort, use the separate <Link href="/learn/support-partner-during-pms">PMS support guide</Link>.</p>
        </GuideSection>
        <GuideSection id="timing-moves" title="Make the conversation easier to receive">
          <div className={styles.phaseGrid}>
            {TIMING_RULES.map(({ title, body }) => <div key={title} className={styles.phase}><h3>{title}</h3><p>{body}</p></div>)}
          </div>
        </GuideSection>
        <GuideProductExample path={SLUG} image="/screenshots/web-2026/risk-radar.webp"
          alt="MoodMap Risk Radar showing a joke that lands badly, a likely misread and a brief repair response."
          title="Notice the misread before it grows">
          <p>This Risk Radar example starts with an ordinary moment: a joke lands badly. It helps you spot the urge to keep explaining and suggests a short repair instead.</p>
          <p>MoodMap connects possible cycle context with useful responses. It guides what you do next, without recording her actual mood.</p>
        </GuideProductExample>
        <GuideSection id="repair" title="Pause without abandoning the issue">
          <p>Try: “That came out wrong. I want to hear what you meant. Can we take a short break and come back after dinner?” Acknowledge your part before explaining your intention.</p>
          <div className={styles.compare}>
            <div><h3>Helpful choices</h3><ul>{DO_DONT.filter(([label]) => label === "Do").map(([, body]) => <li key={body}>{body}</li>)}</ul></div>
            <div><h3>Common ways to add pressure</h3><ul>{DO_DONT.filter(([label]) => label === "Avoid").map(([, body]) => <li key={body}>{body}</li>)}</ul></div>
          </div>
          <p>Keep your own boundaries clear. Respectful timing includes both people; it does not require accepting hurtful behavior or postponing an urgent concern.</p>
        </GuideSection>
        <GuideFAQ items={FAQ} />
        <SourceTrustBlock path={SLUG} />
        <GuideRelated items={[
          { href: "/learn/support-partner-during-pms", label: "Offer practical PMS support" },
          { href: "/learn/luteal-phase-relationships", label: "Understand the broader luteal phase" },
          { href: "/learn/period-tracking-for-men", label: "Get started with period tracking for men" },
        ]} />
        <GuideStoreLinks path={SLUG} title="Get a daily starting point for your next move" />
      </GuideArticle>
    </>
  );
}
