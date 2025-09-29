// src/app/[locale]/layout.js
import {NextIntlClientProvider} from 'next-intl';
import {setRequestLocale, getMessages} from 'next-intl/server';

const SUPPORTED_LOCALES = [
  'en',
  'no',
  'de',
  'fr',
  'it',
  'es',
  'pt-BR',
  'zh-CN',
  'ja'
];

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({locale}));
}

export default async function LocaleLayout({children, params}) {
  const {locale} = await params;

  // Hvis noen prøver et språk som ikke støttes → fall tilbake til engelsk
  const activeLocale = SUPPORTED_LOCALES.includes(locale) ? locale : 'en';

  // Kritisk: gjør locale tilgjengelig for hele request-træret
  setRequestLocale(activeLocale);

  // Hent meldinger for valgt språk (inkl. fallback til engelsk der nødvendig)
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
