// next.config.mjs
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Viktig: Kun EN i første omgang. Default locale er 'en'.
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
    localeDetection: true // gjør at NEXT_LOCALE-cookie respekteres
  },

  // Behold øvrig konfig uendret her hvis dere har det i repoet
  reactStrictMode: true
};

export default withNextIntl(nextConfig);
