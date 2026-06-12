interface CodeToken {
  text: string;
  type?: 'kw' | 'str' | 'num';
}

interface CodeLine {
  tokens: CodeToken[];
}

const STYLES: Record<string, string> = {
  kw: 'text-[#00f0ff]',
  str: 'text-[#10b981]',
  num: 'text-[#8a2be2]',
};

const DEFAULT_LINES: CodeLine[] = [
  { tokens: [{ text: 'POST ', type: 'kw' }, { text: '/api/lookup' }] },
  { tokens: [{ text: '{' }] },
  { tokens: [{ text: '  ' }, { text: '"query"', type: 'str' }, { text: ': ' }, { text: '"LED TV"', type: 'str' }] },
  { tokens: [{ text: '  ' }, { text: '"language"', type: 'str' }, { text: ': ' }, { text: '"en"', type: 'str' }] },
  { tokens: [{ text: '}' }] },
];

export default function CodeBlock({
  lines = DEFAULT_LINES,
  className = '',
}: {
  lines?: CodeLine[];
  className?: string;
}) {
  return (
    <div className={`code-block mono ${className}`}>
      {lines.map((line, index) => (
        <div key={index} className="code-line">
          <span className="code-num w-6 text-right shrink-0">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span>
            {line.tokens.map((token, ti) => (
              <span key={ti} className={token.type ? STYLES[token.type] : 'text-[#a1a1aa]'}>
                {token.text}
              </span>
            ))}
          </span>
        </div>
      ))}
    </div>
  );
}
