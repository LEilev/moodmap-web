import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Brain,
  Gauge,
  Layers3,
  LineChart,
  ShieldCheck,
} from "lucide-react";

import ScrollReveal from "../../components/ScrollReveal";
import {
  OG_IMAGE_SRC,
  SourceTrustBlock,
  absoluteUrl,
  breadcrumbJsonLd,
  faqJsonLd,
  mobileApplicationJsonLd,
} from "../seo";

const SLUG = "/intelligence";
const META_DESCRIPTION =
  "See how MoodMap models cycle timing and relative hormone movement, then translates that context into possible effects on capacity, sensitivity, connection, and pace.";

export const metadata = {
  title: "Cycle Intelligence: Biology, Timing, and Possible Effects",
  description: META_DESCRIPTION,
  alternates: { canonical: SLUG },
  openGraph: {
    title: "MoodMap Cycle Intelligence",
    description: META_DESCRIPTION,
    url: SLUG,
    type: "website",
    images: [OG_IMAGE_SRC],
  },
  twitter: {
    card: "summary_large_image",
    title: "MoodMap Cycle Intelligence",
    description: META_DESCRIPTION,
    images: [OG_IMAGE_SRC],
  },
};

const MODEL_LAYERS = [
  {
    icon: LineChart,
    title: "Modeled hormone movement",
    body: "MoodMap estimates relative movement in estradiol, progesterone, testosterone, LH, and FSH from cycle timing. These are modeled patterns—not lab values.",
  },
  {
    icon: Gauge,
    title: "Cycle-based capacity",
    body: "The app translates the day into a practical estimate of bandwidth, recovery demand, and how much complexity or pressure may land cleanly.",
  },
  {
    icon: Layers3,
    title: "Biology → possible effects",
    body: "The intelligence layer connects the biological shift to possible effects on energy, sensitivity, connection, stress tolerance, and pace.",
  },
];

const SIGNALS = [
  ["Menstruation", "Bleeding, pain, fatigue, sleep disruption, and lower reserve may make practical comfort and recovery more relevant for some people."],
  ["Follicular rise", "Rising estradiol may coincide with more outward energy, easier initiation, and greater tolerance for plans or novelty for some people."],
  ["Ovulatory window", "The cycle may reach a stronger combined window for social energy, reward sensitivity, physical responsiveness, and sexual motivation—without determining any individual response."],
  ["Luteal phase", "Progesterone-led pacing and accumulating physical symptoms may make recovery, steadier rhythm, and lower logistical load more useful."],
  ["Late luteal / PMS", "Falling ovarian hormones, symptoms, and reduced stress buffer may make tone, ambiguity, noise, or unresolved friction carry more weight."],
];

const FAQ = [
  {
    q: "Does MoodMap measure hormones?",
    a: "No. MoodMap models expected relative hormone movement from cycle timing. It does not read lab values, wearables, or an individual person’s hormone levels.",
  },
  {
    q: "Does Cycle Intelligence predict how she feels?",
    a: "No. It shows modeled context that may be relevant to energy, sensitivity, capacity, and pace. It cannot determine an individual person’s mood, intent, or behavior.",
  },
  {
    q: "Why show biology and possible effects separately?",
    a: "The separation prevents the app from collapsing a biological pattern into a claim about a person. Biology describes the modeled cycle shift; possible effects describe what may become more or less likely for some people.",
  },
  {
    q: "Is this medical or fertility guidance?",
    a: "No. MoodMap is educational relationship-timing guidance. It is not diagnosis, contraception, fertility planning, hormone testing, or medical treatment.",
  },
];

