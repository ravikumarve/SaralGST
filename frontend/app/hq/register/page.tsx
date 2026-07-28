'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function LogoL() {
  return (
    <Link href="/" className="logo justify-center mb-10">
      <span className="logo-mark" />
      SaralGST
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
    <div className="min-h-screen bg-[#000000] flex items-center justify-center px-6 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="ambient-glow" aria-hidden="true" />

      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <LogoL />

        <div className="hq-auth-card">
          <div className="pl-4">
            <h1 className="text-2xl font-bold text-[#ededed] mb-1">Create Account</h1>
            <p className="text-sm text-[#71717a] mb-2">Join Saral HQ — it&apos;s free</p>
            <p className="text-sm text-[#71717a] mb-8">
              Already have an account?{' '}
              <Link href="/hq/login" className="text-[#6366F1] hover:text-[#a5b4fc] transition-colors font-medium">
                Sign in
              </Link>
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm text-[#a1a1aa] mb-2">Name <span className="text-[#52525b]">(optional)</span></label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-[rgba(20,20,20,0.6)] border border-[#262626] rounded-xl text-[#ededed] placeholder-[#71717a] focus:outline-none focus:border-[#6366F1]/40 transition-colors backdrop-blur-sm"
                  placeholder="Your name"
                  maxLength={100}
                />
                <div className="text-right mt-1 text-[10px] text-[#52525b] mono">{name.length}/100</div>
              </div>

              <div>
                <label className="block text-sm text-[#a1a1aa] mb-2">Email <span className="text-[#6366F1]">*</span></label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-[rgba(20,20,20,0.6)] border border-[#262626] rounded-xl text-[#ededed] placeholder-[#71717a] focus:outline-none focus:border-[#6366F1]/40 transition-colors backdrop-blur-sm"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-[#a1a1aa] mb-2">Password <span className="text-[#6366F1]">*</span></label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-[rgba(20,20,20,0.6)] border border-[#262626] rounded-xl text-[#ededed] placeholder-[#71717a] focus:outline-none focus:border-[#6366F1]/40 transition-colors backdrop-blur-sm"
                  placeholder="At least 6 characters"
                  minLength={6}
                  required
                />
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.25)]">
                  <p className="text-sm text-[#ef4444]">{error}</p>
                </div>
              )}

              {success && (
                <div className="p-3 rounded-xl bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.3)]">
                  <p className="text-sm text-[#10b981]">{success}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#6366F1] text-[#000000] font-bold rounded-xl hover:bg-[#a5b4fc] disabled:opacity-50 transition-all"
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-[#71717a]">
                Already have an account?{' '}
                <Link href="/hq/login" className="text-[#6366F1] hover:text-[#a5b4fc] transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>

        <p className="text-center text-[10px] text-[#52525b] mt-6 mono">
          SaralGST v1.0.0 — Proprietary
        </p>
      </div>
    </div>
  );
}
