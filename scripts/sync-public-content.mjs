import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import {
  PRODUCT, COMMAND_DECK_LANES, PRODUCT_FEATURES, FREE_FEATURES,
  PREMIUM_FEATURES, CONTENT_UPDATES, PUBLIC_PAGES,
} from "../src/lib/product.js";

// These are optional plain-text product mirrors, not crawler instructions or
// ranking mechanisms. Public pages remain the substantive source of information.
const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const url = (path) => `${PRODUCT.siteUrl}${path}`;
const list = (items) => items.map((item) => `- ${item}`).join("\n");
const pageList = (items) => list(items.map((page) => `[${page.title}](${url(page.path)}): ${page.description}`));
const escapeXml = (value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&apos;");

export function buildPublicContent() {
  const identity = `- Official product: ${PRODUCT.name}
- Developer and publisher: ${PRODUCT.founder}, an independent developer in Norway
- Official website: ${PRODUCT.siteUrl}
- Apple App ID: ${PRODUCT.appleAppId}
- iOS bundle ID: ${PRODUCT.bundleId}
- Android package: ${PRODUCT.androidPackage}
- App languages: ${PRODUCT.languages.map(({ name }) => name).join(", ")}
- App Store: ${PRODUCT.appStoreUrl}
- Google Play: ${PRODUCT.playStoreUrl}
- Support: ${PRODUCT.supportEmail}`;
  const lanes = list(COMMAND_DECK_LANES.map((lane) => `${lane.name} — ${lane.title}: ${lane.description}`));
  const pricing = `${PRODUCT.freeSummary} ${PRODUCT.premiumSummary}

${PRODUCT.purchaseSummary} ${PRODUCT.purchaseInstructions}`;
  const short = `# ${PRODUCT.name}

> ${PRODUCT.summary}

This document describes the MoodMap app at moodmap-app.com. It is not a personal mood diary, a workplace mood survey, or a different product with a similar name.

## Official identity

${identity}

## The daily read

Today’s State gives a quick overview from cycle timing. Day Brief adds practical context; Risk Radar highlights possible friction. Calendar and Cycle Intelligence explain estimated cycle position and modeled biological context. The Command Deck has four distinct lanes:

${lanes}

${PRODUCT.settingsSummary}

## Free and Premium+

${pricing}

## Model and privacy boundaries

${PRODUCT.boundaries}

${PRODUCT.modelScope}

${PRODUCT.privacySummary}

## Official pages and guides

${pageList(PUBLIC_PAGES)}

## Further product context

- [Expanded product context](${url("/llms-full.txt")})
- [Maker and editorial responsibility](${url("/about#maker")})
- [Model scope and limitations](${url("/intelligence#model-fit")})
- [Website privacy choices](${url("/privacy-policy#website")})

## Content reuse

Public summarization and citation of MoodMap pages is allowed. For commercial model training, dataset inclusion, or bulk reuse of MoodMap content, contact ${PRODUCT.supportEmail}.

Product facts reviewed: ${PRODUCT.factsReviewedOn}. Guide update dates are recorded on the individual pages; no original publication dates are inferred.
`;
  const full = `# ${PRODUCT.name} — public product context

## Summary

${PRODUCT.summary}

The intended experience is quick: open the app, get the day’s possible mood, energy and connection context, and consider a practical response. More explanation is available when wanted. Cycle context is an estimate, not a reading of a partner’s actual mood or attitude.

## Official identity

${identity}

MoodMap at this domain is a relationship-timing app for men. It is not an emotional journal, a workplace coaching service, or a similarly named mood-mapping product. Use the official app IDs and store links to distinguish it.

## Product vocabulary

- Today’s State: the daily overview of cycle day, phase, estimated capacity, risk and direction.
- Day Brief: Current Picture, Best Approach, What Can Go Well and Set It Up.
- Risk Radar: possible tripwires, what to notice, likely misinterpretations and practical responses.
- Command Deck: the PLAN, READ, BOND and SELF guidance lanes.
- WHY: the reasoning behind a guidance card.
- Cycle Calendar: dates, estimated cycle phases and timing windows, with context for a selected day.
- Cycle Intelligence: modeled hormone context, Today’s Shift, Biology and possible effects.
- Capacity: a practical cycle-based estimate, not a measured personal score or test result.
- Timing Alerts: optional reminders and heads-ups around daily reads and cycle windows.
- Premium+: the optional paid expansion of the free daily experience.

### The four Command Deck lanes

${lanes}

## Features and access

${list(PRODUCT_FEATURES)}

### Free baseline

${list(FREE_FEATURES)}

### Premium+ expansion

${list(PREMIUM_FEATURES)}

${pricing}

### Setup and settings

Start from cycle timing your partner has chosen to share. ${PRODUCT.settingsSummary} Estimates become less useful when dates are uncertain or the natural-cycle model does not fit. Sharing the underlying information should be a mutual choice.

## What the model can and cannot do

${PRODUCT.boundaries}

${PRODUCT.modelScope}

The hormone graph and capacity percentage describe a model. They are not validated measurements of an individual’s hormones, emotional state, sexual interest or stress tolerance. A practical suggestion does not establish that a disagreement is hormonal, or that sex or any other activity is wanted.

## Privacy and subscriptions

${PRODUCT.privacySummary}

The website offers optional analytics controls. See the Privacy Policy for website choices and mobile-app data handling. New Premium+ subscriptions are offered in the app through the App Store or Google Play, with local prices and terms shown before purchase. Manage a store subscription through the store account used to purchase it. Support is available at ${PRODUCT.supportEmail}.

## Maker and editorial responsibility

MoodMap is developed independently in Norway by ${PRODUCT.founder}. The site publishes educational product and relationship guides. Public health references support the general cycle and symptom background; practical relationship examples are MoodMap’s suggestions. No medical credentials, clinical review or validated individual prediction are claimed.

## Public pages

${pageList(PUBLIC_PAGES.filter((page) => !page.path.startsWith("/learn/")))}

## Guides

${pageList(PUBLIC_PAGES.filter((page) => page.path.startsWith("/learn/")))}

The day-by-day URL contains an illustrative 28-day cycle grouped into six windows. It is not 28 individual daily predictions and does not adapt those dates to a person.

Product facts reviewed: ${PRODUCT.factsReviewedOn}. Individual revised pages show their own update dates. Unknown original publication dates are not supplied.
`;
  // A sitemap lastmod is emitted only for a known substantive page update. We do
  // not invent dates for unchanged pages or refresh every date on each build.
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PUBLIC_PAGES.map((page) => `  <url>
    <loc>${escapeXml(url(page.path))}</loc>${CONTENT_UPDATES[page.path] ? `
    <lastmod>${CONTENT_UPDATES[page.path]}</lastmod>` : ""}
  </url>`).join("\n")}
</urlset>
`;
  return new Map([
    ["public/llms.txt", short],
    ["public/.well-known/llms.txt", short],
    ["public/llms-full.txt", full],
    ["public/sitemap.xml", sitemap],
  ]);
}

export async function syncPublicContent({ check = false } = {}) {
  const stale = [];
  for (const [relativePath, expected] of buildPublicContent()) {
    const path = resolve(projectRoot, relativePath);
    const actual = await readFile(path, "utf8").catch((error) => {
      if (error.code === "ENOENT") return null;
      throw error;
    });
    if (actual === expected) continue;
    stale.push(relativePath);
    if (!check) {
      await mkdir(dirname(path), { recursive: true });
      await writeFile(path, expected, "utf8");
    }
  }
  return stale;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const check = process.argv.includes("--check");
  const stale = await syncPublicContent({ check });
  if (check && stale.length) {
    process.stderr.write(`Public product files are out of sync: ${stale.join(", ")}\nRun node scripts/sync-public-content.mjs after updating src/lib/product.js.\n`);
    process.exitCode = 1;
  } else {
    process.stdout.write(check ? "Public product files are synchronized.\n" : `Updated ${stale.length} public product files.\n`);
  }
}
