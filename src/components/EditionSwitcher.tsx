import React from 'react';
import { EditionType } from '../types/platform';
import { EDITION_DETAILS } from '../data/initialData';
import { ShieldCheck, Lock, Unlock, ArrowRight, Info, CheckCircle2 } from 'lucide-react';

interface EditionSwitcherProps {
  currentEdition: EditionType;
  setCurrentEdition: (edition: EditionType) => void;
  onExploreEditions: () => void;
}

export const EditionSwitcher: React.FC<EditionSwitcherProps> = ({
  currentEdition,
  setCurrentEdition,
  onExploreEditions,
}) => {
  const current = EDITION_DETAILS[currentEdition];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 lg:p-5 shadow-lg relative overflow-hidden">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Current Edition Status */}
        <div className="flex items-start sm:items-center gap-3">
          <div className={`p-2.5 rounded-lg shrink-0 ${
            currentEdition === 'sovereign'
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
              : currentEdition === 'enterprise'
              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
          }`}>
            <ShieldCheck className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs uppercase tracking-wider font-mono text-slate-400">
                Active Deployment Edition:
              </span>
              <span className={`text-sm font-bold px-2 py-0.5 rounded-md ${
                currentEdition === 'sovereign'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : currentEdition === 'enterprise'
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}>
                {current.title}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {current.badge}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              {current.keyDifferentiator}
            </p>
          </div>
        </div>

        {/* Right: Edition Switching Pipeline */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <span className="text-xs text-slate-400 mr-1 hidden sm:inline">Simulate Edition:</span>
          
          <div className="inline-flex rounded-lg bg-slate-950 p-1 border border-slate-800">
            {(['community', 'enterprise', 'sovereign'] as EditionType[]).map((edition) => {
              const details = EDITION_DETAILS[edition];
              const isSelected = currentEdition === edition;
              return (
                <button
                  key={edition}
                  onClick={() => setCurrentEdition(edition)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    isSelected
                      ? edition === 'sovereign'
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                        : edition === 'enterprise'
                        ? 'bg-blue-600 text-white font-bold shadow-sm'
                        : 'bg-slate-700 text-white font-bold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {isSelected ? <CheckCircle2 className="w-3.5 h-3.5" /> : null}
                  {details.title.replace(' Edition', '')}
                </button>
              );
            })}
          </div>

          <button
            onClick={onExploreEditions}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 px-2.5 py-1.5 rounded-md hover:bg-slate-800/60 transition-colors cursor-pointer"
          >
            <span>Compare Matrix</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Progressive Unlocking Banner Footnote */}
      <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400 flex-wrap gap-2">
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>
            Single Core Architecture: <span className="text-slate-200 font-medium">Community → Enterprise → Sovereign</span> unlock capabilities without code rebuilds.
          </span>
        </div>
        <div className="text-[11px] font-mono text-slate-400">
          Core Engine: <span className="text-slate-300">vLLM + Control Plane gRPC Bus</span>
        </div>
      </div>
    </div>
  );
};
