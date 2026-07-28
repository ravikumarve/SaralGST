'use client';

import { useState, useEffect, useRef } from 'react';
import { storageManager } from '@/lib/storage';

interface UsageCounterProps {
  onLimitReached?: () => void;
}

export default function UsageCounter({ onLimitReached }: UsageCounterProps) {
  const mountedRef = useRef(false);
  const [remaining] = useState<number>(
    () => typeof window !== 'undefined' ? storageManager.getRemainingLookups() : 3
  );
  const [tier] = useState<'free' | 'paid' | 'ca_firm'>(
    () => typeof window !== 'undefined' ? storageManager.getTier() : 'free'
  );

  useEffect(() => {
    mountedRef.current = true;
  }, []);

  useEffect(() => {
    if (mountedRef.current && remaining === 0 && tier === 'free' && onLimitReached) {
      onLimitReached();
    }
  }, [remaining, tier, onLimitReached]);

  if (tier !== 'free') {
    return null;
  }

  const total = 3;
  const used = total - remaining;
  const percentage = (used / total) * 100;
  const isLimitReached = remaining === 0;

  return (
    <div className="fixed top-4 right-4" style={{ zIndex: 'var(--z-tooltip)' }}>
      <div className="bg-[#0d0d0d] border border-[#262626] rounded-lg p-3.5 shadow-lg shadow-black/40">
        <div className="flex items-center gap-3 mb-2.5">
          <span
            className={`w-2 h-2 rounded-full ${
              isLimitReached ? 'bg-[#a5b4fc]' : 'bg-[#10b981]'
            }`}
          />
          <div className="mono text-sm text-[#71717a]">
            {used}/{total} lookups
          </div>
          {isLimitReached && (
            <span className="mono text-[10px] text-[#a5b4fc] bg-[rgba(165,180,252,0.1)] px-2 py-0.5 rounded-full border border-[rgba(165,180,252,0.3)]">
              Limit Reached
            </span>
          )}
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-[#141414] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${
              isLimitReached ? 'bg-[#a5b4fc]' : 'bg-[#6366F1]'
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
