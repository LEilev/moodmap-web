// next.config.mjs
import createNextIntlPlugin from 'next-intl/plugin';

// Pek på i18n request-configen (JS)
const withNextIntl = createNextIntlPlugin('./src/i18n/request.js');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true
  // Legg til annen prosjektspesifikk config her ved behov
};

export default withNextIntl(nextConfig);
