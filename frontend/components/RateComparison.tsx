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

  const getMovementColor = () => {
    switch (result.movement) {
      case 'down':
        return 'text-green border-green';
      case 'up':
        return 'text-red border-red';
      case 'new_exempt':
        return 'text-green border-green';
      default:
        return 'text-text-muted border-text-muted';
    }
  };

  const getMovementIcon = () => {
    switch (result.movement) {
      case 'down':
        return '↓';
      case 'up':
        return '↑';
      case 'new_exempt':
        return '→';
      default:
        return '→';
    }
  };

  const getMovementLabel = () => {
    switch (result.movement) {
      case 'down':
        return 'Down';
      case 'up':
        return 'Up';
      case 'new_exempt':
        return 'Exempt';
      default:
        return 'No change';
    }
  };

  const getRateChange = () => {
    if (!result.rate_changed) return null;

    const change = result.new_rate - result.old_rate;
    const sign = change > 0 ? '+' : '';
    return `${sign}${change}%`;
  };

  return (
    <div className="w-full max-w-2xl">
      {/* Movement badge */}
      {result.rate_changed && (
        <div className="flex items-center justify-center mb-4">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${getMovementColor()} bg-surface`}
          >
            <span className="text-lg">{getMovementIcon()}</span>
            <span className="font-bold">
              {getMovementLabel()} {getRateChange()}
            </span>
          </div>
        </div>
      )}

      {/* Visual comparison */}
      <div className="relative h-16 bg-bg rounded-xl overflow-hidden mb-4">
        {/* Old rate bar */}
        <div
          className="absolute left-0 top-0 h-full bg-surface border-r border-border flex items-center justify-end pr-3 transition-all duration-700 ease-out"
          style={{ width: animated ? `${Math.max(result.old_rate, 5)}%` : '0%' }}
        >
          <span className="text-sm font-bold text-text-primary">{result.old_rate}%</span>
        </div>

        {/* New rate bar */}
        <div
          className={`absolute left-0 top-0 h-full ${
            result.movement === 'down'
              ? 'bg-green/30'
              : result.movement === 'up'
              ? 'bg-red/30'
              : 'bg-accent/30'
          } flex items-center justify-end pr-3 transition-all duration-700 ease-out`}
          style={{
            width: animated ? `${Math.max(result.new_rate, 5)}%` : '0%',
            transitionDelay: '200ms',
          }}
        >
          <span
            className={`text-sm font-bold ${
              result.movement === 'down'
                ? 'text-green'
                : result.movement === 'up'
                ? 'text-red'
                : 'text-accent'
            }`}
          >
            {result.new_rate}%
          </span>
        </div>

        {/* Labels */}
        <div className="absolute bottom-1 left-2 text-xs text-text-muted">Old</div>
        <div className="absolute bottom-1 right-2 text-xs text-text-muted">New</div>
      </div>

      {/* Summary */}
      <div className="text-center text-sm text-text-secondary">
        {result.rate_changed ? (
          <p>
            Rate changed from <span className="font-bold text-text-primary">{result.old_rate}%</span> to{' '}
            <span className={`font-bold ${getMovementColor()}`}>{result.new_rate}%</span>
          </p>
        ) : (
          <p>Rate unchanged at {result.new_rate}%</p>
        )}
      </div>
    </div>
  );
}
