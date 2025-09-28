// src/i18n/request.js
import {getRequestConfig} from 'next-intl/server';

const SUPPORTED_LOCALES = ['en', 'no', 'de', 'fr', 'it', 'es', 'pt-BR', 'zh-CN', 'ja'];
const DEFAULT_LOCALE = 'en';

export default getRequestConfig(async ({requestLocale}) => {
  const locale = SUPPORTED_LOCALES.includes(requestLocale) ? requestLocale : DEFAULT_LOCALE;

  // NB: Her brukes relative stier fra src/i18n → ../locales/
  const [common, home, pro, support, privacy] = await Promise.all([
    import(`../locales/${locale}/common.json`).then((m) => m.default),
    import(`../locales/${locale}/home.json`).then((m) => m.default),
    import(`../locales/${locale}/pro.json`).then((m) => m.default),
    import(`../locales/${locale}/support.json`).then((m) => m.default),
    import(`../locales/${locale}/privacy.json`).then((m) => m.default)
  ]);

  return {
    locale,
    messages: {common, home, pro, support, privacy}
  };
});
