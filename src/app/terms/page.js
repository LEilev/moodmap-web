// src/app/terms/page.js
import Link from "next/link";
import {
  Scale,
  Stethoscope,
  UserCheck,
  CreditCard,
  Ban,
  Copyright,
  Shield,
  AlertTriangle,
  Power,
  RefreshCcw,
  Mail,
  Gavel,
} from "lucide-react";

export const metadata = {
  title: "Terms of Service | MoodMap™",
  description: "Terms and conditions for using the MoodMap app and website.",
  alternates: {
    canonical: "https://moodmap-app.com/terms",
  },
};

const LAST_UPDATED = "January 2, 2026";

const toc = [
  { id: "section1", label: "1. Agreement to These Terms" },
  { id: "section2", label: "2. What MoodMap Is" },
  { id: "section3", label: "3. Not Medical Advice" },
  { id: "section4", label: "4. Eligibility" },
  { id: "section5", label: "5. Subscriptions, Billing & Refunds" },
  { id: "section6", label: "6. Acceptable Use" },
  { id: "section7", label: "7. Intellectual Property" },
  { id: "section8", label: "8. Privacy" },
  { id: "section9", label: "9. Disclaimers & Limitation of Liability" },
  { id: "section10", label: "10. Termination" },
  { id: "section11", label: "11. Changes to These Terms" },
  { id: "section12", label: "12. Contact & Governing Law" },
];

