// src/lib/email-templates.js
//
// Purpose:
//   Canonical outreach email templates used by /api/influencer/send.
//   Updated: initialTemplate now sends the exact content from email.html
//   (same copy/structure), with an added unsubscribe footer for compliance.
//
// Notes:
// - We keep List-Unsubscribe header via `listUnsub`.
// - We also render an in-body unsubscribe link (good practice for compliance).
// - `baseUrl` must be set (e.g. https://moodmap-app.com) in env as BASE_URL.

const PARTNER_URL = "https://moodmap-app.com/partner";
const HOME_URL = "https://moodmap-app.com";

const unsubUrl = (baseUrl, email) =>
  `${baseUrl}/api/influencer/unsubscribe?email=${encodeURIComponent(email)}`;

const footer = (baseUrl, email) => `
  <hr style="border:none;border-top:1px solid #eee;margin:16px 0" />
  <p style="font-size:12px;color:#666;margin:0;line-height:1.4">
    You’re receiving this because your contact email is listed publicly for collaborations.
    Not interested? <a href="${unsubUrl(baseUrl, email)}">Unsubscribe</a>.
  </p>
`;

/**
 * initialTemplate
 * Sends the exact outreach content you showed (from email.html),
 * plus a compliance footer (unsubscribe link).
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
 * Kept simple + consistent. You can rewrite later, but this is production-safe.
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
