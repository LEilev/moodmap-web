// src/i18n/request.js
import {getRequestConfig} from 'next-intl/server';

// Hold disse listene synkronisert med LocaleLink/LanguageSwitcher/middleware/generateStaticParams
export const SUPPORTED_LOCALES = ['en', 'no', 'de', 'fr', 'it', 'es', 'pt-BR', 'zh-CN', 'ja'];
export const DEFAULT_LOCALE = 'en';
const NAMESPACES = ['common', 'home', 'pro', 'support', 'privacy'];

// Enkel dyp-fletting slik at nested keys faller tilbake til engelsk
function isObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v);
}
function deepMerge(base, override) {
  if (!isObject(base)) return override;
  const out = {...base};
  for (const [k, v] of Object.entries(override || {})) {
    out[k] = isObject(v) && isObject(base[k]) ? deepMerge(base[k], v) : v;
  }
  return out;
}

// Sikker dynamic import: manglende filer gir {} (ingen build-feil)
async function safeImport(locale, ns) {
  try {
    const mod = await import(`../locales/${locale}/${ns}.json`);
    return mod?.default ?? {};
  } catch {
    return {};
  }
}

export default getRequestConfig(async ({requestLocale}) => {
  const locale = SUPPORTED_LOCALES.includes(requestLocale) ? requestLocale : DEFAULT_LOCALE;

  // Bygg meldings-objekt per namespace med engelsk fallback
  const messages = {};
  for (const ns of NAMESPACES) {
    const baseEn = await safeImport(DEFAULT_LOCALE, ns);
    const locMsg = locale === DEFAULT_LOCALE ? {} : await safeImport(locale, ns);
    messages[ns] = deepMerge(baseEn, locMsg);
  }

  return {
    locale,
    messages
  };
});
