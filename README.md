# HMS ROI Navigator

Interactive, client-side ROI and business-case calculator for Hospital Management System (HMS) sales — model hospital-specific savings, generate boardroom-ready PDF proposals, and manage a portfolio of client deals, all without a backend or database.

## Overview

HMS ROI Navigator turns a hospital's operational and financial parameters (bed count, OPD volume, occupancy, claim denial rates, staffing, and more) into a full 5-year ROI model with three adoption scenarios, a departmental savings breakdown, and a one-click executive PDF export. It runs entirely in the browser — no server, no external database — with proposals persisted locally so a sales rep can build, compare, and export hospital-specific business cases directly from a laptop in the field.

## Features

### Hospital financial & operational input engine
- Real-time sliders and inputs for licensed bed count (25–1,000+), daily OPD volume, inpatient occupancy, and nursing/admin FTEs
- Configurable pricing parameters: daily inpatient charges, annual claim volume, denial rates, pharmacy inventory value, and HMS subscription/onboarding costs
- Multi-currency support (USD, CAD, and others) with instant conversion and formatting
- One-click hospital profile presets: 50-bed community clinic, 150-bed community hospital, 250-bed regional medical center, 500-bed tertiary/teaching hospital

### 3-tier scenario modeling
- **Conservative** — low adoption ramp, baseline automation, for risk-averse CFO evaluations
- **Moderate** — industry-average efficiency gains and standard workflow adoption
- **Aggressive** — maximum digital transformation capture across all workflows

### Executive KPI dashboard
- Annual gross savings across all operational departments
- Net 3-year and 5-year ROI (%)
- Payback / breakeven horizon (month-level)
- Clinical and administrative labor hours reclaimed, with FTE capacity equivalents

### Departmental savings breakdown
Interactive, categorized breakdown across:
- Administrative & billing automation
- Clinical & nursing documentation
- Insurance claim denial prevention
- Bed turnaround & length of stay (LOS)
- Pharmacy dispensing & revenue leakage
- Outpatient retention & no-show recovery

### 5-year cumulative ROI & cash flow visualization
- ROI % curve with a 100% breakeven reference line
- Cash flow view: cumulative net benefit vs. gross savings vs. tech spend
- Dual-axis view combining dollar values and ROI %
- Interactive tooltips with phase-level milestones
- Toggle between chart, financial ledger table, or combined view

### Side-by-side proposal comparison
- Compare any two saved hospital proposals
- Variance callouts for annual savings, 3-/5-year net economic delta, payback acceleration, and staff time reclaimed
- One-click "edit in calculator" to reload a saved scenario into the active workspace

### Proposal portfolio & deal management
- Save client configurations to a local deal portfolio
- Quick load, delete, and multi-select for comparison, with timestamps and summary metrics

### Boardroom-ready PDF export
- Vector-sharp, single-page A4 executive business case PDF
- Hospital header, facility scope, and timestamp
- Executive narrative and breakeven summary
- 4-up financial KPI cards, workflow savings table, and 5-year cash flow schedule
- Dual signature blocks (HMS solutions lead / CFO review)
- Encoding-safe currency formatting across global currencies

### Benchmark & objection handling module
- Interactive reference guide with industry evidence and clinical research citations
- CFO-ready talking points for common HMS evaluation objections

## Tech stack

| Layer | Technology |
|---|---|
| Frontend framework | React 18 + TypeScript (strict mode) |
| Build tooling | Vite |
| Styling | Tailwind CSS (Slate & Deep Teal healthcare palette) |
| Data visualization | Recharts |
| Icons | Lucide React |
| PDF generation | jsPDF |
| Persistence | Browser `localStorage` (no backend, no database) |

## Getting started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
git clone https://github.com/<your-org>/hms-roi-navigator.git
cd hms-roi-navigator
npm install
```

### Development
```bash
npm run dev
```

### Production build
```bash
npm run build
npm run preview
```

## Project structure
```
hms-roi-navigator/
├── src/
│   ├── components/       # UI components (inputs, KPI cards, charts, PDF export)
│   ├── scenarios/        # Conservative / moderate / aggressive scenario logic
│   ├── presets/           # Hospital profile presets
│   ├── utils/             # ROI calculations, currency formatting, PDF layout
│   └── App.tsx
├── public/
├── index.html
├── tailwind.config.ts
├── vite.config.ts
└── package.json
```

## Data & privacy
All proposal data is stored client-side in the browser's `localStorage`. Nothing is transmitted to an external server — proposals live only on the device where they were created.

## License
MIT — see [LICENSE](LICENSE) for details.

Copyright © 2026 Udayakumar Mani (Adi)

## Contributing
Issues and pull requests are welcome. For significant changes, please open an issue first to discuss what you'd like to change.
