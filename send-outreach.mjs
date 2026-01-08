import fs from "node:fs/promises";
import { Resend } from "resend";

const TEMPLATE_ID = process.env.RESEND_TEMPLATE_ID; // "tmpl_..."
const FROM = process.env.RESEND_FROM || "Eilev <eilev@moodmap-app.com>";
const DELAY_MS = Number(process.env.DELAY_MS || 7000);
const DRY_RUN = process.env.DRY_RUN === "1";
const LIST_FILE = process.env.LIST_FILE || "./recipients_50_tonight.txt";

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function normalizeEmail(line) {
  const l = line.trim();
  if (!l) return null;
  const angleMatch = l.match(/<([^>]+)>/);
  const candidate = (angleMatch ? angleMatch[1] : l).trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(candidate)) return null;
  return candidate;
}

function parseRecipients(text) {
  const emails = text
    .split(/\r?\n/)
    .map(normalizeEmail)
    .filter(Boolean);

  const seen = new Set();
  const unique = [];
  for (const e of emails) {
    if (!seen.has(e)) {
      seen.add(e);
      unique.push(e);
    }
  }
  return unique;
}

async function main() {
  if (!process.env.RESEND_API_KEY) throw new Error("Missing RESEND_API_KEY.");
  if (!TEMPLATE_ID) throw new Error("Missing RESEND_TEMPLATE_ID.");

  const resend = new Resend(process.env.RESEND_API_KEY);

  const raw = await fs.readFile(LIST_FILE, "utf8");
  const recipients = parseRecipients(raw);

  if (recipients.length === 0) throw new Error("No valid recipients found.");

  console.log(`List: ${LIST_FILE}`);
  console.log(`Loaded ${recipients.length} unique recipients.`);
  console.log(`Template: ${TEMPLATE_ID}`);
  console.log(`From: ${FROM}`);
  console.log(`Delay: ${DELAY_MS}ms`);
  console.log(`Mode: ${DRY_RUN ? "DRY_RUN (no sends)" : "SEND"}`);

  if (DRY_RUN) {
    recipients.forEach((to, i) => console.log(`- (${i + 1}) ${to}`));
    return;
  }

  let sent = 0;
  let failed = 0;

  for (let i = 0; i < recipients.length; i++) {
    const to = recipients[i];

await resend.emails.send({
  from: FROM,
  to,
  templateId: TEMPLATE_ID,
  template_id: TEMPLATE_ID,
});
      sent++;
      console.log(`✓ (${i + 1}/${recipients.length}) Sent → ${to}`);
    } catch (err) {
      failed++;
      console.error(`✗ (${i + 1}/${recipients.length}) Failed → ${to}`);
      console.error(err?.message ?? err);
    }

    if (i < recipients.length - 1) await sleep(DELAY_MS);
  }

  console.log(`Done. Sent=${sent}, Failed=${failed}`);
  if (failed > 0) process.exitCode = 1;
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
