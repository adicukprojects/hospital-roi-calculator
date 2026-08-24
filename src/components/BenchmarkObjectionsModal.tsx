import { X, ShieldCheck, BookOpen, MessageSquare, ExternalLink, HelpCircle } from 'lucide-react';
import { INDUSTRY_BENCHMARKS, OBJECTION_HANDLINGS } from '../data/benchmarks';
import { CalculationResults } from '../types';

interface BenchmarkObjectionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  results: CalculationResults;
}

export function BenchmarkObjectionsModal({
  isOpen,
  onClose,
  results,
}: BenchmarkObjectionsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-teal-400" />
            <div>
              <h2 className="text-sm font-bold">CFO Defense & Industry Benchmarks</h2>
              <p className="text-[11px] text-slate-400">
                Peer-reviewed research and boardroom battlecards for the sales rep
              </p>
            </div>
          </div>
          <button
            id="close-benchmarks-modal-btn"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-6 text-xs text-slate-700">
          {/* Section 1: Objection Handling Battlecards */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wide">
              <MessageSquare className="w-4 h-4 text-teal-600" />
              <span>Boardroom Objection Handling & Talk Tracks</span>
            </div>

            <div className="space-y-3">
              {OBJECTION_HANDLINGS.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">
                      {item.objection}
                    </span>
                    <span className="text-[10px] font-bold text-slate-600 bg-slate-200 px-2 py-0.5 rounded">
                      {item.stakeholder}
                    </span>
                  </div>
                  <p className="text-slate-700 leading-relaxed text-[11px] bg-white p-3 rounded-lg border border-slate-200/80">
                    <strong className="text-teal-700">Recommended Response: </strong>
                    {item.talkingPoint.replace(
                      '{payback}',
                      results.paybackPeriodMonths.toFixed(1)
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Defensible Research Citations */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wide">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>Healthcare Industry Benchmarks & Research Sources</span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {INDUSTRY_BENCHMARKS.map((b, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-1 shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">{b.metric}</span>
                    <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      {b.source}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{b.finding}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Methodology Disclosure */}
          <div className="bg-slate-100 p-4 rounded-xl text-[11px] text-slate-600 space-y-1 border border-slate-200">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <HelpCircle className="w-3.5 h-3.5 text-teal-600" />
              <span>Deterministic Financial Calculation Methodology</span>
            </div>
            <p>
              All savings models run on client-side deterministic algorithms grounded in hospital staffing volume, bed turnover rates, and verifiable billing parameters. No fictitious or inflated metrics are used.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
