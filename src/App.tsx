import React, { useState } from 'react';
import { ProductPlane, EditionType, ModelRecord, GuardrailPolicy, GpuNode, RagIndex, AgentSandboxRecord } from './types/platform';
import { 
  INITIAL_MODELS, INITIAL_GUARDRAILS, INITIAL_GPU_NODES, 
  INITIAL_RAG_INDEXES, INITIAL_AGENT_SANDBOXES, INITIAL_AUDIT_LOGS 
} from './data/initialData';
import { Header } from './components/Header';
import { EditionSwitcher } from './components/EditionSwitcher';
import { ArchitectureDiagram } from './components/ArchitectureDiagram';
import { ModelInventory } from './components/control-tower/ModelInventory';
import { PolicyGuardrails } from './components/control-tower/PolicyGuardrails';
import { ObservabilityMetrics } from './components/control-tower/ObservabilityMetrics';
import { AuditLedger } from './components/control-tower/AuditLedger';
import { GpuOrchestrator } from './components/sovereign-ai/GpuOrchestrator';
import { ModelServingEngine } from './components/sovereign-ai/ModelServingEngine';
import { SovereignRagVault } from './components/sovereign-ai/SovereignRagVault';
import { AgentSandbox } from './components/sovereign-ai/AgentSandbox';
import { EditionComparison } from './components/editions/EditionComparison';
import { DeploymentManifestGenerator } from './components/manifests/DeploymentManifestGenerator';
import { 
  Shield, Server, Network, Layers, Terminal, Sparkles, 
  FileText, Activity, Lock, Cpu, Database, Bot, Check, X 
} from 'lucide-react';

