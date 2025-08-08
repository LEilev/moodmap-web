"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const PLAY_LINK =
  "https://play.google.com/store/apps/details?id=com.eilev.moodmapnextgen";
const APPSTORE_LINK =
  "https://apps.apple.com/no/app/moodmap-moodcoaster/id6746102626?l=nb";

function isAndroid() {
  if (typeof navigator === "undefined") return false;
  return /Android/i.test(navigator.userAgent || "");
}

function isIOS() {
  if (typeof navigator === "undefined") return false;
  return /iPhone|iPad|iPod/i.test(navigator.userAgent || "");
}

function isInAppBrowser() {
  if (typeof navigator === "undefined") return false;
  return /FBAN|FBAV|Instagram|Line|WeChat|MicroMessenger|TikTok|Twitter/i.test(
    navigator.userAgent || ""
  );
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

  const u = searchParams?.u || "";
  const s = searchParams?.s || "";
  const exp = searchParams?.exp || "";
  const sig = searchParams?.sig || "";

  const deepLink = useMemo(() => {
    if (!u || !s || !exp || !sig) return "";
    const q = new URLSearchParams({ u, s, exp, sig });
    return `https://moodmap-app.com/activate?${q.toString()}`;
  }, [u, s, exp, sig]);

  const timerRef = useRef(null);
  const cancelFallback = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    try {
      const until = localStorage.getItem("mm_store_suppress_until");
      if (until && Number(until) > nowSec()) setSuppressed(true);
    } catch {}
    setInApp(isInAppBrowser());
  }, []);

  useEffect(() => {
    if (!deepLink) return;

    const openApp = () => {
      try {
        window.location.assign(deepLink);
      } catch {}
    };
    openApp();

    const delayMs = inApp ? 10_000 : 3_000;

    if (!suppressed) {
      timerRef.current = setTimeout(() => {
        try {
          window.location.assign(getStoreLink());
        } catch {}
      }, delayMs);
    }

    const cancelers = [
      ["visibilitychange", () => document.hidden && cancelFallback()],
      ["pagehide", cancelFallback],
      ["blur", cancelFallback],
    ];
    cancelers.forEach(([ev, fn]) =>
      window.addEventListener(ev, fn, { passive: true })
    );

    return () => {
      cancelFallback();
      cancelers.forEach(([ev, fn]) => window.removeEventListener(ev, fn));
    };
  }, [deepLink, suppressed, inApp]);

  const handleOpenClick = () => {
    cancelFallback();
    try {
      window.location.assign(deepLink);
    } catch {}
  };

  const handleSuppress = () => {
    cancelFallback();
    try {
      const until = nowSec() + 60 * 60;
      localStorage.setItem("mm_store_suppress_until", String(until));
      setSuppressed(true);
    } catch {}
  };

  return (
    <main className="min-h-screen bg-primary-blue text-white flex items-center justify-center p-8">
      <div className="w-full max-w-xl bg-white/5 backdrop-blur-lg p-8 rounded-3xl">
        <h1 className="text-3xl font-bold text-center mb-3">Open MoodMap</h1>
        <p className="text-center opacity-90 mb-6">
          Tap the button to open the app. If it’s not installed, we’ll offer the
          store shortly.
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
            If this doesn’t open the app, tap the ••• menu and choose “Open in
            Safari/Chrome”, then try again.
          </p>
        )}

        <div className="flex items-center justify-center gap-3 text-sm opacity-90">
          <button
            onClick={() => {
              cancelFallback();
              try {
                window.location.assign(getStoreLink());
              } catch {}
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
          We’ll only suggest the store after a short delay if the app didn’t
          open.
        </p>
      </div>
    </main>
  );
}
