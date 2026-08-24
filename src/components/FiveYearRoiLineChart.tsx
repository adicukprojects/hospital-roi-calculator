import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  ComposedChart,
} from 'recharts';
import {
  TrendingUp,
  Calendar,
  ShieldCheck,
  Table as TableIcon,
  LineChart as ChartIcon,
  Layers,
  ArrowUpRight,
  Info,
  DollarSign,
  Percent,
} from 'lucide-react';
import { CalculationResults, CurrencyCode } from '../types';
import { formatCurrency } from '../utils/calculations';

interface FiveYearRoiLineChartProps {
  results: CalculationResults;
  currency: CurrencyCode;
}

type ChartMetricView = 'roi' | 'cashflow' | 'dual';
type DisplayMode = 'chart' | 'table' | 'both';

export function FiveYearRoiLineChart({ results, currency }: FiveYearRoiLineChartProps) {
  const [metricView, setMetricView] = useState<ChartMetricView>('roi');
  const [displayMode, setDisplayMode] = useState<DisplayMode>('chart');
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);

  // Chart dataset mapped from 5-year projections
  // Include Year 0 (Day 0 / Pre-deployment baseline) for pristine origin visualization
  const initialImplementationCost =
    results.yearProjections[0]?.hmsCosts || 0;

  const chartData = [
    {
      year: 0,
      yearLabel: 'Day 0',
      milestone: 'Pre-Deployment Baseline',
      grossSavings: 0,
      hmsCosts: initialImplementationCost,
      annualNet: -initialImplementationCost,
      cumulativeGrossSavings: 0,
      cumulativeCosts: initialImplementationCost,
      cumulativeNetBenefit: -initialImplementationCost,
      roiPercentage: 0,
    },
    ...results.yearProjections.map((p) => ({
      year: p.year,
      yearLabel: p.yearLabel,
      milestone: p.milestone,
      grossSavings: p.grossSavings,
      hmsCosts: p.hmsCosts,
      annualNet: p.netBenefit,
      cumulativeGrossSavings: p.cumulativeGrossSavings,
      cumulativeCosts: p.cumulativeCosts,
      cumulativeNetBenefit: p.cumulativeNetBenefit,
      roiPercentage: Math.round(p.roiPercentage),
    })),
  ];

  // Custom Chart Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0]?.payload;
    if (!data) return null;

    return (
      <div className="bg-slate-900 text-white rounded-xl p-3.5 shadow-xl border border-slate-800 text-xs space-y-2 min-w-[240px] animate-fadeIn">
        <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
          <span className="font-extrabold text-teal-400 text-sm">{data.yearLabel}</span>
          <span className="text-[10px] text-slate-400 font-medium">{data.milestone}</span>
        </div>

        <div className="space-y-1 pt-0.5">
          {data.year > 0 && (
            <div className="flex items-center justify-between text-emerald-400 font-bold">
              <span>Cumulative ROI:</span>
              <span className="text-sm">+{data.roiPercentage}%</span>
            </div>
          )}

          <div className="flex items-center justify-between text-slate-200">
            <span>Cumulative Net Value:</span>
            <span className="font-bold text-teal-300">
              {data.cumulativeNetBenefit >= 0 ? '+' : ''}
              {formatCurrency(data.cumulativeNetBenefit, currency)}
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span>Annual Gross Savings:</span>
            <span className="text-slate-300 font-medium">
              {formatCurrency(data.grossSavings, currency)}
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span>Cumulative Tech Spend:</span>
            <span className="text-slate-300 font-medium">
              {formatCurrency(data.cumulativeCosts, currency)}
            </span>
          </div>
        </div>

        {data.year === 1 && (
          <div className="pt-1 border-t border-slate-800 text-[10px] text-teal-300/80 italic">
            Full breakeven achieved in {results.paybackPeriodMonths.toFixed(1)} months.
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-5 space-y-5">
      {/* Top Header & View Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200/60">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              5-Year Cumulative ROI & Cash Flow Trajectory
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Interactive multi-year financial forecast showing cumulative yield, breakeven inflection, and cash value.
          </p>
        </div>

        {/* View Switchers */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Chart Metric Selector */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-medium">
            <button
              id="chart-view-roi-btn"
              onClick={() => setMetricView('roi')}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                metricView === 'roi'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Percent className="w-3 h-3 text-teal-600" />
              <span>ROI %</span>
            </button>
            <button
              id="chart-view-cashflow-btn"
              onClick={() => setMetricView('cashflow')}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                metricView === 'cashflow'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <DollarSign className="w-3 h-3 text-emerald-600" />
              <span>Cash Flow ($)</span>
            </button>
            <button
              id="chart-view-dual-btn"
              onClick={() => setMetricView('dual')}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                metricView === 'dual'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3 h-3 text-blue-600" />
              <span>Dual View</span>
            </button>
          </div>

          {/* Chart vs Table Toggle */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-medium">
            <button
              id="display-mode-chart-btn"
              onClick={() => setDisplayMode('chart')}
              className={`p-1.5 rounded-md transition-all ${
                displayMode === 'chart'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Line Chart View"
            >
              <ChartIcon className="w-3.5 h-3.5" />
            </button>
            <button
              id="display-mode-table-btn"
              onClick={() => setDisplayMode('table')}
              className={`p-1.5 rounded-md transition-all ${
                displayMode === 'table'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Audit Table View"
            >
              <TableIcon className="w-3.5 h-3.5" />
            </button>
            <button
              id="display-mode-both-btn"
              onClick={() => setDisplayMode('both')}
              className={`px-2 py-1 rounded-md transition-all text-[11px] ${
                displayMode === 'both'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Both Chart & Table"
            >
              Both
            </button>
          </div>
        </div>
      </div>

      {/* 5-Year Milestone Summary Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-0.5">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">
            Breakeven Point
          </span>
          <div className="text-sm font-extrabold text-slate-900">
            {results.paybackPeriodMonths.toFixed(1)} Months
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold block">
            Self-Funding in Year 1
          </span>
        </div>

        <div className="p-2.5 bg-teal-50/60 border border-teal-200/70 rounded-xl space-y-0.5">
          <span className="text-[10px] uppercase font-bold text-teal-700 block">
            Year 1 Net ROI
          </span>
          <div className="text-sm font-extrabold text-teal-900">
            +{Math.round(results.yearProjections[0]?.roiPercentage || 0)}%
          </div>
          <span className="text-[10px] text-teal-700 font-medium block truncate">
            {formatCurrency(results.yearProjections[0]?.cumulativeNetBenefit || 0, currency, true)} Net Gain
          </span>
        </div>

        <div className="p-2.5 bg-emerald-50/60 border border-emerald-200/70 rounded-xl space-y-0.5">
          <span className="text-[10px] uppercase font-bold text-emerald-700 block">
            3-Year Cumulative ROI
          </span>
          <div className="text-sm font-extrabold text-emerald-900">
            +{Math.round(results.threeYearROI)}%
          </div>
          <span className="text-[10px] text-emerald-700 font-medium block truncate">
            {formatCurrency(results.threeYearNetSavings, currency, true)} Net Gain
          </span>
        </div>

        <div className="p-2.5 bg-indigo-50/60 border border-indigo-200/70 rounded-xl space-y-0.5">
          <span className="text-[10px] uppercase font-bold text-indigo-700 block">
            5-Year Cumulative ROI
          </span>
          <div className="text-sm font-extrabold text-indigo-900">
            +{Math.round(results.fiveYearROI)}%
          </div>
          <span className="text-[10px] text-indigo-700 font-medium block truncate">
            {formatCurrency(results.fiveYearNetSavings, currency, true)} Net Gain
          </span>
        </div>
      </div>

      {/* Main Recharts Line Chart */}
      {(displayMode === 'chart' || displayMode === 'both') && (
        <div className="bg-slate-50/50 rounded-xl p-3 sm:p-4 border border-slate-200/80">
          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {metricView === 'roi' ? (
                // Pure ROI Percentage Line Chart with Gradient Fill
                <ComposedChart
                  data={chartData.filter((d) => d.year > 0)}
                  margin={{ top: 15, right: 20, left: 0, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="roiGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0d9488" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#0d9488" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis
                    dataKey="yearLabel"
                    tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }}
                    axisLine={{ stroke: '#cbd5e1' }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: '#64748b', fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(val) => `${val}%`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine
                    y={100}
                    stroke="#10b981"
                    strokeDasharray="4 4"
                    label={{
                      value: '100% Breakeven Line',
                      fill: '#059669',
                      fontSize: 9,
                      position: 'insideTopRight',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="roiPercentage"
                    stroke="none"
                    fill="url(#roiGradient)"
                  />
                  <Line
                    type="monotone"
                    dataKey="roiPercentage"
                    name="Cumulative ROI (%)"
                    stroke="#0d9488"
                    strokeWidth={3}
                    dot={{ fill: '#0d9488', r: 4, strokeWidth: 2, stroke: '#ffffff' }}
                    activeDot={{ r: 6, fill: '#0f766e', stroke: '#ffffff', strokeWidth: 2 }}
                  />
                </ComposedChart>
              ) : metricView === 'cashflow' ? (
                // Cash Value ($) Comparison Line Chart
                <LineChart
                  data={chartData}
                  margin={{ top: 15, right: 20, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis
                    dataKey="yearLabel"
                    tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }}
                    axisLine={{ stroke: '#cbd5e1' }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: '#64748b', fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(val) => formatCurrency(val, currency, true)}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    verticalAlign="top"
                    height={32}
                    iconType="circle"
                    wrapperStyle={{ fontSize: '11px', fontWeight: 600, color: '#334155' }}
                  />
                  <ReferenceLine y={0} stroke="#94a3b8" strokeWidth={1} />
                  <Line
                    type="monotone"
                    dataKey="cumulativeNetBenefit"
                    name="Cumulative Net Benefit ($)"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ fill: '#10b981', r: 4, stroke: '#ffffff', strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: '#047857' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="cumulativeGrossSavings"
                    name="Cumulative Gross Value ($)"
                    stroke="#0284c7"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={{ fill: '#0284c7', r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="cumulativeCosts"
                    name="Cumulative HMS Tech Spend ($)"
                    stroke="#64748b"
                    strokeWidth={2}
                    dot={{ fill: '#64748b', r: 3 }}
                  />
                </LineChart>
              ) : (
                // Dual-Axis: ROI % on Right, Net Benefit $ on Left
                <LineChart
                  data={chartData.filter((d) => d.year > 0)}
                  margin={{ top: 15, right: 20, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis
                    dataKey="yearLabel"
                    tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }}
                    axisLine={{ stroke: '#cbd5e1' }}
                    tickLine={false}
                  />
                  {/* Left Y-Axis: Net Benefit ($) */}
                  <YAxis
                    yAxisId="left"
                    tick={{ fill: '#059669', fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(val) => formatCurrency(val, currency, true)}
                  />
                  {/* Right Y-Axis: ROI % */}
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fill: '#0d9488', fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(val) => `${val}%`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    verticalAlign="top"
                    height={32}
                    iconType="circle"
                    wrapperStyle={{ fontSize: '11px', fontWeight: 600 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="roiPercentage"
                    name="Cumulative ROI (%)"
                    stroke="#0d9488"
                    strokeWidth={3}
                    dot={{ fill: '#0d9488', r: 4, stroke: '#ffffff', strokeWidth: 2 }}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="cumulativeNetBenefit"
                    name="Cumulative Net Benefit ($)"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    dot={{ fill: '#10b981', r: 4, stroke: '#ffffff', strokeWidth: 2 }}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="cumulativeCosts"
                    name="Cumulative Tech Spend ($)"
                    stroke="#94a3b8"
                    strokeWidth={1.5}
                    strokeDasharray="3 3"
                    dot={{ fill: '#94a3b8', r: 2.5 }}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 px-1 border-t border-slate-200/60 mt-2">
            <span className="flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-teal-600" />
              Hover points on the chart to inspect annual cash flows, tech spend, and milestone benefits.
            </span>
            <span className="font-semibold text-teal-800 hidden sm:inline">
              5-Year Lifetime ROI: +{Math.round(results.fiveYearROI)}%
            </span>
          </div>
        </div>
      )}

      {/* 5-Year Full Financial Ledger Table */}
      {(displayMode === 'table' || displayMode === 'both') && (
        <div className="space-y-3">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse border border-slate-200 rounded-xl overflow-hidden">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-100 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 px-3">Timeline Milestone</th>
                  <th className="py-2.5 px-3">Annual Gross Savings</th>
                  <th className="py-2.5 px-3">HMS Tech Spend</th>
                  <th className="py-2.5 px-3">Annual Net Benefit</th>
                  <th className="py-2.5 px-3 font-bold text-slate-900">Cumulative Net Benefit</th>
                  <th className="py-2.5 px-3 text-right">Cumulative ROI %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {results.yearProjections.map((proj) => (
                  <tr key={proj.year} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">
                      <div className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded bg-teal-50 text-teal-800 border border-teal-200 text-[10px] font-bold flex items-center justify-center">
                          Y{proj.year}
                        </span>
                        <div>
                          <span className="font-bold">Year {proj.year}</span>
                          <span className="text-[10px] text-slate-400 block font-normal">
                            {proj.milestone}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-900">
                      {formatCurrency(proj.grossSavings, currency)}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">
                      {formatCurrency(proj.hmsCosts, currency)}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-emerald-600">
                      +{formatCurrency(proj.netBenefit, currency)}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-teal-800">
                      +{formatCurrency(proj.cumulativeNetBenefit, currency)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-extrabold text-slate-900">
                      +{Math.round(proj.roiPercentage)}%
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                {/* 3-Year Subtotal */}
                <tr className="border-t border-slate-300 bg-slate-50/80 font-bold text-slate-800 text-xs">
                  <td className="py-2 px-3">3-Year Subtotal Milestone</td>
                  <td className="py-2 px-3">{formatCurrency(results.threeYearGrossSavings, currency)}</td>
                  <td className="py-2 px-3 text-slate-500">
                    {formatCurrency(results.threeYearGrossSavings - results.threeYearNetSavings, currency)}
                  </td>
                  <td className="py-2 px-3 text-emerald-700">+{formatCurrency(results.threeYearNetSavings, currency)}</td>
                  <td className="py-2 px-3 text-teal-800">+{formatCurrency(results.threeYearNetSavings, currency)}</td>
                  <td className="py-2 px-3 text-right text-emerald-700 font-extrabold">+{Math.round(results.threeYearROI)}%</td>
                </tr>

                {/* 5-Year Grand Total */}
                <tr className="border-t-2 border-slate-300 bg-teal-50/60 font-black text-slate-900 text-xs">
                  <td className="py-2.5 px-3">5-Year Cumulative Total</td>
                  <td className="py-2.5 px-3 text-slate-900">{formatCurrency(results.fiveYearGrossSavings, currency)}</td>
                  <td className="py-2.5 px-3 text-slate-600">{formatCurrency(results.fiveYearTotalCost, currency)}</td>
                  <td className="py-2.5 px-3 text-emerald-800">+{formatCurrency(results.fiveYearNetSavings, currency)}</td>
                  <td className="py-2.5 px-3 text-teal-900 text-sm">+{formatCurrency(results.fiveYearNetSavings, currency)}</td>
                  <td className="py-2.5 px-3 text-right text-emerald-700 text-sm font-black">+{Math.round(results.fiveYearROI)}%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* CFO Executive Synthesis Callout */}
      <div className="bg-teal-50/70 border border-teal-200/60 rounded-xl p-3.5 text-xs text-teal-900 flex items-start gap-3">
        <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-slate-900">
            5-Year Financial Capital Case & Net Cash Unlock
          </p>
          <p className="text-teal-900/90 text-[11px] leading-relaxed">
            The HMS investment delivers self-funding payback in{' '}
            <strong>{results.paybackPeriodMonths.toFixed(1)} months</strong>, generating a Year 1 net ROI of{' '}
            <strong>+{Math.round(results.yearProjections[0]?.roiPercentage || 0)}%</strong>. Over a 5-year operational lifecycle, cumulative gross value reaches{' '}
            <strong>{formatCurrency(results.fiveYearGrossSavings, currency)}</strong> against total technology spend of{' '}
            <strong>{formatCurrency(results.fiveYearTotalCost, currency)}</strong>, yielding an overall 5-year return on investment of{' '}
            <strong>+{Math.round(results.fiveYearROI)}%</strong> ({formatCurrency(results.fiveYearNetSavings, currency)} in risk-adjusted bottom-line net profit).
          </p>
        </div>
      </div>
    </div>
  );
}
