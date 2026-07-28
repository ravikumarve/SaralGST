'use client';

import { SessionProvider, useSession, signOut } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const NAV_ITEMS = [
  { href: '/hq/overview', label: 'Overview', icon: '◆' },
  { href: '/hq/playground', label: 'Playground', icon: '〉' },
  { href: '/hq/api-keys', label: 'API Keys', icon: '⚷' },
  { href: '/hq/usage', label: 'Usage', icon: '▤' },
  { href: '/hq/history', label: 'History', icon: '☰' },
  { href: '/hq/favorites', label: 'Favorites', icon: '☆' },
  { href: '/hq/billing', label: 'Billing', icon: '₹' },
  { href: '/hq/settings', label: 'Settings', icon: '⚙' },
];

function Sidebar({ pathname, isOpen, onClose }: { pathname: string; isOpen: boolean; onClose: () => void }) {
  const { data: session } = useSession();
  const user = session?.user;
  const isAdmin = user?.role === 'admin';

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm lg:hidden"
          style={{ zIndex: 'var(--z-overlay)' }}
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        id="hq-sidebar"
        className={`w-64 bg-[#0a0a0a]/95 backdrop-blur-xl border-r border-[#262626] h-screen flex flex-col shrink-0 fixed lg:sticky top-0 left-0 overflow-y-auto transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{ zIndex: 'var(--z-sidebar)' }}
      >
        {/* Logo + Close button row */}
        <div className="p-6 border-b border-[#262626] shrink-0 flex items-center justify-between">
          <Link href="/hq/overview" className="logo" onClick={onClose}>
            <span className="logo-mark" />
            <span className="text-[#ededed]">SaralGST</span>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden text-[#71717a] hover:text-[#ededed] transition-colors"
            aria-label="Close sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* User Info */}
        <div className="px-6 py-4 border-b border-[#262626] shrink-0">
          <div className="text-sm text-[#ededed] font-medium truncate">{user?.name || user?.email}</div>
          <div className="flex items-center gap-2 mt-1">
            <span className="mono text-[10px] uppercase tracking-wider text-[#6366F1]">{user?.tier}</span>
            {isAdmin && <span className="mono text-[10px] text-[#71717a]">· Admin</span>}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/hq/overview' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                aria-current={isActive ? 'page' : undefined}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all ${
                  isActive
                    ? 'bg-[rgba(#6366F1,0.15)] text-[#6366F1] border border-[rgba(#6366F1,0.4)] shadow-[inset_0_1px_0_rgba(#6366F1,0.1)] font-medium'
                    : 'text-[#a1a1aa] hover:text-[#ededed] hover:bg-[rgba(255,255,255,0.04)]'
                }`}
              >
                <span className="w-5 text-center shrink-0 font-mono text-xs">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[#262626] shrink-0">
          <button
            onClick={() => signOut({ callbackUrl: '/hq/login' })}
            className="w-full px-4 py-2 text-sm text-[#a1a1aa] hover:text-[#ededed] hover:bg-[rgba(255,255,255,0.04)] rounded-xl transition-colors text-left"
          >
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Dynamic page titles for HQ
  useEffect(() => {
    const titles: Record<string, string> = {
      '/hq/overview': 'Overview — Saral HQ',
      '/hq/playground': 'API Playground — Saral HQ',
      '/hq/api-keys': 'API Keys — Saral HQ',
      '/hq/usage': 'Usage — Saral HQ',
      '/hq/history': 'History — Saral HQ',
      '/hq/favorites': 'Favorites — Saral HQ',
      '/hq/billing': 'Billing — Saral HQ',
      '/hq/settings': 'Settings — Saral HQ',
    };
    const base = '/hq/overview';
    document.title = titles[pathname] || titles[base] || 'SaralGST';
  }, [pathname]);

  useEffect(() => {
    setMounted(true); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  // Always render login page without guard
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

  return (
    <div className="flex h-screen bg-[#000000] overflow-hidden">
      <Sidebar pathname={pathname} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile hamburger */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-4 left-4 lg:hidden bg-[#0a0a0a]/90 backdrop-blur-md border border-[#262626] rounded-xl p-2.5 text-[#a1a1aa] hover:text-[#ededed] transition-colors"
          style={{ zIndex: 'var(--z-sticky)' }}
          aria-label="Open sidebar menu"
          aria-controls="hq-sidebar"
        >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <main className="flex-1 overflow-y-auto bg-[#000000]">
        <div className="min-h-full">
          {children}
        </div>
      </main>
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
