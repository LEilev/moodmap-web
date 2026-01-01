// src/lib/proofContent.js
// Landing-page sample guidance (single example, premium + minimal).
// Source of truth: locales/en (MoodMap). We strip leading emoji in the headline for web presentation.

export const stripLeadingEmoji = (text = "") => {
  // Remove any leading non-letter/non-number characters (emoji, punctuation, whitespace),
  // then trim remaining leading whitespace.
  return String(text).replace(/^[^\p{L}\p{N}]+/gu, "").trimStart();
};

export const stripTrailingEmoji = (text = "") => {
  // Remove trailing emoji/symbols (often used as emphasis) while keeping punctuation/words.
  return String(text).replace(/\s*[^\p{L}\p{N}\p{P}\p{Z}]+$/gu, "").trimEnd();
};

// Curated single example for the homepage.
// Source: leftcards.menstruation.1.0 (OPS / PLAN).
export const SAMPLE_GUIDANCE = {
  id: "leftcards.menstruation.1.0",
  phase: "Menstruation",
  day: 1,
  text: stripLeadingEmoji("🔥 Warm the heat pad like it holds her whole mood. Then hand it over."),
  why: [
    "Warm the heat pad before she asks — her uterus is contracting, and warmth signals safety.",
    "Place it under her lower back like you're restoring order in a storm.",
    "This action regulates cortisol and soothes muscle tension without a word.",
    "Avoid dramatics. No jokes. No hero complex. Just warmth, placed right.",
    "Let it be a gesture of stability — not performance.",
  ].map(stripTrailingEmoji),
};

// Back-compat: keep PROOF_EXAMPLE export around.
export const PROOF_EXAMPLE = {
  id: SAMPLE_GUIDANCE.id,
  text: SAMPLE_GUIDANCE.text,
  why: SAMPLE_GUIDANCE.why,
};