export default function App() {
  const [activePlane, setActivePlane] = useState<ProductPlane>('architecture');
  const [currentEdition, setCurrentEdition] = useState<EditionType>('sovereign');
  
  // Sub-tabs for Control Tower
  const [controlTowerTab, setControlTowerTab] = useState<'inventory' | 'guardrails' | 'observability' | 'audit'>('guardrails');
  
  // Sub-tabs for Sovereign AI
  const [sovereignAiTab, setSovereignAiTab] = useState<'orchestration' | 'serving' | 'rag' | 'agents'>('orchestration');

  // Application State
  const [models, setModels] = useState<ModelRecord[]>(INITIAL_MODELS);
  const [policies, setPolicies] = useState<GuardrailPolicy[]>(INITIAL_GUARDRAILS);
  const [gpuNodes, setGpuNodes] = useState<GpuNode[]>(INITIAL_GPU_NODES);
  const [ragIndexes, setRagIndexes] = useState<RagIndex[]>(INITIAL_RAG_INDEXES);
  const [agentSandboxes, setAgentSandboxes] = useState<AgentSandboxRecord[]>(INITIAL_AGENT_SANDBOXES);
  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOGS);

  // Deploy Modal
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);

  const handleUpdateModel = (updatedModel: ModelRecord) => {
    setModels(models.map((m) => (m.id === updatedModel.id ? updatedModel : m)));
  };

  const handleAddModel = (newModel: ModelRecord) => {
    setModels([newModel, ...models]);
  };

  const handleTogglePolicy = (policyId: string) => {
    setPolicies(policies.map((p) => (p.id === policyId ? { ...p, enabled: !p.enabled } : p)));
  };

  const handleUpdateNode = (updatedNode: GpuNode) => {
    setGpuNodes(gpuNodes.map((n) => (n.id === updatedNode.id ? updatedNode : n)));
  };

  const handleAddNode = (newNode: GpuNode) => {
    setGpuNodes([...gpuNodes, newNode]);
  };

  const handleAddRagIndex = (newIndex: RagIndex) => {
    setRagIndexes([newIndex, ...ragIndexes]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Bar Contract Header */}
      <Header
        activePlane={activePlane}
        setActivePlane={setActivePlane}
        currentEdition={currentEdition}
        setCurrentEdition={setCurrentEdition}
        onOpenDeployModal={() => setIsDeployModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-6">
        {/* Progressive Capability & Edition Switcher Banner */}
        <EditionSwitcher
          currentEdition={currentEdition}
          setCurrentEdition={setCurrentEdition}
          onExploreEditions={() => setActivePlane('editions')}
        />

        {/* View 1: Architecture & Topology View */}
        {activePlane === 'architecture' && (
          <ArchitectureDiagram
            currentEdition={currentEdition}
            onNavigatePlane={(plane) => {
              setActivePlane(plane);
              if (plane === 'control-tower') setControlTowerTab('guardrails');
              if (plane === 'sovereign-ai') setSovereignAiTab('orchestration');
            }}
          />
        )}

        {/* View 2: AI Control Tower (Control Plane) */}
        {activePlane === 'control-tower' && (
          <div className="space-y-6">
            {/* Control Tower Sub-Navigation Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-cyan-400" />
                  <h1 className="text-lg font-bold text-white tracking-tight">
                    AI Control Tower
                  </h1>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                    CONTROL PLANE
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Enterprise governance, inventory catalog, in-line semantic guardrails, observability, and cryptographic audit.
                </p>
              </div>

              {/* Segmented Sub-Tabs */}
              <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-medium overflow-x-auto">
                <button
                  onClick={() => setControlTowerTab('guardrails')}
                  className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                    controlTowerTab === 'guardrails'
                      ? 'bg-slate-800 text-cyan-400 font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Policy & Guardrails</span>
                </button>

                <button
                  onClick={() => setControlTowerTab('inventory')}
                  className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                    controlTowerTab === 'inventory'
                      ? 'bg-slate-800 text-cyan-400 font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Model Inventory</span>
                </button>

                <button
                  onClick={() => setControlTowerTab('observability')}
                  className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                    controlTowerTab === 'observability'
                      ? 'bg-slate-800 text-cyan-400 font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Observability & Cost</span>
                </button>

                <button
                  onClick={() => setControlTowerTab('audit')}
                  className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                    controlTowerTab === 'audit'
                      ? 'bg-slate-800 text-cyan-400 font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Audit Ledger</span>
                </button>
              </div>
            </div>

            {/* Sub-tab views */}
            {controlTowerTab === 'guardrails' && (
              <PolicyGuardrails
                policies={policies}
                onTogglePolicy={handleTogglePolicy}
                currentEdition={currentEdition}
              />
            )}

            {controlTowerTab === 'inventory' && (
              <ModelInventory
                models={models}
                onUpdateModel={handleUpdateModel}
                onAddModel={handleAddModel}
                currentEdition={currentEdition}
              />
            )}

            {controlTowerTab === 'observability' && (
              <ObservabilityMetrics currentEdition={currentEdition} />
            )}

            {controlTowerTab === 'audit' && (
              <AuditLedger logs={auditLogs} currentEdition={currentEdition} />
            )}
          </div>
        )}

        {/* View 3: Sovereign AI Platform (Data Plane / Infrastructure Plane) */}
        {activePlane === 'sovereign-ai' && (
          <div className="space-y-6">
            {/* Sovereign AI Sub-Navigation Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <Server className="w-5 h-5 text-emerald-400" />
                  <h1 className="text-lg font-bold text-white tracking-tight">
                    Sovereign AI Platform
                  </h1>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                    DATA / INFRASTRUCTURE PLANE
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Private self-hosted AI infrastructure, bare-metal GPU orchestration, high-throughput vLLM serving, air-gap RAG, and sandboxed agents.
                </p>
              </div>

              {/* Segmented Sub-Tabs */}
              <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-medium overflow-x-auto">
                <button
                  onClick={() => setSovereignAiTab('orchestration')}
                  className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                    sovereignAiTab === 'orchestration'
                      ? 'bg-slate-800 text-emerald-400 font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>GPU Orchestrator</span>
                </button>

                <button
                  onClick={() => setSovereignAiTab('serving')}
                  className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                    sovereignAiTab === 'serving'
                      ? 'bg-slate-800 text-emerald-400 font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Server className="w-3.5 h-3.5" />
                  <span>Model Serving</span>
                </button>

                <button
                  onClick={() => setSovereignAiTab('rag')}
                  className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                    sovereignAiTab === 'rag'
                      ? 'bg-slate-800 text-emerald-400 font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>Sovereign RAG Vault</span>
                </button>

                <button
                  onClick={() => setSovereignAiTab('agents')}
                  className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                    sovereignAiTab === 'agents'
                      ? 'bg-slate-800 text-emerald-400 font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>Agent Sandboxes</span>
                </button>
              </div>
            </div>

            {/* Sub-tab views */}
            {sovereignAiTab === 'orchestration' && (
              <GpuOrchestrator
                nodes={gpuNodes}
                onUpdateNode={handleUpdateNode}
                onAddNode={handleAddNode}
                currentEdition={currentEdition}
              />
            )}

            {sovereignAiTab === 'serving' && (
              <ModelServingEngine currentEdition={currentEdition} />
            )}

            {sovereignAiTab === 'rag' && (
              <SovereignRagVault
                indexes={ragIndexes}
                onAddIndex={handleAddRagIndex}
                currentEdition={currentEdition}
              />
            )}

            {sovereignAiTab === 'agents' && (
              <AgentSandbox
                sandboxes={agentSandboxes}
                currentEdition={currentEdition}
              />
            )}
          </div>
        )}

        {/* View 4: Commercial Editions & Capability Unlocking */}
        {activePlane === 'editions' && (
          <EditionComparison
            currentEdition={currentEdition}
            setCurrentEdition={setCurrentEdition}
          />
        )}

        {/* View 5: Deployment Manifest Generator */}
        {activePlane === 'manifests' && (
          <DeploymentManifestGenerator currentEdition={currentEdition} />
        )}
      </main>

      {/* Deployment Modal */}
      {isDeployModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsDeployModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Launch Open Sovereign AI Stack
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Deploy the unified Control Tower (control plane) and Sovereign AI (data plane) stack.
            </p>

            <div className="space-y-3 bg-slate-950 p-4 rounded-lg border border-slate-800 text-xs font-mono">
              <div className="text-slate-400"># 1. Clone Open Source Core Repository</div>
              <div className="text-cyan-300">git clone https://github.com/open-sovereign-ai/platform.git</div>
              
              <div className="text-slate-400 mt-2"># 2. Launch with Target Edition</div>
              <div className="text-emerald-300">
                export OSAI_EDITION={currentEdition}
              </div>
              <div className="text-emerald-300">
                docker compose -f deployments/docker-compose.{currentEdition}.yml up -d
              </div>

              <div className="text-slate-400 mt-2"># 3. Access Control Tower & Sovereign Endpoints</div>
              <div className="text-slate-300">
                AI Control Tower UI: http://localhost:8080<br />
                Sovereign vLLM Endpoint: http://localhost:8000/v1
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between">
              <button
                onClick={() => {
                  setIsDeployModalOpen(false);
                  setActivePlane('manifests');
                }}
                className="text-xs text-cyan-400 hover:underline cursor-pointer"
              >
                Customize Helm Values Manifest →
              </button>

              <button
                onClick={() => setIsDeployModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer conforming strictly to Anti-Slop (quiet copyright, real links, no fake tickers) */}
      <footer className="border-t border-slate-800/80 bg-slate-950 px-4 lg:px-8 py-5 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-300">Open Sovereign AI Control Platform</span>
            <span aria-hidden="true">·</span>
            <span>Apache 2.0 Open Source Core</span>
            <span aria-hidden="true">·</span>
            <span>Community → Enterprise → Sovereign</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>Control Tower: Port 8080</span>
            <span>Sovereign vLLM: Port 8000</span>
            <span className="text-emerald-400">Zero-Egress Diode Active</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
