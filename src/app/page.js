"use client";

import React, { useState } from "react";
import { FaHeartbeat, FaBomb, FaLaughSquint } from "react-icons/fa";

export default function MoodMapPage() {
  const [submitted, setSubmitted] = useState(false);
  const [showCookies, setShowCookies] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    window.location.href = "mailto:Moodmap.tech@gmail.com?subject=Notify%20Me&body=Hi!%20I&#39;d%20like%20to%20get%20updates%20about%20MoodMap.";
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#1E3A8A] text-white font-sans">
      {/* Header */}
      <header className="p-6 flex justify-between items-center border-b border-blue-900">
        <h1 className="text-4xl font-extrabold text-white">MoodMap</h1>
        <nav className="space-x-6 text-sm font-medium">
          <a href="#about" className="hover:underline">About</a>
          <a href="#download" className="hover:underline">Download</a>
          <a href="#contact" className="hover:underline">Contact</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="text-center py-20 px-6">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
          Understand the cycle. <br className="hidden md:block" />Survive the chaos.
        </h2>
        <p className="text-lg max-w-xl mx-auto mb-8">
          MoodMap helps you decode mood swings and better understand how to approach intimacy and connection—day by day.
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

      {/* About Section */}
      <section id="about" className="py-16 px-6 max-w-4xl mx-auto">
        <h3 className="text-2xl font-bold mb-4">What is MoodMap?</h3>
        <p className="text-lg">
          MoodMap gives you cycle-based insights to help you build a better connection. Whether it&#39;s time to cuddle or take a walk—MoodMap lets you know.
        </p>
      </section>

      {/* Feature Boxes */}
      <section className="py-16 px-6 bg-[#0F172A]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white text-black p-6 rounded-xl shadow">
            <h4 className="text-xl font-bold mb-2 flex items-center gap-2"><FaHeartbeat /> Cycle Radar</h4>
            <p>See what phase she’s in and how to adapt your energy.</p>
          </div>
          <div className="bg-white text-black p-6 rounded-xl shadow">
            <h4 className="text-xl font-bold mb-2 flex items-center gap-2"><FaBomb /> Alerts</h4>
            <p>Know when tension might rise—and when to bring calm.</p>
          </div>
          <div className="bg-white text-black p-6 rounded-xl shadow">
            <h4 className="text-xl font-bold mb-2 flex items-center gap-2"><FaLaughSquint /> Intimacy</h4>
            <p>Helpful cues for closeness, boundaries, and comfort.</p>
          </div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="py-20 px-6 text-center bg-[#121212] text-white">
        <h3 className="text-3xl font-bold mb-4">Coming Soon</h3>
        <p className="text-lg max-w-2xl mx-auto">
          Sign up to be notified when MoodMap is ready. We&#39;ll send launch updates, new features, and early access info.
        </p>
        {submitted ? (
          <p className="mt-6 text-green-400 font-semibold">Thanks! You&#39;ll be notified when we launch.</p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 flex justify-center flex-wrap gap-2">
            <input
              type="email"
              placeholder="Your email"
              required
              className="px-4 py-2 rounded-md text-black focus:outline-none min-w-[240px]"
            />
            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md shadow-md font-semibold">
              Notify Me
            </button>
          </form>
        )}
      </section>

      {/* Contact Footer */}
      <footer id="contact" className="py-10 text-center text-sm text-gray-300">
        <p>Contact us: <a href="mailto:Moodmap.tech@gmail.com" className="underline">Moodmap.tech@gmail.com</a></p>
        <p className="mt-2">&copy; {new Date().getFullYear()} MoodMap. All rights reserved.</p>
      </footer>

      {/* Cookie Banner */}
      {showCookies && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white text-sm px-4 py-3 flex justify-between items-center z-50 shadow-md">
          <p>This website uses cookies to enhance the user experience. By continuing, you accept our use of cookies.</p>
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded ml-4"
            onClick={() => setShowCookies(false)}
          >
            Accept
          </button>
        </div>
      )}
    </div>
  );
}
