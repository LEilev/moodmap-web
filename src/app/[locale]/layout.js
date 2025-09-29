// src/app/[locale]/layout.js
import {NextIntlClientProvider} from 'next-intl';
import {setRequestLocale, getMessages} from 'next-intl/server';

const SUPPORTED_LOCALES = ['en', 'no', 'de', 'fr', 'it', 'es', 'pt-BR', 'zh-CN', 'ja'];

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({locale}));
}

export default async function LocaleLayout({children, params}) {
  const {locale} = await params;

  // Path-locale er fasit; valider og sett request-locale tidlig
  const activeLocale = SUPPORTED_LOCALES.includes(locale) ? locale : 'en';
  setRequestLocale(activeLocale); // må kalles før getMessages/useTranslations :contentReference[oaicite:12]{index=12}

  const messages = await getMessages();

  return (
    <html lang={activeLocale}>
      <body>
        <NextIntlClientProvider locale={activeLocale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
