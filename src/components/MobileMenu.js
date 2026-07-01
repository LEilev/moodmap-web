"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const LINKS = [
  { href: "/#product", label: "Product" },
  { href: "/#download", label: "Download" },
  { href: "/learn", label: "Guides" },
  { href: "/support", label: "Support" },
  { href: "/pro", label: "Premium+" },
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="mm-mobile-menu-button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div
            className="absolute inset-0 bg-[#050915]/96 backdrop-blur-2xl"
            onClick={() => setOpen(false)}
          />

          <div className="mm-mobile-panel">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div className="mm-brand-lockup text-base" aria-hidden="true">
                <span className="mm-brand-mark">
                  <span />
                </span>
                <span>MoodMap</span>
              </div>

              <button
                type="button"
                className="mm-mobile-menu-button inline-flex"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="px-3 py-3">
              {LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="block rounded-2xl px-4 py-3 text-base font-semibold text-white/92 transition hover:bg-white/10"
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            <div className="border-t border-white/10 px-5 py-4">
              <p className="text-sm leading-relaxed text-white/58">
                Daily cycle intelligence for better timing — not medical advice or mood prediction.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
