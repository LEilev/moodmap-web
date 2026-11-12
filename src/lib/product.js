// Public product facts shared by pages, structured data and the public text mirrors.
// Update from a verified release. These summaries deliberately do not infer exact
// feature limits or subscription gates from older marketing copy.
export const PRODUCT = Object.freeze({
  brand: "MoodMap",
  name: "MoodMap: Relationship Timing",
  premiumName: "MoodMap Premium+",
  siteUrl: "https://moodmap-app.com",
  appleAppId: "6746102626",
  bundleId: "com.eilev.moodmapnextgen",
  androidPackage: "com.eilev.moodmapnextgen",
  appStoreUrl: "https://apps.apple.com/app/id6746102626",
  playStoreUrl: "https://play.google.com/store/apps/details?id=com.eilev.moodmapnextgen",
  supportEmail: "support@moodmap-app.com",
  founder: "Lars Eilev Skiaker",
  factsReviewedOn: "2026-11-10",
  languages: [
    { code: "en", name: "English" },
    { code: "nb", name: "Norwegian Bokmål" },
    { code: "de", name: "German" },
  ],
  summary:
    "MoodMap gives men a quick daily read of what a partner’s cycle may mean for mood, energy and connection, with practical guidance for their own response.",
  freeSummary:
    "MoodMap is free to download and includes daily cycle context and free guidance. Premium+ adds the fuller read and more ways to act on it.",
  premiumSummary:
    "Premium+ expands the Brief and Risk content, opens the complete Command Deck, and adds deeper insights and additional optional alerts.",
  purchaseSummary:
    "Free to download. Optional Premium+ subscription in the app. Your app store shows local prices and subscription terms before purchase.",
  purchaseInstructions:
    "Download MoodMap from the App Store or Google Play, then open the app to view Premium+ options.",
  settingsSummary:
    "Adjust cycle length, menstruation length and the PMS window in the app. Use the current options in Settings to match the information your partner chooses to share.",
  modelScope:
    "The model uses timing in a natural menstrual cycle. Hormonal contraception that suppresses ovulation, pregnancy, postpartum changes and irregular cycles can make that model a poor fit. Cycle dates cannot confirm ovulation or measure individual hormones.",
  boundaries:
    "MoodMap uses cycle estimates. It does not record a partner’s actual mood, measure hormones, provide medical advice, diagnose conditions, or support contraception or fertility planning. Her words, preferences and boundaries come first.",
  privacySummary:
    "No symptom diary is required. Product analytics, purchase handling and support data are described in the Privacy Policy; private guidance does not mean that no data is processed.",
});

export const COMMAND_DECK_LANES = Object.freeze([
  { name: "PLAN", title: "Make the day easier", description: "Practical plans and support matched to the day’s possible energy and load." },
  { name: "READ", title: "HOW TO SURVIVE", description: "Read the situation, avoid a likely misinterpretation and keep a small moment from escalating." },
  { name: "BOND", title: "Sex, flirting and intimacy", description: "Ways to approach and build mutually wanted closeness, with attention to her response." },
  { name: "SELF", title: "Manage your own response", description: "Your tone, impulses, confidence, boundaries and reactions are the part you can work on directly." },
]);

export const FREE_FEATURES = Object.freeze([
  "Daily cycle and phase context",
  "Free daily guidance",
  "A practical starting point for your response",
]);

export const PREMIUM_FEATURES = Object.freeze([
  "Fuller Brief and Risk content",
  "Complete PLAN, READ, BOND and SELF Command Deck",
  "Deeper WHY explanations and cycle insights",
  "Additional optional timing alerts",
]);

export const PRODUCT_FEATURES = Object.freeze([
  "Daily cycle context and Brief",
  "Cycle Calendar",
  "Cycle Intelligence with modeled hormone context",
  "Risk Radar",
  "Command Deck: PLAN, READ, BOND and SELF",
  "WHY explanations",
  "Optional Daily Brief and Timing Alerts",
  "Cycle, menstruation and PMS-window preferences",
]);

// Only pages whose substantive content changed in this release receive a new
// date. An unknown original publication date is not invented.
export const CONTENT_UPDATES = Object.freeze({
  "/": "2026-11-12",
  "/about": "2026-11-10",
  "/intelligence": "2026-11-10",
  "/pro": "2026-11-10",
  "/learn": "2026-11-12",
  "/learn/menstrual-cycle-phases-for-partners": "2026-11-12",
  "/learn/period-tracking-for-men": "2026-11-12",
  "/learn/cycle-aware-relationship-timing": "2026-11-10",
  "/learn/luteal-phase-relationships": "2026-11-10",
  "/learn/pms-relationship-timing": "2026-11-10",
  "/learn/menstrual-cycle-day-by-day-for-partners": "2026-11-10",
  "/learn/moodmap-glossary": "2026-11-10",
  "/learn/support-partner-during-pms": "2026-11-10",
  "/learn/fertile-window-explained": "2026-11-10",
  "/learn/why-moodmap": "2026-11-10",
  "/support": "2026-11-10",
  "/privacy-policy": "2026-11-12",
  "/terms": "2026-11-10",
});

export const PUBLIC_PAGES = Object.freeze([
  { path: "/", title: "MoodMap: Relationship Timing", description: "Daily cycle context for support, conversations and intimacy. Download MoodMap for iOS or Android." },
  { path: "/about", title: "About MoodMap", description: "The independent maker, official app identity and product facts." },
  { path: "/intelligence", title: "Cycle Intelligence", description: "How modeled biology becomes possible context, and where the model fits." },
  { path: "/pro", title: "Premium+", description: "Free daily guidance, optional Premium+ in the app, and official store links for local prices and terms." },
  { path: "/learn", title: "Guides", description: "Practical cycle and relationship guides for partners." },
  { path: "/learn/menstrual-cycle-phases-for-partners", title: "Menstrual cycle phases for partners", description: "A four-phase overview with practical examples for partners." },
  { path: "/learn/cycle-aware-relationship-timing", title: "Cycle-aware relationship timing", description: "Using cycle context for support, conversations and intimacy." },
  { path: "/learn/menstrual-cycle-day-by-day-for-partners", title: "A 28-day cycle overview for partners", description: "An illustrative cycle grouped into six windows, not a prediction for each day." },
  { path: "/learn/period-tracking-for-men", title: "Period tracking for men", description: "What to enter, what to notice and how MoodMap turns timing into guidance." },
  { path: "/learn/luteal-phase-relationships", title: "Luteal phase relationships", description: "Load, communication and connection after ovulation." },
  { path: "/learn/pms-relationship-timing", title: "PMS relationship timing", description: "Timing conversations and reducing unnecessary pressure before a period." },
  { path: "/learn/support-partner-during-pms", title: "Support your partner during PMS", description: "Concrete support and communication ideas." },
  { path: "/learn/fertile-window-explained", title: "Fertile window explained for partners", description: "Ovulation context and the limits of calendar estimates." },
  { path: "/learn/why-moodmap", title: "Why MoodMap", description: "Daily context and four distinct kinds of practical guidance." },
  { path: "/learn/moodmap-glossary", title: "MoodMap glossary", description: "Brief, Command Deck, Risk Radar, Cycle Intelligence and other product terms." },
  { path: "/support", title: "Support", description: "App, subscription and privacy support." },
  { path: "/privacy-policy", title: "Privacy Policy", description: "Data processing and privacy choices." },
  { path: "/terms", title: "Terms", description: "App, subscription and website terms." },
]);

export function displayDate(iso) {
  if (!iso) return null;
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${iso}T12:00:00Z`));
}
