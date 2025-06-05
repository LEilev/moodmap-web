// src/app/layout.js
import './globals.css';
import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'MoodMap',
  description: 'Understand the cycle. Survive the chaos.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="flex flex-col min-h-full bg-primary-blue text-white">
        <header className="bg-primary-blue">
          <div className="max-w-6xl mx-auto flex items-center justify-between py-4 px-6">
            <Link href="/" className="flex items-center text-2xl font-bold">
              MoodMap
              <Image src="/icon.png" alt="MoodMap logo" width={28} height={28} className="ml-2" priority />
            </Link>
            {/* Desktop nav */}
            <nav className="hidden sm:flex gap-6">
              <Link href="#about"     className="hover:underline">About</Link>
              <Link href="#download"  className="hover:underline">Download</Link>
              {/* Updated: Contact → Support */}
              <Link href="/support"    className="hover:underline">Support</Link>
            </nav>
          </div>
          {/* Mobile nav – reuse utility class */}
          <nav className="sm:hidden px-6">
            <Link href="#about"     className="nav-link-mobile">About</Link>
            <Link href="#download"  className="nav-link-mobile">Download</Link>
            {/* Updated: Contact → Support */}
            <Link href="/support"   className="nav-link-mobile">Support</Link>
          </nav>
        </header>

        <main className="flex-grow">{children}</main>
      </body>
    </html>
  );
}
