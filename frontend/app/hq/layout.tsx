'use client';

import { SessionProvider, useSession, signOut } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import CommandPalette from '@/components/CommandPalette';

const NAV_ITEMS = [
  { href: '/hq/overview', label: 'Dashboard', icon: '◇' },
  { href: '/hq/playground', label: 'Playground', icon: '→' },
  { href: '/hq/api-keys', label: 'API Keys', icon: '⚷' },
  { href: '/hq/favorites', label: 'Favorites', icon: '☆' },
  { href: '/hq/settings', label: 'Settings', icon: '⚙' },
];

function Sidebar({ pathname, collapsed, onToggle }: { pathname: string; collapsed: boolean; onToggle: () => void }) {
  const { data: session } = useSession();
  const user = session?.user;
  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.charAt(0).toUpperCase() || '?';

  return (
    <aside
      className={`${
        collapsed ? 'w-20' : 'w-64'
      } bg-[#050505] border-r border-[rgba(255,255,255,0.06)] flex flex-col py-8 shrink-0 z-20 transition-all duration-300`}
    >
      {/* Logo mark + brand name */}
      <div className={`flex items-center mb-12 ${collapsed ? 'justify-center' : 'px-6'}`}>
        <Link href="/hq/overview" className="flex items-center gap-3 no-underline">
          <span className="w-9 h-9 border border-[#f8f9fa] flex items-center justify-center rounded-[4px] text-[1.1rem] font-medium text-[#f8f9fa] shrink-0">
            S
          </span>
          <span className={`font-[var(--font-serif)] text-xl text-[#f8f9fa] whitespace-nowrap transition-opacity duration-300 ${collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
            SaralGST
          </span>
        </Link>
        {/* Sidebar collapse toggle — only visible when expanded, nestled by logo */}
        <button
          onClick={onToggle}
          className={`ml-auto w-7 h-7 flex items-center justify-center text-[#52525b] hover:text-[#f8f9fa] transition-colors rounded-[4px] hover:bg-[rgba(255,255,255,0.03)] ${collapsed ? 'hidden' : ''}`}
          aria-label="Collapse sidebar"
          title="Collapse sidebar"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.75 19.5l-7.5-7.5 7.5-7.5" />
          </svg>
        </button>
      </div>

      {/* Nav items */}
      <nav className={`flex flex-col gap-2 ${collapsed ? 'items-center' : 'px-4'}`}>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/hq/overview' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              aria-label={item.label}
              className={`flex items-center gap-4 rounded-lg transition-all duration-200 ${
                collapsed
                  ? 'w-11 h-11 justify-center'
                  : 'px-4 py-3'
              } ${
                isActive
                  ? 'text-[#f8f9fa] bg-[rgba(255,255,255,0.08)]'
                  : 'text-[#52525b] hover:text-[#f8f9fa] hover:bg-[rgba(255,255,255,0.03)]'
              }`}
            >
              <span className="text-[1.25rem] shrink-0 w-5 text-center">{item.icon}</span>
              <span className={`text-sm font-[var(--font-sans)] whitespace-nowrap transition-opacity duration-300 ${collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Avatar */}
      <div className={`mt-auto ${collapsed ? 'flex justify-center' : 'px-4'}`}>
        <button
          onClick={() => signOut({ callbackUrl: '/hq/login' })}
          title="Sign Out"
          className="w-10 h-10 rounded-full bg-[#000000] border border-[rgba(255,255,255,0.12)] flex items-center justify-center font-mono text-sm text-[#a1a1aa] cursor-pointer hover:text-[#f8f9fa] transition-colors shrink-0"
        >
          {initials}
        </button>
      </div>
    </aside>
  );
}

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const toggleSidebar = useCallback(() => setSidebarCollapsed((prev) => !prev), []);

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

  // CMD+K keyboard listener
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

  if (status === 'loading') {
    return (
      <div className="h-screen bg-[#000000] flex items-center justify-center">
        <div className="text-[#a1a1aa] text-sm">Loading Saral HQ...</div>
      </div>
    );
  }

  if (!session) {
    router.push('/hq/login');
    return null;
  }

  const pageTitle =
    pathname === '/hq/overview' ? 'SaralGST' :
    pathname === '/hq/playground' ? 'Playground' :
    pathname === '/hq/api-keys' ? 'API Keys' :
    pathname === '/hq/usage' ? 'Usage' :
    pathname === '/hq/history' ? 'History' :
    pathname === '/hq/favorites' ? 'Favorites' :
    pathname === '/hq/billing' ? 'Billing' :
    pathname === '/hq/settings' ? 'Settings' : 'Dashboard';

  return (
    <div className="flex h-screen bg-[#000000] overflow-hidden">
      <Sidebar pathname={pathname} collapsed={sidebarCollapsed} onToggle={toggleSidebar} />

      <div className="flex flex-col flex-1 relative">
        {/* Subtle indigo glow */}
        <div className="absolute top-[-10vh] left-[20vw] w-[50vw] h-[40vh] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.04)_0%,transparent_60%)] pointer-events-none z-0 blur-[60px]" />

        {/* ===== Topbar ===== */}
        <header className="hq-topbar h-20 flex items-center justify-between px-16 border-b border-[rgba(255,255,255,0.06)] z-10">
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
              className="inline-flex items-center gap-2 px-[1.5rem] py-[0.6rem] text-sm font-medium rounded-[4px] uppercase tracking-[1px] border border-[#f8f9fa] bg-[#f8f9fa] text-[#000000] hover:bg-transparent hover:text-[#f8f9fa] transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m7-7H5" />
              </svg>
              Create
            </Link>
          </div>
        </header>

        {/* Main content — p-16 gives uniform 4rem breathing room on all sides */}
        <main className="hq-content flex-1 overflow-y-auto z-10">
          {children}
        </main>
      </div>

      <CommandPalette key={String(paletteOpen)} open={paletteOpen} onClose={() => setPaletteOpen(false)} />
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
