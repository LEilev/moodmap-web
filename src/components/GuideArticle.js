import Link from "next/link";
import { FaApple, FaGooglePlay } from "react-icons/fa";
import { CONTENT_UPDATES, PRODUCT, displayDate } from "../lib/product";
import styles from "./GuideArticle.module.css";

export { styles as guideStyles };

export default function GuideArticle({ path, title, lead, readingTime, takeaway, contents = [], children }) {
  const updated = CONTENT_UPDATES[path];
  return (
    <main className={styles.page}>
      <article className={styles.article}>
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
          <ol><li><Link href="/">MoodMap</Link></li><li><Link href="/learn">Guides</Link></li><li aria-current="page">{title}</li></ol>
        </nav>
        <header className={styles.header}>
          <p className={styles.eyebrow}>The MoodMap guides <span aria-hidden="true">/</span> For partners</p>
          <h1>{title}</h1>
          <p className={styles.lead}>{lead}</p>
          <p className={styles.byline}>
            By <Link href="/about#maker">MoodMap editorial</Link>
            {updated && <> <span aria-hidden="true">·</span> Updated <time dateTime={updated}>{displayDate(updated)}</time></>}
            {readingTime && <> <span aria-hidden="true">·</span> <span>{readingTime}</span></>}
          </p>
          {takeaway && <div className={styles.takeaway}><span>The short answer</span><p>{takeaway}</p></div>}
        </header>
        <div className={contents.length ? styles.readingLayout : styles.singleColumn}>
        {contents.length > 0 && (
          <nav className={styles.contents} aria-label="On this page">
            <p>In this guide</p>
            <ul>{contents.map(({ href, label }, index) => <li key={href}><a href={href}><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>{label}</a></li>)}</ul>
            <Link className={styles.allGuides} href="/learn">All guides <span aria-hidden="true">↗</span></Link>
          </nav>
        )}
        <div className={styles.content}>{children}</div>
        </div>
      </article>
    </main>
  );
}

export function GuideSection({ id, title, children }) {
  return <section id={id} className={styles.section}><h2>{title}</h2>{children}</section>;
}

export function GuideStoreLinks({ path, placement = "guide-end", title = "Get your daily read in MoodMap" }) {
  return (
    <div className={styles.download} data-mm-placement={placement} data-mm-context={path}>
      <span className={styles.downloadLabel}>A little more understanding. Every day.</span>
      <p className={styles.downloadTitle}>{title}</p>
      <div className={styles.storeLinks}>
        <a href={PRODUCT.appStoreUrl} aria-label="Download MoodMap on the App Store"><FaApple aria-hidden="true" /><span>App Store</span></a>
        <a href={PRODUCT.playStoreUrl} aria-label="Get MoodMap on Google Play"><FaGooglePlay aria-hidden="true" /><span>Google Play</span></a>
      </div>
      <p className={styles.finePrint}>Free to download. Optional Premium+ subscription.</p>
    </div>
  );
}

// Screenshots intentionally stay out until current, verified app assets are available.
// Older guide callers may still pass image/alt props; neither is rendered.
export function GuideProductExample({ path, title, children }) {
  return (
    <section className={styles.product} aria-label="MoodMap daily guidance">
      <div>
        <p className={styles.eyebrow}>Put cycle context into practice</p>
        <h2>{title}</h2>
        {children}
        <GuideStoreLinks path={path} placement="guide-inline" title="Try a daily read" />
      </div>
    </section>
  );
}

export function GuideFAQ({ items }) {
  return (
    <GuideSection id="questions" title="Common questions">
      <div className={styles.faq}>
        {items.map(({ q, a }) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}
      </div>
    </GuideSection>
  );
}

export function GuideRelated({ items }) {
  return <nav className={styles.related} aria-label="Related guides"><h2>Keep exploring</h2><ul>{items.map(({ href, label }) => <li key={href}><Link href={href}>{label}<span aria-hidden="true"> →</span></Link></li>)}</ul></nav>;
}
