// src/app/page.js
import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section id="hero" className="bg-primary-blue text-white text-center py-20 px-6">
        <h1 className="text-4xl font-bold mb-4">Understand the cycle. Survive the chaos.</h1>
        <p className="mb-8 text-lg">
          MoodMap helps you track and survive the hormonal cycle with clarity, humor, and daily guidance for staying connected—and sane.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="#" className="px-6 py-3 bg-black text-white rounded font-medium hover:bg-gray-800">
            Download on the App Store
          </Link>
          <Link href="#" className="px-6 py-3 bg-green-500 text-white rounded font-medium hover:bg-green-600">
            Download on Google Play
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="max-w-3xl mx-auto text-center mb-16 px-6">
        <h2 className="text-2xl font-semibold mb-4">About MoodMap</h2>
        <p className="text-base">
          MoodMap is built for men who want to survive—and even thrive—while navigating their partner’s hormonal cycle. With a simple interface and brutally honest reminders, it’s your ultimate toolkit for better intimacy, timing, and day-to-day peacekeeping. It features an interactive color code that helps you know when it’s best (or worst) to be intimate.
        </p>
      </section>

      {/* Feature Cards Section */}
      <section id="features" className="bg-primary-blue pb-16">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Cycle Overview Card */}
          <div className="bg-white text-black rounded-2xl p-6 shadow-lg">
            <h3 className="flex items-center text-xl font-semibold mb-2">
              <span className="mr-2">❤️‍🩹</span> Cycle Overview
            </h3>
            <p>Quick-glance insight into what day it is—and what mood to expect.</p>
          </div>

          {/* Survival Alerts Card */}
          <div className="bg-white text-black rounded-2xl p-6 shadow-lg">
            <h3 className="flex items-center text-xl font-semibold mb-2">
              <span className="mr-2">⏰</span> Survival Alerts
            </h3>
            <p>Timely notifications for when to lean in, back off, or just bring snacks.</p>
          </div>

          {/* Tips & Intimacy Card */}
          <div className="bg-white text-black rounded-2xl p-6 shadow-lg">
            <h3 className="flex items-center text-xl font-semibold mb-2">
              <span className="mr-2">🍑</span> Tips & Intimacy
            </h3>
            <p>Useful (and sometimes hilarious) tips to keep connection and sex alive through all phases.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-black text-center text-white py-6">
        <p>Contact us: <Link href="mailto:Moodmap.tech@gmail.com" className="underline">Moodmap.tech@gmail.com</Link></p>
        <Link href="/privacy-policy.html" className="underline">Privacy Policy</Link>
        <p className="mt-2">© 2025 MoodMap. All rights reserved.</p>
      </footer>
    </>
  );
}