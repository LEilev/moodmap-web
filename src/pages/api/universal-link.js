// pages/api/universal-link.js
import { generateHmacSignature } from '../../lib/universal-link';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.setHeader('Allow', 'POST').status(405).end('Method Not Allowed');
  }

  const { userId, sessionId } = req.body || {};

  if (!userId || !sessionId) {
    return res.status(400).json({ error: 'userId and sessionId are required' });
  }

  const exp = Math.floor(Date.now() / 1000) + 600;
  const sig = generateHmacSignature(userId, sessionId, exp);

  const url = `https://moodmap-app.com/activate?u=${encodeURIComponent(
    userId
  )}&s=${encodeURIComponent(sessionId)}&exp=${exp}&sig=${sig}`;

  return res.status(200).json({ url });
}
