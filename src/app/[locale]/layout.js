// src/app/[locale]/layout.js
import React from 'react';
import {NextIntlClientProvider} from 'next-intl';
import Header from '../../components/Header';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return [
    {locale: 'en'},
    {locale: 'no'},
    {locale: 'de'},
    {locale: 'fr'},
    {locale: 'it'},
    {locale: 'es'},
    {locale: 'pt-BR'},
    {locale: 'zh-CN'},
    {locale: 'ja'}
  ];
}

async function loadMessages(locale) {
  // NB: /locales ligger på prosjektroten. Fra src/app/[locale] er det tre nivåer opp.
  const common  = (await import(`../../../locales/${locale}/common.json`)).default;
  const home    = (await import(`../../../locales/${locale}/home.json`)).default;
  const pro     = (await import(`../../../locales/${locale}/pro.json`)).default;
  const support = (await import(`../../../locales/${locale}/support.json`)).default;
  const privacy = (await import(`../../../locales/${locale}/privacy.json`)).default;
  return {common, home, pro, support, privacy};
}

export default async function LocaleLayout({children, params: {locale}}) {
  const messages = await loadMessages(locale);

  return (
    <html lang={locale} className="h-full scroll-smooth" suppressHydrationWarning>
      <body className="min-h-full bg-primary-blue text-white">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
