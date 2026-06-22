'use client';

export default function SearchSimulation() {
  return (
    <div className="search-viewport">
      <div className="glass-panel">
        {/* Search Bar */}
        <div className="search-bar">
          <svg
            className="search-icon"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <div className="search-text">
            LED TV<span className="search-cursor" />
          </div>
          <span className="mono search-enter-hint">ENTER ↵</span>
        </div>

        {/* Result Data */}
        <div className="result-data">
          <div className="rd-row">
            <div>
              <div className="rd-label">Matched Classification</div>
              <div className="rd-val">
                Television Set (<span lang="hi">टेलीविजन</span>)
              </div>
            </div>
            <div className="text-right">
              <div className="rd-label">HSN / SAC Code</div>
              <div className="rd-val mono">8528</div>
            </div>
          </div>

          <div className="rd-row" style={{ alignItems: 'flex-end' }}>
            <div>
              <div className="rd-label">GST 2.0 Rate</div>
              <div className="rd-val highlight">18.0%</div>
              <div className="split-pills">
                <span className="split-pill">CGST: 9%</span>
                <span className="split-pill">SGST: 9%</span>
              </div>
            </div>
            <div className="text-right">
              <div className="rd-label">Reference ID</div>
              <div className="rd-val mono" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Notif. No. 1/2025-CT(Rate)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
