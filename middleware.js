// src/middleware.js
import createMiddleware from 'next-intl/middleware';
import {locales, defaultLocale, localePrefix} from './i18n.js';

export default createMiddleware({
  defaultLocale,
  locales,
  localePrefix
});

export const config = {
  matcher: [
    // Ikke prefiks følgende paths:
    '/((?!_next|.*\\..*|api|buy|checkout|activate|thanks|promokit|affiliate|webhooks|stripe).*)'
  ]
};
