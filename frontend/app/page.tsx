'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Hero text stagger reveal
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

    // Glow orb slow float
    if (orb1Ref.current) {
      gsap.to(orb1Ref.current, {
        x: 60,
        y: -40,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }

    if (orb2Ref.current) {
      gsap.to(orb2Ref.current, {
        x: -60,
        y: 40,
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }

    // Section scroll triggers
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

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-bg relative overflow-hidden">
      {/* Ambient glow orbs */}
      <div ref={orb1Ref} className="glow-orb glow-orb-1 absolute top-20 left-20" />
      <div ref={orb2Ref} className="glow-orb glow-orb-2 absolute bottom-20 right-20" />

      {/* HERO Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 py-20 text-center relative z-10">
        <div ref={heroRef} className="max-w-5xl">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold font-space-grotesk mb-6 leading-tight">
            <span className="hero-line block text-text-primary">Sahi GST rate.</span>
            <span className="hero-line block text-gradient">Seedha jawab.</span>
          </h1>

          <p className="hero-line text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-12 font-inter">
            GST 2.0 ke baad rates badal gaye. Kya aap sahi rate file kar rahe hain?
          </p>

          <div className="hero-line">
            <Link
              href="/check"
              className="inline-block px-8 py-4 bg-accent hover:bg-accent-2 text-white rounded-full font-medium transition-all duration-300 hover:scale-105 border-glow"
            >
              Rate Check Karein →
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <svg
            className="w-6 h-6 text-text-muted"
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

      {/* PROBLEM STRIP */}
      <section className="py-6 bg-bg-2 border-y border-border overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          <span className="mx-8 text-text-secondary font-space-grotesk text-lg">
            GST 2.0 · Sept 2025 · Rates Changed · 12% → 5% · 28% → 18% · Kya aapka rate sahi hai? ·
          </span>
          <span className="mx-8 text-text-secondary font-space-grotesk text-lg">
            GST 2.0 · Sept 2025 · Rates Changed · 12% → 5% · 28% → 18% · Kya aapka rate sahi hai? ·
          </span>
          <span className="mx-8 text-text-secondary font-space-grotesk text-lg">
            GST 2.0 · Sept 2025 · Rates Changed · 12% → 5% · 28% → 18% · Kya aapka rate sahi hai? ·
          </span>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold font-space-grotesk text-center mb-16 text-text-primary">
            Kaise kaam karta hai?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="reveal-card relative p-8 bg-surface border border-border rounded-2xl hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300">
              <div className="absolute top-4 right-4 text-8xl font-bold text-text-muted opacity-20 font-space-grotesk">
                01
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3 font-space-grotesk">
                Product likhein
              </h3>
              <p className="text-text-secondary">
                Product ka naam ya HSN code likhein. Hindi ya English - dono mein kaam karega.
              </p>
            </div>

            {/* Step 2 */}
            <div className="reveal-card relative p-8 bg-surface border border-border rounded-2xl hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300">
              <div className="absolute top-4 right-4 text-8xl font-bold text-text-muted opacity-20 font-space-grotesk">
                02
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3 font-space-grotesk">
                Rate dekhein
              </h3>
              <p className="text-text-secondary">
                Pehle ka rate vs GST 2.0 ka rate - dono side by side dikhega.
              </p>
            </div>

            {/* Step 3 */}
            <div className="reveal-card relative p-8 bg-surface border border-border rounded-2xl hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300">
              <div className="absolute top-4 right-4 text-8xl font-bold text-text-muted opacity-20 font-space-grotesk">
                03
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3 font-space-grotesk">
                Sahi rate file karein
              </h3>
              <p className="text-text-secondary">
                Official notification reference ke saath sahi rate file karein.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT CHANGED */}
      <section className="py-24 px-6 bg-bg-2">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold font-space-grotesk text-center mb-6 text-text-primary">
            Kya badla?
          </h2>
          <p className="text-lg text-text-secondary text-center mb-12">
            GST 2.0 mein ye rates badal gaye
          </p>

          <div className="space-y-4">
            {/* Rate change items */}
            {[
              { hsn: '8528', name: 'LED Television (32" se bada)', old: 28, new: 18, movement: 'down' },
              { hsn: '8415', name: 'Air Conditioner', old: 28, new: 18, movement: 'down' },
              { hsn: '9004', name: 'Spectacles/Corrective goggles', old: 28, new: 5, movement: 'down' },
              { hsn: '2106', name: 'Packaged food items', old: 12, new: 5, movement: 'down' },
              { hsn: '3003', name: 'Homoeopathy medicines', old: 12, new: 5, movement: 'down' },
              { hsn: '9503', name: 'Wooden/metal toys', old: 12, new: 5, movement: 'down' },
            ].map((item, index) => (
              <div
                key={index}
                className="reveal-card flex items-center justify-between p-6 bg-surface border border-border rounded-xl"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-jetbrains-mono text-text-muted">
                      HSN: {item.hsn}
                    </span>
                    <span className="text-sm text-text-secondary">{item.name}</span>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-sm text-text-muted mb-1">Pehle</div>
                    <div className="text-2xl font-bold text-text-primary">{item.old}%</div>
                  </div>

                  <div className={`text-2xl ${item.movement === 'down' ? 'text-green' : 'text-red'}`}>
                    →→→
                  </div>

                  <div className="text-center">
                    <div className="text-sm text-text-muted mb-1">Ab</div>
                    <div
                      className={`text-2xl font-bold ${
                        item.movement === 'down' ? 'text-green' : 'text-red'
                      }`}
                    >
                      {item.new}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="reveal-card text-center mt-12">
            <Link
              href="/check"
              className="inline-block px-8 py-4 bg-accent hover:bg-accent-2 text-white rounded-full font-medium transition-all duration-300 hover:scale-105"
            >
              Apna product check karein →
            </Link>
          </div>
        </div>
      </section>

      {/* TRUST SIGNAL */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-lg text-text-secondary mb-8">
            Trusted by 500+ CA firms and 10,000+ small businesses
          </p>
          <div className="flex items-center justify-center gap-8">
            <div className="flex items-center gap-2 text-text-muted">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              <span className="text-sm font-medium">A2Z Tax Solutions</span>
            </div>
            <div className="flex items-center gap-2 text-text-muted">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              <span className="text-sm font-medium">Raj & Co.</span>
            </div>
            <div className="flex items-center gap-2 text-text-muted">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              <span className="text-sm font-medium">GST Experts India</span>
            </div>
          </div>
        </div>
      </section>
      {/* FOR CA FIRMS */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="reveal-card p-8 bg-surface border-2 border-accent rounded-2xl border-glow hover:shadow-xl hover:shadow-accent/10 transition-all duration-300">
            <h2 className="text-3xl md:text-4xl font-bold font-space-grotesk mb-4 text-text-primary">
              CA firm hain?
            </h2>
            <p className="text-lg text-text-secondary mb-6">
              Apne sabhi clients ke rates ek saath check karein. 50 GSTINs ke liye special plan.
            </p>
            <div className="flex items-center gap-4">
              <div className="text-4xl font-bold text-gradient font-space-grotesk">
                ₹1,999
              </div>
              <div className="text-text-secondary">
                <div>/month</div>
                <div className="text-sm">50 GSTINs</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="py-24 px-6 bg-bg-2">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold font-space-grotesk text-center mb-16 text-text-primary">
            Pricing
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Free Plan */}
            <div className="reveal-card p-8 bg-surface border border-border rounded-2xl hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300">
              <h3 className="text-2xl font-bold text-text-primary mb-2 font-space-grotesk">
                Free
              </h3>
              <div className="text-4xl font-bold text-text-primary mb-6">₹0</div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-text-secondary">
                  <svg className="w-5 h-5 text-green" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  3 lookups per day
                </li>
                <li className="flex items-center gap-2 text-text-secondary">
                  <svg className="w-5 h-5 text-green" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Basic rate lookup
                </li>
                <li className="flex items-center gap-2 text-text-secondary">
                  <svg className="w-5 h-5 text-green" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Notification reference
                </li>
              </ul>
              <Link
                href="/check"
                className="block w-full py-3 text-center border border-border rounded-full text-text-primary hover:bg-surface transition-colors"
              >
                Start Free
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="reveal-card p-8 bg-surface border-2 border-accent rounded-2xl border-glow relative hover:shadow-xl hover:shadow-accent/10 transition-all duration-300">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent text-white text-sm rounded-full">
                Popular
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-2 font-space-grotesk">
                Pro
              </h3>
              <div className="text-4xl font-bold text-gradient mb-6">₹499</div>
              <div className="text-sm text-text-secondary mb-6">/month · Unlimited</div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-text-secondary">
                  <svg className="w-5 h-5 text-green" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Unlimited lookups
                </li>
                <li className="flex items-center gap-2 text-text-secondary">
                  <svg className="w-5 h-5 text-green" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Priority support
                </li>
                <li className="flex items-center gap-2 text-text-secondary">
                  <svg className="w-5 h-5 text-green" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Cancel anytime
                </li>
              </ul>
              <button className="block w-full py-3 text-center bg-accent hover:bg-accent-2 text-white rounded-full transition-colors">
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-2xl font-bold text-gradient font-space-grotesk mb-4">
            SaralGST
          </div>
          <p className="text-text-secondary mb-4">sahigst.in</p>
          <p className="text-sm text-text-muted">
            GST 2.0 data updated Sept 22, 2025
          </p>
        </div>
      </footer>
    </div>
  );
}
