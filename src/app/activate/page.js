// src/app/activate/page.js
// -----------------------------------------------------------------------------
// Universal Link landing – safe, user-first fallback
//  - Never auto-open store immediately
//  - Delay fallback 10s, cancel on app open / user interaction
//  - Platform-aware store links (iOS vs Android)
//  - Optional suppression: "Don't send me to the store" (60m)
// -----------------------------------------------------------------------------

"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const PLAY_LINK =
  "https://play.google.com/store/apps/details?id=com.eilev.moodmapnextgen";
const APPSTORE_LINK =
  "https://apps.apple.com/no/app/moodmap-moodcoaster/id6746102626?l=nb";

function isAndroid() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  return /Android/i.test(ua);
}

function isIOS() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  return /iPhone|iPad|iPod/i.test(ua);
}

function isInAppBrowser() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  // Rough heuristics for IG/FB/TikTok/Twitter in-app browsers
  return /FBAN|FBAV|Instagram|Line|WeChat|MicroMessenger|TikTok|Twitter/i.test(ua);
}

function getStoreLink() {
  return isAndroid() ? PLAY_LINK : APPSTORE_LINK;
}

function nowSec() {
  return Math.floor(Date.now() / 1000);
}

export default function ActivatePage({ searchParams }) {
  const [suppressed, setSuppressed] = useState(false);
  const [inApp, setInApp] = useState(false);

  // Read signed UL params
  const u = searchParams?.u || "";
  const s = searchParams?.s || "";
  const exp = searchParams?.exp || "";
  const sig = searchParams?.sig || "";

  // Build the deep link back into app
  const deepLink = useMemo(() => {
    if (!u || !s || !exp || !sig) return "";
    const q = new URLSearchParams({ u, s, exp, sig });
    return `https://moodmap-app.com/activate?${q.toString()}`;
  }, [u, s, exp, sig]);

  // Track a single fallback timer
  const timerRef = useRef(null);
  const cancelFallback = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  // Respect "do not redirect" suppression (60 min)
  useEffect(() => {
    try {
      const until = localStorage.getItem("mm_store_suppress_until");
      if (until && Number(until) > nowSec()) setSuppressed(true);
    } catch {}
    setInApp(isInAppBrowser());
  }, []);

  // Set up safe fallback: wait 10s, cancel on open/blur/visibilitychange/pagehide
  useEffect(() => {
    if (!deepLink) return;

    // Open app immediately on load (user can also press the button)
    // We rely on the OS to handle the universal link → app.
    const openApp = () => {
      try {
        window.location.assign(deepLink);
      } catch {}
    };

    openApp();

    // Schedule fallback only if not suppressed
    if (!suppressed) {
      timerRef.current = setTimeout(() => {
        // still visible and user hasn't interacted → send to the correct store
        try {
          window.location.assign(getStoreLink());
        } catch {}
      }, 10_000); // 10s
    }

    // Cancel on signals that likely mean the app opened or user acted
    const cancelers = [
      ["visibilitychange", () => document.hidden && cancelFallback()],
      ["pagehide", cancelFallback],
      ["blur", cancelFallback],
      ["focus", () => {}], // no-op; reserving if needed later
    ];
    cancelers.forEach(([ev, fn]) => window.addEventListener(ev, fn, { passive: true }));

    return () => {
      cancelFallback();
      cancelers.forEach(([ev, fn]) => window.removeEventListener(ev, fn));
    };
  }, [deepLink, suppressed]);

  // User-initiated open = always cancel fallback
  const handleOpenClick = () => {
    cancelFallback();
    try {
      window.location.assign(deepLink);
    } catch {}
  };

  const handleSuppress = () => {
    cancelFallback();
    try {
      const until = nowSec() + 60 * 60; // 60 min
      localStorage.setItem("mm_store_suppress_until", String(until));
      setSuppressed(true);
    } catch {}
  };

  return (
    <main className="min-h-screen bg-primary-blue text-white flex items-center justify-center p-8">
      <div className="w-full max-w-xl bg-white/5 backdrop-blur-lg p-8 rounded-3xl">
        <h1 className="text-3xl font-bold text-center mb-3">Open MoodMap</h1>
        <p className="text-center opacity-90 mb-6">
          Tap the button to open the app. If it’s not installed, we’ll offer the store shortly.
        </p>

        <a
          href={deepLink || "#"}
          onClick={handleOpenClick}
          className="block bg-white text-black text-center font-semibold py-3 rounded-full mb-5 hover:brightness-105"
        >
          🚀 Open MoodMap
        </a>

        {inApp && (
          <p className="text-sm text-center mb-4 opacity-90">
            If this doesn’t open the app, tap the ••• menu and choose “Open in Safari/Chrome”, then try again.
          </p>
        )}

        <div className="flex items-center justify-center gap-3 text-sm opacity-90">
          <button
            onClick={() => {
              cancelFallback();
              try { window.location.assign(getStoreLink()); } catch {}
            }}
            className="underline"
          >
            I don’t have the app – take me to the store
          </button>
          <span aria-hidden>•</span>
          <button onClick={handleSuppress} className="underline">
            Don’t send me to the store
          </button>
        </div>

        <p className="text-center text-xs opacity-70 mt-6">
          We’ll only suggest the store after ~10s if the app didn’t open.
        </p>
      </div>
    </main>
  );
}
