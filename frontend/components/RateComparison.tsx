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
      {/* Movement badge — L3 tag */}
      {changed && (
        <div className="flex items-center justify-center mb-4">
          <span className={`${isDown ? 'tag-emerald' : 'tag-violet'} !px-4 !py-1.5`}>
            <span className="mr-1">{isDown ? '↓' : '↑'}</span>
            {getMovementLabel()} {getRateChange()}
          </span>
        </div>
      )}

      {/* Bar visualization — L2 style */}
      <div className="relative h-16 bg-[#040814] rounded-xl overflow-hidden mb-4 border border-[#262626]">
        {/* Old rate bar */}
        <div
          className="absolute left-0 top-0 h-full bg-[#0d0d0d] border-r border-[#262626] flex items-center justify-end pr-3 transition-all duration-700 ease-out"
          style={{ width: animated ? `${Math.max(result.old_rate, 5)}%` : '0%' }}
        >
          <span className="text-sm font-bold text-[#71717a] font-jetbrains-mono">{result.old_rate}%</span>
        </div>

        {/* New rate bar */}
        <div
          className={`absolute left-0 top-0 h-full ${
            isDown ? 'bg-[#10b981]/30' : isUp ? 'bg-[#ff3366]/30' : 'bg-[#00f0ff]/20'
          } flex items-center justify-end pr-3 transition-all duration-700 ease-out`}
          style={{
            width: animated ? `${Math.max(result.new_rate, 5)}%` : '0%',
            transitionDelay: '200ms',
          }}
        >
          <span className={`text-sm font-bold font-jetbrains-mono ${
            isDown ? 'text-[#10b981]' : isUp ? 'text-[#ff3366]' : 'text-[#00f0ff]'
          }`}>
            {result.new_rate}%
          </span>
        </div>

        {/* Labels */}
        <div className="absolute bottom-1 left-2 text-[10px] text-[#4a4a5a] font-jetbrains-mono">Old</div>
        <div className="absolute bottom-1 right-2 text-[10px] text-[#4a4a5a] font-jetbrains-mono">New</div>
      </div>

      {/* Summary — L2 muted */}
      <div className="text-center text-sm text-[#71717a]">
        {changed ? (
          <p>
            Rate changed from{' '}
            <span className="font-bold text-[#f0f0ff]">{result.old_rate}%</span>
            {' '}to{' '}
            <span className={`font-bold ${isDown ? 'text-[#10b981]' : isUp ? 'text-[#ff3366]' : 'text-[#f0f0ff]'}`}>
              {result.new_rate}%
            </span>
          </p>
        ) : (
          <p>Rate unchanged at <span className="font-bold text-[#f0f0ff]">{result.new_rate}%</span></p>
        )}
      </div>
    </div>
  );
}
