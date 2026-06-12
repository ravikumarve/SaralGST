'use client';

import { motion } from 'framer-motion';
import { LookupResponse } from '@/lib/api';

interface ResultCardProps {
  result: LookupResponse;
}

export default function ResultCard({ result }: ResultCardProps) {
  const getMovementLabel = () => {
    switch (result.movement) {
      case 'down': return 'DOWN ↓';
      case 'up': return 'UP ↑';
      case 'unchanged': return 'SAME →';
      case 'new_exempt': return 'EXEMPT';
      default: return '';
    }
  };

  const isDown = result.movement === 'down';
  const isUp = result.movement === 'up';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full max-w-2xl glass-card p-6 md:p-8"
    >
      {/* Header row */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          {/* HSN code — mono cyan */}
          <span className="text-sm font-jetbrains-mono text-[#00f0ff]">
            HSN: {result.hsn_code}
          </span>
          {/* Category badge — tag-violet */}
          <span className="tag-violet !text-[10px] !px-2 !py-0.5">
            {result.category}
          </span>
        </div>
        {/* Movement badge */}
        {result.rate_changed && (
          <span className={`${isDown ? 'tag-emerald' : 'tag-violet'} !text-[10px] !px-2 !py-0.5`}>
            {getMovementLabel()}
          </span>
        )}
        {/* Low confidence badge */}
        {result.confidence < 0.8 && (
          <span className="!text-[10px] !px-2 !py-0.5 rounded-full bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/30 text-[0.75rem] font-bold uppercase tracking-wider">
            Low Confidence
          </span>
        )}
      </div>

      {/* Description */}
      <h3 className="text-xl font-semibold text-[#f0f0ff] mb-1">
        {result.description}
      </h3>
      {result.description_hi && (
        <p className="text-base text-[#8b949e] mb-6 font-inter">
          {result.description_hi}
        </p>
      )}

      {/* Rate comparison — L1 style: old strikethrough red, new large green */}
      <div className="flex items-center justify-between mb-6 p-5 bg-[#040814] rounded-xl border border-[#262626]">
        <div className="text-center flex-1">
          <div className="text-xs text-[#71717a] mb-2 font-medium uppercase tracking-wider">Pehle</div>
          <div className="text-3xl md:text-4xl font-bold text-[#71717a] line-through">
            {result.old_rate}%
          </div>
          <div className="text-[10px] text-[#4a4a5a] mt-1 font-jetbrains-mono">old</div>
        </div>

        <div className="flex-1 text-center">
          <div className={`text-lg font-bold ${isDown ? 'text-[#10b981]' : isUp ? 'text-[#ff3366]' : 'text-[#71717a]'}`}>
            {getMovementLabel()}
          </div>
          <div className="text-[10px] text-[#4a4a5a] mt-1 font-jetbrains-mono">
            {result.rate_changed ? 'Changed' : 'Unchanged'}
          </div>
        </div>

        <div className="text-center flex-1">
          <div className="text-xs text-[#71717a] mb-2 font-medium uppercase tracking-wider">Ab</div>
          <div className={`text-4xl md:text-5xl font-bold font-space-grotesk ${isDown ? 'text-[#10b981]' : isUp ? 'text-[#ff3366]' : 'text-[#f0f0ff]'}`}>
            {result.new_rate}%
          </div>
          <div className="text-[10px] text-[#4a4a5a] mt-1 font-jetbrains-mono">GST 2.0</div>
        </div>
      </div>

      {/* Notification reference — cyan left-border */}
      <div className="border-l-2 border-[#00f0ff] pl-4 py-1 mb-4">
        <div className="text-xs text-[#71717a] font-medium uppercase tracking-wider mb-1 font-jetbrains-mono">
          Notification Reference
        </div>
        <div className="text-sm text-[#f0f0ff]">
          {result.notification_ref}
        </div>
        <div className="text-xs text-[#4a4a5a] mt-1">
          Effective: September 22, 2025
        </div>
      </div>

      {/* Notes — violet left-border */}
      {result.notes && (
        <div className="border-l-2 border-[#8a2be2] pl-4 py-1 mb-4">
          <div className="text-xs text-[#71717a] font-medium uppercase tracking-wider mb-1 font-jetbrains-mono">
            Notes
          </div>
          <div className="text-sm text-[#f0f0ff]">{result.notes}</div>
        </div>
      )}

      {/* Warning — red left-border */}
      {result.warning && (
        <div className="border-l-2 border-[#ff3366] pl-4 py-1 mb-4 bg-[#ff3366]/5 rounded-r-lg">
          <div className="text-xs text-[#ff3366] font-medium uppercase tracking-wider mb-1 font-jetbrains-mono">
            Warning
          </div>
          <div className="text-sm text-[#ff3366]">{result.warning}</div>
        </div>
      )}

      {/* Bottom info row */}
      <div className="flex items-center justify-between mt-5 pt-4 border-t border-[#262626]">
        {result.interpreted_from && (
          <div className="text-xs text-[#4a4a5a] font-jetbrains-mono">
            Interpreted from: {result.interpreted_from}
          </div>
        )}
        {/* Confidence — tag-violet pill */}
        <span className="tag-violet !text-[10px] !px-2 !py-0.5 ml-auto">
          Confidence: {result.confidence.toFixed(2)}
        </span>
      </div>
    </motion.div>
  );
}
