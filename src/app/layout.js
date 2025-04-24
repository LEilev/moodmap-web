import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "MoodMap",
  description: "Understand the cycle. Survive the chaos.",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-[#1E3A8A] text-white`}
      >
        {/* Global Header */}
        <header className="p-6 flex justify-between items-center">
          <h1 className="text-4xl font-extrabold text-white">MoodMap</h1>
          <nav className="space-x-6 text-sm font-medium">
            <a href="#about" className="hover:underline">About</a>
            <a href="#download" className="hover:underline">Download</a>
            <a href="#contact" className="hover:underline">Contact</a>
          </nav>
        </header>

        {/* Main Content */}
        {children}

        {/* Global Footer */}
        <footer className="bg-[#121212] py-6 text-center text-sm text-gray-300 mt-10">
          <p>Contact us: Moodmap.tech@gmail.com</p>
          <p className="mt-1">
            <a href="/privacy-policy.html" className="underline hover:text-gray-100">
              Privacy Policy
            </a>
          </p>
          <p className="mt-1">
            © {new Date().getFullYear()} MoodMap. All rights reserved.
          </p>
        </footer>
      </body>
    </html>
  );
}