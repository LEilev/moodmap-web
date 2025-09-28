// src/app/[locale]/layout.js
import React from 'react';
import {NextIntlClientProvider} from 'next-intl';
import {setRequestLocale, getMessages} from 'next-intl/server';
import Header from '@/components/Header';

export const dynamic = 'force-static';

export async function generateStaticParams() {
  return [
    { locale: 'en' }, { locale: 'no' }, { locale: 'de' }, { locale: 'fr' },
    { locale: 'it' }, { locale: 'es' }, { locale: 'pt-BR' }, { locale: 'zh-CN' }, { locale: 'ja' }
  ];
}

export default async function LocaleLayout({children, params}) {
  const {locale} = await params; // Next 15: params er asynkrone
  setRequestLocale(locale);      // Gjør locale tilgjengelig i all server-kode

  // Hent meldinger fra i18n/request.js
  const messages = await getMessages();

  // NB: Ikke <html>/<body> her – det ligger i root layout
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Header />
      {children}
    </NextIntlClientProvider>
  );
}
