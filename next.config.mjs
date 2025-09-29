// next.config.mjs
import createNextIntlPlugin from 'next-intl/plugin';

// Pek på JS-konfigen vår
const withNextIntl = createNextIntlPlugin('./src/i18n/request.js');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Unngå at Vercel-build krever at eslint er installert
  eslint: { ignoreDuringBuilds: true }
};

export default withNextIntl(nextConfig);
