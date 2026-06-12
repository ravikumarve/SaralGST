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

  const handleLanguageToggle = () => {
    setLanguage((prev) => (prev === 'en' ? 'hi' : 'en'));
  };

  const handleModeToggle = () => {
    setMode((prev) => (prev === 'product' ? 'hsn' : 'product'));
    setQuery('');
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
      <div className="gradient-border rounded-xl">
        <div
          className={`relative bg-[#040814] rounded-xl border ${
            loading
              ? 'border-transparent'
              : 'border-[#262626] focus-within:border-[#404040]'
          } transition-colors duration-200 overflow-hidden`}
        >
          {/* Scanline loading animation */}
          {loading && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00f0ff] to-transparent animate-scanline" />
            </div>
          )}

          {/* Controls Group */}
          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 z-10">
            {/* Language toggle — L3 tag-violet pill */}
            <button
              type="button"
              onClick={handleLanguageToggle}
              className="tag-violet !text-[10px] !px-2 !py-1 hover:bg-[rgba(157,0,255,0.2)] transition-colors"
            >
              {language === 'en' ? 'EN' : 'हिं'}
            </button>

            {/* Mode toggle — L3 tag-emerald pill */}
            <button
              type="button"
              onClick={handleModeToggle}
              className="tag-emerald !text-[10px] !px-2 !py-1 hover:bg-[rgba(0,255,102,0.2)] transition-colors"
            >
              {mode === 'product' ? 'Product' : 'HSN'}
            </button>
          </div>

          {/* Input */}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={getPlaceholder()}
            maxLength={200}
            disabled={loading}
            className={`w-full pl-28 pr-16 py-4 bg-transparent text-[#f0f0ff] placeholder-[#4a4a5a] focus:outline-none text-base transition-all ${
              mode === 'hsn' ? 'font-jetbrains-mono' : 'font-inter'
            }`}
          />

          {/* Submit button — L1 gradient */}
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-2 bg-gradient-to-r from-[#00f0ff] to-[#8a2be2] text-black font-bold text-sm rounded-lg hover:shadow-lg hover:shadow-[#00f0ff]/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
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
      <div className="text-right mt-2 text-xs text-[#4a4a5a] font-jetbrains-mono">
        {query.length}/200
      </div>
    </form>
  );
}
