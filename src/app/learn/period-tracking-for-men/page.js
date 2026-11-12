import Link from "next/link";
import GuideArticle, {
  GuideFAQ,
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
  { q: "What does period tracking for men mean?", a: "Using cycle dates your partner chooses to share to keep possible changes in energy, comfort and mood in mind. MoodMap turns that timing into a daily read and practical guidance on your own phone." },
  { q: "What is the minimum information I need?", a: "Start with an agreed period-start date and review the cycle settings. Update the date when a new period begins. MoodMap does not require a symptom diary or a record of her feelings." },
  { q: "How do I ask her about it?", a: "Explain what you want it to help you do, such as remember when practical support may be useful. Ask if she would like that and what she is comfortable sharing. Respect her preference if she does not want tracking." },
  { q: "What if her cycle is not 28 days?", a: "Review the cycle length, menstruation length and PMS-window options in the app. A calendar estimate becomes less useful when cycles vary substantially; changing a setting cannot remove that uncertainty." },
  { q: "What is free and what does Premium+ add?", a: `${PRODUCT.freeSummary} ${PRODUCT.premiumSummary}` },
  { q: "Does cycle tracking tell me when she wants sex?", a: "No. BOND offers ideas for flirting, sex and intimacy, but a cycle estimate cannot tell you whether she is interested. Her response and consent set the pace." },
  { q: "Does she need a linked account or mood diary?", a: "No. You enter agreed cycle context and use the guidance on your phone. A partner mood diary or shared feed is not required." },
  { q: "Can I use MoodMap for contraception or fertility planning?", a: "No. MoodMap estimates cycle context for relationship guidance. It cannot confirm ovulation, measure hormones or support contraception or fertility planning." },
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
        lead="A period tracker for men can give you a little more context for her day. Here is what to enter, what you can learn, and how to turn that information into something useful between you."
        readingTime="5 min read"
        takeaway="Start with a period date your partner chooses to share. MoodMap uses that timing for a quick daily read of possible mood, energy and connection—with practical guidance for your response."
        contents={[{ href: "#get-started", label: "Get started" }, { href: "#daily-guidance", label: "What you get each day" }, { href: "#free-premium", label: "Free and Premium+" }, { href: "#privacy", label: "Privacy and agreement" }, { href: "#questions", label: "Common questions" }]}>
        <GuideSection id="get-started" title="Start with one date">
          <div className={styles.stepGrid}>
            <article className={styles.step}><span className={styles.stepNumber}>1</span><h3>Agree on what helps</h3><p>Ask whether a cycle reminder would be useful, what she wants to share and what support she actually appreciates.</p></article>
            <article className={styles.step}><span className={styles.stepNumber}>2</span><h3>Set the cycle context</h3><p>Enter the agreed period-start date. Review cycle length, menstruation length and the PMS window. Update the date when a new period begins.</p></article>
            <article className={styles.step}><span className={styles.stepNumber}>3</span><h3>Read, then respond</h3><p>Open the daily read. Consider the possible context, then choose a useful move for support, conversation or mutually wanted closeness.</p></article>
          </div>
          <p>The <a href="https://www.nhs.uk/conditions/periods/fertility-in-the-menstrual-cycle/" target="_blank" rel="noopener noreferrer">first day of bleeding is cycle day one</a>. Cycle length counts from one period’s first day to the next. If the basics are new to you, start with <Link href="/learn/menstrual-cycle-phases-for-partners">the four phases explained for partners</Link>.</p>
        </GuideSection>

        <GuideSection id="daily-guidance" title="A quick read. A useful next move.">
          <p>MoodMap’s daily context and Brief help you get the gist: what the cycle may mean for mood, energy and connection today. Open the explanations when you want more depth.</p>
          <p>The Command Deck turns that context into four kinds of guidance. Each changes with the cycle:</p>
          <div className={styles.laneGrid}>
            {COMMAND_DECK_LANES.map(({ name, title, description }) => <article key={name} className={styles.lane}><span className={styles.phaseLabel}>{name}</span><h3>{title}</h3><p>{description}</p></article>)}
          </div>
          <p>For how the estimates work, read <Link href="/intelligence">the cycle model and its limits</Link>.</p>
        </GuideSection>

        <GuideSection id="calendar-guidance" title="From dates to daily perspective">
          <div className={styles.compare}>
            <div><h3>A useful heads-up</h3><p>Possible tiredness or discomfort can be a reason to check in, offer help or keep a plan flexible. MoodMap gives you a starting point for that response.</p></div>
            <div><h3>Room for the person</h3><p>She may feel differently from the estimate. Stress, sleep and what is happening between you matter too. Listen to what she says and adapt.</p></div>
          </div>
        </GuideSection>

        <GuideSection id="free-premium" title="Start free. Go deeper with Premium+.">
          <div className={styles.compare}>
            <div><h3>Free</h3><p>{PRODUCT.freeSummary}</p></div>
            <div><h3>Premium+</h3><p>{PRODUCT.premiumSummary}</p></div>
          </div>
          <p>Your app store shows local prices and subscription terms before purchase. <Link href="/pro">See what Premium+ includes.</Link></p>
          <p className={styles.finePrint}>Available for iPhone and Android in {PRODUCT.languages.map(({ name }) => name).join(", ")}.</p>
        </GuideSection>

        <GuideSection id="privacy" title="Keep the agreement clear">
          <div className={styles.summary}><p>“Would it help if I kept track of the dates so I can plan better, or would you prefer I didn’t?”</p></div>
          <p>Agree on the purpose and the information she wants to share. Revisit that agreement if her preferences change. Tracking should make support easier; it should not become a way to dismiss a concern or label an argument.</p>
          <p>{PRODUCT.privacySummary} <Link href="/privacy-policy">Read the Privacy Policy.</Link></p>
        </GuideSection>

        <GuideSection id="model-fit" title="When a calendar estimate is less useful">
          <p>{PRODUCT.modelScope}</p>
          <p>If symptoms interfere with daily life, encourage professional advice. The <a href="https://womenshealth.gov/menstrual-cycle/premenstrual-syndrome" target="_blank" rel="noopener noreferrer">Office on Women’s Health explains PMS symptoms and when to seek help</a>. MoodMap supplies relationship context, not a diagnosis.</p>
        </GuideSection>
        <GuideFAQ items={FAQ} />
        <div className={styles.sources}><SourceTrustBlock path={SLUG} /></div>
        <GuideStoreLinks path={SLUG} title="A little more context for today" />
        <GuideRelated items={[{ href: "/learn/menstrual-cycle-phases-for-partners", label: "Cycle phases explained for partners" }, { href: "/learn/support-partner-during-pms", label: "Practical support during PMS" }, { href: "/learn/moodmap-glossary", label: "The MoodMap feature guide" }]} />
      </GuideArticle>
    </>
  );
}
