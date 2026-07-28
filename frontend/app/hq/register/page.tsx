'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function LogoL() {
  return (
    <Link href="/" className="flex items-center justify-center gap-3 mb-12 no-underline">
      <span className="w-9 h-9 border border-[#f8f9fa] flex items-center justify-center rounded-[4px] text-base font-medium text-[#f8f9fa]">S</span>
      <span className="font-[var(--font-serif)] text-xl text-[#f8f9fa]">SaralGST</span>
    </Link>
  );
}

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Client-side validation
    if (!email.trim()) {
      setError('Email is required');
      setLoading(false);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/hq/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim() || undefined,
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed');
        setLoading(false);
        return;
      }

      // Success — show message and redirect to login
      setSuccess(data.message || 'Account created!');
      setTimeout(() => {
        router.push('/hq/login');
      }, 1500);
    } catch {
      setError('Network error. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#000000] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <LogoL />

        <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.06)] rounded-2xl p-8">
          <h1 className="font-[var(--font-serif)] text-2xl text-[#f8f9fa] mb-1">Create Account</h1>
          <p className="text-sm text-[#a1a1aa] mb-2 font-light">Join Saral HQ — it&apos;s free</p>
          <p className="text-sm text-[#52525b] mb-8">
            Already have an account?{' '}
            <Link href="/hq/login" className="text-[#a1a1aa] hover:text-[#f8f9fa] transition-colors">
              Sign in
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs text-[#a1a1aa] mb-2 uppercase tracking-[1px]">Name <span className="text-[#52525b] normal-case tracking-normal">(optional)</span></label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-[#050505] border border-[rgba(255,255,255,0.06)] rounded-lg text-[#f8f9fa] placeholder-[#52525b] focus:outline-none focus:border-[rgba(255,255,255,0.12)] transition-colors text-sm"
                placeholder="Your name"
                maxLength={100}
              />
              <div className="text-right mt-1 text-[10px] text-[#52525b] font-mono">{name.length}/100</div>
            </div>

            <div>
              <label className="block text-xs text-[#a1a1aa] mb-2 uppercase tracking-[1px]">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[#050505] border border-[rgba(255,255,255,0.06)] rounded-lg text-[#f8f9fa] placeholder-[#52525b] focus:outline-none focus:border-[rgba(255,255,255,0.12)] transition-colors text-sm"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-xs text-[#a1a1aa] mb-2 uppercase tracking-[1px]">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#050505] border border-[rgba(255,255,255,0.06)] rounded-lg text-[#f8f9fa] placeholder-[#52525b] focus:outline-none focus:border-[rgba(255,255,255,0.12)] transition-colors text-sm"
                placeholder="At least 6 characters"
                minLength={6}
                required
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.25)]">
                <p className="text-sm text-[#ef4444]">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-3 rounded-lg bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.3)]">
                <p className="text-sm text-[#10b981]">{success}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#f8f9fa] text-[#000000] font-medium rounded-lg hover:bg-transparent hover:text-[#f8f9fa] hover:border hover:border-[#f8f9fa] transition-all duration-200 uppercase tracking-[1px] text-sm disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="text-center text-[10px] text-[#52525b] mt-6 font-mono">
          SaralGST v1.0.0 — Proprietary
        </p>
      </div>
    </div>
  );
}
