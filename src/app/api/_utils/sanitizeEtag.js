// Harmony Patch 2 — ASCII-safe ETag sanitizer (Edge-safe)
// Ensures HTTP response headers never contain non-ASCII characters (e.g., emojis).
export function sanitizeEtag(etag) {
  if (!etag || typeof etag !== 'string') return '';
  // Keep only printable ASCII (0x20-0x7E). Drop anything else.
  return etag.replace(/[^\x20-\x7E]/g, '');
}
