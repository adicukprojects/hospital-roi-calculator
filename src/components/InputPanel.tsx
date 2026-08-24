import { useState } from 'react';
import {
  Bed,
  Users,
  DollarSign,
  Clock,
  ChevronDown,
  ChevronUp,
  FileCheck2,
  Stethoscope,
  Pill,
  ShieldAlert,
  Sliders,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { HospitalInputs } from '../types';
import { formatCurrency } from '../utils/calculations';
import { CURRENCIES } from '../data/benchmarks';

interface InputPanelProps {
  inputs: HospitalInputs;
  onUpdateInputs: (partial: Partial<HospitalInputs>) => void;
}

export function InputPanel({ inputs, onUpdateInputs }: InputPanelProps) {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const currencySymbol = CURRENCIES[inputs.currency]?.symbol || '$';

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-5 space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-teal-600" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
            Hospital Operational Inputs
          </h2>
        </div>
        <span className="text-xs text-slate-400 font-medium">Field Mode • Live Sync</span>
      </div>

      {/* 1. Core Capacity & Patient Volumes */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">
          <Bed className="w-3.5 h-3.5 text-teal-600" />
          <span>Hospital Capacity & Patient Throughput</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Bed Count */}
          <div className="bg-slate-50/70 p-3.5 rounded-lg border border-slate-200/60">
            <div className="flex justify-between items-center mb-1.5">
              <label htmlFor="input-bed-count" className="text-xs font-semibold text-slate-700">
                Licensed Bed Count
              </label>
              <span className="text-sm font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200/50">
                {inputs.bedCount} beds
              </span>
            </div>
            <input
              id="input-bed-count-range"
              type="range"
              min="20"
              max="2000"
              step="10"
              value={inputs.bedCount}
              onChange={(e) => onUpdateInputs({ bedCount: Number(e.target.value) })}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>20</span>
              <span>500</span>
              <span>1,000</span>
              <span>2,000+</span>
            </div>
          </div>

          {/* Daily Outpatient Volume */}
          <div className="bg-slate-50/70 p-3.5 rounded-lg border border-slate-200/60">
            <div className="flex justify-between items-center mb-1.5">
              <label htmlFor="input-opd-volume" className="text-xs font-semibold text-slate-700">
                Daily Outpatients (OPD / Day)
              </label>
              <span className="text-sm font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200/50">
                {inputs.dailyOutpatientVolume} visits
              </span>
            </div>
            <input
              id="input-opd-volume-range"
              type="range"
              min="50"
              max="5000"
              step="25"
              value={inputs.dailyOutpatientVolume}
              onChange={(e) =>
                onUpdateInputs({ dailyOutpatientVolume: Number(e.target.value) })
              }
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>50</span>
              <span>1,000</span>
              <span>2,500</span>
              <span>5,000+</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Administrative & Billing Labor Burden */}
      <div className="space-y-3 pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">
            <Users className="w-3.5 h-3.5 text-blue-600" />
            <span>Administrative & Billing Staff Burden</span>
          </div>
          <span className="text-[11px] text-slate-500">
            Est. annual cost: {formatCurrency(inputs.adminBillingStaffCount * inputs.avgAdminAnnualSalary, inputs.currency)}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Admin Staff FTEs */}
          <div className="p-3 rounded-lg border border-slate-200 bg-white">
            <label htmlFor="input-admin-count" className="block text-[11px] font-medium text-slate-600 mb-1">
              Admin & Billing FTEs
            </label>
            <div className="relative">
              <input
                id="input-admin-count"
                type="number"
                min="1"
                max="500"
                value={inputs.adminBillingStaffCount}
                onChange={(e) =>
                  onUpdateInputs({ adminBillingStaffCount: Math.max(1, Number(e.target.value)) })
                }
                className="w-full text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 focus:border-teal-500 focus:outline-none"
              />
              <span className="absolute right-2.5 top-1.5 text-[10px] text-slate-400">staff</span>
            </div>
          </div>

          {/* Average Admin Salary */}
          <div className="p-3 rounded-lg border border-slate-200 bg-white">
            <label htmlFor="input-admin-salary" className="block text-[11px] font-medium text-slate-600 mb-1">
              Avg Admin Salary / Yr
            </label>
            <div className="relative">
              <span className="absolute left-2.5 top-1.5 text-xs text-slate-400 font-medium">
                {currencySymbol}
              </span>
              <input
                id="input-admin-salary"
                type="number"
                step="1000"
                value={inputs.avgAdminAnnualSalary}
                onChange={(e) =>
                  onUpdateInputs({ avgAdminAnnualSalary: Math.max(0, Number(e.target.value)) })
                }
                className="w-full text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-md pl-6 pr-2.5 py-1.5 focus:border-teal-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Hours Spent on Manual Paperwork per Day */}
          <div className="p-3 rounded-lg border border-slate-200 bg-white">
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="input-admin-hours" className="text-[11px] font-medium text-slate-600">
                Manual Paperwork / Day
              </label>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded">
                {inputs.adminHoursSpentOnManualPaperworkPerDay} hrs
              </span>
            </div>
            <input
              id="input-admin-hours"
              type="range"
              min="1"
              max="7"
              step="0.1"
              value={inputs.adminHoursSpentOnManualPaperworkPerDay}
              onChange={(e) =>
                onUpdateInputs({
                  adminHoursSpentOnManualPaperworkPerDay: Number(e.target.value),
                })
              }
              className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 mt-2"
            />
          </div>
        </div>
      </div>

      {/* 3. Nursing & Clinical Charting Burden */}
      <div className="space-y-3 pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">
            <Stethoscope className="w-3.5 h-3.5 text-emerald-600" />
            <span>Nursing & Clinical Documentation</span>
          </div>
          <span className="text-[11px] text-slate-500">
            Est. annual cost: {formatCurrency(inputs.nursingStaffCount * inputs.avgNurseAnnualSalary, inputs.currency)}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Nursing Staff Count */}
          <div className="p-3 rounded-lg border border-slate-200 bg-white">
            <label htmlFor="input-nurse-count" className="block text-[11px] font-medium text-slate-600 mb-1">
              Nursing Staff FTEs
            </label>
            <div className="relative">
              <input
                id="input-nurse-count"
                type="number"
                min="1"
                max="2000"
                value={inputs.nursingStaffCount}
                onChange={(e) =>
                  onUpdateInputs({ nursingStaffCount: Math.max(1, Number(e.target.value)) })
                }
                className="w-full text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 focus:border-teal-500 focus:outline-none"
              />
              <span className="absolute right-2.5 top-1.5 text-[10px] text-slate-400">nurses</span>
            </div>
          </div>

          {/* Average Nurse Salary */}
          <div className="p-3 rounded-lg border border-slate-200 bg-white">
            <label htmlFor="input-nurse-salary" className="block text-[11px] font-medium text-slate-600 mb-1">
              Avg Nurse Salary / Yr
            </label>
            <div className="relative">
              <span className="absolute left-2.5 top-1.5 text-xs text-slate-400 font-medium">
                {currencySymbol}
              </span>
              <input
                id="input-nurse-salary"
                type="number"
                step="1000"
                value={inputs.avgNurseAnnualSalary}
                onChange={(e) =>
                  onUpdateInputs({ avgNurseAnnualSalary: Math.max(0, Number(e.target.value)) })
                }
                className="w-full text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-md pl-6 pr-2.5 py-1.5 focus:border-teal-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Charting Hours per Shift */}
          <div className="p-3 rounded-lg border border-slate-200 bg-white">
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="input-nurse-hours" className="text-[11px] font-medium text-slate-600">
                Manual Charting / Shift
              </label>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">
                {inputs.nurseHoursSpentOnManualChartingPerDay} hrs
              </span>
            </div>
            <input
              id="input-nurse-hours"
              type="range"
              min="0.5"
              max="5"
              step="0.1"
              value={inputs.nurseHoursSpentOnManualChartingPerDay}
              onChange={(e) =>
                onUpdateInputs({
                  nurseHoursSpentOnManualChartingPerDay: Number(e.target.value),
                })
              }
              className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 mt-2"
            />
          </div>
        </div>
      </div>

      {/* 4. Advanced Hospital Levers Toggle */}
      <div className="pt-2 border-t border-slate-100">
        <button
          id="toggle-advanced-levers-btn"
          type="button"
          onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
          className="flex items-center justify-between w-full py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200/70"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Advanced Financial & HMS Investment Levers</span>
            <span className="text-[10px] text-slate-400 font-normal">
              (Claims, Pharmacy, Bed Revenue & Pricing)
            </span>
          </div>
          {isAdvancedOpen ? (
            <ChevronUp className="w-4 h-4 text-slate-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-500" />
          )}
        </button>

        {isAdvancedOpen && (
          <div className="mt-3 p-4 bg-slate-50/60 rounded-xl border border-slate-200/80 space-y-4 text-xs">
            {/* Row 1: Claims & Denials */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="input-claims-volume" className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Annual Insurance Billed Volume
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1.5 text-slate-400">{currencySymbol}</span>
                  <input
                    id="input-claims-volume"
                    type="number"
                    step="500000"
                    value={inputs.annualInsuranceClaimVolume}
                    onChange={(e) =>
                      onUpdateInputs({
                        annualInsuranceClaimVolume: Math.max(0, Number(e.target.value)),
                      })
                    }
                    className="w-full text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-md pl-6 pr-2.5 py-1.5 focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="input-denial-rate" className="text-[11px] font-semibold text-slate-700">
                    Current Claim Denial Rate
                  </label>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                    {inputs.currentClaimDenialRate}%
                  </span>
                </div>
                <input
                  id="input-denial-rate"
                  type="range"
                  min="2"
                  max="20"
                  step="0.1"
                  value={inputs.currentClaimDenialRate}
                  onChange={(e) =>
                    onUpdateInputs({ currentClaimDenialRate: Number(e.target.value) })
                  }
                  className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600 mt-2"
                />
              </div>
            </div>

            {/* Row 2: Revenue per Bed Day & Pharmacy */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="input-bed-day-rev" className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Avg Revenue per Inpatient Bed Day
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1.5 text-slate-400">{currencySymbol}</span>
                  <input
                    id="input-bed-day-rev"
                    type="number"
                    step="50"
                    value={inputs.avgRevenuePerInpatientDay}
                    onChange={(e) =>
                      onUpdateInputs({
                        avgRevenuePerInpatientDay: Math.max(0, Number(e.target.value)),
                      })
                    }
                    className="w-full text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-md pl-6 pr-2.5 py-1.5 focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="input-pharmacy-spend" className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Monthly Pharmacy / Drug Spend
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1.5 text-slate-400">{currencySymbol}</span>
                  <input
                    id="input-pharmacy-spend"
                    type="number"
                    step="10000"
                    value={inputs.pharmacyMonthlyExpenditure}
                    onChange={(e) =>
                      onUpdateInputs({
                        pharmacyMonthlyExpenditure: Math.max(0, Number(e.target.value)),
                      })
                    }
                    className="w-full text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-md pl-6 pr-2.5 py-1.5 focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Row 3: Proposed HMS Investment (Cost side) */}
            <div className="p-3 bg-white rounded-lg border border-teal-200/70">
              <div className="flex items-center gap-1.5 text-teal-800 font-semibold text-xs mb-2">
                <DollarSign className="w-3.5 h-3.5 text-teal-600" />
                <span>Proposed HMS Solution Investment (For ROI Net Calculation)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="input-hms-sub" className="block text-[10px] font-medium text-slate-600 mb-1">
                    Annual HMS Cloud / License Fee
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1.5 text-slate-400">{currencySymbol}</span>
                    <input
                      id="input-hms-sub"
                      type="number"
                      step="5000"
                      value={inputs.hmsAnnualSubscription}
                      onChange={(e) =>
                        onUpdateInputs({
                          hmsAnnualSubscription: Math.max(0, Number(e.target.value)),
                        })
                      }
                      className="w-full text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-md pl-6 pr-2.5 py-1.5 focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="input-hms-impl" className="block text-[10px] font-medium text-slate-600 mb-1">
                    Year 1 Implementation & Training Fee
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1.5 text-slate-400">{currencySymbol}</span>
                    <input
                      id="input-hms-impl"
                      type="number"
                      step="5000"
                      value={inputs.hmsOneTimeImplementation}
                      onChange={(e) =>
                        onUpdateInputs({
                          hmsOneTimeImplementation: Math.max(0, Number(e.target.value)),
                        })
                      }
                      className="w-full text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-md pl-6 pr-2.5 py-1.5 focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
