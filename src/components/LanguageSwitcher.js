'use client';

import {useEffect, useMemo, useState} from 'react';
import {useLocale} from 'next-intl';
import {createNavigation} from 'next-intl/navigation';

// --- Routing config for the navigation wrappers (must mirror your real config)
const SUPPORTED_LOCALES = ['en', 'no', 'de', 'fr', 'it', 'es', 'pt-BR', 'zh-CN', 'ja'];
const DEFAULT_LOCALE = 'en';
const routing = {
  locales: SUPPORTED_LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: 'always'
};

const {usePathname, useRouter} = createNavigation(routing);

// Human labels + region code (for flags) per locale
const LOCALE_META = {
  en: {label: 'English', region: 'GB'}, // choose GB or US; dere har brukt 🇬🇧 tidligere
  no: {label: 'Norsk', region: 'NO'},
  de: {label: 'Deutsch', region: 'DE'},
  fr: {label: 'Français', region: 'FR'},
  it: {label: 'Italiano', region: 'IT'},
  es: {label: 'Español', region: 'ES'},
  'pt-BR': {label: 'Português (Brasil)', region: 'BR'},
  'zh-CN': {label: '简体中文', region: 'CN'},
  ja: {label: '日本語', region: 'JP'}
};

// Convert ISO region (e.g. 'DE') -> Unicode flag emoji
function regionToEmoji(region) {
  const A = 0x1f1e6; // Regional Indicator Symbol Letter A
  return String.fromCodePoint(...region.toUpperCase().split('').map(c => A + (c.charCodeAt(0) - 65)));
}

// Twemoji asset path for given region
function twemojiUrlForRegion(region) {
  // Compute codepoints for regional indicators, e.g. GB => 1f1ec-1f1e7.svg
  const A = 0x1f1e6;
  const cps = region.toUpperCase().split('').map(c => (A + (c.charCodeAt(0) - 65)).toString(16));
  return `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/${cps.join('-')}.svg`;
}

// Best-effort detection: Windows mangler flagg-emoji i systemfont.
// Vi faller tilbake til Twemoji-SVG hvis UA ser ut som Windows eller hvis en enkel canvas-test tyder på tekstlig fallback.
function detectFlagEmojiSupport() {
  if (typeof navigator !== 'undefined' && /Windows/i.test(navigator.userAgent)) {
    return false;
  }
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 12;
    canvas.height = 12;
    const ctx = canvas.getContext('2d');
    if (!ctx) return true;
    ctx.font = '12px sans-serif';
    ctx.fillText('🇺🇸', 0, 10);
    const data = ctx.getImageData(0, 0, 12, 12).data;
    // Søk etter en ikke-grå piksel -> sannsynligvis et farget flagg
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
      if (a !== 0 && (r !== g || r !== b)) return true;
    }
    return false;
  } catch {
    return true;
  }
}

export default function LanguageSwitcher() {
  const active = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [supportsEmoji, setSupportsEmoji] = useState(true);

  useEffect(() => {
    setSupportsEmoji(detectFlagEmojiSupport());
  }, []);

  const allOptions = useMemo(
    () => SUPPORTED_LOCALES.map(locale => ({locale, ...LOCALE_META[locale]})),
    []
  );

  const currentMeta = LOCALE_META[active] ?? LOCALE_META[DEFAULT_LOCALE];
  const currentFlag = supportsEmoji
    ? regionToEmoji(currentMeta.region)
    : null;
  const currentFlagImg = !supportsEmoji ? twemojiUrlForRegion(currentMeta.region) : null;

  function onSelect(nextLocale) {
    // Ikke filtrer bort English – alltid med i listen.
    // Bytt locale via next-intl-router; dette trigger ny RSC-payload og riktige meldinger.
    router.replace(pathname, {locale: nextLocale});
    setOpen(false);
  }

  return (
    <div className="locale-switcher" data-locale={active}>
      <button
        type="button"
        className="locale-button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
        title={currentMeta.label}
      >
        <span
          className="flag"
          aria-hidden="true"
          style={{
            fontFamily:
              // Prøv fargerike emoji‑fonter først; på Windows faller vi uansett til Twemoji-SVG
              'Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, Twemoji Mozilla, emoji'
          }}
        >
          {supportsEmoji ? currentFlag : (
            <img
              src={currentFlagImg}
              alt={currentMeta.label}
              width={18}
              height={18}
              style={{verticalAlign: '-0.15em'}}
              loading="lazy"
            />
          )}
        </span>
        <span className="label">{currentMeta.label}</span>
        <span className="caret" aria-hidden>▾</span>
      </button>

      {open && (
        <ul className="menu" role="listbox" aria-label="Choose language">
          {allOptions.map(({locale, label, region}) => {
            const isActive = locale === active;
            const flagEmoji = supportsEmoji ? regionToEmoji(region) : null;
            const flagImg = !supportsEmoji ? twemojiUrlForRegion(region) : null;
            return (
              <li key={locale}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  className={`menu-item${isActive ? ' is-active' : ''}`}
                  onClick={() => onSelect(locale)}
                >
                  <span className="flag" aria-hidden="true" style={{marginRight: 8}}>
                    {supportsEmoji ? flagEmoji : (
                      <img
                        src={flagImg}
                        alt={label}
                        width={18}
                        height={18}
                        style={{verticalAlign: '-0.15em'}}
                        loading="lazy"
                      />
                    )}
                  </span>
                  <span className="menu-label">{label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <style jsx>{`
        .locale-switcher { position: relative; }
        .locale-button {
          display: inline-flex; align-items: center; gap: .5rem;
          padding: .375rem .5rem; border: 1px solid var(--border, #e5e7eb);
          border-radius: .5rem; background: var(--bg, white); cursor: pointer;
        }
        .flag { display: inline-flex; align-items: center; }
        .label { white-space: nowrap; }
        .menu {
          position: absolute; top: calc(100% + .25rem); right: 0;
          background: var(--bg, white); border: 1px solid var(--border, #e5e7eb);
          border-radius: .5rem; min-width: 12rem; padding: .25rem; z-index: 50;
          box-shadow: 0 10px 20px rgba(0,0,0,.08);
        }
        .menu-item {
          display: flex; align-items: center; width: 100%;
          padding: .375rem .5rem; background: transparent; border: 0; cursor: pointer;
        }
        .menu-item:hover { background: rgba(0,0,0,.04); }
        .menu-item.is-active { font-weight: 600; }
        .caret { opacity: .6; }
      `}</style>
    </div>
  );
}
