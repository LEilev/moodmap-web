// src/lib/proofContent.js
// Curated proof examples used on the web homepage.
// Source of truth: MoodMap locales/en content.
// For the landing page we strip ONLY leading emoji/symbols in the headline (web presentation).

export const stripLeadingEmoji = (text = "") => {
  // Remove any leading non-letter/non-number characters (emoji, punctuation, whitespace),
  // then trim remaining leading whitespace.
  return String(text).replace(/^[^\p{L}\p{N}]+/gu, "").trimStart();
};

export const COMMAND_DECK = {
  commandDeckNav: {
    ops: "PLAN",
    intel: "RULES",
    contact: "BOND",
    core: "SELF",
  },
  commandDeckFull: {
    ops: "Action Plan",
    intel: "Key Insights",
    contact: "Connection & Intimacy",
    core: "Self-Regulation",
  },
  commandDeckExplainer: {
    general:
      "Turn today’s phase into a clear playbook—actions, guardrails, connection, and self-control.",
    ops: "Practical actions for today—what to do and what to avoid.",
    intel: "Guardrails to prevent missteps—control tone, timing, and impulses.",
    contact: "Connection and intimacy cues—tone, touch, and timing.",
    core: "How to stay steady—breath, posture, voice, patience.",
  },
};

export const PROOF_EXAMPLES = [
  {
    id: "leftcards.menstruation.1.0",
    deck: "ops",
    phase: "Menstruation",
    day: 1,
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
    deck: "intel",
    phase: "Peak Energy",
    day: 16,
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
    deck: "contact",
    phase: "Luteal Phase",
    day: 20,
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
    deck: "core",
    phase: "Menstruation",
    day: 2,
    text: stripLeadingEmoji("📵 Pocket the phone—face down, silent."),
    why: [
      "Screen-glow reads as divided loyalty when she craves anchor.",
      "Deep-presence muscles most men skip.",
      "Holster your phone like a weapon on safety, then sit uncaged by it.",
      "Full attention pays compound trust—and future play. She craves the man who locks eyes, not screens.",
      "Glancing at notifications like a guilty raccoon. 🔥",
    ],
  },
];

export const PROOF_EXAMPLE =
  PROOF_EXAMPLES.find((x) => x.id === "rightcards.lutealphase.20.5") || PROOF_EXAMPLES[0];
