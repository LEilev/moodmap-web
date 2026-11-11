import GuideArticle, { GuideFAQ, GuideProductExample, GuideRelated, GuideSection, GuideStoreLinks, guideStyles as styles } from "../../../components/GuideArticle";
// src/app/learn/why-moodmap/page.js
import Link from "next/link";
import { PRODUCT, COMMAND_DECK_LANES } from "../../../lib/product";
import {
  OG_IMAGE_SRC,
  SourceTrustBlock,
  articleJsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
} from "../../seo";

const SLUG = "/learn/why-moodmap";
const META_DESCRIPTION =
  "Why MoodMap exists: a private cycle-aware relationship timing app for men, built for cleaner support, conversations, intimacy, and non-medical boundaries.";

export const metadata = {
  title: "Why Cycle-Aware Relationship Timing Matters",
  description: META_DESCRIPTION,
  alternates: {
    canonical: SLUG,
  },
  openGraph: {
    title: "Why MoodMap: Cycle-Aware Relationship Timing Matters",
    description: META_DESCRIPTION,
    url: SLUG,
    type: "article",
    images: [OG_IMAGE_SRC],
  },
  twitter: {
    card: "summary_large_image",
    images: [OG_IMAGE_SRC],
    title: "Why MoodMap: Cycle-Aware Relationship Timing Matters",
    description: META_DESCRIPTION,
  },
};

