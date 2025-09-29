// src/i18n/request.js
import {getRequestConfig} from 'next-intl/server';

export const SUPPORTED_LOCALES = ['en', 'no', 'de', 'fr', 'it', 'es', 'pt-BR', 'zh-CN', 'ja'];
export const DEFAULT_LOCALE = 'en';
const NAMESPACES = ['common', 'home', 'pro', 'support', 'privacy'];

// Dyp-fletting for nested nøkler (engelsk base + locale override)
function isPlainObject(v) { return v && typeof v === 'object' && !Array.isArray(v); }
function deepMerge(base, override) {
  if (!isPlainObject(base)) return override ?? base ?? {};
  const out = {...base};
  for (const [k, v] of Object.entries(override || {})) {
    out[k] = isPlainObject(v) && isPlainObject(base[k]) ? deepMerge(base[k], v) : v;
  }
  return out;
}

// Import trygt: manglende fil → {}
async function safeImport(locale, ns) {
  try {
    const mod = await import(`../locales/${locale}/${ns}.json`);
    return mod?.default ?? {};
  } catch {
    return {};
  }
}

export default getRequestConfig(async ({requestLocale}) => {
  // Bruk locale fra path; hvis ukjent → engelsk
  const locale = SUPPORTED_LOCALES.includes(requestLocale) ? requestLocale : DEFAULT_LOCALE;

  // Last EN som base + lokalt språk per namespace (gir fallback til engelsk på manglende nøkler)
  const messages = {};
  for (const ns of NAMESPACES) {
    const en = await safeImport(DEFAULT_LOCALE, ns);
    const loc = locale === DEFAULT_LOCALE ? {} : await safeImport(locale, ns);
    messages[ns] = deepMerge(en, loc);
  }

  return {locale, messages};
});
