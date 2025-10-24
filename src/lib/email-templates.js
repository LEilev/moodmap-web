const CTA_URL = 'https://moodmap.promotekit.com';

const footer = (baseUrl, email) => `
  <hr style="border:none;border-top:1px solid #eee;margin:16px 0" />
  <p style="font-size:12px;color:#666">
    Du mottar denne henvendelsen fordi kontaktinfoen din er oppgitt offentlig for samarbeid.
    Ikke interessert? <a href="${baseUrl}/api/influencer/unsubscribe?email=${encodeURIComponent(email)}">Avmeld her</a>.
  </p>
`;

export function initialTemplate({ baseUrl, email, name, handle }) {
  const subject = `Samarbeid? MoodMap x ${handle || name || 'deg'}`;
  const html = `
  <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial">
    <p>Hei ${name || handle || ''},</p>
    <p>Vi bygger <b>MoodMap</b> – en enkel måte å tracke humør og mentale vaner på.
       Vi tror publikummet ditt vil like den, og vil gjerne invitere deg inn i vårt partnerprogram via PromoteKit.</p>
    <p><a href="${CTA_URL}" style="font-weight:600">Gå til partnerportalen</a> (registrering, kode, tracking og utbetaling håndteres der).</p>
    <p>– Team MoodMap</p>
    ${footer(baseUrl, email)}
  </div>`;
  const listUnsub = `<${baseUrl}/api/influencer/unsubscribe?email=${encodeURIComponent(email)}>`;
  return { subject, html, listUnsub };
}

export function followupTemplate({ baseUrl, email, name, handle }) {
  const subject = `Løfter dette: MoodMap x ${handle || name || 'deg'}`;
  const html = `
  <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial">
    <p>Hei ${name || handle || ''},</p>
    <p>Ville bare løfte denne – vi tilbyr fortsatt plass i partnerprogrammet vårt.
       Alt går via PromoteKit: <a href="${CTA_URL}" style="font-weight:600">registrér deg her</a>.</p>
    <p>– Team MoodMap</p>
    ${footer(baseUrl, email)}
  </div>`;
  const listUnsub = `<${baseUrl}/api/influencer/unsubscribe?email=${encodeURIComponent(email)}>`;
  return { subject, html, listUnsub };
}
