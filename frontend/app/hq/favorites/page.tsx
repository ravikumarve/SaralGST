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

  const fetchFavorites = async () => {
    const res = await fetch('/api/hq/favorites');
    const data = await res.json();
    setFavorites(data.favorites);
    setLoading(false);
  };

  useEffect(() => { fetchFavorites(); }, []);

  const addFavorite = async () => {
    await fetch('/api/hq/favorites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hsnCode: hsn, label: label || hsn }),
    });
    setHsn('');
    setLabel('');
    setShowAdd(false);
    fetchFavorites();
  };

  const removeFavorite = async (id: string) => {
    await fetch(`/api/hq/favorites?id=${id}`, { method: 'DELETE' });
    fetchFavorites();
  };

  const quickLookup = async (hsnCode: string) => {
    window.open(`/check?q=${hsnCode}`, '_blank');
  };

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#ededed]">Favorites</h1>
          <p className="text-[#71717a] text-sm mt-1">Quick-access HSN codes you check often</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="px-5 py-2.5 bg-[#F59E0B] text-[#020202] font-bold rounded-xl hover:bg-[#FBBF24] transition-colors text-sm"
        >
          + Add HSN
        </button>
      </div>

      {showAdd && (
        <div className="mb-6 bg-[#0a0a0a] border border-[#262626] rounded-2xl p-6">
          <input
            type="text"
            value={hsn}
            onChange={(e) => setHsn(e.target.value)}
            placeholder="HSN code (e.g., 8528)"
            className="w-full px-4 py-3 bg-[#141414] border border-[#262626] rounded-xl text-[#ededed] placeholder-[#71717a] focus:outline-none focus:border-[#F59E0B]/40 transition-colors mb-3"
          />
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Label (e.g., LED TVs)"
            className="w-full px-4 py-3 bg-[#141414] border border-[#262626] rounded-xl text-[#ededed] placeholder-[#71717a] focus:outline-none focus:border-[#F59E0B]/40 transition-colors mb-4"
          />
          <div className="flex gap-3">
            <button onClick={addFavorite} className="px-5 py-2.5 bg-[#F59E0B] text-[#020202] font-bold rounded-xl hover:bg-[#FBBF24] transition-colors text-sm">Save</button>
            <button onClick={() => setShowAdd(false)} className="px-5 py-2.5 bg-[#141414] text-[#a1a1aa] rounded-xl hover:text-[#ededed] transition-colors text-sm">Cancel</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-[#71717a] text-sm">Loading favorites...</div>
      ) : favorites.length === 0 ? (
        <div className="text-[#71717a] text-sm py-12 text-center border border-dashed border-[#262626] rounded-2xl">
          No saved HSN codes yet. Save your most-checked codes for quick access.
        </div>
      ) : (
        <div className="grid gap-3">
          {favorites.map((f) => (
            <div key={f.id} className="bg-[#0a0a0a] border border-[#262626] rounded-2xl p-5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="mono text-lg font-bold text-[#F59E0B]">{f.hsnCode}</span>
                  <span className="text-sm text-[#ededed]">{f.label}</span>
                </div>
                {f.notes && <div className="text-xs text-[#71717a]">{f.notes}</div>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => quickLookup(f.hsnCode)} className="px-3 py-1.5 text-xs bg-[rgba(245,158,11,0.1)] text-[#F59E0B] rounded-lg hover:bg-[rgba(245,158,11,0.2)] transition-colors">Lookup</button>
                <button onClick={() => removeFavorite(f.id)} className="px-3 py-1.5 text-xs text-[#71717a] hover:text-[#FBBF24] rounded-lg transition-colors">Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
