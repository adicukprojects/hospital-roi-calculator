import { Building2, Calculator, FileSpreadsheet, BookmarkCheck, ShieldCheck, Sparkles } from 'lucide-react';
import { CurrencyCode, HospitalInputs, ScenarioPreset } from '../types';
import { CURRENCIES, HOSPITAL_PRESETS } from '../data/benchmarks';

interface HeaderProps {
  inputs: HospitalInputs;
  onUpdateInputs: (partial: Partial<HospitalInputs>) => void;
  scenario: ScenarioPreset;
  onSelectScenario: (scenario: ScenarioPreset) => void;
  onOpenExecutiveReport: () => void;
  onOpenSavedDeals: () => void;
  onOpenBenchmarks: () => void;
  savedDealsCount: number;
}

export function Header({
  inputs,
  onUpdateInputs,
  scenario,
  onSelectScenario,
  onOpenExecutiveReport,
  onOpenSavedDeals,
  onOpenBenchmarks,
  savedDealsCount,
}: HeaderProps) {
  const handlePresetSelect = (presetId: string) => {
    const preset = HOSPITAL_PRESETS.find((p) => p.id === presetId);
    if (preset && preset.inputs) {
      onUpdateInputs({
        ...preset.inputs,
        hospitalName: inputs.hospitalName || preset.name,
      });
    }
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between py-3 gap-3">
          {/* Logo & Prospect Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-teal-400">
                  HMS Enterprise Sales
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-xs text-slate-400">ROI Financial Engine</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  id="prospect-hospital-name-input"
                  type="text"
                  value={inputs.hospitalName}
                  onChange={(e) => onUpdateInputs({ hospitalName: e.target.value })}
                  placeholder="Enter Hospital / Health System Name..."
                  className="bg-slate-800/80 hover:bg-slate-800 text-white font-medium text-sm px-2.5 py-1 rounded border border-slate-700 focus:border-teal-500 focus:outline-none w-56 sm:w-72 transition-colors placeholder:text-slate-500"
                />
              </div>
            </div>
          </div>

          {/* Controls: Presets, Currency, Scenarios, Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Quick Preset Selector */}
            <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg px-2 py-1">
              <span className="text-xs text-slate-400 mr-2 hidden sm:inline">Size:</span>
              <select
                id="preset-selector-dropdown"
                onChange={(e) => handlePresetSelect(e.target.value)}
                defaultValue="regional-250"
                className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer pr-2 font-medium"
              >
                {HOSPITAL_PRESETS.map((p) => (
                  <option key={p.id} value={p.id} className="bg-slate-800 text-white">
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Currency Selector */}
            <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg px-2 py-1">
              <select
                id="currency-selector-dropdown"
                value={inputs.currency}
                onChange={(e) => onUpdateInputs({ currency: e.target.value as CurrencyCode })}
                className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer font-medium"
              >
                {Object.values(CURRENCIES).map((c) => (
                  <option key={c.code} value={c.code} className="bg-slate-800 text-white">
                    {c.code} ({c.symbol.trim()})
                  </option>
                ))}
              </select>
            </div>

            {/* Scenario Buttons (Conservative / Moderate / Aggressive) */}
            <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700">
              {(['conservative', 'moderate', 'aggressive'] as ScenarioPreset[]).map((s) => {
                const isActive = scenario === s;
                return (
                  <button
                    key={s}
                    id={`scenario-btn-${s}`}
                    onClick={() => onSelectScenario(s)}
                    className={`text-xs px-2.5 py-1 rounded-md font-medium capitalize transition-all ${
                      isActive
                        ? 'bg-teal-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>

            {/* Benchmarks / Objection Prep */}
            <button
              id="benchmarks-btn"
              onClick={onOpenBenchmarks}
              title="View Industry Citations & Objection Battlecards"
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              <span className="hidden lg:inline">CFO Defense</span>
            </button>

            {/* Saved Deals Drawer */}
            <button
              id="saved-deals-btn"
              onClick={onOpenSavedDeals}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors"
            >
              <BookmarkCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Saved ({savedDealsCount})</span>
            </button>

            {/* Executive Boardroom Presentation / PDF Mode */}
            <button
              id="executive-report-btn"
              onClick={onOpenExecutiveReport}
              className="flex items-center gap-1.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm transition-all"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Executive Briefing</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
