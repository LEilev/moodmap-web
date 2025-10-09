/**
 * src/lib/date.js
 *
 * Purpose:
 *   Deterministic TTL helper to expire daily keys at "next local midnight + 2 hours"
 *   for the OWNER's day. Falls back to a safe 26h TTL if timezone is unknown.
 *
 * Usage:
 *   import { nextMidnightPlus2h } from '@/lib/date.js';
 *
 *   const ttlSec = nextMidnightPlus2h('20251009'); // e.g., 26h if no tz offset is known
 *   // Use ttlSec in EXPIRE / EX options.
 */

/**
 * Compute seconds until the OWNER's next local midnight + 2 hours.
 * If tz offset is not provided, returns a safe fallback of 26 hours.
 *
 * @param {string} ownerDate - "YYYYMMDD" (e.g., "20251009")
 * @param {number} [tzOffsetMin] - Minutes offset from UTC for the owner's local time (e.g., +120 for UTC+2)
 * @returns {number} TTL seconds
 */
export function nextMidnightPlus2h(ownerDate, tzOffsetMin) {
  try {
    if (!/^\d{8}$/.test(ownerDate)) {
      // Invalid input → conservative fallback
      return 26 * 3600;
    }

    const year = Number(ownerDate.slice(0, 4));
    const month = Number(ownerDate.slice(4, 6)) - 1; // JS months 0-11
    const day = Number(ownerDate.slice(6, 8));

    // If tz offset is provided, compute the next day 02:00 *in that local tz*, then convert to UTC ms.
    // targetUTC = (owner local next day 02:00) - offset
    // Without tz offset, default to UTC-based date math (deterministic fallback).
    let targetUtcMs;
    if (typeof tzOffsetMin === 'number' && Number.isFinite(tzOffsetMin)) {
      targetUtcMs = Date.UTC(year, month, day + 1, 2, 0, 0) - tzOffsetMin * 60 * 1000;
    } else {
      // Fallback: treat ownerDate as UTC day boundary
      targetUtcMs = Date.UTC(year, month, day + 1, 2, 0, 0);
    }

    const nowMs = Date.now();
    let ttlSec = Math.ceil((targetUtcMs - nowMs) / 1000);

    // If we're past the target already (negative), use 26h fallback to avoid premature expiry.
    if (!Number.isFinite(ttlSec) || ttlSec <= 0) {
      ttlSec = 26 * 3600;
    }

    // Clamp to a reasonable maximum (e.g., 48h) to avoid runaway TTLs.
    if (ttlSec > 48 * 3600) ttlSec = 48 * 3600;

    return ttlSec;
  } catch (_e) {
    // Conservative default on any unexpected error
    return 26 * 3600;
  }
}
