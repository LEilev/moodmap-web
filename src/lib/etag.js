/**
 * src/lib/etag.js
 *
 * Purpose:
 *   Minimal ETag utility for conditional GET in Edge routes.
 *
 * Usage:
 *   import { makeETag, isETagMatch } from '@/lib/etag.js';
 *
 *   const etag = makeETag(date, version); // "20251009-v8"
 *   if (isETagMatch(req.headers.get('if-none-match'), etag)) return new Response(null, { status: 304 });
 */

/**
 * makeETag - Create a simple strong ETag based on date and version.
 * @param {string} date - "YYYYMMDD"
 * @param {number|string} version - monotonic version number
 * @returns {string} e.g., "20251009-v8"
 */
export function makeETag(date, version) {
  return `${date}-v${version}`;
}

/**
 * isETagMatch - Safe comparison of client ETag and server ETag.
 * Strips surrounding quotes if client sent them.
 * @param {string|null} etagFromClient
 * @param {string} serverETag
 * @returns {boolean}
 */
export function isETagMatch(etagFromClient, serverETag) {
  if (!etagFromClient || !serverETag) return false;
  const clean = etagFromClient.replace(/^W\//, '').replace(/^"+|"+$/g, '');
  return clean === serverETag;
}
