"use client";

import React, { useState } from "react";
import { FaHeartbeat, FaBomb, FaLaughSquint } from "react-icons/fa";

export default function MoodMapPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    window.location.href = "mailto:Moodmap.tech@gmail.com?subject=Notify%20Me&body=Hi!%20I'd%20like%20to%20get%20updates%20about%20MoodMap.";
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#1E3A8A] text-white font-sans tracking-normal leading-relaxed">
      {/* Header */}
      <header className="p-6 flex justify-between items-center border-b border-blue-900 shadow-md">
        <h1 className="text-4xl font-extrabold text-white drop-shadow-md">MoodMap<span className="text-green-400">™</span></h1>
        <nav className="space-x-6 text-white text-sm font-medium">
          <a href="#about" className="hover:text-green-400 transition">About</a>
          <a href="#download" className="hover:text-green-400 transition">Download</a>
          <a href="#contact" className="hover:text-green-400 transition">Contact</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="text-center py-20 px-6 bg-gradient-to-b from-[#1E3A8A] to-[#0F172A]">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight drop-shadow-xl">
          Understand the cycle. <br className="hidden md:block" />Survive the chaos 💥
        </h2>
        <p className="text-lg max-w-xl mx-auto mb-8 text-blue-100">
          MoodMap helps you decode mood swings, dodge emotional landmines, and become a cycle-savvy legend – all with humor and real tips.
        </p>
        <div id="download" className="space-x-4">
          <a
            href="https://apps.apple.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-black hover:bg-gray-900 text-white px-6 py-3 rounded-lg text-sm font-semibold shadow-md hover:scale-105 transition"
          >
            🍎 App Store
          </a>
          <a
            href="https://play.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg text-sm font-semibold shadow-md hover:scale-105 transition"
          >
            🤖 Google Play
          </a>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 px-6 max-w-4xl mx-auto">
        <h3 className="text-2xl font-bold mb-4 text-green-300">What is MoodMap?</h3>
        <p className="text-lg text-blue-100">
          It's the ultimate survival tool for men who live with, date, or love women. We help you sync with the cycle – not fight it. Expect cycle forecasts, danger zones 🚨, cuddle windows, and yes – chocolate alerts 🍫.
        </p>
      </section>

      {/* Feature Boxes */}
      <section className="py-16 px-6 bg-[#0F172A]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white text-black p-6 rounded-xl shadow-lg hover:shadow-2xl hover:scale-[1.03] transition">
            <h4 className="text-xl font-bold mb-2 flex items-center gap-2"><FaHeartbeat /> Cycle Radar</h4>
            <p>Quick-glance insights into the day, the vibe, and your survival chances.</p>
          </div>
          <div className="bg-white text-black p-6 rounded-xl shadow-lg hover:shadow-2xl hover:scale-[1.03] transition">
            <h4 className="text-xl font-bold mb-2 flex items-center gap-2"><FaBomb /> Alerts & Warnings</h4>
            <p>Know when to give hugs – or hide. Time your compliments and exits with precision.</p>
          </div>
          <div className="bg-white text-black p-6 rounded-xl shadow-lg hover:shadow-2xl hover:scale-[1.03] transition">
            <h4 className="text-xl font-bold mb-2 flex items-center gap-2"><FaLaughSquint /> Intimacy & Humor</h4>
            <p>Daily tips on connection, when to flirt, and how not to die in the luteal phase 😬.</p>
          </div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="py-20 px-6 text-center bg-[#121212] text-white">
        <h3 className="text-3xl font-bold mb-4 text-green-300">Coming Soon 🚀</h3>
        <p className="text-lg max-w-2xl mx-auto">
          Get brutally honest tips, cycle humor, survival strategies, and yes – intimacy secrets, straight to your inbox.
        </p>
        {submitted ? (
          <p className="mt-6 text-green-400 font-semibold">Thanks legend! You’ll be notified when we launch 💌</p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 flex justify-center flex-wrap gap-2">
            <input
              type="email"
              placeholder="Your email"
              required
              className="px-4 py-2 rounded-md text-black focus:outline-none min-w-[240px]"
            />
            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md shadow-md font-semibold">
              Notify Me 💚
            </button>
          </form>
        )}
      </section>

      {/* Contact Footer */}
      <footer id="contact" className="py-10 text-center text-sm text-gray-400">
        <p>Have feedback or want to collaborate? <a href="mailto:Moodmap.tech@gmail.com" className="underline">Moodmap.tech@gmail.com</a></p>
        <p className="mt-2">&copy; {new Date().getFullYear()} MoodMap. All rights reserved.</p>
      </footer>
    </div>
  );
}
