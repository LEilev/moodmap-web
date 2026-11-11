// Web Crypto keeps these helpers compatible with the Edge runtime.
const encoder = new TextEncoder();

export class InfluencerInputError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

export function normalizeInfluencerEmail(value) {
  if (typeof value !== 'string') return null;
  const email = value.trim().toLowerCase();
  if (email.length > 254) return null;
  const parts = email.split('@');
  if (parts.length !== 2) return null;
  const [local, domain] = parts;
  if (!local || local.length > 64 || local.startsWith('.') || local.endsWith('.') || local.includes('..')) return null;
  if (!/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+$/.test(local)) return null;
  const labels = domain.split('.');
  if (labels.length < 2 || labels.some((label) => !/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(label))) return null;
  return email;
}

export function base64Url(bytes) {
  return btoa(String.fromCharCode(...new Uint8Array(bytes)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function decodeBase64Url(value) {
  if (typeof value !== 'string' || !/^[A-Za-z0-9_-]+$/.test(value)) throw new InfluencerInputError('Invalid token');
  const binary = atob(value.replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

export async function sha256(value) {
  return base64Url(await crypto.subtle.digest('SHA-256', encoder.encode(value)));
}

async function hmacKey(secret, usage) {
  return crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, [usage]);
}

export async function hmacSign(secret, message) {
  const key = await hmacKey(secret, 'sign');
  return base64Url(await crypto.subtle.sign('HMAC', key, encoder.encode(message)));
}

export async function hmacVerify(secret, message, signature) {
  try {
    const bytes = decodeBase64Url(signature);
    // Reject padding-bit aliases; issued signatures use canonical base64url.
    if (bytes.length !== 32 || base64Url(bytes) !== signature) return false;
    const key = await hmacKey(secret, 'verify');
    return crypto.subtle.verify('HMAC', key, bytes, encoder.encode(message));
  } catch {
    return false;
  }
}

/** Bound the actual streamed body, including requests without Content-Length. */
export async function readLimitedText(request, maxBytes) {
  const declared = Number(request.headers.get('content-length'));
  if (Number.isFinite(declared) && declared > maxBytes) throw new InfluencerInputError('Request too large', 413);
  if (!request.body) return '';
  const reader = request.body.getReader();
  const chunks = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBytes) {
        await reader.cancel();
        throw new InfluencerInputError('Request too large', 413);
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    throw new InfluencerInputError('Invalid encoding');
  }
}
