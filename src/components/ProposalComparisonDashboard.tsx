import { useState } from 'react';
import {
  X,
  ArrowRightLeft,
  CheckCircle2,
  TrendingUp,
  Building2,
  Bed,
  Users,
  Clock,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Sliders,
} from 'lucide-react';
import { SavedProposal } from '../types';
import { calculateHMSFinancials, formatCurrency } from '../utils/calculations';

interface ProposalComparisonDashboardProps {
  proposalA: SavedProposal;
  proposalB: SavedProposal;
  onClose: () => void;
  onApplyProposal: (proposal: SavedProposal) => void;
}

export function ProposalComparisonDashboard({
  proposalA,
  proposalB,
  onClose,
  onApplyProposal,
}: ProposalComparisonDashboardProps) {
  const [viewTab, setViewTab] = useState<'metrics' | 'breakdown' | 'cashflow'>('metrics');

  const resultsA = calculateHMSFinancials(proposalA.inputs, proposalA.scenario);
  const resultsB = calculateHMSFinancials(proposalB.inputs, proposalB.scenario);

  // Financial Deltas (B minus A)
  const annualSavingsDelta = resultsB.totalAnnualSavings - resultsA.totalAnnualSavings;
  const annualSavingsDeltaPct =
    resultsA.totalAnnualSavings > 0
      ? (annualSavingsDelta / resultsA.totalAnnualSavings) * 100
      : 0;

  const threeYearNetDelta = resultsB.threeYearNetSavings - resultsA.threeYearNetSavings;
  const roiDelta = resultsB.threeYearROI - resultsA.threeYearROI;
  const hoursSavedDelta = resultsB.totalAnnualHoursSaved - resultsA.totalAnnualHoursSaved;
  const paybackDelta = resultsB.paybackPeriodMonths - resultsA.paybackPeriodMonths;

  return (
    <div className="bg-white rounded-2xl border-2 border-teal-500/40 shadow-lg p-5 sm:p-6 space-y-6 animate-fadeIn">
      {/* Comparison Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-600 flex items-center justify-center">
            <ArrowRightLeft className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                Side-by-Side Comparison Mode
              </span>
              <span className="text-xs text-slate-400">• Financial Variance Engine</span>
            </div>
            <h2 className="text-base font-extrabold text-slate-900 mt-0.5">
              {proposalA.hospitalName} vs. {proposalB.hospitalName}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Sub-view switcher */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-medium">
            <button
              onClick={() => setViewTab('metrics')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                viewTab === 'metrics'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Key Metrics & Deltas
            </button>
            <button
              onClick={() => setViewTab('breakdown')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                viewTab === 'breakdown'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Workflow Pillars
            </button>
            <button
              onClick={() => setViewTab('cashflow')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                viewTab === 'cashflow'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              5-Yr Cash Flow
            </button>
          </div>

          <button
            id="close-comparison-mode-btn"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors ml-1"
            title="Exit Side-by-Side Comparison"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Dual Columns Header Cards */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Proposal A Card */}
        <div className="md:col-span-5 bg-slate-50 rounded-xl p-4 border border-slate-200 relative">
          <span className="absolute -top-2.5 left-4 text-[10px] font-black uppercase tracking-wider bg-slate-800 text-white px-2 py-0.5 rounded-md">
            Proposal A (Baseline)
          </span>
          <div className="flex justify-between items-start pt-1">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">{proposalA.hospitalName}</h3>
              <p className="text-[11px] text-slate-500">
                {proposalA.bedCount} Beds • {proposalA.inputs.dailyOutpatientVolume} Outpatients/Day •{' '}
                <span className="capitalize font-semibold text-slate-700">{proposalA.scenario}</span>
              </p>
            </div>
            <button
              onClick={() => onApplyProposal(proposalA)}
              className="text-[11px] font-semibold text-teal-700 hover:text-teal-900 bg-white hover:bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-md transition-colors"
            >
              Edit in Calculator
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-200/80 text-xs">
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-500 block">Annual Savings</span>
              <span className="text-base font-bold text-slate-900">
                {formatCurrency(resultsA.totalAnnualSavings, proposalA.currency)}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-500 block">3-Year Net ROI</span>
              <span className="text-base font-bold text-teal-700">
                +{Math.round(resultsA.threeYearROI)}%
              </span>
            </div>
          </div>
        </div>

        {/* Delta Callout (Center on Desktop) */}
        <div className="md:col-span-2 flex flex-col items-center justify-center p-3 rounded-xl bg-teal-50/70 border border-teal-200 text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800">
            Net Variance
          </span>
          <div className="flex items-center gap-0.5 mt-0.5 font-black text-sm text-teal-900">
            {annualSavingsDelta >= 0 ? (
              <ArrowUpRight className="w-4 h-4 text-emerald-600" />
            ) : (
              <ArrowDownRight className="w-4 h-4 text-amber-600" />
            )}
            <span>
              {annualSavingsDelta >= 0 ? '+' : ''}
              {formatCurrency(annualSavingsDelta, proposalB.currency, true)}
            </span>
          </div>
          <span className="text-[10px] font-semibold text-teal-700">
            ({annualSavingsDeltaPct >= 0 ? '+' : ''}{annualSavingsDeltaPct.toFixed(1)}% annual)
          </span>
        </div>

        {/* Proposal B Card */}
        <div className="md:col-span-5 bg-teal-50/40 rounded-xl p-4 border border-teal-300/80 relative">
          <span className="absolute -top-2.5 left-4 text-[10px] font-black uppercase tracking-wider bg-teal-700 text-white px-2 py-0.5 rounded-md">
            Proposal B (Comparison)
          </span>
          <div className="flex justify-between items-start pt-1">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">{proposalB.hospitalName}</h3>
              <p className="text-[11px] text-slate-500">
                {proposalB.bedCount} Beds • {proposalB.inputs.dailyOutpatientVolume} Outpatients/Day •{' '}
                <span className="capitalize font-semibold text-teal-800">{proposalB.scenario}</span>
              </p>
            </div>
            <button
              onClick={() => onApplyProposal(proposalB)}
              className="text-[11px] font-semibold text-teal-700 hover:text-teal-900 bg-white hover:bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-md transition-colors"
            >
              Edit in Calculator
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-teal-200/80 text-xs">
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-500 block">Annual Savings</span>
              <span className="text-base font-bold text-slate-900">
                {formatCurrency(resultsB.totalAnnualSavings, proposalB.currency)}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-500 block">3-Year Net ROI</span>
              <span className="text-base font-bold text-teal-700">
                +{Math.round(resultsB.threeYearROI)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab 1: Key Metrics Comparison Table */}
      {viewTab === 'metrics' && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-100 text-slate-700 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="p-3 border-b border-slate-200">Financial / Operational Metric</th>
                <th className="p-3 border-b border-slate-200 bg-slate-50 text-slate-800">
                  {proposalA.hospitalName} (A)
                </th>
                <th className="p-3 border-b border-slate-200 bg-teal-50 text-teal-900">
                  {proposalB.hospitalName} (B)
                </th>
                <th className="p-3 border-b border-slate-200 text-right">Variance (B vs A)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {/* Annual Gross Savings */}
              <tr className="hover:bg-slate-50/50">
                <td className="p-3 font-bold text-slate-900">Annual Gross Value / Savings</td>
                <td className="p-3 font-semibold text-slate-900 bg-slate-50/50">
                  {formatCurrency(resultsA.totalAnnualSavings, proposalA.currency)}
                </td>
                <td className="p-3 font-bold text-teal-900 bg-teal-50/30">
                  {formatCurrency(resultsB.totalAnnualSavings, proposalB.currency)}
                </td>
                <td className="p-3 text-right font-black text-emerald-600">
                  {annualSavingsDelta >= 0 ? '+' : ''}
                  {formatCurrency(annualSavingsDelta, proposalB.currency)}
                </td>
              </tr>

              {/* 3-Year Net Economic Value */}
              <tr className="hover:bg-slate-50/50">
                <td className="p-3 font-bold text-slate-900">3-Year Net Economic Benefit</td>
                <td className="p-3 font-semibold text-slate-900 bg-slate-50/50">
                  {formatCurrency(resultsA.threeYearNetSavings, proposalA.currency)}
                </td>
                <td className="p-3 font-bold text-teal-900 bg-teal-50/30">
                  {formatCurrency(resultsB.threeYearNetSavings, proposalB.currency)}
                </td>
                <td className="p-3 text-right font-black text-emerald-600">
                  {threeYearNetDelta >= 0 ? '+' : ''}
                  {formatCurrency(threeYearNetDelta, proposalB.currency)}
                </td>
              </tr>

              {/* 3-Year ROI % */}
              <tr className="hover:bg-slate-50/50">
                <td className="p-3 font-bold text-slate-900">3-Year Return on Investment (ROI)</td>
                <td className="p-3 font-semibold text-slate-900 bg-slate-50/50">
                  +{Math.round(resultsA.threeYearROI)}%
                </td>
                <td className="p-3 font-bold text-teal-900 bg-teal-50/30">
                  +{Math.round(resultsB.threeYearROI)}%
                </td>
                <td className="p-3 text-right font-black text-emerald-600">
                  {roiDelta >= 0 ? '+' : ''}
                  {Math.round(roiDelta)}% pts
                </td>
              </tr>

              {/* Payback Months */}
              <tr className="hover:bg-slate-50/50">
                <td className="p-3 font-bold text-slate-900">Breakeven Payback Horizon</td>
                <td className="p-3 font-semibold text-slate-900 bg-slate-50/50">
                  {resultsA.paybackPeriodMonths.toFixed(1)} Months
                </td>
                <td className="p-3 font-bold text-teal-900 bg-teal-50/30">
                  {resultsB.paybackPeriodMonths.toFixed(1)} Months
                </td>
                <td className="p-3 text-right font-semibold text-slate-600">
                  {paybackDelta < 0 ? (
                    <span className="text-emerald-600 font-bold">
                      {Math.abs(paybackDelta).toFixed(1)} months faster
                    </span>
                  ) : paybackDelta > 0 ? (
                    <span className="text-amber-600">
                      +{paybackDelta.toFixed(1)} months
                    </span>
                  ) : (
                    'Equal'
                  )}
                </td>
              </tr>

              {/* Labor Hours Saved */}
              <tr className="hover:bg-slate-50/50">
                <td className="p-3 font-bold text-slate-900">Staff Time Automated / Reclaimed</td>
                <td className="p-3 font-semibold text-slate-900 bg-slate-50/50">
                  {Math.round(resultsA.totalAnnualHoursSaved).toLocaleString()} hrs/yr
                </td>
                <td className="p-3 font-bold text-teal-900 bg-teal-50/30">
                  {Math.round(resultsB.totalAnnualHoursSaved).toLocaleString()} hrs/yr
                </td>
                <td className="p-3 text-right font-black text-emerald-600">
                  {hoursSavedDelta >= 0 ? '+' : ''}
                  {Math.round(hoursSavedDelta).toLocaleString()} hrs
                </td>
              </tr>

              {/* Operational Facility Inputs */}
              <tr className="bg-slate-50/80 font-bold text-[11px] text-slate-500">
                <td colSpan={4} className="p-2.5 uppercase tracking-wide">
                  Facility Capacity & Staffing Baseline Differences
                </td>
              </tr>
              <tr>
                <td className="p-3 text-slate-600">Licensed Bed Count</td>
                <td className="p-3 bg-slate-50/50 font-semibold">{proposalA.bedCount} beds</td>
                <td className="p-3 bg-teal-50/30 font-semibold">{proposalB.bedCount} beds</td>
                <td className="p-3 text-right font-bold text-slate-800">
                  {proposalB.bedCount - proposalA.bedCount >= 0 ? '+' : ''}
                  {proposalB.bedCount - proposalA.bedCount} beds
                </td>
              </tr>
              <tr>
                <td className="p-3 text-slate-600">Daily Outpatients (OPD)</td>
                <td className="p-3 bg-slate-50/50 font-semibold">{proposalA.inputs.dailyOutpatientVolume} visits/day</td>
                <td className="p-3 bg-teal-50/30 font-semibold">{proposalB.inputs.dailyOutpatientVolume} visits/day</td>
                <td className="p-3 text-right font-bold text-slate-800">
                  {proposalB.inputs.dailyOutpatientVolume - proposalA.inputs.dailyOutpatientVolume >= 0 ? '+' : ''}
                  {proposalB.inputs.dailyOutpatientVolume - proposalA.inputs.dailyOutpatientVolume} OPD
                </td>
              </tr>
              <tr>
                <td className="p-3 text-slate-600">Clinical & Nursing Staff</td>
                <td className="p-3 bg-slate-50/50 font-semibold">{proposalA.inputs.nursingStaffCount} FTEs</td>
                <td className="p-3 bg-teal-50/30 font-semibold">{proposalB.inputs.nursingStaffCount} FTEs</td>
                <td className="p-3 text-right font-bold text-slate-800">
                  {proposalB.inputs.nursingStaffCount - proposalA.inputs.nursingStaffCount >= 0 ? '+' : ''}
                  {proposalB.inputs.nursingStaffCount - proposalA.inputs.nursingStaffCount} FTEs
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: Workflow Pillars Comparison */}
      {viewTab === 'breakdown' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {resultsA.breakdownItems.map((itemA) => {
            const itemB = resultsB.breakdownItems.find((b) => b.id === itemA.id);
            const valA = itemA.annualSavings;
            const valB = itemB?.annualSavings || 0;
            const delta = valB - valA;

            return (
              <div
                key={itemA.id}
                className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200 space-y-2.5"
              >
                <div className="flex items-start justify-between">
                  <h4 className="text-xs font-bold text-slate-900 leading-tight">
                    {itemA.title}
                  </h4>
                  <span
                    className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                      delta >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {delta >= 0 ? '+' : ''}
                    {formatCurrency(delta, proposalB.currency, true)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-200/80">
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-500 block truncate">
                      {proposalA.hospitalName}
                    </span>
                    <span className="font-bold text-slate-900">
                      {formatCurrency(valA, proposalA.currency)}
                    </span>
                  </div>
                  <div className="bg-teal-50 p-2 rounded-lg border border-teal-200">
                    <span className="text-[10px] text-teal-700 block truncate">
                      {proposalB.hospitalName}
                    </span>
                    <span className="font-bold text-teal-900">
                      {formatCurrency(valB, proposalB.currency)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 3: 5-Year Cash Flow Comparison */}
      {viewTab === 'cashflow' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {[1, 2, 3, 4, 5].map((yr) => {
              const projA = resultsA.yearProjections.find((p) => p.year === yr);
              const projB = resultsB.yearProjections.find((p) => p.year === yr);
              const netA = projA?.netBenefit || 0;
              const netB = projB?.netBenefit || 0;
              const delta = netB - netA;

              return (
                <div key={yr} className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Year {yr} Net</span>
                    <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                      {delta >= 0 ? '+' : ''}{formatCurrency(delta, proposalB.currency, true)}
                    </span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500 text-[11px]">A:</span>
                      <span className="font-semibold text-slate-900">{formatCurrency(netA, proposalA.currency, true)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-teal-700 font-medium text-[11px]">B:</span>
                      <span className="font-bold text-teal-900">{formatCurrency(netB, proposalB.currency, true)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer Exit or Apply Action */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-200 text-xs">
        <span className="text-slate-500 text-[11px]">
          Tip: Click "Edit in Calculator" on either proposal above to load its parameters into the main active workspace.
        </span>
        <button
          onClick={onClose}
          className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-4 py-2 rounded-lg text-xs transition-colors shrink-0"
        >
          Close Comparison Mode
        </button>
      </div>
    </div>
  );
}
