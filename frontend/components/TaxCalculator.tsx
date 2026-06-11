'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiClient } from '@/lib/api';

interface TaxCalculatorProps {
  gstRate: number;
  itemName: string;
}

export default function TaxCalculator({ gstRate, itemName }: TaxCalculatorProps) {
  const [basePrice, setBasePrice] = useState<string>('');
  const [calculation, setCalculation] = useState<{
    cgst: number;
    sgst: number;
    igst: number;
    total: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const calculateTax = async () => {
      if (!basePrice || isNaN(parseFloat(basePrice))) {
        setCalculation(null);
        return;
      }

      setLoading(true);
      try {
        const data = await apiClient.calculate(parseFloat(basePrice), gstRate);
        setCalculation({
          cgst: data.cgst,
          sgst: data.sgst,
          igst: data.igst,
          total: data.total_amount,
        });
      } catch (error) {
        console.error('Calculation error:', error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(calculateTax, 300); // Debounce for better performance
    return () => clearTimeout(timer);
  }, [basePrice, gstRate]);

  return (
    <div className="mt-8 p-6 bg-surface border border-border rounded-2xl border-glow relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
        <svg className="w-24 h-24 text-accent" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
        </svg>
      </div>

      <h3 className="text-xl font-bold text-text-primary mb-6 font-space-grotesk flex items-center gap-2">
        <span className="w-2 h-6 bg-accent rounded-full" />
        Tax Calculator for {itemName}
      </h3>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Input Section */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2 ml-1">
              Base Price (₹)
            </label>
            <div className="relative">
              <input
                type="number"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                placeholder="e.g. 1000"
                className="w-full px-6 py-4 bg-bg border border-border rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all font-jetbrains-mono text-lg"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted font-jetbrains-mono">
                ₹
              </div>
            </div>
          </div>

          <div className="p-4 bg-bg-2 rounded-xl border border-border">
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-secondary">Applicable GST Rate:</span>
              <span className="text-lg font-bold text-accent font-jetbrains-mono">{gstRate}%</span>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {calculation ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-text-secondary">CGST (Central)</span>
                  <span className="font-jetbrains-mono text-text-primary">₹{calculation.cgst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-text-secondary">SGST (State)</span>
                  <span className="font-jetbrains-mono text-text-primary">₹{calculation.sgst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-text-secondary">IGST (Integrated)</span>
                  <span className="font-jetbrains-mono text-text-primary">₹{calculation.igst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pt-4">
                  <span className="text-lg font-bold text-text-primary">Total Amount</span>
                  <span className="text-3xl font-bold text-gradient font-space-grotesk">
                    ₹{calculation.total.toFixed(2)}
                  </span>
                </div>
              </motion.div>
            ) : (
              <div className="text-center py-8 text-text-muted italic">
                {loading ? 'Calculating...' : 'Enter a base price to see the breakdown'}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
