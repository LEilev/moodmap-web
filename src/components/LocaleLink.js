// src/components/LocaleLink.js
import {createNavigation} from 'next-intl/navigation';

export const LOCALES = ['en', 'no', 'de', 'fr', 'it', 'es', 'pt-BR', 'zh-CN', 'ja'];
export const DEFAULT_LOCALE = 'en';

export const {Link} = createNavigation({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: 'always'
});

export default Link;
