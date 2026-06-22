'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
    <div className="min-h-screen bg-[#020202] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <a href="/" className="logo justify-center mb-10">
          <span className="logo-mark" />
          SaralGST
        </a>

        <div className="bg-[#0a0a0a] border border-[#262626] rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-[#ededed] mb-1">Create Account</h1>
          <p className="text-sm text-[#71717a] mb-8">Join Saral HQ — it&apos;s free</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-[#a1a1aa] mb-2">Name <span className="text-[#52525b]">(optional)</span></label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-[#141414] border border-[#262626] rounded-xl text-[#ededed] placeholder-[#71717a] focus:outline-none focus:border-[#F59E0B]/40 transition-colors"
                placeholder="Your name"
                maxLength={100}
              />
            </div>

            <div>
              <label className="block text-sm text-[#a1a1aa] mb-2">Email <span className="text-[#F59E0B]">*</span></label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[#141414] border border-[#262626] rounded-xl text-[#ededed] placeholder-[#71717a] focus:outline-none focus:border-[#F59E0B]/40 transition-colors"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-[#a1a1aa] mb-2">Password <span className="text-[#F59E0B]">*</span></label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#141414] border border-[#262626] rounded-xl text-[#ededed] placeholder-[#71717a] focus:outline-none focus:border-[#F59E0B]/40 transition-colors"
                placeholder="At least 6 characters"
                minLength={6}
                required
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-[rgba(251,191,36,0.1)] border border-[rgba(251,191,36,0.3)]">
                <p className="text-sm text-[#FBBF24]">{error}</p>
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
              className="w-full py-3 bg-[#F59E0B] text-[#020202] font-bold rounded-xl hover:bg-[#FBBF24] disabled:opacity-50 transition-all"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-[#71717a]">
              Already have an account?{' '}
              <Link href="/hq/login" className="text-[#F59E0B] hover:text-[#FBBF24] transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-[10px] text-[#52525b] mt-6 mono">
          SaralGST v1.0.0 — Proprietary
        </p>
      </div>
    </div>
  );
}
