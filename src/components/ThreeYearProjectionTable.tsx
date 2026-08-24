import { Calendar, TrendingUp, CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { CalculationResults, CurrencyCode } from '../types';
import { formatCurrency } from '../utils/calculations';

interface ThreeYearProjectionTableProps {
  results: CalculationResults;
  currency: CurrencyCode;
}

export function ThreeYearProjectionTable({
  results,
  currency,
}: ThreeYearProjectionTableProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-teal-600" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
            3-Year Cash Flow & Investment Projection
          </h3>
        </div>
        <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full font-semibold border border-emerald-200/60 self-start sm:self-auto">
          Net 3-Yr Economic Benefit: {formatCurrency(results.threeYearNetSavings, currency)}
        </span>
      </div>

      {/* Projection Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 font-semibold uppercase text-[10px] tracking-wider">
              <th className="py-2.5 px-3">Timeline Milestone</th>
              <th className="py-2.5 px-3">Gross Value Unlocked</th>
              <th className="py-2.5 px-3">HMS Solution Investment</th>
              <th className="py-2.5 px-3">Annual Net Benefit</th>
              <th className="py-2.5 px-3 font-bold text-slate-800">Cumulative Net Benefit</th>
              <th className="py-2.5 px-3 text-right">Cumulative ROI</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {results.yearProjections.map((proj) => (
              <tr key={proj.year} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-3 px-3 font-semibold text-slate-900 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold flex items-center justify-center">
                    Y{proj.year}
                  </span>
                  <span>
                    Year {proj.year}{' '}
                    {proj.year === 1 ? '(Deployment & Go-Live)' : '(Maturity & Scale)'}
                  </span>
                </td>
                <td className="py-3 px-3 font-medium text-slate-900">
                  {formatCurrency(proj.grossSavings, currency)}
                </td>
                <td className="py-3 px-3 text-slate-500">
                  {formatCurrency(proj.hmsCosts, currency)}
                </td>
                <td className="py-3 px-3 font-semibold text-emerald-600">
                  +{formatCurrency(proj.netBenefit, currency)}
                </td>
                <td className="py-3 px-3 font-bold text-teal-700">
                  +{formatCurrency(proj.cumulativeNetBenefit, currency)}
                </td>
                <td className="py-3 px-3 text-right font-extrabold text-slate-900">
                  +{Math.round(proj.roiPercentage)}%
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-slate-300 bg-slate-50 font-bold text-slate-900 text-xs">
              <td className="py-3 px-3">3-Year Cumulative Total</td>
              <td className="py-3 px-3 text-slate-900">
                {formatCurrency(results.threeYearGrossSavings, currency)}
              </td>
              <td className="py-3 px-3 text-slate-500">
                {formatCurrency(
                  results.threeYearGrossSavings - results.threeYearNetSavings,
                  currency
                )}
              </td>
              <td className="py-3 px-3 text-emerald-700">
                +{formatCurrency(results.threeYearNetSavings, currency)}
              </td>
              <td className="py-3 px-3 text-teal-800 text-sm">
                +{formatCurrency(results.threeYearNetSavings, currency)}
              </td>
              <td className="py-3 px-3 text-right text-emerald-700 text-sm font-extrabold">
                +{Math.round(results.threeYearROI)}%
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Summary Narrative Callout */}
      <div className="bg-teal-50/70 border border-teal-200/60 rounded-lg p-3 text-xs text-teal-900 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold">
            CFO Decision Brief: Self-Funding Capital Justification
          </p>
          <p className="text-teal-800 text-[11px] leading-relaxed">
            By year 1 end, automated workflow savings ({formatCurrency(results.yearProjections[0]?.grossSavings || 0, currency)}) will fully absorb both the annual subscription and one-time implementation fees. The hospital reaches full financial breakeven in{' '}
            <strong>{results.paybackPeriodMonths.toFixed(1)} months</strong>, generating{' '}
            <strong>{formatCurrency(results.threeYearNetSavings, currency)}</strong> in risk-adjusted net bottom-line cash flow across 36 months.
          </p>
        </div>
      </div>
    </div>
  );
}
