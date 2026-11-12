import Link from "next/link";
import StoreButtons from "../components/StoreButtons";
import { PRODUCT } from "../lib/product";
import { DEFAULT_META_DESCRIPTION, SITE_TITLE, mobileApplicationJsonLd } from "./seo";
import styles from "./Home.module.css";

export const metadata = {
  title: { absolute: SITE_TITLE },
  description: DEFAULT_META_DESCRIPTION,
  alternates: { canonical: "/" },
};

const BENEFITS = [
  {
    title: "Everyday support",
    text: "Find practical ways to help, make space or keep things simple.",
  },
  {
    title: "Better conversations",
    text: "Use the day’s context to check in and choose how you approach a topic.",
  },
  {
    title: "Sex & intimacy",
    text: "Guidance for flirting, sex and closeness, with mutual interest and consent at the centre.",
  },
];

export default function HomePage() {
  return (
    <main className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(mobileApplicationJsonLd("/")) }} />

      <div className={styles.container}>
        <section className={styles.hero} aria-labelledby="home-heading">
          <p className={styles.eyebrow}>Relationship timing for men</p>
          <h1 id="home-heading">Read the day<br /> <span>before you react.</span></h1>
          <p className={styles.lead}>{PRODUCT.summary}</p>
          <StoreButtons />
          <p className={styles.availability}>Free to download. Optional Premium+ in the app.</p>
        </section>

        <section id="product" className={styles.product} aria-labelledby="product-heading">
          <h2 id="product-heading">A little context. Better timing.</h2>
          <div className={styles.benefits}>
            {BENEFITS.map(({ title, text }, index) => (
              <article key={title}>
                <span className={styles.number} aria-hidden="true">0{index + 1}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="how-it-works" className={styles.start} aria-labelledby="start-heading">
          <div className={styles.startPanel}>
            <div className={styles.startCopy}>
              <h2 id="start-heading">Start with one date.</h2>
              <p>Use a period date your partner chooses to share. Adjust your cycle settings, open your daily read and use what helps.</p>
            </div>
            <StoreButtons compact />
          </div>

          <p className={styles.boundary}>
            MoodMap uses cycle estimates, not measurements of how she feels. Her words and boundaries come first. Not medical or fertility advice.
          </p>
          <nav className={styles.details} aria-label="Explore MoodMap" data-mm-placement="home-end" data-mm-context="/">
            <Link href="/intelligence">How the model works <span aria-hidden="true">↗</span></Link>
            <Link href="/pro">Premium+ <span aria-hidden="true">↗</span></Link>
            <Link href="/learn">Read the guides <span aria-hidden="true">↗</span></Link>
          </nav>
        </section>
      </div>
    </main>
  );
}
