'use client';

import { LookupResponse } from '@/lib/api';

interface ResultCardProps {
  result: LookupResponse;
}

export default function ResultCard({ result }: ResultCardProps) {
  const isDown = result.movement === 'down';
  const isUp = result.movement === 'up';

  const getMovementLabel = () => {
    switch (result.movement) {
      case 'down': return 'DOWN ↓';
      case 'up': return 'UP ↑';
      case 'unchanged': return 'SAME →';
      case 'new_exempt': return 'EXEMPT';
      default: return '';
    }
  };

  return (
    <div className="w-full max-w-2xl bg-[#0d0d0d] border border-[#262626] rounded-xl p-6 md:p-8">
      {/* Header row */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <span className="mono text-sm text-[#F59E0B]">
            HSN: {result.hsn_code}
          </span>
          {result.category && (
            <span className="mono text-[10px] text-[#FBBF24] bg-[rgba(251,191,36,0.1)] px-2 py-0.5 rounded-full border border-[rgba(251,191,36,0.3)]">
              {result.category}
            </span>
          )}
        </div>
        {result.rate_changed && (
          <span className={`mono text-[10px] px-2 py-0.5 rounded-full border ${
            isDown
              ? 'text-[#10b981] bg-[rgba(16,185,129,0.1)] border-[rgba(16,185,129,0.3)]'
              : 'text-[#FBBF24] bg-[rgba(251,191,36,0.1)] border-[rgba(251,191,36,0.3)]'
          }`}>
            {getMovementLabel()}
          </span>
        )}
      </div>

      {/* Description */}
      <h3 className="text-xl font-semibold text-[#ededed] mb-1">
        {result.description}
      </h3>
      {result.description_hi && (
        <p className="text-base text-[#a1a1aa] mb-6">{result.description_hi}</p>
      )}

      {/* Rate comparison */}
      <div className="flex items-center justify-between mb-6 p-5 bg-[#141414] rounded-xl border border-[#262626]">
        <div className="text-center flex-1">
          <div className="mono text-xs text-[#71717a] mb-2 uppercase tracking-wider">
            Pehle
          </div>
          <div className="text-3xl md:text-4xl font-bold text-[#71717a] line-through">
            {result.old_rate}%
          </div>
          <div className="mono text-[10px] text-[#71717a] mt-1">old</div>
        </div>

        <div className="flex-1 text-center">
          <div className={`text-lg font-bold ${
            isDown ? 'text-[#10b981]' : isUp ? 'text-[#FBBF24]' : 'text-[#71717a]'
          }`}>
            {getMovementLabel()}
          </div>
          <div className="mono text-[10px] text-[#71717a] mt-1">
            {result.rate_changed ? 'Changed' : 'Unchanged'}
          </div>
        </div>

        <div className="text-center flex-1">
          <div className="mono text-xs text-[#71717a] mb-2 uppercase tracking-wider">
            Ab
          </div>
          <div className={`text-4xl md:text-5xl font-bold ${
            isDown ? 'text-[#10b981]' : isUp ? 'text-[#FBBF24]' : 'text-[#ededed]'
          }`}>
            {result.new_rate}%
          </div>
          <div className="mono text-[10px] text-[#71717a] mt-1">GST 2.0</div>
        </div>
      </div>

      {/* Notification reference */}
      <div className="border-l-2 border-[#F59E0B] pl-4 py-1 mb-4">
        <div className="mono text-xs text-[#71717a] uppercase tracking-wider mb-1 font-medium">
          Notification Reference
        </div>
        <div className="text-sm text-[#ededed]">{result.notification_ref}</div>
        <div className="mono text-[10px] text-[#71717a] mt-1">
          Effective: September 22, 2025
        </div>
      </div>

      {/* Notes */}
      {result.notes && (
        <div className="border-l-2 border-[#FBBF24] pl-4 py-1 mb-4">
          <div className="mono text-xs text-[#71717a] uppercase tracking-wider mb-1 font-medium">
            Notes
          </div>
          <div className="text-sm text-[#ededed]">{result.notes}</div>
        </div>
      )}

      {/* Warning */}
      {result.warning && (
        <div className="border-l-2 border-[#FBBF24] pl-4 py-1 mb-4 bg-[rgba(251,191,36,0.05)] rounded-r-lg">
          <div className="mono text-xs text-[#FBBF24] uppercase tracking-wider mb-1 font-medium">
            Warning
          </div>
          <div className="text-sm text-[#FBBF24]">{result.warning}</div>
        </div>
      )}

      {/* Bottom info */}
      <div className="flex items-center justify-between mt-5 pt-4 border-t border-[#262626]">
        {result.interpreted_from && (
          <div className="mono text-[10px] text-[#71717a]">
            Interpreted from: {result.interpreted_from}
          </div>
        )}
        <span className="mono text-[10px] text-[#FBBF24] bg-[rgba(251,191,36,0.1)] px-2 py-0.5 rounded-full border border-[rgba(251,191,36,0.3)] ml-auto">
          Confidence: {result.confidence.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
