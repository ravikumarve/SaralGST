'use client';

import { useEffect, useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

type Tab = 'lookup' | 'explain' | 'calculate';

interface LookupResult {
  hsn_code: string;
  description: string;
  category: string;
  new_rate: number;
  old_rate: number;
  rate_changed: boolean;
  movement: string;
  confidence: number;
  notes?: string;
}

interface ExplainResult {
  item: string;
  rate: number;
  category: string;
  explanation: string;
}

interface CalculateResult {
  base_price: number;
  gst_rate: number;
  cgst: number;
  sgst: number;
  igst: number;
  total_amount: number;
}

type ResultData = LookupResult | ExplainResult | CalculateResult | null;

const TABS: { id: Tab; label: string; method: string; path: string }[] = [
  { id: 'lookup', label: 'Lookup', method: 'GET', path: '/api/v1/gst/lookup' },
  { id: 'explain', label: 'Explain', method: 'GET', path: '/api/v1/gst/explain' },
  { id: 'calculate', label: 'Calculate', method: 'POST', path: '/api/v1/gst/calculate' },
];

export default function PlaygroundPage() {
  const [tab, setTab] = useState<Tab>('lookup');
  const [query, setQuery] = useState('');
  const [itemName, setItemName] = useState('');
  const [basePrice, setBasePrice] = useState('1000');
  const [gstRate, setGstRate] = useState('18');
  const [result, setResult] = useState<ResultData>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [rawJson, setRawJson] = useState('');

  const sendRequest = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setRawJson('');

    try {
      let url = `${API_BASE}${TABS.find((t) => t.id === tab)?.path}`;
      const options: RequestInit = { method: TABS.find((t) => t.id === tab)?.method };
      const headers: Record<string, string> = {};

      if (tab === 'lookup') {
        if (!query.trim()) { setError('Please enter a product name or HSN code'); setLoading(false); return; }
        url += `?query=${encodeURIComponent(query.trim())}&query_type=auto&language=en`;
      } else if (tab === 'explain') {
        if (!itemName.trim()) { setError('Please enter an item name'); setLoading(false); return; }
        url += `?item_name=${encodeURIComponent(itemName.trim())}`;
      } else if (tab === 'calculate') {
        const bp = parseFloat(basePrice);
        const gr = parseFloat(gstRate);
        if (isNaN(bp) || bp < 0) { setError('Base price must be a positive number'); setLoading(false); return; }
        if (isNaN(gr) || gr < 0 || gr > 100) { setError('GST rate must be between 0 and 100'); setLoading(false); return; }
        headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify({ base_price: bp, gst_rate: gr });
      }

      options.headers = headers;
      const res = await fetch(url, options);
      const data = await res.json();

      if (!res.ok) {
        const msg = data.detail?.message || data.detail?.error || data.message || JSON.stringify(data);
        setError(msg);
        setRawJson(JSON.stringify(data, null, 2));
        setLoading(false);
        return;
      }

      if (tab === 'lookup') {
        setResult(data as LookupResult);
      } else if (tab === 'explain') {
        setResult(data as ExplainResult);
      } else {
        setResult(data as CalculateResult);
      }
      setRawJson(JSON.stringify(data, null, 2));
    } catch (e: unknown) {
      const err = e instanceof Error ? e.message : 'Request failed';
      setError(err);
    }

    setLoading(false);
  };

  useEffect(() => {
    setResult(null);
    setError(null);
    setRawJson('');
  }, [tab]);

  return (
    <div className="p-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#ededed]">API Playground</h1>
        <p className="text-[#71717a] text-sm mt-1">
          Test the SaralGST API in real-time ·{' '}
          <code className="mono text-[#F59E0B] text-[11px]">{API_BASE}</code>
        </p>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-1 mb-6 bg-[#0a0a0a] border border-[#262626] rounded-2xl p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              tab === t.id
                ? 'bg-[rgba(245,158,11,0.12)] text-[#F59E0B] border border-[rgba(245,158,11,0.2)]'
                : 'text-[#71717a] hover:text-[#ededed]'
            }`}
          >
            <span className="mono text-[10px] uppercase mr-2 opacity-60">{t.method}</span>
            {t.label}
            <span className="mono text-[10px] ml-2 opacity-40">{t.path}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Input Panel */}
        <div className="lg:col-span-2 bg-[#0a0a0a] border border-[#262626] rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-[#ededed] mb-4">Request</h2>

          {/* Lookup inputs */}
          {tab === 'lookup' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-[#71717a] mb-1.5">Query <span className="text-[#F59E0B]">*</span></label>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g., Rice, LED TV, 1006, 8528"
                  className="w-full px-4 py-3 bg-[#141414] border border-[#262626] rounded-xl text-[#ededed] placeholder-[#52525b] focus:outline-none focus:border-[#F59E0B]/40 transition-colors text-sm"
                  onKeyDown={(e) => e.key === 'Enter' && sendRequest()}
                />
              </div>
              <p className="text-[10px] text-[#52525b]">
                Enter a product name (e.g., &quot;rice&quot;) or HSN code (e.g., &quot;1006&quot;). Auto-detects query type.
              </p>
            </div>
          )}

          {/* Explain inputs */}
          {tab === 'explain' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-[#71717a] mb-1.5">Item Name <span className="text-[#F59E0B]">*</span></label>
                <input
                  type="text"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="e.g., Rice, Mobile Phone, Cement"
                  className="w-full px-4 py-3 bg-[#141414] border border-[#262626] rounded-xl text-[#ededed] placeholder-[#52525b] focus:outline-none focus:border-[#F59E0B]/40 transition-colors text-sm"
                  onKeyDown={(e) => e.key === 'Enter' && sendRequest()}
                />
              </div>
              <p className="text-[10px] text-[#52525b]">
                Get a human-readable explanation of why a particular GST rate applies to an item.
              </p>
            </div>
          )}

          {/* Calculate inputs */}
          {tab === 'calculate' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-[#71717a] mb-1.5">Base Price (₹) <span className="text-[#F59E0B]">*</span></label>
                <input
                  type="number"
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                  placeholder="1000"
                  min="0"
                  className="w-full px-4 py-3 bg-[#141414] border border-[#262626] rounded-xl text-[#ededed] placeholder-[#52525b] focus:outline-none focus:border-[#F59E0B]/40 transition-colors text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-[#71717a] mb-1.5">GST Rate (%) <span className="text-[#F59E0B]">*</span></label>
                <div className="relative">
                  <input
                    type="number"
                    value={gstRate}
                    onChange={(e) => setGstRate(e.target.value)}
                    placeholder="18"
                    min="0"
                    max="100"
                    className="w-full px-4 py-3 bg-[#141414] border border-[#262626] rounded-xl text-[#ededed] placeholder-[#52525b] focus:outline-none focus:border-[#F59E0B]/40 transition-colors text-sm"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                    {[0, 5, 12, 18, 28].map((r) => (
                      <button
                        key={r}
                        onClick={() => setGstRate(String(r))}
                        className={`px-1.5 py-0.5 text-[10px] rounded ${
                          gstRate === String(r)
                            ? 'bg-[#F59E0B]/20 text-[#F59E0B]'
                            : 'text-[#52525b] hover:text-[#71717a]'
                        }`}
                      >
                        {r}%
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-[#52525b]">
                Calculates CGST, SGST, and IGST breakdown for a given price and rate.
              </p>
            </div>
          )}

          {/* Send Button */}
          <button
            onClick={sendRequest}
            disabled={loading}
            className="w-full mt-6 px-5 py-3 bg-[#F59E0B] text-[#020202] font-bold rounded-xl hover:bg-[#FBBF24] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="inline-block w-3 h-3 border-2 border-[#020202] border-t-transparent rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <span className="mono text-[10px] bg-[#020202]/20 px-1.5 py-0.5 rounded">
                  {TABS.find((t) => t.id === tab)?.method}
                </span>
                Send Request
              </>
            )}
          </button>

          {/* Quick examples */}
          <div className="mt-6 pt-4 border-t border-[#262626]">
            <p className="text-[10px] text-[#52525b] mb-2">Quick examples</p>
            <div className="flex flex-wrap gap-1.5">
              {tab === 'lookup' && ['Rice', 'Cement', 'Mobile Phone', 'Bicycle', '8528'].map((ex) => (
                <button
                  key={ex}
                  onClick={() => { setQuery(ex); setTimeout(sendRequest, 100); }}
                  className="px-2.5 py-1 text-[10px] bg-[#141414] border border-[#262626] rounded-lg text-[#71717a] hover:text-[#ededed] hover:border-[#F59E0B]/30 transition-colors mono"
                >
                  {ex}
                </button>
              ))}
              {tab === 'explain' && ['Rice', 'Cement', 'Mobile Phone'].map((ex) => (
                <button
                  key={ex}
                  onClick={() => { setItemName(ex); setTimeout(sendRequest, 100); }}
                  className="px-2.5 py-1 text-[10px] bg-[#141414] border border-[#262626] rounded-lg text-[#71717a] hover:text-[#ededed] hover:border-[#F59E0B]/30 transition-colors mono"
                >
                  {ex}
                </button>
              ))}
              {tab === 'calculate' && [
                { label: '₹1,000 @ 18%', bp: '1000', gr: '18' },
                { label: '₹500 @ 5%', bp: '500', gr: '5' },
                { label: '₹50,000 @ 28%', bp: '50000', gr: '28' },
              ].map((ex) => (
                <button
                  key={ex.label}
                  onClick={() => { setBasePrice(ex.bp); setGstRate(ex.gr); setTimeout(sendRequest, 100); }}
                  className="px-2.5 py-1 text-[10px] bg-[#141414] border border-[#262626] rounded-lg text-[#71717a] hover:text-[#ededed] hover:border-[#F59E0B]/30 transition-colors"
                >
                  {ex.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Response Panel */}
        <div className="lg:col-span-3 bg-[#0a0a0a] border border-[#262626] rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-[#ededed] mb-4">Response</h2>

          {error && (
            <div className="mb-4 p-4 bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)] rounded-xl">
              <div className="text-[#ef4444] text-sm font-medium mb-1">Error</div>
              <div className="text-[#a1a1aa] text-xs">{error}</div>
            </div>
          )}

          {/* Structured result */}
          {result && tab === 'lookup' && (
            <div className="mb-4 space-y-2">
              {(
                <>
                  <ResultRow label="HSN Code" value={(result as LookupResult).hsn_code} mono />
                  <ResultRow label="Description" value={(result as LookupResult).description} />
                  <ResultRow label="Category" value={(result as LookupResult).category} />
                  <ResultRow label="GST Rate" value={`${(result as LookupResult).new_rate}%`} gold />
                  {(result as LookupResult).rate_changed && (
                    <ResultRow
                      label="Rate Change"
                      value={`${(result as LookupResult).old_rate}% → ${(result as LookupResult).new_rate}% (${(result as LookupResult).movement})`}
                    />
                  )}
                  <ResultRow label="Confidence" value={`${Math.round((result as LookupResult).confidence * 100)}%`} />
                  {(result as LookupResult).notes && (
                    <ResultRow label="Notes" value={(result as LookupResult).notes!} />
                  )}
                </>
              )}
            </div>
          )}

          {result && tab === 'explain' && (
            <div className="mb-4 space-y-2">
              <ResultRow label="Item" value={(result as ExplainResult).item} />
              <ResultRow label="GST Rate" value={`${(result as ExplainResult).rate}%`} gold />
              <ResultRow label="Category" value={(result as ExplainResult).category} />
              <div className="mt-3 p-4 bg-[#141414] border border-[#262626] rounded-xl">
                <div className="text-[10px] text-[#52525b] mb-1.5 uppercase tracking-wider">Explanation</div>
                <div className="text-sm text-[#d4d4d8] leading-relaxed">{(result as ExplainResult).explanation}</div>
              </div>
            </div>
          )}

          {result && tab === 'calculate' && (
            <div className="mb-4 space-y-2">
              <ResultRow label="Base Price" value={`₹${(result as CalculateResult).base_price.toLocaleString()}`} />
              <ResultRow label="GST Rate" value={`${(result as CalculateResult).gst_rate}%`} />
              <div className="border-t border-[#262626] my-2" />
              <ResultRow label="CGST (50%)" value={`₹${(result as CalculateResult).cgst.toFixed(2)}`} />
              <ResultRow label="SGST (50%)" value={`₹${(result as CalculateResult).sgst.toFixed(2)}`} />
              <ResultRow label="IGST" value={`₹${(result as CalculateResult).igst.toFixed(2)}`} />
              <div className="border-t border-[#262626] my-2" />
              <ResultRow label="Total Amount" value={`₹${(result as CalculateResult).total_amount.toFixed(2)}`} gold />
            </div>
          )}

          {!result && !error && (
            <div className="py-12 text-center">
              <div className="text-3xl mb-3 opacity-20">{'</>'}</div>
              <div className="text-sm text-[#52525b]">
                {loading ? 'Sending request...' : 'Send a request to see the response'}
              </div>
            </div>
          )}

          {/* Raw JSON */}
          {(rawJson || error) && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-[#52525b] uppercase tracking-wider">Raw JSON</span>
                <button
                  onClick={() => navigator.clipboard.writeText(rawJson)}
                  className="text-[10px] text-[#71717a] hover:text-[#F59E0B] transition-colors"
                >
                  Copy
                </button>
              </div>
              <pre className="p-4 bg-[#020202] border border-[#262626] rounded-xl text-[11px] text-[#a1a1aa] mono leading-relaxed max-h-80 overflow-auto whitespace-pre-wrap">
                {rawJson || (error ? JSON.stringify({ error }, null, 2) : '')}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ResultRow({ label, value, mono, gold }: { label: string; value: string; mono?: boolean; gold?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1.5 px-3 bg-[#141414]/50 rounded-xl">
      <span className="text-[11px] text-[#71717a]">{label}</span>
      <span className={`text-sm ${gold ? 'text-[#F59E0B] font-semibold' : 'text-[#ededed]'} ${mono ? 'mono' : ''}`}>
        {value}
      </span>
    </div>
  );
}
