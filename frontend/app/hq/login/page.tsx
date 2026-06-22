'use client';

import { signIn } from 'next-auth/react';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
    <div className="min-h-screen bg-[#020202] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <a href="/" className="logo justify-center mb-10">
          <span className="logo-mark" />
          SaralGST
        </a>

        <div className="bg-[#0a0a0a] border border-[#262626] rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-[#ededed] mb-1">Saral HQ</h1>
          <p className="text-sm text-[#71717a] mb-8">Sign in to your command center</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-[#a1a1aa] mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[#141414] border border-[#262626] rounded-xl text-[#ededed] placeholder-[#71717a] focus:outline-none focus:border-[#F59E0B]/40 transition-colors"
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
                className="w-full px-4 py-3 bg-[#141414] border border-[#262626] rounded-xl text-[#ededed] placeholder-[#71717a] focus:outline-none focus:border-[#F59E0B]/40 transition-colors"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-[rgba(251,191,36,0.1)] border border-[rgba(251,191,36,0.3)]">
                <p className="text-sm text-[#FBBF24]">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#F59E0B] text-[#020202] font-bold rounded-xl hover:bg-[#FBBF24] disabled:opacity-50 transition-all"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-[#71717a]">
              Don&apos;t have an account?{' '}
              <Link href="/hq/register" className="text-[#F59E0B] hover:text-[#FBBF24] transition-colors">
                Register
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
