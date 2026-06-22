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

  const fetchKeys = async () => {
    const res = await fetch('/api/hq/api-keys');
    const data = await res.json();
    setKeys(data.keys);
    setLoading(false);
  };

  useEffect(() => { fetchKeys(); }, []);

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
    fetchKeys();
  };

  const revokeKey = async (id: string) => {
    await fetch(`/api/hq/api-keys?id=${id}`, { method: 'DELETE' });
    fetchKeys();
  };

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#ededed]">API Keys</h1>
          <p className="text-[#71717a] text-sm mt-1">Manage your HMAC tokens for API access</p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="px-5 py-2.5 bg-[#F59E0B] text-[#020202] font-bold rounded-xl hover:bg-[#FBBF24] transition-colors text-sm"
        >
          + New Key
        </button>
      </div>

      {/* Generate new key modal */}
      {showNew && (
        <div className="mb-6 bg-[#0a0a0a] border border-[#262626] rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-[#ededed] mb-4">Generate New API Key</h3>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g., Production Server"
            className="w-full px-4 py-3 bg-[#141414] border border-[#262626] rounded-xl text-[#ededed] placeholder-[#71717a] focus:outline-none focus:border-[#F59E0B]/40 transition-colors mb-4"
          />
          <div className="flex gap-3">
            <button onClick={generateKey} className="px-5 py-2.5 bg-[#F59E0B] text-[#020202] font-bold rounded-xl hover:bg-[#FBBF24] transition-colors text-sm">
              Generate
            </button>
            <button onClick={() => setShowNew(false)} className="px-5 py-2.5 bg-[#141414] text-[#a1a1aa] rounded-xl hover:text-[#ededed] transition-colors text-sm">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Show generated key */}
      {generatedKey && (
        <div className="mb-6 bg-[rgba(245,158,11,0.08)] border border-[rgba(245,158,11,0.3)] rounded-2xl p-6">
          <p className="text-sm text-[#F59E0B] mb-2">Key generated! Copy it now — you won't see it again.</p>
          <div className="flex gap-3">
            <code className="flex-1 px-4 py-3 bg-[#020202] border border-[#262626] rounded-xl text-sm text-[#FBBF24] mono break-all">
              {generatedKey}
            </code>
            <button
              onClick={() => { navigator.clipboard.writeText(generatedKey); setGeneratedKey(''); }}
              className="px-4 py-3 bg-[#F59E0B] text-[#020202] font-bold rounded-xl hover:bg-[#FBBF24] transition-colors text-sm"
            >
              Copy
            </button>
          </div>
        </div>
      )}

      {/* Keys list */}
      {loading ? (
        <div className="text-[#71717a] text-sm">Loading keys...</div>
      ) : keys.length === 0 ? (
        <div className="text-[#71717a] text-sm py-12 text-center border border-dashed border-[#262626] rounded-2xl">
          No API keys yet. Generate your first key to get started.
        </div>
      ) : (
        <div className="space-y-3">
          {keys.map((k) => (
            <div key={k.id} className="bg-[#0a0a0a] border border-[#262626] rounded-2xl p-5 flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className={`w-2 h-2 rounded-full ${k.active ? 'bg-[#10b981]' : 'bg-[#71717a]'}`} />
                  <span className="text-sm font-medium text-[#ededed]">{k.label || 'Untitled'}</span>
                  <span className="mono text-[10px] uppercase text-[#F59E0B] bg-[rgba(245,158,11,0.1)] px-2 py-0.5 rounded-full">{k.tier}</span>
                </div>
                <code className="mono text-xs text-[#52525b] truncate block">{k.key.slice(0, 48)}...</code>
                <div className="text-[10px] text-[#52525b] mt-1 mono">
                  {k.lastUsed ? `Last used: ${new Date(k.lastUsed).toLocaleDateString()}` : 'Never used'}
                  {' · '}Created {new Date(k.createdAt).toLocaleDateString()}
                </div>
              </div>
              <button
                onClick={() => revokeKey(k.id)}
                className="px-3 py-1.5 text-xs text-[#71717a] hover:text-[#FBBF24] hover:bg-[rgba(251,191,36,0.1)] rounded-lg transition-colors"
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
