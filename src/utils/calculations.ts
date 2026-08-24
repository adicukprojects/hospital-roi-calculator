import { CalculationResults, CurrencyCode, HospitalInputs, ScenarioPreset, SavingsBreakdownItem, YearProjection } from '../types';
import { CURRENCIES } from '../data/benchmarks';

interface ScenarioMultipliers {
  adminPaperworkTimeSavedPct: number;
  nurseChartingTimeSavedPct: number;
  claimDenialReductionPct: number;
  bedTurnaroundExtraDaysPerBed: number;
  pharmacyLeakageSavedPct: number;
  outpatientNoShowRecoveryPct: number;
}

const SCENARIO_MULTIPLIERS: Record<ScenarioPreset, ScenarioMultipliers> = {
  conservative: {
    adminPaperworkTimeSavedPct: 0.35, // 35% time saved
    nurseChartingTimeSavedPct: 0.30, // 30% time saved
    claimDenialReductionPct: 0.35, // 35% denial reduction
    bedTurnaroundExtraDaysPerBed: 0.30, // 0.30 days capacity gain
    pharmacyLeakageSavedPct: 0.015, // 1.5% saved
    outpatientNoShowRecoveryPct: 0.035, // 3.5% no-shows recovered
  },
  moderate: {
    adminPaperworkTimeSavedPct: 0.50, // 50% time saved
    nurseChartingTimeSavedPct: 0.45, // 45% time saved
    claimDenialReductionPct: 0.50, // 50% denial reduction
    bedTurnaroundExtraDaysPerBed: 0.55, // 0.55 days capacity gain
    pharmacyLeakageSavedPct: 0.024, // 2.4% saved
    outpatientNoShowRecoveryPct: 0.055, // 5.5% no-shows recovered
  },
  aggressive: {
    adminPaperworkTimeSavedPct: 0.65, // 65% time saved
    nurseChartingTimeSavedPct: 0.60, // 60% time saved
    claimDenialReductionPct: 0.65, // 65% denial reduction
    bedTurnaroundExtraDaysPerBed: 0.85, // 0.85 days capacity gain
    pharmacyLeakageSavedPct: 0.035, // 3.5% saved
    outpatientNoShowRecoveryPct: 0.075, // 7.5% no-shows recovered
  },
};

