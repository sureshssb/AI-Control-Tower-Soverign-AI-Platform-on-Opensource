import React from 'react';
import { ProductPlane, EditionType } from '../types/platform';
import { Shield, Server, Network, Layers, Terminal, Sparkles } from 'lucide-react';

interface HeaderProps {
  activePlane: ProductPlane;
  setActivePlane: (plane: ProductPlane) => void;
  currentEdition: EditionType;
  setCurrentEdition: (edition: EditionType) => void;
  onOpenDeployModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activePlane,
  setActivePlane,
  currentEdition,
  setCurrentEdition,
  onOpenDeployModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Top Bar Contract: Single text element wordmark) */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-sm shadow-cyan-500/20">
            <Shield className="w-4 h-4" />
          </div>
          <button
            onClick={() => setActivePlane('architecture')}
            className="text-left group cursor-pointer"
          >
            <div className="text-base font-bold tracking-tight text-white group-hover:text-cyan-400 transition-colors whitespace-nowrap">
              Open Sovereign AI
            </div>
            <div className="text-[10px] text-slate-400 -mt-0.5 tracking-wider font-mono">
              CONTROL PLATFORM
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links (4-5 single-line clean text links with subtle hover underlines) */}
        <nav className="hidden md:flex items-center gap-6 text-xs lg:text-sm font-medium text-slate-300">
          <button
            onClick={() => setActivePlane('control-tower')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer flex items-center gap-1.5 ${
              activePlane === 'control-tower'
                ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400'
                : 'hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            AI Control Tower
          </button>

          <button
            onClick={() => setActivePlane('sovereign-ai')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer flex items-center gap-1.5 ${
              activePlane === 'sovereign-ai'
                ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400'
                : 'hover:text-white'
            }`}
          >
            <Server className="w-3.5 h-3.5 text-emerald-400" />
            Sovereign AI Platform
          </button>

          <button
            onClick={() => setActivePlane('architecture')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer flex items-center gap-1.5 ${
              activePlane === 'architecture'
                ? 'text-indigo-400 font-semibold border-b-2 border-indigo-400'
                : 'hover:text-white'
            }`}
          >
            <Network className="w-3.5 h-3.5 text-indigo-400" />
            Dual-Plane Architecture
          </button>

          <button
            onClick={() => setActivePlane('editions')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer flex items-center gap-1.5 ${
              activePlane === 'editions'
                ? 'text-amber-400 font-semibold border-b-2 border-amber-400'
                : 'hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            Commercial Editions
          </button>

          <button
            onClick={() => setActivePlane('manifests')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer flex items-center gap-1.5 ${
              activePlane === 'manifests'
                ? 'text-slate-100 font-semibold border-b-2 border-slate-100'
                : 'hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-slate-400" />
            Deploy Manifests
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action & Edition Trigger */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Segmented Edition Indicator & Selector */}
          <div className="hidden sm:flex items-center p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-medium">
            <button
              onClick={() => setCurrentEdition('community')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                currentEdition === 'community'
                  ? 'bg-slate-800 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Community Edition (Apache 2.0 Open Source)"
            >
              Community
            </button>
            <button
              onClick={() => setCurrentEdition('enterprise')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                currentEdition === 'enterprise'
                  ? 'bg-blue-900/60 text-blue-200 font-semibold shadow-sm border border-blue-700/50'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Enterprise Commercial Edition"
            >
              Enterprise
            </button>
            <button
              onClick={() => setCurrentEdition('sovereign')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                currentEdition === 'sovereign'
                  ? 'bg-amber-950/60 text-amber-200 font-semibold shadow-sm border border-amber-700/50'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Sovereign Defense & Air-Gap Edition"
            >
              Sovereign
            </button>
          </div>

          <button
            onClick={onOpenDeployModal}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-lg shadow-sm shadow-cyan-900/40 transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Launch Stack
          </button>
        </div>
      </div>
    </header>
  );
};
