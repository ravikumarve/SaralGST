'use client';

import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { storageManager } from '@/lib/storage';

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => void;
  prefill: { name: string; email: string; contact: string };
  theme: { color: string };
}

interface RazorpayInstance {
  open: () => void;
}

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
}

export default function UpgradeModal({ open, onClose }: UpgradeModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<'individual' | 'ca_firm'>('individual');
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: selectedPlan }),
      });

      const orderData = await response.json();

      if (!response.ok) {
        throw new Error(orderData.error || 'Failed to create order');
      }

      const Razorpay = (await import('razorpay')).default as unknown as { new(options: RazorpayOptions): RazorpayInstance };

      const options: RazorpayOptions = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'SaralGST',
        description: selectedPlan === 'individual' ? 'Individual Plan' : 'CA Firm Plan',
        order_id: orderData.order_id,
        handler: async (response) => {
          const verifyResponse = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              plan: selectedPlan,
            }),
          });

          const verifyData = await verifyResponse.json();

          if (verifyResponse.ok && verifyData.success) {
            storageManager.setToken(verifyData.token);
            storageManager.setTier(verifyData.tier);
            storageManager.setExpiresAt(verifyData.expires_at);
            onClose();
            window.location.reload();
          } else {
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: { name: '', email: '', contact: '' },
        theme: { color: '#f8f9fa' },
      };

      const rzp: RazorpayInstance = new Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Failed to initiate payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80" />
        <Dialog.Content className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="w-full max-w-md bg-[#0a0a0a] border border-[rgba(255,255,255,0.06)] rounded-[8px] p-8 shadow-2xl">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-[#f8f9fa] mb-2">
                  Aaj ki limit ho gayi
                </h2>
                <p className="text-sm text-[#a1a1aa]">
                  ₹499/mahine mein unlimited lookups — cancel kabhee bhi
                </p>
              </div>
              <Dialog.Close asChild>
                <button className="text-[#a1a1aa] hover:text-[#f8f9fa] transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </Dialog.Close>
            </div>

            {/* Plan selection */}
            <div className="space-y-4 mb-6">
              <button
                onClick={() => setSelectedPlan('individual')}
                className={`w-full p-4 rounded-[8px] border transition-all text-left ${
                  selectedPlan === 'individual'
                    ? 'border-[#f8f9fa] bg-[rgba(255,255,255,0.05)]'
                    : 'border-[rgba(255,255,255,0.06)] bg-[#050505] hover:border-[rgba(255,255,255,0.12)]'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-[#f8f9fa]">Individual</span>
                  <span className="text-xl font-bold text-[#f8f9fa]">₹499</span>
                </div>
                <div className="text-sm text-[#a1a1aa]">Unlimited lookups per month</div>
              </button>

              <button
                onClick={() => setSelectedPlan('ca_firm')}
                className={`w-full p-4 rounded-[8px] border transition-all text-left ${
                  selectedPlan === 'ca_firm'
                    ? 'border-[#f8f9fa] bg-[rgba(255,255,255,0.05)]'
                    : 'border-[rgba(255,255,255,0.06)] bg-[#050505] hover:border-[rgba(255,255,255,0.12)]'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-[#f8f9fa]">CA Firm</span>
                  <span className="text-xl font-bold text-[#f8f9fa]">₹1,999</span>
                </div>
                <div className="text-sm text-[#a1a1aa]">50 GSTINs per month</div>
              </button>
            </div>

            {/* CTA */}
            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full py-3.5 bg-[#f8f9fa] text-[#000000] font-bold rounded-[4px] hover:bg-transparent hover:text-[#f8f9fa] border border-[#f8f9fa] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              {loading ? 'Processing...' : 'Pay Now'}
            </button>

            <p className="mt-4 text-[10px] text-[#a1a1aa] text-center mono">
              Secure payment powered by Razorpay
            </p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