export default function IntelligencePage() {
  const breadcrumbSchema = breadcrumbJsonLd([
    { name: "Home", href: "/" },
    { name: "Cycle Intelligence", href: SLUG },
  ]);
  const faqSchema = faqJsonLd(FAQ);
  const appSchema = mobileApplicationJsonLd(SLUG);
  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "MoodMap Cycle Intelligence",
    description: META_DESCRIPTION,
    url: absoluteUrl(SLUG),
    inLanguage: "en",
    about: [
      { "@type": "Thing", name: "Cycle Intelligence" },
      { "@type": "Thing", name: "Relationship timing" },
      { "@type": "Thing", name: "Menstrual cycle context" },
      { "@type": "Thing", name: "Modeled hormone movement" },
    ],
  };

  return (
    <main className="mm-page mm-v2-page mm-v2-subpage relative isolate overflow-hidden text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <ScrollReveal />
      <div aria-hidden="true" className="mm-background-field" />

      <section className="mm-v2-subhero mm-v2-subhero--orange">
        <div className="mm-container mm-v2-subhero__grid">
          <div className="mm-v2-subhero__copy" data-reveal>
            <span className="mm-section-label">Cycle Intelligence</span>
            <h1>Understand the signal behind the day.</h1>
            <p className="mm-v2-subhero__lead">
              Modeled hormone movement, translated into possible effects on energy, sensitivity, recovery demand, connection, and pace.
            </p>
            <p className="mm-v2-boundary">Context—not measurement, diagnosis, or certainty about an individual person.</p>
            <div className="mm-v2-subhero__actions">
              <Link href="/#download" className="mm-v2-primary-link">Download MoodMap <ArrowRight aria-hidden="true" /></Link>
              <Link href="/learn/cycle-aware-relationship-timing" className="mm-v2-secondary-link">Learn the category</Link>
            </div>
          </div>

          <div className="mm-v2-subhero__visual" data-reveal>
            <div className="mm-v2-subhero__badge mm-v2-subhero__badge--orange"><Brain aria-hidden="true" /><span>Biology → possible effects</span></div>
            <div className="mm-v2-poster mm-v2-poster--intelligence">
              <div className="mm-v2-poster__glow" aria-hidden="true" />
              <img
                src="/screenshots/web-2026/intelligence.webp"
                alt="MoodMap Intelligence screen showing Today’s Shift, Biology, Consequences, and a modeled hormone graph."
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mm-section mm-v2-value-section">
        <div className="mm-container">
          <div className="mm-v2-section-heading" data-reveal>
            <span className="mm-section-label">How the model is read</span>
            <h2>Three layers. Kept deliberately separate.</h2>
            <p>The graph is useful only when the model, the practical estimate, and the human boundary remain distinct.</p>
          </div>

          <div className="mm-v2-value-grid mm-v2-value-grid--three">
            {MODEL_LAYERS.map(({ icon: Icon, title, body }) => (
              <article key={title} data-reveal>
                <span><Icon aria-hidden="true" /></span>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mm-section mm-v2-signal-section">
        <div className="mm-container mm-v2-signal-grid">
          <div className="mm-v2-signal-intro" data-reveal>
            <span className="mm-v2-icon-chip"><Activity aria-hidden="true" /></span>
            <span className="mm-section-label">Across the cycle</span>
            <h2>The same move can carry different weight.</h2>
            <p>These windows are broad model contexts, not scripts for how any woman must feel or behave.</p>
          </div>

          <div className="mm-v2-signal-list" data-reveal>
            {SIGNALS.map(([phase, copy], index) => (
              <article key={phase}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div><h3>{phase}</h3><p>{copy}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mm-section mm-v2-boundary-section">
        <div className="mm-container">
          <div className="mm-v2-boundary-panel" data-reveal>
            <div>
              <span className="mm-v2-icon-chip"><ShieldCheck aria-hidden="true" /></span>
              <span className="mm-section-label">The human boundary</span>
              <h2>Cycle context never explains the whole person.</h2>
            </div>
            <div className="mm-v2-boundary-copy">
              <p>MoodMap does not record or monitor your partner’s actual mood. It does not tell you what she thinks, whether an issue is valid, or what consent looks like in the moment.</p>
              <p>Its narrower job is to help you notice background conditions that may change the cost of pressure, ambiguity, complexity, recovery, or pace—then respond more carefully.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mm-section mm-v2-faq mm-v2-faq--subpage">
        <div className="mm-container mm-v2-faq-grid">
          <div className="mm-v2-faq-intro" data-reveal>
            <span className="mm-section-label">Questions</span>
            <h2>Precise claims. Clear limits.</h2>
            <p>Cycle Intelligence is designed to add context without turning a model into certainty about a person.</p>
          </div>
          <div className="mm-v2-faq-list" data-reveal>
            {FAQ.map(({ q, a }, index) => (
              <details key={q} open={index === 0}>
                <summary>{q}</summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="mm-container pb-16 sm:pb-20">
        <div data-reveal>
          <SourceTrustBlock />
        </div>
        <div className="mt-8 text-center" data-reveal>
          <Link href="/pro" className="mm-v2-primary-link">See Premium+ <ArrowRight aria-hidden="true" /></Link>
        </div>
      </section>
    </main>
  );
}
