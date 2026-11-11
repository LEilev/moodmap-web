import GuideArticle, { GuideFAQ, GuideProductExample, GuideRelated, GuideSection, GuideStoreLinks, guideStyles as styles } from "../../../components/GuideArticle";
import Link from "next/link";
import { PRODUCT } from "../../../lib/product";
import {
  OG_IMAGE_SRC,
  SourceTrustBlock,
  articleJsonLd,
  breadcrumbJsonLd,
  definedTermSetJsonLd,
  faqJsonLd,
} from "../../seo";

const SLUG = "/learn/moodmap-glossary";
const META_DESCRIPTION =
  "Definitions for MoodMap terms including Today’s State, Day Brief, Cycle Calendar, Risk Radar, Command Deck, WHY, Cycle Intelligence, capacity, Timing Alerts, and Premium+.";

export const metadata = {
  title: "MoodMap Glossary: Product Terms and Relationship Timing",
  description: META_DESCRIPTION,
  alternates: { canonical: SLUG },
  openGraph: {
    title: "MoodMap Glossary: Product Terms and Relationship Timing",
    description: META_DESCRIPTION,
    url: SLUG,
    type: "article",
    images: [OG_IMAGE_SRC],
  },
  twitter: {
    card: "summary_large_image",
    title: "MoodMap Glossary: Product Terms and Relationship Timing",
    description: META_DESCRIPTION,
    images: [OG_IMAGE_SRC],
  },
};

const TERMS = [
  {
    slug: "moodmap",
    name: PRODUCT.name,
    short: "One private daily relationship read based on cycle context.",
    definition:
      PRODUCT.summary,
  },
  {
    slug: "cycle-aware-relationship-intelligence",
    name: "Cycle-aware relationship intelligence",
    short: "The category MoodMap is built around.",
    definition:
      "Cycle-aware relationship intelligence uses cycle position, modeled biological context, capacity, risk, and timing to help a person make more informed relationship decisions without claiming certainty about a partner.",
  },
  {
    slug: "todays-state",
    name: "Today’s State",
    short: "The day-level headline and operating context.",
    definition:
      "Today’s State is the main MoodMap view: cycle day, phase, cycle-based capacity, hormone context, risk, direction, and a concise Daily Brief entry point.",
  },
  {
    slug: "day-brief",
    name: "Day Brief",
    short: "The full practical synthesis for the day.",
    definition:
      "Day Brief integrates Current Picture, Best Approach, What Can Go Well, and Set It Up so the user can move from context to action without opening several disconnected modules.",
  },
  {
    slug: "cycle-calendar",
    name: "Cycle Calendar",
    short: "The full cycle, readable day by day.",
    definition:
      "Cycle Calendar shows period days, fertile-window estimates, estimated ovulation timing, phase progression, cycle signals, capacity, and the daily read for any selected date.",
  },
  {
    slug: "risk-radar",
    name: "Risk Radar",
    short: "Tripwire, signal, misread, and countermove.",
    definition:
      "Risk Radar highlights a possible tripwire, what the user may notice, a misinterpretation to avoid, a practical response, and why the situation could escalate.",
  },
  {
    slug: "command-deck",
    legacySlug: "protocol",
    name: "Command Deck",
    short: "PLAN, READ, BOND, and SELF guidance.",
    definition:
      "Command Deck turns the day’s context into four distinct lanes: PLAN for practical plans, READ for HOW TO SURVIVE, BOND for sex, flirting and intimacy, and SELF for the man’s own tone, impulses and reactions.",
  },
  {
    slug: "why-layer",
    name: "WHY",
    short: "The reasoning behind a Command Deck suggestion.",
    definition:
      "The WHY layer explains why a move fits, what signal to look for, how to use the guidance, what friction it may prevent, and what a well-handled outcome can look like.",
  },
  {
    slug: "cycle-intelligence",
    name: "Cycle Intelligence",
    short: "Modeled biology translated into possible effects.",
    definition:
      "Cycle Intelligence models expected relative hormone movement from cycle timing, then separates Today’s Shift, Biology, and possible effects on energy, sensitivity, recovery demand, connection, and pace. It is not individual hormone measurement.",
  },
  {
    slug: "cycle-signal",
    name: "Cycle Signal",
    short: "A compact description of where the cycle is moving.",
    definition:
      "Cycle Signal summarizes the current part of the phase progression in practical language, such as rising momentum, a steadier plateau, rain starting, or a heavier late-cycle window.",
  },
  {
    slug: "capacity",
    name: "Capacity",
    short: "A practical estimate of how much the day may absorb.",
    definition:
      "Capacity is MoodMap’s cycle-based estimate of bandwidth for complexity, pressure, recovery demand, noise, and emotional or logistical load. It is contextual, not a measurement of a person’s worth or competence.",
  },
  {
    slug: "timing-alerts",
    name: "Timing Alerts",
    short: "Optional heads-ups before important windows and reads.",
    definition:
      "Timing Alerts can surface the Daily Brief, cycle-window changes, and Risk Radar guidance around a preferred time, with delivery rules and quiet-hour controls.",
  },
  {
    slug: "premium-plus",
    name: "Premium+",
    short: "The complete MoodMap system.",
    definition:
      PRODUCT.premiumSummary,
  },
];

