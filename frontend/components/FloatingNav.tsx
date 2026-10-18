'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { label: 'Engine', href: '/#features' },
  { label: 'API Spec', href: '/#api' },
  { label: 'GitHub', href: 'https://github.com/ravikumarve/SaralGST' },
];

export default function FloatingNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const isHQ = pathname.startsWith('/hq');

  // Close mobile menu on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileOpen) {
        setMobileOpen(false);
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [mobileOpen]);

  const closeMenu = () => setMobileOpen(false);
  if (isHQ) return null;

  return (
    <nav className="sticky top-8 mt-8 z-100 mx-auto max-w-[1240px] w-[90%] md:w-full">
      <div className="flex items-center justify-between gap-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 no-underline"
          aria-label="SaralGST home"
        >
          <span className="w-[28px] h-[28px] border border-[#f8f9fa] flex items-center justify-center rounded-[2px] text-sm font-medium text-[#f8f9fa]">S</span>
          <span className="font-[var(--font-serif)] text-xl text-[#f8f9fa]">SaralGST</span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex gap-12">
          {NAV_ITEMS.map((item) =>
            item.href.startsWith('http') ? (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#a1a1aa] no-underline text-sm font-mono uppercase tracking-[0.5px] hover:text-[#f8f9fa] transition-colors"
              >
                {item.label}
              </a>
            ) : (
              <Link key={item.label} href={item.href} className="text-[#a1a1aa] no-underline text-sm font-mono uppercase tracking-[0.5px] hover:text-[#f8f9fa] transition-colors">
                {item.label}
              </Link>
            )
          )}
        </div>

        {/* Hamburger (mobile) */}
        <button
          className="flex md:hidden flex-col gap-1 cursor-pointer bg-transparent border-none p-1"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav-menu"
        >
          <span className="block w-5 h-[2px] bg-[#a1a1aa] rounded-full transition-all duration-300" />
          <span className="block w-5 h-[2px] bg-[#a1a1aa] rounded-full transition-all duration-300" />
          <span className="block w-5 h-[2px] bg-[#a1a1aa] rounded-full transition-all duration-300" />
        </button>

        {/* Desktop CTA */}
        <Link href="/check" className="hidden md:inline-flex items-center gap-2 px-5 py-2 bg-[#f8f9fa] text-[#000000] text-sm font-medium rounded-[4px] uppercase tracking-[1px] no-underline hover:bg-transparent hover:text-[#f8f9fa] hover:border hover:border-[#f8f9fa] transition-all duration-200">
          Check Rate
        </Link>
      </div>

      {/* Mobile dropdown */}
      <div id="mobile-nav-menu" className={`${mobileOpen ? 'flex' : 'hidden'} absolute top-full left-0 right-0 mt-2 bg-[#0a0a0a] border border-[rgba(255,255,255,0.06)] rounded-2xl p-6 flex-col gap-4 shadow-2xl z-[200]`} role="navigation" aria-label="Mobile navigation">
        {NAV_ITEMS.map((item) =>
          item.href.startsWith('http') ? (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
              className="text-[#a1a1aa] no-underline text-sm font-mono uppercase tracking-[0.5px] p-3 rounded-lg hover:text-[#f8f9fa] hover:bg-[rgba(255,255,255,0.03)] transition-all"
            >
              {item.label}
            </a>
          ) : (
            <Link key={item.label} href={item.href} onClick={closeMenu} className="text-[#a1a1aa] no-underline text-sm font-mono uppercase tracking-[0.5px] p-3 rounded-lg hover:text-[#f8f9fa] hover:bg-[rgba(255,255,255,0.03)] transition-all">
              {item.label}
            </Link>
          )
        )}
        <Link href="/check" onClick={closeMenu} className="w-full text-center px-5 py-3 bg-[#f8f9fa] text-[#000000] text-sm font-medium rounded-[4px] uppercase tracking-[1px] no-underline hover:bg-transparent hover:text-[#f8f9fa] hover:border hover:border-[#f8f9fa] transition-all duration-200">
          Check Rate
        </Link>
      </div>
    </nav>
  );
}
