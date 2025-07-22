// pages/api/universal-link.js
// -------------------------------------------------------------
// Generates a signed universal link:
//
//   POST /api/universal-link
//   {
//     "userId":    "user_abc123",
//     "sessionId": "sess_xyz987"
//   }
//
// ➜ {
//      "url": "https://moodmap-app/activate?u=user_abc123&s=sess_xyz987&exp=1721500082&sig=…"
//    }
//
// ENV (Vercel):
//   UNIVERSAL_LINK_SECRET      = any 32‑64 char random string
//
// © 2025 MoodMap – MIT.

import crypto from 'crypto'

export default function handler(req, res) {
  // 1. Allow only POST
  if (req.method !== 'POST') {
    return res.setHeader('Allow', 'POST').status(405).end('Method Not Allowed')
  }

  const { userId, sessionId } = req.body || {}

  // 2. Validate input
  if (!userId || !sessionId) {
    return res.status(400).json({ error: 'userId and sessionId are required' })
  }

  // 3. Build expiry (now + 10 min, seconds)
  const exp = Math.floor(Date.now() / 1000) + 600

  // 4. Create HMAC‑SHA256 signature
  const secret = process.env.UNIVERSAL_LINK_SECRET
  if (!secret) {
    console.error('UNIVERSAL_LINK_SECRET missing in env')
    return res.status(500).json({ error: 'Server mis‑config' })
  }

  const payload = `${sessionId}:${userId}:${exp}`
  const sig = crypto.createHmac('sha256', secret).update(payload).digest('hex')

  // 5. Assemble URL
 const url = `https://moodmap-app.com/activate?u=${encodeURIComponent(userId)}&s=${encodeURIComponent(sessionId)}&exp=${exp}&sig=${sig}`


  return res.status(200).json({ url })
}
