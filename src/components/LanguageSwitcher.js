// components/LanguageSwitcher.js
'use client';

import React from 'react';
import {useLocale} from 'next-intl';
import {createNavigation} from 'next-intl/navigation';

// Alle språkene dere støtter
const locales = ['en', 'no', 'de', 'fr', 'it', 'es', 'pt-BR', 'zh-CN', 'ja'];

// Bruk next-intl sine locale-bevisste navigasjons-APIer
const {usePathname, useRouter} = createNavigation({
  locales,
  // 'as-needed' = ingen prefiks for defaultLocale (en), prefiks for andre
  localePrefix: 'as-needed'
});

// Mapping for visningsnavn/flagg
const LABELS = {
  en: {name: 'English', flag: 'EN'},
  no: {name: 'Norsk', flag: 'NO'},
  de: {name: 'Deutsch', flag: 'DE'},
  fr: {name: 'Français', flag: 'FR'},
  it: {name: 'Italiano', flag: 'IT'},
  es: {name: 'Español', flag: 'ES'},
  'pt-BR': {name: 'Português (BR)', flag: 'PT'},
  'zh-CN': {name: '简体中文', flag: 'ZH'},
  ja: {name: '日本語', flag: 'JA'}
};

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const current = useLocale();

  // Skjul velger hvis det kun finnes ett språk
  if (locales.length <= 1) {
    return (
      <span
        aria-label="Current language"
        className="inline-flex items-center rounded border px-2 py-1 text-xs opacity-70"
        title={LABELS[current]?.name || current.toUpperCase()}
      >
        {LABELS[current]?.flag || current.toUpperCase()}
      </span>
    );
  }

  const switchTo = (locale) => {
    // Husk brukerens valg (1 år)
    document.cookie = `NEXT_LOCALE=${locale}; Path=/; Max-Age=${60 * 60 * 24 * 365}`;
    // Bytt til samme path i valgt språk
    router.replace(pathname, {locale});
  };

  return (
    <div className="relative">
      <button
        className="inline-flex items-center gap-2 rounded border px-2 py-1 text-sm bg-white text-black"
        aria-haspopup="listbox"
        aria-label="Change language"
      >
        {LABELS[current]?.flag || current.toUpperCase()}
      </button>

      <ul
        className="absolute right-0 z-10 mt-2 min-w-[10rem] rounded border bg-white text-black p-1 shadow-lg"
        role="listbox"
      >
        {locales
          .filter((l) => l !== current)
          .map((l) => (
            <li key={l}>
              <button
                className="w-full rounded px-3 py-2 text-left text-sm hover:bg-gray-100"
                role="option"
                aria-selected={false}
                onClick={() => switchTo(l)}
              >
                {LABELS[l]?.flag || l.toUpperCase()} {LABELS[l]?.name ? `— ${LABELS[l].name}` : ''}
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
}
