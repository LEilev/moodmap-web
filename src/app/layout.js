// src/app/layout.js
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";

export const metadata = {
  title: "MoodMap",
  description:
    "Understand the cycle. Survive the chaos. MoodMap helps you navigate the hormonal cycle with clarity.",
};

export default function RootLayout({ children }) {
  const PK_SITE_ID = "88e4dc38-2a9b-412b-905d-5b91bb454187"; // PromoteKit site id (LIVE)

  return (
    <html lang="en" className="h-full scroll-smooth" suppressHydrationWarning>
      <head>
        {/* PromoteKit (Option 2: Stripe Payment Links) */}
        <Script
          id="promotekit-loader"
          src="https://cdn.promotekit.com/promotekit.js"
          async
          data-promotekit={PK_SITE_ID}
        />

        {/* Helper: sørg for at client_reference_id følger med overalt */}
        <Script id="promotekit-helper" strategy="afterInteractive">
          {`
(function () {
  // Finn referral-id fra PromoteKit (eller fall tilbake til ?via / ?ref i URL)
  function findReferral() {
    try {
      if (window.promotekit_referral) return String(window.promotekit_referral);
      const u = new URL(window.location.href);
      return u.searchParams.get("via") || u.searchParams.get("ref") || "";
    } catch (_) { return ""; }
  }

  function addClientRefToBuyLinks(ref) {
    if (!ref) return;
    document.querySelectorAll('a[href^="https://buy.stripe.com/"]').forEach(function (link) {
      try {
        const url = new URL(link.getAttribute("href"));
        if (!url.searchParams.has("client_reference_id")) {
          url.searchParams.set("client_reference_id", ref);
          link.setAttribute("href", url.toString());
        }
      } catch (_) {}
    });
  }

  function setClientRefOnEmbeds(ref) {
    if (!ref) return;
    document.querySelectorAll("[pricing-table-id]").forEach(function (el) {
      el.setAttribute("client-reference-id", ref);
    });
    document.querySelectorAll("[buy-button-id]").forEach(function (el) {
      el.setAttribute("client-reference-id", ref);
    });
  }

  function applyRef() {
    var ref = findReferral();
    if (!ref) return;
    addClientRefToBuyLinks(ref);
    setClientRefOnEmbeds(ref);
  }

  // Kjør når DOM er klar + lite delay så PromoteKit/embeds rekker å mounte
  document.addEventListener("DOMContentLoaded", function () {
    setTimeout(applyRef, 1200);
  });

  // I tilfelle ting mountes senere (SPA-navigasjon etc.), prøv igjen et par ganger
  var retries = 0;
  var t = setInterval(function () {
    retries++;
    applyRef();
    if (retries >= 3) clearInterval(t);
  }, 2000);
})();
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
              <Link href="#about" className="hover:underline">About</Link>
              <Link href="#download" className="hover:underline">Download</Link>
              <Link href="/support" className="hover:underline">Support</Link>
              <Link href="/pro" className="hover:underline font-semibold">Pro</Link>
            </nav>
          </div>

          {/* Mobile nav */}
          <nav className="sm:hidden px-6 pb-3 flex flex-col gap-2">
            <Link href="#about" className="hover:underline">About</Link>
            <Link href="#download" className="hover:underline">Download</Link>
            <Link href="/support" className="hover:underline">Support</Link>
            <Link href="/pro" className="hover:underline font-semibold">Pro</Link>
          </nav>
        </header>

        <main className="flex-grow">{children}</main>
      </body>
    </html>
  );
}
