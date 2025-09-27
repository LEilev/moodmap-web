// next.config.mjs
import createNextIntlPlugin from 'next-intl/plugin';

// peker til config for locales (du lager denne filen under src/i18n/request.js)
const withNextIntl = createNextIntlPlugin('./src/i18n/request.js');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true
};

export default withNextIntl(nextConfig);
