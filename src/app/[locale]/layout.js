// app/[locale]/layout.js
import React from 'react';
import {NextIntlClientProvider} from 'next-intl';

// Hvis dere har globale styles, behold importene (f.eks. './globals.css')
// import './globals.css';

export const dynamic = 'force-static';

export async function generateStaticParams() {
  // I denne runden kun 'en'
  return [{locale: 'en'}];
}

async function loadMessages(locale) {
  // Slå sammen namespaces til ett messages-objekt
  // NB: Behold fil-/mappenavnene slik de ligger i /locales/en/*
  const common = (await import(`../../locales/${locale}/common.json`)).default;
  const home = (await import(`../../locales/${locale}/home.json`)).default;
  const pro = (await import(`../../locales/${locale}/pro.json`)).default;
  const support = (await import(`../../locales/${locale}/support.json`)).default;
  const privacy = (await import(`../../locales/${locale}/privacy.json`)).default;

  return {common, home, pro, support, privacy};
}

export default async function LocaleLayout({children, params}) {
  const {locale} = params;
  const messages = await loadMessages(locale);

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
