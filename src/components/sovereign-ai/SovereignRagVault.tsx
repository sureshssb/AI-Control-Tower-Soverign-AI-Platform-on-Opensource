import React, { useState } from 'react';
import { RagIndex, EditionType } from '../../types/platform';
import { 
  Database, FileText, Lock, Plus, Search, CheckCircle2, 
  HardDrive, Upload, RefreshCw, KeyRound, ShieldCheck 
} from 'lucide-react';

interface SovereignRagVaultProps {
  indexes: RagIndex[];
  onAddIndex: (newIndex: RagIndex) => void;
  currentEdition: EditionType;
}

export const SovereignRagVault: React.FC<SovereignRagVaultProps> = ({
  indexes,
  onAddIndex,
  currentEdition,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isIngesting, setIsIngesting] = useState(false);
  const [ingestSuccess, setIngestSuccess] = useState(false);
  const [sampleDocTitle, setSampleDocTitle] = useState('Defense_Perimeter_Architecture_2026_v4.pdf');
  const [selectedVault, setSelectedVault] = useState<string>(indexes[0]?.id || '');

  const filteredIndexes = indexes.filter(
    (idx) => idx.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             idx.collection.toLowerCase().includes(searchTerm.toLowerCase()) ||
             idx.vectorDb.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSimulateIngest = (e: React.FormEvent) => {
    e.preventDefault();
    setIsIngesting(true);
    setIngestSuccess(false);

    setTimeout(() => {
      setIsIngesting(false);
      setIngestSuccess(true);
      setTimeout(() => setIngestSuccess(false), 3500);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-xl p-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" />
            Sovereign Air-Gapped RAG Vault
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Zero-data-leakage vector databases running completely offline with local embedding models and hardware encryption.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search collections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>
        </div>
      </div>

      {/* Vector Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredIndexes.map((idx) => {
          const isUnlocked = currentEdition === 'sovereign' ||
                            (currentEdition === 'enterprise' && idx.minEdition !== 'sovereign') ||
                            idx.minEdition === 'community';

          return (
            <div
              key={idx.id}
              className={`p-4 rounded-xl border transition-all ${
                isUnlocked
                  ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  : 'bg-slate-950/40 border-slate-800/40 opacity-70'
              }`}
            >
              <div className="flex items-start justify-between gap-3 border-b border-slate-800/80 pb-3 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{idx.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-cyan-300 border border-slate-800">
                      {idx.vectorDb}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                    Collection: {idx.collection}
                  </div>
                </div>

                <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                  idx.encryption === 'Hardware TPM Sealed'
                    ? 'bg-amber-950/70 text-amber-300 border border-amber-800/60'
                    : 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/60'
                }`}>
                  {idx.encryption}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 text-[11px]">Indexed Documents:</span>
                  <div className="font-mono text-slate-200 font-semibold tabular-nums mt-0.5">
                    {idx.documentsCount.toLocaleString()} docs
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 text-[11px]">Vector Embeddings:</span>
                  <div className="font-mono text-slate-200 font-semibold tabular-nums mt-0.5">
                    {idx.vectorsCount.toLocaleString()} chunks
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 text-[11px]">Embedding Model:</span>
                  <div className="font-mono text-[11px] text-cyan-400 truncate mt-0.5">
                    {idx.embeddingModel}
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 text-[11px]">Isolation Level:</span>
                  <div className="text-[11px] text-slate-300 mt-0.5">
                    {idx.isolationLevel}
                  </div>
                </div>
              </div>

              {!isUnlocked && (
                <div className="mt-3 pt-2 border-t border-slate-800/60 text-right">
                  <span className="text-[10px] font-mono text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-800/40">
                    Unlock with {idx.minEdition} Edition
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Interactive Document Chunking & Ingestion Simulator */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
          <Upload className="w-4 h-4 text-emerald-400" />
          Air-Gapped Ingestion & Chunking Pipeline Tester
        </h4>
        <p className="text-xs text-slate-400 mb-4">
          Simulate offline indexing of classified or private enterprise documents with local embeddings and zero egress.
        </p>

        <form onSubmit={handleSimulateIngest} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Document Name / Archive
              </label>
              <input
                type="text"
                value={sampleDocTitle}
                onChange={(e) => setSampleDocTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Target Sovereign Vector Collection
              </label>
              <select
                value={selectedVault}
                onChange={(e) => setSelectedVault(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500 font-mono cursor-pointer"
              >
                {indexes.map((idx) => (
                  <option key={idx.id} value={idx.id}>
                    {idx.name} ({idx.vectorDb})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-mono text-slate-400">
              Pipeline: PDF Parser → Token Chunk (512 tokens) → BGE-M3 (Local FP16) → Hardware TPM Seal
            </span>

            <button
              type="submit"
              disabled={isIngesting}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {isIngesting ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5" />
              )}
              <span>{isIngesting ? 'Chunking & Sealing...' : 'Ingest Document Offline'}</span>
            </button>
          </div>
        </form>

        {ingestSuccess && (
          <div className="mt-4 p-3 rounded-lg bg-emerald-950/70 border border-emerald-800 text-xs text-emerald-300 font-mono flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Document successfully parsed into 128 chunks and sealed into Qdrant Airgap Vault with zero network egress.</span>
            </div>
            <span className="text-[10px] text-emerald-400">0 Bytes Egress Verified</span>
          </div>
        )}
      </div>
    </div>
  );
};
