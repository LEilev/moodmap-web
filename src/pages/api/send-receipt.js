// pages/api/send-receipt.js
import { Resend } from 'resend';

const resend   = new Resend(process.env.RESEND_API_KEY);
const PROD_FROM = 'MoodMap <noreply@moodmap-app.com>';
const SANDBOX   = 'MoodMap <onboarding@resend.dev>';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, link } = req.body || {};
  if (!email || !link) return res.status(400).json({ error: 'Missing params' });

  // pick a safe sender: sandbox until domain is verified
  let fromAddr = PROD_FROM;
  try {
    const { data } = await resend.domains.list();
    const verified = data?.some((d) => d.name === 'moodmap-app.com' && d.status === 'verified');
    if (!verified) fromAddr = SANDBOX;
  } catch (e) {
    console.warn('[send-receipt] Could not verify domain status – using sandbox sender');
    fromAddr = SANDBOX;
  }

  try {
    const { error, id } = await resend.emails.send({
      from: fromAddr,
      to: email,
      subject: 'Activate your MoodMap Pro access',
      html: `
        <p>Hi there 👋</p>
        <p>Thanks for subscribing! Tap the button below on your phone to unlock Pro:</p>
        <p style="margin:24px 0">
          <a href="${link}"
             style="display:inline-block;background:#1E3A8A;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none">
             Activate Pro
          </a>
        </p>
        <p>If the button doesn't work, paste this link in your browser:<br/>${link}</p>
        <hr/>
        <p style="font-size:12px;color:#666">Sent via Resend • ID ${id || 'n/a'}</p>
      `,
    });

    if (error) throw new Error(error.message);
    console.info('[send-receipt] 📧 mailed', { to: email, id });
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('[send-receipt] ❌ mail failed', e);
    return res.status(500).json({ error: e.message });
  }
}
