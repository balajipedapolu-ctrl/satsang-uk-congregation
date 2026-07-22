"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { EVENT, NAV_LINKS } from "@/lib/event";
import Logo from "@/components/Logo";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Prevent body scroll when the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-cream/90 shadow-card backdrop-blur"
          : "bg-transparent"
      }`}
      style={{ height: "var(--header-height)" }}
    >
      <nav className="container-x flex h-full items-center justify-between">
        <Link
          href="/"
          className="group flex items-center gap-3"
          onClick={() => setOpen(false)}
        >
          <Logo className="h-11 w-11" />
          <span className="leading-tight">
            <span className="block font-serif text-lg font-bold text-maroon-800">
              {EVENT.organisation}
            </span>
            <span className="block text-[11px] font-medium uppercase tracking-[0.18em] text-saffron-700">
              {EVENT.edition} National Congregation
            </span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink/80 transition hover:text-saffron-700"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/register" className="btn-primary">
            Register Now
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="relative z-50 flex h-11 w-11 items-center justify-center rounded-full border border-saffron-200 bg-white/70 text-maroon-800 lg:hidden"
        >
          <div className="space-y-1.5">
            <span
              className={`block h-0.5 w-5 bg-current transition-transform ${
                open ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-current transition-opacity ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-current transition-transform ${
                open ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </div>
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-40 flex flex-col bg-cream px-6 pb-10 pt-24 transition-transform duration-300 lg:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="border-b border-saffron-100 py-4 text-lg font-medium text-ink/90"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <Link
          href="/register"
          onClick={() => setOpen(false)}
          className="btn-primary mt-8 w-full"
        >
          Register Now
        </Link>
      </div>
    </header>
  );
}
