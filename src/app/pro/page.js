// src/app/pro/page.js
import Link from "next/link";
import {
  ArrowRight,
  BellRing,
  CheckCircle2,
  Crown,
  HeartHandshake,
  LineChart,
  ShieldCheck,
} from "lucide-react";

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

const VALUE_STACK = [
  {
    icon: HeartHandshake,
    title: "Full daily read",
    desc: "Phase, room read, friction risk, cleaner move, and the reason behind it — every day.",
  },
  {
    icon: BellRing,
    title: "Wrong-hour prevention",
    desc: "A heads-up before PMS, ovulation, reset windows, and high-friction days change the room.",
  },
  {
    icon: LineChart,
    title: "Cycle-aware outcomes",
    desc: "Support, conversation, restraint, and intimacy timing translated into practical moves.",
  },
  {
    icon: ShieldCheck,
    title: "Private boundaries",
    desc: "Built for his response. Not a medical tool, fertility tool, or verdict on her.",
  },
];

const INCLUDED = [
  "Phase and capacity context before he moves",
  "Room Read for what matters now",
  "Friction Risk for the move that can make it heavier",
  "Move + Reason so he knows what to do and why",
  "Intimacy timing context without guessing",
  "Phase guides with practical boundaries",
];

export const metadata = {
  title: "Premium+ – MoodMap",
  description:
    "Unlock MoodMap Premium+: the full daily read for phase, capacity, friction risk, and cleaner relationship timing.",
};

export default async function ProPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const yearlyHref = buildPlanHref("yearly", resolvedSearchParams);
  const monthlyHref = buildPlanHref("monthly", resolvedSearchParams);

  return (
    <main className="mm-page relative isolate overflow-hidden text-white">
      <div aria-hidden="true" className="mm-background-field" />

      <section className="mm-container py-14 sm:py-[4.5rem] lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.94fr_1.06fr] lg:items-center">
          <div data-reveal="true">
            <span className="mm-section-label">MoodMap Premium+</span>
            <h1 className="mt-6 max-w-3xl text-balance text-[clamp(3rem,7.2vw,5.8rem)] font-[860] leading-[0.9] tracking-[-0.075em] text-[#f5f2ea]">
              Unlock the full read before the wrong hour starts.
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-white/70 sm:text-lg">
              Premium+ gives him the complete daily read: phase, room read, friction risk,
              cleaner move, and the reason behind it — before timing turns expensive.
            </p>
            <p className="mt-4 inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-100/90">
              Context for his timing. Not a verdict on her.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={yearlyHref}
                prefetch={false}
                aria-label="Choose MoodMap Premium+ yearly plan"
                className="group inline-flex min-h-14 items-center justify-center rounded-full border border-emerald-300/35 bg-emerald-400/15 px-6 text-sm font-bold text-emerald-50 shadow-[0_24px_80px_rgba(0,0,0,0.42)] transition hover:-translate-y-0.5 hover:bg-emerald-400/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300/80"
              >
                <Crown className="mr-2 h-4 w-4" aria-hidden="true" />
                Choose yearly
                <span className="ml-2 rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-[11px] font-bold text-white/80">
                  Best value
                </span>
              </Link>

              <Link
                href={monthlyHref}
                prefetch={false}
                aria-label="Choose MoodMap Premium+ monthly plan"
                className="group inline-flex min-h-14 items-center justify-center rounded-full border border-white/16 bg-white/[0.055] px-6 text-sm font-bold text-white/90 shadow-[0_20px_70px_rgba(0,0,0,0.35)] transition hover:-translate-y-0.5 hover:bg-white/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
              >
                Choose monthly
                <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            </div>

            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/52">
              Full access. Cancel anytime. Relationship timing guidance only — not diagnosis,
              contraception, fertility planning, or medical treatment.
            </p>
          </div>

          <div className="relative" data-reveal="true">
            <div className="rounded-[2rem] border border-white/12 bg-white/[0.045] p-4 shadow-[0_34px_120px_rgba(0,0,0,0.38)] backdrop-blur-xl sm:p-5">
              <div className="rounded-[1.5rem] border border-white/10 bg-[#080d18]/80 p-5 sm:p-6">
                <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-emerald-300/80">
                      Full daily read
                    </p>
                    <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.055em] text-[#f5f2ea] sm:text-3xl">
                      The full timing layer.
                    </h2>
                  </div>
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-400/10 text-emerald-100">
                    <Crown className="h-5 w-5" aria-hidden="true" />
                  </span>
                </div>

                <div className="mt-5 grid gap-3">
                  {INCLUDED.map((item, index) => (
                    <div
                      key={item}
                      className="grid grid-cols-[2rem_1fr] items-start gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.035] p-3.5"
                    >
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-emerald-300/18 bg-emerald-400/10 text-xs font-extrabold text-emerald-100">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <p className="pt-1 text-sm font-semibold leading-relaxed text-white/78">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mm-container pb-14 sm:pb-[4.5rem]">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {VALUE_STACK.map((feature) => {
            const Icon = feature.icon;
            return (
              <article
                key={feature.title}
                className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 shadow-[0_22px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.055] text-emerald-100">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-lg font-extrabold tracking-[-0.045em] text-[#f5f2ea]">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/64">{feature.desc}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mm-container pb-16 sm:pb-20">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 text-center shadow-[0_26px_94px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-8">
          <div className="mx-auto flex max-w-3xl flex-col items-center">
            <CheckCircle2 className="h-8 w-8 text-emerald-300" aria-hidden="true" />
            <h2 className="mt-5 max-w-2xl text-balance text-3xl font-extrabold leading-none tracking-[-0.06em] text-[#f5f2ea] sm:text-4xl">
              Thirty seconds now. Less repair later.
            </h2>
            <p className="mt-4 max-w-2xl text-pretty text-sm leading-relaxed text-white/66 sm:text-base">
              The expensive part is not the read. It is the wrong-hour conversation,
              the pressure move, and the repair loop that could have been avoided.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href={yearlyHref} prefetch={false} className="btn-primary">
                Unlock yearly
              </Link>
              <Link href={monthlyHref} prefetch={false} className="btn-primary bg-white/10 shadow-none ring-white/15 hover:bg-white/15">
                Unlock monthly
              </Link>
            </div>
            <Link href="/" className="mt-6 text-sm font-semibold text-white/56 hover:text-white/78">
              ← Back to Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
