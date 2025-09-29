// src/components/LanguageSwitcher.jsx
'use client';

import * as React from 'react';
import Image from 'next/image';
import {useSearchParams} from 'next/navigation';
import {createSharedPathnamesNavigation} from 'next-intl/navigation';
import {locales, localePrefix} from '../i18n.js';
import {useLocale} from 'next-intl';

const {useRouter, usePathname} = createSharedPathnamesNavigation({
  locales,
  localePrefix
});

const LABELS = {
  'en':   {name: 'English',        flag: '/flags/gb.svg'},
  'no':   {name: 'Norsk',          flag: '/flags/no.svg'},
  'de':   {name: 'Deutsch',        flag: '/flags/de.svg'},
  'fr':   {name: 'Français',       flag: '/flags/fr.svg'},
  'it':   {name: 'Italiano',       flag: '/flags/it.svg'},
  'es':   {name: 'Español',        flag: '/flags/es.svg'},
  'pt-BR':{name: 'Português (BR)', flag: '/flags/br.svg'},
  'zh-CN':{name: '简体中文',        flag: '/flags/cn.svg'},
  'ja':   {name: '日本語',          flag: '/flags/jp.svg'}
};

export default function LanguageSwitcher({current: currentProp}) {
  // Fungerer både med og uten 'current' prop (bakoverkompatibelt)
  const localeFromHook = useLocale();
  const current = currentProp || localeFromHook;

  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function onSelect(nextLocale) {
    setOpen(false);
    if (nextLocale === current) return;

    const search = searchParams.toString();
    const target = search ? `${pathname}?${search}` : pathname;

    // Bevar path + query, bytt kun locale
    router.replace(target, {locale: nextLocale});
  }

  return (
    <div className="relative">
      <button
        aria-label="Change language"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-md border px-2 py-1"
      >
        <Image
          src={LABELS[current]?.flag || '/flags/gb.svg'}
          alt={`${LABELS[current]?.name || 'English'} flag`}
          width={18}
          height={12}
          priority
        />
        <span className="sr-only">{LABELS[current]?.name || 'English'}</span>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 z-50 mt-2 min-w-40 rounded-md border bg-white p-2 shadow-lg"
        >
          {locales.map((lng) => (
            <li key={lng} role="option" aria-selected={lng === current}>
              <button
                onClick={() => onSelect(lng)}
                className="flex w-full items-center gap-2 rounded px-2 py-1 text-left hover:bg-gray-50 disabled:cursor-default disabled:opacity-60"
                disabled={lng === current}
                aria-current={lng === current ? 'true' : undefined}
              >
                <Image src={LABELS[lng].flag} alt="" width={18} height={12} />
                <span>{LABELS[lng].name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
