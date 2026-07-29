'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

interface Command {
  id: string;
  label: string;
  href: string;
  icon: string;
  shortcut?: string;
  category: 'nav' | 'action' | 'external';
}

const COMMANDS: Command[] = [
  // Navigation
  { id: 'overview', label: 'Dashboard', href: '/hq/overview', icon: '◆', shortcut: 'G', category: 'nav' },
  { id: 'playground', label: 'API Playground', href: '/hq/playground', icon: '〉', shortcut: 'P', category: 'nav' },
  { id: 'api-keys', label: 'API Keys', href: '/hq/api-keys', icon: '⚷', shortcut: 'K', category: 'nav' },
  { id: 'usage', label: 'Usage', href: '/hq/usage', icon: '▤', shortcut: 'U', category: 'nav' },
  { id: 'history', label: 'History', href: '/hq/history', icon: '☰', shortcut: 'H', category: 'nav' },
  { id: 'favorites', label: 'Favorites', href: '/hq/favorites', icon: '☆', shortcut: 'F', category: 'nav' },
  { id: 'billing', label: 'Billing', href: '/hq/billing', icon: '₹', shortcut: 'B', category: 'nav' },
  { id: 'settings', label: 'Settings', href: '/hq/settings', icon: '⚙', shortcut: 'S', category: 'nav' },
  // Quick actions
  { id: 'check', label: 'Check GST Rate', href: '/check', icon: '→', category: 'action' },
  { id: 'login', label: 'Sign Out', href: '#signout', icon: '←', category: 'action' },
];

export default function CommandPalette({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = query
    ? COMMANDS.filter((cmd) =>
        cmd.label.toLowerCase().includes(query.toLowerCase())
      )
    : COMMANDS;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setSelectedIndex(0);
  };

  // Focus input on mount (component remounts via key prop on each open)
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, filtered.length - 1));
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
      return;
    }
    if (e.key === 'Enter' && filtered[selectedIndex]) {
      e.preventDefault();
      execute(filtered[selectedIndex]);
      return;
    }
  };

  const execute = (cmd: Command) => {
    onClose();
    if (cmd.id === 'login') {
      // Sign out is handled via next-auth
      return;
    }
    router.push(cmd.href);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[12vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Palette */}
      <div
        className="relative w-full max-w-lg bg-[#0a0a0a] border border-[#262626] rounded-2xl shadow-2xl overflow-hidden"
        onKeyDown={handleKeyDown}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#262626]">
          <svg className="w-4 h-4 text-[#52525b] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleChange}
            placeholder="Search pages, actions…"
            className="flex-1 bg-transparent text-sm text-[#f8f9fa] placeholder-[#52525b] focus:outline-none"
          />
          <kbd className="mono text-[10px] text-[#52525b] bg-[#141414] border border-[#262626] rounded-md px-1.5 py-0.5 leading-none">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto py-2">
          {filtered.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-[#52525b]">
              No results for &ldquo;{query}&rdquo;
            </div>
          ) : (
            filtered.map((cmd, i) => (
              <button
                key={cmd.id}
                onClick={() => execute(cmd)}
                onMouseEnter={() => setSelectedIndex(i)}
                className={`w-full flex items-center justify-between px-5 py-3 text-left transition-colors ${
                  i === selectedIndex
                    ? 'bg-[rgba(255,255,255,0.08)] text-[#f8f9fa]'
                    : 'text-[#a1a1aa] hover:text-[#f8f9fa] hover:bg-[rgba(255,255,255,0.02)]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-mono text-sm w-5 text-center shrink-0 text-[#f8f9fa]">{cmd.icon}</span>
                  <span className="text-sm truncate">{cmd.label}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {cmd.category === 'nav' && cmd.shortcut && (
                    <kbd className="mono text-[9px] tracking-[1px] text-[#52525b] bg-[#141414] border border-[#262626] rounded-md px-1.5 py-0.5 leading-none">
                      ⌘+{cmd.shortcut}
                    </kbd>
                  )}
                  <span className="mono text-[9px] tracking-[1px] text-[#36363a] uppercase">{cmd.category}</span>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer hint */}
        <div className="flex items-center gap-4 px-5 py-3 border-t border-[#262626] bg-[#050505]">
          <div className="flex items-center gap-1.5 text-[10px] text-[#52525b] mono">
            <kbd className="text-[#52525b] bg-[#141414] border border-[#262626] rounded px-1 py-0.5 leading-none">↑↓</kbd>
            <span>Navigate</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-[#52525b] mono">
            <kbd className="text-[#52525b] bg-[#141414] border border-[#262626] rounded px-1 py-0.5 leading-none">⏎</kbd>
            <span>Open</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-[#52525b] mono">
            <kbd className="text-[#52525b] bg-[#141414] border border-[#262626] rounded px-1 py-0.5 leading-none">ESC</kbd>
            <span>Close</span>
          </div>
        </div>
      </div>
    </div>
  );
}
