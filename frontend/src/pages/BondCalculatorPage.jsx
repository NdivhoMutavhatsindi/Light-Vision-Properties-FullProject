import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp, DollarSign, ArrowRight } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import PageBanner from '../components/ui/PageBanner';
import SectionHeading from '../components/ui/SectionHeading';
import { formatPrice } from '../data/mockData';

export default function BondCalculatorPage() {
  const [purchasePrice, setPurchasePrice] = useState(5000000);
  const [deposit, setDeposit] = useState(500000);
  const [rate, setRate] = useState(11.5);
  const [term, setTerm] = useState(20);

  const calcs = useMemo(() => {
    const principal = purchasePrice - deposit;
    const monthlyRate = rate / 100 / 12;
    const payments = term * 12;
    const monthly = principal * (monthlyRate * Math.pow(1 + monthlyRate, payments)) / (Math.pow(1 + monthlyRate, payments) - 1);
    const totalRepayment = monthly * payments;
    const totalInterest = totalRepayment - principal;

    const transferDuty = purchasePrice > 11000000 ? (purchasePrice - 11000000) * 0.13 + 1295000
      : purchasePrice > 2475000 ? (purchasePrice - 2475000) * 0.11 + 143850
      : purchasePrice > 1210000 ? (purchasePrice - 1210000) * 0.08 + 24500
      : purchasePrice > 1100000 ? (purchasePrice - 1100000) * 0.05
      : 0;

    const bondCosts = principal * 0.015;
    const transferAttorney = 25000;
    const totalCosts = transferDuty + bondCosts + transferAttorney + deposit;

    return { monthly, totalRepayment, totalInterest, principal, transferDuty, bondCosts, transferAttorney, totalCosts };
  }, [purchasePrice, deposit, rate, term]);

  return (
    <div>
      <PageBanner
        title="Bond Calculator"
        subtitle="Calculate your monthly bond repayments and understand the true cost of your property purchase."
        breadcrumbs={[{ label: 'Bond Calculator' }]}
      />

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Calculator Inputs */}
            <div className="lg:col-span-3 bg-white rounded-3xl p-8 border border-gray-100" style={{ boxShadow: '0 4px 24px rgba(15,27,61,0.09)' }}>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-navy-900 rounded-2xl flex items-center justify-center">
                  <Calculator size={22} className="text-gold-400" />
                </div>
                <h2 className="text-2xl font-serif font-semibold text-navy-900">Mortgage Calculator</h2>
              </div>

              <div className="space-y-8">
                {/* Purchase Price */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Purchase Price</label>
                    <span className="text-xl font-serif font-semibold text-navy-900">{formatPrice(purchasePrice)}</span>
                  </div>
                  <input
                    type="range"
                    min={500000}
                    max={100000000}
                    step={500000}
                    value={purchasePrice}
                    onChange={e => setPurchasePrice(+e.target.value)}
                    className="w-full h-2 accent-gold-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>R500k</span><span>R100M</span>
                  </div>
                </div>

                {/* Deposit */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Deposit</label>
                    <span className="text-xl font-serif font-semibold text-navy-900">
                      {formatPrice(deposit)} <span className="text-sm text-gray-400">({Math.round(deposit / purchasePrice * 100)}%)</span>
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={purchasePrice * 0.5}
                    step={50000}
                    value={deposit}
                    onChange={e => setDeposit(+e.target.value)}
                    className="w-full h-2 accent-gold-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>0%</span><span>50%</span>
                  </div>
                </div>

                {/* Interest Rate */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Interest Rate</label>
                    <span className="text-xl font-serif font-semibold text-navy-900">{rate.toFixed(2)}% per annum</span>
                  </div>
                  <input
                    type="range"
                    min={7}
                    max={20}
                    step={0.25}
                    value={rate}
                    onChange={e => setRate(+e.target.value)}
                    className="w-full h-2 accent-gold-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>7%</span><span>20%</span>
                  </div>
                </div>

                {/* Loan Term */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Loan Term</label>
                    <span className="text-xl font-serif font-semibold text-navy-900">{term} Years</span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={30}
                    step={5}
                    value={term}
                    onChange={e => setTerm(+e.target.value)}
                    className="w-full h-2 accent-gold-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>5 yrs</span><span>30 yrs</span>
                  </div>
                </div>
              </div>

              {/* Transfer Costs */}
              <div className="mt-8 bg-gray-50 rounded-2xl p-5">
                <h3 className="font-semibold text-navy-900 mb-4">Transfer & Registration Costs</h3>
                <div className="space-y-2 text-sm">
                  {[
                    { label: 'Transfer Duty (SARS)', value: calcs.transferDuty },
                    { label: 'Bond Registration Costs', value: calcs.bondCosts },
                    { label: 'Transfer Attorney Fees', value: calcs.transferAttorney },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between">
                      <span className="text-gray-600">{label}</span>
                      <span className="font-medium text-navy-900">R {Math.round(value).toLocaleString('en-ZA')}</span>
                    </div>
                  ))}
                  <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-semibold">
                    <span className="text-navy-900">Total Cash Required</span>
                    <span className="text-navy-900">R {Math.round(calcs.totalCosts).toLocaleString('en-ZA')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="lg:col-span-2 space-y-5">
              {/* Monthly Payment */}
              <div className="bg-navy-gradient rounded-3xl p-8 text-white text-center">
                <p className="text-sm text-gray-400 uppercase tracking-widest mb-2">Monthly Repayment</p>
                <p className="text-5xl font-serif font-light text-gradient-gold mb-2">
                  R {Math.round(calcs.monthly).toLocaleString('en-ZA')}
                </p>
                <p className="text-xs text-gray-500">*Estimate only. Speak to your bank for exact figures.</p>
              </div>

              {/* Summary Cards */}
              {[
                { label: 'Loan Amount', value: formatPrice(calcs.principal), icon: DollarSign, sub: `${100 - Math.round(deposit / purchasePrice * 100)}% LTV` },
                { label: 'Total Repayment', value: `R ${Math.round(calcs.totalRepayment / 1000000).toFixed(1)}M`, icon: TrendingUp, sub: `Over ${term} years` },
                { label: 'Total Interest', value: `R ${Math.round(calcs.totalInterest / 1000000).toFixed(1)}M`, icon: Calculator, sub: `${((calcs.totalInterest / calcs.principal) * 100).toFixed(0)}% of loan` },
              ].map(({ label, value, icon: Icon, sub }) => (
                <div key={label} className="bg-white rounded-2xl p-6 border border-gray-100 flex items-center gap-4" style={{ boxShadow: '0 2px 12px rgba(15,27,61,0.07)' }}>
                  <div className="w-10 h-10 rounded-full bg-gold-50 flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-gold-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p>
                    <p className="text-xl font-serif font-semibold text-navy-900">{value}</p>
                  </div>
                  <p className="text-xs text-gray-400">{sub}</p>
                </div>
              ))}

              <Link to="/contact" className="btn-navy w-full justify-center gap-2">
                Speak to a Specialist <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-gray-400 text-center mt-10 max-w-2xl mx-auto">
            This calculator provides estimates for indicative purposes only. The results do not constitute financial advice. Transfer duty calculations are based on SARS 2024 tables. Please consult your bank or a qualified financial advisor for accurate figures.
          </p>
        </div>
      </section>
    </div>
  );
}
