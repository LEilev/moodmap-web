// src/app/learn/page.js
import Link from "next/link";
import { Shield, Sparkles, Map, HeartHandshake } from "lucide-react";

export const metadata = {
  title: "Guides · MoodMap",
  description:
    "Short, high-signal guides for partners: PMS support, cycle phases, and fertile window context. Relationship guidance, not medical advice.",
  alternates: {
    canonical: "/learn",
  },
};

export default function LearnIndexPage() {
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "MoodMap Guides",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "How to support your partner during PMS",
        url: "https://moodmap-app.com/learn/support-partner-during-pms",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Menstrual cycle phases explained for partners",
        url: "https://moodmap-app.com/learn/menstrual-cycle-phases-for-partners",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Fertile window explained for partners",
        url: "https://moodmap-app.com/learn/fertile-window-explained",
      },
    ],
  };

  const guides = [
    {
      Icon: HeartHandshake,
      title: "Support during PMS",
      copy: "What helps, what backfires, and how timing changes the day.",
      href: "/learn/support-partner-during-pms",
    },
    {
      Icon: Map,
      title: "Cycle phases (partner-friendly)",
      copy: "A clean model of the cycle and what it can mean in real life.",
      href: "/learn/menstrual-cycle-phases-for-partners",
    },
    {
      Icon: Sparkles,
      title: "Fertile window (context, not creepiness)",
      copy: "What it means, how it relates to ovulation, and how to stay respectful.",
      href: "/learn/fertile-window-explained",
    },
  ];

  return (
    <main className="relative isolate bg-primary-blue text-white">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />

      {/* Subtle premium glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 -top-24 h-[34rem] w-[34rem] rounded-full bg-gradient-to-br from-emerald-400/18 to-blue-500/18 blur-[160px] sm:blur-[210px] md:opacity-30 -z-10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-44 top-28 h-[36rem] w-[36rem] rounded-full bg-gradient-to-tr from-blue-500/18 to-emerald-400/16 blur-[180px] sm:blur-[240px] md:opacity-30 -z-10"
      />

      <section className="px-6 pt-12 pb-14 sm:pt-16">
        <div className="mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs sm:text-sm text-white/70 ring-1 ring-white/12 backdrop-blur">
            <Shield className="h-4 w-4 opacity-90" aria-hidden />
            Relationship guidance — not medical advice
          </div>

          <h1 className="mt-6 text-balance text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
            Guides
          </h1>

          <p className="mt-4 mx-auto max-w-2xl text-pretty text-base sm:text-lg text-white/75 leading-relaxed">
            Short, high-signal partner guides. No fluff. Built to answer the questions people
            actually ask — and to keep things respectful.
          </p>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 text-left">
            {guides.map(({ Icon, title, copy, href }) => (
              <Link
                key={href}
                href={href}
                className="glass-card glass-card-hover p-6 group block"
              >
                <span className="glass-icon transition-transform duration-300 group-hover:scale-[1.03]">
                  <Icon className="h-6 w-6 text-white drop-shadow" aria-hidden />
                </span>
                <h2 className="mt-3 text-base sm:text-lg font-semibold text-white">
                  {title}
                </h2>
                <p className="mt-2 text-sm sm:text-[15px] text-white/70 leading-relaxed">
                  {copy}
                </p>
                <div aria-hidden="true" className="glass-gloss" />
              </Link>
            ))}
          </div>

          <div className="mt-10">
            <Link href="/#download" className="btn-primary">
              Download MoodMap
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
