// src/i18n/request.js
import {getRequestConfig} from 'next-intl/server';

const SUPPORTED_LOCALES = ['en', 'no', 'de', 'fr', 'it', 'es', 'pt-BR', 'zh-CN', 'ja'];
const DEFAULT_LOCALE = 'en';
const NAMESPACES = ['common', 'home', 'pro', 'support', 'privacy'];

// Statisk import-kart (sikkert for bundleren)
const IMPORTS = {
  en: {
    common: () => import('../locales/en/common.json'),
    home: () => import('../locales/en/home.json'),
    pro: () => import('../locales/en/pro.json'),
    support: () => import('../locales/en/support.json'),
    privacy: () => import('../locales/en/privacy.json')
  },
  no: {
    common: () => import('../locales/no/common.json'),
    home: () => import('../locales/no/home.json'),
    pro: () => import('../locales/no/pro.json'),
    support: () => import('../locales/no/support.json'),
    privacy: () => import('../locales/no/privacy.json')
  },
  de: {
    common: () => import('../locales/de/common.json'),
    home: () => import('../locales/de/home.json'),
    pro: () => import('../locales/de/pro.json'),
    support: () => import('../locales/de/support.json'),
    privacy: () => import('../locales/de/privacy.json')
  },
  fr: {
    common: () => import('../locales/fr/common.json'),
    home: () => import('../locales/fr/home.json'),
    pro: () => import('../locales/fr/pro.json'),
    support: () => import('../locales/fr/support.json'),
    privacy: () => import('../locales/fr/privacy.json')
  },
  it: {
    common: () => import('../locales/it/common.json'),
    home: () => import('../locales/it/home.json'),
    pro: () => import('../locales/it/pro.json'),
    support: () => import('../locales/it/support.json'),
    privacy: () => import('../locales/it/privacy.json')
  },
  es: {
    common: () => import('../locales/es/common.json'),
    home: () => import('../locales/es/home.json'),
    pro: () => import('../locales/es/pro.json'),
    support: () => import('../locales/es/support.json'),
    privacy: () => import('../locales/es/privacy.json')
  },
  'pt-BR': {
    common: () => import('../locales/pt-BR/common.json'),
    home: () => import('../locales/pt-BR/home.json'),
    pro: () => import('../locales/pt-BR/pro.json'),
    support: () => import('../locales/pt-BR/support.json'),
    privacy: () => import('../locales/pt-BR/privacy.json')
  },
  'zh-CN': {
    common: () => import('../locales/zh-CN/common.json'),
    home: () => import('../locales/zh-CN/home.json'),
    pro: () => import('../locales/zh-CN/pro.json'),
    support: () => import('../locales/zh-CN/support.json'),
    privacy: () => import('../locales/zh-CN/privacy.json')
  },
  ja: {
    common: () => import('../locales/ja/common.json'),
    home: () => import('../locales/ja/home.json'),
    pro: () => import('../locales/ja/pro.json'),
    support: () => import('../locales/ja/support.json'),
    privacy: () => import('../locales/ja/privacy.json')
  }
};

function deepMerge(base, override) {
  if (Array.isArray(base) || Array.isArray(override)) return override ?? base;
  const out = {...base};
  for (const [k, v] of Object.entries(override || {})) {
    out[k] = v && typeof v === 'object' && !Array.isArray(v)
      ? deepMerge(base?.[k] ?? {}, v)
      : v;
  }
  return out;
}

async function loadNamespace(ns, locale) {
  const en = (await IMPORTS.en[ns]()).default;
  if (locale === DEFAULT_LOCALE) return en;

  try {
    const importer = IMPORTS[locale]?.[ns];
    if (!importer) return en;
    const override = (await importer()).default;
    return deepMerge(en, override);
  } catch {
    // Manglende fil → fallback til engelsk
    return en;
  }
}

export default getRequestConfig(async ({requestLocale}) => {
  // v4: requestLocale er awaitable ved statisk rendering
  const requested = await requestLocale;
  const locale = SUPPORTED_LOCALES.includes(requested) ? requested : DEFAULT_LOCALE;

  const messages = {};
  for (const ns of NAMESPACES) {
    messages[ns] = await loadNamespace(ns, locale);
  }

  return {
    locale,
    messages
  };
});
