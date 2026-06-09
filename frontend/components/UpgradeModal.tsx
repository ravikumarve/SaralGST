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
      // Create Razorpay order
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan: selectedPlan }),
      });

      const orderData = await response.json();

      if (!response.ok) {
        throw new Error(orderData.error || 'Failed to create order');
      }

      // Load Razorpay checkout
      const Razorpay = (await import('razorpay')).default;

      const options: any = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'SaralGST',
        description: selectedPlan === 'individual' ? 'Individual Plan' : 'CA Firm Plan',
        order_id: orderData.order_id,
        handler: async (response: any) => {
          // Verify payment
          const verifyResponse = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              plan: selectedPlan,
            }),
          });

          const verifyData = await verifyResponse.json();

          if (verifyResponse.ok && verifyData.success) {
            // Store token in localStorage
            localStorage.setItem('sg_token', verifyData.token);
            localStorage.setItem('sg_tier', verifyData.tier);
            localStorage.setItem('sg_expires_at', verifyData.expires_at);

            // Close modal and reload page
            onClose();
            window.location.reload();
          } else {
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: '',
        },
        theme: {
          color: '#6366f1',
        },
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
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80" />
        <Dialog.Content className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="bg-surface border-2 border-accent rounded-2xl p-8 max-w-md w-full border-glow">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-text-primary font-space-grotesk">
                Aaj ki limit ho gayi
              </h2>
              <Dialog.Close asChild>
                <button className="text-text-muted hover:text-text-primary">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </Dialog.Close>
            </div>

            <p className="text-text-secondary mb-8">
              ₹499/mahine mein unlimited lookups — cancel kabhee bhi
            </p>

            <div className="space-y-4 mb-6">
              {/* Individual Plan */}
              <button
                onClick={() => setSelectedPlan('individual')}
                className={`w-full p-4 rounded-xl border-2 transition-all ${
                  selectedPlan === 'individual'
                    ? 'border-accent bg-accent/10'
                    : 'border-border bg-bg hover:border-accent/50'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-text-primary">Individual</span>
                  <span className="text-xl font-bold text-gradient">₹499</span>
                </div>
                <div className="text-sm text-text-muted">Unlimited lookups per month</div>
              </button>

              {/* CA Firm Plan */}
              <button
                onClick={() => setSelectedPlan('ca_firm')}
                className={`w-full p-4 rounded-xl border-2 transition-all ${
                  selectedPlan === 'ca_firm'
                    ? 'border-accent bg-accent/10'
                    : 'border-border bg-bg hover:border-accent/50'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-text-primary">CA Firm</span>
                  <span className="text-xl font-bold text-gradient">₹1,999</span>
                </div>
                <div className="text-sm text-text-muted">50 GSTINs per month</div>
              </button>
            </div>

            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full py-3 bg-accent hover:bg-accent-2 disabled:bg-surface disabled:text-text-muted text-white rounded-full font-medium transition-colors"
            >
              {loading ? 'Processing...' : 'Pay Now'}
            </button>

            <p className="mt-4 text-xs text-text-muted text-center">
              Secure payment powered by Razorpay
            </p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
