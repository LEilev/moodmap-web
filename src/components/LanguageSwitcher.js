// src/components/LanguageSwitcher.js
'use client';

import React, {useEffect, useRef, useState} from 'react';
import {useLocale} from 'next-intl';
import {createNavigation} from 'next-intl/navigation';

const LOCALES = ['en', 'no', 'de', 'fr', 'it', 'es', 'pt-BR', 'zh-CN', 'ja'];
const DEFAULT_LOCALE = 'en';

// Vis navn + EMOJI-flag for hvert språk
const LABELS = {
  en:      {name: 'English',        flag: '🇬🇧'},
  no:      {name: 'Norsk',          flag: '🇳🇴'},
  de:      {name: 'Deutsch',        flag: '🇩🇪'},
  fr:      {name: 'Français',       flag: '🇫🇷'},
  it:      {name: 'Italiano',       flag: '🇮🇹'},
  es:      {name: 'Español',        flag: '🇪🇸'},
  'pt-BR': {name: 'Português (BR)', flag: '🇧🇷'},
  'zh-CN': {name: '简体中文',         flag: '🇨🇳'},
  ja:      {name: '日本語',           flag: '🇯🇵'}
};

// Hent router og pathname som forstår locale-prefiks
const {usePathname, useRouter} = createNavigation({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: 'always'
});

export default function LanguageSwitcher() {
  const current = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const popoverRef = useRef(null);

  // Lukk meny ved klikk utenfor
  useEffect(() => {
    const onDocClick = (e) => {
      if (!popoverRef.current) return;
      if (!popoverRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  // Bytt språk uten full reload: sett cookie (kun convenience) + client-side replace
  const switchTo = (locale) => {
    document.cookie = `NEXT_LOCALE=${locale}; Path=/; Max-Age=${60 * 60 * 24 * 365}`;
    router.replace(pathname, {locale});
    setOpen(false);
  };

  return (
    <div className="relative" ref={popoverRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Change language"
        title={LABELS[current]?.name || current}
        className="inline-flex items-center gap-2 rounded border border-black/10 bg-white/90 px-2 py-1 text-sm text-black shadow"
      >
        {/* Vis AKTIVT flagg (ikke hardkod 🇬🇧) */}
        <span aria-hidden="true">{LABELS[current]?.flag ?? '🏳️'}</span>
        <span className="sr-only">{LABELS[current]?.name ?? current}</span>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 z-20 mt-2 min-w-[12rem] rounded border border-black/10 bg-white p-1 text-black shadow-lg"
        >
          {LOCALES.map((l) => (
            <li key={l}>
              <button
                type="button"
                role="option"
                aria-selected={current === l}
                onClick={() => (current === l ? setOpen(false) : switchTo(l))}
                className={`w-full rounded px-3 py-2 text-left text-sm hover:bg-gray-100 ${current === l ? 'font-semibold' : ''}`}
                title={LABELS[l].name}
              >
                <span className="mr-2" aria-hidden="true">{LABELS[l].flag}</span>
                <span>{LABELS[l].name}</span>
                {current === l && <span className="ml-2" aria-hidden="true">✓</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
