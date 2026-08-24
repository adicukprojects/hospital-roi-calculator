import { useState } from 'react';
import {
  X,
  Printer,
  Copy,
  Check,
  Building2,
  Calendar,
  FileCheck2,
  TrendingUp,
  ShieldCheck,
  Zap,
  FileDown,
  Download,
  Loader2,
} from 'lucide-react';
import { CalculationResults, HospitalInputs, ScenarioPreset } from '../types';
import { formatCurrency } from '../utils/calculations';
import { generateExecutivePdfProposal } from '../utils/generatePdfReport';

interface ExecutiveProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  inputs: HospitalInputs;
  results: CalculationResults;
  scenario: ScenarioPreset;
}

export function ExecutiveProposalModal({
  isOpen,
  onClose,
  inputs,
  results,
  scenario,
}: ExecutiveProposalModalProps) {
  const [copied, setCopied] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfDownloaded, setPdfDownloaded] = useState(false);

  if (!isOpen) return null;

  const handleDownloadPdf = async () => {
    try {
      setIsGeneratingPdf(true);
      // Small timeout for UI responsiveness
      await new Promise((resolve) => setTimeout(resolve, 150));
      generateExecutivePdfProposal(inputs, results, scenario);
      setPdfDownloaded(true);
      setTimeout(() => setPdfDownloaded(false), 3000);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = () => {
    const text = `EXECUTIVE FINANCIAL BUSINESS CASE: HOSPITAL MANAGEMENT SYSTEM (HMS)
Institution: ${inputs.hospitalName || 'Prospective Health System'}
Capacity: ${inputs.bedCount} Beds | ${inputs.dailyOutpatientVolume} Outpatients/Day
Model Scenario: ${scenario.toUpperCase()}

KEY FINANCIAL OUTCOMES:
• Projected Annual Value / Savings: ${formatCurrency(results.totalAnnualSavings, inputs.currency)} / year
• Estimated Net 3-Year ROI: +${Math.round(results.threeYearROI)}%
• Estimated Net 5-Year ROI: +${Math.round(results.fiveYearROI)}%
• Payback Horizon: ${results.paybackPeriodMonths.toFixed(1)} Months to Full Breakeven
• Staff Time Automated & Reclaimed: ${Math.round(results.totalAnnualHoursSaved).toLocaleString()} Hours/Year (${(results.totalAnnualHoursSaved / 2000).toFixed(1)} FTEs)

BREAKDOWN BY WORKFLOW PILLAR:
${results.breakdownItems
  .map(
    (item) =>
      `• ${item.title}: ${formatCurrency(item.annualSavings, inputs.currency)}/yr (${item.description})`
  )
  .join('\n')}

3-YEAR & 5-YEAR CASH FLOW SUMMARY:
• Gross 3-Year Savings: ${formatCurrency(results.threeYearGrossSavings, inputs.currency)} (Net 3-Yr ROI: +${Math.round(results.threeYearROI)}%)
• Gross 5-Year Savings: ${formatCurrency(results.fiveYearGrossSavings, inputs.currency)} (Net 5-Yr ROI: +${Math.round(results.fiveYearROI)}%)
• Net 5-Year Profit Unlock: ${formatCurrency(results.fiveYearNetSavings, inputs.currency)}

Prepared for Board of Directors & Office of the CFO.`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col border border-slate-200 overflow-hidden print:max-h-none print:shadow-none print:border-none print:w-full">
        {/* Modal Toolbar (hidden in print) */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-900 text-white gap-3 print:hidden">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-teal-400" />
            <div>
              <h2 className="text-base font-bold">Executive Boardroom Business Case</h2>
              <span className="text-[11px] text-slate-400 block -mt-0.5">
                Print-ready financial proposal and CFO executive summary
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
            <button
              id="copy-summary-btn"
              onClick={handleCopySummary}
              className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 font-medium transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-300" />
                  <span>Copy Brief</span>
                </>
              )}
            </button>

            <button
              id="print-proposal-btn"
              onClick={handlePrint}
              className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 font-medium transition-colors"
              title="Browser Print Preview"
            >
              <Printer className="w-3.5 h-3.5 text-slate-300" />
              <span>Print</span>
            </button>

            {/* Direct High-Resolution PDF Download Button */}
            <button
              id="download-pdf-proposal-btn"
              disabled={isGeneratingPdf}
              onClick={handleDownloadPdf}
              className={`flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-lg font-bold transition-all shadow-xs ${
                pdfDownloaded
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  : 'bg-teal-600 hover:bg-teal-500 text-white cursor-pointer'
              }`}
              title="Download client-ready vector PDF presentation"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : pdfDownloaded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>PDF Downloaded!</span>
                </>
              ) : (
                <>
                  <FileDown className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </>
              )}
            </button>

            <button
              id="close-proposal-modal-btn"
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document Content */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6 text-slate-800 text-xs print:p-4 print:text-[11px]">
          {/* Document Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b-2 border-slate-900 gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                Hospital Management System • Financial Case
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                {inputs.hospitalName || 'Prospective Health System'}
              </h1>
              <p className="text-slate-500 mt-0.5">
                Target Facility: {inputs.bedCount} Licensed Beds • {inputs.dailyOutpatientVolume} Daily Outpatients
              </p>
            </div>
            <div className="text-left sm:text-right">
              <div className="text-xs text-slate-500">
                Date: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
              <div className="text-xs font-semibold text-slate-700 mt-0.5">
                Model Scenario:{' '}
                <span className="capitalize text-teal-700 font-bold">{scenario} Case</span>
              </div>
            </div>
          </div>

          {/* Executive Summary Narrative */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2">
            <h3 className="text-xs font-bold uppercase text-slate-800 tracking-wide">
              1. Executive Value Summary
            </h3>
            <p className="text-slate-700 text-xs leading-relaxed">
              Transitioning to the next-generation integrated Hospital Management System (HMS) transforms hospital operations from disjointed, manual paperwork into automated, real-time digital workflows. Based on current hospital operational parameters, the implementation is projected to unlock{' '}
              <strong className="text-teal-800">
                {formatCurrency(results.totalAnnualSavings, inputs.currency)}
              </strong>{' '}
              in annual operational value and recover{' '}
              <strong className="text-teal-800">
                {Math.round(results.totalAnnualHoursSaved).toLocaleString()} hours
              </strong>{' '}
              of clinical and administrative staff capacity per year. The investment is fully self-funding with a payback period of{' '}
              <strong>{results.paybackPeriodMonths.toFixed(1)} months</strong> and an estimated 3-year net ROI of{' '}
              <strong>+{Math.round(results.threeYearROI)}%</strong>.
            </p>
          </div>

          {/* Core KPI Grid */}
          <div>
            <h3 className="text-xs font-bold uppercase text-slate-800 tracking-wide mb-3">
              2. Key Financial Indicators
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg">
                <span className="block text-[10px] uppercase font-bold text-teal-700">
                  Annual Gross Value
                </span>
                <span className="text-lg font-black text-teal-900">
                  {formatCurrency(results.totalAnnualSavings, inputs.currency)}
                </span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="block text-[10px] uppercase font-bold text-slate-600">
                  3-Year Net ROI
                </span>
                <span className="text-lg font-black text-slate-900">
                  +{Math.round(results.threeYearROI)}%
                </span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="block text-[10px] uppercase font-bold text-slate-600">
                  Breakeven Horizon
                </span>
                <span className="text-lg font-black text-slate-900">
                  {results.paybackPeriodMonths.toFixed(1)} Months
                </span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="block text-[10px] uppercase font-bold text-slate-600">
                  Time Automated
                </span>
                <span className="text-lg font-black text-slate-900">
                  {Math.round(results.totalAnnualHoursSaved).toLocaleString()} hrs
                </span>
              </div>
            </div>
          </div>

          {/* Breakdown Table */}
          <div>
            <h3 className="text-xs font-bold uppercase text-slate-800 tracking-wide mb-3">
              3. Operational Workflow Savings Breakdown
            </h3>
            <table className="w-full text-left border-collapse border border-slate-200 rounded-lg overflow-hidden text-xs">
              <thead className="bg-slate-100 text-slate-700 font-semibold text-[10px] uppercase">
                <tr>
                  <th className="p-2.5 border border-slate-200">Workflow Pillar</th>
                  <th className="p-2.5 border border-slate-200">Impact Mechanism</th>
                  <th className="p-2.5 border border-slate-200 text-right">Annual Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {results.breakdownItems.map((item) => (
                  <tr key={item.id}>
                    <td className="p-2.5 font-bold border border-slate-200 text-slate-900">
                      {item.title}
                    </td>
                    <td className="p-2.5 border border-slate-200 text-[11px] text-slate-600">
                      {item.description}
                    </td>
                    <td className="p-2.5 border border-slate-200 text-right font-extrabold text-teal-700">
                      {formatCurrency(item.annualSavings, inputs.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-teal-50/70 font-black text-slate-900">
                  <td colSpan={2} className="p-2.5 border border-slate-200 text-right">
                    Total Projected Annual Operational Benefit
                  </td>
                  <td className="p-2.5 border border-slate-200 text-right text-teal-900 text-sm">
                    {formatCurrency(results.totalAnnualSavings, inputs.currency)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* 5-Year Cash Flow Schedule */}
          <div>
            <h3 className="text-xs font-bold uppercase text-slate-800 tracking-wide mb-3">
              4. 5-Year Cash Flow & Cumulative Return Schedule
            </h3>
            <table className="w-full text-left border border-slate-200 text-xs">
              <thead className="bg-slate-100 text-slate-700 text-[10px] uppercase font-semibold">
                <tr>
                  <th className="p-2 border border-slate-200">Timeline</th>
                  <th className="p-2 border border-slate-200">Gross Savings</th>
                  <th className="p-2 border border-slate-200">HMS Investment</th>
                  <th className="p-2 border border-slate-200">Annual Net Cash</th>
                  <th className="p-2 border border-slate-200 text-right">Cumulative Net</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {results.yearProjections.map((p) => (
                  <tr key={p.year}>
                    <td className="p-2 border border-slate-200 font-semibold">Year {p.year}</td>
                    <td className="p-2 border border-slate-200">{formatCurrency(p.grossSavings, inputs.currency)}</td>
                    <td className="p-2 border border-slate-200 text-slate-500">{formatCurrency(p.hmsCosts, inputs.currency)}</td>
                    <td className="p-2 border border-slate-200 font-bold text-emerald-600">+{formatCurrency(p.netBenefit, inputs.currency)}</td>
                    <td className="p-2 border border-slate-200 text-right font-black text-teal-800">+{formatCurrency(p.cumulativeNetBenefit, inputs.currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Sign-off / Approval Block */}
          <div className="pt-6 border-t border-slate-200 grid grid-cols-2 gap-8 text-[11px] text-slate-500">
            <div>
              <p className="font-semibold text-slate-700 mb-6">Prepared by: HMS Solutions Lead</p>
              <div className="border-b border-slate-300 w-48 mb-1" />
              <p>Enterprise Sales & Healthcare Advisory</p>
            </div>
            <div>
              <p className="font-semibold text-slate-700 mb-6">Reviewed & Acknowledged by:</p>
              <div className="border-b border-slate-300 w-48 mb-1" />
              <p>Chief Financial Officer / Managing Director</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
