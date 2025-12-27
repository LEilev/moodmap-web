// src/app/api/version/route.js
import { NextResponse } from "next/server";

export const runtime = "nodejs";

// ✅ Tell Next/Vercel to cache this route for 2 hours (CDN / s-maxage).
// This is the supported, deterministic way to get caching on Route Handlers.
export const revalidate = 7200;

const SCHEMA_VERSION = 1;

const IOS_APP_STORE_ID = "6746102626";
const ANDROID_PACKAGE = "com.eilev.moodmapnextgen";

const IOS_STORE_URL = `itms-apps://apps.apple.com/app/id${IOS_APP_STORE_ID}`;
const IOS_WEB_URL = `https://apps.apple.com/app/id${IOS_APP_STORE_ID}`;

const ANDROID_STORE_URL = `market://details?id=${ANDROID_PACKAGE}`;
const ANDROID_WEB_URL = `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE}`;

// P0 manual fallback (overstyr via env i Vercel)
const FALLBACK_IOS_LATEST = process.env.MOODMAP_IOS_LATEST_VERSION || "5.0.0";
const FALLBACK_ANDROID_LATEST = process.env.MOODMAP_ANDROID_LATEST_VERSION || "5.0.0";

// iOS auto-fetch (Apple lookup) – default ON
const AUTOFETCH_IOS =
  (process.env.MOODMAP_AUTOFETCH_IOS ?? "true").toLowerCase() === "true";

const FETCH_TIMEOUT_MS = Number(process.env.MOODMAP_VERSION_FETCH_TIMEOUT_MS || "2500");

async function fetchWithTimeout(url, timeoutMs) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      headers: { Accept: "application/json" },
      signal: controller.signal,
      // Important: do not force cache/no-store here; route-level revalidate controls caching.
    });
  } finally {
    clearTimeout(t);
  }
}

async function fetchAppleIOSLatest() {
  const url = `https://itunes.apple.com/lookup?id=${encodeURIComponent(IOS_APP_STORE_ID)}`;
  try {
    const res = await fetchWithTimeout(url, FETCH_TIMEOUT_MS);
    if (!res.ok) return null;

    const data = await res.json().catch(() => null);
    const app = data?.results?.[0];
    if (!app?.version) return null;

    return {
      latestVersion: String(app.version),
      webUrl: app.trackViewUrl ? String(app.trackViewUrl) : null,
    };
  } catch {
    return null;
  }
}

export async function GET() {
  const payload = {
    schemaVersion: SCHEMA_VERSION,
    ios: {
      latestVersion: FALLBACK_IOS_LATEST,
      storeUrl: IOS_STORE_URL,
      webUrl: IOS_WEB_URL,
    },
    android: {
      latestVersion: FALLBACK_ANDROID_LATEST,
      storeUrl: ANDROID_STORE_URL,
      webUrl: ANDROID_WEB_URL,
    },
    generatedAt: new Date().toISOString(),
  };

  if (AUTOFETCH_IOS) {
    const ios = await fetchAppleIOSLatest();
    if (ios?.latestVersion) payload.ios.latestVersion = ios.latestVersion;
    if (ios?.webUrl) payload.ios.webUrl = ios.webUrl;
  }

  return NextResponse.json(payload);
}
