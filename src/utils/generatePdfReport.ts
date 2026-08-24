import { jsPDF } from 'jspdf';
import { CalculationResults, CurrencyCode, HospitalInputs, ScenarioPreset } from '../types';

/**
 * Format currency specifically for PDF generation.
 * Avoids multi-byte unicode glyphs (such as ₹ or narrow non-breaking spaces)
 * that cause encoding distortion or miscalculated text widths in standard jsPDF fonts.
 */
function formatPdfCurrency(
  value: number,
  currencyCode: CurrencyCode = 'USD',
  compact: boolean = false
): string {
  const prefixMap: Record<CurrencyCode, string> = {
    USD: '$',
    EUR: 'EUR ',
    GBP: 'GBP ',
    INR: 'INR ',
    AED: 'AED ',
    SGD: 'SGD ',
    CAD: 'CAD ',
    AUD: 'AUD ',
  };
  const prefix = prefixMap[currencyCode] || '$';

  if (compact && Math.abs(value) >= 1_000_000) {
    return `${prefix}${(value / 1_000_000).toFixed(2)}M`;
  }
  if (compact && Math.abs(value) >= 1_000) {
    return `${prefix}${(value / 1_000).toFixed(1)}k`;
  }

  // Use en-US standard number formatting with commas and regular ASCII characters
  const formattedNum = Math.round(value).toLocaleString('en-US');
  return `${prefix}${formattedNum}`;
}

