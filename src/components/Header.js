'use client';

// src/components/Header.js
import React from 'react';
import {useTranslations} from 'next-intl';
import {createNavigation} from 'next-intl/navigation';
import LanguageSwitcher from './LanguageSwitcher';

// Locale-bevisst Link (erstatter next-intl/link)
const {Link} = createNavigation({
  locales: ['en', 'no', 'de', 'fr', 'it', 'es', 'pt-BR', 'zh-CN', 'ja'],
  localePrefix: 'as-needed' // ingen prefix for default (en), prefix for øvrige
});

export default function Header() {
  const t = useTranslations('common');

  return (
    <header className="w-full">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-extrabold tracking-tight">
          {t('brand')}
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden sm:flex gap-6">
          <Link href="/#about" className="hover:opacity-80">{t('nav.about')}</Link>
          <Link href="/#download" className="hover:opacity-80">{t('nav.download')}</Link>
          <Link href="/support" className="hover:opacity-80">{t('nav.support')}</Link>
          <Link href="/pro" className="font-semibold hover:opacity-80">{t('nav.pro')}</Link>
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
        </div>
      </div>

      {/* Mobile navigation */}
      <nav className="sm:hidden px-4 pb-3 flex flex-col gap-2 text-[0.95rem]">
        <Link href="/#about" className="hover:opacity-80">{t('nav.about')}</Link>
        <Link href="/#download" className="hover:opacity-80">{t('nav.download')}</Link>
        <Link href="/support" className="hover:opacity-80">{t('nav.support')}</Link>
        <Link href="/pro" className="font-semibold hover:opacity-80">{t('nav.pro')}</Link>
      </nav>
    </header>
  );
}
