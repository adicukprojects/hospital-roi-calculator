import { CurrencyCode, CurrencyConfig, HospitalPreset } from '../types';

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar (USD)', exchangeRateFromUSD: 1.0 },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro (EUR)', exchangeRateFromUSD: 0.92 },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound (GBP)', exchangeRateFromUSD: 0.79 },
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee (INR)', exchangeRateFromUSD: 86.5 },
  AED: { code: 'AED', symbol: 'AED ', name: 'UAE Dirham (AED)', exchangeRateFromUSD: 3.67 },
  SGD: { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar (SGD)', exchangeRateFromUSD: 1.34 },
  CAD: { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar (CAD)', exchangeRateFromUSD: 1.38 },
  AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar (AUD)', exchangeRateFromUSD: 1.54 },
};

export const HOSPITAL_PRESETS: HospitalPreset[] = [
  {
    id: 'community-100',
    name: 'Community Hospital (100 Beds)',
    tagline: 'Standard suburban primary & secondary acute care facility',
    inputs: {
      bedCount: 100,
      occupancyRate: 72,
      dailyOutpatientVolume: 280,
      avgLengthOfStayDays: 3.8,
      adminBillingStaffCount: 14,
      avgAdminAnnualSalary: 42000,
      adminHoursSpentOnManualPaperworkPerDay: 3.2,
      nursingStaffCount: 65,
      avgNurseAnnualSalary: 68000,
      nurseHoursSpentOnManualChartingPerDay: 2.1,
      avgRevenuePerInpatientDay: 1250,
      avgOutpatientTicketValue: 95,
      currentClaimDenialRate: 7.8,
      annualInsuranceClaimVolume: 12000000,
      pharmacyMonthlyExpenditure: 160000,
      hmsAnnualSubscription: 48000,
      hmsOneTimeImplementation: 22000,
    }
  },
  {
    id: 'regional-250',
    name: 'Regional Medical Center (250 Beds)',
    tagline: 'Mid-sized regional hospital with multi-department surgical & emergency',
    inputs: {
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
    }
  },
  {
    id: 'tertiary-500',
    name: 'Tertiary & Multi-Specialty (500 Beds)',
    tagline: 'High-volume urban medical center with intensive care & specialty wings',
    inputs: {
      bedCount: 500,
      occupancyRate: 84,
      dailyOutpatientVolume: 1400,
      avgLengthOfStayDays: 4.8,
      adminBillingStaffCount: 68,
      avgAdminAnnualSalary: 48000,
      adminHoursSpentOnManualPaperworkPerDay: 3.8,
      nursingStaffCount: 340,
      avgNurseAnnualSalary: 78000,
      nurseHoursSpentOnManualChartingPerDay: 2.5,
      avgRevenuePerInpatientDay: 1850,
      avgOutpatientTicketValue: 180,
      currentClaimDenialRate: 9.2,
      annualInsuranceClaimVolume: 82000000,
      pharmacyMonthlyExpenditure: 950000,
      hmsAnnualSubscription: 185000,
      hmsOneTimeImplementation: 80000,
    }
  },
  {
    id: 'flagship-1000',
    name: 'University & Flagship Super-Specialty (1,000 Beds)',
    tagline: 'Premier healthcare conglomerate or university teaching hospital',
    inputs: {
      bedCount: 1000,
      occupancyRate: 89,
      dailyOutpatientVolume: 3200,
      avgLengthOfStayDays: 5.2,
      adminBillingStaffCount: 145,
      avgAdminAnnualSalary: 52000,
      adminHoursSpentOnManualPaperworkPerDay: 4.0,
      nursingStaffCount: 750,
      avgNurseAnnualSalary: 82000,
      nurseHoursSpentOnManualChartingPerDay: 2.6,
      avgRevenuePerInpatientDay: 2200,
      avgOutpatientTicketValue: 240,
      currentClaimDenialRate: 9.8,
      annualInsuranceClaimVolume: 195000000,
      pharmacyMonthlyExpenditure: 2400000,
      hmsAnnualSubscription: 360000,
      hmsOneTimeImplementation: 150000,
    }
  }
];

export const INDUSTRY_BENCHMARKS = [
  {
    source: 'HFMA (Healthcare Financial Management Association)',
    metric: 'Claim Denials & RCM',
    finding: 'Automating pre-authorization and clean-claim scrub rules recovers 42% to 65% of preventable initial claim rejections, saving an average of $25 per resubmitted claim.'
  },
  {
    source: 'HIMSS & American Hospital Association',
    metric: 'Bed Turnaround Optimization',
    finding: 'Centralized digital bed-board alerts reduce discharge-to-clean turnaround time by 52 minutes, unlocking ~0.4 to 0.8 additional bed days per month per active bed.'
  },
  {
    source: 'Journal of Nursing Administration',
    metric: 'Clinical Documentation Burden',
    finding: 'Nurses spend 25–35% of 12-hour shifts on manual paper charting and medication logs. Modern bedside digital EHR integration reduces documentation time by 45–60 minutes per shift.'
  },
  {
    source: 'MGMA (Medical Group Management Association)',
    metric: 'Patient No-Show Prevention',
    finding: 'Automated 2-way SMS/WhatsApp appointment reminders with direct reschedule links reduce outpatient no-show rates from ~16% to under 6%.'
  },
  {
    source: 'ASHP (American Society of Health-System Pharmacists)',
    metric: 'Pharmacy Dispensing & Expiry',
    finding: 'Closed-loop electronic medication tracking eliminates 70%+ of expired stock discard and unbilled medication dispensation errors.'
  }
];

export const OBJECTION_HANDLINGS = [
  {
    objection: '"We already have a legacy billing/EHR system and switching is too costly."',
    talkingPoint: 'Focus on Opportunity Cost: Continuing with fragmented legacy tools costs $X in preventable claim denials and $Y in manual overtime every single year. The new HMS pays for itself in {payback} months, making inaction the most expensive choice.',
    stakeholder: 'CFO / Managing Director'
  },
  {
    objection: '"Our doctors and nurses will complain about adopting another software."',
    talkingPoint: 'Focus on Burnout & Time Reclamation: The system reduces nurse charting by 1.2+ hours per shift with smart templates and mobile bedside vitals sync, directly returning time to direct patient care and reducing clinical turnover.',
    stakeholder: 'Chief Medical Officer / Nursing Director'
  },
  {
    objection: '"Can we start small with just 1 or 2 modules first?"',
    talkingPoint: 'Highlight Unified ROI: The greatest savings compound when Admissions, Billing, Pharmacy, and Beds communicate in real time. We offer modular phased rollouts with rapid Year 1 milestone paybacks.',
    stakeholder: 'Chief Operating Officer / CIO'
  }
];
