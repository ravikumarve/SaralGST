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
    setQuery(''); // Clear query when switching modes for better UX
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
      <div className="relative">
        {/* Controls Group */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 z-10">
          {/* Language toggle */}
          <button
            type="button"
            onClick={handleLanguageToggle}
            className="px-2 py-1 text-xs font-medium text-accent hover:text-accent-2 transition-colors border border-accent/30 rounded-full bg-bg/50 backdrop-blur-sm"
          >
            {language === 'en' ? 'EN' : 'हिं'}
          </button>

          {/* Mode toggle */}
          <button
            type="button"
            onClick={handleModeToggle}
            className="px-2 py-1 text-xs font-medium text-text-secondary hover:text-text-primary transition-colors border border-border rounded-full bg-bg/50 backdrop-blur-sm"
          >
            {mode === 'product' ? '📦 Product' : '🔢 HSN'}
          </button>
        </div>

        {/* Input */}
        <div className={`${loading ? 'rounded-full animate-shimmer p-[2px]' : ''}`}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={getPlaceholder()}
            maxLength={200}
            disabled={loading}
            className={`w-full pl-32 pr-24 py-4 bg-surface border ${
              loading ? 'border-transparent' : 'border-border'
            } rounded-full text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 focus:ring-offset-bg transition-all duration-200 ${
              mode === 'hsn' ? 'font-jetbrains-mono' : 'font-inter'
            }`}
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-accent hover:bg-accent-2 disabled:bg-surface disabled:text-text-muted text-white rounded-full transition-colors"
        >
          {loading ? (
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Character count */}
      <div className="text-right mt-2 text-xs text-text-muted">
        {query.length}/200
      </div>
    </form>
  );
}
