import { useState, useMemo, useEffect } from 'react';
import { HospitalInputs, ScenarioPreset, SavedProposal } from './types';
import { HOSPITAL_PRESETS } from './data/benchmarks';
import { calculateHMSFinancials } from './utils/calculations';
import { Header } from './components/Header';
import { InputPanel } from './components/InputPanel';
import { ExecutiveSummaryCards } from './components/ExecutiveSummaryCards';
import { SavingsBreakdownChart } from './components/SavingsBreakdownChart';
import { FiveYearRoiLineChart } from './components/FiveYearRoiLineChart';
import { ExecutiveProposalModal } from './components/ExecutiveProposalModal';
import { BenchmarkObjectionsModal } from './components/BenchmarkObjectionsModal';
import { SavedProposalsModal } from './components/SavedProposalsModal';
import { ProposalComparisonDashboard } from './components/ProposalComparisonDashboard';

const DEFAULT_INPUTS: HospitalInputs = {
  hospitalName: 'Mercy Regional Medical Center',
  location: 'Chicago, IL',
  currency: 'USD',
  bedCount: 250,
  occupancyRate: 78,
  dailyOutpatientVolume: 650,
  avgLengthOfStayDays: 4.2,
  adminBillingStaffCount: 32,
  avgAdminAnnualSalary: 46000,
  adminHoursSpentOnManualPaperworkPerDay: 3.6,
  nursingStaffCount: 160,
  avgNurseAnnualSalary: 74000,
  nurseHoursSpentOnManualChartingPerDay: 2.4,
  avgRevenuePerInpatientDay: 1550,
  avgOutpatientTicketValue: 135,
  currentClaimDenialRate: 8.4,
  annualInsuranceClaimVolume: 34000000,
  pharmacyMonthlyExpenditure: 420000,
  hmsAnnualSubscription: 95000,
  hmsOneTimeImplementation: 45000,
};

const LOCAL_STORAGE_KEY = 'hms_saved_proposals_v1';

