'use client';

// src/components/LocaleLink.js
import {createNavigation} from 'next-intl/navigation';

// Ett sted å definere alle språk og prefix-policy
const {Link} = createNavigation({
  locales: ['en', 'no', 'de', 'fr', 'it', 'es', 'pt-BR', 'zh-CN', 'ja'],
  defaultLocale: 'en',
  localePrefix: 'as-needed'
});


// Eksporter en ferdig klient-side Link som kan brukes i server components
export default Link;
