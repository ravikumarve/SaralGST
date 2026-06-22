'use client';

import { useEffect, useState } from 'react';

interface Invoice {
  id: string;
  amount: number;
  currency: string;
  status: string;
  plan: string;
  createdAt: string;
  razorpayId: string | null;
}

export default function BillingPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [tier, setTier] = useState('free');

  useEffect(() => {
    Promise.all([
      fetch('/api/hq/billing').then((r) => r.json()),
      fetch('/api/hq/overview').then((r) => r.json()),
    ]).then(([billing, overview]) => {
      setInvoices(billing.invoices || []);
      setTier(overview.userTier || 'free');
      setLoading(false);
    }).catch(console.error);
  }, []);

  const plans = [
    { name: 'Free', tier: 'free', price: '₹0', features: ['3 lookups/day', 'Basic rate lookup', 'Community support'] },
    { name: 'Pro', tier: 'paid', price: '₹999/mo', features: ['1,000 lookups/day', 'HMAC auth', '<200ms response', 'Email support'], popular: true },
    { name: 'CA Firm', tier: 'ca_firm', price: '₹1,999/mo', features: ['5,000 lookups/day', 'Multi-GSTIN', 'Batch processing', 'Priority support'] },
  ];

  return (
    <div className="p-8 max-w-6xl">
      <h1 className="text-2xl font-bold text-[#ededed] mb-1">Billing</h1>
      <p className="text-[#71717a] text-sm mb-8">Your subscription and payment history</p>

      {/* Plans */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {plans.map((plan) => {
          const isCurrent = tier === plan.tier;
          return (
            <div
              key={plan.tier}
              className={`bg-[#0a0a0a] border rounded-2xl p-6 ${
                isCurrent ? 'border-[#F59E0B]' : plan.popular ? 'border-[rgba(245,158,11,0.3)]' : 'border-[#262626]'
              }`}
            >
              {plan.popular && <div className="mono text-[10px] text-[#F59E0B] uppercase tracking-wider mb-3">Most Popular</div>}
              <h3 className="text-lg font-bold text-[#ededed] mb-1">{plan.name}</h3>
              <div className="text-2xl font-bold text-[#F59E0B] mb-4">{plan.price}</div>
              <ul className="space-y-2 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="text-sm text-[#a1a1aa] flex items-center gap-2">
                    <span className="text-[#10b981]">✓</span> {f}
                  </li>
                ))}
              </ul>
              {isCurrent ? (
                <div className="w-full py-2.5 text-center text-sm text-[#10b981] bg-[rgba(16,185,129,0.1)] rounded-xl">
                  Current Plan
                </div>
              ) : (
                <a
                  href="https://gumroad.com"
                  target="_blank"
                  className="block w-full py-2.5 text-center text-sm bg-[#141414] text-[#a1a1aa] rounded-xl hover:text-[#ededed] hover:bg-[#262626] transition-colors"
                >
                  Upgrade
                </a>
              )}
            </div>
          );
        })}
      </div>

      {/* Invoices */}
      <div className="bg-[#0a0a0a] border border-[#262626] rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-[#ededed] mb-4">Payment History</h2>
        {loading ? (
          <div className="text-[#71717a] text-sm">Loading...</div>
        ) : invoices.length === 0 ? (
          <div className="text-[#71717a] text-sm py-8 text-center border border-dashed border-[#262626] rounded-xl">
            No invoices yet.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#262626]">
                <th className="text-left px-4 py-3 text-[#71717a] font-medium">Date</th>
                <th className="text-left px-4 py-3 text-[#71717a] font-medium">Plan</th>
                <th className="text-left px-4 py-3 text-[#71717a] font-medium">Amount</th>
                <th className="text-left px-4 py-3 text-[#71717a] font-medium">Status</th>
                <th className="text-left px-4 py-3 text-[#71717a] font-medium">Razorpay ID</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="border-b border-[#262626] last:border-0">
                  <td className="px-4 py-3 text-[#ededed]">{new Date(inv.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-[#a1a1aa] capitalize">{inv.plan}</td>
                  <td className="px-4 py-3 text-[#F59E0B] mono">₹{inv.amount.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`mono text-[10px] px-2 py-1 rounded-full ${
                      inv.status === 'paid' ? 'text-[#10b981] bg-[rgba(16,185,129,0.1)]' : 'text-[#71717a] bg-[#141414]'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#52525b] mono text-xs">{inv.razorpayId || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
