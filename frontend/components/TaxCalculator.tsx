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

    const timer = setTimeout(calculateTax, 300);
    return () => clearTimeout(timer);
  }, [basePrice, gstRate]);

  return (
    <div className="glass-card p-6 md:p-8 relative overflow-hidden">
      {/* Gradient accent bar — L1 */}
      <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[#00f0ff] to-[#8a2be2]" />

      <div className="pl-4">
        <h3 className="text-xl font-bold text-[#f0f0ff] mb-6 font-space-grotesk">
          Tax Calculator
          <span className="block text-sm font-normal text-[#71717a] font-inter mt-1">
            for {itemName}
          </span>
        </h3>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Section — L2 precision */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#71717a] mb-2 ml-1">
                Base Price (₹)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                  placeholder="e.g. 1000"
                  className="w-full px-5 py-3.5 bg-[#0d0d0d] border border-[#262626] rounded-xl text-[#f0f0ff] placeholder-[#4a4a5a] focus:outline-none focus:border-[#404040] transition-colors font-jetbrains-mono text-base"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4a4a5a] font-jetbrains-mono text-sm">
                  ₹
                </div>
              </div>
            </div>

            {/* Rate display — L2 metric */}
            <div className="p-4 bg-[#0d0d0d] rounded-xl border border-[#262626]">
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#71717a]">Applicable GST Rate:</span>
                <span className="text-lg font-bold text-[#00f0ff] font-jetbrains-mono">{gstRate}%</span>
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
                  {/* Breakdown rows — L2 clean border-b */}
                  <div className="flex justify-between items-center py-2.5 border-b border-[#262626]">
                    <span className="text-sm text-[#71717a]">CGST (Central)</span>
                    <span className="font-jetbrains-mono text-sm text-[#f0f0ff]">
                      ₹{calculation.cgst.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2.5 border-b border-[#262626]">
                    <span className="text-sm text-[#71717a]">SGST (State)</span>
                    <span className="font-jetbrains-mono text-sm text-[#f0f0ff]">
                      ₹{calculation.sgst.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2.5 border-b border-[#262626]">
                    <span className="text-sm text-[#71717a]">IGST (Integrated)</span>
                    <span className="font-jetbrains-mono text-sm text-[#f0f0ff]">
                      ₹{calculation.igst.toFixed(2)}
                    </span>
                  </div>

                  {/* Total — L1 gradient */}
                  <div className="flex justify-between items-center pt-4">
                    <span className="text-base font-bold text-[#f0f0ff]">Total Amount</span>
                    <span className="text-3xl font-bold text-gradient font-space-grotesk">
                      ₹{calculation.total.toFixed(2)}
                    </span>
                  </div>
                </motion.div>
              ) : (
                <div className="text-center py-8 text-[#4a4a5a] italic text-sm">
                  {loading ? 'Calculating...' : 'Enter a base price to see the breakdown'}
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
