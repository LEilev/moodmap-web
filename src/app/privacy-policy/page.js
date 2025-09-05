// src/app/privacy-policy/page.js
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | MoodMap™",
  description:
    "How we collect, use, and safeguard your information when you use the MoodMap app.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="relative isolate min-h-screen bg-primary-blue text-white">
      {/* Subtile premium glows (emerald→blue) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 -top-24 h-[34rem] w-[34rem] rounded-full bg-gradient-to-br from-emerald-400/25 to-blue-500/25 blur-[140px] sm:blur-[180px] md:opacity-30 -z-10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-32 h-[36rem] w-[36rem] rounded-full bg-gradient-to-tr from-blue-500/25 to-emerald-400/25 blur-[160px] sm:blur-[200px] md:opacity-30 -z-10"
      />

      {/* Hero */}
      <section className="px-6 pt-16 pb-8 sm:pt-20 sm:pb-10 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/12 ring-1 ring-white/20 px-3 py-1 text-xs font-semibold text-blue-100">
            <span>Last updated: April 24, 2025</span>
          </div>
          <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tight">
            Privacy Policy for MoodMap™
          </h1>
          <p className="mt-3 text-blue-100">
            MoodMap is committed to protecting your privacy.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="px-6 pb-16">
        <div className="mx-auto max-w-4xl space-y-6">

          {/* Intro (glass card) */}
          <article className="rounded-2xl bg-white/12 ring-1 ring-white/10 backdrop-blur-xl p-6">
            <p className="text-sm leading-relaxed">
              MoodMap is committed to protecting your privacy. This Privacy
              Policy explains how we collect, use, and safeguard your
              information when you use the MoodMap app. By using the app, you
              agree to the terms of this Privacy Policy.
            </p>
          </article>

          {/* 1. Information We Collect */}
          <article className="rounded-2xl bg-white/12 ring-1 ring-white/10 backdrop-blur-xl p-6">
            <h2 className="text-xl sm:text-2xl font-semibold">1. Information We Collect</h2>
            <p className="mt-2 text-sm leading-relaxed">
              We collect the following types of data to provide and improve our services:
            </p>
            <ul className="mt-2 list-disc list-inside text-sm text-blue-100 space-y-1.5">
              <li>
                <strong>Financial Information (Purchase History)</strong>: We collect purchase history through RevenueCat to process in-app purchases and subscriptions. This data is used for app functionality (e.g., validating purchases) and analytics (e.g., understanding usage patterns).
              </li>
              <li>
                <strong>App Information and Performance (Crash Logs)</strong>: We collect crash logs through Expo to monitor app performance, diagnose issues, and improve stability. This data is optional and used solely for analytics.
              </li>
              <li>
                <strong>Device or Other IDs</strong>: We collect device identifiers to validate purchases and track usage for analytics purposes. This data is required for app functionality and analytics.
              </li>
            </ul>
            <p className="mt-3 text-sm leading-relaxed">
              <strong>Note:</strong> We do not collect personally identifiable information (such as names or email addresses) unless you choose to provide it (e.g., for notifications or support requests).
            </p>
          </article>

          {/* 2. How We Use Your Data */}
          <article className="rounded-2xl bg-white/12 ring-1 ring-white/10 backdrop-blur-xl p-6">
            <h2 className="text-xl sm:text-2xl font-semibold">2. How We Use Your Data</h2>
            <p className="mt-2 text-sm leading-relaxed">
              We use the collected data for the following purposes:
            </p>
            <ul className="mt-2 list-disc list-inside text-sm text-blue-100 space-y-1.5">
              <li><strong>App Functionality</strong>: To process in-app purchases, validate transactions, and ensure the app functions as intended.</li>
              <li><strong>Analytics</strong>: To monitor app performance, understand usage patterns, and improve the user experience.</li>
            </ul>
          </article>

          {/* 3. Third-Party Services */}
          <article className="rounded-2xl bg-white/12 ring-1 ring-white/10 backdrop-blur-xl p-6">
            <h2 className="text-xl sm:text-2xl font-semibold">3. Third-Party Services</h2>
            <p className="mt-2 text-sm leading-relaxed">
              MoodMap uses the following third-party services, which may collect data as described in their own privacy policies:
            </p>
            <ul className="mt-2 list-disc list-inside text-sm text-blue-100 space-y-1.5">
              <li>
                <strong>RevenueCat</strong>: Used to manage in-app purchases and subscriptions. RevenueCat collects purchase history and device identifiers.
                For more information, see{" "}
                <a
                  href="https://www.revenuecat.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-white/40 hover:decoration-white/70"
                >
                  RevenueCat&apos;s Privacy Policy
                </a>.
              </li>
              <li>
                <strong>Expo</strong>: Used for app development and monitoring. Expo collects crash logs and device identifiers for analytics purposes. For more information, see{" "}
                <a
                  href="https://expo.dev/privacy-explained"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-white/40 hover:decoration-white/70"
                >
                  Expo&apos;s Privacy Policy
                </a>.
              </li>
            </ul>
          </article>

          {/* 4. Data Security */}
          <article className="rounded-2xl bg-white/12 ring-1 ring-white/10 backdrop-blur-xl p-6">
            <h2 className="text-xl sm:text-2xl font-semibold">4. Data Security</h2>
            <p className="mt-2 text-sm leading-relaxed">
              All data collected is encrypted in transit using HTTPS to ensure secure transmission. We take reasonable measures to protect your data, but no method of transmission over the internet is completely secure.
            </p>
          </article>

          {/* 5. Data Deletion */}
          <article className="rounded-2xl bg-white/12 ring-1 ring-white/10 backdrop-blur-xl p-6">
            <h2 className="text-xl sm:text-2xl font-semibold">5. Data Deletion</h2>
            <p className="mt-2 text-sm leading-relaxed">
              You have the right to request the deletion of your personal data. To submit a data deletion request, please contact us at{" "}
              <a
                href="mailto:Moodmap.tech@gmail.com"
                className="underline decoration-white/40 hover:decoration-white/70"
              >
                Moodmap.tech@gmail.com
              </a>. We will process your request in accordance with applicable privacy laws, such as GDPR, and delete your data from our systems and those of our service providers (e.g., RevenueCat and Expo) within a reasonable timeframe.
            </p>
          </article>

          {/* 6. No Health Data */}
          <article className="rounded-2xl bg-white/12 ring-1 ring-white/10 backdrop-blur-xl p-6">
            <h2 className="text-xl sm:text-2xl font-semibold">6. No Health Data</h2>
            <p className="mt-2 text-sm leading-relaxed">
              MoodMap does not collect, store, or process any personal health or menstrual data. The app is designed to provide general cycle-based tips and is not intended for medical or diagnostic purposes.
            </p>
          </article>

          {/* 7. Email Notifications (Optional) */}
          <article className="rounded-2xl bg-white/12 ring-1 ring-white/10 backdrop-blur-xl p-6">
            <h2 className="text-xl sm:text-2xl font-semibold">7. Email Notifications (Optional)</h2>
            <p className="mt-2 text-sm leading-relaxed">
              If you sign up for notifications, your email address will be securely stored and used only to inform you about app updates or releases. You can unsubscribe at any time by following the instructions in the notification emails.
            </p>
          </article>

          {/* 8. Your Rights */}
          <article className="rounded-2xl bg-white/12 ring-1 ring-white/10 backdrop-blur-xl p-6">
            <h2 className="text-xl sm:text-2xl font-semibold">8. Your Rights</h2>
            <p className="mt-2 text-sm leading-relaxed">
              Depending on your location, you may have the following rights regarding your data:
            </p>
            <ul className="mt-2 list-disc list-inside text-sm text-blue-100 space-y-1.5">
              <li><strong>Access</strong>: Request a copy of the data we hold about you.</li>
              <li><strong>Deletion</strong>: Request the deletion of your data.</li>
              <li><strong>Objection</strong>: Object to certain types of data processing.</li>
            </ul>
            <p className="mt-3 text-sm leading-relaxed">
              To exercise these rights, please contact us at{" "}
              <a
                href="mailto:Moodmap.tech@gmail.com"
                className="underline decoration-white/40 hover:decoration-white/70"
              >
                Moodmap.tech@gmail.com
              </a>.
            </p>
          </article>

          {/* 9. Changes to This Policy */}
          <article className="rounded-2xl bg-white/12 ring-1 ring-white/10 backdrop-blur-xl p-6">
            <h2 className="text-xl sm:text-2xl font-semibold">9. Changes to This Policy</h2>
            <p className="mt-2 text-sm leading-relaxed">
              We may update this Privacy Policy from time to time. Any changes will be reflected on this page, and the &quot;Last updated&quot; date will be revised accordingly. We encourage you to review this policy periodically.
            </p>
          </article>

          {/* 10. Contact Us */}
          <article className="rounded-2xl bg-white/12 ring-1 ring-white/10 backdrop-blur-xl p-6">
            <h2 className="text-xl sm:text-2xl font-semibold">10. Contact Us</h2>
            <p className="mt-2 text-sm leading-relaxed">
              If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at{" "}
              <a
                href="mailto:Moodmap.tech@gmail.com"
                className="underline decoration-white/40 hover:decoration-white/70"
              >
                Moodmap.tech@gmail.com
              </a>.
            </p>
            <p className="mt-3 text-sm leading-relaxed">
              By using the MoodMap app, you agree to the terms of this Privacy Policy.
            </p>
          </article>

          {/* Contact CTA */}
          <div className="pt-2 text-center">
            <a
              href="mailto:Moodmap.tech@gmail.com?subject=Privacy%20question"
              className="group relative inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold
                         text-white bg-gradient-to-r from-emerald-400 to-blue-600 ring-1 ring-white/10
                         shadow-[0_8px_24px_rgba(59,130,246,0.35)] transition-all
                         hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(59,130,246,0.5)]
                         focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
            >
              Email us about privacy
            </a>
            <div className="mt-4">
              <Link
                href="/"
                className="inline-block text-sm underline decoration-white/40 hover:decoration-white/70"
              >
                ← Back to the app
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
