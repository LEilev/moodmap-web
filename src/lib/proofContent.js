// src/lib/proofContent.js
// Source: rightcards.lutealphase.20.5 (copied into web for controlled P0 proof).
// Emoji is stripped ONLY for web presentation.

export const stripLeadingEmoji = (text = "") => {
  // Remove any leading non-letter/non-number characters (emoji, punctuation, whitespace),
  // then trim remaining leading whitespace.
  return String(text).replace(/^[^\p{L}\p{N}]+/gu, "").trimStart();
};

export const PROOF_EXAMPLE = {
  id: "rightcards.lutealphase.20.5",
  text: stripLeadingEmoji("😘 Kiss her shoulder. Once. No follow-up."),
  why: [
    "Kiss her shoulder like it’s a promise. Then stop.",
    "She needs slow certainty, not sequences.",
    "This says: ‘I offer touch with gravity.’",
    "One kiss. One hand. One breath. Nothing else.",
    "Avoid escalation. Let one gesture echo.",
  ],
};
