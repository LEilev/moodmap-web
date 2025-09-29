// src/app/[locale]/layout.js
import {NextIntlClientProvider} from 'next-intl';
import {setRequestLocale, getMessages, hasLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';

const SUPPORTED_LOCALES = ['en', 'no', 'de', 'fr', 'it', 'es', 'pt-BR', 'zh-CN', 'ja'];

export function generateStaticParams() {
  // Bygg statisk for alle språk (eller delsett hvis ønsket).
  return SUPPORTED_LOCALES.map(locale => ({locale}));
}

export default async function LocaleLayout({children, params}) {
  // Next 15: params er awaitable i server-komponenter
  const {locale} = await params;

  if (!hasLocale(SUPPORTED_LOCALES, locale)) {
    notFound();
  }

  // Kritisk: gjør locale tilgjengelig for next-intl i hele request-træret
  // før hooks som useTranslations/getMessages kalles.
  setRequestLocale(locale); // :contentReference[oaicite:13]{index=13}

  // Hent meldinger via request-config (src/i18n/request.js)
  const messages = await getMessages();

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
