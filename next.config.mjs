// next.config.mjs
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.js', {
  // Viktig for stabil oppførsel:
  localeDetection: false,   // ikke bruk cookie til å “autobytte” språk
  localePrefix: 'always'    // forvent alltid /{locale}/... i URL
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Build-tid redirect: / → /en
  async redirects() {
    return [
      {source: '/', destination: '/en', permanent: false}
    ];
  }
};

export default withNextIntl(nextConfig);
