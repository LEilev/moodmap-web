// src/i18n/request.js
import {getRequestConfig} from 'next-intl/server';
import {locales as supported, defaultLocale} from '../i18n.js';

const NAMESPACES = ['common', 'home', 'pro', 'support', 'privacy'];

// Dyp sammenfletting for plain objects/arrayer, så oversatte deler beholdes
function deepMerge(base, override) {
  if (Array.isArray(base) && Array.isArray(override)) {
    return override.length ? override : base;
  }
  if (isObject(base) && isObject(override)) {
    const out = {...base};
    for (const key of Object.keys(override)) {
      out[key] = key in base ? deepMerge(base[key], override[key]) : override[key];
    }
    return out;
  }
  return override ?? base;
}
function isObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v);
}

export default getRequestConfig(async ({locale}) => {
  if (!supported.includes(locale)) locale = defaultLocale;

  const messages = {};
  for (const ns of NAMESPACES) {
    const base = (await import(`../locales/en/${ns}.json`)).default;
    let loc = {};
    try {
      // NB: mappe-/filnavn må matche eksakt språkkode ('pt-BR', 'zh-CN', 'ja', osv.)
      loc = (await import(`../locales/${locale}/${ns}.json`)).default;
    } catch {
      // Mangler fil -> behold engelsk
    }
    messages[ns] = deepMerge(base, loc);
  }

  return {messages};
});
