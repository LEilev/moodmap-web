// FILE: src/app/pro/page.js
import Link from "next/link";
import {
  Crown,
  ShieldCheck,
  Sparkles,
  HeartHandshake,
  BellRing,
  LineChart,
} from "lucide-react";

/**
 * ⛔️ Ikke endre signatur/logikk – behold betalingsflyten urørt.
 * Forwarder via/ref/utm osv. til /buy som før.
 */
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
    desc: "Know when to lean in, give space, or add warmth—without guesswork.",
  },
  {
    icon: BellRing,
    title: "Smart Timing Alerts",
    desc: "Heads‑up for PMS, ovulation, and tricky windows so you stay in sync.",
  },
  {
    icon: LineChart,
    title: "Hormone‑Aware Guidance",
    desc: "Clear, respectful explanations tied to cycle‑phase—no fluff.",
  },
  {
    icon: ShieldCheck,
    title: "Calm & Clarity",
    desc: "Short, honest notes that reduce friction and build trust daily.",
  },
];

export default function ProPage({ searchParams }) {
  return (
    <div className="relative isolate">
      {/* ───────── Premium glows (sterkere) ───────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div
          className="absolute -top-28 -right-28 h-96 w-96 rounded-full blur-3xl opacity-50 mix-blend-screen"
          style={{
            background:
              "radial-gradient(closest-side, rgba(255,255,255,0.6), rgba(255,255,255,0))",
          }}
        />
        <div
          className="absolute -bottom-32 -left-32 h-[28rem] w-[28rem] rounded-full blur-3xl opacity-45 mix-blend-screen"
          style={{
            background:
              "radial-gradient(closest-side, rgba(180,220,255,0.45), rgba(255,255,255,0))",
          }}
        />
      </div>

      {/* ───────── Hero ───────── */}
      <section className="px-6 pt-16 pb-12 sm:pt-20 sm:pb-16">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full bg-white/12 ring-1 ring-white/20 px-3 py-1 text-sm font-medium">
            <Crown className="h-4 w-4" aria-hidden />
            <span>MoodMap Pro</span>
          </div>

          <h1 className="text-balance text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
            Premium guidance for better timing, connection, and calm.
          </h1>

          <p className="mt-5 text-pretty text-base sm:text-lg text-white/85">
            Unlock daily, phase‑aware tips and survival cues—designed to make
            relationships smoother and more secure, day by day.
          </p>

          {/* CTAs – mer kontrast + dybde */}
          <div className="mt-8 flex flex-col sm:flex-row items-stretch justify-center gap-3 sm:gap-4">
            {/* Yearly – emerald gradient (pop) */}
            <Link
              href={buildPlanHref("yearly", searchParams)}
              prefetch={false}
              aria-label="Choose Yearly plan"
              className="group inline-flex items-center justify-center rounded-xl px-7 py-4 text-base font-semibold
                         text-white bg-gradient-to-r from-emerald-400 to-emerald-500
                         shadow-[0_10px_30px_rgba(16,185,129,0.35)] ring-1 ring-emerald-300/40
                         transition will-change-transform hover:translate-y-[-1px] hover:shadow-[0_14px_40px_rgba(16,185,129,0.45)]
                         focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300/80"
            >
              <span className="inline-flex items-center gap-2">
                <Crown className="h-5 w-5" aria-hidden />
                Go Pro – Yearly
              </span>
              <span className="ml-2 inline-flex items-center rounded-full border border-white/30 bg-white/10 px-2 py-0.5 text-xs font-semibold">
                Best value
              </span>
            </Link>

            {/* Monthly – blå gradient (like “klikkbar” som Yearly) */}
            <Link
              href={buildPlanHref("monthly", searchParams)}
              prefetch={false}
              aria-label="Choose Monthly plan"
              className="inline-flex items-center justify-center rounded-xl px-7 py-4 text-base font-semibold
                         text-white bg-gradient-to-r from-blue-500 to-blue-600
                         shadow-[0_10px_30px_rgba(59,130,246,0.35)] ring-1 ring-blue-300/45
                         transition will-change-transform hover:translate-y-[-1px] hover:shadow-[0_14px_40px_rgba(59,130,246,0.45)]
                         focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300/80"
            >
              <Sparkles className="mr-2 h-5 w-5" aria-hidden />
              Go Pro – Monthly
            </Link>
          </div>

          <p className="mt-3 text-xs text-white/70">
            Works with your existing app. Cancel anytime. Private & secure.
          </p>
        </div>
      </section>

      {/* ───────── Value Strip ───────── */}
      <section className="px-6 pb-8">
        <div className="mx-auto max-w-5xl rounded-2xl border border-white/12 bg-black/25 backdrop-blur-sm px-6 py-5 sm:py-6">
          <p className="text-center text-sm sm:text-base text-white/90">
            “Understand what’s happening in her body, and you’ll understand what
            your relationship needs today.” — The core of MoodMap Pro.
          </p>
        </div>
      </section>

      {/* ───────── Features: mørke glass-kort ───────── */}
      <section className="px-6 pb-20 sm:pb-24">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-2xl bg-black/30 text-white p-6 shadow-xl ring-1 ring-white/10 backdrop-blur-sm
                         transition hover:-translate-y-0.5 hover:shadow-2xl"
            >
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
                <Icon className="h-5 w-5" aria-hidden />
              </div>
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="mt-1.5 text-sm text-white/80">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───────── Secondary CTA (med farger) ───────── */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-3xl rounded-2xl border border-white/12 bg-black/25 p-6 sm:p-8 text-center backdrop-blur-sm">
          <h2 className="text-2xl sm:text-3xl font-bold">Ready when you are.</h2>
          <p className="mt-2 text-white/85">
            Two simple options. Same unlock. Pick what fits you best.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-stretch justify-center gap-3 sm:gap-4">
            <Link
              href={buildPlanHref("yearly", searchParams)}
              prefetch={false}
              aria-label="Choose Yearly plan (Best value)"
              className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-base font-semibold
                         text-white bg-gradient-to-r from-emerald-400 to-emerald-500 ring-1 ring-emerald-300/45
                         shadow-[0_8px_24px_rgba(16,185,129,0.35)] transition hover:translate-y-[-1px] hover:shadow-[0_12px_32px_rgba(16,185,129,0.45)]
                         focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300/80"
            >
              <Crown className="mr-2 h-5 w-5" aria-hidden />
              Yearly – Best value
            </Link>

            <Link
              href={buildPlanHref("monthly", searchParams)}
              prefetch={false}
              aria-label="Choose Monthly plan"
              className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-base font-semibold
                         text-white bg-gradient-to-r from-blue-500 to-blue-600 ring-1 ring-blue-300/45
                         shadow-[0_8px_24px_rgba(59,130,246,0.35)] transition hover:translate-y-[-1px] hover:shadow-[0_12px_32px_rgba(59,130,246,0.45)]
                         focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300/80"
            >
              Monthly
            </Link>
          </div>

          <div className="mt-4 inline-flex items-center justify-center gap-2 text-xs text-white/75">
            <ShieldCheck className="h-4 w-4" aria-hidden />
            <span>Private by design. Nothing medical. Just better timing.</span>
          </div>
        </div>
      </section>
    </div>
  );
}
