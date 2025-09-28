// middleware.js
import {NextResponse} from 'next/server';

const PUBLIC_FILE = /\.(.*)$/;
const SUPPORTED_LOCALES = ['en','no','de','fr','it','es','pt-BR','zh-CN','ja'];

export function middleware(request) {
  const {pathname} = request.nextUrl;

  // Bypass for statiske filer, API og kjøpsflyt
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

  // Root → cookie eller 'en'
  if (pathname === '/' || pathname === '') {
    const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
    const locale = cookieLocale && SUPPORTED_LOCALES.includes(cookieLocale) ? cookieLocale : 'en';
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  // Mangler locale-prefiks → prepend 'en'
  const firstSegment = pathname.split('/')[1];
  if (!SUPPORTED_LOCALES.includes(firstSegment)) {
    return NextResponse.redirect(new URL(`/en${pathname}`, request.url));
  }

  return NextResponse.next();
}

// Matcher root og alt unntatt _next, statiske filer, api, og kjøpsflyt
export const config = {
  matcher: [
    '/',
    '/((?!_next|api|buy|go|thanks|activate|account|.*\\..*).*)'
  ]
};
