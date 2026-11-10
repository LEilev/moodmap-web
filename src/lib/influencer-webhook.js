import { INF_UNSUB, infKey } from '@/lib/inf-keys';
import { InfluencerInputError, normalizeInfluencerEmail } from '@/lib/influencer-crypto';

const encoder = new TextEncoder();
const MAX_TIMESTAMP_AGE_SECONDS = 5 * 60;
const EVENT_RETENTION_SECONDS = 30 * 24 * 60 * 60;

function decodeBase64(value) {
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(value)) throw new Error('Invalid base64');
  return Uint8Array.from(atob(value), (char) => char.charCodeAt(0));
}

export async function importResendWebhookKey(secret) {
  if (typeof secret !== 'string' || !secret.startsWith('whsec_') || secret.length > 512) {
    throw new Error('Webhook verification is not configured');
  }
  const bytes = decodeBase64(secret.slice(6));
  if (bytes.length < 16) throw new Error('Invalid webhook key');
  return crypto.subtle.importKey('raw', bytes, { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']);
}

/**
 * Resend's Svix protocol: verify the exact raw body and timestamp, before JSON.
 * https://resend.com/docs/webhooks/verify-webhooks-requests
 * https://docs.svix.com/receiving/verifying-payloads/how-manual
 */
export async function verifyResendWebhook({ key, headers, body, now = Date.now() }) {
  const id = headers.get('svix-id') || '';
  const timestamp = headers.get('svix-timestamp') || '';
  const signatures = headers.get('svix-signature') || '';
  if (!/^[A-Za-z0-9_-]{1,200}$/.test(id) || !/^\d{1,12}$/.test(timestamp) || !signatures || signatures.length > 2048) {
    throw new InfluencerInputError('Invalid webhook', 401);
  }
  const age = Math.abs(Math.floor(now / 1000) - Number(timestamp));
  if (age > MAX_TIMESTAMP_AGE_SECONDS) throw new InfluencerInputError('Invalid webhook', 401);
  const message = encoder.encode(`${id}.${timestamp}.${body}`);
  for (const entry of signatures.split(' ').slice(0, 20)) {
    const [version, signature] = entry.split(',');
    if (version !== 'v1' || !signature) continue;
    try {
      const bytes = decodeBase64(signature);
      if (bytes.length === 32 && await crypto.subtle.verify('HMAC', key, bytes, message)) return id;
    } catch {
      // A malformed/unsupported signature cannot authorize the request. During
      // provider key rotation another v1 signature in the header may be valid.
    }
  }
  throw new InfluencerInputError('Invalid webhook', 401);
}

export function parseInfluencerEvent(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) throw new InfluencerInputError('Invalid event');
  const kinds = {
    'email.bounced': 'bounce',
    'email.suppressed': 'bounce',
    'email.complained': 'unsub',
    'email.opened': 'open',
    'email.clicked': 'click',
  };
  const kind = typeof payload.type === 'string' && Object.hasOwn(kinds, payload.type) ? kinds[payload.type] : null;
  if (!kind) return null;
  const to = payload.data?.to;
  const recipients = Array.isArray(to) ? to : (typeof to === 'string' ? [to] : []);
  if (recipients.length > 100) throw new InfluencerInputError('Too many recipients');
  const emails = [...new Set(recipients.map(normalizeInfluencerEmail).filter(Boolean))];
  if (emails.length === 0) return null;
  return { kind, emails };
}

// Validation, business changes and completion marker execute in one Redis
// script. A lost HTTP response can safely be retried: no early "processed" lock
// hides failed work, and repeated delivery cannot increment counters twice.
const APPLY_EVENT_SCRIPT = `
if redis.call('EXISTS', KEYS[1]) == 1 then return 0 end
local suppressionType = redis.call('TYPE', KEYS[2]).ok
if suppressionType ~= 'none' and suppressionType ~= 'set' then return redis.error_reply('Invalid suppression type') end
local kind = ARGV[1]
local counter = kind == 'open' and 'opens' or 'clicks'
local counts = {}
local known = {}
-- Preflight all data types/counters before the first write. Redis scripts do
-- not roll back changes if a later command has a runtime argument/type error.
for i = 3, #KEYS do
  local contactType = redis.call('TYPE', KEYS[i]).ok
  if contactType ~= 'none' and contactType ~= 'hash' then return redis.error_reply('Invalid contact type') end
  known[i] = contactType == 'hash'
  if known[i] and (kind == 'open' or kind == 'click') then
    local value = redis.call('HGET', KEYS[i], counter) or '0'
    local count = tonumber(value)
    if not count or count < 0 or count > 9007199254740000 or not string.match(value, '^%d+$') then
      return redis.error_reply('Invalid contact counter')
    end
    counts[i] = string.format('%.0f', count + 1)
  end
end
for i = 3, #KEYS do
  local email = ARGV[i + 1]
  if kind == 'bounce' or kind == 'unsub' then
    redis.call('SADD', KEYS[2], email)
    if known[i] then
      local status = kind == 'bounce' and 'bounced' or 'unsubscribed'
      local field = kind == 'bounce' and 'bouncedAt' or 'unsubscribedAt'
      redis.call('HSET', KEYS[i], 'status', status, field, ARGV[2], 'processingAt', '')
    end
  elseif known[i] then
    local field = kind == 'open' and 'openedAt' or 'clickedAt'
    redis.call('HSET', KEYS[i], field, ARGV[2], counter, counts[i])
  end
end
redis.call('SET', KEYS[1], '1', 'EX', ARGV[3])
return 1
`;

export async function applyInfluencerEvent(redis, { id, kind, emails }) {
  if (!redis) throw new Error('Webhook store unavailable');
  return redis.eval(
    APPLY_EVENT_SCRIPT,
    [`inf-webhook:resend:${id}`, INF_UNSUB, ...emails.map(infKey)],
    [kind, new Date().toISOString(), EVENT_RETENTION_SECONDS, ...emails],
  );
}
