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

      {/* ===== Pricing ===== */}
      <div className="bg-[#0a0a0a] border-t border-[#262626] -mx-6 px-6">
        <section id="pricing" className="py-24">
          <div className="section-header" style={{ margin: '0 auto', textAlign: 'center' }}>
            <h2>
              Transparent <span className="text-accent">Access</span>.
            </h2>
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
                href="http://localhost:8001/docs"
                className="btn btn-secondary mono"
                style={{ width: '100%' }}
              >
                Test API Locally
              </Link>
            </div>

            {/* Pro — Popular */}
            <div className="price-tier popular">
              <div className="mono text-[#8a2be2] text-xs uppercase tracking-wider font-bold mb-4">
                Production Ready
              </div>
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
                className="btn btn-secondary mono"
                style={{ width: '100%' }}
              >
                Contact Sales
              </a>
            </div>
          </div>
        </section>
      </div>

      {/* ===== Footer ===== */}
      <footer className="border-t border-[#262626] py-16 mt-16">
        <div className="footer-grid">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 font-space-grotesk font-bold text-lg text-[#ededed] mb-4">
              <span className="w-[10px] h-[10px] bg-[#00f0ff] rounded-[2px]" />
              SaralGST
            </div>
            <p className="text-[#a1a1aa] text-sm max-w-[250px] leading-relaxed">
              India&apos;s smartest, fastest API for resolving GST rate
              confusion. <i>Sahi rate. Seedha jawab.</i>
            </p>
          </div>

          {/* Product */}
          <div className="footer-col">
            <h5>Product</h5>
            <ul className="footer-links">
              <li><a href="#platform">Platform</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#">Security (HMAC)</a></li>
              <li><a href="http://localhost:8001/docs">Swagger UI</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="footer-col">
            <h5>Resources</h5>
            <ul className="footer-links">
              <li><a href="https://github.com/ravikumarve/SaralGST">GitHub Repo</a></li>
              <li><a href="http://localhost:8001/redoc">ReDoc</a></li>
              <li><a href="#">GST 2.0 Changelog</a></li>
              <li><a href="#">Integration Guide</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="footer-col">
            <h5>Legal</h5>
            <ul className="footer-links">
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Proprietary License</a></li>
              <li><a href="#">Contact Support</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#262626] pt-6 mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-[#71717a]">
            © 2026 SaralGST. All rights reserved.
          </div>
          <div className="mono text-[#10b981]">● Systems Nominal</div>
        </div>
      </footer>
    </div>
  );
}