export default function App() {
  const [inputs, setInputs] = useState<HospitalInputs>(DEFAULT_INPUTS);
  const [scenario, setScenario] = useState<ScenarioPreset>('moderate');

  // Modals state
  const [isExecutiveReportOpen, setIsExecutiveReportOpen] = useState(false);
  const [isBenchmarksOpen, setIsBenchmarksOpen] = useState(false);
  const [isSavedDealsOpen, setIsSavedDealsOpen] = useState(false);

  // Side-by-side comparison state
  const [comparisonPair, setComparisonPair] = useState<{
    proposalA: SavedProposal;
    proposalB: SavedProposal;
  } | null>(null);

  // Saved deals state in LocalStorage
  const [savedProposals, setSavedProposals] = useState<SavedProposal[]>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    // Default initial saved proposals for quick comparison testing
    return [
      {
        id: 'seed-mercy-250',
        timestamp: Date.now() - 86400000 * 3,
        hospitalName: 'Mercy Regional Medical Center (250-Bed)',
        scenario: 'moderate',
        bedCount: 250,
        totalAnnualSavings: 1845000,
        threeYearROI: 1475,
        currency: 'USD',
        inputs: {
          ...DEFAULT_INPUTS,
        },
      },
      {
        id: 'seed-st-mary-1',
        timestamp: Date.now() - 86400000 * 2,
        hospitalName: 'St. Mary Community Hospital (100-Bed)',
        scenario: 'conservative',
        bedCount: 100,
        totalAnnualSavings: 680000,
        threeYearROI: 395,
        currency: 'USD',
        inputs: {
          ...DEFAULT_INPUTS,
          ...(HOSPITAL_PRESETS[0]?.inputs || {}),
          hospitalName: 'St. Mary Community Hospital',
        },
      },
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(savedProposals));
    } catch {
      // ignore
    }
  }, [savedProposals]);

  const handleUpdateInputs = (partial: Partial<HospitalInputs>) => {
    setInputs((prev) => ({ ...prev, ...partial }));
  };

  // Pure deterministic calculations
  const results = useMemo(() => {
    return calculateHMSFinancials(inputs, scenario);
  }, [inputs, scenario]);

  const handleSaveCurrentProposal = (customName?: string) => {
    const newProposal: SavedProposal = {
      id: `prop-${Date.now()}`,
      timestamp: Date.now(),
      hospitalName: customName || inputs.hospitalName || 'Untitled Hospital Proposal',
      scenario,
      bedCount: inputs.bedCount,
      totalAnnualSavings: results.totalAnnualSavings,
      threeYearROI: results.threeYearROI,
      currency: inputs.currency,
      inputs: { ...inputs, hospitalName: customName || inputs.hospitalName },
    };

    setSavedProposals((prev) => [newProposal, ...prev]);
  };

  const handleLoadProposal = (proposal: SavedProposal) => {
    setInputs(proposal.inputs);
    setScenario(proposal.scenario);
  };

  const handleDeleteProposal = (id: string) => {
    setSavedProposals((prev) => prev.filter((p) => p.id !== id));
    if (
      comparisonPair &&
      (comparisonPair.proposalA.id === id || comparisonPair.proposalB.id === id)
    ) {
      setComparisonPair(null);
    }
  };

  const handleCompareProposals = (proposalA: SavedProposal, proposalB: SavedProposal) => {
    setComparisonPair({ proposalA, proposalB });
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-teal-100 selection:text-teal-900">
      {/* Top Application Header */}
      <Header
        inputs={inputs}
        onUpdateInputs={handleUpdateInputs}
        scenario={scenario}
        onSelectScenario={setScenario}
        onOpenExecutiveReport={() => setIsExecutiveReportOpen(true)}
        onOpenSavedDeals={() => setIsSavedDealsOpen(true)}
        onOpenBenchmarks={() => setIsBenchmarksOpen(true)}
        savedDealsCount={savedProposals.length}
      />

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Side-by-Side Comparison Panel if active */}
        {comparisonPair && (
          <ProposalComparisonDashboard
            proposalA={comparisonPair.proposalA}
            proposalB={comparisonPair.proposalB}
            onClose={() => setComparisonPair(null)}
            onApplyProposal={(p) => {
              handleLoadProposal(p);
            }}
          />
        )}

        {/* Top Financial Hero KPI Cards */}
        <ExecutiveSummaryCards
          results={results}
          currency={inputs.currency}
          scenario={scenario}
        />

        {/* 2-Column Responsive Split: Inputs vs. Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Operational Inputs Panel (5 Cols on large) */}
          <div className="lg:col-span-5 space-y-6">
            <InputPanel inputs={inputs} onUpdateInputs={handleUpdateInputs} />
          </div>

          {/* Right Column: Visual Breakdown & 5-Year Cumulative ROI Projection (7 Cols on large) */}
          <div className="lg:col-span-7 space-y-6">
            <SavingsBreakdownChart results={results} currency={inputs.currency} />
            <FiveYearRoiLineChart results={results} currency={inputs.currency} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-3 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            HMS Sales Acceleration Engine • Standalone In-Memory & Local Execution
          </span>
          <div className="flex items-center gap-3 text-slate-400">
            <span>HFMA & HIMSS Benchmarks</span>
            <span>•</span>
            <span>Deterministic Cash Flow Modeling</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ExecutiveProposalModal
        isOpen={isExecutiveReportOpen}
        onClose={() => setIsExecutiveReportOpen(false)}
        inputs={inputs}
        results={results}
        scenario={scenario}
      />

      <BenchmarkObjectionsModal
        isOpen={isBenchmarksOpen}
        onClose={() => setIsBenchmarksOpen(false)}
        results={results}
      />

      <SavedProposalsModal
        isOpen={isSavedDealsOpen}
        onClose={() => setIsSavedDealsOpen(false)}
        savedProposals={savedProposals}
        onLoadProposal={handleLoadProposal}
        onSaveCurrentProposal={handleSaveCurrentProposal}
        onDeleteProposal={handleDeleteProposal}
        onCompareProposals={handleCompareProposals}
        currentInputs={inputs}
        currentScenario={scenario}
        currentAnnualSavings={results.totalAnnualSavings}
        currentROI={results.threeYearROI}
      />
    </div>
  );
}
