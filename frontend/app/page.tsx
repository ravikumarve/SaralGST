'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import ParticleCanvas from '@/components/ParticleCanvas';
import TerminalSequence from '@/components/TerminalSequence';
import TickerTape from '@/components/TickerTape';
import PipelineStep from '@/components/PipelineStep';
import StatBox from '@/components/StatBox';
import GlassCard from '@/components/GlassCard';
import BentoGrid from '@/components/BentoGrid';
import MetricCounter from '@/components/MetricCounter';
import CodeBlock from '@/components/CodeBlock';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const STAT_ITEMS = [
  {
    title: 'Eliminate Tax Leakage',
    description:
      'Under-charging GST eats into your margins; over-charging alienates high-paying customers. Get the exact rate, every time.',
    variant: 'cyan' as const,
  },
  {
    title: 'Prevent Costly Lawsuits',
    description:
      'Incorrect HSN mapping is a leading cause of tax notices. We cross-reference official CBIC notifications instantly.',
    variant: 'violet' as const,
  },
  {
    title: 'Bypass Legacy Updates',
    description:
      'Stop forcing your clients to download bulky software patches every time the GST Council meets. Serve rates dynamically.',
    variant: 'red' as const,
  },
];

const PIPELINE_STEPS = [
  {
    step: '01',
    title: 'The Request',
    description:
      'Your POS or ERP system sends a simple JSON payload containing a product description (e.g. "LED TV" or "टेलीविजन") to our /api/v1/gst/lookup endpoint.',
    variant: 'cyan' as const,
  },
  {
    step: '02',
    title: 'NLP Context Mapping',
    description:
      'The Gemini Flash NLP service intercepts the query. It translates, contextualizes, and maps the colloquial product name to the official CBIC item nomenclature.',
    variant: 'violet' as const,
  },
  {
    step: '03',
    title: 'Rate Engine Validation',
    description:
      'The exact HSN/SAC code is queried against our master GST 2.0 data file. The engine validates the current rate, checks for recent notification changes, and calculates historical movement.',
    variant: 'green' as const,
  },
  {
    step: '04',
    title: 'JSON Delivery',
    description:
      'Within ~200ms, a strictly typed Pydantic response is returned to your system, injecting the correct tax rate directly into the final invoice logic.',
    variant: 'cyan' as const,
  },
];

