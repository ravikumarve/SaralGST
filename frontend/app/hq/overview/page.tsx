'use client';

import { useSession } from 'next-auth/react';
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

export default function OverviewPage() {
  const { data: session } = useSession();
  const [data, setData] = useState<OverviewData | null>(null);

  useEffect(() => {
    fetch('/api/hq/overview')
      .then((r) => r.json())
      .then(setData)
      .catch(console.error);
  }, []);

  const user = session?.user;
  const tierName = user?.tier === 'ca_firm' ? 'CA Firm' : user?.tier === 'paid' ? 'Pro' : 'Free';

  const stats = [
    { label: 'Total Lookups', value: data?.totalLookups ?? 0, subtitle: 'All time' },
    { label: "Today's Lookups", value: data?.lookupsToday ?? 0, subtitle: data?.remainingToday ? `${data.remainingToday} remaining` : undefined },
    { label: 'API Keys', value: data?.activeKeys ?? 0, subtitle: `${(data?.apiKeysCount ?? 0) - (data?.activeKeys ?? 0)} inactive` },
    { label: 'GST Database', value: data?.itemsCount ?? 54, subtitle: data?.dataVersion ?? 'GST 2.0' },
  ];

  return (
    <div className="p-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#ededed]">Overview</h1>
        <p className="text-[#71717a] text-sm mt-1">
          Welcome back{user?.name ? `, ${user.name}` : ''} ·{' '}
          <span className="text-[#6366F1]">{tierName}</span> tier
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="hq-stat">
            <div className="text-3xl font-bold text-[#ededed] mb-1">{stat.value}</div>
            <div className="text-sm text-[#a1a1aa]">{stat.label}</div>
            {stat.subtitle && <div className="text-[10px] text-[#52525b] mt-1 mono">{stat.subtitle}</div>}
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="hq-card p-6">
        <h2 className="text-lg font-semibold text-[#ededed] mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <a href="/check" className="px-4 py-3 bg-[#6366F1]/10 border border-[rgba(99,102,241,0.2)] rounded-xl text-sm text-[#6366F1] hover:bg-[#6366F1]/20 transition-colors text-center">
            Check GST Rate
          </a>
          <a href="/hq/api-keys" className="px-4 py-3 bg-[#141414] border border-[#262626] rounded-xl text-sm text-[#a1a1aa] hover:text-[#ededed] transition-colors text-center">
            Manage API Keys
          </a>
          <a href="/hq/history" className="px-4 py-3 bg-[#141414] border border-[#262626] rounded-xl text-sm text-[#a1a1aa] hover:text-[#ededed] transition-colors text-center">
            View History
          </a>
          <a href="/hq/billing" className="px-4 py-3 bg-[#141414] border border-[#262626] rounded-xl text-sm text-[#a1a1aa] hover:text-[#ededed] transition-colors text-center">
            Billing & Plan
          </a>
        </div>
      </div>

      {/* Status */}
      <div className="mt-6 flex items-center gap-3 text-xs text-[#52525b] mono">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#10b981]" />
        System Nominal
        {data?.dataVersion && <span>· Data: {data.dataVersion}</span>}
        {data?.lastLookup && <span>· Last lookup: {data.lastLookup}</span>}
      </div>
    </div>
  );
}
