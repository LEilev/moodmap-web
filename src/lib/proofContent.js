// src/lib/proofContent.js
// Curated proof examples used on the web homepage.
// Source of truth: MoodMap locales/en content.
// Emoji is stripped ONLY for web presentation (leading emoji / symbols in the headline text).

export const stripLeadingEmoji = (text = "") => {
  // Remove any leading non-letter/non-number characters (emoji, punctuation, whitespace),
  // then trim remaining leading whitespace.
  return String(text).replace(/^[^\p{L}\p{N}]+/gu, "").trimStart();
};

export const PROOF_EXAMPLES = [
  {
    id: "leftcards.menstruation.1.0",
    phase: "Menstruation",
    day: 1,
    category: "OPS",
    text: stripLeadingEmoji("🔥 Warm the heat pad like it holds her whole mood. Then hand it over."),
    why: [
      "Warm the heat pad before she asks — her uterus is contracting, and warmth signals safety.",
      "Place it under her lower back like you're restoring order in a storm.",
      "This action regulates cortisol and soothes muscle tension without a word.",
      "Avoid dramatics. No jokes. No hero complex. Just warmth, placed right.",
      "Let it be a gesture of stability — not performance.",
    ],
  },
  {
    id: "midcards.peakenergy.16.1",
    phase: "Peak Energy",
    day: 16,
    category: "INTEL",
    text: stripLeadingEmoji("🗣 Compliment the momentum, not just the makeup."),
    why: [
      "Notice and name her drive—not her appearance.",
      "Estrogen elevates her sense of achievement; she wants it witnessed.",
      "This signals respect for her output, not just her looks.",
      "Say: ‘You’re killing it today.’ Then let that land.",
      "Avoid surface-level praise. Mean it or skip it.",
    ],
  },
  {
    id: "rightcards.lutealphase.20.5",
    phase: "Luteal Phase",
    day: 20,
    category: "CONTACT",
    text: stripLeadingEmoji("😘 Kiss her shoulder. Once. No follow-up."),
    why: [
      "Kiss her shoulder like it’s a promise. Then stop.",
      "She needs slow certainty, not sequences.",
      "This says: ‘I offer touch with gravity.’",
      "One kiss. One hand. One breath. Nothing else.",
      "Avoid escalation. Let one gesture echo.",
    ],
  },
  {
    id: "selfcards.menstruation.2.0",
    phase: "Menstruation",
    day: 2,
    category: "CARE",
    text: stripLeadingEmoji("📵 Pocket the phone—face down, silent."),
    why: [
      "Screen-glow reads as divided loyalty when she craves anchor.",
      "Deep-presence muscles most men skip.",
      "Holster phone like a weapon on safety, sit uncaged.",
      "Full attention pays compound trust—and future play. She craves the man who locks eyes, not screens.",
      "Glancing at notifications like a guilty raccoon. 🔥",
    ],
  },
];

// Back-compat: keep the original single-example export around.
// (Some pages/components may still import PROOF_EXAMPLE.)
export const PROOF_EXAMPLE =
  PROOF_EXAMPLES.find((x) => x.id === "rightcards.lutealphase.20.5") || PROOF_EXAMPLES[0];
