'use client';

import { useState, useEffect } from 'react';
import { LookupResponse } from '@/lib/api';

interface RateComparisonProps {
  result: LookupResponse;
}

export default function RateComparison({ result }: RateComparisonProps) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const isDown = result.movement === 'down';
  const isUp = result.movement === 'up';
  const changed = result.rate_changed;

  const getMovementLabel = () => {
    switch (result.movement) {
      case 'down': return 'Down';
      case 'up': return 'Up';
      case 'new_exempt': return 'Exempt';
      default: return 'No change';
    }
  };

  const getRateChange = () => {
    if (!changed) return null;
    const change = result.new_rate - result.old_rate;
    const sign = change > 0 ? '+' : '';
    return `${sign}${change}%`;
  };

  return (
    <div className="w-full">
      {/* Movement badge */}
      {changed && (
        <div className="flex items-center justify-center mb-4">
          <span className={`mono text-xs px-3 py-1 rounded-full border ${
            isDown
              ? 'text-[#10b981] bg-[rgba(16,185,129,0.1)] border-[rgba(16,185,129,0.3)]'
              : 'text-[#FBBF24] bg-[rgba(251,191,36,0.1)] border-[rgba(251,191,36,0.3)]'
          }`}>
            {isDown ? '↓' : '↑'} {getMovementLabel()} {getRateChange()}
          </span>
        </div>
      )}

      {/* Bar visualization */}
      <div className="relative h-16 bg-[#141414] rounded-xl overflow-hidden mb-4 border border-[#262626]">
        {/* Old rate bar */}
        <div
          className="absolute left-0 top-0 h-full bg-[#0d0d0d] border-r border-[#262626] flex items-center justify-end pr-3 transition-all duration-700 ease-out"
          style={{ width: animated ? `${Math.max(result.old_rate, 5)}%` : '0%' }}
        >
          <span className="mono text-sm font-bold text-[#71717a]">{result.old_rate}%</span>
        </div>

        {/* New rate bar */}
        <div
          className={`absolute left-0 top-0 h-full flex items-center justify-end pr-3 transition-all duration-700 ease-out ${
            isDown ? 'bg-[rgba(16,185,129,0.2)]' : isUp ? 'bg-[rgba(251,191,36,0.2)]' : 'bg-[rgba(245,158,11,0.1)]'
          }`}
          style={{
            width: animated ? `${Math.max(result.new_rate, 5)}%` : '0%',
            transitionDelay: '200ms',
          }}
        >
          <span className={`mono text-sm font-bold ${
            isDown ? 'text-[#10b981]' : isUp ? 'text-[#FBBF24]' : 'text-[#F59E0B]'
          }`}>
            {result.new_rate}%
          </span>
        </div>

        {/* Labels */}
        <div className="absolute bottom-1 left-2 mono text-[10px] text-[#71717a]">Old</div>
        <div className="absolute bottom-1 right-2 mono text-[10px] text-[#71717a]">New</div>
      </div>

      {/* Summary */}
      <div className="text-center text-sm text-[#71717a]">
        {changed ? (
          <p>
            Rate changed from{' '}
            <span className="font-bold text-[#ededed]">{result.old_rate}%</span>
            {' '}to{' '}
            <span className={`font-bold ${
              isDown ? 'text-[#10b981]' : isUp ? 'text-[#FBBF24]' : 'text-[#ededed]'
            }`}>
              {result.new_rate}%
            </span>
          </p>
        ) : (
          <p>Rate unchanged at <span className="font-bold text-[#ededed]">{result.new_rate}%</span></p>
        )}
      </div>
    </div>
  );
}