// UI helpers (match Pro/Support/Privacy)
function IconRing({ children }) {
  return (
    <span
      className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl
                 bg-gradient-to-br from-emerald-400/40 to-blue-500/40 ring-1 ring-white/20
                 shadow-inner shadow-emerald-500/10"
    >
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

export default function TermsPage() {
  return (
    <main className="relative isolate min-h-screen bg-primary-blue text-white">
      {/* Subtle emerald→blue glows (match other legal/support pages) */}
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
            <span>Last updated: {LAST_UPDATED}</span>
          </div>
          <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tight">
            Terms of Service for MoodMap™
          </h1>
          <p className="mt-4 text-sm text-white/70 leading-relaxed">
            These Terms help set clear expectations for using MoodMap. They are written to be
            simple and transparent. They do not replace legal advice.
          </p>
        </div>
      </section>

      {/* TOC – desktop glass card + mobile collapsible */}
      <section className="px-6 pb-8">
        <div className="mx-auto max-w-4xl">
          {/* Mobile: collapsible */}
          <details className="sm:hidden rounded-2xl bg-white/12 ring-1 ring-white/10 backdrop-blur-xl">
            <summary className="list-none cursor-pointer select-none px-4 py-3 font-semibold">
              <span
                className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm
                           text-white bg-gradient-to-r from-emerald-400 to-blue-600 ring-1 ring-white/10
                           shadow-[0_8px_24px_rgba(59,130,246,0.35)]"
              >
                Jump to section
              </span>
            </summary>
            <nav className="px-4 pb-3 pt-2" role="navigation" aria-label="Table of contents">
              <ul className="space-y-1.5">
                {toc.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="block rounded-md px-2 py-1 text-sm text-blue-100
                                 hover:text-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2
                                 focus-visible:outline-offset-2 focus-visible:outline-blue-300
                                 transition-colors duration-200"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </details>

          {/* Desktop */}
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
                    className="inline-block rounded-md px-2 py-1 text-sm text-blue-100
                               hover:text-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2
                               focus-visible:outline-offset-2 focus-visible:outline-blue-300
                               transition-colors duration-200"
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
          <GlassCard id="section1">
            <IconRing>
              <Scale className="h-6 w-6 text-white drop-shadow" aria-hidden />
            </IconRing>
            <h2 className="text-xl sm:text-2xl font-semibold">1. Agreement to These Terms</h2>
            <p className="mt-2 text-sm leading-relaxed">
              By accessing or using MoodMap (the app and this website), you agree to these Terms.
              If you do not agree, please do not use MoodMap.
            </p>
          </GlassCard>

          <GlassCard id="section2">
            <IconRing>
              <UserCheck className="h-6 w-6 text-white drop-shadow" aria-hidden />
            </IconRing>
            <h2 className="text-xl sm:text-2xl font-semibold">2. What MoodMap Is</h2>
            <p className="mt-2 text-sm leading-relaxed">
              MoodMap provides cycle-aware insight designed to improve timing, interpretation, and emotional context in relationships. It is not a diagnostic tool.
            </p>
          </GlassCard>

          <GlassCard id="section3">
            <IconRing>
              <Stethoscope className="h-6 w-6 text-white drop-shadow" aria-hidden />
            </IconRing>
            <h2 className="text-xl sm:text-2xl font-semibold">3. Not Medical Advice</h2>
            <p className="mt-2 text-sm leading-relaxed">
              MoodMap does not provide medical advice, medical diagnoses, or treatment. Any guidance
              is general information and may not be accurate for your specific situation. If you
              have medical questions or concerns, consult a qualified healthcare professional.
            </p>
          </GlassCard>

          <GlassCard id="section4">
            <IconRing>
              <Shield className="h-6 w-6 text-white drop-shadow" aria-hidden />
            </IconRing>
            <h2 className="text-xl sm:text-2xl font-semibold">4. Eligibility</h2>
            <p className="mt-2 text-sm leading-relaxed">
              You must be legally permitted to use MoodMap under applicable laws. If you are under
              the age of majority in your jurisdiction, you must have permission from a parent or
              legal guardian.
            </p>
          </GlassCard>

          <GlassCard id="section5">
            <IconRing>
              <CreditCard className="h-6 w-6 text-white drop-shadow" aria-hidden />
            </IconRing>
            <h2 className="text-xl sm:text-2xl font-semibold">5. Subscriptions, Billing & Refunds</h2>
            <p className="mt-2 text-sm leading-relaxed">
              Paid features (such as Premium+) may be billed through the Apple App Store, Google Play Store, or via Stripe for web purchases, depending on how you subscribe. App Store / Google Play subscriptions are managed through your store account (including billing, renewals, cancellations, and refunds) and are subject to the store’s policies. Stripe (web) subscriptions are billed to the payment method you provide at checkout and can be managed through your MoodMap account; refunds (if any) are handled according to applicable law and the relevant platform’s policies.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-blue-100">
              Tip: If you subscribed through the App Store or Google Play, cancel from your store subscription settings. If you subscribed on the web via Stripe, manage or cancel via your MoodMap account (or contact support). Deleting the app does not automatically cancel a subscription.
            </p>
          </GlassCard>

          <GlassCard id="section6">
            <IconRing>
              <Ban className="h-6 w-6 text-white drop-shadow" aria-hidden />
            </IconRing>
            <h2 className="text-xl sm:text-2xl font-semibold">6. Acceptable Use</h2>
            <p className="mt-2 text-sm leading-relaxed">
              You agree not to misuse MoodMap. This includes (but is not limited to) attempting to
              interfere with the service, reverse engineering the app, scraping the website, or
              using MoodMap in a way that violates laws or the rights of others.
            </p>
          </GlassCard>

          <GlassCard id="section7">
            <IconRing>
              <Copyright className="h-6 w-6 text-white drop-shadow" aria-hidden />
            </IconRing>
            <h2 className="text-xl sm:text-2xl font-semibold">7. Intellectual Property</h2>
            <p className="mt-2 text-sm leading-relaxed">
              MoodMap and its content (including branding, copy, UI, and guidance content) are
              protected by intellectual property laws. You may not copy, distribute, or create
              derivative works from MoodMap without permission, except where permitted by law.
            </p>
          </GlassCard>

          <GlassCard id="section8">
            <IconRing>
              <Shield className="h-6 w-6 text-white drop-shadow" aria-hidden />
            </IconRing>
            <h2 className="text-xl sm:text-2xl font-semibold">8. Privacy</h2>
            <p className="mt-2 text-sm leading-relaxed">
              Your use of MoodMap is also governed by our Privacy Policy. Please review it to
              understand how we collect and use information.
            </p>
            <p className="mt-3 text-sm">
              <Link
                href="/privacy-policy"
                className="inline-block underline decoration-white/40 hover:decoration-white/70"
              >
                Read the Privacy Policy →
              </Link>
            </p>
          </GlassCard>

          <GlassCard id="section9">
            <IconRing>
              <AlertTriangle className="h-6 w-6 text-white drop-shadow" aria-hidden />
            </IconRing>
            <h2 className="text-xl sm:text-2xl font-semibold">
              9. Disclaimers & Limitation of Liability
            </h2>
            <p className="mt-2 text-sm leading-relaxed">
              MoodMap is provided “as is” and “as available”. We do not guarantee that MoodMap will
              be uninterrupted or error-free. To the maximum extent permitted by law, MoodMap and
              its creators will not be liable for indirect, incidental, special, consequential, or
              punitive damages, or any loss of profits or data, arising from your use of MoodMap.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-blue-100">
              This section is intended to set realistic expectations for a consumer app. Local
              consumer protection laws may still apply.
            </p>
          </GlassCard>

          <GlassCard id="section10">
            <IconRing>
              <Power className="h-6 w-6 text-white drop-shadow" aria-hidden />
            </IconRing>
            <h2 className="text-xl sm:text-2xl font-semibold">10. Termination</h2>
            <p className="mt-2 text-sm leading-relaxed">
              We may suspend or terminate access to MoodMap if we reasonably believe you have
              violated these Terms or if required to comply with law. You may stop using MoodMap at
              any time.
            </p>
          </GlassCard>

          <GlassCard id="section11">
            <IconRing>
              <RefreshCcw className="h-6 w-6 text-white drop-shadow" aria-hidden />
            </IconRing>
            <h2 className="text-xl sm:text-2xl font-semibold">11. Changes to These Terms</h2>
            <p className="mt-2 text-sm leading-relaxed">
              We may update these Terms from time to time. Any changes will be posted on this page,
              and the “Last updated” date will be revised. Continued use of MoodMap after changes
              means you accept the updated Terms.
            </p>
          </GlassCard>

          <GlassCard id="section12">
            <IconRing>
              <Gavel className="h-6 w-6 text-white drop-shadow" aria-hidden />
            </IconRing>
            <h2 className="text-xl sm:text-2xl font-semibold">12. Contact & Governing Law</h2>
            <p className="mt-2 text-sm leading-relaxed">
              If you have questions about these Terms, contact us at{" "}
              <a
                href="mailto:support@moodmap-app.com"
                className="underline decoration-white/40 hover:decoration-white/70"
              >
                support@moodmap-app.com
              </a>
              .
            </p>
            <p className="mt-3 text-sm leading-relaxed text-blue-100">
              Governing law and venue may depend on your jurisdiction. If you are operating from
              Norway, Norwegian law will typically apply. If you operate from elsewhere, local
              consumer laws may apply.
            </p>
          </GlassCard>

          <div className="pt-2 text-center">
            <a
              href="mailto:support@moodmap-app.com?subject=Terms%20question"
              className="group relative inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold
                         text-white bg-gradient-to-r from-emerald-400 to-blue-600 ring-1 ring-white/10
                         shadow-[0_8px_24px_rgba(59,130,246,0.35)] transition-all
                         hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(59,130,246,0.5)]
                         focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
            >
              Email us about Terms
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
