import Link from "next/link";
import GuideArticle, {
  GuideFAQ,
  GuideRelated,
  GuideSection,
  GuideStoreLinks,
  guideStyles as styles,
} from "../../../components/GuideArticle";
import { PRODUCT } from "../../../lib/product";
import { OG_IMAGE_SRC, SourceTrustBlock, articleJsonLd, breadcrumbJsonLd, faqJsonLd } from "../../seo";

const SLUG = "/learn/menstrual-cycle-phases-for-partners";
const TITLE = "Menstrual cycle phases for partners";
const DESCRIPTION = "Understand the four menstrual cycle phases, what your partner may notice, and practical ways to respond to changes in energy, comfort and connection.";

export const metadata = {
  title: "Menstrual Cycle Phases Guide for Partners",
  description: DESCRIPTION,
  alternates: { canonical: SLUG },
  openGraph: { title: TITLE, description: DESCRIPTION, url: SLUG, type: "article", images: [OG_IMAGE_SRC] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [OG_IMAGE_SRC] },
};

const PHASES = [
  { name: "Menstruation", timing: "The period begins", biology: "Estrogen and progesterone are low, and the uterine lining sheds. The first day of bleeding is cycle day one.", context: "Cramps or poor sleep can make a busy day feel harder. She may welcome comfort, practical help or her usual routine.", response: "Offer one specific thing: dinner, a handled task or quiet company. Ask which would help." },
  { name: "Follicular phase", timing: "From day one to ovulation", biology: "Estrogen rises as an egg matures. This phase starts during the period and continues after the bleeding ends.", context: "If period symptoms have eased and she has more energy, there may be more room for plans, conversation or playfulness.", response: "Suggest something you would both enjoy. Match the energy she has today, rather than filling every free hour." },
  { name: "Ovulation", timing: "An egg is released", biology: "A rise in luteinizing hormone (LH) triggers the release of an egg. Its timing varies between cycles.", context: "Some people notice brief discomfort around ovulation; others notice little. Energy and desire do not follow a fixed schedule.", response: "When interest is mutual, make room for flirting and closeness. Her response tells you how to continue." },
  { name: "Luteal phase", timing: "After ovulation to the next period", biology: "Progesterone rises after ovulation. If pregnancy does not occur, progesterone and estrogen fall before the next period.", context: "Some people experience tender breasts, bloating, tiredness or mood changes before a period. PMS varies in timing and intensity.", response: "Ease a practical burden, take discomfort seriously and keep your tone clear. Ask what would make the day easier." },
];

const FAQ = [
  { q: "What are the four phases of the menstrual cycle?", a: "Menstruation, the follicular phase, ovulation and the luteal phase. Menstruation overlaps the start of the follicular phase. PMS can occur before a period; it is not a separate phase that everyone experiences." },
  { q: "Why isn’t every cycle exactly 28 days?", a: "Cycle length varies between people and from month to month. A 28-day chart is an illustration. It cannot establish an individual ovulation date or predict how someone will feel." },
  { q: "Does ovulation affect mood or desire?", a: "Experiences vary. A cycle estimate cannot tell you whether your partner wants sex, conversation or a particular plan. Her actual interest and response are the useful signals to follow." },
  { q: "What is the difference between PMS and PMDD?", a: "PMS involves recurring physical or emotional symptoms before a period. PMDD causes more severe symptoms and substantial disruption to daily life. Symptoms that affect work, relationships or wellbeing deserve professional assessment." },
  { q: "Should I track my partner’s cycle?", a: "Ask whether she would find it helpful, and use only information she chooses to share. She may prefer support without tracking. Agree on what it is for and stop if that agreement changes." },
  { q: "Does this model work with hormonal contraception or irregular cycles?", a: PRODUCT.modelScope },
  { q: "Is this medical or fertility advice?", a: "No. This guide offers general cycle education and practical relationship suggestions. MoodMap is not a diagnostic, contraception or fertility-planning tool." },
];

