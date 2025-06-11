// src/app/page.js
import Link from 'next/link';

/**
 * Home page for MoodMap marketing site.
 * TailwindCSS only – both store buttons are now styled buttons (no badge images).
 */
export default function HomePage() {
  return (
    <>
      {/* ─────────────────── Hero ─────────────────── */}
      <section id="hero" className="bg-primary-blue text-center py-20 px-6">
        <h1 className="text-4xl sm:text-5xl font-bold mb-6 max-w-3xl mx-auto">
          Understand the cycle.&nbsp;Survive the chaos.
        </h1>
        <p className="mb-10 max-w-2xl mx-auto text-lg">
          MoodMap helps you track and survive the hormonal cycle with clarity, humor,
          and daily guidance for staying connected—and sane.
        </p>

        {/* Store buttons – both styled buttons now */}
        <div
          id="download"
          className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-4"
        >
          {/* App Store button */}
          <a
            href="https://apps.apple.com/no/app/moodmap-moodcoaster/id6746102626?l=nb"
            className="inline-flex items-center justify-center bg-black text-white rounded-lg px-6 py-3 text-sm font-semibold transition hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Download on the App Store
          </a>

          {/* Google Play button */}
          <a
            href="https://play.google.com/store/apps/details?id=com.eilev.moodmapnextgen"
            className="inline-flex items-center justify-center bg-[#34A853] text-white rounded-lg px-6 py-3 text-sm font-semibold transition hover:bg-[#2f9a49] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#34A853]"
          >
            Get it on Google Play
          </a>
        </div>

        {/* Notice under the buttons */}
        <p className="text-sm opacity-70 italic">Available on iOS and Android</p>
      </section>

      {/* ─────────────────── About ─────────────────── */}
      <section id="about" className="max-w-3xl mx-auto text-center my-20 px-6">
        <h2 className="text-2xl font-semibold mb-4">About MoodMap</h2>
        <p>
          MoodMap is built for men who want to survive—and even thrive—while navigating
          their partner’s hormonal cycle. With brutally honest reminders and an interactive
          color code, it’s your ultimate toolkit for better intimacy, timing, and day-to-day
          peacekeeping.
        </p>
      </section>

      {/* ─────────────── Feature Cards ─────────────── */}
      <section id="features" className="bg-primary-blue pb-24">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white text-black rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition">
            <h3 className="flex items-center text-xl font-semibold mb-2">
              <span className="mr-2">❤️‍🩹</span> Cycle Overview
            </h3>
            <p>Quick‑glance insight into what day it is—and what mood to expect.</p>
          </div>

          {/* Card 2 */}
          <div className="bg-white text-black rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition">
            <h3 className="flex items-center text-xl font-semibold mb-2">
              <span className="mr-2">⏰</span> Survival Alerts
            </h3>
            <p>Timely notifications for when to lean in, back off, or just bring snacks.</p>
          </div>

          {/* Card 3 */}
          <div className="bg-white text-black rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition">
            <h3 className="flex items-center text-xl font-semibold mb-2">
              <span className="mr-2">🍑</span> Tips & Intimacy
            </h3>
            <p>Useful (and sometimes hilarious) tips to keep connection and sex alive through all phases.</p>
          </div>
        </div>
      </section>

      {/* ─────────────────── Footer ─────────────────── */}
      <footer id="contact" className="bg-black text-center text-white py-8 px-6">
        <p>
          Contact us:&nbsp;
          <Link href="mailto:Moodmap.tech@gmail.com" className="underline">
            Moodmap.tech@gmail.com
          </Link>
        </p>
        <p className="mt-1">
          <Link href="/privacy-policy.html" className="underline">
            Privacy Policy
          </Link>
        </p>
        <p className="mt-2">© {new Date().getFullYear()} MoodMap. All rights reserved.</p>
      </footer>
    </>
  );
}
