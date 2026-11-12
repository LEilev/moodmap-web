import Link from "next/link";
import { ArrowUpRight, BookOpenText } from "lucide-react";
import { breadcrumbJsonLd, pageMetadata } from "../seo";
import { PRODUCT } from "../../lib/product";
import styles from "./Learn.module.css";

export const metadata = pageMetadata({
  title: "Guides for Cycle-Aware Relationship Timing",
  description: "Understand menstrual cycle phases, period tracking for men, PMS support and intimacy. Practical guides for partners, from MoodMap.",
  path: "/learn",
});

const FEATURED = [
  {
    href: "/learn/menstrual-cycle-phases-for-partners",
    title: "Menstrual cycle phases, explained for partners",
    description: "The four phases, what may change, and what that can mean for everyday life together.",
    label: "Start with the basics",
    minutes: "5 min read",
  },
  {
    href: "/learn/period-tracking-for-men",
    title: "Period tracking for men",
    description: "What to enter, what to notice, and how to turn a little cycle context into a useful response.",
    label: "Put it into practice",
    minutes: "5 min read",
  },
];

const COLLECTIONS = [
  {
    title: "In everyday life",
    description: "Support, conversations and connection.",
    guides: [
      { href: "/learn/support-partner-during-pms", title: "How to support your partner during PMS", description: "Practical help, what to say, and when symptoms need more attention." },
      { href: "/learn/luteal-phase-relationships", title: "Luteal phase relationships", description: "Energy, comfort and communication after ovulation." },
      { href: "/learn/pms-relationship-timing", title: "PMS relationship timing", description: "Make room for a calmer conversation and a more useful response." },
      { href: "/learn/cycle-aware-relationship-timing", title: "Cycle-aware relationship timing", description: "Use timing as background for plans, support and intimacy." },
    ],
  },
  {
    title: "A little more depth",
    description: "The model, the app and the details.",
    guides: [
      { href: "/learn/menstrual-cycle-day-by-day-for-partners", title: "Menstrual cycle: a 28-day overview", description: "An illustrative cycle, with room for real-life variation." },
      { href: "/intelligence", title: "Cycle Intelligence", description: "How MoodMap builds its daily read, and where the model fits." },
      { href: "/learn/fertile-window-explained", title: "Fertile window explained for partners", description: "Ovulation, timing and the limits of calendar estimates." },
      { href: "/learn/why-moodmap", title: "Why MoodMap", description: "From cycle dates to a daily perspective on your relationship." },
      { href: "/learn/moodmap-glossary", title: "MoodMap glossary", description: "The Brief, Command Deck, Risk Radar and other app terms." },
    ],
  },
];

const GUIDES = [...FEATURED, ...COLLECTIONS.flatMap((collection) => collection.guides)];

export default function LearnIndexPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: GUIDES.map((guide, index) => ({
      "@type": "ListItem", position: index + 1, name: guide.title, url: `${PRODUCT.siteUrl}${guide.href}`,
    })),
  };
  const breadcrumbSchema = breadcrumbJsonLd([{ name: "Home", href: "/" }, { name: "Guides", href: "/learn" }]);

  return (
    <main className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div className={styles.container}>
        <header className={styles.header}>
          <p className={styles.eyebrow}><BookOpenText size={17} aria-hidden="true" /> MoodMap guides</p>
          <h1>The cycle, explained.<br /><em>For real life.</em></h1>
          <p className={styles.lead}>A little understanding can change how you show up. Start with the essentials, then explore what matters to you.</p>
        </header>

        <section aria-labelledby="essentials-heading">
          <h2 id="essentials-heading" className={styles.sectionLabel}>The essentials</h2>
          <div className={styles.featuredGrid}>
            {FEATURED.map(({ href, title, description, label, minutes }, index) => (
              <article key={href} className={styles.featuredCard}>
                <p className={styles.cardEyebrow}><span>0{index + 1}</span> {label}</p>
                <h3><Link href={href}>{title}</Link></h3>
                <p className={styles.cardDescription}>{description}</p>
                {index === 0 ? (
                  <div className={styles.phaseRibbon} aria-hidden="true">
                    {["Menstruation", "Follicular", "Ovulation", "Luteal"].map((phase) => <span key={phase}><i />{phase}</span>)}
                  </div>
                ) : (
                  <div className={styles.practiceLine} aria-hidden="true"><span>One date</span><b>→</b><span>Daily context</span><b>→</b><span>Your response</span></div>
                )}
                <div className={styles.cardFoot} aria-hidden="true"><span>Read the guide <ArrowUpRight size={17} /></span><small>{minutes}</small></div>
              </article>
            ))}
          </div>
        </section>

        <div className={styles.collections}>
          {COLLECTIONS.map(({ title, description, guides }) => (
            <section key={title} className={styles.collection} aria-label={title}>
              <header><h2>{title}</h2><p>{description}</p></header>
              <div className={styles.guideList}>
                {guides.map(({ href, title: guideTitle, description: guideDescription }) => (
                  <article key={href} className={styles.guideRow}>
                    <div><h3><Link href={href}>{guideTitle}</Link></h3><p>{guideDescription}</p></div>
                    <ArrowUpRight size={20} aria-hidden="true" />
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
        <p className={styles.note}>General cycle education and practical relationship ideas. Her own experience always comes first.</p>
      </div>
    </main>
  );
}
