"use client";

import React, { useState } from "react";
import { FaHeartbeat, FaBomb, FaLaughSquint } from "react-icons/fa";

export default function MoodMapPage() {
  const [submitted, setSubmitted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    window.location.href = "mailto:Moodmap.tech@gmail.com?subject=MoodMap%20Notify%20Me&body=Hi!%20I'd%20like%20to%20get%20updates%20about%20MoodMap.";
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#1E3A8A] text-white font-sans">
      {/* Header */}
      <header className="p-4 flex justify-between items-center border-b border-blue-900 relative z-50">
        <h1 className="text-4xl font-extrabold flex items-center gap-2">
          MoodMap
          <img src="/icon.png" alt="MoodMap logo" className="w-12 h-12 -ml-3 -mb-2 rotate-[15deg]" />
        </h1>
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <nav
          className={`fixed inset-x-0 top-16 p-6 z-40 transform transition-transform duration-300 ease-in-out bg-[#1E3A8A] shadow-lg rounded-b-xl md:static md:bg-transparent md:shadow-none md:rounded-none md:flex md:space-x-4 md:p-0 md:transform-none md:transition-none ${
            menuOpen ? "translate-y-0" : "-translate-y-full"
          } md:translate-y-0`}
        >
          <a href="#about" className="block py-2 md:inline-block hover:underline" onClick={() => setMenuOpen(false)}>About</a>
          <a href="#download" className="block py-2 md:inline-block hover:underline" onClick={() => setMenuOpen(false)}>Download</a>
          <a href="#contact" className="block py-2 md:inline-block hover:underline" onClick={() => setMenuOpen(false)}>Contact</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="text-center py-20 px-4">
        <h2 className="text-4xl font-bold mb-4">Understand the cycle. Survive the chaos.</h2>
        <p className="text-lg mb-6 max-w-xl mx-auto">
          MoodMap helps you track and survive the hormonal cycle with clarity, humor, and daily guidance for staying connected—and sane.
        </p>
        <div id="download" className="space-x-4">
          <a
            href="https://apps.apple.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-black text-white px-5 py-3 rounded-lg text-sm"
          >
            Download on the App Store
          </a>
          <a
            href="https://play.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-green-600 text-white px-5 py-3 rounded-lg text-sm"
          >
            Download on Google Play
          </a>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 px-4 max-w-4xl mx-auto">
        <h3 className="text-2xl font-semibold mb-4">About MoodMap</h3>
        <p className="text-white text-lg">
          MoodMap is built for men who want to survive—and even thrive—while navigating their partner&rsquo;s hormonal cycle. With a simple interface and brutally honest reminders, it’s your ultimate toolkit for better intimacy, timing, and day-to-day peacekeeping. It features an interactive color code that helps you know when it&rsquo;s best (or worst) to be intimate.
        </p>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white text-black rounded-xl shadow-sm">
            <h4 className="text-xl font-bold mb-2 flex items-center gap-2"><FaHeartbeat /> Cycle Overview</h4>
            <p>Quick-glance insight into what day it is—and what mood to expect.</p>
          </div>
          <div className="p-6 bg-white text-black rounded-xl shadow-sm">
            <h4 className="text-xl font-bold mb-2 flex items-center gap-2"><FaBomb /> Survival Alerts</h4>
            <p>Timely notifications for when to lean in, back off, or just bring snacks.</p>
          </div>
          <div className="p-6 bg-white text-black rounded-xl shadow-sm">
            <h4 className="text-xl font-bold mb-2 flex items-center gap-2"><FaLaughSquint /> Tips & Intimacy</h4>
            <p>Useful (and sometimes hilarious) tips to keep connection and sex alive through all phases.</p>
          </div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="py-20 px-4 text-center bg-[#121212] text-white">
        <h3 className="text-3xl font-bold mb-4">Coming Soon</h3>
        <p className="text-lg max-w-2xl mx-auto">
          Get useful tips on how to survive, sex and intimacy advice, and day-to-day updates—delivered with honesty and humor. Sign up below to get notified!
        </p>
        {submitted ? (
          <p className="mt-6 text-green-400 font-semibold">Thanks! You&rsquo;ll be notified when we launch 🚀</p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 flex justify-center flex-wrap gap-2">
            <input
              type="email"
              placeholder="Your email"
              required
              className="px-4 py-2 rounded-md text-black focus:outline-none min-w-[240px]"
            />
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md">
              Notify Me
            </button>
          </form>
        )}
      </section>

      {/* Contact Section */}
      <footer id="contact" className="py-10 text-center text-sm text-gray-300">
        <p>Contact us: <a href="mailto:Moodmap.tech@gmail.com" className="underline">Moodmap.tech@gmail.com</a></p>
        <p className="mt-2">&copy; {new Date().getFullYear()} MoodMap. All rights reserved.</p>
      </footer>
    </div>
  );
}