export default function WhyMoodMapPage() {
  const COMPARISON = [
    {
      label: "Designed for",
      typical:
        "Primarily the person experiencing the cycle (personal tracking and insights).",
      moodmap:
        "Men in relationships who want phase-aware context and better timing for support and communication.",
    },
    {
      label: "Primary goal",
      typical:
        "Track dates, estimate upcoming periods, and optionally support personal health journaling.",
      moodmap:
        "Provide menstrual cycle context that helps a partner show up better — calmer timing, clearer expectations, steadier support.",
    },
    {
      label: "What you see day-to-day",
      typical:
        "Dates, cycle charts and personal records, depending on the chosen app.",
      moodmap:
        "A quick daily read plus the PLAN, READ, BOND and SELF Command Deck: practical context for the user’s own response.",
    },
    {
      label: "Input burden",
      typical:
        "May offer ongoing symptom logging for mood, flow, pain, and other personal records.",
      moodmap:
        "Optimized for minimal input and partner usability — the goal is context, not a detailed symptom diary.",
    },
    {
      label: "Best for",
      typical:
        "Personal self-tracking, journaling, and health discussions (including with clinicians when relevant).",
      moodmap:
        "Relationship timing and partner behavior: support, tone, pacing, and planning with better context.",
    },
  ];

  const FAQ = [
    {
      q: "Is MoodMap a real period tracker — or only “relationship tips”?",
      a: "MoodMap covers cycle-timing basics and adds a partner layer: cycle-aware relationship intelligence, daily context, friction awareness, and practical guidance for men.",
    },
    {
      q: "Is MoodMap meant to replace my partner’s period tracker?",
      a: "No. A partner can keep whichever tracker she prefers. MoodMap is a separate tool for the man’s daily context and response, using only information she chooses to share.",
    },
    {
      q: "Does MoodMap predict fertility or ovulation precisely?",
      a: "MoodMap can highlight timing windows as general context. It is not medical advice and should not be used for contraception or fertility planning.",
    },
    {
      q: "What makes MoodMap different from a typical period tracking app?",
      a: PRODUCT.summary,
    },
    {
      q: "Is this intrusive or invasive?",
      a: "It’s supportive when done with consent and transparency. The boundary is simple: ask first, track minimally, and never weaponize timing in arguments.",
    },
    {
      q: "Is this medical advice?",
      a: "No. MoodMap provides relationship guidance informed by general menstrual cycle context. If there are health concerns, consult a qualified clinician.",
    },
  ];

  const faqSchema = faqJsonLd(FAQ);
  const articleSchema = articleJsonLd({
    path: SLUG,
    headline: "Why MoodMap: Cycle-Aware Relationship Timing Matters",
    description: META_DESCRIPTION,
  });
  const breadcrumbSchema = breadcrumbJsonLd([
    { name: "Home", href: "/" },
    { name: "Learn", href: "/learn" },
    { name: "Why MoodMap", href: SLUG },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <GuideArticle
        path={SLUG}
        title="Why MoodMap"
        lead="MoodMap is built for the man who wants a quick daily feel for what his partner’s cycle may mean for mood, energy and connection—and a useful way to respond."
        contents={[
          { href: "#purpose", label: "Who it is for" },
          { href: "#comparison", label: "Different purposes" },
          { href: "#daily-guidance", label: "What you get" },
          { href: "#getting-started", label: "Using it well" },
          { href: "#questions", label: "Common questions" },
        ]}
      >
        <GuideSection id="purpose" title="A daily read on your own phone">
          <div className={styles.summary}><p>{PRODUCT.summary}</p></div>
          <p>Open the app for a concise starting point: possible context for the day, a likely misunderstanding to avoid, and practical guidance for your next move. You can open the explanation when you want more depth.</p>
          <p>Your partner can keep whichever tracker she prefers. MoodMap uses the cycle information she chooses to share to help with your own response. For the basic setup, read <Link href="/learn/period-tracking-for-men">period tracking for men</Link>.</p>
        </GuideSection>
        <GuideSection id="comparison" title="Choose by the job you want done">
          <p>Personal tracking and partner guidance serve different purposes. Apps can combine both; the comparison below describes those uses rather than claiming every other app works the same way.</p>
          {COMPARISON.map((row) => (
            <div key={row.label} className={styles.comparisonGroup}>
              <h3>{row.label}</h3>
              <div className={styles.compare}>
                <div><p><strong>Personal tracking</strong></p><p>{row.typical}</p></div>
                <div><p><strong>MoodMap</strong></p><p>{row.moodmap}</p></div>
              </div>
            </div>
          ))}
        </GuideSection>
        <GuideProductExample path={SLUG} image="/screenshots/web-2026/day-brief.webp"
          alt="MoodMap Day Brief combining Current Picture, Best Approach, What Can Go Well and Set It Up in one daily read."
          title="Get the gist, then choose your next move">
          <p>The Brief brings the day’s possible background and practical direction together. This example starts with comfort and the transition home before adding another demand.</p>
          <p>{PRODUCT.freeSummary}</p>
        </GuideProductExample>
        <GuideSection id="daily-guidance" title="Four distinct kinds of guidance">
          <p>PLAN, READ, BOND and SELF change with the cycle context. Each has a different job, so you can look for the kind of guidance you need.</p>
          <div className={styles.laneGrid}>
            {COMMAND_DECK_LANES.map((lane) => <div key={lane.name} className={styles.lane}><span className={styles.phaseLabel}>{lane.name}</span><h3>{lane.title}</h3><p>{lane.description}</p></div>)}
          </div>
          <p>The calendar gives you an overview. Cycle Intelligence explains the modeled biology and possible effects. Optional alerts can remind you to check the day’s context; use the current settings to choose what suits you.</p>
          <p>{PRODUCT.premiumSummary} <Link href="/pro">Read about Premium+ and the store options.</Link></p>
        </GuideSection>
        <GuideSection id="getting-started" title="Use the context well">
          <ol>
            <li><strong>Ask first.</strong> Explain what you hope the reminder or overview will help you do, and use only the information she wants to share.</li>
            <li><strong>Keep the estimate current.</strong> Update the period-start information when a new period begins and review the settings.</li>
            <li><strong>Read, then respond.</strong> Let the daily context help you notice possibilities; let her actual words and response guide your next move.</li>
          </ol>
          <p>{PRODUCT.privacySummary} <Link href="/privacy-policy">See how data and choices are handled.</Link></p>
          <p>{PRODUCT.boundaries} <Link href="/intelligence#model-fit">Check whether the cycle model fits.</Link></p>
        </GuideSection>
        <GuideFAQ items={FAQ} />
        <SourceTrustBlock path={SLUG} />
        <GuideRelated items={[
          { href: "/learn/period-tracking-for-men", label: "Get started with period tracking for men" },
          { href: "/learn/cycle-aware-relationship-timing", label: "Understand cycle-aware timing" },
          { href: "/learn/moodmap-glossary", label: "Look up MoodMap’s product terms" },
        ]} />
        <GuideStoreLinks path={SLUG} title="Try your first daily read" />
      </GuideArticle>
    </>
  );
}
