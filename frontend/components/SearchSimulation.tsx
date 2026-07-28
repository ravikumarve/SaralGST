'use client';

export default function SearchSimulation() {
  return (
    <div className="search-viewport">
      <div className="glass-panel" style={{ transform: 'perspective(1200px) rotateY(-10deg) rotateX(4deg)' }}>
        {/* Mock Header */}
        <div className="flex items-center justify-between pb-4 mb-5" style={{ borderBottom: '1px solid var(--border-faint)' }}>
          <div className="flex items-center gap-3">
            <div style={{
              width: '24px', height: '24px', border: '1px solid var(--pearl)',
              borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--pearl)'
            }}>S</div>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', color: 'var(--pearl)' }}>
              SaralGST
            </span>
          </div>
          <div className="flex items-center gap-2" style={{ fontSize: '0.75rem', color: 'var(--mercury)' }}>
            <span>client@example.com</span>
            <div style={{
              width: '22px', height: '22px', borderRadius: '50%', background: 'var(--charcoal)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.55rem', color: 'var(--pearl)'
            }}>C</div>
          </div>
        </div>

        {/* Stat Row */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid var(--border-faint)', borderRadius: '8px', padding: '1rem 1.25rem' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--charcoal)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.5rem' }}>
              Today&apos;s Lookups
            </div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--pearl)', lineHeight: 1 }}>
              1,247
            </div>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid var(--border-faint)', borderRadius: '8px', padding: '1rem 1.25rem' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--charcoal)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.5rem' }}>
              Rate Changes
            </div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--indigo-light)', lineHeight: 1 }}>
              10
            </div>
          </div>
        </div>

        {/* Alert Card */}
        <div style={{
          background: 'var(--indigo-dim)', border: '1px solid rgba(99, 102, 241, 0.3)',
          borderRadius: '8px', padding: '0.85rem 1rem',
          display: 'flex', alignItems: 'center', gap: '12px'
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--indigo-light)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
          <div style={{ flex: 1 }}>
            <div style={{ color: 'var(--pearl)', fontWeight: 500, marginBottom: 2, fontSize: '0.8rem' }}>GST 2.0 Update Required</div>
            <div style={{ color: 'var(--mercury)', fontSize: '0.7rem' }}>Q4 rate revision affects 10 HSN codes in your portfolio</div>
          </div>
          <button style={{
            marginLeft: 'auto', background: 'var(--pearl)', color: 'var(--bg-void)',
            border: 'none', padding: '5px 10px', borderRadius: '4px',
            fontWeight: 600, fontSize: '0.7rem', cursor: 'pointer',
            fontFamily: 'var(--font-sans)', flexShrink: 0
          }}>
            Review
          </button>
        </div>
      </div>
    </div>
  );
}
