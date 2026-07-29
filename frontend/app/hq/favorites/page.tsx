'use client';

import { useEffect, useState } from 'react';

interface Favorite {
  id: string;
  hsnCode: string;
  label: string | null;
  notes: string | null;
  createdAt: string;
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [hsn, setHsn] = useState('');
  const [label, setLabel] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/hq/favorites').then(res => res.json()).then(data => {
      if (!cancelled) {
        setFavorites(data.favorites);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, []);

  const addFavorite = async () => {
    await fetch('/api/hq/favorites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hsnCode: hsn, label: label || hsn }),
    });
    setHsn('');
    setLabel('');
    setShowAdd(false);
    fetch('/api/hq/favorites').then(res => res.json()).then(data => {
      setFavorites(data.favorites);
      setLoading(false);
    });
  };

  const removeFavorite = async (id: string) => {
    await fetch(`/api/hq/favorites?id=${id}`, { method: 'DELETE' });
    fetch('/api/hq/favorites').then(res => res.json()).then(data => {
      setFavorites(data.favorites);
      setLoading(false);
    });
  };

  const quickLookup = async (hsnCode: string) => {
    window.open(`/check?q=${hsnCode}`, '_blank');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-12">
        <div>
          <span className="font-mono text-xs uppercase tracking-[2px] text-[#52525b]">FAVORITES</span>
          <h1 className="font-[var(--font-serif)] text-[1.8rem] text-[#f8f9fa] tracking-[0.02em] mt-2">Saved HSN Codes</h1>
          <p className="text-[#a1a1aa] text-sm mt-2 font-light">Quick-access codes you check often</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="px-5 py-2.5 bg-[#f8f9fa] text-[#000000] font-bold rounded-xl hover:bg-transparent hover:text-[#f8f9fa] border border-[#f8f9fa] transition-colors text-sm shrink-0"
        >
          + Add HSN
        </button>
      </div>

      {showAdd && (
        <div className="mb-6 hq-card p-6">
          <input
            type="text"
            value={hsn}
            onChange={(e) => setHsn(e.target.value)}
            placeholder="HSN code (e.g., 8528)"
            className="w-full px-4 py-3 bg-[#141414] border border-[#262626] rounded-xl text-[#f8f9fa] placeholder-[#a1a1aa] focus:outline-none focus:border-[#f8f9fa]/40 transition-colors mb-3"
          />
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Label (e.g., LED TVs)"
            className="w-full px-4 py-3 bg-[#141414] border border-[#262626] rounded-xl text-[#f8f9fa] placeholder-[#a1a1aa] focus:outline-none focus:border-[#f8f9fa]/40 transition-colors mb-4"
          />
          <div className="flex gap-3">
            <button onClick={addFavorite} className="px-5 py-2.5 bg-[#f8f9fa] text-[#000000] font-bold rounded-xl hover:bg-transparent hover:text-[#f8f9fa] border border-[#f8f9fa] transition-colors text-sm">Save</button>
            <button onClick={() => setShowAdd(false)} className="px-5 py-2.5 bg-[#141414] text-[#a1a1aa] rounded-xl hover:text-[#f8f9fa] transition-colors text-sm">Cancel</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-[#a1a1aa] text-sm">Loading favorites...</div>
      ) : favorites.length === 0 ? (
        <div className="text-[#a1a1aa] text-sm py-12 text-center border border-dashed border-[#262626] rounded-2xl bg-[rgba(10,10,10,0.4)] backdrop-blur-sm">
          No saved HSN codes yet. Save your most-checked codes for quick access.
        </div>
      ) : (
        <div className="grid gap-3">
          {favorites.map((f) => (
            <div key={f.id} className="hq-card p-5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="mono text-lg font-bold text-[#f8f9fa]">{f.hsnCode}</span>
                  <span className="text-sm text-[#f8f9fa]">{f.label}</span>
                </div>
                {f.notes && <div className="text-xs text-[#a1a1aa]">{f.notes}</div>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => quickLookup(f.hsnCode)} className="px-3 py-1.5 text-xs bg-[rgba(255,255,255,0.08)] text-[#f8f9fa] rounded-lg hover:bg-[rgba(255,255,255,0.12)] transition-colors">Lookup</button>
                <button onClick={() => removeFavorite(f.id)} className="px-3 py-1.5 text-xs text-[#a1a1aa] hover:text-[#f8f9fa] rounded-lg transition-colors">Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
