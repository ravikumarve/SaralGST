'use client';

interface StatItem {
  title: string;
  description: string;
  variant?: 'cyan' | 'violet' | 'red';
}

const BORDER_COLORS = {
  cyan: 'border-[#00f0ff]',
  violet: 'border-[#8a2be2]',
  red: 'border-[#ff3366]',
};

export default function StatBox({
  items,
  className = '',
}: {
  items: StatItem[];
  className?: string;
}) {
  return (
    <div
      className={`bg-[#040814] border border-white/5 rounded-lg p-6 md:p-8 flex flex-col gap-5 ${className}`}
    >
      {items.map((item, index) => (
        <div
          key={index}
          className={`border-l-2 ${BORDER_COLORS[item.variant || 'cyan']} pl-4 md:pl-5`}
        >
          <h4 className="text-base md:text-lg font-semibold text-[#f0f0ff] mb-1.5 font-inter">
            {item.title}
          </h4>
          <p className="text-sm text-[#8b949e] leading-relaxed">
            {item.description}
          </p>
        </div>
      ))}
    </div>
  );
}
