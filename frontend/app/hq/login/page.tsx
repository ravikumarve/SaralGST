'use client';

import { signIn } from 'next-auth/react';
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

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError('Invalid email or password');
      setLoading(false);
    } else {
      router.push('/hq/overview');
    }
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
            <h1 className="text-2xl font-bold text-[#ededed] mb-1">Saral HQ</h1>
            <p className="text-sm text-[#71717a] mb-8">Sign in to your command center</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm text-[#a1a1aa] mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-[rgba(20,20,20,0.6)] border border-[#262626] rounded-xl text-[#ededed] placeholder-[#71717a] focus:outline-none focus:border-[#6366F1]/40 transition-colors backdrop-blur-sm"
                  placeholder="admin@saralgst.in"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-[#a1a1aa] mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-[rgba(20,20,20,0.6)] border border-[#262626] rounded-xl text-[#ededed] placeholder-[#71717a] focus:outline-none focus:border-[#6366F1]/40 transition-colors backdrop-blur-sm"
                  placeholder="••••••••"
                  required
                />
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.25)]">
                  <p className="text-sm text-[#ef4444]">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#6366F1] text-[#000000] font-bold rounded-xl hover:bg-[#a5b4fc] disabled:opacity-50 transition-all"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-[#71717a]">
                Don&apos;t have an account?{' '}
                <Link href="/hq/register" className="text-[#6366F1] hover:text-[#a5b4fc] transition-colors">
                  Register
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
