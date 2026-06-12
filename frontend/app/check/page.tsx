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
    <div className="min-h-screen flex flex-col bg-[#040814] relative">
      {/* L2 precision grid background */}
      <div className="fixed inset-0 -z-20 bg-grid opacity-40" />

      {/* L3 holographic orbs — CSS float-orb animation, no GSAP */}
      <div className="fixed -top-24 -left-24 w-[400px] h-[400px] rounded-full bg-[#8a2be2] opacity-20 blur-[80px] -z-10 animate-float-orb pointer-events-none" />
      <div className="fixed -bottom-32 -right-24 w-[500px] h-[500px] rounded-full bg-[#00FF66] opacity-15 blur-[80px] -z-10 animate-float-orb pointer-events-none" style={{ animationDelay: '-5s' }} />
      <div className="fixed top-1/3 left-1/3 w-[300px] h-[300px] rounded-full bg-[#00f0ff] opacity-10 blur-[80px] -z-10 animate-float-orb pointer-events-none" style={{ animationDelay: '-10s' }} />

      {/* Usage counter — L2 panel + L3 status dot */}
      <UsageCounter onLimitReached={handleLimitReached} />

      {/* Main content */}
      <main className="relative z-10 flex flex-col items-center justify-center px-6 py-28 md:py-20 w-full max-w-4xl mx-auto flex-1">
        {/* L3 Outfit 900 heading — brutalist */}
        <h1 className="font-outfit font-black text-5xl md:text-6xl lg:text-7xl uppercase text-center mb-4 text-[#f0f0ff] leading-tight">
          GST Rate<br />
          <span className="text-gradient">Checker</span>
        </h1>

        {/* L2 muted subtitle */}
        <p className="text-base md:text-lg text-[#71717a] mb-12 text-center max-w-xl leading-relaxed">
          Product ka naam likhein&hellip; jaise &apos;LED TV&apos; ya &apos;cement&apos; ya HSN code &apos;8528&apos;
        </p>

        {/* SearchBox */}
        <SearchBox onSearch={handleSearch} loading={loading} />

        {/* Error */}
        {error && (
          <div className="mt-8 p-4 border-l-2 border-[#ff3366] bg-[#ff3366]/5 rounded-r-xl max-w-2xl w-full">
            <p className="text-sm text-[#ff3366]">{error}</p>
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
    </div>
  );
}
