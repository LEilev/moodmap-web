import Link from "next/link";
import { AlertTriangle, HeartHandshake, MessageCircle, Moon, Shield, Sparkles } from "lucide-react";
import {
  OG_IMAGE_SRC,
  SourceTrustBlock,
  articleJsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
} from "../../seo";

const SLUG = "/learn/pms-relationship-timing";
const META_DESCRIPTION =
  "PMS relationship timing for partners: reduce pressure, choose cleaner support, pace hard conversations, and repair without making the room heavier.";

export const metadata = {
  title: "PMS Relationship Timing Guide for Partners",
  description: META_DESCRIPTION,
  alternates: { canonical: SLUG },
  openGraph: {
    title: "MoodMap PMS Relationship Timing Guide for Partners",
    description: META_DESCRIPTION,
    url: SLUG,
    type: "article",
    images: [OG_IMAGE_SRC],
  },
  twitter: {
    card: "summary_large_image",
    title: "MoodMap PMS Relationship Timing Guide for Partners",
    description: META_DESCRIPTION,
    images: [OG_IMAGE_SRC],
  },
};

const TIMING_RULES = [
  {
    icon: AlertTriangle,
    title: "Do not open the biggest topic at the loudest hour",
    body: "If the room is already narrow, your need for immediate closure can become the accelerant. Park the issue cleanly and return when the margin is better.",
  },
  {
    icon: HeartHandshake,
    title: "Make support concrete",
    body: "Food, warmth, lower light, fewer tasks, and one practical assist usually beat a motivational speech. PMS support works best when it is simple and unannounced.",
  },
  {
    icon: MessageCircle,
    title: "Use fewer words with cleaner tone",
    body: "Tone, timing, and ambiguity can carry more weight. Make the message shorter, kinder, and easier to absorb.",
  },
  {
    icon: Moon,
    title: "Protect recovery",
    body: "Sleep, space, sensory load, and practical quiet matter. A late-night repair attempt can become another stressor if the body is already asking for less.",
  },
];

const DO_DONT = [
  ["Do", "Lower pressure before you ask for closeness."],
  ["Do", "Use direct, warm language instead of hints."],
  ["Do", "Close practical loops without making them a performance."],
  ["Do", "Let a hard topic wait if the hour is bad."],
  ["Avoid", "Debating whether she is being rational."],
  ["Avoid", "Chasing reassurance because you feel uncomfortable."],
  ["Avoid", "Making one sharp comment and then calling it a joke."],
  ["Avoid", "Treating PMS as permission to dismiss what she says."],
];

const FAQ = [
  {
    q: "What is PMS relationship timing?",
    a: "PMS relationship timing means choosing lower-pressure support, cleaner tone, and better timing when capacity and stress buffer may be lower before menstruation.",
  },
  {
    q: "How do I support my partner during PMS without walking on eggshells?",
    a: "Do not become timid or fake. Become cleaner: lower pressure, reduce practical load, keep tone warm, avoid sarcasm, and ask simple questions instead of forcing a long talk.",
  },
  {
    q: "Should serious conversations be avoided during PMS?",
    a: "Not always. Some conversations still need to happen. But timing, tone, length, and pressure matter more when the room has less margin.",
  },
  {
    q: "Does PMS excuse bad behavior?",
    a: "No. MoodMap does not excuse harmful behavior or erase responsibility. It gives timing context so a partner can avoid making a difficult window heavier.",
  },
];

export default function PmsRelationshipTimingPage() {
  const articleSchema = articleJsonLd({
    path: SLUG,
    headline: "PMS Relationship Timing Guide for Partners",
    description: META_DESCRIPTION,
  });
  const breadcrumbSchema = breadcrumbJsonLd([
    { name: "Home", href: "/" },
    { name: "Learn", href: "/learn" },
    { name: "PMS relationship timing", href: SLUG },
  ]);
  const faqSchema = faqJsonLd(FAQ);

  return (
    <main className="relative isolate bg-primary-blue text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div aria-hidden="true" className="pointer-events-none absolute -left-40 -top-24 h-[34rem] w-[34rem] rounded-full bg-gradient-to-br from-emerald-400/18 to-blue-500/18 blur-[170px] sm:blur-[220px] md:opacity-30 -z-10" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-44 top-28 h-[36rem] w-[36rem] rounded-full bg-gradient-to-tr from-blue-500/18 to-emerald-400/16 blur-[180px] sm:blur-[240px] md:opacity-30 -z-10" />

      <section className="px-6 pt-12 pb-10 sm:pt-16 sm:pb-12">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs sm:text-sm text-white/70 ring-1 ring-white/12 backdrop-blur">
            <Sparkles className="h-4 w-4 opacity-90" aria-hidden />
            PMS timing guide for partners
          </div>
          <h1 className="mt-6 text-balance text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
            PMS relationship timing
          </h1>
          <p className="mt-4 mx-auto max-w-2xl text-pretty text-base sm:text-lg text-white/75 leading-relaxed">
            PMS support is not about guessing her mood. It is about reading lower-margin timing: less pressure, cleaner tone, practical support, and fewer avoidable sparks.
          </p>
        </div>
      </section>

      <section className="px-6 pb-16">
        <div className="mx-auto grid max-w-5xl gap-6">
          <article className="glass-card p-6 sm:p-7 text-left">
            <div className="flex items-start gap-4">
              <span className="glass-icon"><Shield className="h-6 w-6 text-white" aria-hidden /></span>
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold">The boundary</h2>
                <p className="mt-2 text-white/75 leading-relaxed">
                  PMS does not make a person irrational, and it does not give a partner permission to dismiss her. The useful move is simpler: respect the lower-margin window and stop adding unnecessary pressure.
                </p>
              </div>
            </div>
          </article>

          <div className="grid gap-5 md:grid-cols-2">
            {TIMING_RULES.map(({ icon: Icon, title, body }) => (
              <article key={title} className="glass-card p-5 sm:p-6 text-left">
                <span className="glass-icon"><Icon className="h-5 w-5 text-white" aria-hidden /></span>
                <h2 className="mt-4 text-lg font-semibold text-white">{title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-white/70">{body}</p>
              </article>
            ))}
          </div>

          <article className="glass-card p-6 sm:p-7 text-left">
            <h2 className="text-xl sm:text-2xl font-semibold">Do / avoid</h2>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {DO_DONT.map(([label, body]) => (
                <div key={`${label}-${body}`} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-100/60">{label}</p>
                  <p className="mt-1 text-sm leading-relaxed text-white/70">{body}</p>
                </div>
              ))}
            </div>
          </article>

          <section className="grid gap-4 md:grid-cols-2" aria-label="PMS relationship timing questions">
            {FAQ.map(({ q, a }) => (
              <article key={q} className="glass-card p-5 text-left">
                <h2 className="text-base font-semibold text-white">{q}</h2>
                <p className="mt-2 text-sm leading-relaxed text-white/68">{a}</p>
              </article>
            ))}
          </section>

          <SourceTrustBlock />

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/learn/support-partner-during-pms" className="btn-primary">
              PMS support guide
            </Link>
            <Link href="/learn/luteal-phase-relationships" className="mm-link text-sm text-white/76">
              Luteal phase relationships →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
