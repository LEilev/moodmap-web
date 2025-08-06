// src/app/layout.js
// ---------------------------------------------------------------------------
// Original MoodMap layout  +  PromoteKit Stripe Payment‑Link integration
// ---------------------------------------------------------------------------
// 1. <Script> #1   – laster PromoteKit SDK   (async; ikke‑blokkende)
// 2. <Script> #2   – injiserer client_reference_id på alle
//                    https://buy.stripe.com/‑lenker + Stripe embeds
//
// Pro‑ID: 88e4dc38‑2a9b‑412b‑905d‑5b91bb454187
//
// Merk: Filen er fortsatt en **server component**; Next JS tillater
//       <Script strategy="afterInteractive"> uten "use client".
// ---------------------------------------------------------------------------

import './globals.css';
import Image from 'next/image';
import Link  from 'next/link';
import Script from 'next/script'; // ⬅ ny import

export const metadata = {
  title: 'MoodMap',
  description: 'Understand the cycle. Survive the chaos.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <head>
        {/* PromoteKit core script */}
        <Script
          async
          strategy="afterInteractive"
          src="https://cdn.promotekit.com/promotekit.js"
          data-promotekit="88e4dc38-2a9b-412b-905d-5b91bb454187"
        />

        {/* Helper – adds ?client_reference_id=<ref> to Stripe links */}
        <Script id="promotekit-stripe-helper" strategy="afterInteractive">
          {`
            document.addEventListener('DOMContentLoaded', function () {
              setTimeout(function () {
                const ref = window.promotekit_referral;
                if (!ref) return;

                /* 1 · Direkte Payment‑Links */
                document
                  .querySelectorAll('a[href^="https://buy.stripe.com/"]')
                  .forEach(function (link) {
                    const href = link.getAttribute('href');
                    if (href && !href.includes('client_reference_id')) {
                      link.setAttribute(
                        'href',
                        href + (href.includes('?') ? '&' : '?') +
                        'client_reference_id=' + ref
                      );
                    }
                  });

                /* 2 · Stripe PricingTable embeds */
                document
                  .querySelectorAll('[pricing-table-id]')
                  .forEach(function (el) {
                    el.setAttribute('client-reference-id', ref);
                  });

                /* 3 · Stripe BuyButton embeds */
                document
                  .querySelectorAll('[buy-button-id]')
                  .forEach(function (el) {
                    el.setAttribute('client-reference-id', ref);
                  });
              }, 1500); // gir PromoteKit tid til å plante cookien
            });
          `}
        </Script>
      </head>

      <body className="flex flex-col min-h-full bg-primary-blue text-white">
        <header className="bg-primary-blue">
          <div className="max-w-6xl mx-auto flex items-center justify-between py-4 px-6">
            <Link href="/" className="flex items-center text-2xl font-bold">
              MoodMap
              <Image
                src="/icon.png"
                alt="MoodMap logo"
                width={28}
                height={28}
                className="ml-2"
                priority
              />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden sm:flex gap-6">
              <Link href="#about"     className="hover:underline">About</Link>
              <Link href="#download"  className="hover:underline">Download</Link>
              <Link href="/support"   className="hover:underline">Support</Link>
            </nav>
          </div>

          {/* Mobile nav */}
          <nav className="sm:hidden px-6">
            <Link href="#about"     className="nav-link-mobile">About</Link>
            <Link href="#download"  className="nav-link-mobile">Download</Link>
            <Link href="/support"   className="nav-link-mobile">Support</Link>
          </nav>
        </header>

        <main className="flex-grow">{children}</main>
      </body>
    </html>
  );
}
