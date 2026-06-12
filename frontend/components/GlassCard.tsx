'use client';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  tag?: {
    label: string;
    variant: 'violet' | 'emerald';
  };
}

const TAG_STYLES = {
  violet: 'tag-violet',
  emerald: 'tag-emerald',
};

export default function GlassCard({
  children,
  className = '',
  tag,
}: GlassCardProps) {
  return (
    <div
      className={`glass-card p-6 md:p-8 transition-all duration-300 hover:border-white/30 hover:-translate-y-1 ${className}`}
    >
      {tag && (
        <span className={`inline-block mb-5 ${TAG_STYLES[tag.variant]}`}>
          {tag.label}
        </span>
      )}
      {children}
    </div>
  );
}
