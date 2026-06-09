'use client';
import { motion } from 'framer-motion';
import { LookupResponse } from '@/lib/api';

interface ResultCardProps {
  result: LookupResponse;
}

export default function ResultCard({ result }: ResultCardProps) {
  const getMovementColor = () => {
    switch (result.movement) {
      case 'down':
        return 'text-green border-green';
      case 'up':
        return 'text-red border-red';
      default:
        return 'text-text-primary border-border';
    }
  };

  const getMovementIcon = () => {
    switch (result.movement) {
      case 'down':
        return '↓';
      case 'up':
        return '↑';
      default:
        return '→';
    }
  };

  const getMovementLabel = () => {
    switch (result.movement) {
      case 'down':
        return 'DOWN ↓';
      case 'up':
        return 'UP ↑';
      case 'unchanged':
        return 'SAME →';
      case 'new_exempt':
        return 'EXEMPT';
      default:
        return '';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`w-full max-w-2xl p-6 bg-surface border-2 rounded-2xl ${getMovementColor()}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-sm font-jetbrains-mono text-text-muted">
            HSN: {result.hsn_code}
          </span>
          <span className="text-sm text-text-secondary">{result.category}</span>
        </div>
        {result.confidence < 0.8 && (
          <span className="text-xs text-amber bg-amber/10 px-2 py-1 rounded-full">
            Low confidence
          </span>
        )}
      </div>

      {/* Description */}
      <h3 className="text-xl font-medium text-text-primary mb-2">
        {result.description}
      </h3>
      {result.description_hi && (
        <p className="text-lg text-text-secondary mb-6">{result.description_hi}</p>
      )}

      {/* Rate comparison */}
      <div className="flex items-center justify-between mb-6 p-4 bg-bg rounded-xl">
        <div className="text-center flex-1">
          <div className="text-sm text-text-muted mb-2">PEHLE</div>
          <div className="text-3xl font-bold text-text-primary">{result.old_rate}%</div>
          <div className="text-xs text-text-muted mt-1">(old)</div>
        </div>

        <div className="flex-1 text-center">
          <div
            className={`text-2xl font-bold ${
              result.movement === 'down' ? 'text-green' : result.movement === 'up' ? 'text-red' : 'text-text-muted'
            }`}
          >
            {getMovementLabel()}
          </div>
          <div className="text-xs text-text-muted mt-1">
            {result.rate_changed ? 'BADLA' : 'UNCHANGED'}
          </div>
        </div>

        <div className="text-center flex-1">
          <div className="text-sm text-text-muted mb-2">AB</div>
          <div
            className={`text-3xl font-bold ${
              result.movement === 'down' ? 'text-green' : result.movement === 'up' ? 'text-red' : 'text-text-primary'
            }`}
          >
            {result.new_rate}%
          </div>
          <div className="text-xs text-text-muted mt-1">(GST 2.0)</div>
        </div>
      </div>

      {/* Notification reference */}
      <div className="p-4 bg-bg rounded-xl mb-4">
        <div className="flex items-start gap-3">
          <div className="text-2xl">📋</div>
          <div>
            <div className="text-sm font-medium text-text-primary mb-1">
              {result.notification_ref}
            </div>
            <div className="text-xs text-text-muted">
              Effective: September 22, 2025
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      {result.notes && (
        <div className="p-4 bg-bg rounded-xl mb-4">
          <div className="flex items-start gap-3">
            <div className="text-2xl">⚠️</div>
            <div>
              <div className="text-sm text-text-primary">{result.notes}</div>
            </div>
          </div>
        </div>
      )}

      {/* Warning */}
      {result.warning && (
        <div className="p-4 bg-amber/10 border border-amber/30 rounded-xl">
          <div className="flex items-start gap-3">
            <div className="text-2xl">⚠️</div>
            <div>
              <div className="text-sm text-amber">{result.warning}</div>
            </div>
          </div>
        </div>
      )}

      {/* Confidence info */}
      {result.interpreted_from && (
        <div className="mt-4 text-xs text-text-muted">
          Interpreted from: {result.interpreted_from}
        </div>
      )}
    </motion.div>
  );
}
