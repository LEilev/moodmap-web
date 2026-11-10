import Link from "next/link";
import { FaApple, FaGooglePlay } from "react-icons/fa";
import { CONTENT_UPDATES, PRODUCT, displayDate } from "../lib/product";
import styles from "./GuideArticle.module.css";

export { styles as guideStyles };

export default function GuideArticle({ path, title, lead, contents = [], children }) {
  const updated = CONTENT_UPDATES[path];
  return (
    <main className={styles.page}>
      <article className={styles.article}>
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
          <ol><li><Link href="/">MoodMap</Link></li><li><Link href="/learn">Guides</Link></li><li aria-current="page">{title}</li></ol>
        </nav>
        <header className={styles.header}>
          <p className={styles.eyebrow}>A practical guide for partners</p>
          <h1>{title}</h1>
          <p className={styles.lead}>{lead}</p>
          <p className={styles.byline}>
            By <Link href="/about#maker">MoodMap editorial</Link>
            {updated && <> <span aria-hidden="true">·</span> Updated <time dateTime={updated}>{displayDate(updated)}</time></>}
          </p>
        </header>
        {contents.length > 0 && (
          <nav className={styles.contents} aria-label="On this page">
            <p>In this guide</p>
            <ul>{contents.map(({ href, label }) => <li key={href}><a href={href}>{label}</a></li>)}</ul>
          </nav>
        )}
        <div className={styles.content}>{children}</div>
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
      <p className={styles.downloadTitle}>{title}</p>
      <div className={styles.storeLinks}>
        <a href={PRODUCT.appStoreUrl} aria-label="Download MoodMap on the App Store"><FaApple aria-hidden="true" /><span>App Store</span></a>
        <a href={PRODUCT.playStoreUrl} aria-label="Get MoodMap on Google Play"><FaGooglePlay aria-hidden="true" /><span>Google Play</span></a>
      </div>
      <p className={styles.finePrint}>Free to download. Optional Premium+ subscription.</p>
    </div>
  );
}

export function GuideProductExample({ path, image, alt, title, children }) {
  return (
    <section className={styles.product} aria-label="MoodMap app example">
      <div>
        <p className={styles.eyebrow}>From the overview to today</p>
        <h2>{title}</h2>
        {children}
        <GuideStoreLinks path={path} placement="guide-inline" title="Try a daily read" />
      </div>
      <figure>
        <img src={image} alt={alt} width={828} height={1792} loading="lazy" decoding="async" />
        <figcaption>An example from the app. Cycle context and capacity are estimates.</figcaption>
      </figure>
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
