// components/Header.js
'use client';

import React from 'react';
import {useTranslations} from 'next-intl';
import Link from 'next-intl/link';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
  const t = useTranslations('common');

  return (
    <header className="w-full">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-extrabold tracking-tight">
          {t('brand')}
        </Link>

        <nav className="hidden gap-6 sm:flex">
          <Link href="/#about" className="hover:opacity-80">{t('nav.about')}</Link>
          <Link href="/#download" className="hover:opacity-80">{t('nav.download')}</Link>
          <Link href="/support" className="hover:opacity-80">{t('nav.support')}</Link>
          <Link href="/pro" className="font-semibold hover:opacity-80">{t('nav.pro')}</Link>
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
