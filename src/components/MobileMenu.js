"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const LINKS = [
  { href: "/#about", label: "About" },
  { href: "/#download", label: "Download" },
  { href: "/support", label: "Support" },
  { href: "/pro", label: "Premium+" },
  // /partner skal være “semi-offentlig” → ikke i meny
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  // Lock scroll når meny er åpen
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // ESC lukker
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
        className="sm:hidden inline-flex items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15 px-3 py-2 text-white/90 backdrop-blur-xl hover:bg-white/15"
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
          {/* Solid overlay (ikke gjennomsiktig) */}
          <div
            className="absolute inset-0 bg-[#070B14]/95 backdrop-blur-xl"
            onClick={() => setOpen(false)}
          />

          <div className="relative mx-auto mt-20 w-[92%] max-w-sm rounded-3xl bg-white/10 ring-1 ring-white/15 backdrop-blur-2xl shadow-2xl shadow-black/40 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <div className="text-sm font-semibold text-white/90">Menu</div>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15 px-3 py-2 text-white/90 hover:bg-white/15"
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
                  className="block rounded-2xl px-4 py-3 text-base font-semibold text-white/90 hover:bg-white/10"
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
