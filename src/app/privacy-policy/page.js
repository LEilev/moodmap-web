// src/app/privacy-policy/page.js
import Link from "next/link";
import {
  Database,
  BarChart3,
  Share2,
  Shield,
  Trash2,
  HeartOff,
  Bell,
  CheckCircle2,
  RefreshCcw,
  Mail,
} from "lucide-react";

export const metadata = {
  title: "Privacy Policy | MoodMap™",
  description:
    "How we collect, use, and safeguard your information when you use the MoodMap app.",
};

const toc = [
  { id: "section1", label: "1. Information We Collect" },
  { id: "section2", label: "2. How We Use Your Data" },
  { id: "section3", label: "3. Third-Party Services" },
  { id: "section4", label: "4. Data Security" },
  { id: "section5", label: "5. Data Deletion" },
  { id: "section6", label: "6. No Health Data" },
  { id: "section7", label: "7. Email Notifications (Optional)" },
  { id: "section8", label: "8. Your Rights" },
  { id: "section9", label: "9. Changes to This Policy" },
  { id: "section10", label: "10. Contact Us" },
];

// Felles UI-snutter (matcher Pro/Support-stilen)
function IconRing({ children }) {
  return (
    <span className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl
                     bg-gradient-to-br from-emerald-400/40 to-blue-500/40 ring-1 ring-white/20
                     shadow-inner shadow-emerald-500/10 transition-all">
      {children}
    </span>
  );
}

