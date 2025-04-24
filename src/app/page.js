"use client";

import React, { useState } from "react";
import { FaHeartbeat, FaBomb, FaLaughSquint } from "react-icons/fa";

export default function MoodMapPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
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
          MoodMap helps you track and survive the hormonal cycle with clarity, humor, and daily guidance for staying connected—and sane.
        </p>
        <div id="download" className="space-x-4">
          <a
            href="https://apps.apple.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-gradient-to-r from-[#228BE6] to-[#1A73C7] text-white px-6 py-3 rounded-lg text-sm font-semibold shadow hover:from-[#4DABF7] hover:to-[#339AF0] transition-all"
          >
            Download on the App Store
          </a>
          <a
            href="https://play.google.com/store/apps/details?id=com.eilev.moodmapnextgen"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-gradient-to-r from-[#4CAF50] to-[#388E3C] text-white px-6 py-3 rounded-lg text-sm font-semibold shadow hover:from-[#66BB66] hover:to-[#388E3C] transition-all"
          >
            Download on Google Play
          </a>
        </div>
      </section>

      {/* About MoodMap Section */}
      <section id="about" className="max-w-4xl mx-auto py-10 px-6">
        <h3 className="text-2xl font-bold mb-4 text-white">About MoodMap</h3>
        <p className="text-sm leading-relaxed mb-8 text-gray-300">
          MoodMap is built for men who want to survive—and even thrive—while navigating their partner’s hormonal cycle. With a simple interface and brutally honest reminders, it’s your ultimate toolkit for better intimacy, timing, and day-to-day peacekeeping. It features an interactive color code that helps you know when it’s best (or worst) to be intimate.
        </p>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white text-black rounded-lg shadow p-6">
            <h4 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <FaHeartbeat /> Cycle Overview
            </h4>
            <p className="text-sm text-gray-700">
              🔴 Quick-glance insight into what day it is—and what mood to expect.
            </p>
          </div>
          <div className="bg-white text-black rounded-lg shadow p-6">
            <h4 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <FaBomb /> Survival Alerts
            </h4>
            <p className="text-sm text-gray-700">
              💣 Timely notifications for when to lean in, back off, or just bring snacks.
            </p>
          </div>
          <div className="bg-white text-black rounded-lg shadow p-6">
            <h4 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <FaLaughSquint /> Tips & Intimacy
            </h4>
            <p className="text-sm text-gray-700">
              💑 Useful (and sometimes hilarious) tips to keep connection and sex alive through all phases.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}