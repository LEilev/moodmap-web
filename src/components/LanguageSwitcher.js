'use client';

import {useState, useRef, useEffect, useMemo} from 'react';
import {useLocale} from 'next-intl';
import {createNavigation} from 'next-intl/navigation';

// Må speile støttede språk i appen
const LOCALES = ['en', 'no', 'de', 'fr', 'it', 'es', 'pt-BR', 'zh-CN', 'ja'];
const DEFAULT_LOCALE = 'en';

const routing = {
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: 'always'
};

const {usePathname, useRouter} = createNavigation(routing);

// Språknavn + regionkode for flagg (Twemoji)
const META = {
  en:      {label: 'English',          region: 'GB'}, // behold GB-flagget som tidligere
  no:      {label: 'Norsk',            region: 'NO'},
  de:      {label: 'Deutsch',          region: 'DE'},
  fr:      {label: 'Français',         region: 'FR'},
  it:      {label: 'Italiano',         region: 'IT'},
  es:      {label: 'Español',          region: 'ES'},
  'pt-BR': {label: 'Português (BR)',   region: 'BR'},
  'zh-CN': {label: '简体中文',           region: 'CN'},
  ja:      {label: '日本語',             region: 'JP'}
};

// Twemoji SVG for “regional indicator” par (GB => 1f1ec-1f1e7)
function twemojiUrl(region) {
  const A = 0x1f1e6;
  const cps = region.toUpperCase().split('').map(c => (A + (c.charCodeAt(0) - 65)).toString(16));
  return `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/${cps.join('-')}.svg`;
}

export default function LanguageSwitcher() {
  const active = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const options = useMemo(() => LOCALES.map(l => ({locale: l, ...META[l]})), []);

  useEffect(() => {
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const current = META[active] ?? META[DEFAULT_LOCALE];

  function switchTo(nextLocale) {
    // (valgfritt) sett cookie kun for convenience – path er source of truth
    document.cookie = `NEXT_LOCALE=${nextLocale}; Path=/; Max-Age=${60*60*24*365}`;
    router.replace(pathname, {locale: nextLocale}); // anbefalt av next-intl
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        title={current.label}
        className="inline-flex items-center gap-2 rounded border border-black/10 bg-white/90 px-2 py-1 text-sm shadow"
        onClick={() => setOpen(v => !v)}
      >
        <img
          src={twemojiUrl(current.region)}
          alt={current.label}
          width={18}
          height={18}
          style={{verticalAlign: '-0.15em'}}
          loading="lazy"
        />
        <span className="whitespace-nowrap">{current.label}</span>
        <span aria-hidden="true">▾</span>
      </button>

      {open && (
        <ul role="listbox"
            className="absolute right-0 z-50 mt-2 min-w-[12rem] rounded border border-black/10 bg-white p-1 text-sm shadow-lg">
          {options.map(({locale, label, region}) => {
            const isActive = locale === active;
            return (
              <li key={locale}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  onClick={() => switchTo(locale)}
                  className={`flex w-full items-center gap-2 rounded px-3 py-2 text-left hover:bg-gray-100 ${isActive ? 'font-semibold' : ''}`}
                  title={label}
                >
                  <img
                    src={twemojiUrl(region)}
                    alt=""
                    width={18}
                    height={18}
                    style={{verticalAlign: '-0.15em'}}
                    loading="lazy"
                  />
                  <span>{label}</span>
                  {isActive && <span className="ml-1" aria-hidden="true">✓</span>}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
