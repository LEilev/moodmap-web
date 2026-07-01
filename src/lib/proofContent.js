// src/lib/proofContent.js
// Landing-page sample guidance for public web presentation.
// Keep this copy review-safe: cycle-aware context, no guarantees, no medical claims.

export const stripLeadingEmoji = (text = "") => {
  // Remove any leading non-letter/non-number characters (emoji, punctuation, whitespace),
  // then trim remaining leading whitespace.
  return String(text).replace(/^[^\p{L}\p{N}]+/gu, "").trimStart();
};

export const stripTrailingEmoji = (text = "") => {
  // Remove trailing emoji/symbols (often used as emphasis) while keeping punctuation/words.
  return String(text).replace(/\s*[^\p{L}\p{N}\p{P}\p{Z}]+$/gu, "").trimEnd();
};

export const COMMAND_DECK = {
  commandDeckNav: {
    support: "Support",
    comms: "Comms",
    intimacy: "Intimacy",
    core: "Core",
  },
  commandDeckFull: {
    support: "Support move",
    comms: "Communication move",
    intimacy: "Intimacy move",
    core: "Self-control move",
  },
  commandDeckExplainer: {
    general:
      "CommandDeck turns the daily read into practical moves: support, communication, intimacy, and self-control. Not generic tips — timing-aware actions.",
    support: "Reduce load before asking for a report.",
    comms: "Keep timing, tone, and length under control.",
    intimacy: "Read momentum without assuming access.",
    core: "Stay steady when the room tightens.",
  },
};

// Curated single example for the homepage.
export const SAMPLE_GUIDANCE = {
  id: "sample.commanddeck.menstruation.support.1",
  phase: "Menstruation",
  day: 1,
  text: stripLeadingEmoji(
    "Start with heat, not questions. Make the room easier before you make the day bigger."
  ),
  why: [
    "Early bleed days can make extra questions feel like extra work.",
    "Warmth, water, food, and a quieter room are practical support — not a speech.",
    "Do one useful thing before you ask what she needs. It lowers friction fast.",
    "Do not turn it into a performance or a lecture about her cycle.",
    "The win is simple: less load before the day starts.",
  ].map(stripTrailingEmoji),
};

export const PROOF_EXAMPLES = [
  {
    id: "sample.deck.support.menstruation.1",
    deck: "support",
    phase: "Menstruation",
    day: 1,
    text: "Start with heat, water, and one solved task. Do not make her manage your good intentions.",
    why: [
      "Early-cycle load can make extra questions feel like extra work.",
      "The useful move is practical: heat pad, food, clean space, lower noise.",
      "No hero speech. Just make one friction point disappear.",
    ],
  },
  {
    id: "sample.deck.comms.late-luteal.26",
    deck: "comms",
    phase: "Late luteal",
    day: 26,
    text: "Do not litigate tone today. Ask what outcome she wants, then keep your answer shorter.",
    why: [
      "PMS timing can narrow stress margin for some people; precision costs less than debate.",
      "A shorter answer keeps the conversation from becoming about your defensiveness.",
      "If you are unsure, clarify the desired outcome before you offer a fix.",
    ],
  },
  {
    id: "sample.deck.intimacy.ovulation.14",
    deck: "intimacy",
    phase: "Ovulation",
    day: 14,
    text: "Lean into play, but do not assume access. Read momentum, then match it.",
    why: [
      "Ovulation can come with more energy or openness for some people; it is not a promise.",
      "Play works better when pressure stays low and attention stays high.",
      "The move is invitation, not extraction. Match the signal you actually get.",
    ],
  },
  {
    id: "sample.deck.core.luteal.22",
    deck: "core",
    phase: "Luteal",
    day: 22,
    text: "If the room feels tight, lower your volume first. Your calm is not weakness; it is leverage.",
    why: [
      "Luteal load can make noise, ambiguity, and repeated asks cost more.",
      "Lowering your intensity changes the room before you try to win the point.",
      "Self-control is the part of timing you fully own.",
    ],
  },
].map((example) => ({
  ...example,
  text: stripLeadingEmoji(example.text),
  why: example.why.map(stripTrailingEmoji),
}));

// Back-compat: keep PROOF_EXAMPLE export around.
export const PROOF_EXAMPLE = {
  id: SAMPLE_GUIDANCE.id,
  text: SAMPLE_GUIDANCE.text,
  why: SAMPLE_GUIDANCE.why,
};
