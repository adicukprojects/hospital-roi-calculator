import { useState } from 'react';
import {
  X,
  BookmarkCheck,
  Trash2,
  FolderOpen,
  Plus,
  Building2,
  Clock,
  ArrowRightLeft,
  CheckSquare,
  Square,
} from 'lucide-react';
import { HospitalInputs, SavedProposal, ScenarioPreset } from '../types';
import { formatCurrency } from '../utils/calculations';

interface SavedProposalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedProposals: SavedProposal[];
  onLoadProposal: (proposal: SavedProposal) => void;
  onSaveCurrentProposal: (name?: string) => void;
  onDeleteProposal: (id: string) => void;
  onCompareProposals: (proposalA: SavedProposal, proposalB: SavedProposal) => void;
  currentInputs: HospitalInputs;
  currentScenario: ScenarioPreset;
  currentAnnualSavings: number;
  currentROI: number;
}

export function SavedProposalsModal({
  isOpen,
  onClose,
  savedProposals,
  onLoadProposal,
  onSaveCurrentProposal,
  onDeleteProposal,
  onCompareProposals,
  currentInputs,
  currentScenario,
  currentAnnualSavings,
  currentROI,
}: SavedProposalsModalProps) {
  const [dealName, setDealName] = useState(
    currentInputs.hospitalName || 'Prospective Health Deal'
  );
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveCurrentProposal(dealName.trim() || 'Untitled Proposal');
  };

  const toggleSelectForCompare = (id: string) => {
    setSelectedForCompare((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 2) {
        // Keep the second one and add new one
        return [prev[1], id];
      }
      return [...prev, id];
    });
  };

  const handleLaunchCompare = () => {
    if (selectedForCompare.length === 2) {
      const propA = savedProposals.find((p) => p.id === selectedForCompare[0]);
      const propB = savedProposals.find((p) => p.id === selectedForCompare[1]);
      if (propA && propB) {
        onCompareProposals(propA, propB);
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <BookmarkCheck className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-sm font-bold">Saved Hospital Deals & Scenarios</h2>
              <p className="text-[11px] text-slate-400">
                Store multiple hospital business cases locally for quick field recall
              </p>
            </div>
          </div>
          <button
            id="close-saved-deals-modal-btn"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
          {/* Quick Save Current View */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <h3 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-teal-600" />
              <span>Save Current Calculation to Portfolio</span>
            </h3>

            <div className="flex gap-2">
              <input
                id="save-deal-name-input"
                type="text"
                value={dealName}
                onChange={(e) => setDealName(e.target.value)}
                placeholder="Deal label (e.g., St. Jude Regional 250-bed Case)"
                className="flex-1 text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 focus:border-teal-500 focus:outline-none"
              />
              <button
                id="save-current-deal-btn"
                onClick={handleSave}
                className="bg-teal-600 hover:bg-teal-500 text-white font-semibold px-4 py-2 rounded-lg text-xs transition-colors shrink-0 flex items-center gap-1.5"
              >
                <BookmarkCheck className="w-3.5 h-3.5" />
                <span>Save Deal</span>
              </button>
            </div>
            <div className="text-[11px] text-slate-500 flex items-center gap-2">
              <span>Current snapshot:</span>
              <span className="font-semibold text-slate-700">
                {currentInputs.bedCount} beds • {formatCurrency(currentAnnualSavings, currentInputs.currency)}/yr savings • +{Math.round(currentROI)}% ROI
              </span>
            </div>
          </div>

          {/* List of Saved Deals */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wide">
                Saved Prospect Portfolio ({savedProposals.length})
              </h3>
              {savedProposals.length >= 2 && (
                <span className="text-[11px] text-slate-500">
                  Select any 2 to compare side-by-side
                </span>
              )}
            </div>

            {/* Comparison Bar if 1 or 2 are selected */}
            {selectedForCompare.length > 0 && (
              <div className="bg-teal-50 border border-teal-200 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-2.5">
                <div className="flex items-center gap-2 text-xs text-teal-900 font-medium">
                  <ArrowRightLeft className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>
                    Selected for comparison:{' '}
                    <strong className="font-bold">{selectedForCompare.length} of 2</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedForCompare([])}
                    className="text-[11px] text-slate-600 hover:text-slate-900 px-2 py-1"
                  >
                    Clear selection
                  </button>
                  <button
                    id="compare-two-proposals-btn"
                    disabled={selectedForCompare.length !== 2}
                    onClick={handleLaunchCompare}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      selectedForCompare.length === 2
                        ? 'bg-teal-600 hover:bg-teal-500 text-white shadow-xs cursor-pointer'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5" />
                    <span>View Financial Comparison</span>
                  </button>
                </div>
              </div>
            )}

            {savedProposals.length === 0 ? (
              <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <Building2 className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-500" />
                <p className="font-medium text-xs">No saved hospital proposals yet.</p>
                <p className="text-[11px]">
                  Configure your hospital metrics above and click "Save Deal" to bookmark for client meetings.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                {savedProposals.map((item) => {
                  const isSelected = selectedForCompare.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      className={`p-3.5 bg-white border rounded-xl flex items-center justify-between gap-3 transition-all shadow-2xs ${
                        isSelected
                          ? 'border-teal-500 bg-teal-50/20 ring-1 ring-teal-500/30'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {/* Checkbox for Comparison selection */}
                      <button
                        onClick={() => toggleSelectForCompare(item.id)}
                        className="text-slate-400 hover:text-teal-600 p-1 shrink-0 transition-colors"
                        title={isSelected ? 'Deselect from comparison' : 'Select for side-by-side comparison'}
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-teal-600" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-300 hover:text-slate-500" />
                        )}
                      </button>

                      <div className="space-y-0.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-xs truncate">
                            {item.hospitalName}
                          </span>
                          <span className="text-[10px] uppercase font-bold text-teal-700 bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200">
                            {item.scenario}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                          <span>{item.bedCount} Beds</span>
                          <span>•</span>
                          <span className="font-semibold text-teal-700">
                            {formatCurrency(item.totalAnnualSavings, item.currency)}/yr
                          </span>
                          <span>•</span>
                          <span className="text-slate-600">+{Math.round(item.threeYearROI)}% ROI</span>
                          <span>•</span>
                          <span className="text-slate-400 text-[10px]">
                            {new Date(item.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => {
                            onLoadProposal(item);
                            onClose();
                          }}
                          title="Load this proposal into calculator"
                          className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <FolderOpen className="w-3.5 h-3.5 text-teal-600" />
                          <span>Load</span>
                        </button>
                        <button
                          onClick={() => onDeleteProposal(item.id)}
                          title="Delete proposal"
                          className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
