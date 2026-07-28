'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface OverviewData {
  userTier: string;
  totalLookups: number;
  lookupsToday: number;
  remainingToday: number;
  apiKeysCount: number;
  activeKeys: number;
  dataVersion: string;
  itemsCount: number;
  lastLookup: string | null;
}

interface HistoryItem {
  id: string;
  query: string;
  hsnCode: string | null;
  resultRate: number | null;
  success: boolean;
  source: string | null;
  createdAt: string;
}

const COMMANDS = [
  { label: 'Check GST Rate', href: '/check', icon: '◆', shortcut: 'G' },
  { label: 'API Playground', href: '/hq/playground', icon: '〉', shortcut: 'P' },
  { label: 'Generate API Key', href: '/hq/api-keys', icon: '⚷', shortcut: 'K' },
  { label: 'View Billing', href: '/hq/billing', icon: '₹', shortcut: 'B' },
];

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function getDateContext(): string {
  const now = new Date();
  const weekday = now.toLocaleDateString('en-IN', { weekday: 'long' });
  const date = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  return `${weekday}, ${date}`;
}

export default function OverviewPage() {
  const { data: session } = useSession();
  const [data, setData] = useState<OverviewData | null>(null);
  const [activity, setActivity] = useState<HistoryItem[]>([]);

  useEffect(() => {
    fetch('/api/hq/overview')
      .then((r) => r.json())
      .then(setData)
      .catch(console.error);

    fetch('/api/hq/history')
      .then((r) => r.json())
      .then((res) => setActivity(res.history?.slice(0, 5) ?? []))
      .catch(console.error);
  }, []);

  const user = session?.user;
  const tierName = user?.tier === 'ca_firm' ? 'CA Firm' : user?.tier === 'paid' ? 'Pro' : 'Free';

  const stats = [
    { label: 'Total Lookups', value: data?.totalLookups ?? 0, subtitle: 'All time' },
    { label: "Today's Lookups", value: data?.lookupsToday ?? 0, subtitle: data?.remainingToday ? `${data.remainingToday} remaining today` : undefined },
    { label: 'Active API Keys', value: data?.activeKeys ?? 0, subtitle: `${Math.max(0, (data?.apiKeysCount ?? 0) - (data?.activeKeys ?? 0))} inactive` },
    { label: 'Database', value: data?.itemsCount ?? 54, subtitle: data?.dataVersion ?? 'GST 2.0' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] min-h-full">
      {/* ===== EDITORIAL COLUMN ===== */}
      <div className="p-8 md:p-10 lg:p-12">
        {/* Hero Header */}
        <div className="mb-12">
          <p className="mono text-[10px] tracking-[2px] text-[#6366F1] mb-3">DASHBOARD</p>
          <h1 className="font-[var(--font-serif)] text-4xl md:text-5xl lg:text-6xl text-[#ededed] leading-[1.1] tracking-tight">
            {getGreeting()},<br />
            <span className="text-[#6366F1]">{user?.name?.split(' ')[0] || 'there'}</span>.
          </h1>
          <p className="text-sm text-[#71717a] mt-4">
            {getDateContext()} · <span className="text-[#a5b4fc]">{tierName}</span> tier
          </p>
        </div>

        {/* Editorial Stats — 2 x 2 with serif numbers */}
        <div className="grid grid-cols-2 gap-x-10 gap-y-10 mb-14">
          {stats.map((stat) => (
            <div key={stat.label} className="border-b border-[#262626] pb-4">
              <div className="font-[var(--font-serif)] text-4xl md:text-5xl lg:text-6xl text-[#ededed] leading-none mb-2 tracking-tight">
                {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
              </div>
              <div className="mono text-[11px] tracking-[1.5px] text-[#6366F1]">
                {stat.label.toUpperCase()}
              </div>
              {stat.subtitle && (
                <div className="text-xs text-[#52525b] mt-1.5">{stat.subtitle}</div>
              )}
            </div>
          ))}
        </div>

        {/* Latest Activity */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-[var(--font-serif)] text-xl text-[#ededed]">Latest Activity</h2>
            <Link
              href="/hq/history"
              className="text-xs text-[#52525b] hover:text-[#a1a1aa] transition-colors mono"
            >
              View all &rarr;
            </Link>
          </div>

          {activity.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="mono text-[10px] tracking-[1px] text-[#52525b] border-b border-[#262626]">
                    <th className="pb-3 pr-4 font-normal">Query</th>
                    <th className="pb-3 pr-4 font-normal">HSN</th>
                    <th className="pb-3 pr-4 font-normal">Rate</th>
                    <th className="pb-3 pr-4 font-normal hidden sm:table-cell">When</th>
                  </tr>
                </thead>
                <tbody>
                  {activity.map((item) => (
                    <tr key={item.id} className="border-b border-[#1a1a1a] text-sm hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                      <td className="py-3.5 pr-4 text-[#ededed] max-w-[180px] truncate">{item.query}</td>
                      <td className="py-3.5 pr-4">
                        <span className="mono text-xs text-[#a1a1aa]">{item.hsnCode || '—'}</span>
                      </td>
                      <td className="py-3.5 pr-4">
                        <span className={`mono text-xs ${item.resultRate !== null ? 'text-[#a5b4fc]' : 'text-[#52525b]'}`}>
                          {item.resultRate !== null ? `${item.resultRate}%` : '—'}
                        </span>
                      </td>
                      <td className="py-3.5 pr-4 hidden sm:table-cell">
                        <span className="mono text-xs text-[#52525b]">
                          {new Date(item.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-sm text-[#52525b] mb-1">No lookups yet.</p>
              <Link href="/check" className="text-xs text-[#6366F1] hover:text-[#a5b4fc] transition-colors">
                Check your first GST rate &rarr;
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ===== COMMAND COLUMN ===== */}
      <div className="p-8 md:p-10 lg:p-12 lg:pl-0 lg:border-l border-[#262626]">
        <div className="lg:pl-10">
          {/* Command Center */}
          <div className="mb-8">
            <p className="mono text-[10px] tracking-[2px] text-[#52525b] mb-3">COMMAND CENTER</p>
            <div className="border border-[#262626] rounded-2xl overflow-hidden divide-y divide-[#262626]">
              {COMMANDS.map((cmd) => (
                <Link
                  key={cmd.label}
                  href={cmd.href}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-[rgba(255,255,255,0.02)] transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm w-5 text-center text-[#6366F1] font-mono">{cmd.icon}</span>
                    <span className="text-sm text-[#ededed] group-hover:text-[#6366F1] transition-colors">
                      {cmd.label}
                    </span>
                  </div>
                  <span className="mono text-[9px] tracking-[1px] text-[#52525b] bg-[#0a0a0a] border border-[#262626] rounded-md px-2 py-0.5">
                    ⌘+{cmd.shortcut}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* System Status */}
          <div className="mb-8">
            <p className="mono text-[10px] tracking-[2px] text-[#52525b] mb-3">SYSTEM</p>
            <div className="border border-[#262626] rounded-2xl p-5">
              <div className="flex items-center gap-2.5 mb-3">
                <span className="w-2 h-2 rounded-full bg-[#10b981] shadow-[0_0_6px_rgba(16,185,129,0.4)]" />
                <span className="text-sm text-[#ededed]">All systems nominal</span>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[#52525b]">Database</span>
                  <span className="mono text-xs text-[#a1a1aa]">{data?.dataVersion ?? 'v2.0'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[#52525b]">Items</span>
                  <span className="mono text-xs text-[#a1a1aa]">{data?.itemsCount ?? 54}</span>
                </div>
                {data?.lastLookup && (
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#52525b]">Last lookup</span>
                    <span className="mono text-xs text-[#a1a1aa]">{data.lastLookup}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Upgrade Callout */}
          {user?.tier === 'free' && (
            <div>
              <p className="mono text-[10px] tracking-[2px] text-[#52525b] mb-3">UPGRADE</p>
              <Link
                href="/hq/billing"
                className="block border border-[#6366F1]/30 rounded-2xl p-5 bg-[rgba(99,102,241,0.04)] hover:bg-[rgba(99,102,241,0.08)] transition-colors group"
              >
                <p className="text-sm text-[#ededed] font-medium mb-1">Go Pro</p>
                <p className="text-xs text-[#71717a] mb-3">
                  Unlock 10,000 lookups/day, team API keys, and priority support.
                </p>
                <span className="text-xs text-[#6366F1] group-hover:text-[#a5b4fc] transition-colors">
                  View plans &rarr;
                </span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
