import React, { useState } from 'react';
import { GpuNode, EditionType } from '../../types/platform';
import { 
  Cpu, Server, Zap, Thermometer, ShieldAlert, CheckCircle2, 
  RotateCcw, Plus, AlertTriangle, Layers, Radio, HardDrive 
} from 'lucide-react';

interface GpuOrchestratorProps {
  nodes: GpuNode[];
  onUpdateNode: (node: GpuNode) => void;
  onAddNode: (newNode: GpuNode) => void;
  currentEdition: EditionType;
}

export const GpuOrchestrator: React.FC<GpuOrchestratorProps> = ({
  nodes,
  onUpdateNode,
  onAddNode,
  currentEdition,
}) => {
  const [selectedCluster, setSelectedCluster] = useState<string>('all');
  const [isAddNodeOpen, setIsAddNodeOpen] = useState(false);

  // Stats calculation
  const totalGpus = nodes.reduce((acc, n) => acc + n.gpuCount, 0);
  const totalVramGb = nodes.reduce((acc, n) => acc + n.vramTotalGb, 0);
  const usedVramGb = nodes.reduce((acc, n) => acc + n.vramUsedGb, 0);
  const totalPowerW = nodes.reduce((acc, n) => acc + n.powerWatts, 0);

  const handleToggleAirGap = (node: GpuNode) => {
    onUpdateNode({
      ...node,
      airGapped: !node.airGapped,
      status: !node.airGapped ? 'healthy' : 'quarantined',
    });
  };

  const handleDrainNode = (node: GpuNode) => {
    onUpdateNode({
      ...node,
      status: node.status === 'offline' ? 'healthy' : 'offline',
      utilizationPct: node.status === 'offline' ? 50 : 0,
    });
  };

  const handleAddSampleNode = () => {
    const newNode: GpuNode = {
      id: `node-sov-${Date.now().toString().slice(-4)}`,
      name: `srv-sov-custom-node-${nodes.length + 1}`,
      cluster: 'Frankfurt-Vault-Alpha (Air-Gapped)',
      gpuType: 'NVIDIA H100 80GB SXM5',
      gpuCount: 8,
      vramTotalGb: 640,
      vramUsedGb: 280,
      utilizationPct: 44,
      temperatureC: 56,
      powerWatts: 2400,
      airGapped: true,
      status: 'healthy',
      hostedModels: ['Llama 3.3 70B Instruct'],
      location: 'Frankfurt Vault Sec-Zone B',
    };
    onAddNode(newNode);
    setIsAddNodeOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Cluster Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Orchestrated GPUs</span>
            <Cpu className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-white mt-2">
            {totalGpus} Cards
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Across {nodes.length} Bare-Metal Nodes
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total High-Bandwidth VRAM</span>
            <Layers className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-white mt-2">
            {totalVramGb} GB
          </div>
          <div className="text-[11px] text-cyan-400 mt-1 font-mono">
            {usedVramGb} GB Allocated ({Math.round((usedVramGb / totalVramGb) * 100)}%)
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Compute Power</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-white mt-2">
            {(totalPowerW / 1000).toFixed(2)} kW
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Sovereign Green PUE 1.12
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Air-Gap Perimeter Status</span>
            <Radio className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-2 flex items-center gap-2">
            <span>ACTIVE</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">
            Zero External Network Egress
          </div>
        </div>
      </div>

      {/* Cluster Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-xl p-4">
        <div>
          <h3 className="text-sm font-bold text-white">
            GPU Bare-Metal Rack Fleet
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            InfiniBand RDMA connected clusters executing private self-hosted weights.
          </p>
        </div>

        <button
          onClick={handleAddSampleNode}
          className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Provision GPU Node</span>
        </button>
      </div>

      {/* Hardware Node Racks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {nodes.map((node) => {
          const vramPct = Math.round((node.vramUsedGb / node.vramTotalGb) * 100);

          return (
            <div
              key={node.id}
              className={`p-5 rounded-xl border transition-all ${
                node.status === 'offline'
                  ? 'bg-slate-950/40 border-slate-800/50 opacity-60'
                  : node.airGapped
                  ? 'bg-slate-900 border-emerald-900/40'
                  : 'bg-slate-900 border-slate-800'
              }`}
            >
              {/* Node Header */}
              <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white font-mono">{node.name}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold ${
                      node.status === 'healthy'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : node.status === 'high_load'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {node.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                    <span>{node.cluster}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono text-[11px] text-cyan-400">{node.gpuType} (x{node.gpuCount})</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                    node.airGapped
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {node.airGapped ? 'Air-Gapped' : 'Connected VPC'}
                  </span>
                </div>
              </div>

              {/* Hardware Gauges */}
              <div className="space-y-3">
                {/* VRAM Allocation */}
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                    <span className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-cyan-400" />
                      <span>VRAM Pool Allocation</span>
                    </span>
                    <span className="font-mono tabular-nums text-slate-200">
                      {node.vramUsedGb} / {node.vramTotalGb} GB ({vramPct}%)
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        vramPct > 85 ? 'bg-amber-500' : 'bg-cyan-500'
                      }`}
                      style={{ width: `${vramPct}%` }}
                    />
                  </div>
                </div>

                {/* Compute Utilization & Temp */}
                <div className="grid grid-cols-3 gap-2 pt-2 text-xs font-mono">
                  <div className="bg-slate-950 p-2 rounded-lg border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 block font-sans">Compute Load</span>
                    <span className="text-white font-bold tabular-nums text-sm">
                      {node.utilizationPct}%
                    </span>
                  </div>

                  <div className="bg-slate-950 p-2 rounded-lg border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 block font-sans">Core Temp</span>
                    <span className="text-white font-bold tabular-nums text-sm flex items-center gap-1">
                      <Thermometer className="w-3 h-3 text-amber-400" />
                      {node.temperatureC}°C
                    </span>
                  </div>

                  <div className="bg-slate-950 p-2 rounded-lg border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 block font-sans">Power Draw</span>
                    <span className="text-white font-bold tabular-nums text-sm">
                      {node.powerWatts} W
                    </span>
                  </div>
                </div>

                {/* Active Hosted Models */}
                <div>
                  <span className="text-[11px] text-slate-400 block mb-1">
                    Active Model Weight Allocations:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {node.hostedModels.map((m, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800 font-mono"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Node Control Footer */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => handleToggleAirGap(node)}
                  className={`text-xs px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                    node.airGapped
                      ? 'text-amber-400 hover:bg-amber-950/40 border border-amber-800/40'
                      : 'text-emerald-400 hover:bg-emerald-950/40 border border-emerald-800/40'
                  }`}
                >
                  {node.airGapped ? 'De-isolate Link' : 'Isolate to Air-Gap'}
                </button>

                <button
                  onClick={() => handleDrainNode(node)}
                  className={`text-xs px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                    node.status === 'offline'
                      ? 'text-emerald-400 hover:bg-emerald-950/40 border border-emerald-800/40'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {node.status === 'offline' ? 'Resume Node' : 'Drain Traffic'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