export function calculateHMSFinancials(
  inputs: HospitalInputs,
  scenario: ScenarioPreset = 'moderate'
): CalculationResults {
  const mult = SCENARIO_MULTIPLIERS[scenario];

  // 1. Administrative Labor Savings
  const adminWorkDaysPerYear = 250;
  const adminTotalAnnualManualHours =
    inputs.adminBillingStaffCount *
    inputs.adminHoursSpentOnManualPaperworkPerDay *
    adminWorkDaysPerYear;
  
  const adminHoursSaved = adminTotalAnnualManualHours * mult.adminPaperworkTimeSavedPct;
  const adminHourlyRate = inputs.avgAdminAnnualSalary / (adminWorkDaysPerYear * 8);
  const laborAdminSavings = adminHoursSaved * adminHourlyRate;

  // 2. Nursing Documentation Labor Savings
  const nurseShiftsPerYear = 230;
  const nurseTotalAnnualManualHours =
    inputs.nursingStaffCount *
    inputs.nurseHoursSpentOnManualChartingPerDay *
    nurseShiftsPerYear;
  
  const nurseHoursSaved = nurseTotalAnnualManualHours * mult.nurseChartingTimeSavedPct;
  const nurseHourlyRate = inputs.avgNurseAnnualSalary / (nurseShiftsPerYear * 8);
  const laborNursingSavings = nurseHoursSaved * nurseHourlyRate;

  const totalLaborSavings = laborAdminSavings + laborNursingSavings;
  const totalAnnualHoursSaved = adminHoursSaved + nurseHoursSaved;

  // 3. Insurance Claim Denial Recovery
  const totalDeniedClaimsValue =
    inputs.annualInsuranceClaimVolume * (inputs.currentClaimDenialRate / 100);
  const claimDenialRecoverySavings =
    totalDeniedClaimsValue * mult.claimDenialReductionPct;

  // 4. Bed Turnaround & Occupancy Optimization
  const bedTurnaroundRevenueGain =
    inputs.bedCount *
    mult.bedTurnaroundExtraDaysPerBed *
    inputs.avgRevenuePerInpatientDay;

  // 5. Pharmacy & Consumables Leakage Reduction
  const annualPharmacySpend = inputs.pharmacyMonthlyExpenditure * 12;
  const pharmacyLeakageSavings = annualPharmacySpend * mult.pharmacyLeakageSavedPct;

  // 6. Patient No-Show & Outpatient Retention
  const annualOutpatientVisits = inputs.dailyOutpatientVolume * 310;
  const recoveredOutpatientVisits =
    annualOutpatientVisits * mult.outpatientNoShowRecoveryPct;
  const patientNoShowRecoverySavings =
    recoveredOutpatientVisits * inputs.avgOutpatientTicketValue;

  // Aggregate Total Annual Savings
  const totalAnnualSavings =
    totalLaborSavings +
    claimDenialRecoverySavings +
    bedTurnaroundRevenueGain +
    pharmacyLeakageSavings +
    patientNoShowRecoverySavings;

  // 5-Year Projections & Cumulative Cash Flow
  const year1Gross = totalAnnualSavings;
  const year1Cost = inputs.hmsAnnualSubscription + inputs.hmsOneTimeImplementation;
  const year1Net = year1Gross - year1Cost;

  const year2Gross = totalAnnualSavings * 1.04; // 4% operational adoption improvement
  const year2Cost = inputs.hmsAnnualSubscription;
  const year2Net = year2Gross - year2Cost;

  const year3Gross = totalAnnualSavings * 1.08; // 8% operational maturity improvement
  const year3Cost = inputs.hmsAnnualSubscription * 1.03; // slight index
  const year3Net = year3Gross - year3Cost;

  const year4Gross = totalAnnualSavings * 1.12; // 12% expansion & clinical refinement
  const year4Cost = inputs.hmsAnnualSubscription * 1.06;
  const year4Net = year4Gross - year4Cost;

  const year5Gross = totalAnnualSavings * 1.15; // 15% long-term ecosystem optimization
  const year5Cost = inputs.hmsAnnualSubscription * 1.09;
  const year5Net = year5Gross - year5Cost;

  const threeYearGrossSavings = year1Gross + year2Gross + year3Gross;
  const threeYearTotalCost = year1Cost + year2Cost + year3Cost;
  const threeYearNetSavings = threeYearGrossSavings - threeYearTotalCost;
  
  const threeYearROI =
    threeYearTotalCost > 0
      ? (threeYearNetSavings / threeYearTotalCost) * 100
      : 0;

  const fiveYearGrossSavings = year1Gross + year2Gross + year3Gross + year4Gross + year5Gross;
  const fiveYearTotalCost = year1Cost + year2Cost + year3Cost + year4Cost + year5Cost;
  const fiveYearNetSavings = fiveYearGrossSavings - fiveYearTotalCost;

  const fiveYearROI =
    fiveYearTotalCost > 0
      ? (fiveYearNetSavings / fiveYearTotalCost) * 100
      : 0;

  const paybackPeriodMonths =
    totalAnnualSavings > 0
      ? Math.max(0.5, Math.min(36, (year1Cost / totalAnnualSavings) * 12))
      : 12;

  // Running cumulative trackers
  const cGrossY1 = year1Gross;
  const cCostY1 = year1Cost;
  const cNetY1 = year1Net;
  const roiY1 = cCostY1 > 0 ? (cNetY1 / cCostY1) * 100 : 0;

  const cGrossY2 = cGrossY1 + year2Gross;
  const cCostY2 = cCostY1 + year2Cost;
  const cNetY2 = cNetY1 + year2Net;
  const roiY2 = cCostY2 > 0 ? (cNetY2 / cCostY2) * 100 : 0;

  const cGrossY3 = cGrossY2 + year3Gross;
  const cCostY3 = cCostY2 + year3Cost;
  const cNetY3 = cNetY2 + year3Net;
  const roiY3 = cCostY3 > 0 ? (cNetY3 / cCostY3) * 100 : 0;

  const cGrossY4 = cGrossY3 + year4Gross;
  const cCostY4 = cCostY3 + year4Cost;
  const cNetY4 = cNetY3 + year4Net;
  const roiY4 = cCostY4 > 0 ? (cNetY4 / cCostY4) * 100 : 0;

  const cGrossY5 = cGrossY4 + year5Gross;
  const cCostY5 = cCostY4 + year5Cost;
  const cNetY5 = cNetY4 + year5Net;
  const roiY5 = cCostY5 > 0 ? (cNetY5 / cCostY5) * 100 : 0;

  const yearProjections: YearProjection[] = [
    {
      year: 1,
      yearLabel: 'Year 1',
      milestone: 'Deployment & Initial Breakeven',
      grossSavings: year1Gross,
      hmsCosts: year1Cost,
      netBenefit: year1Net,
      cumulativeGrossSavings: cGrossY1,
      cumulativeCosts: cCostY1,
      cumulativeNetBenefit: cNetY1,
      roiPercentage: roiY1,
    },
    {
      year: 2,
      yearLabel: 'Year 2',
      milestone: 'Staff Adoption & Process Sync',
      grossSavings: year2Gross,
      hmsCosts: year2Cost,
      netBenefit: year2Net,
      cumulativeGrossSavings: cGrossY2,
      cumulativeCosts: cCostY2,
      cumulativeNetBenefit: cNetY2,
      roiPercentage: roiY2,
    },
    {
      year: 3,
      yearLabel: 'Year 3',
      milestone: 'Operational Maturity & Scale',
      grossSavings: year3Gross,
      hmsCosts: year3Cost,
      netBenefit: year3Net,
      cumulativeGrossSavings: cGrossY3,
      cumulativeCosts: cCostY3,
      cumulativeNetBenefit: cNetY3,
      roiPercentage: roiY3,
    },
    {
      year: 4,
      yearLabel: 'Year 4',
      milestone: 'Clinical Expansion & Efficiency',
      grossSavings: year4Gross,
      hmsCosts: year4Cost,
      netBenefit: year4Net,
      cumulativeGrossSavings: cGrossY4,
      cumulativeCosts: cCostY4,
      cumulativeNetBenefit: cNetY4,
      roiPercentage: roiY4,
    },
    {
      year: 5,
      yearLabel: 'Year 5',
      milestone: 'Full Enterprise Digital Value',
      grossSavings: year5Gross,
      hmsCosts: year5Cost,
      netBenefit: year5Net,
      cumulativeGrossSavings: cGrossY5,
      cumulativeCosts: cCostY5,
      cumulativeNetBenefit: cNetY5,
      roiPercentage: roiY5,
    },
  ];

  const breakdownItems: SavingsBreakdownItem[] = [
    {
      id: 'admin-labor',
      title: 'Administrative & Billing Labor Automation',
      category: 'labor',
      annualSavings: laborAdminSavings,
      monthlySavings: laborAdminSavings / 12,
      hoursSavedPerYear: adminHoursSaved,
      description: `Automates patient registration, charge entry, insurance pre-auth, and billing reconciliation across ${inputs.adminBillingStaffCount} staff FTEs.`,
      formulaDescription: `${inputs.adminBillingStaffCount} staff × ${inputs.adminHoursSpentOnManualPaperworkPerDay}h/day × ${Math.round(mult.adminPaperworkTimeSavedPct * 100)}% time saved = ${Math.round(adminHoursSaved).toLocaleString()} hours recovered.`,
      benchmarkCitation: 'MGMA Practice Operations Index: 45–60% admin billing task elimination.',
      confidenceTier: 'Very High',
    },
    {
      id: 'nursing-labor',
      title: 'Clinical & Nursing Charting Reclamation',
      category: 'labor',
      annualSavings: laborNursingSavings,
      monthlySavings: laborNursingSavings / 12,
      hoursSavedPerYear: nurseHoursSaved,
      description: `Replaces double paper charting with bedside digital vitals, templated nursing notes, and auto-generated shift handover sheets for ${inputs.nursingStaffCount} nurses.`,
      formulaDescription: `${inputs.nursingStaffCount} nurses × ${inputs.nurseHoursSpentOnManualChartingPerDay}h/shift × ${Math.round(mult.nurseChartingTimeSavedPct * 100)}% charting reduction = ${Math.round(nurseHoursSaved).toLocaleString()} clinical hours redirected to patient care.`,
      benchmarkCitation: 'Journal of Nursing Administration: 45+ mins saved per 12-hr nurse shift.',
      confidenceTier: 'High',
    },
    {
      id: 'claim-denials',
      title: 'Insurance Claim Denial & Clean-Claim Recovery',
      category: 'claims',
      annualSavings: claimDenialRecoverySavings,
      monthlySavings: claimDenialRecoverySavings / 12,
      description: `Real-time pre-submission claim scrubbers, auto-eligibility verification, and ICD-10 code conflict detection reduce preventable denials.`,
      formulaDescription: `${formatCurrency(totalDeniedClaimsValue, inputs.currency)} current annual denials × ${Math.round(mult.claimDenialReductionPct * 100)}% denial prevention rate.`,
      benchmarkCitation: 'HFMA: 65% of rejected insurance claims are preventable at point-of-registration.',
      confidenceTier: 'Very High',
    },
    {
      id: 'bed-turnaround',
      title: 'Bed Turnaround & Inpatient Capacity Optimization',
      category: 'bed',
      annualSavings: bedTurnaroundRevenueGain,
      monthlySavings: bedTurnaroundRevenueGain / 12,
      description: `Digital bed tracking synchronizes discharge orders, housekeeping alerts, and transport in real time, eliminating 50+ minutes of idle bed vacancy.`,
      formulaDescription: `${inputs.bedCount} beds × ${mult.bedTurnaroundExtraDaysPerBed.toFixed(2)} unlocked revenue days/bed/yr × ${formatCurrency(inputs.avgRevenuePerInpatientDay, inputs.currency)}/day.`,
      benchmarkCitation: 'HIMSS Operational Efficiency Benchmark: 52-min discharge turnaround reduction.',
      confidenceTier: 'Moderate',
    },
    {
      id: 'pharmacy-leakage',
      title: 'Pharmacy Dispensing & Inventory Expiry Control',
      category: 'pharmacy',
      annualSavings: pharmacyLeakageSavings,
      monthlySavings: pharmacyLeakageSavings / 12,
      description: `Barcode medication administration (BCMA) and FIFO batch tracking eliminate unbilled drugs, pilferage, and expired stock write-offs.`,
      formulaDescription: `${formatCurrency(annualPharmacySpend, inputs.currency)} annual pharmacy spend × ${(mult.pharmacyLeakageSavedPct * 100).toFixed(1)}% leakage recovery.`,
      benchmarkCitation: 'ASHP Hospital Pharmacy Survey: 2–4% revenue leakage in non-integrated pharmacies.',
      confidenceTier: 'High',
    },
    {
      id: 'outpatient-noshow',
      title: 'Outpatient Retention & Digital Appointment Reminders',
      category: 'noshow',
      annualSavings: patientNoShowRecoverySavings,
      monthlySavings: patientNoShowRecoverySavings / 12,
      description: `Automated SMS/WhatsApp reminders with one-click rescheduling recover missed clinic slots and boost specialty OPD slot utilization.`,
      formulaDescription: `${Math.round(annualOutpatientVisits).toLocaleString()} annual outpatient visits × ${(mult.outpatientNoShowRecoveryPct * 100).toFixed(1)}% recovered slots × ${formatCurrency(inputs.avgOutpatientTicketValue, inputs.currency)} avg bill.`,
      benchmarkCitation: 'MGMA Healthcare Research: 10–14% clinic no-show reduction with 2-way messaging.',
      confidenceTier: 'High',
    },
  ];

  return {
    totalAnnualSavings,
    totalAnnualHoursSaved,
    threeYearGrossSavings,
    threeYearNetSavings,
    threeYearROI,
    fiveYearGrossSavings,
    fiveYearNetSavings,
    fiveYearTotalCost,
    fiveYearROI,
    paybackPeriodMonths,
    laborAdminSavings,
    laborNursingSavings,
    totalLaborSavings,
    claimDenialRecoverySavings,
    bedTurnaroundRevenueGain,
    pharmacyLeakageSavings,
    patientNoShowRecoverySavings,
    breakdownItems,
    yearProjections,
  };
}

export function formatCurrency(
  value: number,
  currencyCode: CurrencyCode = 'USD',
  compact: boolean = false
): string {
  const currency = CURRENCIES[currencyCode] || CURRENCIES.USD;
  
  if (compact && Math.abs(value) >= 1_000_000) {
    return `${currency.symbol}${(value / 1_000_000).toFixed(2)}M`;
  }
  if (compact && Math.abs(value) >= 1_000) {
    return `${currency.symbol}${(value / 1_000).toFixed(1)}k`;
  }

  return `${currency.symbol}${Math.round(value).toLocaleString()}`;
}
