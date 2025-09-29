// src/i18n/request.js
import {getRequestConfig} from 'next-intl/server';
import {locales as supported, defaultLocale} from '../i18n.js';

const NAMESPACES = ['common', 'home', 'pro', 'support', 'privacy'];

// Dyp sammenfletting for plain objects/arrayer
function deepMerge(base, override) {
  if (Array.isArray(base) && Array.isArray(override)) {
    // For lister (f.eks. bullets i privacy): bruk override hvis den finnes, ellers base
    return override.length ? override : base;
  }
  if (isObject(base) && isObject(override)) {
    const out = {...base};
    for (const key of Object.keys(override)) {
      out[key] =
        key in base ? deepMerge(base[key], override[key]) : override[key];
    }
    return out;
  }
  return override ?? base;
}
function isObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v);
}

export default getRequestConfig(async ({requestLocale}) => {
  // Nytt i next-intl for Next 15: requestLocale skal "awaites" og du må returnere 'locale'
  // Se release-notatene som forbereder for Next 15. :contentReference[oaicite:1]{index=1}
  const req = await requestLocale; // fungerer uansett om det er Promise eller streng
  const locale = supported.includes(req) ? req : defaultLocale;

  const messages = {};
  for (const ns of NAMESPACES) {
    const base = (await import(`../locales/en/${ns}.json`)).default;
    let loc = {};
    try {
      // NB: mappe-/filnavn må matche eksakt språkkode ('pt-BR', 'zh-CN', 'ja', osv.)
      loc = (await import(`../locales/${locale}/${ns}.json`)).default;
    } catch {
      // Mangler fil -> behold engelsk for de nøklene
    }
    messages[ns] = deepMerge(base, loc);
  }

  // Viktig: returnér både locale og messages
  return {locale, messages};
});