function GlassCard({ id, children }) {
  return (
    <article
      id={id}
      className="scroll-mt-24 rounded-2xl bg-white/12 ring-1 ring-white/10 backdrop-blur-xl p-6"
    >
      {children}
    </article>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <main className="relative isolate min-h-screen bg-primary-blue text-white">
      {/* Subtile emerald→blue glows (matcher Pro/Support) */}
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
          {/* Last updated-badge (synlig, men juridisk tekst beholdes også nedenfor) */}
          <div className="inline-flex items-center gap-2 rounded-full bg-white/12 ring-1 ring-white/20 px-3 py-1 text-xs font-semibold text-blue-100">
            <span>Last updated: April 24, 2025</span>
          </div>
          <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tight">
            Privacy Policy for MoodMap™
          </h1>
        </div>
      </section>

      {/* TOC – desktop glasskort + mobil collapsible */}
      <section className="px-6 pb-8">
        <div className="mx-auto max-w-4xl">
          {/* Mobile: collapsible */}
          <details className="sm:hidden rounded-2xl bg-white/12 ring-1 ring-white/10 backdrop-blur-xl">
            <summary className="list-none cursor-pointer select-none px-4 py-3 font-semibold">
              <span className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm
                               text-white bg-gradient-to-r from-emerald-400 to-blue-600 ring-1 ring-white/10
                               shadow-[0_8px_24px_rgba(59,130,246,0.35)] transition-all">
                Jump to section
              </span>
            </summary>
            <nav className="px-4 pb-3 pt-2" role="navigation" aria-label="Table of contents">
              <ul className="space-y-1.5">
                {toc.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="block rounded-md px-2 py-1 text-sm text-blue-100 hover:text-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </details>

          {/* Desktop: glasskort med liste */}
          <nav
            className="hidden sm:block rounded-2xl bg-white/12 ring-1 ring-white/10 backdrop-blur-xl p-5"
            role="navigation"
            aria-label="Table of contents"
          >
            <div className="mb-2 text-sm font-semibold text-white/90">Table of contents</div>
            <ul className="grid grid-cols-2 gap-y-1.5">
              {toc.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="inline-block rounded-md px-2 py-1 text-sm text-blue-100 hover:text-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      {/* Content */}
      <section className="px-6 pb-16">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Intro – juridisk tekst (ordrett) */}
          <GlassCard id="intro">
            <p className="text-sm mb-4">
              <strong>Last updated:</strong> April 24, 2025
            </p>
            <p className="text-sm leading-relaxed">
              MoodMap is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use the MoodMap app. By using the app, you agree to the terms of this Privacy Policy.
            </p>
          </GlassCard>

          {/* 1 */}
          <GlassCard id="section1">
            <IconRing>
              <Database className="h-6 w-6 text-white drop-shadow" aria-hidden />
            </IconRing>
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
          </GlassCard>

          {/* 2 */}
          <GlassCard id="section2">
            <IconRing>
              <BarChart3 className="h-6 w-6 text-white drop-shadow" aria-hidden />
            </IconRing>
            <h2 className="text-xl sm:text-2xl font-semibold">2. How We Use Your Data</h2>
            <p className="mt-2 text-sm leading-relaxed">
              We use the collected data for the following purposes:
            </p>
            <ul className="mt-2 list-disc list-inside text-sm text-blue-100 space-y-1.5">
              <li><strong>App Functionality</strong>: To process in-app purchases, validate transactions, and ensure the app functions as intended.</li>
              <li><strong>Analytics</strong>: To monitor app performance, understand usage patterns, and improve the user experience.</li>
            </ul>
          </GlassCard>

          {/* 3 */}
          <GlassCard id="section3">
            <IconRing>
              <Share2 className="h-6 w-6 text-white drop-shadow" aria-hidden />
            </IconRing>
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
                  RevenueCat's Privacy Policy
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
                  Expo's Privacy Policy
                </a>.
              </li>
            </ul>
          </GlassCard>

          {/* 4 */}
          <GlassCard id="section4">
            <IconRing>
              <Shield className="h-6 w-6 text-white drop-shadow" aria-hidden />
            </IconRing>
            <h2 className="text-xl sm:text-2xl font-semibold">4. Data Security</h2>
            <p className="mt-2 text-sm leading-relaxed">
              All data collected is encrypted in transit using HTTPS to ensure secure transmission. We take reasonable measures to protect your data, but no method of transmission over the internet is completely secure.
            </p>
          </GlassCard>

          {/* 5 */}
          <GlassCard id="section5">
            <IconRing>
              <Trash2 className="h-6 w-6 text-white drop-shadow" aria-hidden />
            </IconRing>
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
          </GlassCard>

          {/* 6 */}
          <GlassCard id="section6">
            <IconRing>
              <HeartOff className="h-6 w-6 text-white drop-shadow" aria-hidden />
            </IconRing>
            <h2 className="text-xl sm:text-2xl font-semibold">6. No Health Data</h2>
            <p className="mt-2 text-sm leading-relaxed">
              MoodMap does not collect, store, or process any personal health or menstrual data. The app is designed to provide general cycle-based tips and is not intended for medical or diagnostic purposes.
            </p>
          </GlassCard>

          {/* 7 */}
          <GlassCard id="section7">
            <IconRing>
              <Bell className="h-6 w-6 text-white drop-shadow" aria-hidden />
            </IconRing>
            <h2 className="text-xl sm:text-2xl font-semibold">7. Email Notifications (Optional)</h2>
            <p className="mt-2 text-sm leading-relaxed">
              If you sign up for notifications, your email address will be securely stored and used only to inform you about app updates or releases. You can unsubscribe at any time by following the instructions in the notification emails.
            </p>
          </GlassCard>

          {/* 8 */}
          <GlassCard id="section8">
            <IconRing>
              <CheckCircle2 className="h-6 w-6 text-white drop-shadow" aria-hidden />
            </IconRing>
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
          </GlassCard>

          {/* 9 */}
          <GlassCard id="section9">
            <IconRing>
              <RefreshCcw className="h-6 w-6 text-white drop-shadow" aria-hidden />
            </IconRing>
            <h2 className="text-xl sm:text-2xl font-semibold">9. Changes to This Policy</h2>
            <p className="mt-2 text-sm leading-relaxed">
              We may update this Privacy Policy from time to time. Any changes will be reflected on this page, and the "Last updated" date will be revised accordingly. We encourage you to review this policy periodically.
            </p>
          </GlassCard>

          {/* 10 */}
          <GlassCard id="section10">
            <IconRing>
              <Mail className="h-6 w-6 text-white drop-shadow" aria-hidden />
            </IconRing>
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
          </GlassCard>

          {/* Avsluttende setning (ordrett) */}
          <GlassCard id="closing">
            <p className="text-sm leading-relaxed">
              By using the MoodMap app, you agree to the terms of this Privacy Policy.
            </p>
          </GlassCard>

          {/* Kontakt-CTA + Back to app */}
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
