'use client';

import { useEffect, useState } from 'react';

interface HistoryItem {
  id: string;
  query: string;
  hsnCode: string | null;
  resultRate: number | null;
  success: boolean;
  source: string;
  createdAt: string;
}

export default function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/hq/history')
      .then((r) => r.json())
      .then((data) => { setItems(data.history || []); setLoading(false); })
      .catch(console.error);
  }, []);

  const filtered = search
    ? items.filter((i) =>
        i.query.toLowerCase().includes(search.toLowerCase()) ||
        i.hsnCode?.toLowerCase().includes(search.toLowerCase())
      )
    : items;

  const exportCSV = () => {
    const header = 'Query,HSN Code,Rate,Success,Source,Date\n';
    const rows = filtered.map((i) =>
      `"${i.query}","${i.hsnCode || ''}",${i.resultRate ?? ''},${i.success},${i.source},"${new Date(i.createdAt).toISOString()}"`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `saralgst-history-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#ededed]">History</h1>
          <p className="text-[#71717a] text-sm mt-1">All your GST rate lookups</p>
        </div>
        <button
          onClick={exportCSV}
          className="px-4 py-2 bg-[#141414] border border-[#262626] rounded-xl text-sm text-[#a1a1aa] hover:text-[#ededed] transition-colors"
        >
          Export CSV
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by product name or HSN code..."
        className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#262626] rounded-xl text-[#ededed] placeholder-[#71717a] focus:outline-none focus:border-[#F59E0B]/40 transition-colors mb-6"
      />

      {loading ? (
        <div className="text-[#71717a] text-sm">Loading history...</div>
      ) : filtered.length === 0 ? (
        <div className="text-[#71717a] text-sm py-12 text-center border border-dashed border-[#262626] rounded-2xl">
          {search ? 'No results match your search.' : 'No lookups yet. Head to the check page to get started.'}
        </div>
      ) : (
        <div className="bg-[#0a0a0a] border border-[#262626] rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#262626]">
                <th className="text-left px-5 py-3 text-[#71717a] font-medium">Query</th>
                <th className="text-left px-5 py-3 text-[#71717a] font-medium">HSN</th>
                <th className="text-left px-5 py-3 text-[#71717a] font-medium">Rate</th>
                <th className="text-left px-5 py-3 text-[#71717a] font-medium">Source</th>
                <th className="text-left px-5 py-3 text-[#71717a] font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="border-b border-[#262626] last:border-0 hover:bg-[#141414] transition-colors">
                  <td className="px-5 py-4 text-[#ededed]">{item.query}</td>
                  <td className="px-5 py-4 text-[#a1a1aa] mono">{item.hsnCode || '—'}</td>
                  <td className="px-5 py-4">
                    {item.resultRate != null ? (
                      <span className="mono text-[#F59E0B]">{item.resultRate}%</span>
                    ) : (
                      <span className="text-[#71717a]">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span className="mono text-[10px] uppercase text-[#52525b]">{item.source}</span>
                  </td>
                  <td className="px-5 py-4 text-[#71717a] text-xs mono">
                    {new Date(item.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
