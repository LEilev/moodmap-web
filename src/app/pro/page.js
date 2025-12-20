// src/app/pro/page.js
import Link from "next/link";
import { Crown, ShieldCheck, HeartHandshake, BellRing, LineChart } from "lucide-react";

function buildPlanHref(planType, searchParams) {
  const qs = new URLSearchParams({
    type: planType === "yearly" ? "yearly" : "monthly",
  });

  const append = (key, value) => {
    if (value == null || value === "") return;
    if (key.toLowerCase() === "type") return;
    qs.append(key, String(value));
  };

  if (searchParams) {
    if (typeof searchParams.forEach === "function") {
      searchParams.forEach((v, k) => append(k, v));
    } else {
      Object.entries(searchParams).forEach(([k, v]) => {
        if (Array.isArray(v)) v.forEach((vv) => append(k, vv));
        else append(k, v);
      });
    }
  }
  return `/buy?${qs.toString()}`;
}

const FEATURES = [
  {
    icon: HeartHandshake,
    title: "Daily Connection Cues",
    desc: "Know when to reach out and when to give space — without the guesswork.",
  },
  {
    icon: BellRing,
    title: "Smart Timing Alerts",
    desc: "Heads-up for PMS, ovulation, and fertile windows so you stay in sync.",
  },
  {
    icon: LineChart,
    title: "Hormone-Aware Guidance",
    desc: "Clear, respectful explanations tailored to her current phase — no fluff.",
  },
  {
    icon: ShieldCheck,
    title: "Calm & Clarity",
    desc: "Short, honest notes that reduce friction and build trust over time.",
  },
];

export const metadata = {
  title: "Premium+ – MoodMap",
  description:
    "Premium+ daily guidance for better timing and deeper connection. Full access — nothing blurred. Cancel anytime.",
};

