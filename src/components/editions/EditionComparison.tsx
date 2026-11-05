import React from 'react';
import { EditionType } from '../../types/platform';
import { EDITION_DETAILS } from '../../data/initialData';
import { 
  Check, X, Shield, Lock, ArrowRight, Zap, Layers, 
  HelpCircle, Sparkles, Server, CheckCircle2 
} from 'lucide-react';

interface EditionComparisonProps {
  currentEdition: EditionType;
  setCurrentEdition: (edition: EditionType) => void;
}

export const EditionComparison: React.FC<EditionComparisonProps> = ({
  currentEdition,
  setCurrentEdition,
}) => {
  const comparisonFeatures = [
    {
      category: 'Dual-Plane Architectural Core',
      items: [
        { name: 'AI Control Tower (Control Plane)', comm: 'Included (Single Cluster)', ent: 'Included (Multi-Cluster)', sov: 'Included (Air-Gap Sovereign)' },
        { name: 'Sovereign AI Platform (Data Plane)', comm: 'Included (Local/Docker)', ent: 'Included (VPC/Hybrid)', sov: 'Included (Bare-Metal Air-Gap)' },
        { name: 'Model Serving Engine', comm: 'vLLM, Ollama', ent: 'vLLM, TensorRT-LLM (HA)', sov: 'vLLM, TensorRT (TPM Sealed)' },
        { name: 'Deployment Target', comm: 'Local / Single Node K8s', commNote: 'Apache 2.0', ent: 'Multi-Cloud & Hybrid K8s', sov: '100% Air-Gapped Bare Metal' },
      ],
    },
    {
      category: 'Control Tower: Governance & Security',
      items: [
        { name: 'Model Inventory & Registry', comm: 'Basic Catalog', ent: 'Multi-Region Registry', sov: 'Hardware-Signed Weight Registry' },
        { name: 'Policy & Guardrail Engine', comm: 'Standard Regex / Keywords', ent: 'Semantic DLP Embeddings', sov: 'Geofenced Sovereign Diode' },
        { name: 'EU AI Act Risk Categorization', comm: 'Manual tagging', ent: 'Automated Annex III Packs', sov: 'Forensic Audit Certifications' },
        { name: 'Audit Trail Storage', comm: 'Local Postgres / SQLite', ent: 'Centralized WORM Storage', sov: 'Hardware TPM Cryptographic Ledger' },
        { name: 'Identity & Access Control', comm: 'Basic RBAC (Admin/Viewer)', ent: 'SSO / SAML 2.0 / OIDC', sov: 'Multi-Party CAC/PKI Enclave' },
      ],
    },
    {
      category: 'Sovereign AI: Data Plane & Infrastructure',
      items: [
        { name: 'GPU Cluster Orchestration', comm: 'Single Node / Bare Metal', ent: 'Multi-Node HA Autoscaler', sov: 'InfiniBand Air-Gap Vaults' },
        { name: 'Vector Store Connectors (RAG)', comm: 'Chroma, Local Qdrant', ent: 'Milvus Cluster, Qdrant VPC', sov: 'Air-Gap TPM Encrypted Vaults' },
        { name: 'Agent Runtime Sandboxing', comm: 'Process Namespaces', ent: 'Docker gVisor VPC Policy', sov: 'Hardware Hypervisor MicroVMs' },
        { name: 'Confidential Computing Support', comm: 'No', ent: 'Optional Cloud Enclaves', sov: 'Native AMD SEV-SNP & Intel TDX' },
        { name: 'Software & Weight Updates', comm: 'Docker Pull / Git', ent: 'Enterprise Registry CI/CD', sov: 'Cryptographically Verified Air-Gap Media' },
      ],
    },
  ];

  return (
    <div className="space-y-8">
      {/* Strategic Architectural Thesis Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-900/40 rounded-xl p-6">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
              Commercial Architecture
            </span>
            <span className="text-xs text-slate-400 font-mono">
              One Core Codebase → Three Commercial Editions
            </span>
          </div>

          <h2 className="text-xl font-bold text-white mt-2 tracking-tight">
            Single Open-Source Foundation with Progressive Capability Unlocking
          </h2>

          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            Rather than building three fragmented products, the <strong className="text-white">Open Sovereign AI Control Platform</strong> delivers a unified architecture: <strong className="text-cyan-400">Community → Enterprise → Sovereign</strong>. Teams start instantly on open source (Apache 2.0) and progressively unlock enterprise governance or national sovereign air-gap isolation via entitlement configuration without rebuilding their core AI pipeline.
          </p>
        </div>
      </div>

      {/* 3 Commercial Edition Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {(['community', 'enterprise', 'sovereign'] as EditionType[]).map((editionKey) => {
          const ed = EDITION_DETAILS[editionKey];
          const isActive = currentEdition === editionKey;

          return (
            <div
              key={editionKey}
              className={`rounded-xl border p-6 flex flex-col justify-between transition-all ${
                isActive
                  ? editionKey === 'sovereign'
                    ? 'bg-amber-950/20 border-amber-500/80 shadow-xl shadow-amber-950/40'
                    : editionKey === 'enterprise'
                    ? 'bg-blue-950/20 border-blue-500/80 shadow-xl shadow-blue-950/40'
                    : 'bg-slate-900 border-emerald-500/80 shadow-xl shadow-emerald-950/40'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded ${
                    editionKey === 'sovereign'
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : editionKey === 'enterprise'
                      ? 'bg-blue-950 text-blue-300 border border-blue-800'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  }`}>
                    {ed.badge}
                  </span>

                  {isActive && (
                    <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Active
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-white mt-1">
                  {ed.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 min-h-[32px]">
                  {ed.tagline}
                </p>

                {/* Pricing Cadence per SaaS Reference */}
                <div className="mt-4 pt-4 border-t border-slate-800">
                  <div className="text-xs text-slate-400 uppercase tracking-wider font-mono">
                    Pricing & Licensing
                  </div>
                  <div className="text-sm font-bold text-white font-mono mt-1">
                    {ed.pricing}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Target: {ed.targetAudience}
                  </div>
                </div>

                {/* Key Features */}
                <div className="mt-5 space-y-2.5">
                  <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider font-mono">
                    Control Tower Features:
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {ed.controlTowerFeatures.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider font-mono block pt-2">
                    Sovereign AI Features:
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {ed.sovereignAiFeatures.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-4 border-t border-slate-800">
                <button
                  onClick={() => setCurrentEdition(editionKey)}
                  className={`w-full py-2 px-4 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    isActive
                      ? 'bg-slate-800 text-slate-300 border border-slate-700'
                      : editionKey === 'sovereign'
                      ? 'bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold'
                      : editionKey === 'enterprise'
                      ? 'bg-blue-600 hover:bg-blue-500 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  {isActive ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Currently Active in Platform</span>
                    </>
                  ) : (
                    <>
                      <span>Activate {ed.title} Simulation</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comprehensive Feature Comparison Matrix */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Full Capability & Module Entitlement Matrix
          </h4>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Progressive module activations across Community, Enterprise, and Sovereign.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/70 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4 w-1/3">Platform Capability</th>
                <th className="py-3 px-4 text-center">Community (Apache 2.0)</th>
                <th className="py-3 px-4 text-center">Enterprise</th>
                <th className="py-3 px-4 text-center">Sovereign Air-Gap</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {comparisonFeatures.map((section, sIdx) => (
                <React.Fragment key={sIdx}>
                  <tr className="bg-slate-950/40">
                    <td
                      colSpan={4}
                      className="py-2.5 px-4 font-mono font-bold text-[11px] text-cyan-400 uppercase tracking-wider"
                    >
                      {section.category}
                    </td>
                  </tr>
                  {section.items.map((item, iIdx) => (
                    <tr key={iIdx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-2.5 px-4 font-medium text-slate-200">
                        {item.name}
                      </td>
                      <td className="py-2.5 px-4 text-center text-slate-400 font-mono text-[11px]">
                        {item.comm}
                      </td>
                      <td className="py-2.5 px-4 text-center text-blue-300 font-mono text-[11px]">
                        {item.ent}
                      </td>
                      <td className="py-2.5 px-4 text-center text-amber-300 font-mono text-[11px] font-semibold">
                        {item.sov}
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
