// src/app/pro/page.js
export const metadata = {
  title: "MoodMap Pro",
  description:
    "Unlock MoodMap Pro for extra features and guidance. Monthly or yearly.",
};

const LINKS = {
  monthly: "https://buy.stripe.com/aFabJ27zZgea0lgfzP3ks03",
  yearly:  "https://buy.stripe.com/6oU5kE2fFgea2to2N33ks04",
};

export default function ProPage() {
  return (
    <main className="min-h-[70vh] bg-primary-blue text-white">
      <section className="max-w-3xl mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
          Unlock <span className="underline decoration-4">MoodMap&nbsp;Pro</span>
        </h1>
        <p className="mt-5 text-lg text-blue-100">
          Get deeper insights, survival alerts, and exclusive content that helps you
          stay connected—without losing your mind.
        </p>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a
            href={LINKS.monthly}
            className="inline-flex items-center justify-center rounded-xl bg-white text-primary-blue font-semibold py-3 px-6 hover:opacity-90 transition focus:outline-none focus:ring-2 focus:ring-white"
          >
            Get Pro – Monthly ($3.99)
          </a>
          <a
            href={LINKS.yearly}
            className="inline-flex items-center justify-center rounded-xl bg-emerald-400 text-primary-blue font-semibold py-3 px-6 hover:opacity-90 transition focus:outline-none focus:ring-2 focus:ring-emerald-300"
          >
            Get Pro – Yearly ($39.99)
          </a>
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
