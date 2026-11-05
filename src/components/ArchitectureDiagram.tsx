import React, { useState } from 'react';
import { EditionType } from '../types/platform';
import { 
  Shield, Server, Network, ArrowRight, ArrowDown, Lock, CheckCircle2, 
  Cpu, Database, Bot, FileText, Activity, AlertTriangle, Play, Sparkles, RefreshCw
} from 'lucide-react';

interface ArchitectureDiagramProps {
  currentEdition: EditionType;
  onNavigatePlane: (plane: 'control-tower' | 'sovereign-ai') => void;
}

export const ArchitectureDiagram: React.FC<ArchitectureDiagramProps> = ({
  currentEdition,
  onNavigatePlane,
}) => {
  const [selectedNode, setSelectedNode] = useState<string>('policy-engine');
  const [isSimulatingPacket, setIsSimulatingPacket] = useState<boolean>(false);
  const [packetStep, setPacketStep] = useState<number>(0);

  const runSimulation = () => {
    setIsSimulatingPacket(true);
    setPacketStep(1);
    
    setTimeout(() => setPacketStep(2), 700);
    setTimeout(() => setPacketStep(3), 1400);
    setTimeout(() => setPacketStep(4), 2100);
    setTimeout(() => setPacketStep(5), 2800);
    setTimeout(() => {
      setPacketStep(0);
      setIsSimulatingPacket(false);
    }, 3800);
  };

  const nodeDescriptions: Record<string, { title: string; plane: string; desc: string; protocols: string; editionReq: string }> = {
    'model-inventory': {
      title: 'Model Inventory & Registry',
      plane: 'Control Plane (AI Control Tower)',
      desc: 'Central registry cataloging approved open-source models, licenses, EU AI Act risk tiers, and serving endpoints.',
      protocols: 'REST / GraphQL metadata sync, GitOps manifests',
      editionReq: 'Community (Local catalog) | Enterprise (Multi-cluster) | Sovereign (Cryptographic signatures)',
    },
    'policy-engine': {
      title: 'Real-time Policy Engine & Guardrails',
      plane: 'Control Plane (AI Control Tower)',
      desc: 'In-line prompt inspection: regex & NER PII scrubber, semantic prompt injection shield, toxic intent filter, and data residency geofencing.',
      protocols: 'gRPC streaming interceptor, < 4ms latency budget',
      editionReq: 'Community (Basic rules) | Enterprise (Semantic embeddings DLP) | Sovereign (Geofence diode)',
    },
    'observability': {
      title: 'Observability, Cost & Telemetry Collector',
      plane: 'Control Plane (AI Control Tower)',
      desc: 'Centralized aggregation of token metrics, latency percentiles (TTFT, inter-token), department chargeback, and hallucination evaluations.',
      protocols: 'OpenTelemetry, Prometheus / Datadog exporter',
      editionReq: 'Community (Local metrics) | Enterprise (OIDC/SAML Quotas) | Sovereign (Air-gap offline telemetry)',
    },
    'audit-ledger': {
      title: 'Security & Cryptographic Audit Ledger',
      plane: 'Control Plane (AI Control Tower)',
      desc: 'Tamper-evident audit ledger capturing every prompt hash, residency stamp, applied guardrail actions, and actor credential.',
      protocols: 'Immutable SHA-256 hash chaining, Hardware TPM signing (Sovereign)',
      editionReq: 'Community (Postgres log) | Enterprise (WORM storage) | Sovereign (Hardware TPM sealed)',
    },
    'secure-bridge': {
      title: 'Secure Sovereignty Boundary & Diode',
      plane: 'Boundary Interconnect',
      desc: 'Strict boundary isolating control commands from model inference. In Sovereign mode, acts as a unidirectional physical data diode with zero egress.',
      protocols: 'mTLS 1.3, strict private VPC, air-gap optical diode mode',
      editionReq: 'Community (Local socket) | Enterprise (mTLS VPC) | Sovereign (Hardware Diode & Air-gap)',
    },
    'gpu-orchestrator': {
      title: 'GPU Cluster Orchestrator',
      plane: 'Data Plane (Sovereign AI Platform)',
      desc: 'Bare-metal and Kubernetes GPU cluster management (NVIDIA H100, A100, MI300), VRAM allocation, dynamic node draining, and air-gap quarantine.',
      protocols: 'K8s Device Plugin, NVLink/InfiniBand RDMA telemetry',
      editionReq: 'Community (Single node) | Enterprise (Multi-node HA) | Sovereign (Air-gap bare metal)',
    },
    'model-serving': {
      title: 'Private Model Serving Engine (vLLM / TensorRT)',
      plane: 'Data Plane (Sovereign AI Platform)',
      desc: 'High-throughput local LLM execution using continuous dynamic batching, PagedAttention, FP8/INT4 quantizations, and zero external network calls.',
      protocols: 'OpenAI-compatible internal endpoint, vLLM / TensorRT-LLM',
      editionReq: 'Community (vLLM/Ollama) | Enterprise (Dynamic HA scaling) | Sovereign (SEV-SNP Enclave weights)',
    },
    'rag-vault': {
      title: 'Air-Gapped Sovereign RAG Vault',
      plane: 'Data Plane (Sovereign AI Platform)',
      desc: 'Private vector databases (Milvus, Qdrant, Chroma) running completely offline with document chunking, encrypted index partitions, and local embeddings.',
      protocols: 'gRPC vector query, hardware TPM encryption',
      editionReq: 'Community (Chroma local) | Enterprise (Milvus cluster) | Sovereign (Air-gap TPM sealed)',
    },
    'agent-sandbox': {
      title: 'Isolated Agent Runtime Sandbox',
      plane: 'Data Plane (Sovereign AI Platform)',
      desc: 'MicroVM and containerized sandboxes executing autonomous tools, code interpreters, and SQL query runners with hard egress network blocks.',
      protocols: 'gVisor sandbox, Kata Containers, firecracker microVMs',
      editionReq: 'Community (Process isolation) | Enterprise (gVisor VPC) | Sovereign (Hypervisor enclaves)',
    },
  };

  const activeNodeInfo = nodeDescriptions[selectedNode] || nodeDescriptions['policy-engine'];

  return (
    <div className="space-y-6">
      {/* Top Description & Simulator Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white tracking-tight">
              Dual-Plane Architectural Topology
            </h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
              Control Plane ⇄ Data Plane
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Clean architectural separation: <strong className="text-slate-200">AI Control Tower</strong> governs policies, inventory, observability, and audit, while the <strong className="text-slate-200">Sovereign AI Platform</strong> executes private model serving, RAG, agents, and GPU orchestration on self-hosted infrastructure.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={runSimulation}
            disabled={isSimulatingPacket}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-lg shadow-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            {isSimulatingPacket ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-200" />
            ) : (
              <Play className="w-3.5 h-3.5 text-indigo-200" />
            )}
            <span>{isSimulatingPacket ? 'Simulating Ingestion...' : 'Trace Request Pipeline'}</span>
          </button>
        </div>
      </div>

      {/* Main Dual-Plane Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Plane 1: AI Control Tower (Left / Top) */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-cyan-900/40 rounded-xl p-5 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">AI Control Tower</h3>
                  <span className="text-[11px] font-mono text-cyan-400">CONTROL PLANE</span>
                </div>
              </div>
              <button
                onClick={() => onNavigatePlane('control-tower')}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 cursor-pointer"
              >
                <span>Open Tower Console</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Sub-modules inside Control Tower */}
            <div className="space-y-3">
              {/* Module 1: Model Inventory */}
              <div
                onClick={() => setSelectedNode('model-inventory')}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${
                  selectedNode === 'model-inventory'
                    ? 'bg-slate-800/90 border-cyan-500 shadow-md shadow-cyan-950/50'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                } ${packetStep === 1 ? 'ring-2 ring-cyan-400 bg-cyan-950/40' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-xs font-semibold text-slate-200">Model Registry & Governance</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">Inventory</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  EU AI Act classification, model approval lifecycle & licensing rules.
                </p>
              </div>

              {/* Module 2: Policy & Guardrails */}
              <div
                onClick={() => setSelectedNode('policy-engine')}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${
                  selectedNode === 'policy-engine'
                    ? 'bg-slate-800/90 border-cyan-500 shadow-md shadow-cyan-950/50'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                } ${packetStep === 2 ? 'ring-2 ring-cyan-400 bg-cyan-950/40' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-xs font-semibold text-slate-200">Policy Engine & Guardrail Filter</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400">Inline Diode</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  PII scrubber, prompt injection defense, semantic firewall, residency geofencing.
                </p>
              </div>

              {/* Module 3: Observability & Telemetry */}
              <div
                onClick={() => setSelectedNode('observability')}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${
                  selectedNode === 'observability'
                    ? 'bg-slate-800/90 border-cyan-500 shadow-md shadow-cyan-950/50'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-xs font-semibold text-slate-200">Observability & Cost Intelligence</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">Telemetry</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Latency percentiles (TTFT), token budgets, departmental chargebacks & drift.
                </p>
              </div>

              {/* Module 4: Audit Ledger */}
              <div
                onClick={() => setSelectedNode('audit-ledger')}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${
                  selectedNode === 'audit-ledger'
                    ? 'bg-slate-800/90 border-cyan-500 shadow-md shadow-cyan-950/50'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                } ${packetStep === 5 ? 'ring-2 ring-cyan-400 bg-cyan-950/40' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-xs font-semibold text-slate-200">Cryptographic Audit Ledger</span>
                  </div>
                  <span className="text-[10px] font-mono text-amber-400">WORM Proof</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Tamper-evident SHA-256 hash chains, TPM signatures, and residency proofs.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Governance Role: Central Authority</span>
            <span className="font-mono text-slate-300">Single Pane of Glass</span>
          </div>
        </div>

        {/* Boundary: Secure Interconnect Bridge (Middle) */}
        <div className="lg:col-span-2 flex flex-col justify-center items-center gap-3 py-4 lg:py-0">
          <div
            onClick={() => setSelectedNode('secure-bridge')}
            className={`w-full p-3 rounded-xl border text-center transition-all cursor-pointer ${
              selectedNode === 'secure-bridge'
                ? 'bg-indigo-950/70 border-indigo-500 shadow-lg'
                : 'bg-slate-900/80 border-indigo-900/40 hover:border-indigo-700'
            } ${packetStep === 3 ? 'ring-2 ring-indigo-400 bg-indigo-900/50' : ''}`}
          >
            <div className="w-8 h-8 mx-auto rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-1.5">
              <Network className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-white">Sovereignty Boundary</div>
            <div className="text-[10px] text-indigo-300 font-mono mt-0.5">mTLS / gRPC Stream</div>
            <div className="mt-2 text-[10px] text-slate-400 leading-tight">
              {currentEdition === 'sovereign' 
                ? 'Air-Gap Physical Diode (Zero Egress)' 
                : currentEdition === 'enterprise'
                ? 'Encrypted Multi-VPC Bridge'
                : 'Local IPC / Socket Stream'}
            </div>
          </div>

          <div className="hidden lg:flex flex-col items-center gap-1 text-slate-400">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Stream</span>
            <div className="w-0.5 h-8 bg-gradient-to-b from-cyan-500 via-indigo-500 to-emerald-500" />
            <ArrowRight className="w-4 h-4 text-emerald-400" />
          </div>
        </div>

        {/* Plane 2: Sovereign AI Platform (Right / Bottom) */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-emerald-900/40 rounded-xl p-5 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Server className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Sovereign AI Platform</h3>
                  <span className="text-[11px] font-mono text-emerald-400">INFRASTRUCTURE / DATA PLANE</span>
                </div>
              </div>
              <button
                onClick={() => onNavigatePlane('sovereign-ai')}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 cursor-pointer"
              >
                <span>Open Infra Console</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Sub-modules inside Sovereign AI */}
            <div className="space-y-3">
              {/* Module 1: GPU Orchestrator */}
              <div
                onClick={() => setSelectedNode('gpu-orchestrator')}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${
                  selectedNode === 'gpu-orchestrator'
                    ? 'bg-slate-800/90 border-emerald-500 shadow-md shadow-emerald-950/50'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-xs font-semibold text-slate-200">GPU Orchestrator & Bare-Metal</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">Clusters</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  H100/A100 nodes, VRAM allocation, node drain, and air-gap hardware isolation.
                </p>
              </div>

              {/* Module 2: Model Serving Engine */}
              <div
                onClick={() => setSelectedNode('model-serving')}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${
                  selectedNode === 'model-serving'
                    ? 'bg-slate-800/90 border-emerald-500 shadow-md shadow-emerald-950/50'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                } ${packetStep === 4 ? 'ring-2 ring-emerald-400 bg-emerald-950/40' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Server className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-xs font-semibold text-slate-200">Private Model Serving (vLLM / TensorRT)</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400">Zero Egress</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Local weights execution, continuous dynamic batching, FP8/INT4 quantization.
                </p>
              </div>

              {/* Module 3: Sovereign RAG */}
              <div
                onClick={() => setSelectedNode('rag-vault')}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${
                  selectedNode === 'rag-vault'
                    ? 'bg-slate-800/90 border-emerald-500 shadow-md shadow-emerald-950/50'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-xs font-semibold text-slate-200">Air-Gapped Sovereign RAG Vault</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">Vector Store</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Private vector indices (Milvus/Qdrant), TPM-sealed partitions, zero leak.
                </p>
              </div>

              {/* Module 4: Agent Sandbox */}
              <div
                onClick={() => setSelectedNode('agent-sandbox')}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${
                  selectedNode === 'agent-sandbox'
                    ? 'bg-slate-800/90 border-emerald-500 shadow-md shadow-emerald-950/50'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bot className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-xs font-semibold text-slate-200">Private Agent Sandbox</span>
                  </div>
                  <span className="text-[10px] font-mono text-amber-400">Enclaves</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  gVisor / MicroVM sandboxes with hardware-enforced outbound network kill switch.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Inference Role: Autonomous Compute</span>
            <span className="font-mono text-slate-300">Self-Hosted Bare-Metal</span>
          </div>
        </div>
      </div>

      {/* Selected Node Deep-Dive Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
              Component Deep-Dive: {activeNodeInfo.plane}
            </span>
            <h3 className="text-base font-bold text-white mt-0.5">
              {activeNodeInfo.title}
            </h3>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
            Protocols: {activeNodeInfo.protocols}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Core Architectural Duty
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {activeNodeInfo.desc}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Edition Entitlement Unlock
            </h4>
            <div className="text-xs text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono">
              {activeNodeInfo.editionReq}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
