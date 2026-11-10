import Link from "next/link";
import GuideArticle, {
  GuideFAQ,
  GuideProductExample,
  GuideRelated,
  GuideSection,
  GuideStoreLinks,
  guideStyles as styles,
} from "../../../components/GuideArticle";
import { PRODUCT } from "../../../lib/product";
import { OG_IMAGE_SRC, SourceTrustBlock, articleJsonLd, breadcrumbJsonLd, faqJsonLd } from "../../seo";

const SLUG = "/learn/menstrual-cycle-phases-for-partners";
const TITLE = "Menstrual cycle phases, explained for partners";
const DESCRIPTION = "Understand the four menstrual cycle phases, what your partner may notice, and practical ways to respond to changes in energy, comfort and connection.";

export const metadata = {
  title: "Menstrual Cycle Phases Guide for Partners",
  description: DESCRIPTION,
  alternates: { canonical: SLUG },
  openGraph: { title: TITLE, description: DESCRIPTION, url: SLUG, type: "article", images: [OG_IMAGE_SRC] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [OG_IMAGE_SRC] },
};

const PHASES = [
  { name: "Menstruation", timing: "The period begins", context: "Cramps, bleeding, fatigue or disrupted sleep may make comfort and a simpler day more welcome. Some people feel little change.", response: "Offer something specific: food, a heat pad, a handled task or quiet company. Ask which would help." },
  { name: "Follicular phase", timing: "From the start of the cycle toward ovulation", context: "As period symptoms ease, she may have more energy for plans or conversation. The timing and size of that change vary.", response: "Offer a plan you would both enjoy, then match the energy she actually has. More room in the day need not mean filling all of it." },
  { name: "Ovulation", timing: "An egg is released; the date varies", context: "Some people notice changes in energy, desire or physical sensations around this time. Others do not notice a distinct shift.", response: "If the interest is mutual, make room for flirting and connection. Let her response set the pace." },
  { name: "Luteal phase", timing: "After ovulation until the next period", context: "Before a period, some people experience tender breasts, bloating, tiredness, irritability or sleep changes. PMS is not the same for everyone.", response: "Take discomfort and tiredness seriously. Reduce a practical burden, keep your tone clear and agree when a longer conversation would work." },
];

