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
    <html lang="en" className="h-full">
      <body className="flex flex-col min-h-full bg-primary-blue text-white">
        <header className="bg-primary-blue">
          <div className="max-w-6xl mx-auto flex items-center justify-between py-4 px-6">
            <Link href="/" className="flex items-center text-2xl font-bold text-white">
              MoodMap
              <Image
                src="/icon.png"
                alt="MoodMap logo"
                width={28}
                height={28}
                className="ml-2"
              />
            </Link>
            <nav className="flex gap-6">
              <Link href="#about" className="text-white hover:underline">About</Link>
              <Link href="#download" className="text-white hover:underline">Download</Link>
              <Link href="#contact" className="text-white hover:underline">Contact</Link>
            </nav>
          </div>
        </header>
        <main className="flex-grow">{children}</main>
      </body>
    </html>
  );
}