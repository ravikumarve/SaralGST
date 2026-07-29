'use client';

import { useState } from 'react';

interface SearchBoxProps {
  onSearch: (query: string) => void;
  loading?: boolean;
  placeholder?: string;
}

export default function SearchBox({ onSearch, loading = false, placeholder }: SearchBoxProps) {
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [mode, setMode] = useState<'product' | 'hsn'>('product');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const getPlaceholder = () => {
    if (placeholder) return placeholder;
    if (mode === 'hsn') {
      return language === 'en'
        ? "Enter HSN code... e.g. '8517'"
        : "HSN कोड लिखें... जैसे '8517'";
    }
    return language === 'en'
      ? "Product ka naam likhein... jaise 'LED TV' ya 'cement'"
      : "उत्पाद का नाम लिखें... जैसे 'LED TV' या 'cement'";
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.06)] rounded-[8px] overflow-hidden focus-within:border-[rgba(255,255,255,0.12)] transition-colors">
        {/* Controls + Input */}
        <div className="flex items-center gap-2 pl-4 pr-2 py-2">
          {/* Language toggle */}
          <button
            type="button"
            onClick={() => setLanguage((p) => (p === 'en' ? 'hi' : 'en'))}
            className="mono text-[11px] text-[#a1a1aa] bg-[#050505] border border-[rgba(255,255,255,0.06)] px-2 py-1 rounded-[4px] hover:border-[rgba(255,255,255,0.15)] transition-colors shrink-0"
          >
            {language === 'en' ? 'EN' : 'हिं'}
          </button>

          {/* Mode toggle */}
          <button
            type="button"
            onClick={() => { setMode((p) => (p === 'product' ? 'hsn' : 'product')); setQuery(''); }}
            className="mono text-[11px] text-[#a1a1aa] bg-[#050505] border border-[rgba(255,255,255,0.06)] px-2 py-1 rounded-[4px] hover:border-[rgba(255,255,255,0.15)] transition-colors shrink-0"
          >
            {mode === 'product' ? 'Product' : 'HSN'}
          </button>

          {/* Input */}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={getPlaceholder()}
            maxLength={200}
            disabled={loading}
            className={`flex-1 px-3 py-2 bg-transparent text-[#f8f9fa] placeholder-[#a1a1aa] focus:outline-none text-base ${
              mode === 'hsn' ? 'mono font-normal' : 'font-sans'
            }`}
          />

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="shrink-0 px-4 py-2 bg-[#f8f9fa] text-[#000000] text-sm font-medium rounded-[4px] hover:bg-transparent hover:text-[#f8f9fa] border border-[#f8f9fa] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {loading ? (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Character count */}
      <div className="text-right mt-2 text-[10px] text-[#a1a1aa] mono">
        {query.length}/200
      </div>
    </form>
  );
}
