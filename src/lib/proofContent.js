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
  // Example: "... 🔥" -> "..."
  return String(text).replace(/\s*[^\p{L}\p{N}\p{P}\p{Z}]+$/gu, "").trimEnd();
};

// Curated single example for the homepage.
// Rationale: short, modern, influencer-safe, and it demonstrates hormone-aware intelligence.
export const SAMPLE_GUIDANCE = {
  id: "midcards.peakenergy.16.1",
  phase: "Peak Energy",
  day: 16,
  text: stripLeadingEmoji("🗣 Compliment the momentum, not just the makeup."),
  why: [
    "Notice and name her drive—not her appearance.",
    "Estrogen elevates her sense of achievement; she wants it witnessed.",
    "This signals respect for her output, not just her looks.",
    "Say: ‘You’re killing it today.’ Then let that land.",
    "Avoid surface-level praise. Mean it or skip it.",
  ].map(stripTrailingEmoji),
};

// Back-compat: keep PROOF_EXAMPLE export around.
export const PROOF_EXAMPLE = {
  id: SAMPLE_GUIDANCE.id,
  text: SAMPLE_GUIDANCE.text,
  why: SAMPLE_GUIDANCE.why,
};
