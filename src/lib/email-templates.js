// src/lib/email-templates.js
//
// Purpose:
//   Canonical outreach email templates used by /api/influencer/worker.
//   initialTemplate sends the exact content you showed (from email.html),
//   with an unsubscribe footer + optional postal address for compliance.
//
// Env:
// - BASE_URL must be set (e.g. https://moodmap-app.com)
// - COMPANY_POSTAL_ADDRESS (optional but recommended for compliance)

const PARTNER_URL = "https://moodmap-app.com/partner";
const HOME_URL = "https://moodmap-app.com";

const COMPANY_POSTAL_ADDRESS = (process.env.COMPANY_POSTAL_ADDRESS || '').trim();

const esc = (s = '') => {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return String(s).replace(/[&<>"']/g, (c) => map[c]);
};

const unsubUrl = (baseUrl, email) =>
  `${baseUrl}/api/influencer/unsubscribe?email=${encodeURIComponent(email)}`;

const footer = (baseUrl, email) => {
  const addr = COMPANY_POSTAL_ADDRESS ? `<br/>${esc(COMPANY_POSTAL_ADDRESS)}` : '';
  return `
  <hr style="border:none;border-top:1px solid #eee;margin:16px 0" />
  <p style="font-size:12px;color:#666;margin:0;line-height:1.4">
    You’re receiving this because your contact email is listed publicly for collaborations.
    Not interested? <a href="${unsubUrl(baseUrl, email)}">Unsubscribe</a>.
    ${addr}
  </p>
`;
};

/**
 * initialTemplate
 */
export function initialTemplate({ baseUrl, email, name, handle }) {
  const subject = "Partner program: MoodMap (50% lifetime recurring)";

  const html = `
  <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,Helvetica,sans-serif;font-size:16px;line-height:1.55;color:#111">
    <p style="margin:0 0 12px 0">Hello!</p>

    <p style="margin:0 0 12px 0">
      I came across your Instagram and your audience looks like a strong fit for what we’ve built.
    </p>

    <p style="margin:0 0 12px 0">
      <b>MoodMap</b> is a premium relationship-intelligence app for men.<br/>
      It translates cycle timing and physiology into clear relationship context — not therapy, not fertility tracking.
    </p>

    <p style="margin:0 0 12px 0">
      We’ve just opened our partner program:<br/>
      • 50% lifetime recurring revenue<br/>
      • Subscriptions via Stripe<br/>
      • Tracking &amp; payouts via PromoteKit
    </p>

    <p style="margin:0 0 12px 0">
      Full details here:
      <a href="${PARTNER_URL}" target="_blank" rel="noopener noreferrer nofollow">${PARTNER_URL}</a>
    </p>

    <p style="margin:0 0 12px 0">
      No application, no negotiation — just a clean partner setup if it fits your audience.
    </p>

    <p style="margin:0 0 4px 0">Best,</p>
    <p style="margin:0 0 2px 0">Eilev</p>
    <p style="margin:0 0 2px 0">Founder, MoodMap</p>
    <p style="margin:0 0 12px 0">
      <a href="${HOME_URL}" target="_blank" rel="noopener noreferrer nofollow">${HOME_URL}</a>
    </p>

    ${footer(baseUrl, email)}
  </div>`;

  const listUnsub = `<${unsubUrl(baseUrl, email)}>`;
  return { subject, html, listUnsub };
}

/**
 * followupTemplate
 */
export function followupTemplate({ baseUrl, email, name, handle }) {
  const subject = "Quick follow-up: MoodMap partner program (50% lifetime)";

  const html = `
  <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,Helvetica,sans-serif;font-size:16px;line-height:1.55;color:#111">
    <p style="margin:0 0 12px 0">Hello${name || handle ? ` ${name || handle}` : ""},</p>

    <p style="margin:0 0 12px 0">
      Just following up in case this is relevant — MoodMap is opening partner slots for relationship-focused creators.
    </p>

    <p style="margin:0 0 12px 0">
      Details here:
      <a href="${PARTNER_URL}" target="_blank" rel="noopener noreferrer nofollow">${PARTNER_URL}</a>
    </p>

    <p style="margin:0 0 12px 0">Best,<br/>Eilev</p>

    ${footer(baseUrl, email)}
  </div>`;

  const listUnsub = `<${unsubUrl(baseUrl, email)}>`;
  return { subject, html, listUnsub };
}
