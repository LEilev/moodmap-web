// src/app/page.js
import Link from "next/link";

const LINKS = {
  monthly: "https://buy.stripe.com/aFabJ27zZgea0lgfzP3ks03",
  yearly:  "https://buy.stripe.com/6oU5kE2fFgea2to2N33ks04", // bytt hvis $29.99 har egen URL
};

export default function HomePage() {
  return (
    <>
      {/* ───────── Hero ───────── */}
      <section id="hero" className="bg-primary-blue text-center px-6 pt-16 pb-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight max-w-4xl mx-auto">
          Understand the cycle. <span className="block">Survive the chaos.</span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-blue-100">
          MoodMap helps you track and survive the hormonal cycle with clarity, humor,
          and daily guidance for staying connected—and sane.
        </p>

        {/* Store buttons */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
          <a
            href="https://apps.apple.com/no/app/moodmap-moodcoaster/id6746102626?l=nb"
            className="inline-flex h-11 items-center justify-center rounded-lg bg-black px-5 text-sm font-semibold text-white transition hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          >
            Download on the App Store
          </a>
          <a
            href="https://play.google.com/store/apps/details?id=com.eilev.moodmapnextgen"
            className="inline-flex h-11 items-center justify-center rounded-lg bg-[#34A853] px-5 text-sm font-semibold text-white transition hover:bg-[#2f9a49] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#34A853]"
          >
            Get it on Google Play
          </a>
        </div>
        <p className="text-sm text-blue-200 mt-3">Available on iOS and Android</p>

   
      {/* ───────── About ───────── */}
      <section id="about" className="max-w-3xl mx-auto text-center my-20 px-6">
        <h2 className="text-2xl font-semibold mb-3">About MoodMap</h2>
        <p className="text-blue-100">
          MoodMap is built for men who want to survive—and even thrive—while navigating
          their partner’s hormonal cycle. With brutally honest reminders and an interactive
          color code, it’s your ultimate toolkit for better intimacy, timing, and day-to-day
          peacekeeping.
        </p>
      </section>

      {/* ───────── Feature Cards ───────── */}
      <section id="features" className="bg-primary-blue pb-24">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white text-black rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition">
            <h3 className="text-xl font-semibold mb-2">❤️‍🩹 Cycle Overview</h3>
            <p>Quick-glance insight into what day it is—and what mood to expect.</p>
          </div>
          <div className="bg-white text-black rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition">
            <h3 className="text-xl font-semibold mb-2">⏰ Survival Alerts</h3>
            <p>Timely notifications for when to lean in, back off, or just bring snacks.</p>
          </div>
          <div className="bg-white text-black rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition">
            <h3 className="text-xl font-semibold mb-2">🍑 Tips & Intimacy</h3>
            <p>Useful (and sometimes hilarious) tips to keep connection and sex alive through all phases.</p>
          </div>
        </div>
      </section>

      {/* ───────── Footer ───────── */}
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
