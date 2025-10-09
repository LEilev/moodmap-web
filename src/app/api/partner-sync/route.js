import { NextResponse } from 'next/server'
import { setNX } from '@/lib/redis.js'
import { limitByIP } from '@/lib/ratelimit.js'

export const runtime = 'edge'

// --- Edge-safe UUID generator
function uuidv4() {
  const bytes = crypto.getRandomValues(new Uint8Array(16))
  bytes[6] = (bytes[6] & 0x0f) | 0x40
  bytes[8] = (bytes[8] & 0x3f) | 0x80
  const hex = [...bytes].map(b => b.toString(16).padStart(2, '0')).join('')
  return (
    hex.slice(0, 8) +
    '-' +
    hex.slice(8, 12) +
    '-' +
    hex.slice(12, 16) +
    '-' +
    hex.slice(16, 20) +
    '-' +
    hex.slice(20)
  )
}

// --- Unambiguous Base32 code
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

  const pairId = uuidv4()
  const code = generateCode(12)

  const ok = await setNX(`pairCode:${code}`, pairId, 600)
  if (!ok) {
    return NextResponse.json({ error: 'Collision, retry' }, { status: 500 })
  }

  return NextResponse.json({ code, expiresInSec: 600 })
}
