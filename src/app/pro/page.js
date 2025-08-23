// src/app/pro/page.js
import Link from "next/link";

export const metadata = {
  title: "MoodMap Pro",
  description:
    "Unlock MoodMap Pro for extra features and guidance. Monthly or yearly.",
};

// Safely get the first value for a param that may be string | string[] | undefined
function first(v) {
  return Array.isArray(v) ? v[0] : v ?? "";
}

// Build a /buy href for a given plan type while forwarding useful params
function buildPlanHref(planType, searchParams) {
  // Always set the plan type explicitly
  const qs = new URLSearchParams({
    type: planType === "yearly" ? "yearly" : "monthly",
  });

  // Forward common referral / analytics / coupon params if present
  const forwardKeys = [
    "via",
    "ref",
    "ref_code",
    "refcode",
    "creator",
    "pk_ref",
    "promotekit_referral",
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
    "coupon",
    "promo",
    "promocode",
    "discount",
    "code",
  ];

  for (const key of forwardKeys) {
    const val = first(searchParams?.[key]);
    if (!val) continue;
    qs.set(key, String(val));
  }

  // NOTE: We intentionally do NOT forward client_reference_id here;
  // /buy will derive it JIT from PromoteKit (or fall back to slug), which is safer.

  return `/buy?${qs.toString()}`;
}

export default function ProPage({ searchParams }) {
  return (
    <main className="min-h-[70vh] bg-primary-blue text-white">
      <section className="max-w-3xl mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
          Unlock <span className="underline decoration-4 underline-offset-4">MoodMap&nbsp;Pro</span>
        </h1>

        <p className="mt-5 text-lg text-blue-100">
          Get deeper insights, survival alerts, and exclusive content that helps you
          stay connected—without losing your mind.
        </p>

        <div className="mt-10 mx-auto max-w-xl rounded-2xl bg-white/5 backdrop-blur-sm p-3 ring-1 ring-white/10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Monthly via /buy */}
            <Link
              href={buildPlanHref("monthly", searchParams)}
              prefetch={false}
              className="inline-flex flex-col items-center justify-center rounded-xl bg-white text-slate-900 font-semibold py-4 px-6 shadow-md hover:shadow-lg hover:translate-y-[1px] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label="Get Pro – Monthly"
              data-plan="monthly"
            >
              <span className="text-base">Get Pro – Monthly</span>
              <span className="text-sm text-slate-700">$3.99 / month</span>
            </Link>

            {/* Yearly via /buy */}
            <Link
              href={buildPlanHref("yearly", searchParams)}
              prefetch={false}
              className="relative inline-flex flex-col items-center justify-center rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-500 text-slate-900 font-semibold py-5 px-6 shadow-md hover:shadow-lg hover:translate-y-[1px] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
              aria-label="Get Pro – Yearly"
              data-plan="yearly"
            >
              <span className="absolute -top-3 right-3 bg-yellow-300 text-yellow-900 text-[11px] font-bold px-2 py-0.5 rounded-full shadow">
                Best value
              </span>
              <span className="text-base">Get Pro – Yearly</span>
              <span className="text-sm text-slate-800">$29.99 / year · Save 37%</span>
            </Link>
          </div>
        </div>

        <p className="mt-6 text-sm text-blue-200">
          Payments are handled securely by Stripe. Your affiliate/referral will be applied automatically.
        </p>

        <div className="mt-14 text-sm text-blue-200">
          <p>
            Questions? <a className="underline" href="/support">Contact support</a>.
          </p>
        </div>
      </section>
    </main>
  );
}
