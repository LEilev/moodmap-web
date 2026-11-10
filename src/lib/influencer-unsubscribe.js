import { INF_UNSUB, infKey } from '@/lib/inf-keys';
import {
  base64Url,
  decodeBase64Url,
  hmacSign,
  hmacVerify,
  normalizeInfluencerEmail,
  sha256,
} from '@/lib/influencer-crypto';

const TOKEN_PATTERN = /^v1\.[A-Za-z0-9_-]{43}$/;
const TOKEN_PURPOSE = 'moodmap:influencer-unsubscribe:v1:';
const CONFIRM_PURPOSE = 'moodmap:influencer-unsubscribe:legacy-confirm:';
const CONFIRM_TTL_SECONDS = 15 * 60;

function signingSecrets() {
  // A dedicated key is preferable. Domain separation makes the existing,
  // server-only credentials safe fallbacks for already-configured outreach.
  return [...new Set([
    process.env.INFLUENCER_UNSUBSCRIBE_SECRET,
    process.env.CRON_SECRET,
    process.env.RESEND_API_KEY,
  ].map((value) => (value || '').trim()).filter((value) => value.length >= 32))];
}

function signingSecret() {
  const secret = signingSecrets()[0];
  if (!secret) throw new Error('Unsubscribe signing is not configured');
  return secret;
}

export function unsubscribeSigningConfigured() {
  return signingSecrets().length > 0;
}

async function tokenKey(token) {
  return `inf-unsubscribe:token:${await sha256(token)}`;
}

/**
 * The URL carries only an opaque HMAC, never an email address. Registering its
 * digest makes old issued links survive signing/API-key rotation. These records
 * intentionally do not expire: old emails must still allow unsubscribing.
 * Keep this namespace when backing up or migrating the outreach database.
 */
export async function createUnsubscribeUrl({ baseUrl, email: input, redis }) {
  const email = normalizeInfluencerEmail(input);
  if (!email || !redis) throw new Error('Cannot create unsubscribe link');
  const url = new URL('/api/influencer/unsubscribe', baseUrl);
  if (url.protocol !== 'https:' || url.username || url.password) throw new Error('BASE_URL must use HTTPS');

  const recipientKey = `inf-unsubscribe:recipient:${await sha256(email)}`;
  let token = await redis.get(recipientKey);
  if (!token) {
    token = `v1.${await hmacSign(signingSecret(), TOKEN_PURPOSE + email)}`;
    const key = await tokenKey(token);
    await redis.set(key, email, { nx: true });
    if (await redis.get(key) !== email) throw new Error('Unsubscribe token conflict');
    const created = await redis.set(recipientKey, token, { nx: true });
    if (!created) token = await redis.get(recipientKey);
  }
  if (!TOKEN_PATTERN.test(token) || await resolveUnsubscribeToken(token, redis) !== email) {
    throw new Error('Unsubscribe token record unavailable');
  }
  url.searchParams.set('token', token);
  return url.toString();
}

export async function resolveUnsubscribeToken(token, redis) {
  if (typeof token !== 'string' || !TOKEN_PATTERN.test(token)) return null;
  if (!redis) throw new Error('Unsubscribe store unavailable');
  // Only a token actually issued and registered by this server can resolve.
  // A changed signature has an unrelated SHA-256 lookup key and cannot match.
  return normalizeInfluencerEmail(await redis.get(await tokenKey(token)));
}

/** Unsigned links already in old email remain usable through a safe GET form. */
export async function createLegacyConfirmationToken(email, now = Date.now()) {
  const normalized = normalizeInfluencerEmail(email);
  if (!normalized) return null;
  const encoded = base64Url(new TextEncoder().encode(normalized));
  const expires = Math.floor(now / 1000) + CONFIRM_TTL_SECONDS;
  const payload = `legacy.${encoded}.${expires}`;
  return `${payload}.${await hmacSign(signingSecret(), CONFIRM_PURPOSE + payload)}`;
}

export async function resolveLegacyConfirmationToken(token, now = Date.now()) {
  if (typeof token !== 'string' || token.length > 1024) return null;
  const match = token.match(/^legacy\.([A-Za-z0-9_-]+)\.(\d{10,12})\.([A-Za-z0-9_-]{43})$/);
  if (!match) return null;
  const expires = Number(match[2]);
  const current = Math.floor(now / 1000);
  if (expires < current || expires > current + CONFIRM_TTL_SECONDS + 60) return null;
  const payload = token.slice(0, token.lastIndexOf('.'));
  let verified = false;
  for (const secret of signingSecrets()) {
    if (await hmacVerify(secret, CONFIRM_PURPOSE + payload, match[3])) {
      verified = true;
      break;
    }
  }
  if (!verified) return null;
  try {
    return normalizeInfluencerEmail(new TextDecoder('utf-8', { fatal: true }).decode(decodeBase64Url(match[1])));
  } catch {
    return null;
  }
}

const UNSUBSCRIBE_SCRIPT = `
local contactType = redis.call('TYPE', KEYS[2]).ok
local suppressionType = redis.call('TYPE', KEYS[1]).ok
if contactType ~= 'none' and contactType ~= 'hash' then return redis.error_reply('Invalid contact type') end
if suppressionType ~= 'none' and suppressionType ~= 'set' then return redis.error_reply('Invalid suppression type') end
-- Old unsigned links cannot prove ownership. Limit this compatibility path to
-- contacts already held by outreach, and never create arbitrary contact data.
if ARGV[3] == 'legacy' and contactType == 'none' then return 0 end
redis.call('SADD', KEYS[1], ARGV[1])
if contactType == 'hash' then
  redis.call('HSET', KEYS[2], 'status', 'unsubscribed', 'unsubscribedAt', ARGV[2], 'processingAt', '')
end
return 1
`;

export async function suppressInfluencer({ redis, email, legacy = false }) {
  if (!redis) throw new Error('Unsubscribe store unavailable');
  await redis.eval(
    UNSUBSCRIBE_SCRIPT,
    [INF_UNSUB, infKey(email)],
    [email, new Date().toISOString(), legacy ? 'legacy' : 'signed'],
  );
}
