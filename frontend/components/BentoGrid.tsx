interface BentoGridProps {
  children: React.ReactNode;
  className?: string;
}

export default function BentoGrid({ children, className = '' }: BentoGridProps) {
  return (
    <div
      className={`grid grid-cols-12 gap-6 auto-rows-[minmax(180px,auto)] mt-20 ${className}`}
    >
      {children}
    </div>
  );
}
