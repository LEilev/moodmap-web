// pages/api/send-receipt.js
// ------------------------------------------------------------------
// Sends the universal‑link e‑mail after Stripe checkout.
//
// • Uses Resend REST API directly (no SDK TDZ bug)
// • One‑time domain verification at cold start
// • Automatic fallback to sandbox sender if domain ever loses DKIM
//
// ENV (Vercel):
//   RESEND_API_KEY            re_123...
//
// ------------------------------------------------------------------
const RESEND_API = 'https://api.resend.com';
const PROD_FROM = 'MoodMap <noreply@moodmap-app.com>';
const SANDBOX_FROM = 'MoodMap <onboarding@resend.dev>';

let fromAddress = null; // resolved once per Lambda/Edge instance

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.setHeader('Allow', 'POST').status(405).end();
  }

  const { email, link } = req.body || {};
  if (!email || !link) return res.status(400).json({ error: 'Missing email or link' });

  try {
    // ------------------------------------------------------------------
    // 1. Resolve sender address (cold‑start check)
    // ------------------------------------------------------------------
    if (!fromAddress) {
      fromAddress = await pickSenderAddress();
      console.info('[send-receipt] using sender:', fromAddress);
    }

    // ------------------------------------------------------------------
    // 2. Send the mail with simple retry logic
    // ------------------------------------------------------------------
    const resp = await fetchRetry(
      `${RESEND_API}/emails`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromAddress,
          to: email,
          subject: 'Activate your MoodMap Pro access',
          html: emailHtml(link),
        }),
      },
      3,
    );

    if (!resp.ok) {
      const txt = await resp.text();
      console.error('[send-receipt] Resend error', txt);
      return res.status(500).json({ error: 'Mail provider error' });
    }

    const { id } = await resp.json();
    console.info('[send-receipt] 📧 sent', { id, to: email });
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[send-receipt] ❌', err);
    return res.status(500).json({ error: 'Internal mail failure' });
  }
}

/* ---------------- helpers ---------------- */

async function pickSenderAddress() {
  if (!process.env.RESEND_API_KEY) throw new Error('RESEND_API_KEY missing');

  try {
    const r = await fetch(`${RESEND_API}/domains`, {
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
    });
    const { data } = await r.json();
    const verified = data?.some(
      (d) => d.name === 'moodmap-app.com' && d.status === 'verified',
    );
    return verified ? PROD_FROM : SANDBOX_FROM;
  } catch (e) {
    console.warn('[send-receipt] domain check failed, using sandbox sender');
    return SANDBOX_FROM;
  }
}

function emailHtml(link) {
  return `
    <p>Hi there 👋</p>
    <p>Tap the button below on your phone to unlock MoodMap Pro:</p>
    <p style="margin:24px 0">
      <a href="${link}" style="display:inline-block;background:#1E3A8A;color:#fff;
         padding:12px 24px;border-radius:8px;text-decoration:none">
         Activate Pro
      </a>
    </p>
    <p>If the button doesn’t work, copy this link:<br/>${link}</p>
    <hr style="margin-top:32px"/>
    <p style="font-size:12px;color:#666">Sent via Resend</p>`;
}

async function fetchRetry(url, init, retries = 3) {
  let lastErr;
  for (let i = 0; i < retries; i++) {
    try {
      const r = await fetch(url, init);
      if (r.ok || r.status < 500) return r; // success or 4xx
      lastErr = new Error(`HTTP ${r.status}`);
    } catch (e) {
      lastErr = e;
    }
    await new Promise((r) => setTimeout(r, 300 * (i + 1)));
  }
  throw lastErr;
}
