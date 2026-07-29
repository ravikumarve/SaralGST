'use client';

import { useEffect, useState } from 'react';

interface ApiKey {
  id: string;
  key: string;
  label: string | null;
  tier: string;
  active: boolean;
  lastUsed: string | null;
  createdAt: string;
}

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [label, setLabel] = useState('');
  const [generatedKey, setGeneratedKey] = useState('');

  useEffect(() => {
    let cancelled = false;
    fetch('/api/hq/api-keys').then(res => res.json()).then(data => {
      if (!cancelled) {
        setKeys(data.keys);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, []);

  const refetchKeys = () => {
    fetch('/api/hq/api-keys').then(res => res.json()).then(data => {
      setKeys(data.keys);
      setLoading(false);
    });
  };

  const generateKey = async () => {
    const res = await fetch('/api/hq/api-keys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ label: label || 'Untitled Key', tier: 'paid' }),
    });
    const data = await res.json();
    setGeneratedKey(data.key);
    setShowNew(false);
    setLabel('');
    refetchKeys();
  };

  const revokeKey = async (id: string) => {
    await fetch(`/api/hq/api-keys?id=${id}`, { method: 'DELETE' });
    refetchKeys();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-12">
        <div>
          <span className="font-mono text-xs uppercase tracking-[2px] text-[#52525b]">API KEYS</span>
          <h1 className="font-[var(--font-serif)] text-[1.8rem] text-[#f8f9fa] tracking-[0.02em] mt-2">Manage Keys</h1>
          <p className="text-[#a1a1aa] text-sm mt-2 font-light">Your HMAC tokens for API access</p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="inline-flex items-center gap-2 px-[1.5rem] py-[0.6rem] text-sm font-medium rounded-[4px] uppercase tracking-[1px] border border-[#f8f9fa] bg-[#f8f9fa] text-[#000000] hover:bg-transparent hover:text-[#f8f9fa] transition-all duration-200 shrink-0"
        >
          + New Key
        </button>
      </div>

      {/* Generate new key modal */}
      {showNew && (
        <div className="mb-8 bg-[#0a0a0a] border border-[rgba(255,255,255,0.06)] rounded-[8px] p-8">
          <h3 className="font-[var(--font-serif)] text-lg text-[#f8f9fa] mb-6">Generate New API Key</h3>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g., Production Server"
            className="w-full px-4 py-3 bg-[#050505] border border-[rgba(255,255,255,0.06)] rounded-lg text-[#f8f9fa] placeholder-[#a1a1aa] focus:outline-none focus:border-[rgba(255,255,255,0.12)] transition-colors mb-4 text-sm"
          />
          <div className="flex gap-3">
            <button onClick={generateKey} className="inline-flex items-center gap-2 px-[1.5rem] py-[0.6rem] text-sm font-medium rounded-[4px] uppercase tracking-[1px] border border-[#f8f9fa] bg-[#f8f9fa] text-[#000000] hover:bg-transparent hover:text-[#f8f9fa] transition-all duration-200">
              Generate
            </button>
            <button onClick={() => setShowNew(false)} className="px-[1.5rem] py-[0.6rem] text-sm text-[#a1a1aa] hover:text-[#f8f9fa] transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Show generated key */}
      {generatedKey && (
        <div className="mb-8 bg-[#0a0a0a] border border-[#10b981] rounded-[8px] p-8">
          <p className="text-sm text-[#10b981] mb-2 font-medium">Key generated! Copy it now &mdash; you won&apos;t see it again.</p>
          <div className="flex gap-3">
            <code className="flex-1 px-4 py-3 bg-[#050505] border border-[rgba(255,255,255,0.06)] rounded-lg text-sm text-[#f8f9fa] font-mono break-all">
              {generatedKey}
            </code>
            <button
              onClick={() => { navigator.clipboard.writeText(generatedKey); setGeneratedKey(''); }}
              className="inline-flex items-center gap-2 px-[1.5rem] py-[0.6rem] text-sm font-medium rounded-[4px] uppercase tracking-[1px] border border-[#f8f9fa] bg-[#f8f9fa] text-[#000000] hover:bg-transparent hover:text-[#f8f9fa] transition-all duration-200"
            >
              Copy
            </button>
          </div>
        </div>
      )}

      {/* Keys list */}
      {loading ? (
        <div className="text-[#a1a1aa] text-sm">Loading keys...</div>
      ) : keys.length === 0 ? (
        <div className="text-[#a1a1aa] text-sm py-12 text-center border border-dashed border-[rgba(255,255,255,0.06)] rounded-[8px] bg-[#050505]">
          No API keys yet. Generate your first key to get started.
        </div>
      ) : (
        <div className="space-y-3">
          {keys.map((k) => (
            <div key={k.id} className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.06)] rounded-[8px] p-5 flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className={`w-2 h-2 rounded-full ${k.active ? 'bg-[#10b981]' : 'bg-[#52525b]'}`} />
                  <span className="text-sm font-medium text-[#f8f9fa]">{k.label || 'Untitled'}</span>
                  <span className="font-mono text-[10px] uppercase tracking-[1px] text-[#52525b] bg-[rgba(255,255,255,0.05)] px-2 py-0.5 rounded-full">{k.tier}</span>
                </div>
                <code className="font-mono text-xs text-[#52525b] truncate block">{k.key.slice(0, 48)}...</code>
                <div className="text-[10px] text-[#52525b] mt-1 font-mono">
                  {k.lastUsed ? `Last used: ${new Date(k.lastUsed).toLocaleDateString()}` : 'Never used'}
                  {' · '}Created {new Date(k.createdAt).toLocaleDateString()}
                </div>
              </div>
              <button
                onClick={() => revokeKey(k.id)}
                className="px-3 py-1.5 text-xs text-[#a1a1aa] hover:text-[#f8f9fa] transition-colors"
              >
                Revoke
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
