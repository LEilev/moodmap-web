// pages/api/send-receipt.js
// ------------------------------------------------------------------
// Sends the universal‑link e‑mail via Resend REST API.
//
// If moodmap-app.com is not yet verified, it falls back to the
// sandbox address onboarding@resend.dev so that messages deliver
// immediately while you wait for DKIM.
//
// ENV: RESEND_API_KEY
// ------------------------------------------------------------------
import { NextResponse } from 'next/server';

const RESEND_API = 'https://api.resend.com/emails';
const PROD_FROM = 'MoodMap <noreply@moodmap-app.com>';
const SANDBOX_FROM = 'MoodMap <onboarding@resend.dev>';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.setHeader('Allow', 'POST').status(405).end();
  }

  try {
    const { email, link } = req.body || {};
    if (!email || !link) {
      return res.status(400).json({ error: 'Missing email or link' });
    }

    // 1 Detect if production domain is verified
    let from = PROD_FROM;
    try {
      const domResp = await fetch('https://api.resend.com/domains', {
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
      });
      const { data } = await domResp.json();
      const verified = data?.some(
        (d) => d.name === 'moodmap-app.com' && d.status === 'verified',
      );
      if (!verified) from = SANDBOX_FROM;
    } catch {
      // network or auth error – fall back silently
      from = SANDBOX_FROM;
    }

    // 2 Send the e‑mail via raw REST API (avoids SDK bug)
    const mailResp = await fetch(RESEND_API, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: email,
        subject: 'Activate your MoodMap Pro access',
        html: `<p>Hi there 👋</p>
               <p>Tap the button below on your phone to unlock Pro:</p>
               <p style="margin:24px 0">
                 <a href="${link}" style="display:inline-block;background:#1E3A8A;color:#fff;
                 padding:12px 24px;border-radius:8px;text-decoration:none">Activate Pro</a>
               </p>
               <p>If the button doesn’t work, copy this link:<br/>${link}</p>`,
      }),
    });

    if (!mailResp.ok) {
      const err = await mailResp.text();
      console.error('[send‑receipt] Resend error', err);
      return res.status(500).json({ error: 'Mail provider error' });
    }

    const { id } = await mailResp.json();
    console.info('[send‑receipt] 📧 sent', { id, to: email, from });
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('[send‑receipt] ❌ crash', e);
    return res.status(500).json({ error: 'Internal mail failure' });
  }
}
