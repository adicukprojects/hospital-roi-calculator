export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'INR' | 'AED' | 'SGD' | 'CAD' | 'AUD';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  exchangeRateFromUSD: number; // For preset conversions
}

export type ScenarioPreset = 'conservative' | 'moderate' | 'aggressive';

export interface HospitalInputs {
  hospitalName: string;
  location: string;
  currency: CurrencyCode;
  
  // Core Operational Metrics
  bedCount: number;
  occupancyRate: number; // e.g. 78%
  dailyOutpatientVolume: number; // e.g. 450 OPD patients / day
  avgLengthOfStayDays: number; // e.g. 4.2 days
  
  // Administrative & Labor Costs
  adminBillingStaffCount: number; // e.g. 24 FTEs
  avgAdminAnnualSalary: number; // e.g. $45,000 / year
  adminHoursSpentOnManualPaperworkPerDay: number; // e.g. 3.5 hrs / day
  
  nursingStaffCount: number; // e.g. 110 nurses
  avgNurseAnnualSalary: number; // e.g. $72,000 / year
  nurseHoursSpentOnManualChartingPerDay: number; // e.g. 2.2 hrs / day
  
  // Revenue Cycle & Clinical Levers (Advanced)
  avgRevenuePerInpatientDay: number; // e.g. $1,400
  avgOutpatientTicketValue: number; // e.g. $120
  currentClaimDenialRate: number; // e.g. 8.5%
  annualInsuranceClaimVolume: number; // e.g. $18,000,000 billed/yr
  pharmacyMonthlyExpenditure: number; // e.g. $250,000 / month
  
  // HMS Investment (Cost side)
  hmsAnnualSubscription: number; // e.g. $85,000 / year
  hmsOneTimeImplementation: number; // e.g. $40,000 year 1
}

export interface SavingsBreakdownItem {
  id: string;
  title: string;
  category: 'labor' | 'claims' | 'bed' | 'pharmacy' | 'noshow';
  annualSavings: number;
  monthlySavings: number;
  hoursSavedPerYear?: number;
  description: string;
  formulaDescription: string;
  benchmarkCitation: string;
  confidenceTier: 'High' | 'Very High' | 'Moderate';
}

export interface YearProjection {
  year: number;
  yearLabel: string;
  milestone: string;
  grossSavings: number;
  hmsCosts: number; // subscription + one-time
  netBenefit: number;
  cumulativeGrossSavings: number;
  cumulativeCosts: number;
  cumulativeNetBenefit: number;
  roiPercentage: number; // Cumulative ROI %
}

export interface CalculationResults {
  // Aggregate Metrics
  totalAnnualSavings: number;
  totalAnnualHoursSaved: number;
  threeYearGrossSavings: number;
  threeYearNetSavings: number;
  threeYearROI: number; // e.g. 485%
  fiveYearGrossSavings: number;
  fiveYearNetSavings: number;
  fiveYearTotalCost: number;
  fiveYearROI: number; // e.g. 850%
  paybackPeriodMonths: number; // e.g. 3.8 months
  
  // Breakdown Categories
  laborAdminSavings: number;
  laborNursingSavings: number;
  totalLaborSavings: number;
  
  claimDenialRecoverySavings: number;
  bedTurnaroundRevenueGain: number;
  pharmacyLeakageSavings: number;
  patientNoShowRecoverySavings: number;
  
  breakdownItems: SavingsBreakdownItem[];
  yearProjections: YearProjection[];
}

export interface HospitalPreset {
  id: string;
  name: string;
  tagline: string;
  inputs: Partial<HospitalInputs>;
}

export interface SavedProposal {
  id: string;
  timestamp: number;
  hospitalName: string;
  scenario: ScenarioPreset;
  bedCount: number;
  totalAnnualSavings: number;
  threeYearROI: number;
  currency: CurrencyCode;
  inputs: HospitalInputs;
}
