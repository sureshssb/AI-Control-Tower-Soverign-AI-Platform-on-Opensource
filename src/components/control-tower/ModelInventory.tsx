import React, { useState } from 'react';
import { ModelRecord, EditionType, RiskTier } from '../../types/platform';
import { Search, Plus, Filter, Shield, CheckCircle, AlertOctagon, Clock, ExternalLink, HardDrive, Cpu, X } from 'lucide-react';

interface ModelInventoryProps {
  models: ModelRecord[];
  onUpdateModel: (updatedModel: ModelRecord) => void;
  onAddModel: (newModel: ModelRecord) => void;
  currentEdition: EditionType;
}

export const ModelInventory: React.FC<ModelInventoryProps> = ({
  models,
  onUpdateModel,
  onAddModel,
  currentEdition,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [backendFilter, setBackendFilter] = useState<string>('all');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // New model form state
  const [newModel, setNewModel] = useState({
    name: '',
    family: 'Meta Llama',
    parameters: '8 Billion',
    version: '1.0',
    license: 'Apache 2.0',
    servingBackend: 'vLLM' as const,
    hostingLocation: 'On-Premises Air-Gap' as const,
    dataResidency: 'Frankfurt Datacenter (DE-FRA1)',
    riskTier: 'minimal' as RiskTier,
    contextWindow: 32768,
    quantization: 'FP8' as const,
  });

  const filteredModels = models.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          m.family.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          m.dataResidency.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = riskFilter === 'all' || m.riskTier === riskFilter;
    const matchesBackend = backendFilter === 'all' || m.servingBackend === backendFilter;
    return matchesSearch && matchesRisk && matchesBackend;
  });

  const handleToggleApproval = (model: ModelRecord) => {
    const nextStatus = model.approvalStatus === 'approved' ? 'restricted' : 'approved';
    onUpdateModel({
      ...model,
      approvalStatus: nextStatus,
    });
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModel.name) return;

    const registered: ModelRecord = {
      id: `mdl-${Date.now().toString().slice(-6)}`,
      name: newModel.name,
      family: newModel.family,
      parameters: newModel.parameters,
      version: newModel.version,
      license: newModel.license,
      servingBackend: newModel.servingBackend,
      hostingLocation: newModel.hostingLocation,
      dataResidency: newModel.dataResidency,
      riskTier: newModel.riskTier,
      approvalStatus: 'approved',
      contextWindow: Number(newModel.contextWindow),
      quantization: newModel.quantization,
      minEdition: 'community',
      throughputTps: Math.floor(Math.random() * 60) + 50,
      averageLatencyMs: Math.floor(Math.random() * 30) + 20,
      activeReplicas: 1,
    };

    onAddModel(registered);
    setIsRegisterModalOpen(false);
    setNewModel({
      name: '',
      family: 'Meta Llama',
      parameters: '8 Billion',
      version: '1.0',
      license: 'Apache 2.0',
      servingBackend: 'vLLM',
      hostingLocation: 'On-Premises Air-Gap',
      dataResidency: 'Frankfurt Datacenter (DE-FRA1)',
      riskTier: 'minimal',
      contextWindow: 32768,
      quantization: 'FP8',
    });
  };

  const getRiskTierBadge = (tier: RiskTier) => {
    switch (tier) {
      case 'minimal':
        return <span className="text-emerald-400 font-medium">Minimal Risk</span>;
      case 'limited':
        return <span className="text-cyan-400 font-medium">Limited Risk (Transparency)</span>;
      case 'high':
        return <span className="text-amber-400 font-medium">High Risk (EU Annex III)</span>;
      case 'prohibited':
        return <span className="text-red-400 font-medium">Prohibited</span>;
    }
  };

  return (
    <div className="space-y-5">
      {/* Search and Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-lg">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Filter by model name, family, residency..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="all">All Risk Tiers</option>
            <option value="minimal">Minimal Risk</option>
            <option value="limited">Limited Risk</option>
            <option value="high">High Risk</option>
          </select>

          <select
            value={backendFilter}
            onChange={(e) => setBackendFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="all">All Engines</option>
            <option value="vLLM">vLLM</option>
            <option value="TensorRT-LLM">TensorRT-LLM</option>
            <option value="Ollama">Ollama</option>
            <option value="External Proxy">Proxy Gateway</option>
          </select>
        </div>

        <button
          onClick={() => setIsRegisterModalOpen(true)}
          className="px-3.5 py-1.5 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Register Model Weights</span>
        </button>
      </div>

      {/* Model Catalog Table (High-Density Tabular View per SaaS reference) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/70 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Model & Family</th>
                <th className="py-3 px-4">Serving Engine & Host</th>
                <th className="py-3 px-4">Data Residency</th>
                <th className="py-3 px-4">Risk Classification</th>
                <th className="py-3 px-4 text-right">Throughput</th>
                <th className="py-3 px-4 text-right">Latency</th>
                <th className="py-3 px-4 text-center">Governance Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredModels.map((model) => (
                <tr
                  key={model.id}
                  className="hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-white">{model.name}</div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <span>{model.parameters}</span>
                      <span aria-hidden="true">·</span>
                      <span>{model.quantization}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-[10px] text-slate-400">{model.license}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-200 flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{model.servingBackend}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {model.hostingLocation}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{model.dataResidency}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-[11px]">
                    {getRiskTierBadge(model.riskTier)}
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Context: {model.contextWindow.toLocaleString()} tokens
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-200">
                    {model.throughputTps.toFixed(1)} tps
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-200">
                    {model.averageLatencyMs} ms
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium ${
                        model.approvalStatus === 'approved'
                          ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/50'
                          : model.approvalStatus === 'restricted'
                          ? 'bg-amber-950/60 text-amber-300 border border-amber-800/50'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {model.approvalStatus === 'approved' ? (
                        <CheckCircle className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <AlertOctagon className="w-3 h-3 text-amber-400" />
                      )}
                      <span className="capitalize">{model.approvalStatus.replace('_', ' ')}</span>
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleToggleApproval(model)}
                      className={`text-xs px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                        model.approvalStatus === 'approved'
                          ? 'text-amber-400 hover:bg-amber-950/40 border border-amber-800/40'
                          : 'text-emerald-400 hover:bg-emerald-950/40 border border-emerald-800/40'
                      }`}
                    >
                      {model.approvalStatus === 'approved' ? 'Restrict' : 'Approve'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Register Model Modal */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsRegisterModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-white mb-1">
              Register Model Weights in Control Tower
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Add custom open-source weights, quantized engines, or internal fine-tunes to the inventory.
            </p>

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Model Identifier & Tag
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DeepSeek-R1-Distill-Llama-70B"
                  value={newModel.name}
                  onChange={(e) => setNewModel({ ...newModel, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Parameter Scale
                  </label>
                  <input
                    type="text"
                    value={newModel.parameters}
                    onChange={(e) => setNewModel({ ...newModel, parameters: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Serving Engine
                  </label>
                  <select
                    value={newModel.servingBackend}
                    onChange={(e) => setNewModel({ ...newModel, servingBackend: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="vLLM">vLLM (Dynamic Batching)</option>
                    <option value="TensorRT-LLM">TensorRT-LLM (High Throughput)</option>
                    <option value="Ollama">Ollama (Edge / Single Node)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Quantization
                  </label>
                  <select
                    value={newModel.quantization}
                    onChange={(e) => setNewModel({ ...newModel, quantization: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="FP8">FP8 (NVLink Optimized)</option>
                    <option value="INT4">INT4 (VRAM Minimized)</option>
                    <option value="BF16">BF16 (Reference Fidelity)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    EU AI Act Risk Tier
                  </label>
                  <select
                    value={newModel.riskTier}
                    onChange={(e) => setNewModel({ ...newModel, riskTier: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="minimal">Minimal Risk</option>
                    <option value="limited">Limited Risk (Transparency)</option>
                    <option value="high">High Risk (Regulated Annex III)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Data Residency Node
                </label>
                <input
                  type="text"
                  value={newModel.dataResidency}
                  onChange={(e) => setNewModel({ ...newModel, dataResidency: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg shadow-sm cursor-pointer"
                >
                  Confirm & Ingest to Inventory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
