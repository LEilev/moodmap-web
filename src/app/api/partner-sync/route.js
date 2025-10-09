// src/app/api/partner-sync/route.js
//
// Purpose:
//   Generate a secure one-time pairing code (10–12 chars) for Partner Mode.
//   Stores in Upstash Redis with NX + 600s TTL.
//   Rate-limited per IP to prevent abuse.
// Runtime: Edge-safe (no Node APIs).

import { NextResponse } from 'next/server'
import { setNX } from '@/lib/redis.js'
import { limitByIP } from '@/lib/ratelimit.js'
import { v4 as uuidv4 } from 'uuid'

export const runtime = 'edge'

// Helper: unambiguous Base32 code (no O/0/I/1)
function generateCode(length = 12) {
  const alphabet = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
  const bytes = crypto.getRandomValues(new Uint8Array(length))
  return Array.from(bytes, b => alphabet[b % alphabet.length]).join('')
}

export async function POST(request) {
  const ip =
    request.headers.get('x-forwarded-for') ||
    request.headers.get('x-real-ip') ||
    'anon'

  // --- Rate limit: ≤ 5 per minute per IP
  const rl = await limitByIP(ip, 5, 60)
  if (!rl.ok) {
    return NextResponse.json(
      { error: 'Too many requests' },
      {
        status: 429,
        headers: { 'Retry-After': rl.retryAfterSec.toString() },
      }
    )
  }

  // --- Generate IDs
  const pairId = uuidv4()
  const code = generateCode(12)

  // --- Store in Redis: NX + EX 600s
  const ok = await setNX(`pairCode:${code}`, pairId, 600)
  if (!ok) {
    return NextResponse.json(
      { error: 'Code collision, retry' },
      { status: 500 }
    )
  }

  // --- Return response
  return NextResponse.json({
    code,
    expiresInSec: 600,
  })
}
