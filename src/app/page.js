import Link from "next/link";
import { ArrowRight, Heart, MessageCircle, Sun } from "lucide-react";
import StoreButtons from "../components/StoreButtons";
import { DEFAULT_META_DESCRIPTION, SITE_TITLE, mobileApplicationJsonLd } from "./seo";
import styles from "./Home.module.css";

export const metadata = {
  title: { absolute: SITE_TITLE },
  description: DEFAULT_META_DESCRIPTION,
  alternates: { canonical: "/" },
};

const BENEFITS = [
  {
    title: "Make the day easier.",
    label: "Everyday support",
    text: "A heads-up on possible shifts in energy and mood, with practical ways to help.",
    Icon: Sun,
  },
  {
    title: "Find a better way in.",
    label: "Better conversations",
    text: "A little perspective before you take something personally or bring up a difficult topic.",
    Icon: MessageCircle,
  },
  {
    title: "Keep the spark alive.",
    label: "Sex & intimacy",
    text: "Ideas for flirting and building closeness, with her interest and response leading the way.",
    Icon: Heart,
  },
];

// An editorial illustration, not a chart, prediction or reproduction of the app.
function CycleIllustration() {
  return (
    <figure className={styles.illustration}>
      <svg viewBox="0 0 560 540" fill="none" aria-hidden="true" focusable="false">
        <defs>
          <pattern id="mm-orbit-grain" width="6" height="6" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.6" fill="#16242a" opacity="0.09" />
          </pattern>
        </defs>
        <circle cx="280" cy="265" r="232" fill="#ede9df" />
        <circle cx="280" cy="265" r="232" fill="url(#mm-orbit-grain)" />
        <circle cx="280" cy="265" r="218" stroke="#16242a" strokeOpacity="0.14" strokeDasharray="1 11" />
        <path d="M 298 91 A 175 175 0 0 1 453 247" stroke="#d6b36d" strokeWidth="48" />
        <path d="M 454 281 A 175 175 0 0 1 298 439" stroke="#8eaa95" strokeWidth="48" />
        <path d="M 262 439 A 175 175 0 0 1 106 283" stroke="#a6a4b9" strokeWidth="48" />
        <path d="M 106 247 A 175 175 0 0 1 262 91" stroke="#d9a08f" strokeWidth="48" />
        <circle cx="280" cy="265" r="139" fill="#f5f2e9" stroke="#16242a" strokeOpacity="0.12" />
        <circle cx="280" cy="265" r="125" stroke="#16242a" strokeOpacity="0.13" />
        <path d="M 160 154 C 216 110 348 116 400 168" stroke="#16242a" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M 394 159 L 400 168 L 389 168" stroke="#16242a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 405 373 C 348 418 213 413 160 363" stroke="#16242a" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M 166 372 L 160 363 L 171 363" stroke="#16242a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 214 249 C 214 211 247 200 268 215 C 290 232 290 270 271 287 C 247 308 214 289 214 249Z" fill="#d9a08f" />
        <path d="M 263 249 C 263 211 296 200 317 215 C 339 232 339 270 320 287 C 296 308 263 289 263 249Z" stroke="#16242a" strokeWidth="3" />
        <path d="M 240 251 C 248 260 259 264 268 264" stroke="#16242a" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 290 251 C 298 260 309 264 318 264" stroke="#16242a" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="249" cy="238" r="2.7" fill="#16242a" />
        <circle cx="299" cy="238" r="2.7" fill="#16242a" />
        <text x="280" y="330" textAnchor="middle" fill="#526154" fontFamily="inherit" fontSize="11" fontWeight="650" letterSpacing="2.7">A LITTLE CLOSER</text>
        <path d="M 116 126 L 91 104 L 42 104" stroke="#927e72" strokeWidth="1" />
        <circle cx="116" cy="126" r="4" fill="#16242a" />
        <text x="42" y="92" fill="#16242a" fontFamily="inherit" fontSize="15" fontWeight="550">Mood</text>
        <path d="M 448 163 L 479 139 L 526 139" stroke="#927e72" strokeWidth="1" />
        <circle cx="448" cy="163" r="4" fill="#16242a" />
        <text x="526" y="127" textAnchor="end" fill="#16242a" fontFamily="inherit" fontSize="15" fontWeight="550">Energy</text>
        <path d="M 411 415 L 448 448 L 523 448" stroke="#927e72" strokeWidth="1" />
        <circle cx="411" cy="415" r="4" fill="#16242a" />
        <text x="523" y="472" textAnchor="end" fill="#16242a" fontFamily="inherit" fontSize="15" fontWeight="550">Connection</text>
        <path d="M 70 410 L 70 430 M 60 420 L 80 420" stroke="#526154" strokeWidth="1.2" />
        <path d="M 477 57 L 477 73 M 469 65 L 485 65" stroke="#927e72" strokeWidth="1.2" />
      </svg>
      <figcaption>Her cycle. Your daily perspective.</figcaption>
    </figure>
  );
}

export default function HomePage() {
  return (
    <main className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(mobileApplicationJsonLd("/")) }} />

      <section className={`${styles.hero} ${styles.container}`} aria-labelledby="home-heading">
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}><span aria-hidden="true" />Cycle awareness, for men</p>
          <h1 id="home-heading">Understand<br />her cycle.<br /><em>Show up better.</em></h1>
          <p className={styles.lead}>Get a quick daily read of what her cycle may mean for mood, energy and intimacy—with practical guidance for your response.</p>
          <StoreButtons />
          <p className={styles.availability}>Free to download. Optional Premium+ in the app.</p>
        </div>
        <CycleIllustration />
      </section>

      <section id="product" className={styles.product} aria-labelledby="product-heading">
        <div className={styles.container}>
          <div className={styles.sectionHeading}>
            <p className={styles.eyebrow}>The everyday difference</p>
            <h2 id="product-heading">Small insights.<br /><em>Better moments.</em></h2>
          </div>
          <div className={styles.benefits}>
            {BENEFITS.map(({ title, label, text, Icon }) => (
              <article key={label}>
                <div className={styles.benefitLabel}><Icon size={21} strokeWidth={1.5} aria-hidden="true" /><span>{label}</span></div>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className={`${styles.start} ${styles.container}`} aria-labelledby="start-heading">
        <div className={styles.startPanel}>
          <div className={styles.startCopy}>
            <p className={styles.eyebrow}>A simple place to start</p>
            <h2 id="start-heading">One date.<br /><em>A new perspective.</em></h2>
            <p>Start with a period date your partner chooses to share. Set your cycle preferences, then open MoodMap for your daily read.</p>
            <Link className={styles.textLink} href="/intelligence">How the cycle model works <ArrowRight size={17} aria-hidden="true" /></Link>
          </div>
          <div className={styles.downloadPanel}>
            <span className={styles.downloadMark} aria-hidden="true"><Heart size={30} strokeWidth={1.4} /></span>
            <p className={styles.downloadTitle}>A little more understanding.<br />Every day.</p>
            <StoreButtons compact />
            <Link className={styles.premiumLink} href="/pro" data-mm-placement="home-end" data-mm-context="/">Explore Premium+ <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
        </div>
        <p className={styles.boundary}>Cycle estimates, not a measurement of how she feels. Her words and boundaries come first. Not medical or fertility advice.</p>
      </section>
    </main>
  );
}
