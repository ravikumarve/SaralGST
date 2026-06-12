'use client';

const DEFAULT_ITEMS = [
  '• POWERING RETAIL IN BHARAT',
  '• GST 2.0 READY (SEPT 2025)',
  '• < 200MS LATENCY',
  '• NO LEGACY OVERHEAD',
  '• HMAC TOKEN SECURITY',
  '• ZERO TAX LEAKAGE',
];

export default function TickerTape({
  items = DEFAULT_ITEMS,
  speed = 20,
  className = '',
}: {
  items?: string[];
  speed?: number;
  className?: string;
}) {
  const allItems = [...items, ...items]; // Duplicate for seamless loop

  return (
    <div
      className={`relative overflow-hidden bg-[#00FF66] py-3 md:-rotate-[1.5deg] my-10 md:my-14 ${className}`}
    >
      <div
        className="flex whitespace-nowrap animate-ticker"
        style={{ animationDuration: `${speed}s` }}
      >
        {allItems.map((item, i) => (
          <span
            key={i}
            className="inline-block px-8 text-sm md:text-base font-bold text-black uppercase tracking-widest font-space-grotesk"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
