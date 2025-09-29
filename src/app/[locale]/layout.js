// src/app/[locale]/layout.js
import React from 'react';
import {NextIntlClientProvider} from 'next-intl';
import {setRequestLocale, getMessages} from 'next-intl/server';
import Header from '@/components/Header';

// Viktig for static generation i App Router
export const dynamic = 'force-static';

// Samme språk-liste som i request.js / komponentene
const SUPPORTED_LOCALES = ['en', 'no', 'de', 'fr', 'it', 'es', 'pt-BR', 'zh-CN', 'ja'];

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({locale}));
}

// NB: I Next 15 er params asynkrone
export default async function LocaleLayout({children, params}) {
  const {locale} = await params;
  setRequestLocale(locale);              // gjør locale tilgjengelig i server-komponenter
  const messages = await getMessages();  // henter meldinger fra i18n/request.js

  // Ikke <html>/<body> her – det ligger i root layout
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Header />
      {children}
    </NextIntlClientProvider>
  );
}
