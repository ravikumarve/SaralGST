'use client';

import { useEffect, useState } from 'react';

interface TermLine {
  prefix: string;
  text: string;
  color: string;
}

const LINES: TermLine[] = [
  {
    prefix: 'POS_REQ:',
    text: 'description="LED TV 55 inch"',
    color: '#a1a1aa',
  },
  {
    prefix: 'SYS:',
    text: 'Engaging NLP context engine...',
    color: '#00f0ff',
  },
  {
    prefix: 'SYS:',
    text: 'HSN resolved → 8528 (Television sets)',
    color: '#00f0ff',
  },
  {
    prefix: 'ENGINE:',
    text: 'Rate change detected: 28% → 18%',
    color: '#8a2be2',
  },
  {
    prefix: 'NOTIFY:',
    text: 'Ref: No. 8/2025-CT(Rate) · Confidence: 0.92',
    color: '#10b981',
  },
  {
    prefix: 'API_RES:',
    text: 'JSON delivered [142ms] ✓',
    color: '#00FF66',
  },
];

// Timings in ms for each line reveal
const DELAYS = [0, 800, 1500, 2200, 2600, 3200];
const LOOP_PAUSE = 4000; // pause before restarting
const TOTAL_CYCLE = DELAYS[DELAYS.length - 1] + LOOP_PAUSE;

export default function TerminalSequence({
  className = '',
}: {
  className?: string;
}) {
  const [visibleLines, setVisibleLines] = useState<number[]>([]);

  useEffect(() => {
    let timeouts: ReturnType<typeof setTimeout>[] = [];
    let cycleTimer: ReturnType<typeof setTimeout>;

    function runCycle() {
      // Reset
      setVisibleLines([]);

      // Show lines sequentially
      DELAYS.forEach((delay, index) => {
        const t = setTimeout(() => {
          setVisibleLines((prev) => [...prev, index]);
        }, delay);
        timeouts.push(t);
      });

      // Schedule next cycle
      cycleTimer = setTimeout(runCycle, TOTAL_CYCLE);
    }

    // Start after a short initial delay
    const startTimer = setTimeout(runCycle, 500);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(cycleTimer);
      timeouts.forEach(clearTimeout);
    };
  }, []);

  return (
    <div
      className={`relative bg-black/80 border border-white/10 rounded-xl p-5 font-jetbrains-mono text-sm leading-relaxed shadow-2xl shadow-black/60 overflow-hidden ${className}`}
    >
      {/* Scanline animation bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00f0ff] to-transparent animate-scanline pointer-events-none" />

      <div className="space-y-1.5">
        {LINES.map((line, index) => (
          <div
            key={index}
            className={`transition-opacity duration-300 ${
              visibleLines.includes(index) ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <span className="mr-2 font-bold" style={{ color: line.color }}>
              {line.prefix}
            </span>
            <span style={{ color: index === LINES.length - 1 ? '#00FF66' : '#d4d4d8' }}>
              {line.text}
            </span>
          </div>
        ))}

        {/* Blinking cursor on last line */}
        {visibleLines.includes(LINES.length - 1) && (
          <span className="inline-block w-2 h-4 bg-[#00FF66] ml-1 animate-pulse align-middle" />
        )}
      </div>
    </div>
  );
}
