'use client';

import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';

export default function UsagePage() {
  const [daily, setDaily] = useState<{ date: string; count: number }[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/hq/usage')
      .then((r) => r.json())
      .then((data) => {
        setDaily(data.daily || []);
        setTotal(data.total || 0);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  return (
    <div>
      <div className="mb-12">
        <span className="font-mono text-xs uppercase tracking-[2px] text-[#52525b]">USAGE</span>
        <h1 className="font-[var(--font-serif)] text-[1.8rem] text-[#f8f9fa] tracking-[0.02em] mt-2">Lookup Activity</h1>
        <p className="text-[#a1a1aa] text-sm mt-2 font-light">Your API usage over time</p>
      </div>

      <div className="hq-card p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-semibold text-[#f8f9fa]">Daily Lookups</h2>
          <span className="text-xs text-[#a1a1aa] mono">{total} total</span>
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center text-[#a1a1aa] text-sm">Loading chart...</div>
        ) : daily.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-[#a1a1aa] text-sm border border-dashed border-[#262626] rounded-xl bg-[rgba(10,10,10,0.4)] backdrop-blur-sm">
            No usage data yet. Start making lookups to see activity here.
          </div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={daily}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                <XAxis dataKey="date" tick={{ fill: '#a1a1aa', fontSize: 11 }} stroke="#262626" />
                <YAxis allowDecimals={false} tick={{ fill: '#a1a1aa', fontSize: 11 }} stroke="#262626" />
                <Tooltip
                  contentStyle={{ background: '#0a0a0a', border: '1px solid #262626', borderRadius: 12, fontSize: 12 }}
                  labelStyle={{ color: '#f8f9fa' }}
                />
                <Bar dataKey="count" fill="#f8f9fa" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Requests', value: total, color: '#f8f9fa' },
          { label: 'Avg Daily', value: daily.length > 0 ? Math.round(total / Math.max(daily.length, 1)) : 0, color: '#10b981' },
          { label: 'Peak Day', value: daily.length > 0 ? Math.max(...daily.map((d) => d.count)) : 0, color: '#f8f9fa' },
        ].map((s) => (
          <div key={s.label} className="hq-stat">
            <div className="text-2xl font-bold text-[#f8f9fa]" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs text-[#a1a1aa] mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
