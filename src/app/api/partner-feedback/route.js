// src/lib/validate.js
/**
 * Purpose:
 *   Zero-dependency, Edge-safe validation helpers for Partner Mode payloads.
 *   Replaces the previous Zod-based module to avoid a build-time dependency on "zod".
 *
 * Exports:
 *   - FeedbackSchema (token)
 *   - ConnectSchema  (token)
 *   - validate(schemaToken, data) -> { success, value?, error? }
 *
 * Usage:
 *   import { FeedbackSchema, validate } from '@/lib/validate.js';
 *   const result = await validate(FeedbackSchema, reqBody);
 *   if (!result.success) return json({ ok:false, error: result.error }, 400);
 *
 * Notes:
 *   - Enforces payload size < 1 KB
 *   - tips[] ≤ 10, unique, and ID format checked
 *   - ownerDate must be "YYYYMMDD"
 *   - readiness: integer 0..10 OR a short string label (≤ 32 chars)
 *   - code (connect) must be 10–12 chars unambiguous Base32
 */

// ---- Schema tokens (keeps same API surface as the Zod-based version) ----
export const FeedbackSchema = Symbol('FeedbackSchema');
export const ConnectSchema = Symbol('ConnectSchema');

// ---- Regex/limits ----
const OWNER_DATE_RE = /^\d{8}$/; // YYYYMMDD
const CODE_RE = /^[A-HJ-NP-Z2-9]{10,12}$/; // unambiguous Base32 (no I, O, 0, 1)
const TIP_ID_RE = /^[A-Za-z0-9:_-]{1,64}$/; // conservative whitelist
const MAX_TIPS = 10;
const MAX_PAYLOAD_BYTES = 1024;

// ---- Helpers ----
function byteSize(obj) {
  try {
    return new TextEncoder().encode(JSON.stringify(obj ?? {})).length;
  } catch {
    return Infinity;
  }
}

function isString(v) {
  return typeof v === 'string';
}
function nonEmptyString(v, max = 256) {
  return isString(v) && v.length >= 1 && v.length <= max;
}
function optionalString(v, max = 256) {
  return v == null || (isString(v) && v.length <= max);
}
function intInRange(v, min, max) {
  return Number.isInteger(v) && v >= min && v <= max;
}
function uniq(arr) {
  return Array.from(new Set(arr));
}

// ---- Core validator ----
/**
 * validate - Run schema-specific checks and enforce payload size < 1 KB.
 * @param {symbol} schemaToken - FeedbackSchema | ConnectSchema
 * @param {*} data - input payload
 * @returns {Promise<{ success: boolean, value?: any, error?: string }>}
 */
export async function validate(schemaToken, data) {
  // Global size gate
  const size = byteSize(data);
  if (size > MAX_PAYLOAD_BYTES) {
    return { success: false, error: 'Payload too large (> 1KB)' };
  }

  if (schemaToken === FeedbackSchema) {
    return validateFeedback(data);
  }
  if (schemaToken === ConnectSchema) {
    return validateConnect(data);
  }

  return { success: false, error: 'Unknown schema' };
}

// ---- Schema implementations ----

function validateFeedback(input) {
  if (input == null || typeof input !== 'object') {
    return { success: false, error: 'Invalid payload' };
  }

  const { pairId, ownerDate, updateId, vibe, readiness, tips } = input;

  // pairId
  if (!nonEmptyString(pairId, 128) || String(pairId).length < 6) {
    return { success: false, error: 'Invalid pairId' };
  }

  // ownerDate
  if (!isString(ownerDate) || !OWNER_DATE_RE.test(ownerDate)) {
    return { success: false, error: 'ownerDate must be YYYYMMDD' };
  }

  // updateId
  if (!nonEmptyString(updateId, 64) || String(updateId).length < 6) {
    return { success: false, error: 'Invalid updateId' };
  }

  // vibe
  if (!nonEmptyString(vibe, 64)) {
    return { success: false, error: 'Invalid vibe' };
  }

  // readiness: int 0..10 OR short string label ≤ 32
  let readinessOut = readiness;
  if (typeof readiness === 'number') {
    if (!intInRange(readiness, 0, 10)) {
      return { success: false, error: 'Invalid readiness' };
    }
  } else if (typeof readiness === 'string') {
    if (!optionalString(readiness, 32)) {
      return { success: false, error: 'Invalid readiness' };
    }
  } else if (readiness != null) {
    return { success: false, error: 'Invalid readiness' };
  }

  // tips: array of strings, ≤ 10, unique, each matches TIP_ID_RE
  let tipsArr = [];
  if (tips != null) {
    if (!Array.isArray(tips)) {
      return { success: false, error: 'tips must be an array' };
    }
    if (tips.length > MAX_TIPS) {
      return { success: false, error: 'tips cannot exceed 10 items' };
    }
    for (const t of tips) {
      if (!isString(t) || !TIP_ID_RE.test(t)) {
        return { success: false, error: 'Invalid tip id' };
      }
    }
    tipsArr = uniq(tips);
  }

  const value = {
    pairId: String(pairId),
    ownerDate,
    updateId: String(updateId),
    vibe: String(vibe),
    readiness: readinessOut,
    tips: tipsArr
  };

  return { success: true, value };
}

function validateConnect(input) {
  if (input == null || typeof input !== 'object') {
    return { success: false, error: 'Invalid payload' };
  }

  const code = isString(input.code) ? input.code.trim().toUpperCase() : '';
  if (!CODE_RE.test(code)) {
    return { success: false, error: 'Invalid code format' };
  }

  const pairIdOpt = input.pairId;
  if (pairIdOpt != null) {
    if (!nonEmptyString(pairIdOpt, 128) || String(pairIdOpt).length < 6) {
      return { success: false, error: 'Invalid pairId' };
    }
  }

  const value = {
    code,
    ...(pairIdOpt != null ? { pairId: String(pairIdOpt) } : {})
  };

  return { success: true, value };
}