export default function CyclePhasesForPartnersPage() {
  const schemas = [
    articleJsonLd({ path: SLUG, headline: TITLE, description: DESCRIPTION }),
    breadcrumbJsonLd([{ name: "Home", href: "/" }, { name: "Guides", href: "/learn" }, { name: "Menstrual cycle phases for partners", href: SLUG }]),
    faqJsonLd(FAQ),
  ];
  return (
    <>
      {schemas.map((schema, index) => <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />)}
      <GuideArticle path={SLUG} title={TITLE}
        lead="Understand what changes through the cycle, what your partner may notice, and how a little context can help with everyday support, conversations and intimacy."
        readingTime="5 min read"
        takeaway="The four commonly described phases are menstruation, follicular phase, ovulation and luteal phase. Their timing varies. Use them to understand possible changes, then respond to how she actually feels."
        contents={[{ href: "#phase-overview", label: "The four phases" }, { href: "#everyday-examples", label: "Everyday examples" }, { href: "#cycle-variation", label: "When timing varies" }, { href: "#support", label: "Using the context" }, { href: "#questions", label: "Common questions" }]}>
        <GuideSection id="phase-overview" title="Four phases, a little more context">
          <p>The <a href="https://my.clevelandclinic.org/health/body/10132-menstrual-cycle" target="_blank" rel="noopener noreferrer">four-phase overview</a> below separates the biology from a practical response. Menstruation and the follicular phase overlap; the labels are a way to understand the cycle, not four equal blocks of time.</p>
          <div className={styles.phaseGrid}>
            {PHASES.map(({ name, timing, biology, context, response }) => <article key={name} className={styles.phase}><span className={styles.phaseLabel}>{timing}</span><h3>{name}</h3><p className={styles.phaseBiology}>{biology}</p><p>{context}</p><p className={styles.phaseResponse}><strong>Try this</strong><br />{response}</p></article>)}
          </div>
          <p className={styles.finePrint}>The <a href="https://womenshealth.gov/menstrual-cycle/premenstrual-syndrome" target="_blank" rel="noopener noreferrer">Office on Women’s Health describes the range of PMS symptoms</a>. Some people have few or none. The suggestions here are ways to respond, not predictions about your partner.</p>
        </GuideSection>

        <GuideSection id="everyday-examples" title="From understanding to a useful response">
          <div className={styles.stepGrid}>
            <article className={styles.step}><h3>Make a difficult day easier</h3><p>If discomfort or tiredness is already part of the day, take care of a task before adding another decision.</p><p><strong>Try:</strong> “I can sort dinner. Would you like company or a quiet hour?”</p></article>
            <article className={styles.step}><h3>Make room for connection</h3><p>If she seems playful and interested, respond to that energy. Offer a date, flirt or make time together feel intentional.</p><p><strong>Try:</strong> “Fancy going out, or shall we make a good evening here?”</p></article>
            <article className={styles.step}><h3>Keep a sharp moment small</h3><p>Listen to the point being made. If either of you is getting defensive, slow your own response and agree when to continue.</p><p><strong>Try:</strong> “I want to hear this properly. Can we take ten minutes and come back?”</p></article>
          </div>
        </GuideSection>

        <GuideSection id="cycle-variation" title="Why the dates move">
          <p>A 28-day chart is an example, not a universal timetable. The <a href="https://www.nhs.uk/conditions/periods/fertility-in-the-menstrual-cycle/" target="_blank" rel="noopener noreferrer">NHS explains that cycle length and ovulation timing vary</a>. Counting from a period date estimates where someone may be in the cycle; it cannot confirm ovulation.</p>
          <p>{PRODUCT.settingsSummary}</p>
          <p>{PRODUCT.modelScope} <Link href="/intelligence#model-fit">See MoodMap’s model and its limits.</Link></p>
        </GuideSection>

        <GuideSection id="support" title="Use the context well">
          <ul>
            <li><strong>Agree on what helps.</strong> Use the cycle information she chooses to share.</li>
            <li><strong>Keep the actual issue in view.</strong> A phase does not invalidate a concern or make an important conversation unnecessary.</li>
            <li><strong>Follow mutual interest.</strong> Flirting and intimacy work through her response, not a date on a calendar.</li>
          </ul>
          <p>If symptoms disrupt daily life, encourage professional advice. The <a href="https://womenshealth.gov/menstrual-cycle/premenstrual-syndrome" target="_blank" rel="noopener noreferrer">OWH guidance explains when to seek help</a>, including for severe premenstrual symptoms.</p>
          <p>For more detail, read <Link href="/learn/support-partner-during-pms">how to support a partner during PMS</Link> or the <Link href="/learn/luteal-phase-relationships">luteal-phase relationship guide</Link>.</p>
        </GuideSection>
        <GuideFAQ items={FAQ} />
        <div className={styles.sources}><SourceTrustBlock path={SLUG} /></div>
        <GuideStoreLinks path={SLUG} />
        <GuideRelated items={[{ href: "/learn/period-tracking-for-men", label: "Period tracking for men" }, { href: "/learn/menstrual-cycle-day-by-day-for-partners", label: "A 28-day cycle overview" }, { href: "/learn/fertile-window-explained", label: "Fertile-window context and its limits" }]} />
      </GuideArticle>
    </>
  );
}
