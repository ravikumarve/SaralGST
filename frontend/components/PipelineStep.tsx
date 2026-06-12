'use client';

interface PipelineStepProps {
  step: string;
  title: string;
  description: string;
  variant?: 'cyan' | 'violet' | 'green';
  isLast?: boolean;
}

const VARIANT_STYLES = {
  cyan: {
    dot: 'border-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.3)]',
    line: 'bg-[#00f0ff]/20',
  },
  violet: {
    dot: 'border-[#8a2be2] shadow-[0_0_15px_rgba(138,43,226,0.3)]',
    line: 'bg-[#8a2be2]/20',
  },
  green: {
    dot: 'border-[#10b981] shadow-[0_0_15px_rgba(16,185,129,0.3)]',
    line: 'bg-[#10b981]/20',
  },
};

export default function PipelineStep({
  step,
  title,
  description,
  variant = 'cyan',
  isLast = false,
}: PipelineStepProps) {
  const styles = VARIANT_STYLES[variant];

  return (
    <div className="relative pl-20 pb-8 last:pb-0">
      {/* Connector line */}
      {!isLast && (
        <div
          className={`absolute left-[29px] top-5 bottom-0 w-[2px] ${styles.line}`}
        />
      )}

      {/* Glowing dot marker */}
      <div
        className={`absolute left-[21px] top-0 w-[18px] h-[18px] rounded-full bg-[#040814] border-2 ${styles.dot} flex items-center justify-center`}
      />

      {/* Content */}
      <h3 className="font-jetbrains-mono text-sm text-[#a1a1aa] mb-1">
        {step} //
      </h3>
      <h4 className="text-xl font-bold text-[#f0f0ff] mb-2 font-space-grotesk">
        {title}
      </h4>
      <p className="text-base text-[#8b949e] leading-relaxed max-w-xl">
        {description}
      </p>
    </div>
  );
}
