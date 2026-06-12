'use client';

import { useState, useEffect } from 'react';
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
    <div className="bg-[#0d0d0d] border border-[#262626] rounded-xl p-6 md:p-8 relative overflow-hidden">
      {/* Left accent bar */}
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#00f0ff] to-[#8a2be2]" />

      <div className="pl-4">
        <h3 className="text-xl font-bold text-[#ededed] mb-6 font-space-grotesk">
          Tax Calculator
          <span className="block text-sm font-normal text-[#71717a] font-inter mt-1">
            for {itemName}
          </span>
        </h3>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Section */}
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
                  className="w-full px-5 py-3.5 bg-[#141414] border border-[#262626] rounded-xl text-[#ededed] placeholder-[#71717a] focus:outline-none focus:border-[#404040] transition-colors mono text-base"
                />
              </div>
            </div>

            {/* Rate display */}
            <div className="p-4 bg-[#141414] rounded-xl border border-[#262626]">
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#71717a]">Applicable GST Rate:</span>
                <span className="text-lg font-bold text-[#00f0ff] mono">{gstRate}%</span>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="flex flex-col justify-center">
            {calculation ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2.5 border-b border-[#262626]">
                  <span className="text-sm text-[#71717a]">CGST (Central)</span>
                  <span className="mono text-sm text-[#ededed]">₹{calculation.cgst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center py-2.5 border-b border-[#262626]">
                  <span className="text-sm text-[#71717a]">SGST (State)</span>
                  <span className="mono text-sm text-[#ededed]">₹{calculation.sgst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center py-2.5 border-b border-[#262626]">
                  <span className="text-sm text-[#71717a]">IGST (Integrated)</span>
                  <span className="mono text-sm text-[#ededed]">₹{calculation.igst.toFixed(2)}</span>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center pt-4">
                  <span className="text-base font-bold text-[#ededed]">Total Amount</span>
                  <span className="text-3xl font-bold text-accent font-space-grotesk">
                    ₹{calculation.total.toFixed(2)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-[#71717a] italic text-sm">
                {loading ? 'Calculating...' : 'Enter a base price to see the breakdown'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