const FAQ = [
  {
    q: "Is MoodMap a period tracker?",
    a: "MoodMap includes cycle tracking and a full calendar, but its primary job is relationship timing: translating cycle context into a daily read for support, conversation, restraint, and intimacy.",
  },
  {
    q: "Is MoodMap a mood tracker?",
    a: "MoodMap can show mood-relevant cycle context, but it does not record or monitor a partner’s actual mood. It tracks cycle position and models possible effects rather than creating a personal mood journal.",
  },
  {
    q: "What is the main product category?",
    a: "The clearest category is cycle-aware relationship intelligence: menstrual-cycle context translated into practical relationship timing for men.",
  },
  {
    q: "Does MoodMap judge or score a partner?",
    a: "No. MoodMap guides the user’s own timing and response. It is not a verdict on a partner’s mood, intent, identity, or worth.",
  },
];

export default function MoodMapGlossaryPage() {
  const articleSchema = articleJsonLd({
    path: SLUG,
    headline: "MoodMap Glossary: Product Terms and Relationship Timing",
    description: META_DESCRIPTION,
  });
  const breadcrumbSchema = breadcrumbJsonLd([
    { name: "Home", href: "/" },
    { name: "Learn", href: "/learn" },
    { name: "MoodMap glossary", href: SLUG },
  ]);
  const definedTermSchema = definedTermSetJsonLd({
    path: SLUG,
    name: "MoodMap glossary",
    description: META_DESCRIPTION,
    terms: TERMS,
  });
  const faqSchema = faqJsonLd(FAQ);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <GuideArticle
        path={SLUG}
        title="MoodMap glossary"
        lead="Clear definitions for the screens and ideas you see in MoodMap: the daily read, Brief, Cycle Calendar, Risk Radar, Command Deck, WHY and Cycle Intelligence."
        contents={[
          { href: "#todays-state", label: "Today’s State" },
          { href: "#day-brief", label: "Day Brief" },
          { href: "#command-deck", label: "Command Deck" },
          { href: "#cycle-intelligence", label: "Cycle Intelligence" },
          { href: "#premium-plus", label: "Premium+" },
          { href: "#questions", label: "Common questions" },
        ]}
      >
        <div className={styles.summary}><p>{PRODUCT.summary}</p></div>
        <div className={styles.glossary}>
          {TERMS.map((term) => (
            <GuideSection key={term.slug} id={term.slug} title={term.name}>
              {term.legacySlug && <span id={term.legacySlug} aria-hidden="true" className={styles.legacyAnchor} />}
              <p><strong>{term.short}</strong></p><p>{term.definition}</p>
            </GuideSection>
          ))}
        </div>
        <GuideProductExample path={SLUG} image="/screenshots/web-2026/protocol-overview.webp"
          alt="MoodMap Command Deck with PLAN, READ, BOND and SELF tabs and the READ lane selected."
          title="See the Command Deck in context">
          <p>The four tabs have different jobs. PLAN covers practical plans; READ is HOW TO SURVIVE; BOND covers sex, flirting and intimacy; SELF focuses on your own reactions.</p>
          <p>Open WHY when you want the reasoning behind a suggestion. The <Link href="/learn/period-tracking-for-men">getting-started guide</Link> shows how these pieces fit into the daily experience.</p>
        </GuideProductExample>
        <GuideSection id="boundaries" title="What the terms do not claim">
          <p>{PRODUCT.boundaries}</p>
          <p>{PRODUCT.privacySummary} <Link href="/privacy-policy">Read the Privacy Policy.</Link></p>
        </GuideSection>
        <GuideFAQ items={FAQ} />
        <SourceTrustBlock path={SLUG} />
        <GuideRelated items={[
          { href: "/intelligence", label: "Explore the modeled cycle context" },
          { href: "/learn/cycle-aware-relationship-timing", label: "Understand cycle-aware relationship timing" },
          { href: "/pro", label: "See what Premium+ includes" },
        ]} />
        <GuideStoreLinks path={SLUG} />
      </GuideArticle>
    </>
  );
}
