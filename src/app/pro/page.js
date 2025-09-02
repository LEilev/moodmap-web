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
 * ⛔️ Ikke endre denne signaturen/logikken.
 * Bevarer eksisterende oppførsel:
 *  - Setter type=yearly|monthly
 *  - Forwarder eksisterende query-parametre (via/ref/utm/*, gclid, fbclid, osv.)
 *  - Overskriver aldri 'type' fra URL – vår verdi vinner for å sikre korrekt kjøpsflyt
 *
 * Hvis du tidligere importerte denne fra en util-fil, fjern denne kopien
 * og importer din originale implementasjon. UI-koden nedenfor kaller bare
 * buildPlanHref(planType, searchParams).
 */
function buildPlanHref(planType, searchParams) {
  const qs = new URLSearchParams({
    type: planType === "yearly" ? "yearly" : "monthly",
  });

  // Forward alle innkommende parametre (inkl. via/ref/utm/*, gclid/fbclid/msclkid, etc.)
  // uten å overstyre 'type'.
  const append = (key, value) => {
    if (value == null || value === "") return;
    if (key.toLowerCase() === "type") return;
    qs.append(key, String(value));
  };

  if (searchParams) {
    // next/app-router: searchParams er et objekt {k: string | string[]}
    if (typeof searchParams.forEach === "function") {
      // URLSearchParams – forward direkte
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
      {/* ───────── Subtile premium‑glows ───────── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div
          className="absolute -top-24 -right-24 h-80 w-80 rounded-full blur-3xl opacity-30"
          style={{
            background:
              "radial-gradient(closest-side, rgba(255,255,255,0.28), rgba(255,255,255,0))",
          }}
        />
        <div
          className="absolute -bottom-28 -left-28 h-96 w-96 rounded-full blur-3xl opacity-25"
          style={{
            background:
              "radial-gradient(closest-side, rgba(255,255,255,0.18), rgba(255,255,255,0))",
          }}
        />
      </div>

      {/* ───────── Hero ───────── */}
      <section className="px-6 pt-16 pb-12 sm:pt-20 sm:pb-16">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-medium">
            <Crown className="h-4 w-4" aria-hidden />
            <span>MoodMap Pro</span>
          </div>

          <h1 className="leading-tight text-4xl sm:text-5xl md:text-6xl font-extrabold">
            Premium guidance for better timing, connection, and calm.
          </h1>

          <p className="mt-5 text-base sm:text-lg text-white/80">
            Unlock daily, phase‑aware tips and survival cues—designed to make
            relationships smoother and more secure, day by day.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-stretch justify-center gap-3 sm:gap-4">
            {/* Yearly – primary */}
            <Link
              href={buildPlanHref("yearly", searchParams)}
              className="group inline-flex items-center justify-center rounded-xl px-7 py-4 text-base font-semibold bg-white text-black ring-1 ring-white/20 shadow-xl transition
                         hover:shadow-2xl hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              prefetch={false}
              aria-label="Choose Yearly plan"
            >
              <span className="inline-flex items-center gap-2">
                <Crown className="h-5 w-5" aria-hidden />
                Go Pro – Yearly
              </span>
              <span className="ml-2 inline-flex items-center rounded-full bg-black text-white px-2 py-0.5 text-xs font-semibold">
                Best value
              </span>
            </Link>

            {/* Monthly – full styrke (IKKE disabled) */}
            <Link
              href={buildPlanHref("monthly", searchParams)}
              className="inline-flex items-center justify-center rounded-xl px-7 py-4 text-base font-semibold
                         bg-white/10 text-white ring-1 ring-inset ring-white/25 backdrop-blur transition
                         hover:bg-white/15 hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              prefetch={false}
              aria-label="Choose Monthly plan"
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
        <div className="mx-auto max-w-5xl rounded-2xl border border-white/15 bg-white/5 px-6 py-5 sm:py-6 backdrop-blur">
          <p className="text-center text-sm sm:text-base text-white/85">
            “Understand what’s happening in her body, and you’ll understand what
            your relationship needs today.” — The core of MoodMap Pro.
          </p>
        </div>
      </section>

      {/* ───────── Features ───────── */}
      <section className="px-6 pb-20 sm:pb-24">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-2xl bg-white text-black p-6 shadow-xl ring-1 ring-black/5 transition hover:shadow-2xl"
            >
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-black/5">
                <Icon className="h-5 w-5" aria-hidden />
              </div>
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="mt-1.5 text-sm text-black/70">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───────── Secondary CTA ───────── */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-3xl rounded-2xl border border-white/15 bg-white/5 p-6 sm:p-8 text-center backdrop-blur">
          <h2 className="text-2xl sm:text-3xl font-bold">Ready when you are.</h2>
          <p className="mt-2 text-white/80">
            Two simple options. Same unlock. Pick what fits you best.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-stretch justify-center gap-3 sm:gap-4">
            <Link
              href={buildPlanHref("yearly", searchParams)}
              className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-base font-semibold bg-white text-black ring-1 ring-white/20 shadow-lg transition hover:shadow-xl hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              prefetch={false}
              aria-label="Choose Yearly plan (Best value)"
            >
              <Crown className="mr-2 h-5 w-5" aria-hidden />
              Yearly – Best value
            </Link>
            <Link
              href={buildPlanHref("monthly", searchParams)}
              className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-base font-semibold bg-white/10 text-white ring-1 ring-inset ring-white/25 backdrop-blur transition hover:bg-white/15 hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              prefetch={false}
              aria-label="Choose Monthly plan"
            >
              Monthly
            </Link>
          </div>
          <div className="mt-4 inline-flex items-center justify-center gap-2 text-xs text-white/70">
            <ShieldCheck className="h-4 w-4" aria-hidden />
            <span>Private by design. Nothing medical. Just better timing.</span>
          </div>
        </div>
      </section>
    </div>
  );
}
