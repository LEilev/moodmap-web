import Link from "next/link";
import GuideArticle, {
  GuideFAQ,
  GuideProductExample,
  GuideRelated,
  GuideSection,
  GuideStoreLinks,
  guideStyles as styles,
} from "../../../components/GuideArticle";
import { COMMAND_DECK_LANES, PRODUCT } from "../../../lib/product";
import { OG_IMAGE_SRC, SourceTrustBlock, articleJsonLd, breadcrumbJsonLd, faqJsonLd } from "../../seo";

const SLUG = "/learn/period-tracking-for-men";
const TITLE = "Period tracking for men";
const DESCRIPTION = "A practical guide to period tracking for men: what to enter, how cycle context can help, and how MoodMap turns a daily read into useful partner guidance.";

export const metadata = {
  title: "Period Tracking for Men and Partners",
  description: DESCRIPTION,
  alternates: { canonical: SLUG },
  openGraph: { title: "Period Tracking for Men and Partners", description: DESCRIPTION, url: SLUG, type: "article", images: [OG_IMAGE_SRC] },
  twitter: { card: "summary_large_image", title: "Period Tracking for Men and Partners", description: DESCRIPTION, images: [OG_IMAGE_SRC] },
};

const FAQ = [
  { q: "What does period tracking for men mean?", a: "It means using cycle timing that a partner has agreed to share as context for practical support, conversations and connection. MoodMap adds a daily read and actionable guidance for the man, without recording his partner’s actual mood." },
  { q: "What is the minimum information I need?", a: "Start with an agreed period-start date and the cycle information she is comfortable sharing. Keep the estimate current when a new period begins. You do not need to keep a diary of her feelings or symptoms to use MoodMap." },
  { q: "How do I ask her about it?", a: "Explain what you hope it will help you do: for example, plan better or remember when practical support may be useful. Ask whether she wants that, what she is comfortable sharing and what she would prefer to keep private. Respect a no." },
  { q: "What if her cycle is not 28 days?", a: "A 28-day cycle is only an example. MoodMap has cycle, menstruation and PMS-window settings. Use the options shown in the current app, and treat the result as an estimate. If cycles are irregular, a calendar model may not fit well." },
  { q: "What is free and what does Premium+ add?", a: `${PRODUCT.freeSummary} ${PRODUCT.premiumSummary}` },
  { q: "Does cycle tracking tell me when she wants sex?", a: "No. Cycle context may be relevant to comfort or desire for some people, but it cannot tell you whether your partner wants sex. BOND offers guidance for flirting and intimacy; her actual interest and consent set the pace." },
  { q: "Does she need a linked account or mood diary?", a: "MoodMap’s daily guidance does not require a partner mood diary or a shared feed. You enter agreed cycle context and use the guidance on your own phone. Check the Privacy Policy for how analytics, purchases and support information are handled." },
  { q: "Can I use MoodMap for contraception or fertility planning?", a: "No. It uses cycle estimates for educational relationship guidance. It cannot confirm ovulation, measure hormones or replace appropriate medical and fertility advice." },
];

