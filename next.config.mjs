// next.config.mjs
import createNextIntlPlugin from 'next-intl/plugin';

// Knytter next-intl til vår request-config
const withNextIntl = createNextIntlPlugin('./src/i18n/request.js');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Bygg‑tid redirect av "/" → "/en" (ikke bare runtime via middleware)
  async redirects() {
    return [
      {
        source: '/',
        destination: '/en',
        permanent: false
      }
    ];
  },

  // Krav: slå av automatisk locale-detection
  // (merk: vi bruker egen middleware/lenker for locale)
  localeDetection: false
};

export default withNextIntl(nextConfig);
