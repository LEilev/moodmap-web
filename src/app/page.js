"use client";

import React, { useState } from "react";
import { FaHeartbeat, FaBomb, FaLaughSquint } from "react-icons/fa";

export default function MoodMapPage() {
  const [submitted, setSubmitted] = useState(false);
  const [showCookies, setShowCookies] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Åpner e-postklient for "Notify me"-knapp
    window.location.href =
      "mailto:Moodmap.tech@gmail.com?subject=Notify%20Me&body=Hi!%20I’d%20like%20to%20get%20updates%20about%20MoodMap.";
    setSubmitted(true);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="text-center py-16 px-6 bg-[#0F172A]" id="hero">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
          Understand the cycle. <br className="hidden md:block" />
          Survive the chaos.
        </h2>
        <p className="text-lg max-w-xl mx-auto mb-8">
          MoodMap helps you decode mood swings and better understand how to approach
          intimacy and connection—day by day.
        </p>
        <div id="download" className="space-x-4">
          <a
            href="https://apps.apple.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-black text-white px-6 py-3 rounded-lg text-sm font-semibold shadow"
          >
            App Store
          </a>
          <a
            href="https://play.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg text-sm font-semibold shadow"
          >
            Google Play
          </a>
        </div>
      </section>

      {/* Tre-kolonners layout */}
      <main className="max-w-6xl mx-auto py-10 px-4 md:px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Leftboks */}
        <aside className="bg-white text-black rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
            <FaHeartbeat /> Leftboks
          </h3>
          <p className="text-sm mb-4 leading-relaxed">
            Her kan du legge status, menyer eller informasjon som ligner appens “venstreboks”.
          </p>
          <div className="p-4 border border-gray-300 rounded">
            <h4 className="font-semibold mb-1">Dagens Status</h4>
            <p className="text-gray-700 text-sm">
              Day 12 &middot; Follicular Phase
            </p>
          </div>
        </aside>

        {/* Midboks */}
        <section id="about" className="bg-white text-black rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
            <FaLaughSquint /> About MoodMap
          </h3>
          <p className="text-sm leading-relaxed mb-4">
            MoodMap gives you cycle-based insights to help you build a better connection.
            Whether it’s time to cuddle or take a walk—MoodMap lets you know.
          </p>
          {/* Notify form */}
          <form onSubmit={handleSubmit} className="mb-4">
            <button
              type="submit"
              className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded shadow text-sm font-semibold"
            >
              Notify Me
            </button>
            {submitted && (
              <p className="text-green-600 mt-2 text-sm">
                Taking you to your email client...
              </p>
            )}
          </form>

          {/* Eksempel-liste over funksjoner */}
          <div className="border-t pt-4 mt-4">
            <h4 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <FaBomb /> Key Features
            </h4>
            <ul className="list-disc list-inside text-sm text-gray-700">
              <li>Cycle Radar – see the daily phase & adapt your energy</li>
              <li>Alerts – know when tension is rising</li>
              <li>Simple, friendly interface with cycle-based tips</li>
            </ul>
          </div>
        </section>

        {/* Rightboks */}
        <aside id="contact" className="bg-white text-black rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
            <FaBomb /> Rightboks
          </h3>
          <p className="text-sm leading-relaxed mb-4">
            Bruk denne kolonnen til et kontaktskjema, CTA-knapper,
            eller nye funksjoner som matcher appens “høyresider”.
          </p>
          <div className="space-y-2">
            <a
              href="mailto:Moodmap.tech@gmail.com"
              className="inline-block bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded hover:bg-blue-500"
            >
              Contact Us
            </a>
            <p className="text-gray-700 text-xs">
              Have questions? Send us a message.
            </p>
          </div>
        </aside>
      </main>

      {/* Cookie-lignende boks (valgfritt) */}
      {showCookies && (
        <div className="bg-black text-white text-sm p-4 flex items-center justify-between">
          <span>
            We use cookies to ensure the best experience on our website.
          </span>
          <button
            className="bg-blue-600 px-3 py-1 rounded ml-4"
            onClick={() => setShowCookies(false)}
          >
            OK
          </button>
        </div>
      )}
    </div>
  );
}
