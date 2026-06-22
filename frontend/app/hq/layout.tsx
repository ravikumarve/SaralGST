'use client';

import { SessionProvider, useSession, signOut } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const NAV_ITEMS = [
  { href: '/hq/overview', label: 'Overview', icon: '◆' },
  { href: '/hq/playground', label: 'Playground', icon: '〉' },
  { href: '/hq/api-keys', label: 'API Keys', icon: '🔑' },
  { href: '/hq/usage', label: 'Usage', icon: '📊' },
  { href: '/hq/history', label: 'History', icon: '📋' },
  { href: '/hq/favorites', label: 'Favorites', icon: '☆' },
  { href: '/hq/billing', label: 'Billing', icon: '₹' },
  { href: '/hq/settings', label: 'Settings', icon: '⚙' },
];

function Sidebar({ pathname }: { pathname: string }) {
  const { data: session } = useSession();
  const user = session?.user;
  const isAdmin = user?.role === 'admin';

  return (
    <aside className="w-64 bg-[#0a0a0a] border-r border-[#262626] h-screen flex flex-col shrink-0 sticky top-0 left-0 overflow-y-auto">
      {/* Logo */}
      <div className="p-6 border-b border-[#262626] shrink-0">
        <Link href="/hq/overview" className="logo">
          <span className="logo-mark" />
          <span className="text-[#ededed]">SaralGST</span>
        </Link>
      </div>

      {/* User Info */}
      <div className="px-6 py-4 border-b border-[#262626] shrink-0">
        <div className="text-sm text-[#ededed] font-medium truncate">{user?.name || user?.email}</div>
        <div className="flex items-center gap-2 mt-1">
          <span className="mono text-[10px] uppercase tracking-wider text-[#F59E0B]">{user?.tier}</span>
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
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-colors ${
                isActive
                  ? 'bg-[rgba(245,158,11,0.1)] text-[#F59E0B] border border-[rgba(245,158,11,0.2)]'
                  : 'text-[#a1a1aa] hover:text-[#ededed] hover:bg-[#141414]'
              }`}
            >
              <span className="w-5 text-center shrink-0">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[#262626] shrink-0">
        <button
          onClick={() => signOut({ callbackUrl: '/hq/login' })}
          className="w-full px-4 py-2 text-sm text-[#a1a1aa] hover:text-[#ededed] hover:bg-[#141414] rounded-xl transition-colors text-left"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Always render login page without guard
  if (pathname === '/hq/login' || pathname === '/hq/register') {
    return <>{children}</>;
  }

  if (!mounted || status === 'loading') {
    return (
      <div className="h-screen bg-[#020202] flex items-center justify-center">
        <div className="text-[#71717a] text-sm">Loading Saral HQ...</div>
      </div>
    );
  }

  if (!session) {
    router.push('/hq/login');
    return null;
  }

  return (
    <div className="flex h-screen bg-[#020202] overflow-hidden">
      <Sidebar pathname={pathname} />
      <main className="flex-1 overflow-y-auto bg-[#020202]">
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