const FAQ = [
  { q: "What are the four phases of the menstrual cycle?", a: "A common overview uses menstruation, the follicular phase, ovulation and the luteal phase. Menstruation overlaps the beginning of the follicular phase; the four-part view is a useful teaching framework. PMS can occur before a period and is not a separate phase experienced by everyone." },
  { q: "Why isn’t every cycle exactly 28 days?", a: "Cycle length varies between people and from one cycle to the next. A 28-day example cannot tell you an individual person’s ovulation date or how she will feel. Keep the dates current and use her own experience alongside any estimate." },
  { q: "Does ovulation affect mood or desire?", a: "Some people notice changes in energy or desire around ovulation; others notice little change. A calendar cannot tell you whether your partner wants sex, a conversation or a particular plan. Use any cycle context together with her words and response." },
  { q: "What is the difference between PMS and PMDD?", a: "PMS describes recurring physical and emotional symptoms before a period. PMDD is a more severe condition that can substantially disrupt daily life. Symptoms that interfere with work, relationships or wellbeing deserve professional assessment, rather than being explained away as a phase." },
  { q: "Should I track my partner’s cycle?", a: "Only use information she chooses to share, with a clear agreement about what would be helpful. She may prefer practical support without any tracking. A cycle estimate should never be used to dismiss her point or decide what she must be feeling." },
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
        lead="The cycle can be useful background for changes in mood, energy, comfort and connection. Start with the phase, then pay attention to the person in front of you. Here is a practical overview for partners."
        contents={[{ href: "#phase-overview", label: "The four phases" }, { href: "#everyday-examples", label: "Everyday examples" }, { href: "#cycle-variation", label: "When timing varies" }, { href: "#questions", label: "Common questions" }]}>
        <GuideSection id="phase-overview" title="The cycle at a glance">
          <div className={styles.summary}><p><strong>A useful sequence:</strong> notice the possible background, check what is happening today, then choose a helpful response. You do not need to predict her mood to be better prepared.</p></div>
          <p>A common four-part overview is menstruation, follicular phase, ovulation and luteal phase. Menstruation sits within the start of the follicular phase. The <a href="https://www.nhs.uk/conditions/periods/fertility-in-the-menstrual-cycle/" target="_blank" rel="noopener noreferrer">NHS explains the underlying cycle and why dates vary</a>.</p>
          <div className={styles.phaseGrid}>
            {PHASES.map(({ name, timing, context, response }) => <article key={name} className={styles.phase}><span className={styles.phaseLabel}>{timing}</span><h3>{name}</h3><p>{context}</p><p><strong>A useful response:</strong> {response}</p></article>)}
          </div>
          <p className={styles.finePrint}>These are possible patterns, not a timetable for her personality. The <a href="https://womenshealth.gov/menstrual-cycle/premenstrual-syndrome" target="_blank" rel="noopener noreferrer">Office on Women’s Health describes how PMS symptoms vary</a>, including cycles with few or no symptoms.</p>
        </GuideSection>

        <GuideProductExample path={SLUG} image="/screenshots/web-2026/read-day.webp" alt="MoodMap daily screen with luteal phase context, an estimated capacity indicator, Intelligence, Risk and Direction." title="See what the phase may mean today">
          <p>{PRODUCT.summary}</p>
          <p>In this example, the daily screen puts possible luteal context alongside a practical direction: keep warmth and clarity together. It gives you a starting point for the day, while her actual mood and preferences still lead.</p>
          <p>Open the Brief for more context, or the <strong>Command Deck</strong> for PLAN, READ, BOND and SELF guidance.</p>
        </GuideProductExample>

        <GuideSection id="everyday-examples" title="What this can look like in everyday life">
          <div className={styles.stepGrid}>
            <article className={styles.step}><h3>She is tired and uncomfortable</h3><p>If cramps or a poor night’s sleep are part of the day, handle a concrete task before adding another decision. Ask whether she wants company, help or space.</p><p><strong>Try:</strong> “I can sort dinner. Would you rather have some company or a quiet hour?”</p></article>
            <article className={styles.step}><h3>There is more energy between you</h3><p>When she seems interested and has room for it, suggest something enjoyable. A positive response is more useful information than a predicted high-energy date.</p><p><strong>Try:</strong> “Fancy going out, or shall we make a good evening here?”</p></article>
            <article className={styles.step}><h3>A small exchange is getting sharper</h3><p>Notice your own volume and defensiveness. Her point can be valid even when either of you is tired. If you pause a discussion, agree when to return.</p><p><strong>Try:</strong> “I want to hear this properly. Can we take ten minutes and come back to it?”</p></article>
          </div>
          <p>These are practical relationship suggestions, not rules attached to a phase. Do not postpone an urgent decision or a necessary boundary while waiting for an “ideal” cycle day.</p>
        </GuideSection>

        <GuideSection id="cycle-variation" title="Why a 28-day chart is only an example">
          <p>Cycles vary, and an expected period date can move. A calendar model cannot establish when ovulation happened. If the dates are uncertain, the estimated phase is uncertain too.</p>
          <p>{PRODUCT.settingsSummary} Changing a setting keeps the estimate relevant to the information you have; it does not turn the model into a hormone measurement.</p>
          <p>{PRODUCT.modelScope} <Link href="/intelligence#model-fit">See MoodMap’s model and its limits.</Link></p>
        </GuideSection>

        <GuideSection id="support" title="Keep the information useful between you">
          <ul>
            <li><strong>Agree on what to share.</strong> A reminder should serve something she finds helpful.</li>
            <li><strong>Keep the actual issue in view.</strong> “You’re hormonal” does not answer a complaint or settle a disagreement.</li>
            <li><strong>Use intimacy as an invitation.</strong> A phase never provides permission or an obligation.</li>
            <li><strong>Take disruptive symptoms seriously.</strong> Encourage professional help if pain, mood changes or other symptoms interfere with daily life.</li>
          </ul>
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
