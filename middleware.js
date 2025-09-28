// middleware.js – Handles default locale redirection and locale prefixes
import { NextResponse } from 'next/server';

const PUBLIC_FILE = /\.(.*)$/;
const SUPPORTED_LOCALES = ['en', 'no', 'de', 'fr', 'it', 'es', 'pt-BR', 'zh-CN', 'ja'];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Ignore requests for static files, API routes, and non-localized pages (purchase flow)
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    PUBLIC_FILE.test(pathname) ||
    pathname.startsWith('/buy') ||
    pathname.startsWith('/go') ||
    pathname.startsWith('/thanks') ||
    pathname.startsWith('/activate') ||
    pathname.startsWith('/account')
  ) {
    return NextResponse.next();
  }

  // Redirect root ("/") to default or saved locale
  if (pathname === '/' || pathname === '') {
    // Use locale from cookie if available, otherwise fallback to English
    const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
    const locale = cookieLocale && SUPPORTED_LOCALES.includes(cookieLocale) ? cookieLocale : 'en';
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  // If path has no supported locale prefix, prepend "en" as default
  const firstSegment = pathname.split('/')[1];
  if (!SUPPORTED_LOCALES.includes(firstSegment)) {
    return NextResponse.redirect(new URL(`/en${pathname}`, request.url));
  }

  // If a valid locale prefix is present, continue as normal
  return NextResponse.next();
}
