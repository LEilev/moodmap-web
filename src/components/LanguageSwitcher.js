'use client';

import React from 'react';
import {useLocale} from 'next-intl';
import {createNavigation} from 'next-intl/navigation';

// All supported locales
const locales = ['en', 'no', 'de', 'fr', 'it', 'es', 'pt-BR', 'zh-CN', 'ja'];

// Use next-intl’s locale-aware navigation APIs
const {usePathname, useRouter} = createNavigation({
  locales,
  localePrefix: 'as-needed'  // Default locale without prefix, others with prefix
});

// Display labels (flag icons and language names)
const LABELS = {
  en: {name: 'English', flag: '/flags/en.svg'},
  no: {name: 'Norsk', flag: '/flags/no.svg'},
  de: {name: 'Deutsch', flag: '/flags/de.svg'},
  fr: {name: 'Français', flag: '/flags/fr.svg'},
  it: {name: 'Italiano', flag: '/flags/it.svg'},
  es: {name: 'Español', flag: '/flags/es.svg'},
  'pt-BR': {name: 'Português (Brasil)', flag: '/flags/pt-BR.svg'},
  'zh-CN': {name: '中文 (简体)', flag: '/flags/zh-CN.svg'},
  ja: {name: '日本語', flag: '/flags/ja.svg'}
};

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const current = useLocale();

  // Hide switcher if only one locale is available
  if (locales.length <= 1) {
    return (
      <span
        aria-label="Current language"
        className="inline-flex items-center rounded border px-2 py-1 text-xs opacity-70"
        title={LABELS[current]?.name || current.toUpperCase()}
      >
        {LABELS[current]?.flag ? (
          <img 
            src={LABELS[current].flag}
            alt={LABELS[current]?.name || current.toUpperCase()}
            className="h-4 w-4 inline-block align-text-bottom"
          />
        ) : (
          current.toUpperCase()
        )}
      </span>
    );
  }

  const switchTo = (locale) => {
    // Remember user’s choice for 1 year
    document.cookie = `NEXT_LOCALE=${locale}; Path=/; Max-Age=${60 * 60 * 24 * 365}`;
    // Navigate to the same pathname in the selected locale
    router.replace(pathname, {locale});
  };

  return (
    <div className="relative">
      <button
        className="inline-flex items-center gap-2 rounded border px-2 py-1 text-sm"
        aria-haspopup="listbox"
        aria-label="Change language"
      >
        {LABELS[current]?.flag ? (
          <img 
            src={LABELS[current].flag}
            alt={LABELS[current]?.name || current.toUpperCase()}
            className="h-4 w-4 inline-block align-text-bottom"
          />
        ) : (
          current.toUpperCase()
        )}
      </button>

      <ul
        className="absolute right-0 z-10 mt-2 min-w-[8rem] rounded border bg-white p-1 shadow-lg"
        role="listbox"
      >
        {locales.filter((l) => l !== current).map((l) => (
          <li key={l}>
            <button
              className="w-full rounded px-3 py-2 text-left text-sm hover:bg-gray-100"
              role="option"
              aria-selected={false}
              onClick={() => switchTo(l)}
            >
              {LABELS[l]?.flag ? (
                <img 
                  src={LABELS[l].flag}
                  alt={LABELS[l]?.name || l.toUpperCase()}
                  className="h-4 w-4 inline-block align-text-bottom mr-1"
                />
              ) : (
                <span className="uppercase mr-1">{l}</span>
              )}
              {LABELS[l]?.name ? `— ${LABELS[l].name}` : ''}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
