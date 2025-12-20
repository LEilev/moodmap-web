// src/components/MobileMenu.js
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/#about", label: "About" },
  { href: "/#download", label: "Download" },
  { href: "/support", label: "Support" },
  { href: "/pro", label: "Pro" },
  // Partner intentionally not in primary nav (premium positioning)
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="sm:hidden inline-flex items-center justify-center rounded-full p-2
                   ring-1 ring-white/15 bg-white/5 hover:bg-white/10 transition"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5 text-white/90" />
      </button>

      {open && (
        <div className="sm:hidden fixed inset-0 z-[9999]">
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Panel */}
          <div
            className="relative mx-auto mt-4 w-[calc(100%-2rem)] max-w-sm overflow-hidden rounded-2xl
                       bg-white/10 ring-1 ring-white/15 backdrop-blur-xl
                       shadow-[0_30px_80px_rgba(0,0,0,0.55)]"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <div className="text-sm font-semibold text-white/90">Menu</div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center rounded-full p-2
                           ring-1 ring-white/15 bg-white/5 hover:bg-white/10 transition"
                aria-label="Close menu"
              >
                <X className="h-5 w-5 text-white/90" />
              </button>
            </div>

            <nav className="px-4 py-3">
              <ul className="space-y-1">
                {NAV_LINKS.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-xl px-3 py-3 text-base font-semibold text-white/90
                                 hover:bg-white/10 transition"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
