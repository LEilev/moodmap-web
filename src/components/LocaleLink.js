// src/components/LocaleLink.js
import {createNavigation} from 'next-intl/navigation';

// Støttede språk i hele appen (hold denne listen i sync med request.js/layout/middleware)
const LOCALES = ['en', 'no', 'de', 'fr', 'it', 'es', 'pt-BR', 'zh-CN', 'ja'];

// Link fra next-intl som alltid håndterer locale-prefiks korrekt
// Viktig: localePrefix: 'always' (krav)
export const {Link} = createNavigation({
  locales: LOCALES,
  defaultLocale: 'en',
  localePrefix: 'always'
});

export default Link;
