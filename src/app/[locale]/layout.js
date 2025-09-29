// src/app/[locale]/layout.js
import React from 'react';
import {NextIntlClientProvider} from 'next-intl';
import {setRequestLocale, getMessages} from 'next-intl/server';
import Header from '@/components/Header';

export const dynamic = 'force-static';

const SUPPORTED_LOCALES = ['en', 'no', 'de', 'fr', 'it', 'es', 'pt-BR', 'zh-CN', 'ja'];

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({locale}));
}

// Next 15: params er asynkrone
export default async function LocaleLayout({children, params}) {
  const {locale} = await params;
  setRequestLocale(locale);              // gjør path-locale til "source of truth"
  const messages = await getMessages();  // henter fra i18n/request.js (inkl. fallback)

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Header />
      {children}
    </NextIntlClientProvider>
  );
}
