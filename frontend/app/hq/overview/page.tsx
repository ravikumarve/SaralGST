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

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
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
      .then((res) => setActivity(res.history?.slice(0, 3) ?? []))
      .catch(console.error);
  }, []);

  const user = session?.user;
  const totalKeys = data?.apiKeysCount ?? 0;
  const activeKeys = data?.activeKeys ?? 0;
  const overdueKeys = Math.max(0, totalKeys - activeKeys);

  return (
    <div className="grid grid-cols-[1.5fr_1fr] gap-16">
      {/* ===== LEFT: EDITORIAL COLUMN ===== */}
      <div className="flex flex-col gap-16">
        {/* Hero Stats — 2-column grid */}
        <div className="grid grid-cols-2 gap-12 pb-16 border-b border-[rgba(255,255,255,0.06)]">
          {/* Stat 1 */}
          <div className="flex flex-col">
            <p className="font-mono text-xs uppercase tracking-[2px] text-[#52525b] mb-4">Total Lookups</p>
            <p className="font-[var(--font-serif)] text-[5rem] text-[#f8f9fa] leading-[0.9] mb-4">
              {(data?.totalLookups ?? 0).toLocaleString()}
            </p>
            <p className="text-sm text-[#a1a1aa] font-light leading-[1.6]">
              {data?.lookupsToday ? `${data.lookupsToday} today` : 'All time'}.
              {data?.remainingToday ? ` ${data.remainingToday} remaining today.` : ''}
            </p>
          </div>

          {/* Stat 2 — with left border */}
          <div className="flex flex-col pl-12 border-l border-[rgba(255,255,255,0.06)]">
            <p className="font-mono text-xs uppercase tracking-[2px] text-[#52525b] mb-4">Active API Keys</p>
            <p className="font-[var(--font-serif)] text-[5rem] text-[#f8f9fa] leading-[0.9] mb-4">
              {data?.activeKeys ?? 0}
            </p>
            <p className="text-sm text-[#a1a1aa] font-light leading-[1.6]">
              {overdueKeys > 0 ? `${overdueKeys} key${overdueKeys > 1 ? 's' : ''} inactive.` : 'All keys active.'}
              {data?.itemsCount ? ` ${data.itemsCount} HSN codes indexed.` : ''}
            </p>
          </div>
        </div>

        {/* Elegant Table */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-[var(--font-serif)] text-[2.2rem] text-[#f8f9fa]">Recent Activity</h2>
            <Link href="/hq/history" className="font-mono text-xs text-[#52525b] hover:text-[#a1a1aa] transition-colors uppercase tracking-[1.5px]">
              View all &rarr;
            </Link>
          </div>

          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left py-4 font-mono text-xs text-[#52525b] uppercase tracking-[1.5px] font-normal border-b border-[rgba(255,255,255,0.12)]">
                  Query &amp; HSN
                </th>
                <th className="text-left py-4 font-mono text-xs text-[#52525b] uppercase tracking-[1.5px] font-normal border-b border-[rgba(255,255,255,0.12)]">
                  Rate
                </th>
                <th className="text-right py-4 font-mono text-xs text-[#52525b] uppercase tracking-[1.5px] font-normal border-b border-[rgba(255,255,255,0.12)]">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {activity.length > 0 ? (
                activity.map((item) => (
                  <tr key={item.id} className="group">
                    <td className="py-6 border-b border-[rgba(255,255,255,0.06)] group-hover:border-b-[rgba(255,255,255,0.12)] transition-colors">
                      <span className="block text-[1.1rem] font-normal text-[#f8f9fa] mb-1.5">{item.query}</span>
                      <span className="font-mono text-xs text-[#52525b]">HSN: {item.hsnCode || '—'}</span>
                    </td>
                    <td className="py-6 border-b border-[rgba(255,255,255,0.06)] group-hover:border-b-[rgba(255,255,255,0.12)] transition-colors">
                      <span className="text-sm text-[#a1a1aa] font-light">{item.resultRate !== null ? `${item.resultRate}%` : '—'}</span>
                      <span className="block font-mono text-xs text-[#52525b] mt-1">
                        {new Date(item.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                      </span>
                    </td>
                    <td className="py-6 border-b border-[rgba(255,255,255,0.06)] group-hover:border-b-[rgba(255,255,255,0.12)] transition-colors text-right">
                      <span className={`inline-block px-3 py-1 rounded-full font-mono text-[10px] uppercase tracking-[1px] border text-center ${
                        item.success
                          ? 'border-[rgba(255,255,255,0.15)] text-[#f8f9fa] bg-[rgba(255,255,255,0.08)]'
                          : 'border-[rgba(255,255,255,0.06)] text-[#a1a1aa]'
                      }`}>
                        {item.success ? 'Success' : 'Failed'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-12 text-center text-sm text-[#52525b] border-b border-[rgba(255,255,255,0.06)]">
                    No lookups yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== RIGHT: COMMAND COLUMN ===== */}
      <div className="flex flex-col gap-12">
        {/* Command Palette */}
        <div>
          <h3 className="font-mono text-xs uppercase tracking-[2px] text-[#52525b] mb-6 pb-4 border-b border-[rgba(255,255,255,0.06)]">
            Command Palette
          </h3>
          <div className="flex flex-col gap-3">
            {[
              { label: 'Check GST Rate', href: '/check', desc: 'Lookup any product or HSN code' },
              { label: 'Generate API Key', href: '/hq/api-keys', desc: 'Create a new HMAC token' },
              { label: 'View Billing', href: '/hq/billing', desc: 'Plans, invoices & payment history' },
            ].map((cmd) => (
              <Link
                key={cmd.label}
                href={cmd.href}
                className="flex items-center justify-between px-6 py-5 bg-[#0a0a0a] border border-[rgba(255,255,255,0.06)] rounded-[8px] hover:border-[rgba(255,255,255,0.12)] hover:-translate-x-1 hover:bg-[rgba(255,255,255,0.03)] transition-all duration-300 group"
              >
                <div>
                  <span className="text-[0.95rem] text-[#f8f9fa] font-normal block">{cmd.label}</span>
                  <span className="font-mono text-xs text-[#52525b] mt-1 block">{cmd.desc}</span>
                </div>
                <svg className="w-5 h-5 text-[#52525b] group-hover:text-[#a1a1aa] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            ))}
          </div>
        </div>

        {/* Attention Required (feed) */}
        <div>
          <h3 className="font-mono text-xs uppercase tracking-[2px] text-[#52525b] mb-6 pb-4 border-b border-[rgba(255,255,255,0.06)]">
            Overview
          </h3>
          <div className="flex flex-col gap-8">
            {/* Feed item 1 */}
            <div className="flex gap-5 items-start">
              <div className="w-9 h-9 rounded-full bg-[#050505] border border-[rgba(255,255,255,0.12)] flex items-center justify-center text-[#f8f9fa] text-base shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-[0.95rem] font-medium text-[#f8f9fa] mb-1.5">Database Updated</h4>
                <p className="text-sm text-[#a1a1aa] font-light leading-[1.6]">
                  {data?.dataVersion || 'GST'} with {data?.itemsCount || 54} HSN codes indexed and ready.
                </p>
                <p className="font-mono text-xs text-[#52525b] uppercase tracking-[1px] mt-2">
                  Version: {data?.dataVersion || '2.0'}
                </p>
              </div>
            </div>

            {/* Feed item 2 */}
            <div className="flex gap-5 items-start">
              <div className="w-9 h-9 rounded-full bg-[#050505] border border-[rgba(255,255,255,0.15)] flex items-center justify-center text-[#f8f9fa] text-base shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-[0.95rem] font-medium text-[#f8f9fa] mb-1.5">
                  {getGreeting()}, {user?.name?.split(' ')[0] || 'there'}
                </h4>
                <p className="text-sm text-[#a1a1aa] font-light leading-[1.6]">
                  {data?.lookupsToday ? `${data.lookupsToday} lookup${data.lookupsToday > 1 ? 's' : ''} today. ` : ''}
                  {data?.remainingToday ? `${data.remainingToday} remaining.` : ''}
                </p>
                <p className="font-mono text-xs text-[#52525b] uppercase tracking-[1px] mt-2">
                  Tier: {user?.tier || 'free'}
                </p>
              </div>
            </div>

            {/* Feed item 3 */}
            <div className="flex gap-5 items-start">
              <div className="w-9 h-9 rounded-full bg-[#050505] border border-[rgba(255,255,255,0.12)] flex items-center justify-center text-[#f8f9fa] text-base shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-[0.95rem] font-medium text-[#f8f9fa] mb-1.5">Need help?</h4>
                <p className="text-sm text-[#a1a1aa] font-light leading-[1.6]">
                  Try the API Playground to test endpoints, or check the billing page to upgrade your plan.
                </p>
                <Link href="/hq/playground" className="font-mono text-xs text-[#a1a1aa] uppercase tracking-[1px] mt-2 inline-block hover:text-[#f8f9fa] transition-colors">
                  Open Playground &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
