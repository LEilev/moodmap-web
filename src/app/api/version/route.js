// src/app/api/version/route.js
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SCHEMA_VERSION = 1;

// Dine IDs:
const IOS_APP_STORE_ID = "6746102626";
const ANDROID_PACKAGE = "com.eilev.moodmapnextgen";

// Store URLs (native + fallback web)
const IOS_STORE_URL = `itms-apps://apps.apple.com/app/id${IOS_APP_STORE_ID}`;
const IOS_WEB_URL = `https://apps.apple.com/app/id${IOS_APP_STORE_ID}`;

const ANDROID_STORE_URL = `market://details?id=${ANDROID_PACKAGE}`;
const ANDROID_WEB_URL = `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE}`;

// P0 manual fallback (kan overrides via env)
const FALLBACK_IOS_LATEST = process.env.MOODMAP_IOS_LATEST_VERSION || "5.0.0";
const FALLBACK_ANDROID_LATEST = process.env.MOODMAP_ANDROID_LATEST_VERSION || "5.0.0";

// iOS auto via Apple lookup (på som default)
const AUTOFETCH_IOS =
  (process.env.MOODMAP_AUTOFETCH_IOS ?? "true").toLowerCase() === "true";

const FETCH_TIMEOUT_MS = Number(process.env.MOODMAP_VERSION_FETCH_TIMEOUT_MS || "2500");

// CDN caching (Vercel/CDN gjør dette “industristandard” uten Redis)
const S_MAXAGE = Number(process.env.MOODMAP_VERSION_CDN_S_MAXAGE_SECONDS || "7200"); // 2h
const SWR = Number(process.env.MOODMAP_VERSION_CDN_SWR_SECONDS || "86400"); // 24h

async function fetchWithTimeout(url, timeoutMs) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });
  } finally {
    clearTimeout(t);
  }
}

async function fetchAppleIOSLatest() {
  // Apple iTunes Search API lookup by ID
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

  const res = NextResponse.json(payload);
  res.headers.set(
    "Cache-Control",
    `public, max-age=0, s-maxage=${S_MAXAGE}, stale-while-revalidate=${SWR}`
  );
  return res;
}
