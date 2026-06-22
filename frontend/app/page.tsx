import Link from 'next/link';
import SearchSimulation from '@/components/SearchSimulation';

export default function Home() {
  return (
    <div className="max-w-[1240px] mx-auto px-8 relative z-10">
      {/* Ambient glow behind hero */}
      <div className="ambient-glow" aria-hidden="true" />

      {/* ===== Hero ===== */}
      <section className="hero">
        {/* Left: Text */}
        <div>
          <div className="hero-badge mono">
            <span className="inline-block w-[6px] h-[6px] bg-gold rounded-full" />
            GST 2.0 Compliant
          </div>
          <h1>
            Sahi rate. <br />
            <span className="text-gold">Seedha jawab.</span>
          </h1>
          <p>
            India&apos;s simplest, most powerful GST rate checker.
            Built for MSMEs and CA firms. Type any product in Hindi or English,
            and our NLP engine maps it to 551 official tax brackets instantly.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link href="/check" className="btn btn-primary flex-shrink-0">
              Check Rate
            </Link>
            <Link href="#features" className="btn btn-outline flex-shrink-0">
              Explore Engine
            </Link>
          </div>
        </div>

        {/* Right: Search Simulation */}
        <SearchSimulation />
      </section>

      {/* ===== Features / Bento Matrix ===== */}
      <section id="features">
        <div className="matrix-header">
          <h2>Intelligence in <span className="text-gold">Compliance.</span></h2>
          <p>We abandoned chaotic spreadsheets for a high-performance Next.js 16 and FastAPI architecture. SaralGST delivers absolute mathematical certainty for Indian trading operations.</p>
        </div>

        <div className="bento-matrix">
          {/* LOG_01 — NLP */}
          <div className="bento-node span-8">
            <span className="node-idx">LOG_01 // NLP INTERPRETATION</span>
            <h3>Bilingual Natural Language Parsing</h3>
            <p>Powered by Google Gemini Flash fallback logic. You don&apos;t need to memorize exact 4-digit HSN codes. Search naturally for &ldquo;<span lang="hi">चावल</span>&rdquo;, &ldquo;Steel Pipes&rdquo;, or &ldquo;Laptops&rdquo; in Hindi or English, and our interpreter maps it to the precise legal tax bracket instantly.</p>
            <div className="feature-tags">
              <span className="f-tag">Gemini 0.3.2</span>
              <span className="f-tag">Hindi / English Support</span>
            </div>
          </div>

          {/* LOG_02 — Memory Cache */}
          <div className="bento-node span-4">
            <span className="node-idx">LOG_02 // MEMORY CACHE</span>
            <h3>Zero Latency Database</h3>
            <p>Built for absolute speed. The engine relies on a rigorously verified JSON data store containing 551 GST items across 9 categories. No external DB hops.</p>
          </div>

          {/* LOG_03 — Reform Tracking */}
          <div className="bento-node span-6">
            <span className="node-idx">LOG_03 // REFORM TRACKING</span>
            <h3>GST 2.0 Transitions</h3>
            <p>Navigate the September 2025 GST 2.0 reforms safely. Every query calculates the mathematical difference, returning both the old rate and the new rate side-by-side.</p>
          </div>

          {/* LOG_04 — Maths */}
          <div className="bento-node span-6">
            <span className="node-idx">LOG_04 // MATHEMATICS</span>
            <h3>Tax Split Calculator</h3>
            <p>Send a base price and item name. Receive the exact mathematical split for CGST, SGST, IGST, and the final net total with GST applied, ready for invoice generation.</p>
          </div>
        </div>
      </section>

      {/* ===== API Architecture ===== */}
      <section id="api" className="arch-columns" style={{ borderBottom: 'none' }}>
        <div className="arch-info">
          <h2>Developer-First <br /><span className="text-gold">Endpoints.</span></h2>
          <p>Integrate SaralGST directly into your POS, ERP, or billing software. Our V1 API is secured by SlowAPI rate limiting and HMAC token validation to ensure production-grade reliability.</p>

          <div className="stack-card" style={{ marginTop: '3rem' }}>
            <h3>Infrastructure Blueprint</h3>
            <ul className="stack-list">
              <li>Frontend Application <span>Next.js 16.2.4 (App Router)</span></li>
              <li>Backend API Engine <span>FastAPI 0.109.0 (Python 3.12+)</span></li>
              <li>UI Primitives <span>Tailwind CSS 4 + Radix UI</span></li>
              <li>Rate Limiting <span>SlowAPI 0.1.9</span></li>
              <li>NLP Fallback <span>Google Gemini 0.3.2</span></li>
              <li>Testing Protocol <span>Pytest (100% Coverage)</span></li>
            </ul>
          </div>
        </div>

        {/* Code Window */}
        <div className="code-window">
          <div className="cw-header">
            <div className="cw-dot" /><div className="cw-dot" /><div className="cw-dot" />
          </div>

          <div className="c-comment"># V1 Data Retrieval</div>
          <div><span className="c-method">GET</span> <span className="c-route">/api/v1/gst/lookup?query=rice</span></div>
          <div style={{ marginBottom: '1.5rem' }}><span className="c-method">GET</span> <span className="c-route">/api/v1/gst/explain?item_name=rice</span></div>

          <div className="c-comment"># Tax Calculation</div>
          <div><span className="c-method" style={{ color: 'var(--emerald)' }}>POST</span> <span className="c-route">/api/v1/gst/calculate</span></div>
          <div style={{ marginLeft: '1rem' }}>
            {'{'}<br />
            &nbsp;&nbsp;<span className="c-key">&quot;item_name&quot;</span>: <span className="c-str">&quot;LED TV&quot;</span>,<br />
            &nbsp;&nbsp;<span className="c-key">&quot;price&quot;</span>: <span className="c-str">50000</span><br />
            {'}'}
          </div>
          <div className="c-comment" style={{ marginTop: '1rem' }}>// Response</div>
          <div style={{ marginLeft: '1rem' }}>
            {'{'}<br />
            &nbsp;&nbsp;<span className="c-key">&quot;hsn_code&quot;</span>: <span className="c-str">&quot;8528&quot;</span>,<br />
            &nbsp;&nbsp;<span className="c-key">&quot;gst_rate&quot;</span>: <span className="c-str">18</span>,<br />
            &nbsp;&nbsp;<span className="c-key">&quot;cgst&quot;</span>: <span className="c-str">4500</span>,<br />
            &nbsp;&nbsp;<span className="c-key">&quot;total_with_gst&quot;</span>: <span className="c-str">59000</span><br />
            {'}'}
          </div>
        </div>
      </section>

      {/* ===== CTA Band ===== */}
      <section className="cta-wrapper" style={{ padding: '2rem 0', border: 'none' }}>
        <div className="cta-band">
          <h2>Deploy the SaralGST engine.</h2>
          <p>Run the backend locally, configure your Gemini API keys, and launch the compliance engine in under 5 minutes.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="https://github.com/ravikumarve/SaralGST" className="btn btn-primary" target="_blank" rel="noopener noreferrer">Clone Repository</a>
            <Link href="/check" className="btn btn-outline" style={{ flexShrink: 0 }}>Try Live Demo</Link>
          </div>
        </div>
      </section>

      {/* ===== Pricing ===== */}
      <section id="pricing">
        <div className="matrix-header">
          <h2>Transparent <span className="text-gold">Access.</span></h2>
          <p>Secure your HMAC token and start querying immediately.</p>
        </div>

          <div className="pricing-cards">
            {/* Sandbox */}
            <div className="price-tier">
              <div className="tier-name">Sandbox</div>
              <div className="tier-price">
                ₹0<span>/forever</span>
              </div>
              <ul className="tier-features">
                <li>3 API Lookups / day</li>
                <li>Plain language NLP search</li>
                <li>Standard JSON responses</li>
                <li>Community Support</li>
              </ul>
              <Link
                href="http://localhost:8000/docs"
                className="btn btn-outline mono"
                style={{ width: '100%' }}
              >
                Test API Locally
              </Link>
            </div>

            {/* Pro — Popular */}
            <div className="price-tier popular">
              <div className="tier-badge">Production Ready</div>
              <div className="tier-name">Pro Integration</div>
              <div className="tier-price">
                ₹999<span>/month</span>
              </div>
              <ul className="tier-features">
                <li>1,000 API Lookups / day</li>
                <li>Secure HMAC Token Auth</li>
                <li>&lt; 200ms Response Time</li>
                <li>Priority Email Support</li>
              </ul>
              <a
                href="https://gumroad.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary mono"
                style={{ width: '100%' }}
              >
                Acquire Token
              </a>
            </div>

            {/* Enterprise */}
            <div className="price-tier">
              <div className="tier-name">CA / Enterprise</div>
              <div className="tier-price">Custom</div>
              <ul className="tier-features">
                <li>5,000+ API Lookups / day</li>
                <li>Batch processing endpoints</li>
                <li>99.5% Uptime SLA Guarantee</li>
                <li>Dedicated Account Manager</li>
              </ul>
              <a
                href="#"
                className="btn btn-outline mono"
                style={{ width: '100%' }}
              >
                Contact Sales
              </a>
            </div>
          </div>
        </section>

      {/* ===== Footer ===== */}
      <footer>
        <div className="footer-brand">
          <a href="/" className="logo">
            <span className="logo-mark" />
            SaralGST
          </a>
          <p>Proprietary SaaS built for Indian MSMEs. Next.js 16 and FastAPI powered architecture providing absolute clarity on GST 2.0 reforms.</p>
        </div>
        <div className="footer-col">
          <h5>Platform</h5>
          <ul>
            <li><a href="#features">NLP Engine</a></li>
            <li><a href="#features">Tax Calculator</a></li>
            <li><a href="#api">API Specifications</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h5>Developers</h5>
          <ul>
            <li><a href="https://github.com/ravikumarve/SaralGST">GitHub Repository</a></li>
            <li><a href="http://localhost:8000">Localhost Endpoint</a></li>
            <li><a href="#">Architecture Docs</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h5>Company</h5>
          <ul>
            <li><a href="LICENSE">Proprietary License</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
          </ul>
        </div>
      </footer>

      <div className="footer-bottom">
        <div>© 2025 SARALGST. PROPRIETARY — ALL RIGHTS RESERVED.</div>
        <div><span style={{ color: 'var(--gold)' }}>●</span> SYSTEM NOMINAL</div>
      </div>
    </div>
  );
}