const USE_CASES = [
  {
    title: 'POS System Developers',
    description:
      'Stop pushing manual database updates to hundreds of retail terminals. Point your POS terminals to SaralGST and fetch real-time tax brackets during checkout, even for loosely described inventory items.',
  },
  {
    title: 'ERP Integrators',
    description:
      'Seamlessly enrich bulk inventory uploads. Ensure that when a new batch of SKUs is entered into the central ERP, the HSN codes and exact GST rates are validated instantly to prevent downstream billing errors.',
  },
  {
    title: 'Chartered Accountant Firms',
    description:
      'Integrate our high-volume tier into your internal auditing tools. Rapidly cross-check client ledgers against official GST 2.0 notifications to catch discrepancies before they trigger government scrutiny.',
  },
];

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (heroRef.current) {
      gsap.from('.hero-line', {
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power3.out',
        delay: 0.3,
      });
    }

    ScrollTrigger.batch('.reveal-card', {
      onEnter: (elements) => {
        gsap.from(elements, {
          y: 40,
          opacity: 0,
          stagger: 0.12,
          duration: 0.7,
          ease: 'power2.out',
        });
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#040814] relative overflow-hidden">
      {/* Particle canvas — full-screen cinematic bg */}
      <ParticleCanvas opacity={0.4} />

      {/* ===== HERO ===== */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 py-28 md:py-20 text-center relative z-10">
        <div ref={heroRef} className="max-w-4xl flex flex-col items-center">
          {/* Status badge */}
          <div className="hero-line inline-flex items-center gap-2 px-4 py-1.5 bg-[#00f0ff]/5 border border-[#00f0ff]/20 rounded-full text-sm font-jetbrains-mono text-[#00f0ff] mb-8">
            <span className="w-2 h-2 bg-[#00f0ff] rounded-full animate-pulse-dot shadow-lg shadow-[#00f0ff]/50" />
            v1.0.0 · GST 2.0 Ready
          </div>

          {/* Syncopate H1 */}
          <h1 className="hero-line font-syncopate text-5xl md:text-7xl lg:text-8xl font-bold uppercase leading-tight mb-6 text-[#f0f0ff]">
            Sahi Rate.
            <br />
            <span className="text-gradient">Seedha Jawab.</span>
          </h1>

          {/* Subtitle */}
          <p className="hero-line text-base md:text-lg text-[#a1a1aa] max-w-xl mb-10 leading-relaxed font-inter font-light">
            Empowering Tier 2 and Tier 3 businesses to handle compliance without
            the legacy overhead. India&apos;s smartest API for resolving GST rate
            confusion, powered by Gemini Flash AI.
          </p>

          {/* Terminal Sequence */}
          <div className="hero-line w-full max-w-2xl mb-10">
            <TerminalSequence />
          </div>

          {/* CTAs */}
          <div className="hero-line flex items-center gap-4">
            <Link
              href="/check"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#00f0ff] to-[#8a2be2] text-black font-bold text-sm uppercase tracking-wider rounded-full hover:shadow-lg hover:shadow-[#00f0ff]/30 transition-all duration-200 hover:-translate-y-0.5"
            >
              Check Rate
            </Link>
            <Link
              href="http://localhost:8001/docs"
              className="inline-flex items-center px-6 py-3 bg-transparent border border-[#262626] text-[#a1a1aa] text-sm uppercase tracking-wider rounded-full hover:border-[#404040] hover:text-white transition-all duration-200 font-medium"
            >
              View Docs
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <svg
            className="w-5 h-5 text-[#4a4a5a] animate-bounce"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </section>

      {/* ===== TICKER TAPE ===== */}
      <TickerTape />

      {/* ===== PROBLEM SECTION (Why SaralGST) ===== */}
      <section className="py-20 md:py-28 px-6 relative z-10 bg-gradient-to-b from-transparent via-[#0d0d0d]/60 to-transparent border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            {/* Left: Narrative */}
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-space-grotesk leading-tight mb-6 text-[#f0f0ff]">
                Stop Revenue{' '}
                <span className="text-gradient">Leakage</span>.
                <br />
                Ditch{' '}
                <span className="text-gradient">Legacy</span> Systems.
              </h2>
              <p className="text-[#8b949e] text-base md:text-lg leading-relaxed mb-4">
                In expanding Indian markets, complex tax codes and the transition
                to GST 2.0 create massive friction. Relying on outdated, hard-coded
                tax tables in legacy ERP systems leads to miscalculated invoices,
                delayed filings, and inevitable lawsuits.
              </p>
              <p className="text-[#8b949e] text-base md:text-lg leading-relaxed">
                SaralGST replaces brittle, localized logic with a centralized,
                AI-driven backend API. We ensure your software always applies the
                exact legal rate, eliminating compliance anxiety.
              </p>
            </div>

            {/* Right: StatBox */}
            <StatBox items={STAT_ITEMS} />
          </div>
        </div>
      </section>

      {/* ===== ENGINE SECTION (The Platform) ===== */}
      <section id="engine" className="py-20 md:py-28 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="max-w-2xl mb-14">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-space-grotesk leading-tight mb-4 text-[#f0f0ff]">
              The Compliance{' '}
              <span className="text-gradient">Engine</span>.
            </h2>
            <p className="text-[#a1a1aa] text-lg leading-relaxed">
              We replaced brittle, hard-coded tax tables with a centralized,
              AI-driven backend API. Designed to integrate directly into your
              software stack.
            </p>
          </div>

          {/* Bento Grid */}
          <BentoGrid>
            {/* Large card — AI NLP Search */}
            <GlassCard
              tag={{ label: 'NLP Resolution', variant: 'violet' }}
              className="col-span-12 md:col-span-8 row-span-2"
            >
              <h3 className="text-2xl font-bold font-space-grotesk text-[#f0f0ff] mb-3">
                AI-Powered NLP Mapping
              </h3>
              <p className="text-[#a1a1aa] leading-relaxed mb-6 max-w-lg">
                Pass colloquial product names in English or Hindi. Our Gemini Flash
                integration maps &ldquo;LED TV&rdquo; directly to the official CBIC
                nomenclature and 4-digit HSN code instantly.
              </p>
              {/* Embedded search mockup */}
              <div className="bg-[#141414] border border-[#262626] rounded-xl p-4 md:p-5">
                <div className="flex justify-between items-center mb-3 pb-3 border-b border-[#262626] font-jetbrains-mono text-xs">
                  <span className="text-[#71717a]">
                    Query: &ldquo;टेलीविजन (32 इंच से बड़े)&rdquo;
                  </span>
                  <span className="text-[#8a2be2]">Confidence: 0.90</span>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-base font-medium text-[#f0f0ff] mb-1">
                      Television sets (LCD/LED)
                    </div>
                    <div className="font-jetbrains-mono text-sm text-[#a1a1aa]">
                      HSN Code: 8528
                    </div>
                    <div className="font-jetbrains-mono text-xs text-[#71717a] mt-2">
                      Ref: Notif. 8/2025-CT
                    </div>
                  </div>
                  <div className="text-4xl md:text-5xl font-bold font-space-grotesk text-[#10b981]">
                    18%
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Metric — Response Time */}
            <GlassCard className="col-span-12 md:col-span-4">
              <h3 className="text-xl font-bold font-space-grotesk text-[#f0f0ff] mb-2">
                Blistering Speed
              </h3>
              <p className="text-[#a1a1aa] text-sm leading-relaxed mb-4">
                Engineered for brutal efficiency in high-volume POS environments.
              </p>
              <MetricCounter value="<200ms" label="p95 Response Time" accent="cyan" />
            </GlassCard>

            {/* Metric — Historical Tracking */}
            <GlassCard className="col-span-12 md:col-span-4">
              <h3 className="text-xl font-bold font-space-grotesk text-[#f0f0ff] mb-2">
                Historical Tracking
              </h3>
              <p className="text-[#a1a1aa] text-sm leading-relaxed mb-4">
                Side-by-side old vs new rate comparisons post GST 2.0 reform.
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-[#262626]">
                <span className="text-2xl font-bold text-[#71717a] line-through">
                  28%
                </span>
                <span className="text-[#71717a]">→</span>
                <span className="text-3xl font-bold text-[#10b981]">18%</span>
              </div>
            </GlassCard>

            {/* GlassCard — Real-time Updates */}
            <GlassCard
              tag={{ label: 'Deployment', variant: 'emerald' }}
              className="col-span-12 md:col-span-4"
            >
              <h3 className="text-2xl font-bold font-space-grotesk text-[#f0f0ff] mb-3">
                Bypass Legacy Patches
              </h3>
              <p className="text-[#a1a1aa] leading-relaxed">
                Stop forcing your clients to download bulky software patches every
                time the GST Council meets. Centralize your logic. Point your
                systems to SaralGST and serve legally accurate rates dynamically.
              </p>
            </GlassCard>
          </BentoGrid>
        </div>
      </section>

      {/* ===== PIPELINE SECTION (How It Works) ===== */}
      <section className="py-20 md:py-28 px-6 relative z-10 bg-[#0a0a12]/50 border-y border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-space-grotesk leading-tight mb-4 text-[#f0f0ff]">
              The Execution{' '}
              <span className="text-gradient">Pipeline</span>.
            </h2>
            <p className="text-[#a1a1aa] text-lg max-w-xl mx-auto">
              How a single API request resolves complex tax logic in milliseconds.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            {PIPELINE_STEPS.map((step, index) => (
              <PipelineStep
                key={step.step}
                step={step.step}
                title={step.title}
                description={step.description}
                variant={step.variant}
                isLast={index === PIPELINE_STEPS.length - 1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===== DEVELOPER SECTION ===== */}
      <section id="developers" className="py-20 md:py-28 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            {/* Left: Content */}
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-space-grotesk leading-tight mb-4 text-[#f0f0ff]">
                Developer{' '}
                <span className="text-gradient">First</span>.
              </h2>
              <p className="text-[#a1a1aa] text-base md:text-lg leading-relaxed mb-8">
                A completely headless, JSON-driven API that gets out of your way.
                Built on FastAPI for speed, utilizing standard HTTP status codes,
                HMAC authentication, and rigorous Pydantic data validation.
              </p>
              <div className="flex gap-4">
                <Link
                  href="http://localhost:8001/docs"
                  className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-[#00f0ff] to-[#8a2be2] text-black font-bold text-sm rounded-full hover:shadow-lg hover:shadow-[#00f0ff]/30 transition-all"
                >
                  View Swagger Docs
                </Link>
                <Link
                  href="https://github.com/ravikumarve/SaralGST"
                  target="_blank"
                  className="inline-flex items-center px-5 py-2.5 bg-transparent border border-[#262626] text-[#a1a1aa] text-sm rounded-full hover:border-[#404040] hover:text-white transition-all"
                >
                  GitHub Repo
                </Link>
              </div>
            </div>

            {/* Right: Code Block */}
            <CodeBlock />
          </div>
        </div>
      </section>

      {/* ===== USE CASES ===== */}
      <section className="py-20 md:py-28 px-6 relative z-10 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-space-grotesk leading-tight mb-4 text-[#f0f0ff]">
              Built for{' '}
              <span className="text-gradient">Scale</span>.
            </h2>
            <p className="text-[#a1a1aa] text-lg max-w-xl mx-auto">
              Designed specifically to plug into the backend infrastructure of
              financial and retail software.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {USE_CASES.map((uc, index) => (
              <div
                key={index}
                className="p-6 md:p-8 bg-transparent border border-white/10 rounded-xl hover:border-white/20 transition-colors"
              >
                <h4 className="text-lg font-bold text-[#00f0ff] mb-3 font-inter">
                  {uc.title}
                </h4>
                <p className="text-[#8b949e] text-sm leading-relaxed">
                  {uc.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRICING (L3 Inverted) ===== */}
      <section id="pricing" className="relative z-10 mx-4 md:mx-8 my-8">
        <div className="bg-white rounded-3xl md:rounded-[40px] px-6 md:px-16 py-16 md:py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-space-grotesk text-black leading-tight">
                Simple Pricing.
              </h2>
              <p className="text-[#555] text-lg mt-4 font-medium">
                Start for free in the sandbox. Scale instantly to production.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {/* Free Tier */}
              <div className="border-3 border-black rounded-2xl p-6 md:p-8 flex flex-col">
                <div className="font-jetbrains-mono text-sm font-bold text-[#888] mb-3">
                  01 / SANDBOX
                </div>
                <h3 className="text-2xl font-bold font-space-grotesk text-black mb-2 uppercase">
                  Development
                </h3>
                <div className="text-5xl font-black font-space-grotesk text-black mb-6">
                  ₹0<span className="text-lg font-medium text-[#888]"> / forever</span>
                </div>
                <ul className="space-y-3 flex-grow mb-8">
                  <li className="flex items-center gap-3 text-base font-medium text-black">
                    <span className="font-bold">→</span> 3 API Lookups per day
                  </li>
                  <li className="flex items-center gap-3 text-base font-medium text-black">
                    <span className="font-bold">→</span> Full NLP Hindi/English Search
                  </li>
                  <li className="flex items-center gap-3 text-base font-medium text-black">
                    <span className="font-bold">→</span> Standard JSON Responses
                  </li>
                  <li className="flex items-center gap-3 text-base font-medium text-black">
                    <span className="font-bold">→</span> Community Support
                  </li>
                </ul>
                <Link
                  href="http://localhost:8001/docs"
                  className="block w-full text-center py-4 bg-black text-white text-lg font-bold uppercase rounded-full hover:scale-[1.02] transition-transform"
                >
                  Test API Locally
                </Link>
              </div>

              {/* Pro Tier — Featured */}
              <div className="border-3 border-black rounded-2xl p-6 md:p-8 flex flex-col bg-black text-white">
                <div className="font-jetbrains-mono text-sm font-bold text-[#00FF66] mb-3">
                  02 / PRODUCTION
                </div>
                <h3 className="text-2xl font-bold font-space-grotesk text-white mb-2 uppercase">
                  Pro Integration
                </h3>
                <div className="text-5xl font-black font-space-grotesk text-white mb-6">
                  ₹999<span className="text-lg font-medium text-[#888]"> / month</span>
                </div>
                <ul className="space-y-3 flex-grow mb-8">
                  <li className="flex items-center gap-3 text-base font-medium text-white">
                    <span className="font-bold text-[#00FF66]">→</span> 1,000 API Lookups / day
                  </li>
                  <li className="flex items-center gap-3 text-base font-medium text-white">
                    <span className="font-bold text-[#00FF66]">→</span> Secure HMAC Token Auth
                  </li>
                  <li className="flex items-center gap-3 text-base font-medium text-white">
                    <span className="font-bold text-[#00FF66]">→</span> &lt;200ms Response Latency
                  </li>
                  <li className="flex items-center gap-3 text-base font-medium text-white">
                    <span className="font-bold text-[#00FF66]">→</span> Priority Email Support
                  </li>
                </ul>
                <a
                  href="https://gumroad.com"
                  target="_blank"
                  className="block w-full text-center py-4 bg-[#00FF66] text-black text-lg font-bold uppercase rounded-full hover:scale-[1.02] transition-transform"
                >
                  Acquire Token
                </a>
              </div>

              {/* Enterprise Tier */}
              <div className="border-3 border-black rounded-2xl p-6 md:p-8 flex flex-col">
                <div className="font-jetbrains-mono text-sm font-bold text-[#888] mb-3">
                  03 / ENTERPRISE
                </div>
                <h3 className="text-2xl font-bold font-space-grotesk text-black mb-2 uppercase">
                  CA Firm
                </h3>
                <div className="text-5xl font-black font-space-grotesk text-black mb-6">
                  Custom
                </div>
                <ul className="space-y-3 flex-grow mb-8">
                  <li className="flex items-center gap-3 text-base font-medium text-black">
                    <span className="font-bold">→</span> 5,000+ API Lookups / day
                  </li>
                  <li className="flex items-center gap-3 text-base font-medium text-black">
                    <span className="font-bold">→</span> Batch Processing Endpoints
                  </li>
                  <li className="flex items-center gap-3 text-base font-medium text-black">
                    <span className="font-bold">→</span> 99.5% Uptime SLA Guarantee
                  </li>
                  <li className="flex items-center gap-3 text-base font-medium text-black">
                    <span className="font-bold">→</span> Dedicated Account Manager
                  </li>
                </ul>
                <a
                  href="#"
                  className="block w-full text-center py-4 bg-black text-white text-lg font-bold uppercase rounded-full hover:scale-[1.02] transition-transform"
                >
                  Contact Sales
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER (L1 Deep 4-Column) ===== */}
      <footer className="relative z-10 bg-[#151a22] border-t border-white/5 px-6 pt-16 pb-8 mt-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-12">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 font-space-grotesk font-bold text-lg text-[#f0f0ff] mb-4">
                <span className="w-2.5 h-2.5 bg-[#00f0ff] rounded-full shadow-lg shadow-[#00f0ff]/50" />
                SaralGST
              </div>
              <p className="text-sm text-[#8b949e] leading-relaxed max-w-xs">
                India&apos;s simplest, most accurate GST rate checker. A deep
                vertical SaaS built to eliminate compliance leakage for growing
                B2B enterprises.
              </p>
            </div>

            {/* Product */}
            <div>
              <h5 className="font-syncopate text-xs font-bold text-[#f0f0ff] mb-5 tracking-wider uppercase">
                Product
              </h5>
              <ul className="space-y-3">
                <li>
                  <a href="#engine" className="text-sm text-[#8b949e] hover:text-[#00f0ff] transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#developers" className="text-sm text-[#8b949e] hover:text-[#00f0ff] transition-colors">
                    API Integration
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-sm text-[#8b949e] hover:text-[#00f0ff] transition-colors">
                    Pricing Tiers
                  </a>
                </li>
                <li>
                  <a href="http://localhost:8001/docs" className="text-sm text-[#8b949e] hover:text-[#00f0ff] transition-colors">
                    Swagger UI
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h5 className="font-syncopate text-xs font-bold text-[#f0f0ff] mb-5 tracking-wider uppercase">
                Resources
              </h5>
              <ul className="space-y-3">
                <li>
                  <a href="https://github.com/ravikumarve/SaralGST" target="_blank" className="text-sm text-[#8b949e] hover:text-[#00f0ff] transition-colors">
                    GitHub Repo
                  </a>
                </li>
                <li>
                  <a href="http://localhost:8001/redoc" className="text-sm text-[#8b949e] hover:text-[#00f0ff] transition-colors">
                    ReDoc Format
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-[#8b949e] hover:text-[#00f0ff] transition-colors">
                    Implementation Guide
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-[#8b949e] hover:text-[#00f0ff] transition-colors">
                    GST 2.0 Changelog
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h5 className="font-syncopate text-xs font-bold text-[#f0f0ff] mb-5 tracking-wider uppercase">
                Legal
              </h5>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-sm text-[#8b949e] hover:text-[#00f0ff] transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-[#8b949e] hover:text-[#00f0ff] transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-[#8b949e] hover:text-[#00f0ff] transition-colors">
                    Proprietary License
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-[#8b949e] hover:text-[#00f0ff] transition-colors">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="font-jetbrains-mono text-xs text-[#00f0ff]">
              System Status: All Systems Nominal
            </div>
            <div className="text-xs text-[#8b949e]">
              © 2026 SaralGST. <span className="italic">Sahi rate. Seedha jawab.</span> All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
