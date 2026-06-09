'use client';

import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import SearchBox from '@/components/SearchBox';
import ResultCard from '@/components/ResultCard';
import RateComparison from '@/components/RateComparison';
import UsageCounter from '@/components/UsageCounter';
import UpgradeModal from '@/components/UpgradeModal';
import { apiClient, LookupResponse } from '@/lib/api';
import { storageManager } from '@/lib/storage';

export default function CheckPage() {
  const [result, setResult] = useState<LookupResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (orb1Ref.current) {
      gsap.to(orb1Ref.current, {
        x: 60,
        y: -40,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }
    if (orb2Ref.current) {
      gsap.to(orb2Ref.current, {
        x: -40,
        y: 60,
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }
  }, []);

  const handleSearch = async (query: string) => {
    // Check rate limit
    if (storageManager.hasReachedDailyLimit()) {
      setShowUpgradeModal(true);
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Check if query is numeric (HSN code)
      const isNumeric = /^\d+$/.test(query);

      const response = await apiClient.lookup({
        query,
        query_type: isNumeric ? 'hsn' : 'auto',
        language: storageManager.getLanguage(),
      });

      setResult(response);

      // Increment lookups counter
      storageManager.incrementLookups();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Lookup failed';
      setError(errorMessage);

      // Check if it's a rate limit error
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
    <div className="min-h-screen flex flex-col bg-bg relative overflow-hidden">
      {/* Ambient glow orbs */}
      <div ref={orb1Ref} className="glow-orb glow-orb-1 absolute top-20 left-20" />
      <div ref={orb2Ref} className="glow-orb glow-orb-2 absolute bottom-20 right-20" />

      {/* Usage counter */}
      <UsageCounter onLimitReached={handleLimitReached} />

      {/* Main content */}
      <main className="relative z-10 flex flex-col items-center justify-center px-6 py-20 w-full max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-bold font-space-grotesk mb-8 text-center">
          <span className="text-gradient">GST Rate Checker</span>
        </h1>

        <p className="text-lg text-text-secondary mb-12 text-center max-w-2xl">
          Product ka naam likhein... jaise &apos;LED TV&apos; ya &apos;cement&apos; ya HSN code &apos;8528&apos;
        </p>

        {/* Search box */}
        <SearchBox onSearch={handleSearch} loading={loading} />

        {/* Error message */}
        {error && (
          <div className="mt-8 p-4 bg-red/10 border border-red/30 rounded-xl max-w-2xl">
            <p className="text-red text-center">{error}</p>
          </div>
        )}

        {/* Result */}
        {result && !loading && (
          <div className="mt-12 w-full">
            <ResultCard result={result} />
            <div className="mt-6">
              <RateComparison result={result} />
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
