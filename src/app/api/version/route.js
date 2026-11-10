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

function validVersion(value) {
  return typeof value === "string" && /^\d{1,5}\.\d{1,5}\.\d{1,5}$/.test(value.trim())
    ? value.trim()
    : null;
}

// iOS 5.0.10 was verified against the public App Store on 2026-11-10.
// Android remains explicitly managed through its production environment value.
const FALLBACK_IOS_LATEST = validVersion(process.env.MOODMAP_IOS_LATEST_VERSION) || "5.0.10";
const FALLBACK_ANDROID_LATEST = validVersion(process.env.MOODMAP_ANDROID_LATEST_VERSION) || "5.0.8";

// iOS auto-fetch (Apple lookup) – default ON
const AUTOFETCH_IOS =
  (process.env.MOODMAP_AUTOFETCH_IOS ?? "true").toLowerCase() === "true";

const configuredTimeout = Number(process.env.MOODMAP_VERSION_FETCH_TIMEOUT_MS || "2500");
const FETCH_TIMEOUT_MS = Number.isFinite(configuredTimeout)
  ? Math.max(250, Math.min(5000, configuredTimeout))
  : 2500;

async function fetchJsonWithTimeout(url, timeoutMs) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: controller.signal,
      // Important: do not force cache/no-store here; route-level revalidate controls caching.
    });
    if (!response.ok) return null;
    // Keep the abort timer active until the body has also finished downloading.
    return await response.json();
  } finally {
    clearTimeout(t);
  }
}

async function fetchAppleIOSLatest() {
  const url = `https://itunes.apple.com/lookup?id=${encodeURIComponent(IOS_APP_STORE_ID)}`;
  try {
    const data = await fetchJsonWithTimeout(url, FETCH_TIMEOUT_MS);
    const app = data?.results?.[0];
    const latestVersion = validVersion(app?.version);
    if (Number(app?.trackId) !== Number(IOS_APP_STORE_ID) || !latestVersion) return null;

    return {
      latestVersion,
      webUrl: IOS_WEB_URL,
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
