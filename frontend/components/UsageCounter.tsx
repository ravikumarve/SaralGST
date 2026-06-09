'use client';

import { useState, useEffect } from 'react';
import { storageManager } from '@/lib/storage';

interface UsageCounterProps {
  onLimitReached?: () => void;
}

export default function UsageCounter({ onLimitReached }: UsageCounterProps) {
  const [remaining, setRemaining] = useState<number>(3);
  const [tier, setTier] = useState<'free' | 'paid' | 'ca_firm'>('free');
  const [mounted, setMounted] = useState(false);
  const [animatedWidth, setAnimatedWidth] = useState(0);

  useEffect(() => {
    setMounted(true);
    setRemaining(storageManager.getRemainingLookups());
    setTier(storageManager.getTier());
  }, []);

  // Animate progress bar after mount
  const total = 3;
  const used = total - remaining;
  const percentage = (used / total) * 100;

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedWidth(percentage), 300);
    return () => clearTimeout(timer);
  }, [percentage]);

  // Check if limit reached
  useEffect(() => {
    if (mounted && remaining === 0 && tier === 'free' && onLimitReached) {
      onLimitReached();
    }
  }, [remaining, tier, mounted, onLimitReached]);

  // Don't show counter for paid tier or during SSR
  if (!mounted || tier !== 'free') {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-surface border border-border rounded-lg p-3 shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <div className="text-sm text-text-secondary">
            {used}/{total} lookups used today
          </div>
          {remaining === 0 && (
            <span className="text-xs text-red bg-red/10 px-2 py-1 rounded-full">
              Limit reached
            </span>
          )}
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-bg rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ease-out ${
              percentage >= 100
                ? 'bg-red'
                : percentage >= 66
                ? 'bg-amber'
                : 'bg-accent'
            }`}
            style={{ width: `${Math.min(animatedWidth, 100)}%` }}
          />
        </div>

        {/* Reset info */}
        <div className="mt-2 text-xs text-text-muted">
          Resets at midnight
        </div>
      </div>
    </div>
  );
}
