// pages/api/send-receipt.js
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, link } = req.body || {};
  if (!email || !link) return res.status(400).json({ error: 'Missing params' });

  try {
    await resend.emails.send({
      from: 'MoodMap <noreply@moodmap-app.com>',
      to: email,
      subject: 'Activate your MoodMap Pro access',
      html: `
        <p>Hi there 👋</p>
        <p>Thanks for subscribing! Tap the button below on your phone to unlock Pro:</p>
        <p><a href="${link}" style="display:inline-block;background:#1E3A8A;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none">Activate Pro</a></p>
        <p>— The MoodMap team</p>
      `,
    });

    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
