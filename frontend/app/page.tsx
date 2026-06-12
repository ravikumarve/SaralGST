import Link from 'next/link';
import BentoGrid from '@/components/BentoGrid';
import CodeBlock from '@/components/CodeBlock';

const USE_CASES = [
  {
    title: 'POS Systems',
    description:
      'Stop pushing manual database updates to remote retail terminals. Fetch real-time tax brackets dynamically during checkout, even for loosely described inventory items.',
    accent: false,
  },
  {
    title: 'ERP Integrators',
    description:
      'Validate batch SKU uploads. Ensure HSN codes and exact GST rates are verified instantly to prevent downstream billing errors across your entire product catalog.',
    accent: true,
  },
  {
    title: 'CA Firms',
    description:
      'Cross-check client ledgers against official GST 2.0 notifications via our high-volume auditing endpoints. Catch discrepancies before they trigger government scrutiny.',
    accent: false,
  },
];

export default function Home() {
  return (
    <div className="max-w-[1280px] mx-auto px-8">
      {/* ===== Hero ===== */}
      <section className="pt-32 pb-16 text-center flex flex-col items-center">
        <div className="status-badge mb-8">
          v1.0.0 &middot; GST 2.0 Ready
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] leading-none font-bold max-w-[1000px] mb-6">
          Sahi rate.
          <br />
          <span className="text-gradient">Seedha jawab.</span>
        </h1>

        <p className="text-lg md:text-xl text-[#a1a1aa] max-w-[600px] mb-12 leading-relaxed">
          Eliminate revenue leakage and bypass legacy ERP updates.
          India&apos;s smartest, fastest API for resolving GST rate confusion,
          engineered for Tier 2 &amp; Tier 3 scale.
        </p>

        <div className="flex items-center gap-4">
          <Link href="/check" className="btn btn-primary">
            Check Rate
          </Link>
          <Link
            href="http://localhost:8001/docs"
            className="btn btn-secondary"
          >
            View Documentation
          </Link>
        </div>
      </section>

      {/* ===== Platform / Bento Grid ===== */}
      <section id="platform" className="py-24">
        <div className="section-header">
          <h2>
            The Compliance <span className="text-accent">Engine</span>.
          </h2>
          <p>
            We replaced brittle, localized tax tables with a centralized,
            AI-driven backend API. Designed to integrate directly into your
            software stack.
          </p>
        </div>

        <BentoGrid>
          {/* NLP Mapping — Large */}
          <div className="bento-box col-span-12 md:col-span-8 row-span-2">
            <h3 className="bento-title">AI-Powered NLP Mapping</h3>
            <p className="bento-desc">
              Pass colloquial product names in English or Hindi. Our Gemini
              Flash integration maps &ldquo;LED TV&rdquo; directly to the
              official CBIC nomenclature and 4-digit HSN code instantly.
            </p>

            <div className="search-ui">
              <div className="search-ui-header mono">
                <span className="text-[#71717a]">
                  Query: &ldquo;टेलीविजन (32 इंच से बड़े)&rdquo;
                </span>
                <span className="text-[#8a2be2]">Confidence: 0.90</span>
              </div>
              <div className="live-result">
                <div>
                  <div className="text-[#ededed] font-medium text-lg mb-1">
                    Television sets (LCD/LED)
                  </div>
                  <div className="mono text-[#a1a1aa]">HSN Code: 8528</div>
                  <div className="mono text-[#71717a] mt-2">
                    Ref: Notif. 8/2025-CT
                  </div>
                </div>
                <div className="rate-large">18%</div>
              </div>
            </div>
          </div>

          {/* FastAPI Backend — Medium */}
          <div className="bento-box col-span-12 md:col-span-4 row-span-2">
            <h3 className="bento-title">FastAPI Backend</h3>
            <p className="bento-desc">
              Engineered for brutal efficiency in high-volume POS environments.
            </p>
            <div className="metric-value text-accent">
              &lt;200
              <span className="text-base text-[#a1a1aa]">ms</span>
            </div>
            <div className="mono text-[#71717a] mt-1">p95 Response Time</div>
          </div>

          {/* Historical Tracking — Medium */}
          <div className="bento-box col-span-12 md:col-span-4 row-span-2">
            <h3 className="bento-title">Historical Tracking</h3>
            <p className="bento-desc">
              Side-by-side old vs new rate comparisons post GST 2.0 reform.
            </p>
            <div className="mt-auto pt-4 border-t border-[#262626] flex justify-between items-center">
              <span className="text-[#71717a] line-through text-2xl">
                28%
              </span>
              <span className="text-[#71717a]">→</span>
              <span className="text-[#10b981] text-3xl font-bold">18%</span>
            </div>
          </div>

          {/* Developer First — Wide */}
          <div className="bento-box col-span-12 md:col-span-8" id="developers">
            <h3 className="bento-title">Developer First</h3>
            <p className="bento-desc">
              A completely headless, JSON-driven API that gets out of your way.
            </p>
            <CodeBlock />
          </div>
        </BentoGrid>
      </section>

      {/* ===== Use Cases ===== */}
      <section className="py-24 border-t border-[#262626]">
        <div className="section-header">
          <h2>
            Built for <span className="text-accent">Scale</span>.
          </h2>
          <p>
            Targeting the specific operational bottlenecks of Indian commerce.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {USE_CASES.map((uc, index) => (
            <div
              key={index}
              className={`use-case-card ${uc.accent ? 'accent' : ''}`}
            >
              <h4>{uc.title}</h4>
              <p>{uc.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Pricing ===== */}
      <section id="pricing" className="py-24">
        <div className="section-header text-center mx-auto">
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
