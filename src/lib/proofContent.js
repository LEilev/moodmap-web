// src/lib/proofContent.js
//
// Landing page: one curated "daily briefing" example.
// Content is copied from app locale/source. For web presentation we strip ONLY
// the leading emoji from the tip line.

export const stripLeadingEmoji = (text = "") => {
  // Remove any leading non-letter/non-number characters (emoji, punctuation, whitespace),
  // then trim remaining leading whitespace.
  return String(text).replace(/^[^\p{L}\p{N}]+/gu, "").trimStart();
};

export const COMMAND_DECK_NAV = {
  ops: "PLAN",
  intel: "RULES",
  contact: "BOND",
  core: "SELF",
};

export const COMMAND_DECK_FULL = {
  ops: "Action Plan",
  intel: "Key Insights",
  contact: "Connection & Intimacy",
  core: "Self-Regulation",
};

// Curated landing example (copied from app source: rightcards.pms.28.2)
export const SAMPLE_BRIEFING = {
  id: "rightcards.pms.28.2",
  phase: "PMS",
  day: 28,
  deckKey: "contact",
  deckNav: COMMAND_DECK_NAV.contact,
  deckFull: COMMAND_DECK_FULL.contact,
  text: stripLeadingEmoji("☕ Bring her tea like a sacred offering. Exit quietly."),
  suggestions: [
    "Offer tea like it’s ritual, not rescue.",
    "Her nervous system responds to gesture more than talk.",
    "This signals: ‘I serve comfort without needing attention.’",
    "Deliver warm. Exit quiet.",
    "Avoid explanation. Let care remain unnamed.",
  ],
};
