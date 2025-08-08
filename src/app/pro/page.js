// src/app/pro/page.js
export const metadata = {
  title: "MoodMap Pro",
  description:
    "Unlock MoodMap Pro for extra features and guidance. Monthly or yearly.",
};

const LINKS = {
  monthly: "https://buy.stripe.com/aFabJ27zZgea0lgfzP3ks03",
  yearly:  "https://buy.stripe.com/6oU5kE2fFgea2to2N33ks04", // <-- bytt hvis $29.99 har ny link
};

export default function ProPage() {
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

        {/* Button group wrapper */}
        <div className="mt-10 mx-auto max-w-xl rounded-2xl bg-white/5 backdrop-blur-sm p-3 ring-1 ring-white/10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Monthly */}
            <a
              href={LINKS.monthly}
              className="inline-flex flex-col items-center justify-center rounded-xl bg-white text-slate-900 font-semibold py-4 px-6 shadow-md hover:shadow-lg hover:translate-y-[1px] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <span className="text-base">Get Pro – Monthly</span>
              <span className="text-sm text-slate-700">$3.99 / month</span>
            </a>

            {/* Yearly (highlight) */}
            <a
              href={LINKS.yearly}
              className="relative inline-flex flex-col items-center justify-center rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-500 text-slate-900 font-semibold py-5 px-6 shadow-md hover:shadow-lg hover:translate-y-[1px] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
            >
              <span className="absolute -top-3 right-3 bg-yellow-300 text-yellow-900 text-[11px] font-bold px-2 py-0.5 rounded-full shadow">
                Best value
              </span>
              <span className="text-base">Get Pro – Yearly</span>
              <span className="text-sm text-slate-800">$29.99 / year · Save 37%</span>
            </a>
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
