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
              : 'text-[#f8f9fa] bg-[rgba(255,255,255,0.08)] border-[rgba(255,255,255,0.15)]'
          }`}>
            {isDown ? '↓' : '↑'} {getMovementLabel()} {getRateChange()}
          </span>
        </div>
      )}

      {/* Bar visualization */}
      <div className="relative h-16 bg-[#050505] rounded-[8px] overflow-hidden mb-4 border border-[rgba(255,255,255,0.06)]">
        {/* Old rate bar */}
        <div
          className="absolute left-0 top-0 h-full bg-[#0a0a0a] border-r border-[rgba(255,255,255,0.06)] flex items-center justify-end pr-3 transition-all duration-700 ease-out"
          style={{ width: animated ? `${Math.max(result.old_rate, 5)}%` : '0%' }}
        >
          <span className="mono text-sm font-bold text-[#a1a1aa]">{result.old_rate}%</span>
        </div>

        {/* New rate bar */}
        <div
          className={`absolute left-0 top-0 h-full flex items-center justify-end pr-3 transition-all duration-700 ease-out ${
            isDown ? 'bg-[rgba(16,185,129,0.15)]' : isUp ? 'bg-[rgba(255,255,255,0.1)]' : 'bg-[rgba(255,255,255,0.05)]'
          }`}
          style={{
            width: animated ? `${Math.max(result.new_rate, 5)}%` : '0%',
            transitionDelay: '200ms',
          }}
        >
          <span className={`mono text-sm font-bold ${
            isDown ? 'text-[#10b981]' : isUp ? 'text-[#f8f9fa]' : 'text-[#f8f9fa]'
          }`}>
            {result.new_rate}%
          </span>
        </div>

        {/* Labels */}
        <div className="absolute bottom-1 left-2 mono text-[10px] text-[#a1a1aa]">Old</div>
        <div className="absolute bottom-1 right-2 mono text-[10px] text-[#a1a1aa]">New</div>
      </div>

      {/* Summary */}
      <div className="text-center text-sm text-[#a1a1aa]">
        {changed ? (
          <p>
            Rate changed from{' '}
            <span className="font-bold text-[#f8f9fa]">{result.old_rate}%</span>
            {' '}to{' '}
            <span className={`font-bold ${
              isDown ? 'text-[#10b981]' : isUp ? 'text-[#f8f9fa]' : 'text-[#f8f9fa]'
            }`}>
              {result.new_rate}%
            </span>
          </p>
        ) : (
          <p>Rate unchanged at <span className="font-bold text-[#f8f9fa]">{result.new_rate}%</span></p>
        )}
      </div>
    </div>
  );
}
