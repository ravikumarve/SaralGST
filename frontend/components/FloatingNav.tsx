'use client';

import { useState } from 'react';
import Link from 'next/link';

const NAV_ITEMS = [
  { label: 'Engine', href: '/#engine' },
  { label: 'Developers', href: '/#developers' },
  { label: 'Pricing', href: '/#pricing' },
];

export default function FloatingNav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-black/70 backdrop-blur-xl border border-[#262626] rounded-full px-6 py-3 flex items-center gap-8 shadow-2xl shadow-black/50 max-w-3xl w-[90%] md:w-auto">
      {/* Logo */}
      <Link
        href="/"
        className="flex items-center gap-2 font-space-grotesk font-bold text-[#f0f0ff] hover:text-white transition-colors shrink-0"
      >
        <span className="w-2.5 h-2.5 bg-[#00f0ff] rounded-full shadow-lg shadow-[#00f0ff]/50 animate-pulse-dot" />
        SaralGST
      </Link>

      {/* Desktop nav links */}
      <div className="hidden md:flex items-center gap-6">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-sm text-[#a1a1aa] hover:text-white transition-colors font-medium"
          >
            {item.label}
          </Link>
        ))}
      </div>

      {/* API Docs CTA */}
      <Link
        href="/check"
        className="ml-auto text-sm px-4 py-1.5 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-colors shrink-0"
      >
        Check Rate
      </Link>

      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden flex flex-col gap-1 p-1"
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
        <div className="absolute top-full left-0 right-0 mt-2 bg-black/90 backdrop-blur-xl border border-[#262626] rounded-2xl p-4 flex flex-col gap-3 shadow-2xl">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="text-sm text-[#a1a1aa] hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
