'use client';

interface CodeLine {
  text: string;
  indent?: number;
  className?: string;
}

const DEFAULT_LINES: CodeLine[] = [
  { text: '{' },
  { text: '"hsn_code": "8528",', indent: 2, className: 'text-[#00f0ff]' },
  { text: '"description": "Television sets (LCD/LED)",', indent: 2, className: 'text-[#10b981]' },
  { text: '"description_hi": "टेलीविजन (32 इंच से बड़े)",', indent: 2, className: 'text-[#10b981]' },
  { text: '"old_rate": 28,', indent: 2, className: 'text-[#8a2be2]' },
  { text: '"new_rate": 18,', indent: 2, className: 'text-[#8a2be2]' },
  { text: '"rate_changed": true,', indent: 2, className: 'text-[#f59e0b]' },
  { text: '"movement": "down",', indent: 2, className: 'text-[#10b981]' },
  { text: '"notification_ref": "No. 8/2025-CT(Rate)",', indent: 2, className: 'text-[#10b981]' },
  { text: '"confidence": 0.9', indent: 2, className: 'text-[#8a2be2]' },
  { text: '}' },
];

export default function CodeBlock({
  lines = DEFAULT_LINES,
  filename = 'lookup.json',
  className = '',
}: {
  lines?: CodeLine[];
  filename?: string;
  className?: string;
}) {
  return (
    <div
      className={`bg-black border border-[#262626] rounded-xl font-jetbrains-mono text-sm overflow-hidden ${className}`}
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border-b border-[#262626]">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff3366]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
        </div>
        <span className="text-xs text-[#71717a] ml-2">{filename}</span>
      </div>

      {/* Code content */}
      <div className="p-4 space-y-0.5 overflow-x-auto">
        {lines.map((line, index) => (
          <div key={index} className="flex gap-4">
            <span className="text-[#4a4a5a] select-none w-6 text-right shrink-0">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span
              className={`${line.className || 'text-[#d4d4d8]'}`}
              style={{ paddingLeft: line.indent ? `${line.indent * 0.75}rem` : undefined }}
            >
              {line.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
