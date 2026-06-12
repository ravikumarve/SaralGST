'use client';

interface BentoGridProps {
  children: React.ReactNode;
  className?: string;
}

export default function BentoGrid({ children, className = '' }: BentoGridProps) {
  return (
    <div
      className={`grid grid-cols-12 gap-4 md:gap-6 ${className}`}
    >
      {children}
    </div>
  );
}
