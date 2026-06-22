'use client';

import { useState } from 'react';
import SearchBox from '@/components/SearchBox';
import ResultCard from '@/components/ResultCard';
import RateComparison from '@/components/RateComparison';
import UsageCounter from '@/components/UsageCounter';
import UpgradeModal from '@/components/UpgradeModal';
import TaxCalculator from '@/components/TaxCalculator';
import { apiClient, LookupResponse } from '@/lib/api';
import { storageManager } from '@/lib/storage';

export default function CheckPage() {
  const [result, setResult] = useState<LookupResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const handleSearch = async (query: string) => {
    if (storageManager.hasReachedDailyLimit()) {
      setShowUpgradeModal(true);
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const isNumeric = /^\d+$/.test(query);
      const response = await apiClient.lookup(
        query,
        isNumeric ? 'hsn' : 'auto',
        storageManager.getLanguage(),
      );
      setResult(response);
      storageManager.incrementLookups();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Lookup failed';
      setError(errorMessage);
      if (errorMessage.includes('rate limit') || errorMessage.includes('limit')) {
        setShowUpgradeModal(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLimitReached = () => {
    setShowUpgradeModal(true);
  };

  return (
    <>
      {/* Usage counter */}
      <UsageCounter onLimitReached={handleLimitReached} />

      {/* Main content */}
      <main className="min-h-screen flex flex-col items-center justify-center w-full max-w-[1280px] mx-auto px-8 py-28 md:py-20">
        {/* Status badge */}
        <div className="status-badge mb-6">
          GST Rate Checker
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-space-grotesk text-center mb-4 text-[#ededed] leading-tight">
          GST Rate<br />
          <span className="text-accent">Checker</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base md:text-lg text-[#a1a1aa] mb-10 text-center max-w-xl leading-relaxed">
          Product ka naam likhein&hellip; jaise &apos;LED TV&apos; ya &apos;cement&apos; ya HSN code &apos;8528&apos;
        </p>

        {/* SearchBox */}
        <SearchBox onSearch={handleSearch} loading={loading} />

        {/* Error */}
        {error && (
          <div className="mt-8 p-4 border-l-2 border-[#FBBF24] bg-[rgba(251,191,36,0.05)] rounded-r-xl max-w-2xl w-full">
            <p className="text-sm text-[#FBBF24]">{error}</p>
          </div>
        )}

        {/* Results */}
        {result && !loading && (
          <div className="mt-12 w-full space-y-8">
            <ResultCard result={result} />

            <div className="grid md:grid-cols-2 gap-8">
              <div className="w-full">
                <RateComparison result={result} />
              </div>
              <div className="w-full">
                <TaxCalculator
                  gstRate={result.new_rate || 0}
                  itemName={result.description || 'Selected Item'}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Upgrade modal */}
      <UpgradeModal
        open={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />
    </>
  );
}
