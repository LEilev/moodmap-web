// src/lib/email-templates.js
//
// Purpose:
//   Canonical outreach email templates used by /api/influencer/worker.
//   Templates include an unsubscribe footer + optional postal address for compliance.
//
// Env:
// - BASE_URL must be set (e.g. https://moodmap-app.com)
// - COMPANY_POSTAL_ADDRESS (optional but recommended for compliance)

const PARTNER_URL = "https://moodmap-app.com/partner";

const COMPANY_POSTAL_ADDRESS = (process.env.COMPANY_POSTAL_ADDRESS || "").trim();

const esc = (s = "") => {
  const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  return String(s).replace(/[&<>"']/g, (c) => map[c]);
};

const unsubUrl = (baseUrl, email) =>
  `${baseUrl}/api/influencer/unsubscribe?email=${encodeURIComponent(email)}`;

const footer = (baseUrl, email) => {
  const addr = COMPANY_POSTAL_ADDRESS ? `<br/>${esc(COMPANY_POSTAL_ADDRESS)}` : "";
  return `
  <hr style="border:none;border-top:1px solid #eee;margin:16px 0" />
  <p style="font-size:12px;color:#666;margin:0;line-height:1.4">
    You're receiving this because your contact email is listed publicly for collaborations.
    Not interested? <a href="${unsubUrl(baseUrl, email)}">Unsubscribe</a>.
    ${addr}
  </p>
`;
};

/**
 * initialTemplate
 */
export function initialTemplate({ baseUrl, email, name, handle }) {
  const subject = "MoodMap partner invite - 50% lifetime recurring";

  const html = `
  <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,Helvetica,sans-serif;font-size:16px;line-height:1.55;color:#111">
    <p style="margin:0 0 12px 0">Hi,</p>

    <p style="margin:0 0 12px 0">
      Quick partnership invite in case this is relevant.
    </p>

    <p style="margin:0 0 12px 0">
      <b>MoodMap</b> is a premium relationship-intelligence app for men.
      It turns cycle timing into clear, practical daily signals for better timing and communication - context, not guarantees.
      (Not therapy. Not fertility tracking.)
    </p>

    <p style="margin:0 0 12px 0">
      Partner program:<br/>
      &bull; <b>50% lifetime recurring revenue share</b><br/>
      &bull; Subscriptions via Stripe<br/>
      &bull; Tracking &amp; payouts via PromoteKit
    </p>

    <p style="margin:0 0 12px 0">
      No application - instant access to your link here:<br/>
      <a href="${PARTNER_URL}" target="_blank" rel="noopener noreferrer nofollow">${PARTNER_URL}</a>
    </p>

    <p style="margin:0 0 4px 0">Best,</p>
    <p style="margin:0 0 2px 0">Eilev</p>
    <p style="margin:0 0 0 0">Founder, MoodMap</p>

    ${footer(baseUrl, email)}
  </div>`;

  const listUnsub = `<${unsubUrl(baseUrl, email)}>`;
  return { subject, html, listUnsub };
}

/**
 * followupTemplate
 */
export function followupTemplate({ baseUrl, email, name, handle }) {
  const subject = "Quick follow-up - MoodMap partner invite";

  const html = `
  <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,Helvetica,sans-serif;font-size:16px;line-height:1.55;color:#111">
    <p style="margin:0 0 12px 0">Hi,</p>

    <p style="margin:0 0 12px 0">
      Just bumping this once. MoodMap is a premium relationship-intelligence app for men (daily cycle-based timing signals).
    </p>

    <p style="margin:0 0 12px 0">
      The partner program pays <b>50% lifetime recurring revenue share</b> on every subscriber you refer.
      No application - instant access here:<br/>
      <a href="${PARTNER_URL}" target="_blank" rel="noopener noreferrer nofollow">${PARTNER_URL}</a>
    </p>

    <p style="margin:0 0 12px 0">
      If it's not relevant, no worries - I'll stop here.
    </p>

    <p style="margin:0 0 12px 0">Best,<br/>Eilev</p>

    ${footer(baseUrl, email)}
  </div>`;

  const listUnsub = `<${unsubUrl(baseUrl, email)}>`;
  return { subject, html, listUnsub };
}
