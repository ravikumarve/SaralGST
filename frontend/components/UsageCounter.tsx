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

  useEffect(() => {
    setMounted(true);
    setRemaining(storageManager.getRemainingLookups());
    setTier(storageManager.getTier());
  }, []);

  useEffect(() => {
    if (mounted && remaining === 0 && tier === 'free' && onLimitReached) {
      onLimitReached();
    }
  }, [remaining, tier, mounted, onLimitReached]);

  if (!mounted || tier !== 'free') {
    return null;
  }

  const total = 3;
  const used = total - remaining;
  const percentage = (used / total) * 100;
  const isLimitReached = remaining === 0;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-[#0d0d0d] border border-[#262626] rounded-lg p-3.5 shadow-lg shadow-black/40">
        <div className="flex items-center gap-3 mb-2.5">
          <span
            className={`w-2 h-2 rounded-full ${
              isLimitReached ? 'bg-[#8a2be2]' : 'bg-[#10b981]'
            }`}
          />
          <div className="mono text-sm text-[#71717a]">
            {used}/{total} lookups
          </div>
          {isLimitReached && (
            <span className="mono text-[10px] text-[#8a2be2] bg-[rgba(138,43,226,0.1)] px-2 py-0.5 rounded-full border border-[rgba(138,43,226,0.3)]">
              Limit Reached
            </span>
          )}
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-[#141414] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${
              isLimitReached ? 'bg-[#8a2be2]' : 'bg-[#00f0ff]'
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>

        <div className="mt-2 text-[10px] text-[#71717a] mono">
          Resets at midnight
        </div>
      </div>
    </div>
  );
}
