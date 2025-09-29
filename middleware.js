// middleware.js
import {NextResponse} from 'next/server';

const PUBLIC_FILE = /\.(.*)$/;
const SUPPORTED_LOCALES = ['en','no','de','fr','it','es','pt-BR','zh-CN','ja'];

export function middleware(request) {
  const {pathname} = request.nextUrl;

  // Bypass for statiske filer, API og kjøpsflyt (skal ikke røres)
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    PUBLIC_FILE.test(pathname) ||
    pathname.startsWith('/buy') ||
    pathname.startsWith('/go') ||
    pathname.startsWith('/thanks') ||   // ekstra sikring
    pathname.startsWith('/activate') || // ekstra sikring
    pathname.startsWith('/account')
  ) {
    return NextResponse.next();
  }

  // Root → alltid til /en (krav: redirect / til /en)
  if (pathname === '/' || pathname === '') {
    return NextResponse.redirect(new URL('/en', request.url));
  }

  // Mangler locale-prefiks → prepend 'en'
  const first = pathname.split('/')[1];
  if (!SUPPORTED_LOCALES.includes(first)) {
    return NextResponse.redirect(new URL(`/en${pathname}`, request.url));
  }

  return NextResponse.next();
}

// Matcher root og "alt", men unntar _next, api, kjøpsflyt og statiske filer
export const config = {
  matcher: ['/', '/((?!_next|api|buy|go|thanks|activate|account|.*\\..*).*)']
};
