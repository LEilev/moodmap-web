"use client";

import { useEffect, useState } from "react";

const PLAY_LINK = "https://play.google.com/store/apps/details?id=com.eilev.moodmapnextgen";
const APPSTORE_LINK = "https://apps.apple.com/app/id6746102626";

export default function ActivateClient({ activation = null, refreshHref = "" }) {
  const [inApp, setInApp] = useState(false);
  useEffect(() => { setInApp(/FBAN|FBAV|Instagram|Line|WeChat|MicroMessenger|TikTok|Twitter/i.test(navigator.userAgent || "")); }, []);
  const deepLink = activation ? `moodmap-app://activate?${new URLSearchParams(activation)}` : "";
  return (
    <main className="min-h-screen bg-primary-blue text-white flex items-center justify-center px-5 py-16">
      <div className="w-full max-w-xl bg-white/5 border border-white/15 p-6 sm:p-9 rounded-3xl">
        <h1 className="text-3xl font-bold text-center mb-4">{deepLink ? "Open MoodMap" : "Refresh your activation link"}</h1>
        <p className="text-center text-white/85 mb-6">{deepLink ? "Use the button below to continue in the app. Your browser may ask you to confirm." : "This link is incomplete or has expired. You can check your checkout again or restore your purchase inside MoodMap."}</p>
        {deepLink ? <a href={deepLink} rel="noreferrer" className="block bg-white text-slate-950 text-center font-semibold py-3 px-5 rounded-full mb-6 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">Open the MoodMap app</a>
          : refreshHref ? <a href={refreshHref} className="block bg-white text-slate-950 text-center font-semibold py-3 px-5 rounded-full mb-6">Check my access</a> : null}
        {inApp && <p className="text-sm text-center mb-6 text-white/85">If the app doesn’t open, use this browser’s menu to open the page in Safari or Chrome, then try again.</p>}
        <h2 className="font-semibold text-center mb-3">Need to install MoodMap?</h2>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a href={APPSTORE_LINK} rel="noreferrer" className="underline underline-offset-4 py-2">App Store</a>
          <a href={PLAY_LINK} rel="noreferrer" className="underline underline-offset-4 py-2">Google Play</a>
        </div>
        <p className="text-center text-sm text-white/80 mt-5">After installing, return to your confirmation link to finish setup.</p>
        <p className="text-center text-sm text-white/80 mt-6">Need help? <a href="mailto:support@moodmap-app.com" className="underline">Contact support</a>.</p>
      </div>
    </main>
  );
}
