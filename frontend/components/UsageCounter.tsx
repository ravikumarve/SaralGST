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

  const total = 3;
  const used = total - remaining;
  const percentage = (used / total) * 100;

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedWidth(percentage), 300);
    return () => clearTimeout(timer);
  }, [percentage]);

  useEffect(() => {
    if (mounted && remaining === 0 && tier === 'free' && onLimitReached) {
      onLimitReached();
    }
  }, [remaining, tier, mounted, onLimitReached]);

  if (!mounted || tier !== 'free') {
    return null;
  }

  const isLimitReached = remaining === 0;

  return (
    <div className="fixed top-4 right-4 z-50">
      {/* L2 minimal panel */}
      <div className="bg-[#0d0d0d] border border-[#262626] rounded-lg p-3.5 shadow-lg shadow-black/40">
        <div className="flex items-center gap-3 mb-2.5">
          {/* L3 glowing status dot */}
          <span
            className={`w-2 h-2 rounded-full shadow-lg ${
              isLimitReached
                ? 'bg-[#ff3366] shadow-[#ff3366]/50 animate-pulse-dot'
                : 'bg-[#00FF66] shadow-[#00FF66]/50 animate-pulse-dot'
            }`}
          />
          <div className="text-sm font-jetbrains-mono text-[#71717a]">
            {used}/{total} lookups
          </div>
          {isLimitReached && (
            <span className="text-[10px] text-[#ff3366] bg-[#ff3366]/10 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
              Limit Reached
            </span>
          )}
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-[#050508] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${
              isLimitReached ? 'bg-[#ff3366]' : 'bg-gradient-to-r from-[#00f0ff] to-[#8a2be2]'
            }`}
            style={{ width: `${Math.min(animatedWidth, 100)}%` }}
          />
        </div>

        {/* Reset info */}
        <div className="mt-2 text-[10px] text-[#4a4a5a] font-jetbrains-mono">
          Resets at midnight
        </div>
      </div>
    </div>
  );
}
