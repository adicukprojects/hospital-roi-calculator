import { useState, type ReactNode } from 'react';
import {
  FileText,
  Stethoscope,
  ShieldAlert,
  Bed,
  Pill,
  CalendarCheck,
  ChevronDown,
  ChevronUp,
  PieChart,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { CalculationResults, CurrencyCode, SavingsBreakdownItem } from '../types';
import { formatCurrency } from '../utils/calculations';

interface SavingsBreakdownChartProps {
  results: CalculationResults;
  currency: CurrencyCode;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; bar: string; ring: string }> = {
  'admin-labor': {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    bar: 'bg-blue-600',
    ring: 'border-blue-200',
  },
  'nursing-labor': {
    bg: 'bg-teal-50',
    text: 'text-teal-700',
    bar: 'bg-teal-600',
    ring: 'border-teal-200',
  },
  'claim-denials': {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    bar: 'bg-emerald-600',
    ring: 'border-emerald-200',
  },
  'bed-turnaround': {
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    bar: 'bg-indigo-600',
    ring: 'border-indigo-200',
  },
  'pharmacy-leakage': {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    bar: 'bg-amber-600',
    ring: 'border-amber-200',
  },
  'outpatient-noshow': {
    bg: 'bg-violet-50',
    text: 'text-violet-700',
    bar: 'bg-violet-600',
    ring: 'border-violet-200',
  },
};

const CATEGORY_ICONS: Record<string, ReactNode> = {
  'admin-labor': <FileText className="w-4 h-4" />,
  'nursing-labor': <Stethoscope className="w-4 h-4" />,
  'claim-denials': <ShieldAlert className="w-4 h-4" />,
  'bed-turnaround': <Bed className="w-4 h-4" />,
  'pharmacy-leakage': <Pill className="w-4 h-4" />,
  'outpatient-noshow': <CalendarCheck className="w-4 h-4" />,
};

export function SavingsBreakdownChart({ results, currency }: SavingsBreakdownChartProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'annual' | 'monthly'>('annual');

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-5 space-y-5">
      {/* Header & View Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <PieChart className="w-4 h-4 text-teal-600" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
            Annual Savings & Workflow Automation Breakdown
          </h3>
        </div>

        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-medium self-start sm:self-auto">
          <button
            id="view-mode-annual-btn"
            onClick={() => setViewMode('annual')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              viewMode === 'annual'
                ? 'bg-white text-slate-800 shadow-xs font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Annual Rate
          </button>
          <button
            id="view-mode-monthly-btn"
            onClick={() => setViewMode('monthly')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              viewMode === 'monthly'
                ? 'bg-white text-slate-800 shadow-xs font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Monthly Cash Unlock
          </button>
        </div>
      </div>

      {/* Stacked Proportional Progress Bar */}
      <div className="space-y-1.5">
        <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
          {results.breakdownItems.map((item) => {
            const pct =
              results.totalAnnualSavings > 0
                ? (item.annualSavings / results.totalAnnualSavings) * 100
                : 0;
            const styling = CATEGORY_COLORS[item.id] || { bar: 'bg-slate-400' };
            if (pct < 1) return null;
            return (
              <div
                key={item.id}
                title={`${item.title}: ${pct.toFixed(1)}%`}
                style={{ width: `${pct}%` }}
                className={`${styling.bar} h-full transition-all duration-300 hover:opacity-90 cursor-pointer`}
                onClick={() => toggleExpand(item.id)}
              />
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-slate-600 pt-1">
          {results.breakdownItems.map((item) => {
            const pct =
              results.totalAnnualSavings > 0
                ? (item.annualSavings / results.totalAnnualSavings) * 100
                : 0;
            const styling = CATEGORY_COLORS[item.id] || { bar: 'bg-slate-400', text: 'text-slate-700' };
            return (
              <button
                key={item.id}
                onClick={() => toggleExpand(item.id)}
                className="flex items-center gap-1.5 hover:text-slate-900 group transition-colors text-left"
              >
                <span className={`w-2.5 h-2.5 rounded-full ${styling.bar} shrink-0`} />
                <span className="font-medium truncate max-w-[150px]">{item.title}</span>
                <span className="font-bold text-slate-700">({pct.toFixed(0)}%)</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Savings Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
        {results.breakdownItems.map((item) => {
          const isExpanded = expandedId === item.id;
          const styling = CATEGORY_COLORS[item.id] || {
            bg: 'bg-slate-50',
            text: 'text-slate-700',
            bar: 'bg-slate-500',
            ring: 'border-slate-200',
          };
          const valueToDisplay =
            viewMode === 'annual' ? item.annualSavings : item.monthlySavings;
          const percentageOfTotal =
            results.totalAnnualSavings > 0
              ? ((item.annualSavings / results.totalAnnualSavings) * 100).toFixed(1)
              : '0';

          return (
            <div
              key={item.id}
              className={`rounded-xl border transition-all ${
                isExpanded
                  ? `border-teal-400 shadow-xs ${styling.bg}/30`
                  : `border-slate-200 hover:border-slate-300 bg-white`
              }`}
            >
              {/* Card Header */}
              <div
                onClick={() => toggleExpand(item.id)}
                className="p-3.5 cursor-pointer flex items-start justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg ${styling.bg} ${styling.text} flex items-center justify-center shrink-0 mt-0.5 border ${styling.ring}`}
                  >
                    {CATEGORY_ICONS[item.id] || <FileText className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 leading-tight">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0 flex flex-col items-end">
                  <span className="text-sm font-extrabold text-slate-900">
                    {formatCurrency(valueToDisplay, currency)}
                  </span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-[10px] font-semibold text-slate-500">
                      {percentageOfTotal}% share
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Expandable Mathematical & Benchmark Detail */}
              {isExpanded && (
                <div className="px-3.5 pb-3.5 pt-1 text-xs border-t border-slate-100/80 space-y-2 bg-slate-50/50 rounded-b-xl">
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200/70">
                    <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase text-slate-400 mb-1">
                      <Info className="w-3 h-3 text-teal-600" />
                      <span>Calculation Formula & Working</span>
                    </div>
                    <p className="text-[11px] text-slate-700 font-mono">
                      {item.formulaDescription}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500 pt-1">
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span className="italic">{item.benchmarkCitation}</span>
                    </div>
                    <span className="self-start sm:self-auto text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200/70 text-slate-700">
                      Confidence: {item.confidenceTier}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
