export const CONSENT_KEY = "mm_web_privacy_v1";
export const CONSENT_VERSION = 1;
export const CONSENT_MAX_AGE_MS = 180 * 24 * 60 * 60 * 1000;
export const PRIVACY_OPEN_EVENT = "moodmap:privacy-open";
export const PRIVACY_CHANGE_EVENT = "moodmap:privacy-change";

export function browserRequestsPrivacy(win) {
  const nav = win?.navigator;
  return nav?.globalPrivacyControl === true ||
    [nav?.doNotTrack, win?.doNotTrack].some((value) => value === "1" || value === "yes");
}

export function parseConsent(raw, now = Date.now()) {
  try {
    const value = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (value?.version !== CONSENT_VERSION || typeof value.analytics !== "boolean" ||
        typeof value.referral !== "boolean" || !Number.isFinite(value.updatedAt) ||
        value.updatedAt > now + 60_000 || now - value.updatedAt >= CONSENT_MAX_AGE_MS) return null;
    return { version: CONSENT_VERSION, analytics: value.analytics, referral: value.referral, updatedAt: value.updatedAt };
  } catch {
    return null;
  }
}

export function readConsent(win) {
  if (!win) return null;
  if (browserRequestsPrivacy(win)) {
    return { version: CONSENT_VERSION, analytics: false, referral: false, updatedAt: Date.now(), browserOptOut: true };
  }
  const candidates = [parseConsent(win.__mmPrivacySession)];
  try { candidates.push(parseConsent(win.sessionStorage.getItem(CONSENT_KEY))); } catch { /* Storage may be blocked. */ }
  try { candidates.push(parseConsent(win.localStorage.getItem(CONSENT_KEY))); } catch { /* Storage may be blocked. */ }
  return candidates.filter(Boolean).sort((a, b) => b.updatedAt - a.updatedAt)[0] || null;
}

export function saveConsent(win, choice) {
  const blocked = browserRequestsPrivacy(win);
  const previous = readConsent(win);
  const consent = {
    version: CONSENT_VERSION,
    analytics: !blocked && choice.analytics === true,
    referral: !blocked && choice.referral === true,
    updatedAt: Math.max(Date.now(), (previous?.updatedAt || 0) + 1),
  };
  // Only the privacy decision is essential storage. No visitor identifier is created.
  win.__mmPrivacySession = consent;
  try {
    win.localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
    try { win.sessionStorage.removeItem(CONSENT_KEY); } catch { /* A newer persisted decision takes precedence. */ }
  } catch {
    // A full localStorage must not retain an older opt-in after the user declines.
    try { win.localStorage.removeItem(CONSENT_KEY); } catch { /* Use the newer session decision. */ }
    try { win.sessionStorage.setItem(CONSENT_KEY, JSON.stringify(consent)); } catch { /* This document still honors the choice. */ }
  }
  win.dispatchEvent(new win.CustomEvent(PRIVACY_CHANGE_EVENT));
  return consent;
}

export function hasConsent(win, category) {
  return readConsent(win)?.[category] === true;
}
