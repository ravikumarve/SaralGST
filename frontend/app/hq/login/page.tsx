'use client';

import { signIn } from 'next-auth/react';
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
    <div className="min-h-screen bg-[#000000] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <LogoL />

        <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.06)] rounded-2xl p-8">
          <h1 className="font-[var(--font-serif)] text-2xl text-[#f8f9fa] mb-1">Saral HQ</h1>
          <p className="text-sm text-[#a1a1aa] mb-8 font-light">Sign in to your command center</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs text-[#a1a1aa] mb-2 uppercase tracking-[1px]">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[#050505] border border-[rgba(255,255,255,0.06)] rounded-lg text-[#f8f9fa] placeholder-[#52525b] focus:outline-none focus:border-[rgba(255,255,255,0.12)] transition-colors text-sm"
                placeholder="admin@saralgst.in"
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
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.25)]">
                <p className="text-sm text-[#ef4444]">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#f8f9fa] text-[#000000] font-medium rounded-lg hover:bg-transparent hover:text-[#f8f9fa] hover:border hover:border-[#f8f9fa] transition-all duration-200 uppercase tracking-[1px] text-sm disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-[#52525b]">
              Don&apos;t have an account?{' '}
              <Link href="/hq/register" className="text-[#a1a1aa] hover:text-[#f8f9fa] transition-colors">
                Register
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-[10px] text-[#52525b] mt-6 font-mono">
          SaralGST v1.0.0 — Proprietary
        </p>
      </div>
    </div>
  );
}
