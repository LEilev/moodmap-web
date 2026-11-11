import GuideArticle, { GuideFAQ, GuideProductExample, GuideRelated, GuideSection, GuideStoreLinks, guideStyles as styles } from "../../../components/GuideArticle";
// src/app/learn/fertile-window-explained/page.js
import Link from "next/link";
import { PRODUCT } from "../../../lib/product";
import {
  OG_IMAGE_SRC,
  SourceTrustBlock,
  articleJsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
} from "../../seo";

const SLUG = "/learn/fertile-window-explained";
const META_DESCRIPTION =
  "Understand the fertile window as non-medical timing context for partners: ovulation awareness, consent, support, and relationship pacing.";

export const metadata = {
  title: "Fertile Window Explained for Partners",
  description: META_DESCRIPTION,
  alternates: {
    canonical: SLUG,
  },
  openGraph: {
    title: "MoodMap Fertile Window Explained for Partners",
    description: META_DESCRIPTION,
    url: SLUG,
    type: "article",
    images: [OG_IMAGE_SRC],
  },
  twitter: {
    card: "summary_large_image",
    images: [OG_IMAGE_SRC],
    title: "MoodMap Fertile Window Explained for Partners",
    description: META_DESCRIPTION,
  },
};

export default function FertileWindowExplainedPage() {
  // One source of truth: used for BOTH JSON-LD and visible FAQs
  const FAQ = [
    {
      q: "What is the fertile window?",
      a: "The fertile window is the part of the cycle around ovulation when sex may result in pregnancy. Its exact timing varies. MoodMap uses calendar estimates only as relationship context, not for contraception or fertility planning.",
    },
    {
      q: "What’s the difference between ovulation day and the fertile window?",
      a: "Ovulation day is the day an egg is released. The fertile window is the wider interval around it related to pregnancy possibility. A calendar estimate cannot establish the exact timing for an individual cycle.",
    },
    {
      q: "Does ovulation affect mood, energy, or desire?",
      a: "Some people notice higher energy or confidence around ovulation, while others notice little change. It’s context—not a guarantee—and it shouldn’t be used to stereotype or pressure anyone.",
    },
    {
      q: "Is MoodMap a fertility or contraception app?",
      a: "No. MoodMap provides relationship timing guidance informed by general menstrual cycle context. It is not medical advice and should not be used for contraception or fertility planning.",
    },
    {
      q: "Why should partners care about the fertile window if we’re not trying for a baby?",
      a: "Even when fertility planning is not the goal, timing awareness can be useful context: some people feel more energetic or open to connection at certain points in the cycle, and it can help with planning, communication, and avoiding misunderstandings.",
    },
  ];

  const faqSchema = faqJsonLd(FAQ);
  const articleSchema = articleJsonLd({
    path: SLUG,
    headline: "Fertile Window Explained for Partners",
    description: META_DESCRIPTION,
  });
  const breadcrumbSchema = breadcrumbJsonLd([
    { name: "Home", href: "/" },
    { name: "Learn", href: "/learn" },
    { name: "Fertile window explained for partners", href: SLUG },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <GuideArticle
        path={SLUG}
        title="Fertile window, explained for partners"
        lead="The fertile window is the part of the cycle around ovulation when pregnancy can occur. Here is what the term means, why calendar estimates have limits and how to keep relationship guidance grounded in her actual response."
        contents={[
          { href: "#meaning", label: "What it means" },
          { href: "#ovulation-and-estimates", label: "Ovulation and estimates" },
          { href: "#connection", label: "Connection and intimacy" },
          { href: "#using-moodmap", label: "How MoodMap uses it" },
          { href: "#questions", label: "Common questions" },
        ]}
      >
        <GuideSection id="meaning" title="What the fertile window means">
          <p>Ovulation is the release of an egg from an ovary. The fertile window refers to the surrounding days when sex may result in pregnancy. The <a href="https://www.nhs.uk/conditions/periods/fertility-in-the-menstrual-cycle/">NHS explains ovulation, fertility and why timing varies</a>.</p>
          <div className={styles.summary}><p>A calendar label is an estimate. It cannot confirm when ovulation has happened, whether pregnancy is possible on a particular day, or whether your partner wants sex.</p></div>
          <p>This guide explains the term for partners. MoodMap uses cycle timing for relationship guidance and should not be used for contraception or fertility planning.</p>
        </GuideSection>
        <GuideSection id="ovulation-and-estimates" title="Ovulation day and the wider window">
          <div className={styles.compare}>
            <div><h3>Ovulation day</h3><p>The day an egg is released. Its timing varies, including between cycles in the same person.</p></div>
            <div><h3>The fertile window</h3><p>The wider interval related to pregnancy possibility around ovulation. A predicted interval does not establish its exact start or end for an individual cycle.</p></div>
          </div>
          <p>A 28-day chart is an illustration, not a reliable date for everyone. See the <Link href="/learn/menstrual-cycle-phases-for-partners">four-phase guide</Link> for the wider sequence.</p>
        </GuideSection>
        <GuideSection id="connection" title="Let mutual interest guide connection">
          <p>Some people notice changes in desire or energy around parts of their cycle; others do not notice a distinct pattern. An estimated ovulation window is not a signal of interest or permission.</p>
          <ul>
            <li><strong>Offer a plan:</strong> if she has energy and seems interested, suggest something you would both enjoy.</li>
            <li><strong>Flirt responsively:</strong> notice whether the interest is returned, and adapt your pace.</li>
            <li><strong>Make a no easy:</strong> accept a different preference without bargaining or pointing to the calendar.</li>
            <li><strong>Keep real issues in view:</strong> do not use a phase to dismiss what she says.</li>
          </ul>
        </GuideSection>
        <GuideProductExample path={SLUG} image="/screenshots/web-2026/cycle-calendar.webp"
          alt="MoodMap Cycle Calendar displaying period days and estimated fertile and ovulation windows alongside the selected day’s context."
          title="See the estimate in the wider cycle">
          <p>The Cycle Calendar shows the broader cycle and lets you open a daily read. BOND guidance focuses on sex, flirting and intimacy, with mutual interest and comfort setting the pace.</p>
          <p>These are relationship prompts based on an estimate, not a way to establish fertility or read someone’s intentions.</p>
        </GuideProductExample>
        <GuideSection id="using-moodmap" title="Keep the starting information current">
          <p>{PRODUCT.settingsSummary}</p>
          <p>{PRODUCT.modelScope} <Link href="/intelligence#model-fit">Read about the model’s fit and limits.</Link></p>
          <p>{PRODUCT.freeSummary} <Link href="/pro">See what Premium+ includes.</Link></p>
        </GuideSection>
        <GuideFAQ items={FAQ} />
        <SourceTrustBlock path={SLUG} />
        <GuideRelated items={[
          { href: "/learn/menstrual-cycle-phases-for-partners", label: "The four phases explained for partners" },
          { href: "/learn/menstrual-cycle-day-by-day-for-partners", label: "An illustrative 28-day cycle" },
          { href: "/learn/period-tracking-for-men", label: "Start with agreed cycle information" },
        ]} />
        <GuideStoreLinks path={SLUG} />
      </GuideArticle>
    </>
  );
}
