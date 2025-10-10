/**
 * src/lib/validate.js
 *
 * Purpose:
 *   Zod-based input validation for Partner Mode routes (Edge-safe).
 *   Enforces payload size (< 1 KB), tip array limits, and basic shapes.
 *
 * Usage:
 *   import { FeedbackSchema, ConnectSchema, validate } from '@/lib/validate.js';
 *
 *   const result = await validate(FeedbackSchema, body);
 *   if (!result.success) return json({ ok:false, error: result.error }, 400);
 */

import { z } from 'zod';

// Reusable primitive schemas
const NonEmptyStr = z.string().min(1).max(256);
const OwnerDate = z.string().regex(/^\d{8}$/, 'ownerDate must be YYYYMMDD');
const UpdateId = z.string().min(6).max(64); // ULID/UUID/short id
const PairId = z.string().min(6).max(128);
const Code = z.string().min(6).max(64).regex(/^[A-Za-z0-9%\-]+$/, 'code must be URL/QR-safe');

// Tips: up to 10 string IDs, unique, sane length
const TipId = z.string().min(1).max(64);
const TipsArray = z
  .array(TipId)
  .max(10, 'tips cannot exceed 10 items')
  .transform((arr) => Array.from(new Set(arr))); // de-dup

// readiness can be an int (0–10) or a small label
const Readiness = z.union([
  z.number().int().min(0).max(10),
  z.string().min(0).max(32)
]);

/** Feedback payload: owner upserts the daily shared state */
export const FeedbackSchema = z.object({
  pairId: PairId,
  ownerDate: OwnerDate,
  updateId: UpdateId,
  vibe: NonEmptyStr.max(64),
  readiness: Readiness,
  tips: TipsArray.default([]),
});

/** Connect payload: consume code (pairId optional for future flows) */
export const ConnectSchema = z.object({
  code: Code,
  pairId: PairId.optional(),
});

/**
 * validate - Run zod validation and enforce payload size < 1 KB.
 * @param {import('zod').ZodSchema} schema
 * @param {unknown} data
 * @returns {Promise<{ success: boolean, value?: any, error?: string }>}
 */
export async function validate(schema, data) {
  try {
    // Enforce < 1 KB (bytes) using TextEncoder
    const size = new TextEncoder().encode(JSON.stringify(data ?? {})).length;
    if (size > 1024) {
      return { success: false, error: 'Payload too large (> 1KB)' };
    }

    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      // Return a compact message (no sensitive details)
      return { success: false, error: parsed.error.issues?.[0]?.message || 'Invalid payload' };
    }
    return { success: true, value: parsed.data };
  } catch (err) {
    console.error('[validate] error:', err?.message || err);
    return { success: false, error: 'Validation error' };
  }
}
