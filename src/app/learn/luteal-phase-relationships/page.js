import Link from "next/link";
import { Brain, Gauge, HeartHandshake, MessageCircle, Shield, Sparkles } from "lucide-react";
import {
  OG_IMAGE_SRC,
  SourceTrustBlock,
  articleJsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
} from "../../seo";

const SLUG = "/learn/luteal-phase-relationships";
const META_DESCRIPTION =
  "A practical guide to luteal phase relationship timing: capacity, communication, stress sensitivity, support, intimacy, and lower-pressure repair.";

export const metadata = {
  title: "Luteal Phase Relationship Timing Guide",
  description: META_DESCRIPTION,
  alternates: { canonical: SLUG },
  openGraph: {
    title: "MoodMap Luteal Phase Relationship Timing Guide",
    description: META_DESCRIPTION,
    url: SLUG,
    type: "article",
    images: [OG_IMAGE_SRC],
  },
  twitter: {
    card: "summary_large_image",
    title: "MoodMap Luteal Phase Relationship Timing Guide",
    description: META_DESCRIPTION,
    images: [OG_IMAGE_SRC],
  },
};

const PRINCIPLES = [
  {
    icon: Gauge,
    title: "Capacity becomes the main read",
    body: "The luteal phase can make practical load, clutter, noise, and unresolved tasks feel denser. The cleaner partner move is often load reduction before explanation.",
  },
  {
    icon: MessageCircle,
    title: "Tone costs more than content",
    body: "A valid point can still land badly if the hour is wrong. Sarcasm, ambiguity, and closure pressure can become the real fight.",
  },
  {
    icon: HeartHandshake,
    title: "Reliability beats performance",
    body: "Grand gestures are less useful than follow-through: do the thing, close the loop, lower the room, and stop asking for credit while she is overloaded.",
  },
  {
    icon: Sparkles,
    title: "Intimacy needs a softer read",
    body: "Connection may still be there, but pace and comfort matter. A good partner reads openness instead of treating the phase like a yes or no switch.",
  },
];

const MOVES = [
  ["Reduce load", "Handle a practical task before it becomes another conversation."],
  ["Shorten the talk", "Make one point, keep tone clean, and return later if capacity narrows."],
  ["Stop closure-chasing", "Needing an answer now can turn your anxiety into her pressure."],
  ["Use warm proof", "Food, logistics, calm touch, and follow-through often say more than a speech."],
  ["Protect sleep and space", "Late-night heavy talks can punish both of you."],
  ["Read pace before intimacy", "Move slowly, accept no cleanly, and let connection stay safe."],
];

const FAQ = [
  {
    q: "What is the luteal phase in relationships?",
    a: "The luteal phase is the post-ovulation part of the cycle. In relationship timing, it can matter because capacity, stress sensitivity, recovery demand, and load tolerance may shift for some women.",
  },
  {
    q: "Does the luteal phase cause conflict?",
    a: "No. It does not cause conflict by itself. But a lower-margin day can make pressure, ambiguity, and unresolved load land harder, so timing and tone matter more.",
  },
  {
    q: "How should a boyfriend act during the luteal phase?",
    a: "Act steadier: reduce practical load, keep tone clean, avoid pressure, repair lightly, and choose better timing for heavy conversations.",
  },
  {
    q: "Is this medical advice?",
    a: "No. This is relationship-timing context, not diagnosis, hormone measurement, contraception, fertility planning, or treatment.",
  },
];

export default function LutealPhaseRelationshipsPage() {
  const articleSchema = articleJsonLd({
    path: SLUG,
    headline: "Luteal Phase Relationship Timing Guide",
    description: META_DESCRIPTION,
  });
  const breadcrumbSchema = breadcrumbJsonLd([
    { name: "Home", href: "/" },
    { name: "Learn", href: "/learn" },
    { name: "Luteal phase relationships", href: SLUG },
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
            <Brain className="h-4 w-4 opacity-90" aria-hidden />
            Luteal timing context
          </div>
          <h1 className="mt-6 text-balance text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
            Luteal phase relationships
          </h1>
          <p className="mt-4 mx-auto max-w-2xl text-pretty text-base sm:text-lg text-white/75 leading-relaxed">
            The luteal phase is where many wrong-hour conversations get expensive. The move is not to blame hormones — it is to read load, tone, capacity, and timing before you add more weight.
          </p>
        </div>
      </section>

      <section className="px-6 pb-16">
        <div className="mx-auto grid max-w-5xl gap-6">
          <article className="glass-card p-6 sm:p-7 text-left">
            <div className="flex items-start gap-4">
              <span className="glass-icon"><Shield className="h-6 w-6 text-white" aria-hidden /></span>
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold">Context, not blame</h2>
                <p className="mt-2 text-white/75 leading-relaxed">
                  Luteal timing is useful when it makes a man more careful, not when it gives him an excuse to dismiss her. The real job is cleaner support, cleaner tone, and fewer avoidable pressure loops.
                </p>
              </div>
            </div>
          </article>

          <div className="grid gap-5 md:grid-cols-2">
            {PRINCIPLES.map(({ icon: Icon, title, body }) => (
              <article key={title} className="glass-card p-5 sm:p-6 text-left">
                <span className="glass-icon"><Icon className="h-5 w-5 text-white" aria-hidden /></span>
                <h2 className="mt-4 text-lg font-semibold text-white">{title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-white/70">{body}</p>
              </article>
            ))}
          </div>

          <article className="glass-card p-6 sm:p-7 text-left">
            <h2 className="text-xl sm:text-2xl font-semibold">Cleaner luteal-phase moves</h2>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {MOVES.map(([title, body]) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <h3 className="text-sm font-semibold text-white">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-white/66">{body}</p>
                </div>
              ))}
            </div>
          </article>

          <section className="grid gap-4 md:grid-cols-2" aria-label="Luteal phase relationship questions">
            {FAQ.map(({ q, a }) => (
              <article key={q} className="glass-card p-5 text-left">
                <h2 className="text-base font-semibold text-white">{q}</h2>
                <p className="mt-2 text-sm leading-relaxed text-white/68">{a}</p>
              </article>
            ))}
          </section>

          <SourceTrustBlock />

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/learn/pms-relationship-timing" className="btn-primary">
              PMS relationship timing
            </Link>
            <Link href="/intelligence" className="mm-link text-sm text-white/76">
              Explore Hormone Graph Intelligence →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
