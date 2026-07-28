'use client';

import { SessionProvider, useSession, signOut } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import CommandPalette from '@/components/CommandPalette';

const NAV_ITEMS = [
  { href: '/hq/overview', label: 'Dashboard', icon: '◇' },
  { href: '/hq/playground', label: 'Playground', icon: '→' },
  { href: '/hq/api-keys', label: 'API Keys', icon: '⚷' },
  { href: '/hq/favorites', label: 'Favorites', icon: '☆' },
  { href: '/hq/settings', label: 'Settings', icon: '⚙' },
];

function Sidebar({ pathname }: { pathname: string }) {
  const { data: session } = useSession();
  const user = session?.user;
  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.charAt(0).toUpperCase() || '?';

  return (
    <aside className="w-[80px] bg-[#050505] border-r border-[rgba(255,255,255,0.06)] flex flex-col items-center py-8 shrink-0 z-20">
      {/* Logo mark */}
      <Link href="/hq/overview" className="w-9 h-9 border border-[#f8f9fa] flex items-center justify-center rounded-[4px] text-base font-medium text-[#f8f9fa] no-underline mb-12">
        S
      </Link>

      {/* Nav icons */}
      <nav className="flex flex-col gap-6 items-center">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/hq/overview' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              aria-label={item.label}
              className={`w-11 h-11 rounded-lg flex items-center justify-center text-lg transition-all duration-200 ${
                isActive
                  ? 'text-[#f8f9fa] bg-[rgba(255,255,255,0.08)]'
                  : 'text-[#52525b] hover:text-[#f8f9fa] hover:bg-[rgba(255,255,255,0.03)]'
              }`}
            >
              {item.icon}
            </Link>
          );
        })}
      </nav>

      {/* Avatar */}
      <button
        onClick={() => signOut({ callbackUrl: '/hq/login' })}
        title="Sign Out"
        className="mt-auto w-10 h-10 rounded-full bg-[#000000] border border-[rgba(255,255,255,0.12)] flex items-center justify-center font-mono text-sm text-[#a1a1aa] cursor-pointer hover:text-[#f8f9fa] transition-colors"
      >
        {initials}
      </button>
    </aside>
  );
}

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  // Dynamic page titles
  useEffect(() => {
    const titles: Record<string, string> = {
      '/hq/overview': 'Dashboard — Saral HQ',
      '/hq/playground': 'Playground — Saral HQ',
      '/hq/api-keys': 'API Keys — Saral HQ',
      '/hq/usage': 'Usage — Saral HQ',
      '/hq/history': 'History — Saral HQ',
      '/hq/favorites': 'Favorites — Saral HQ',
      '/hq/billing': 'Billing — Saral HQ',
      '/hq/settings': 'Settings — Saral HQ',
    };
    document.title = titles[pathname] || 'SaralGST';
  }, [pathname]);

  // Mount + CMD+K listener
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setPaletteOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && paletteOpen) {
        setPaletteOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [paletteOpen]);

  if (pathname === '/hq/login' || pathname === '/hq/register') {
    return <>{children}</>;
  }

  if (!mounted || status === 'loading') {
    return (
      <div className="h-screen bg-[#000000] flex items-center justify-center">
        <div className="text-[#71717a] text-sm">Loading Saral HQ...</div>
      </div>
    );
  }

  if (!session) {
    router.push('/hq/login');
    return null;
  }

  const user = session?.user;
  const pageTitle =
    pathname === '/hq/overview' ? 'Dashboard' :
    pathname === '/hq/playground' ? 'Playground' :
    pathname === '/hq/api-keys' ? 'API Keys' :
    pathname === '/hq/usage' ? 'Usage' :
    pathname === '/hq/history' ? 'History' :
    pathname === '/hq/favorites' ? 'Favorites' :
    pathname === '/hq/billing' ? 'Billing' :
    pathname === '/hq/settings' ? 'Settings' : 'Dashboard';

  return (
    <div className="flex h-screen bg-[#000000] overflow-hidden">
      <Sidebar pathname={pathname} />

      <div className="flex flex-col flex-1 relative">
        {/* Subtle indigo glow */}
        <div className="absolute top-[-10vh] left-[20vw] w-[50vw] h-[40vh] bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.05)_0%,transparent_60%)] pointer-events-none z-0 blur-[60px]" />

        {/* ===== Topbar ===== */}
        <header className="h-20 flex items-center justify-between px-16 border-b border-[rgba(255,255,255,0.06)] z-10">
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs uppercase tracking-[2px] text-[#52525b]">Workspace</span>
            <span className="font-[var(--font-serif)] text-[1.8rem] text-[#f8f9fa] tracking-[0.02em]">{pageTitle}</span>
          </div>

          <div className="flex items-center gap-6">
            {/* CMD+K search hint */}
            <button
              onClick={() => setPaletteOpen(true)}
              className="flex items-center gap-2 font-mono text-xs text-[#52525b] pr-6 border-r border-[rgba(255,255,255,0.06)] hover:text-[#a1a1aa] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              CMD+K
            </button>

            {/* Create button — pearl on void */}
            <Link
              href="/hq/playground"
              className="btn-primary inline-flex items-center gap-2 px-6 py-2.5 font-[var(--font-sans)] text-sm font-medium rounded-[4px] uppercase tracking-[1px] border border-transparent bg-[#f8f9fa] text-[#000000] hover:bg-transparent hover:text-[#f8f9fa] hover:border-[#f8f9fa] transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m7-7H5" />
              </svg>
              Create
            </Link>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto z-10">
          {children}
        </main>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  );
}

export default function HQLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthGuard>{children}</AuthGuard>
    </SessionProvider>
  );
}
