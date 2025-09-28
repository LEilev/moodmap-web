import React from 'react';
import { NextIntlClientProvider } from 'next-intl';
import Header from '../../components/Header';
import { hasLocale, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

export const dynamic = 'force-static';

export function generateStaticParams() {
  // Generate static pages for all locales
  return ['en', 'no', 'de', 'fr', 'it', 'es', 'pt-BR', 'zh-CN', 'ja'].map((locale) => ({ locale }));
}

async function loadMessages(locale) {
  // Load all translation namespaces for the current locale
  const common = (await import(`../../locales/${locale}/common.json`)).default;
  const home = (await import(`../../locales/${locale}/home.json`)).default;
  const pro = (await import(`../../locales/${locale}/pro.json`)).default;
  const support = (await import(`../../locales/${locale}/support.json`)).default;
  const privacy = (await import(`../../locales/${locale}/privacy.json`)).default;
  return { common, home, pro, support, privacy };
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = params;

  // Validate locale and enable static rendering for it
  if (!hasLocale(['en', 'no', 'de', 'fr', 'it', 'es', 'pt-BR', 'zh-CN', 'ja'], locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const messages = await loadMessages(locale);

  return (
    <html lang={locale} className="h-full scroll-smooth" suppressHydrationWarning>
      <body className="flex flex-col min-h-full bg-primary-blue text-white">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
