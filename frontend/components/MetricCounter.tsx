'use client';

interface MetricCounterProps {
  value: string;
  label: string;
  accent?: 'cyan' | 'violet' | 'emerald';
  className?: string;
}

const ACCENT_COLORS = {
  cyan: 'text-[#00f0ff]',
  violet: 'text-[#8a2be2]',
  emerald: 'text-[#10b981]',
};

export default function MetricCounter({
  value,
  label,
  accent = 'cyan',
  className = '',
}: MetricCounterProps) {
  return (
    <div className={`flex flex-col ${className}`}>
      <span
        className={`text-4xl md:text-5xl lg:text-6xl font-bold font-space-grotesk leading-none ${ACCENT_COLORS[accent]}`}
      >
        {value}
      </span>
      <span className="text-sm text-[#71717a] mt-2 font-inter">
        {label}
      </span>
    </div>
  );
}
