import { TrendingUp, Clock, ShieldCheck, Zap, ArrowUpRight, DollarSign } from 'lucide-react';
import { CalculationResults, CurrencyCode, ScenarioPreset } from '../types';
import { formatCurrency } from '../utils/calculations';

interface ExecutiveSummaryCardsProps {
  results: CalculationResults;
  currency: CurrencyCode;
  scenario: ScenarioPreset;
}

export function ExecutiveSummaryCards({
  results,
  currency,
  scenario,
}: ExecutiveSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Annual Gross Savings */}
      <div className="bg-gradient-to-br from-teal-900 to-slate-900 text-white rounded-xl p-5 border border-teal-800/40 shadow-xs relative overflow-hidden flex flex-col justify-between">
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-teal-500/10 rounded-full blur-xl pointer-events-none" />
        <div>
          <div className="flex items-center justify-between text-teal-400 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Projected Annual Savings
            </span>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
              {scenario}
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-1">
            {formatCurrency(results.totalAnnualSavings, currency)}
          </div>
          <div className="text-xs text-teal-200/80 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-teal-400 shrink-0" />
            <span>
              ~{formatCurrency(results.totalAnnualSavings / 12, currency)} / month cash unlock
            </span>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-teal-800/60 text-[11px] text-teal-300/70 flex items-center justify-between">
          <span>3-Year Gross Value</span>
          <span className="font-semibold text-teal-200">
            {formatCurrency(results.threeYearGrossSavings, currency, true)}
          </span>
        </div>
      </div>

      {/* 2. 3-Year Net ROI % */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">
              3-Year Net ROI
            </span>
            <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mt-1">
            +{Math.round(results.threeYearROI)}%
          </div>
          <div className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Net Gain: {formatCurrency(results.threeYearNetSavings, currency, true)}</span>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Return on Tech Spend</span>
          <span className="font-semibold text-slate-700">
            {((results.threeYearGrossSavings / Math.max(1, results.threeYearGrossSavings - results.threeYearNetSavings))).toFixed(1)}x Multiple
          </span>
        </div>
      </div>

      {/* 3. Payback Period (Months) */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Payback Horizon
            </span>
            <div className="w-6 h-6 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mt-1">
            {results.paybackPeriodMonths < 1
              ? '< 1 Month'
              : `${results.paybackPeriodMonths.toFixed(1)} Months`}
          </div>
          <div className="text-xs text-amber-700 font-medium mt-1">
            Rapid Year 1 full capital breakeven
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Cash Flow Neutral by</span>
          <span className="font-semibold text-slate-700">
            Month {Math.ceil(results.paybackPeriodMonths)}
          </span>
        </div>
      </div>

      {/* 4. Total Staff Hours Automated & Reclaimed */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Clinical & Admin Time Saved
            </span>
            <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mt-1">
            {Math.round(results.totalAnnualHoursSaved).toLocaleString()}{' '}
            <span className="text-base font-semibold text-slate-500">hrs/yr</span>
          </div>
          <div className="text-xs text-blue-700 font-medium mt-1">
            ~{Math.round(results.totalAnnualHoursSaved / 52).toLocaleString()} hours freed weekly
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Labor Equivalent</span>
          <span className="font-semibold text-slate-700">
            {(results.totalAnnualHoursSaved / 2000).toFixed(1)} FTEs Redeployed
          </span>
        </div>
      </div>
    </div>
  );
}
