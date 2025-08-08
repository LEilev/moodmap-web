// src/app/activate/page.js
"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const PLAY_LINK =
  "https://play.google.com/store/apps/details?id=com.eilev.moodmapnextgen";
const APPSTORE_LINK =
  "https://apps.apple.com/no/app/moodmap-moodcoaster/id6746102626?l=nb";

function isAndroid() {
  const ua = typeof navigator !== "undefined" ? navigator.userAgent || "" : "";
  return /Android/i.test(ua);
}
function isInAppBrowser() {
  const ua = typeof navigator !== "undefined" ? navigator.userAgent || "" : "";
  return /FBAN|FBAV|Instagram|Line|WeChat|MicroMessenger|TikTok|Twitter/i.test(ua);
}
const store = () => (isAndroid() ? PLAY_LINK : APPSTORE_LINK);

export default function ActivatePage({ searchParams }) {
  const [inApp, setInApp] = useState(false);
  const timer = useRef(null);

  // signerte param fra /thanks
  const u   = searchParams?.u || "";
  const s   = searchParams?.s || "";
  const exp = searchParams?.exp || "";
  const sig = searchParams?.sig || "";

  // UL – samme /activate, håndtert av OS ved bruker-tapp
  const deepLink = useMemo(() => {
    if (!u || !s || !exp || !sig) return "";
    const q = new URLSearchParams({ u, s, exp, sig });
    return `https://moodmap-app.com/activate?${q.toString()}`;
  }, [u, s, exp, sig]);

  useEffect(() => setInApp(isInAppBrowser()), []);

  // Kun butikk-fallback – IKKE auto-open til UL (fikser blink/loop)
  useEffect(() => {
    if (!deepLink) return;

    const delay = inApp ? 10_000 : 3_000; // 10s i in-app; 3s ellers
    timer.current = setTimeout(() => {
      if (!document.hidden) window.location.replace(store());
    }, delay);

    const cancel = () => { if (timer.current) { clearTimeout(timer.current); timer.current = null; } };
    const onVis  = () => document.hidden && cancel();

    window.addEventListener("visibilitychange", onVis, { passive: true, once: true });
    window.addEventListener("pagehide", cancel, { passive: true, once: true });

    return () => {
      window.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pagehide", cancel);
      cancel();
    };
  }, [deepLink, inApp]);

  return (
    <main className="min-h-screen bg-primary-blue text-white flex items-center justify-center p-8">
      <div className="w-full max-w-xl bg-white/5 backdrop-blur-lg p-8 rounded-3xl">
        <h1 className="text-3xl font-bold text-center mb-3">Open MoodMap</h1>
        <p className="text-center opacity-90 mb-6">
          Tap the button to open the app. If it’s not installed, we’ll offer the store shortly.
        </p>

        <a
          href={deepLink || "#"}
          className="block bg-white text-black text-center font-semibold py-3 rounded-full mb-5 hover:brightness-105"
        >
          🚀 Open MoodMap
        </a>

        {inApp && (
          <p className="text-sm text-center mb-4 opacity-90">
            If this doesn’t open the app, use “•••” → “Open in Safari/Chrome”, then try again.
          </p>
        )}

        <div className="flex items-center justify-center gap-3 text-sm opacity-90">
          <a href={store()} className="underline">I don’t have the app – take me to the store</a>
        </div>

        <p className="text-center text-xs opacity-70 mt-6">
          We’ll only suggest the store after a short delay if the app didn’t open.
        </p>
      </div>
    </main>
  );
}
