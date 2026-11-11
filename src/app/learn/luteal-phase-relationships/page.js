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

const SLUG = "/learn/luteal-phase-relationships";
const META_DESCRIPTION =
  "A practical guide to luteal phase relationship timing: capacity, communication, stress sensitivity, support, intimacy, and lower-pressure repair.";

export const metadata = {
  title: "Luteal Phase Relationship Timing Guide",
  description: META_DESCRIPTION,
  alternates: { canonical: SLUG },
  openGraph: {
    title: "MoodMap Luteal Phase Relationship Timing Guide",
    description: META_DESCRIPTION,
    url: SLUG,
    type: "article",
    images: [OG_IMAGE_SRC],
  },
  twitter: {
    card: "summary_large_image",
    title: "MoodMap Luteal Phase Relationship Timing Guide",
    description: META_DESCRIPTION,
    images: [OG_IMAGE_SRC],
  },
};

const PRINCIPLES = [
  {
    title: "Notice energy and discomfort",
    body: "If she is tired or uncomfortable, offer a practical assist before adding another task or decision. Check what she wants rather than assuming.",
  },
  {
    title: "Make your point clear",
    body: "A valid point can still land badly if the hour is wrong. Sarcasm, ambiguity, and closure pressure can become the real fight.",
  },
  {
    title: "Reliability beats performance",
    body: "Grand gestures are less useful than follow-through: do the thing, close the loop, lower the room, and stop asking for credit while she is overloaded.",
  },
  {
    title: "Intimacy needs a softer read",
    body: "Connection may still be there, but pace and comfort matter. A good partner reads openness instead of treating the phase like a yes or no switch.",
  },
];

const MOVES = [
  ["Reduce load", "Handle a practical task before it becomes another conversation."],
  ["Shorten the talk", "Make one point, keep tone clean, and return later if capacity narrows."],
  ["Stop closure-chasing", "Needing an answer now can turn your anxiety into her pressure."],
  ["Use warm proof", "Food, logistics, calm touch, and follow-through often say more than a speech."],
  ["Protect sleep and space", "Late-night heavy talks can punish both of you."],
  ["Read pace before intimacy", "Move slowly, accept no cleanly, and let connection stay safe."],
];

const FAQ = [
  {
    q: "What is the luteal phase in relationships?",
    a: "The luteal phase is the post-ovulation part of the cycle. In relationship timing, it can matter because capacity, stress sensitivity, recovery demand, and load tolerance may shift for some women.",
  },
  {
    q: "Does the luteal phase cause conflict?",
    a: "No. It does not cause conflict by itself. But a lower-margin day can make pressure, ambiguity, and unresolved load land harder, so timing and tone matter more.",
  },
  {
    q: "How should a boyfriend act during the luteal phase?",
    a: "Act steadier: reduce practical load, keep tone clean, avoid pressure, repair lightly, and choose better timing for heavy conversations.",
  },
  {
    q: "Is this medical advice?",
    a: "No. This is relationship-timing context, not diagnosis, hormone measurement, contraception, fertility planning, or treatment.",
  },
];

export default function LutealPhaseRelationshipsPage() {
  const articleSchema = articleJsonLd({
    path: SLUG,
    headline: "Luteal Phase Relationship Timing Guide",
    description: META_DESCRIPTION,
  });
  const breadcrumbSchema = breadcrumbJsonLd([
    { name: "Home", href: "/" },
    { name: "Learn", href: "/learn" },
    { name: "Luteal phase relationships", href: SLUG },
  ]);
  const faqSchema = faqJsonLd(FAQ);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <GuideArticle
        path={SLUG}
        title="Luteal phase relationships"
        lead="The weeks after ovulation can bring changes in comfort, energy and mood for some people. Use that background to notice what she needs today, choose your tone and make room for connection."
        contents={[
          { href: "#context", label: "The luteal context" },
          { href: "#notice", label: "What to notice" },
          { href: "#practical-moves", label: "Practical moves" },
          { href: "#questions", label: "Common questions" },
        ]}
      >
        <GuideSection id="context" title="Start with the day she is having">
          <div className={styles.summary}><p>The useful question is what the cycle context may add to the situation. A phase cannot settle an argument or tell you what she feels.</p></div>
          <p>The luteal phase follows ovulation. Toward the next period, some people experience tiredness, breast tenderness, bloating, irritability or sleep changes; others notice little change. The <a href="https://womenshealth.gov/menstrual-cycle/premenstrual-syndrome">Office on Women’s Health explains how PMS symptoms vary</a>.</p>
          <p>If discomfort or poor sleep is part of her day, a small practical burden may matter more than another explanation. If she feels well and wants to connect, follow that response. For the wider sequence, see <Link href="/learn/menstrual-cycle-phases-for-partners">the four phases explained for partners</Link>.</p>
        </GuideSection>
        <GuideSection id="notice" title="Four things worth noticing">
          <div className={styles.phaseGrid}>
            {PRINCIPLES.map(({ title, body }) => <div key={title} className={styles.phase}><h3>{title}</h3><p>{body}</p></div>)}
          </div>
        </GuideSection>
        <GuideProductExample path={SLUG} image="/screenshots/web-2026/read-day.webp"
          alt="MoodMap’s luteal daily screen, titled Soft Tone, Strong Center, with Intelligence, Risk and Direction sections."
          title="A quick read before you respond">
          <p>{PRODUCT.summary}</p>
          <p>This luteal example brings warmth and clarity together: keep your point clear without adding unnecessary pressure. The screen gives you a starting point; her actual words and response guide the conversation.</p>
        </GuideProductExample>
        <GuideSection id="practical-moves" title="Practical moves for a harder day">
          <ol>{MOVES.map(([title, body]) => <li key={title}><strong>{title}.</strong> {body}</li>)}</ol>
          <p>For example: “I can sort dinner. Do you want company while you unwind, or a little space?” Offer a real choice, then follow through.</p>
          <p>Pause a non-urgent discussion by agreeing when to return to it. Necessary decisions and personal boundaries still deserve attention, whatever the cycle day.</p>
        </GuideSection>
        <GuideFAQ items={FAQ} />
        <SourceTrustBlock path={SLUG} />
        <GuideRelated items={[
          { href: "/learn/pms-relationship-timing", label: "Choose a better moment for a PMS conversation" },
          { href: "/learn/support-partner-during-pms", label: "Practical ways to support a partner during PMS" },
          { href: "/intelligence", label: "How MoodMap’s cycle model works" },
        ]} />
        <GuideStoreLinks path={SLUG} />
      </GuideArticle>
    </>
  );
}
