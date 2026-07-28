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

function Sidebar({
  pathname,
  isOpen,
  collapsed,
  onClose,
  onToggleCollapse,
}: {
  pathname: string;
  isOpen: boolean;
  collapsed: boolean;
  onClose: () => void;
  onToggleCollapse: () => void;
}) {
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
        className={`bg-[#0a0a0a]/95 backdrop-blur-xl border-r border-[#262626] h-screen flex flex-col shrink-0 fixed lg:sticky top-0 left-0 overflow-y-auto transition-all duration-300 ease-in-out ${
          collapsed ? 'w-20' : 'w-64'
        } ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{ zIndex: 'var(--z-sidebar)' }}
      >
        {/* Logo + Close + Collapse row */}
        <div className={`shrink-0 flex items-center border-b border-[#262626] transition-all duration-300 ${
          collapsed ? 'p-4 justify-center' : 'p-6 justify-between'
        }`}>
          <Link href="/hq/overview" className="flex items-center gap-3 no-underline" onClick={onClose}>
            <span className="logo-mark shrink-0" />
            {!collapsed && <span className="text-[#ededed] font-[var(--font-serif)] text-[1.1rem]">SaralGST</span>}
          </Link>

          <div className="flex items-center gap-1">
            {/* Collapse toggle (desktop) */}
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex text-[#52525b] hover:text-[#ededed] transition-colors p-1.5 rounded-lg hover:bg-[rgba(255,255,255,0.04)]"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              title={collapsed ? 'Expand' : 'Collapse'}
            >
              <svg className="w-4 h-4 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                style={{ transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>

            {/* Close (mobile) */}
            <button
              onClick={onClose}
              className="lg:hidden text-[#71717a] hover:text-[#ededed] transition-colors p-1"
              aria-label="Close sidebar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* User Info — hidden when collapsed */}
        {!collapsed && (
          <div className="px-6 py-4 border-b border-[#262626] shrink-0">
            <div className="text-sm text-[#ededed] font-medium truncate">{user?.name || user?.email}</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="mono text-[10px] uppercase tracking-wider text-[#6366F1]">{user?.tier}</span>
              {isAdmin && <span className="mono text-[10px] text-[#71717a]">· Admin</span>}
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className={`flex-1 overflow-y-auto transition-all duration-300 ${collapsed ? 'p-2 space-y-1' : 'p-3 space-y-0.5'}`}>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/hq/overview' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                aria-current={isActive ? 'page' : undefined}
                title={collapsed ? item.label : undefined}
                className={`flex items-center rounded-xl transition-all duration-200 ${
                  collapsed
                    ? 'justify-center p-3'
                    : 'gap-3 px-4 py-2.5 text-sm'
                } ${
                  isActive
                    ? 'bg-[rgba(99,102,241,0.12)] text-[#6366F1] border border-[rgba(99,102,241,0.3)]'
                    : 'text-[#a1a1aa] hover:text-[#ededed] hover:bg-[rgba(255,255,255,0.04)]'
                }`}
              >
                <span className={`text-center shrink-0 ${
                  collapsed ? 'text-base' : 'w-5 font-mono text-xs'
                }`}>{item.icon}</span>
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer — Sign Out + Collapse toggle for collapsed mode */}
        <div className={`shrink-0 border-t border-[#262626] transition-all duration-300 ${
          collapsed ? 'p-2' : 'p-4'
        }`}>
          {!collapsed && (
            <button
              onClick={() => signOut({ callbackUrl: '/hq/login' })}
              className="w-full px-4 py-2 text-sm text-[#a1a1aa] hover:text-[#ededed] hover:bg-[rgba(255,255,255,0.04)] rounded-xl transition-colors text-left"
            >
              Sign Out
            </button>
          )}

          {/* Collapse toggle in footer for collapsed mode (desktop) */}
          {collapsed && (
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex w-full justify-center p-3 text-[#52525b] hover:text-[#ededed] hover:bg-[rgba(255,255,255,0.04)] rounded-xl transition-colors"
              aria-label="Expand sidebar"
              title="Expand"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </button>
          )}
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
    setMounted(true);
  }, []);

  // Always render login/register without guard
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
      <Sidebar
        pathname={pathname}
        isOpen={sidebarOpen}
        collapsed={sidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main workspace: Topbar + Content */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* ===== Topbar ===== */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-[#262626] bg-[#000000] shrink-0">
          <div className="flex items-center gap-4">
            {/* Mobile hamburger */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-[#a1a1aa] hover:text-[#ededed] transition-colors p-1 -ml-1"
              aria-label="Open sidebar menu"
              aria-controls="hq-sidebar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="hidden sm:flex items-center gap-3">
              <span className="mono text-[10px] uppercase tracking-[2px] text-[#52525b]">Workspace</span>
              <span className="text-sm text-[#a1a1aa]">/</span>
              <span className="text-sm text-[#ededed] font-medium" id="hq-page-title">
                {pathname === '/hq/overview' ? 'Dashboard' :
                 pathname === '/hq/playground' ? 'Playground' :
                 pathname === '/hq/api-keys' ? 'API Keys' :
                 pathname === '/hq/usage' ? 'Usage' :
                 pathname === '/hq/history' ? 'History' :
                 pathname === '/hq/favorites' ? 'Favorites' :
                 pathname === '/hq/billing' ? 'Billing' :
                 pathname === '/hq/settings' ? 'Settings' : 'Dashboard'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* CMD+K style search hint */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#0a0a0a] border border-[#262626] rounded-lg text-xs text-[#52525b]">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <span>CMD+K</span>
            </div>

            {/* Create button */}
            <Link
              href="/hq/playground"
              className="flex items-center gap-1.5 px-4 py-1.5 bg-[#6366F1] text-white text-xs font-medium rounded-lg hover:bg-[#a5b4fc] hover:text-[#000000] transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m7-7H5" />
              </svg>
              <span className="hidden sm:inline">Create</span>
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-[#000000]">
          <div className="min-h-full">
            {children}
          </div>
        </main>
      </div>
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