export default function PeriodTrackingForMenPage() {
  const schemas = [
    articleJsonLd({ path: SLUG, headline: "Period Tracking for Men and Partners", description: DESCRIPTION }),
    breadcrumbJsonLd([{ name: "Home", href: "/" }, { name: "Guides", href: "/learn" }, { name: TITLE, href: SLUG }]),
    faqJsonLd(FAQ),
  ];
  return (
    <>
      {schemas.map((schema, index) => <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />)}
      <GuideArticle path={SLUG} title={TITLE}
        lead="A period tracker for men can help you keep agreed cycle timing in mind. The useful next step is knowing what that context may mean today: her possible energy, comfort and mood, and a better way for you to respond."
        contents={[{ href: "#get-started", label: "Get started" }, { href: "#daily-guidance", label: "What you get each day" }, { href: "#free-premium", label: "Free and Premium+" }, { href: "#privacy", label: "Privacy and agreement" }, { href: "#questions", label: "Common questions" }]}>
        <GuideSection id="get-started" title="Start with a little information and a clear purpose">
          <div className={styles.summary}><p><strong>The goal:</strong> get a quick feel for the possible cycle context, then act on what is actually happening between you. A date can be useful background; it cannot tell you what she thinks.</p></div>
          <div className={styles.stepGrid}>
            <article className={styles.step}><span className={styles.stepNumber}>1</span><h3>Ask what would help</h3><p>Explain why you want a reminder or cycle overview. Agree on what she wants to share and what support she finds useful.</p></article>
            <article className={styles.step}><span className={styles.stepNumber}>2</span><h3>Set the cycle context</h3><p>Enter an agreed period-start date and check the cycle settings. Keep the date current when a new period starts. An estimate is only as useful as its starting information.</p></article>
            <article className={styles.step}><span className={styles.stepNumber}>3</span><h3>Read, then respond</h3><p>Use the daily context to consider a practical move: simplify a plan, change your tone, offer support or make room for mutual connection.</p></article>
          </div>
          <p>The <a href="https://www.nhs.uk/conditions/periods/fertility-in-the-menstrual-cycle/" target="_blank" rel="noopener noreferrer">first day of bleeding is cycle day one</a>. Real cycles vary; if you need the overview first, read <Link href="/learn/menstrual-cycle-phases-for-partners">the four phases explained for partners</Link>.</p>
        </GuideSection>

        <GuideProductExample path={SLUG} image="/screenshots/web-2026/day-brief.webp" alt="MoodMap Day Brief with Current Picture, Best Approach, What Can Go Well and Set It Up sections." title="One daily read you can put to use">
          <p>{PRODUCT.summary}</p>
          <p>The Brief connects the possible background to the day ahead. This example starts with comfort and practical setup before a bigger conversation or a bid for closeness.</p>
          <p>Get the gist quickly, then open the explanation when you want more context.</p>
        </GuideProductExample>

        <GuideSection id="daily-guidance" title="Four different jobs in the Command Deck">
          <p>PLAN, READ, BOND and SELF all change with the cycle context. Each helps with a different part of your response, so four categories do not become four versions of the same advice.</p>
          <div className={styles.laneGrid}>
            {COMMAND_DECK_LANES.map(({ name, title, description }) => <article key={name} className={styles.lane}><span className={styles.phaseLabel}>{name}</span><h3>{title}</h3><p>{description}</p></article>)}
          </div>
          <p>The WHY explanations add reasoning behind a move. The <Link href="/intelligence">Cycle Intelligence view</Link> explains the modeled biology and possible effects separately.</p>
        </GuideSection>

        <GuideSection id="calendar-guidance" title="From calendar dates to partner guidance">
          <div className={styles.compare}>
            <div><h3>Dates and symptom records</h3><p>A calendar helps someone record periods and see expected timing. Symptom tracking can help them notice their own patterns.</p></div>
            <div><h3>MoodMap’s emphasis</h3><p>MoodMap uses agreed cycle timing to create a daily read for the partner: possible context, likely misunderstandings to avoid and practical moves for support, intimacy and self-regulation.</p></div>
          </div>
          <p>Apps can combine several of these functions. Choose based on the job you want done. MoodMap’s primary job is helping you respond with more context.</p>
        </GuideSection>

        <GuideSection id="free-premium" title="Start free. Open more depth with Premium+.">
          <p>{PRODUCT.freeSummary}</p>
          <p>{PRODUCT.premiumSummary}</p>
          <p>{PRODUCT.settingsSummary}</p>
          <p>{PRODUCT.purchaseSummary} <Link href="/pro">Explore Premium+ and get the app.</Link></p>
          <p>Available in {PRODUCT.languages.map(({ name }) => name).join(", ")}.</p>
        </GuideSection>

        <GuideSection id="privacy" title="Keep the agreement as clear as the dates">
          <p>A useful starting question is: “Would a reminder help me plan better and show up well, or would you rather I do not track anything?” Agree what support means to her. It may be practical help, company, less noise or simply remembering that a difficult day is possible.</p>
          <p>{PRODUCT.privacySummary} <Link href="/privacy-policy">Read the Privacy Policy</Link> for the actual data handling and choices.</p>
          <p>Never use a calendar to win an argument or decide that a concern is invalid. For sex, flirting and intimacy, respond to the interest you receive. A phase is not a green light.</p>
        </GuideSection>

        <GuideSection id="model-fit" title="Know what the estimate can and cannot do">
          <p>{PRODUCT.modelScope}</p>
          <p>PMS experiences also vary. The <a href="https://womenshealth.gov/menstrual-cycle/premenstrual-syndrome" target="_blank" rel="noopener noreferrer">Office on Women’s Health describes possible symptoms and when they deserve professional attention</a>. MoodMap supplies context for your response, not a diagnosis of your partner.</p>
        </GuideSection>
        <GuideFAQ items={FAQ} />
        <div className={styles.sources}><SourceTrustBlock path={SLUG} /></div>
        <GuideStoreLinks path={SLUG} title="Get a daily starting point for your next move" />
        <GuideRelated items={[{ href: "/learn/menstrual-cycle-phases-for-partners", label: "Cycle phases explained for partners" }, { href: "/learn/support-partner-during-pms", label: "Practical support during PMS" }, { href: "/learn/moodmap-glossary", label: "The MoodMap feature guide" }]} />
      </GuideArticle>
    </>
  );
}
