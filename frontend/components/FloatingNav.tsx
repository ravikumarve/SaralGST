'use client';

import { useState } from 'react';
import Link from 'next/link';

const NAV_ITEMS = [
  { label: 'Platform', href: '/#platform' },
  { label: 'Developers', href: '/#developers' },
  { label: 'Pricing', href: '/#pricing' },
];

export default function FloatingNav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-8 z-100 mx-auto max-w-[1280px] w-[90%] md:w-full bg-[#0d0d0d]/70 backdrop-blur-xl border border-[#262626] rounded-full px-6 md:px-8 py-3 md:py-6 flex items-center justify-between shadow-2xl shadow-black/40">
      {/* Logo */}
      <Link
        href="/"
        className="flex items-center gap-3 font-space-grotesk font-bold text-xl text-[#ededed] hover:text-white transition-colors shrink-0"
      >
        <span className="w-[10px] h-[10px] bg-[#00f0ff] rounded-[2px]" />
        SaralGST
      </Link>

      {/* Desktop nav links — mono */}
      <div className="hidden md:flex items-center gap-8 mono text-[#a1a1aa]">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="hover:text-[#ededed] transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </div>

      {/* API Docs CTA — btn-secondary style */}
      <Link
        href="http://localhost:8001/docs"
        className="hidden md:inline-flex items-center px-4 py-2 bg-[#141414] text-[#ededed] border border-[#262626] rounded-lg text-sm font-medium hover:border-[#404040] hover:bg-[#262626] transition-all mono shrink-0"
      >
        API Docs →
      </Link>

      {/* Mobile: Check Rate link */}
      <Link
        href="/check"
        className="md:hidden text-sm px-4 py-1.5 bg-[#ededed] text-[#050505] rounded-lg font-medium hover:bg-white/90 transition-colors shrink-0"
      >
        Check Rate
      </Link>

      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden flex flex-col gap-1 p-1 ml-2"
        aria-label="Toggle menu"
      >
        <span
          className={`block w-5 h-[2px] bg-[#a1a1aa] transition-all duration-200 ${
            mobileOpen ? 'rotate-45 translate-y-[3px]' : ''
          }`}
        />
        <span
          className={`block w-5 h-[2px] bg-[#a1a1aa] transition-all duration-200 ${
            mobileOpen ? 'opacity-0' : ''
          }`}
        />
        <span
          className={`block w-5 h-[2px] bg-[#a1a1aa] transition-all duration-200 ${
            mobileOpen ? '-rotate-45 -translate-y-[3px]' : ''
          }`}
        />
      </button>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#0d0d0d]/95 backdrop-blur-xl border border-[#262626] rounded-2xl p-4 flex flex-col gap-3 shadow-2xl">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="text-sm text-[#a1a1aa] hover:text-[#ededed] transition-colors px-3 py-2 rounded-lg hover:bg-white/5 mono"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/check"
            onClick={() => setMobileOpen(false)}
            className="text-sm px-4 py-2.5 bg-[#ededed] text-[#050505] rounded-lg font-medium text-center hover:bg-white/90 transition-colors mt-2"
          >
            Check Rate
          </Link>
        </div>
      )}
    </nav>
  );
}
