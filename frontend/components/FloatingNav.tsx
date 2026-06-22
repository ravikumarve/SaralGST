'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const NAV_ITEMS = [
  { label: 'Engine', href: '/#features' },
  { label: 'API Spec', href: '/#api' },
  { label: 'GitHub', href: 'https://github.com/ravikumarve/SaralGST' },
];

export default function FloatingNav() {
  const [mobileOpen, setMobileOpen] = useState(false);

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

  return (
    <nav className="sticky top-8 z-100 mx-auto max-w-[1240px] w-[90%] md:w-full">
      {/* Logo */}
      <Link
        href="/"
        className="logo"
        aria-label="SaralGST home"
      >
        <span className="logo-mark" />
        SaralGST
      </Link>

      {/* Desktop nav links */}
      <div className="nav-links">
        {NAV_ITEMS.map((item) =>
          item.href.startsWith('http') ? (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {item.label}
            </a>
          ) : (
            <Link key={item.label} href={item.href}>
              {item.label}
            </Link>
          )
        )}
      </div>

      {/* Hamburger (mobile) */}
      <button
        className="hamburger"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle navigation menu"
        aria-expanded={mobileOpen}
      >
        <span /><span /><span />
      </button>

      {/* Desktop CTA */}
      <Link href="/check" className="btn btn-primary">
        Check Rate
      </Link>

      {/* Mobile dropdown */}
      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`} role="navigation" aria-label="Mobile navigation">
        {NAV_ITEMS.map((item) =>
          item.href.startsWith('http') ? (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
            >
              {item.label}
            </a>
          ) : (
            <Link key={item.label} href={item.href} onClick={closeMenu}>
              {item.label}
            </Link>
          )
        )}
        <Link href="/check" className="btn btn-primary" onClick={closeMenu}>
          Check Rate
        </Link>
      </div>
    </nav>
  );
}