export default function ProPage({ searchParams }) {
  return (
    <main className="relative isolate bg-primary-blue text-white">
      {/* Premium glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 -top-24 h-[34rem] w-[34rem] rounded-full bg-gradient-to-br from-emerald-400/20 to-blue-500/20 blur-[160px] sm:blur-[200px] md:opacity-30 -z-10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-32 h-[36rem] w-[36rem] rounded-full bg-gradient-to-tr from-blue-500/20 to-emerald-400/18 blur-[170px] sm:blur-[220px] md:opacity-30 -z-10"
      />

      {/* Hero */}
      <section className="px-6 pt-14 pb-10 sm:pt-18 sm:pb-12">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 ring-1 ring-white/15 px-3 py-1 text-sm font-medium text-white/80">
            <Crown className="h-4 w-4" aria-hidden />
            <span>MoodMap Premium+</span>
          </div>

          <h1 className="text-balance text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
            <span className="bg-gradient-to-r from-emerald-300 via-emerald-400 to-blue-400 bg-clip-text text-transparent">
              Premium+ daily guidance for better timing and deeper connection.
            </span>
          </h1>

          <p className="mt-5 text-pretty text-base sm:text-lg text-white/75">
            Unlock phase-aware tips and cues that make each day smoother and your relationship more
            secure — day by day.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-stretch justify-center gap-3 sm:gap-4">
            {/* Yearly */}
            <Link
              href={buildPlanHref("yearly", searchParams)}
              prefetch={false}
              aria-label="Choose Yearly plan"
              className="group relative inline-flex items-center justify-center rounded-full px-7 py-4 text-base font-semibold
                         text-white bg-gradient-to-r from-emerald-400 to-emerald-500
                         shadow-[0_10px_30px_rgba(16,185,129,0.30)] ring-1 ring-emerald-300/40
                         transition will-change-transform hover:-translate-y-0.5 hover:shadow-[0_14px_40px_rgba(16,185,129,0.45)]
                         focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300/80"
            >
              <span className="inline-flex items-center gap-2">
                <Crown className="h-5 w-5" aria-hidden />
                Unlock Premium+ – Yearly
              </span>
              <span className="ml-2 inline-flex items-center rounded-full border border-white/30 bg-white/10 px-2 py-0.5 text-xs font-semibold">
                Best value
              </span>

              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.16), rgba(255,255,255,0.00))",
                }}
              />
            </Link>

            {/* Monthly */}
            <Link
              href={buildPlanHref("monthly", searchParams)}
              prefetch={false}
              aria-label="Choose Monthly plan"
              className="group relative inline-flex items-center justify-center rounded-full px-7 py-4 text-base font-semibold
                         text-white bg-gradient-to-r from-blue-500 to-blue-600
                         shadow-[0_10px_30px_rgba(59,130,246,0.30)] ring-1 ring-blue-300/45
                         transition will-change-transform hover:-translate-y-0.5 hover:shadow-[0_14px_40px_rgba(59,130,246,0.45)]
                         focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300/80"
            >
              Unlock Premium+ – Monthly
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.16), rgba(255,255,255,0.00))",
                }}
              />
            </Link>
          </div>

          <p className="mt-3 text-xs sm:text-sm text-white/60">
            Works with your existing free app. Cancel anytime. Your data stays private.
          </p>

          {/* NEW: explicit guidance + privacy clarification at decision point */}
          <p className="mt-2 text-xs sm:text-sm text-white/55">
            Relationship guidance — not medical advice. Not for contraception or fertility planning.
            No cycle details leave your device.
          </p>

          {/* NEW: explicit full-access promise (research) */}
          <p className="mt-2 text-xs sm:text-sm text-white/70">
            Full access. Nothing blurred or held back.
          </p>
        </div>
      </section>

      {/* Quote strip */}
      <section className="px-6 pb-10">
        <div className="mx-auto max-w-6xl">
          <div className="glass-card p-5 sm:p-6 text-center">
            <p className="text-sm sm:text-base text-white/80">
              “Understand what’s happening in her body, and you’ll understand what your relationship
              needs today.”
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 pb-12 sm:pb-16">
        <div className="mx-auto max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <article key={f.title} className="glass-card glass-card-hover p-6 text-left group">
                <span className="glass-icon">
                  <Icon className="h-6 w-6 text-white drop-shadow" aria-hidden />
                </span>
                <h3 className="text-base sm:text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm sm:text-[15px] text-white/70 leading-relaxed">{f.desc}</p>
                <div aria-hidden="true" className="glass-gloss" />
              </article>
            );
          })}
        </div>
      </section>

      {/* Secondary CTA */}
      <section className="px-6 pb-14">
        <div className="mx-auto max-w-4xl glass-card p-6 sm:p-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold">Ready for Premium+?</h2>
          <p className="mt-2 text-white/70">
            Two simple plans — same full access. Choose the one that fits you best:
          </p>

          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
            <Link
              href={buildPlanHref("yearly", searchParams)}
              prefetch={false}
              className="group relative inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold
                         text-white bg-gradient-to-r from-emerald-400 to-emerald-500 ring-1 ring-emerald-300/40
                         shadow-[0_10px_30px_rgba(16,185,129,0.30)] transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_40px_rgba(16,185,129,0.45)]
                         focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300/80"
            >
              <Crown className="mr-2 h-4 w-4" aria-hidden />
              Premium+ – Yearly (Best value)
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.16), rgba(255,255,255,0.00))",
                }}
              />
            </Link>

            <Link
              href={buildPlanHref("monthly", searchParams)}
              prefetch={false}
              className="group relative inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold
                         text-white bg-gradient-to-r from-blue-500 to-blue-600 ring-1 ring-blue-300/45
                         shadow-[0_10px_30px_rgba(59,130,246,0.30)] transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_40px_rgba(59,130,246,0.45)]
                         focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300/80"
            >
              Premium+ – Monthly
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.16), rgba(255,255,255,0.00))",
                }}
              />
            </Link>
          </div>

          {/* NEW: punchy “nothing blurred” line */}
          <p className="mt-4 text-sm text-white/70">
            Nothing blurred. Ever.
          </p>

          <p className="mt-4 inline-flex items-center gap-2 text-sm text-white/70 justify-center">
            <ShieldCheck className="h-4 w-4" aria-hidden />
            Private by design. Backed by real science, distilled for everyday life.
          </p>
        </div>

        <div className="mt-10 text-center">
          <Link href="/" className="btn-primary">
            ← Back to Home
          </Link>
        </div>
      </section>
    </main>
  );
}