export function generateExecutivePdfProposal(
  inputs: HospitalInputs,
  results: CalculationResults,
  scenario: ScenarioPreset
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
  const margin = 14;
  const contentWidth = pageWidth - margin * 2; // 182mm (from x=14 to x=196)

  // Executive Color Palette
  const primaryDark = [15, 23, 42]; // Slate 900 #0f172a
  const primaryTeal = [13, 148, 136]; // Teal 600 #0d9488
  const darkTeal = [15, 118, 110]; // Teal 700 #0f766e
  const tealLight = [240, 253, 250]; // Teal 50 #f0fdfa
  const slateMuted = [100, 116, 139]; // Slate 500 #64748b
  const slateDark = [51, 65, 85]; // Slate 700 #334155
  const slateBorder = [226, 232, 240]; // Slate 200 #e2e8f0
  const emeraldGreen = [5, 150, 105]; // Emerald 600 #059669
  const bgSlate50 = [248, 250, 252]; // Slate 50 #f8fafc

  let currentY = 0;

  // ----------------------------------------------------
  // 1. TOP HEADER BANNER (Navy & Teal Accent Line)
  // ----------------------------------------------------
  doc.setFillColor(primaryDark[0], primaryDark[1], primaryDark[2]);
  doc.rect(0, 0, pageWidth, 21, 'F');

  // Decorative teal accent bar
  doc.setFillColor(primaryTeal[0], primaryTeal[1], primaryTeal[2]);
  doc.rect(0, 20.2, pageWidth, 0.8, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.text('EXECUTIVE FINANCIAL BUSINESS CASE', margin, 9.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(45, 212, 191); // Teal 400
  doc.text('HOSPITAL MANAGEMENT SYSTEM (HMS) DIGITAL TRANSFORMATION', margin, 15);

  const dateStr = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  doc.setTextColor(203, 213, 225); // Slate 300
  doc.setFontSize(7.5);
  doc.text(`Generated: ${dateStr}`, pageWidth - margin, 12, { align: 'right' });

  currentY = 27;

  // ----------------------------------------------------
  // 2. HOSPITAL TITLE & SCOPE
  // ----------------------------------------------------
  doc.setTextColor(primaryDark[0], primaryDark[1], primaryDark[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13.5);
  const hospitalTitle = inputs.hospitalName?.trim() || 'Health System Facility';
  doc.text(hospitalTitle, margin, currentY);

  currentY += 4.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
  const scopeText = `Scope: ${inputs.bedCount} Inpatient Beds  |  ${inputs.dailyOutpatientVolume} Daily OPD Visits  |  ${inputs.nursingStaffCount} Nursing FTEs  |  Scenario: ${scenario.toUpperCase()} PROJECTION`;
  doc.text(scopeText, margin, currentY);

  currentY += 5.5;

  // ----------------------------------------------------
  // 3. SECTION 1: EXECUTIVE VALUE PROPOSITION (Safely Boxed)
  // ----------------------------------------------------
  const annualGrossFormatted = formatPdfCurrency(results.totalAnnualSavings, inputs.currency);
  const hoursSavedFormatted = Math.round(results.totalAnnualHoursSaved).toLocaleString('en-US');
  const paybackMonthsFormatted = results.paybackPeriodMonths.toFixed(1);
  const threeYrRoiFormatted = `+${Math.round(results.threeYearROI)}%`;
  const fiveYrRoiFormatted = `+${Math.round(results.fiveYearROI)}%`;

  const execNarrative = `Deploying the modern Hospital Management System (HMS) eliminates manual documentation delays, reduces billing claim denials, and prevents medication revenue leakage. For ${hospitalTitle}, this yields ${annualGrossFormatted} in annual gross financial gain while reclaiming ${hoursSavedFormatted} hours of clinical staff capacity. The capital investment reaches full self-funding breakeven in ${paybackMonthsFormatted} months, yielding an estimated 3-Year Net ROI of ${threeYrRoiFormatted} and 5-Year Cumulative Net ROI of ${fiveYrRoiFormatted}.`;

  // Measure split lines accurately with 8pt font
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  const textX = margin + 5;
  const textWidth = contentWidth - 10; // 172mm usable width (19 to 191mm)
  const splitNarrative = doc.splitTextToSize(execNarrative, textWidth);

  const lineHeight = 3.6;
  const boxInnerHeight = 6 + splitNarrative.length * lineHeight + 2.5;

  // Draw Background Box
  doc.setFillColor(bgSlate50[0], bgSlate50[1], bgSlate50[2]);
  doc.setDrawColor(slateBorder[0], slateBorder[1], slateBorder[2]);
  doc.roundedRect(margin, currentY, contentWidth, boxInnerHeight, 1.5, 1.5, 'FD');

  // Left Teal Accent Stripe
  doc.setFillColor(primaryTeal[0], primaryTeal[1], primaryTeal[2]);
  doc.roundedRect(margin, currentY, 1.8, boxInnerHeight, 0.8, 0.8, 'F');

  // Box Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(darkTeal[0], darkTeal[1], darkTeal[2]);
  doc.text('1. EXECUTIVE VALUE PROPOSITION', textX, currentY + 4.5);

  // Box Text
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
  doc.text(splitNarrative, textX, currentY + 8.5);

  currentY += boxInnerHeight + 4.5;

  // ----------------------------------------------------
  // 4. SECTION 2: CORE FINANCIAL PERFORMANCE CARDS (4-Up Grid)
  // ----------------------------------------------------
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(primaryDark[0], primaryDark[1], primaryDark[2]);
  doc.text('2. CORE FINANCIAL PERFORMANCE INDICATORS', margin, currentY);

  currentY += 2.8;
  const cardGap = 2.8;
  const cardWidth = (contentWidth - cardGap * 3) / 4; // ~43.4mm
  const cardHeight = 16.5;

  const kpis = [
    {
      title: 'ANNUAL GROSS SAVINGS',
      value: formatPdfCurrency(results.totalAnnualSavings, inputs.currency),
      sub: 'Recurring Annual Benefit',
      isPrimary: true,
    },
    {
      title: '3-YEAR CUMULATIVE ROI',
      value: `+${Math.round(results.threeYearROI)}%`,
      sub: `${formatPdfCurrency(results.threeYearNetSavings, inputs.currency, true)} Net Gain`,
      isPrimary: false,
    },
    {
      title: '5-YEAR LIFETIME ROI',
      value: `+${Math.round(results.fiveYearROI)}%`,
      sub: `${formatPdfCurrency(results.fiveYearNetSavings, inputs.currency, true)} Net Gain`,
      isPrimary: false,
    },
    {
      title: 'PAYBACK HORIZON',
      value: `${results.paybackPeriodMonths.toFixed(1)} Months`,
      sub: `${hoursSavedFormatted} hrs Reclaimed/yr`,
      isPrimary: false,
    },
  ];

  kpis.forEach((kpi, idx) => {
    const cardX = margin + idx * (cardWidth + cardGap);
    if (kpi.isPrimary) {
      doc.setFillColor(tealLight[0], tealLight[1], tealLight[2]);
      doc.setDrawColor(primaryTeal[0], primaryTeal[1], primaryTeal[2]);
    } else {
      doc.setFillColor(bgSlate50[0], bgSlate50[1], bgSlate50[2]);
      doc.setDrawColor(slateBorder[0], slateBorder[1], slateBorder[2]);
    }
    doc.roundedRect(cardX, currentY, cardWidth, cardHeight, 1.2, 1.2, 'FD');

    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6);
    doc.setTextColor(
      kpi.isPrimary ? darkTeal[0] : slateMuted[0],
      kpi.isPrimary ? darkTeal[1] : slateMuted[1],
      kpi.isPrimary ? darkTeal[2] : slateMuted[2]
    );
    doc.text(kpi.title, cardX + cardWidth / 2, currentY + 4, { align: 'center' });

    // Value
    doc.setFontSize(kpi.value.length > 12 ? 8 : 9.5);
    doc.setTextColor(
      kpi.isPrimary ? primaryTeal[0] : primaryDark[0],
      kpi.isPrimary ? primaryTeal[1] : primaryDark[1],
      kpi.isPrimary ? primaryTeal[2] : primaryDark[2]
    );
    doc.text(kpi.value, cardX + cardWidth / 2, currentY + 9.8, { align: 'center' });

    // Subtitle
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.8);
    doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
    doc.text(kpi.sub, cardX + cardWidth / 2, currentY + 13.8, { align: 'center' });
  });

  currentY += cardHeight + 4.5;

  // ----------------------------------------------------
  // 5. SECTION 3: WORKFLOW PILLAR BREAKDOWN TABLE
  // ----------------------------------------------------
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(primaryDark[0], primaryDark[1], primaryDark[2]);
  doc.text('3. OPERATIONAL WORKFLOW SAVINGS BREAKDOWN', margin, currentY);

  currentY += 2.8;

  const pCol1X = margin + 2.5;
  const pCol2X = margin + 46;
  const pCol3RightX = pageWidth - margin - 2.5; // 193.5mm

  // Header Row
  doc.setFillColor(primaryDark[0], primaryDark[1], primaryDark[2]);
  doc.rect(margin, currentY, contentWidth, 5.2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  doc.text('WORKFLOW PILLAR', pCol1X, currentY + 3.6);
  doc.text('AUTOMATION & OPERATIONAL IMPACT MECHANISM', pCol2X, currentY + 3.6);
  doc.text('ANNUAL GAIN', pCol3RightX, currentY + 3.6, { align: 'right' });

  currentY += 5.2;

  // Data Rows
  const rowHeight = 6.0;
  results.breakdownItems.forEach((item, index) => {
    if (index % 2 === 0) {
      doc.setFillColor(255, 255, 255);
    } else {
      doc.setFillColor(248, 250, 252);
    }
    doc.rect(margin, currentY, contentWidth, rowHeight, 'F');
    doc.setDrawColor(slateBorder[0], slateBorder[1], slateBorder[2]);
    doc.line(margin, currentY + rowHeight, pageWidth - margin, currentY + rowHeight);

    // Pillar Title (clamped)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.8);
    doc.setTextColor(primaryDark[0], primaryDark[1], primaryDark[2]);
    const cleanTitle = item.title.length > 26 ? item.title.substring(0, 24) + '...' : item.title;
    doc.text(cleanTitle, pCol1X, currentY + 4);

    // Description (clamped to fit 86mm space comfortably)
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.3);
    doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
    const cleanDesc = item.description.length > 68 ? item.description.substring(0, 65) + '...' : item.description;
    doc.text(cleanDesc, pCol2X, currentY + 4);

    // Annual Gain (Right Aligned)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(primaryTeal[0], primaryTeal[1], primaryTeal[2]);
    doc.text(formatPdfCurrency(item.annualSavings, inputs.currency), pCol3RightX, currentY + 4, {
      align: 'right',
    });

    currentY += rowHeight;
  });

  // Table Total Row
  doc.setFillColor(tealLight[0], tealLight[1], tealLight[2]);
  doc.rect(margin, currentY, contentWidth, 5.6, 'F');
  doc.setDrawColor(primaryTeal[0], primaryTeal[1], primaryTeal[2]);
  doc.rect(margin, currentY, contentWidth, 5.6, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.2);
  doc.setTextColor(primaryDark[0], primaryDark[1], primaryDark[2]);
  doc.text('TOTAL ANNUAL OPERATIONAL GAIN', pCol1X, currentY + 3.8);

  doc.setFontSize(7.8);
  doc.setTextColor(primaryTeal[0], primaryTeal[1], primaryTeal[2]);
  doc.text(formatPdfCurrency(results.totalAnnualSavings, inputs.currency), pCol3RightX, currentY + 3.8, {
    align: 'right',
  });

  currentY += 5.6 + 4.5;

  // ----------------------------------------------------
  // 6. SECTION 4: 5-YEAR CASH FLOW & RETURN SCHEDULE
  // ----------------------------------------------------
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(primaryDark[0], primaryDark[1], primaryDark[2]);
  doc.text('4. 5-YEAR CASH FLOW & RETURN SCHEDULE', margin, currentY);

  currentY += 2.8;

  // Exact Right-Aligned Target X Coordinates (in mm)
  // Margin starts at 14, Content ends at 196
  // Col 1 (Timeline): left at 16.5
  // Col 2 (Gross): right at 68
  // Col 3 (Cost): right at 98
  // Col 4 (Annual Net): right at 128
  // Col 5 (Cumul Net): right at 162
  // Col 6 (Cumul ROI): right at 193.5
  const cfColGrossX = margin + 54; // 68mm
  const cfColCostX = margin + 84; // 98mm
  const cfColNetX = margin + 114; // 128mm
  const cfColCumulX = margin + 148; // 162mm
  const cfColRoiX = pageWidth - margin - 2.5; // 193.5mm

  // Schedule Header Row
  doc.setFillColor(primaryDark[0], primaryDark[1], primaryDark[2]);
  doc.rect(margin, currentY, contentWidth, 5.2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.text('TIMELINE MILESTONE', margin + 2.5, currentY + 3.6);
  doc.text('GROSS SAVINGS', cfColGrossX, currentY + 3.6, { align: 'right' });
  doc.text('HMS TECH SPEND', cfColCostX, currentY + 3.6, { align: 'right' });
  doc.text('ANNUAL NET', cfColNetX, currentY + 3.6, { align: 'right' });
  doc.text('CUMULATIVE NET', cfColCumulX, currentY + 3.6, { align: 'right' });
  doc.text('CUMULATIVE ROI', cfColRoiX, currentY + 3.6, { align: 'right' });

  currentY += 5.2;

  // Schedule Data Rows
  const cfRowHeight = 5.2;
  results.yearProjections.forEach((p, idx) => {
    if (idx % 2 === 0) {
      doc.setFillColor(255, 255, 255);
    } else {
      doc.setFillColor(248, 250, 252);
    }
    doc.rect(margin, currentY, contentWidth, cfRowHeight, 'F');
    doc.setDrawColor(slateBorder[0], slateBorder[1], slateBorder[2]);
    doc.line(margin, currentY + cfRowHeight, pageWidth - margin, currentY + cfRowHeight);

    // Timeline Milestone
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.8);
    doc.setTextColor(primaryDark[0], primaryDark[1], primaryDark[2]);
    doc.text(`Year ${p.year}`, margin + 2.5, currentY + 3.6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.8);
    doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
    const cleanMilestone = p.milestone.length > 20 ? p.milestone.substring(0, 18) + '...' : p.milestone;
    doc.text(`(${cleanMilestone})`, margin + 12, currentY + 3.6);

    // Numbers (Right Aligned)
    doc.setFontSize(6.5);
    doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
    doc.text(formatPdfCurrency(p.grossSavings, inputs.currency, true), cfColGrossX, currentY + 3.6, { align: 'right' });
    doc.text(formatPdfCurrency(p.hmsCosts, inputs.currency, true), cfColCostX, currentY + 3.6, { align: 'right' });

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(emeraldGreen[0], emeraldGreen[1], emeraldGreen[2]);
    doc.text(`+${formatPdfCurrency(p.netBenefit, inputs.currency, true)}`, cfColNetX, currentY + 3.6, { align: 'right' });

    doc.setTextColor(primaryTeal[0], primaryTeal[1], primaryTeal[2]);
    doc.text(`+${formatPdfCurrency(p.cumulativeNetBenefit, inputs.currency, true)}`, cfColCumulX, currentY + 3.6, { align: 'right' });

    doc.setTextColor(primaryDark[0], primaryDark[1], primaryDark[2]);
    doc.text(`+${Math.round(p.roiPercentage)}%`, cfColRoiX, currentY + 3.6, { align: 'right' });

    currentY += cfRowHeight;
  });

  // 5-Year Totals Line
  doc.setFillColor(tealLight[0], tealLight[1], tealLight[2]);
  doc.rect(margin, currentY, contentWidth, 5.2, 'F');
  doc.setDrawColor(primaryTeal[0], primaryTeal[1], primaryTeal[2]);
  doc.rect(margin, currentY, contentWidth, 5.2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  doc.setTextColor(primaryDark[0], primaryDark[1], primaryDark[2]);
  doc.text('5-YEAR LIFETIME TOTAL', margin + 2.5, currentY + 3.6);

  doc.setFontSize(6.6);
  doc.text(formatPdfCurrency(results.fiveYearGrossSavings, inputs.currency, true), cfColGrossX, currentY + 3.6, { align: 'right' });
  doc.text(formatPdfCurrency(results.fiveYearTotalCost, inputs.currency, true), cfColCostX, currentY + 3.6, { align: 'right' });
  doc.setTextColor(emeraldGreen[0], emeraldGreen[1], emeraldGreen[2]);
  doc.text(`+${formatPdfCurrency(results.fiveYearNetSavings, inputs.currency, true)}`, cfColNetX, currentY + 3.6, { align: 'right' });
  doc.setTextColor(primaryTeal[0], primaryTeal[1], primaryTeal[2]);
  doc.text(`+${formatPdfCurrency(results.fiveYearNetSavings, inputs.currency, true)}`, cfColCumulX, currentY + 3.6, { align: 'right' });
  doc.setTextColor(primaryDark[0], primaryDark[1], primaryDark[2]);
  doc.text(`+${Math.round(results.fiveYearROI)}%`, cfColRoiX, currentY + 3.6, { align: 'right' });

  currentY += 5.2 + 5;

  // ----------------------------------------------------
  // 7. SECTION 5: EXECUTIVE SIGNATURE BLOCKS
  // ----------------------------------------------------
  doc.setDrawColor(slateBorder[0], slateBorder[1], slateBorder[2]);
  doc.line(margin, currentY, pageWidth - margin, currentY);

  currentY += 4;
  const sigColW = contentWidth / 2;

  // Left Column
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.2);
  doc.setTextColor(primaryDark[0], primaryDark[1], primaryDark[2]);
  doc.text('Prepared by: HMS Solutions Lead', margin, currentY);

  doc.setDrawColor(slateMuted[0], slateMuted[1], slateMuted[2]);
  doc.line(margin, currentY + 8.5, margin + 48, currentY + 8.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.2);
  doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
  doc.text('Enterprise Health Informatics & Transformation Advisory', margin, currentY + 12);

  // Right Column
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.2);
  doc.setTextColor(primaryDark[0], primaryDark[1], primaryDark[2]);
  doc.text('Reviewed & Endorsed by:', margin + sigColW, currentY);

  doc.setDrawColor(slateMuted[0], slateMuted[1], slateMuted[2]);
  doc.line(margin + sigColW, currentY + 8.5, margin + sigColW + 48, currentY + 8.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.2);
  doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
  doc.text('Chief Financial Officer / Managing Director', margin + sigColW, currentY + 12);

  // ----------------------------------------------------
  // 8. FOOTER DISCLAIMER & PAGINATION
  // ----------------------------------------------------
  const footerY = pageHeight - 7;
  doc.setDrawColor(slateBorder[0], slateBorder[1], slateBorder[2]);
  doc.line(margin, footerY - 2.5, pageWidth - margin, footerY - 2.5);

  doc.setFontSize(5.8);
  doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
  doc.text(
    'CONFIDENTIAL & PROPRIETARY — Generated via Hospital Management System (HMS) ROI & Value Decision Support Engine.',
    margin,
    footerY
  );
  doc.text('Page 1 of 1', pageWidth - margin, footerY, { align: 'right' });

  // Save the PDF
  const sanitizedName = (inputs.hospitalName || 'Health_System')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .substring(0, 30);
  const fileName = `HMS_ROI_Business_Case_${sanitizedName}_${dateStr.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;

  doc.save(fileName);
}
