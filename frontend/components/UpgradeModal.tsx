'use client';

import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';

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

      const Razorpay = (await import('razorpay')).default;

      const options: any = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'SaralGST',
        description: selectedPlan === 'individual' ? 'Individual Plan' : 'CA Firm Plan',
        order_id: orderData.order_id,
        handler: async (response: any) => {
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
            localStorage.setItem('sg_token', verifyData.token);
            localStorage.setItem('sg_tier', verifyData.tier);
            localStorage.setItem('sg_expires_at', verifyData.expires_at);
            onClose();
            window.location.reload();
          } else {
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: { name: '', email: '', contact: '' },
        theme: { color: '#00f0ff' },
      };

      const rzp = new Razorpay(options);
      (rzp as any).open();
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
        {/* L3 glass overlay — backdrop-blur */}
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" />
        <Dialog.Content className="fixed inset-0 z-50 flex items-center justify-center p-6">
          {/* L3 glass dialog */}
          <div className="w-full max-w-md glass-card p-8 border border-white/10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-[#f0f0ff] font-space-grotesk mb-2">
                  Aaj ki limit ho gayi
                </h2>
                <p className="text-sm text-[#71717a]">
                  ₹499/mahine mein unlimited lookups — cancel kabhee bhi
                </p>
              </div>
              <Dialog.Close asChild>
                <button className="text-[#4a4a5a] hover:text-[#f0f0ff] transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </Dialog.Close>
            </div>

            {/* Plan selection — L2 border system */}
            <div className="space-y-4 mb-6">
              <button
                onClick={() => setSelectedPlan('individual')}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  selectedPlan === 'individual'
                    ? 'border-[#00f0ff] bg-[#00f0ff]/5'
                    : 'border-[#262626] bg-[#0d0d0d] hover:border-[#404040]'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-[#f0f0ff]">Individual</span>
                  <span className="text-xl font-bold text-gradient">₹499</span>
                </div>
                <div className="text-sm text-[#71717a]">Unlimited lookups per month</div>
              </button>

              <button
                onClick={() => setSelectedPlan('ca_firm')}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  selectedPlan === 'ca_firm'
                    ? 'border-[#00f0ff] bg-[#00f0ff]/5'
                    : 'border-[#262626] bg-[#0d0d0d] hover:border-[#404040]'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-[#f0f0ff]">CA Firm</span>
                  <span className="text-xl font-bold text-gradient">₹1,999</span>
                </div>
                <div className="text-sm text-[#71717a]">50 GSTINs per month</div>
              </button>
            </div>

            {/* CTA — L1 gradient */}
            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-[#00f0ff] to-[#8a2be2] text-black font-bold rounded-xl hover:shadow-lg hover:shadow-[#00f0ff]/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? 'Processing...' : 'Pay Now'}
            </button>

            <p className="mt-4 text-xs text-[#4a4a5a] text-center font-jetbrains-mono">
              Secure payment powered by Razorpay
            </p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
