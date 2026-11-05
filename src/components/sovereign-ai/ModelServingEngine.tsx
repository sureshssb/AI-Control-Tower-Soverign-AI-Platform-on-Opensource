import React, { useState } from 'react';
import { EditionType } from '../../types/platform';
import { Server, Cpu, Sliders, Zap, HardDrive, RefreshCw, Layers, Check } from 'lucide-react';

interface ModelServingEngineProps {
  currentEdition: EditionType;
}

export const ModelServingEngine: React.FC<ModelServingEngineProps> = ({ currentEdition }) => {
  const [selectedEngine, setSelectedEngine] = useState<'vLLM' | 'TensorRT-LLM' | 'Ollama'>('vLLM');
  const [quantization, setQuantization] = useState<'FP8' | 'INT4' | 'BF16'>('FP8');
  const [kvCachePct, setKvCachePct] = useState<number>(85);
  const [maxBatchTokens, setMaxBatchTokens] = useState<number>(4096);
  const [contextWindow, setContextWindow] = useState<number>(65536);
  const [enableSpeculativeDecoding, setEnableSpeculativeDecoding] = useState<boolean>(true);

  // Compute simulated throughput and VRAM requirement
  const baseTps = selectedEngine === 'TensorRT-LLM' ? 95 : selectedEngine === 'vLLM' ? 82 : 45;
  const quantMultiplier = quantization === 'FP8' ? 1.6 : quantization === 'INT4' ? 2.1 : 1.0;
  const speculativeBonus = enableSpeculativeDecoding ? 1.35 : 1.0;
  const estimatedTps = Math.round(baseTps * (quantMultiplier / 1.5) * speculativeBonus);
  const estimatedVramPerReplica = quantization === 'INT4' ? 22 : quantization === 'FP8' ? 38 : 72;

  return (
    <div className="space-y-6">
      {/* Configuration Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-400" />
              Sovereign Model Serving Runtime Configuration
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Fine-tune the local self-hosted inference engine for low latency or massive concurrent throughput with zero external data egress.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-800/50">
              Zero Telemetry Egress Active
            </span>
          </div>
        </div>

        {/* Engine and Quantization Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
          {/* Engine Choice */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Inference Backend Runtime
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['vLLM', 'TensorRT-LLM', 'Ollama'] as const).map((eng) => (
                <button
                  key={eng}
                  onClick={() => setSelectedEngine(eng)}
                  className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                    selectedEngine === eng
                      ? 'bg-slate-800 border-emerald-500 shadow-md shadow-emerald-950/30'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="text-xs font-bold text-white">{eng}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {eng === 'vLLM'
                      ? 'Continuous Batching'
                      : eng === 'TensorRT-LLM'
                      ? 'NVIDIA TensorRT'
                      : 'Local Edge Dev'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quantization */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Weight Precision & Quantization
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['FP8', 'INT4', 'BF16'] as const).map((q) => (
                <button
                  key={q}
                  onClick={() => setQuantization(q)}
                  className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                    quantization === q
                      ? 'bg-slate-800 border-emerald-500 shadow-md shadow-emerald-950/30'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="text-xs font-bold text-white">{q}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {q === 'FP8'
                      ? 'Hopper Native Speed'
                      : q === 'INT4'
                      ? 'Max VRAM Savings'
                      : 'Reference Precision'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Runtime Sliders & Toggles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5 pt-4 border-t border-slate-800">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
              <span>PagedAttention KV-Cache</span>
              <span className="font-mono text-cyan-400 font-bold">{kvCachePct}% GPU VRAM</span>
            </div>
            <input
              type="range"
              min="50"
              max="95"
              value={kvCachePct}
              onChange={(e) => setKvCachePct(Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <span className="text-[10px] text-slate-400 block mt-1">
              Reserves VRAM for concurrent multi-turn chat sessions.
            </span>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
              <span>Context Length Budget</span>
              <span className="font-mono text-cyan-400 font-bold">{(contextWindow / 1024).toFixed(0)}k Tokens</span>
            </div>
            <input
              type="range"
              min="8192"
              max="131072"
              step="8192"
              value={contextWindow}
              onChange={(e) => setContextWindow(Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <span className="text-[10px] text-slate-400 block mt-1">
              Rotary positional embeddings ceiling per session.
            </span>
          </div>

          <div className="flex flex-col justify-between">
            <span className="text-xs text-slate-300 font-semibold">Speculative Decoding</span>
            <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800">
              <span className="text-xs text-slate-400">Draft Model Assist (Phi-4 Mini)</span>
              <button
                onClick={() => setEnableSpeculativeDecoding(!enableSpeculativeDecoding)}
                className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer ${
                  enableSpeculativeDecoding
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {enableSpeculativeDecoding ? 'Enabled (+35%)' : 'Disabled'}
              </button>
            </div>
            <span className="text-[10px] text-slate-400 mt-1">
              Accelerates token generation via speculative draft acceptance.
            </span>
          </div>
        </div>
      </div>

      {/* Real-time Hardware Performance Impact Simulator */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
          Estimated Performance & Footprint for 70B Model
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
            <span className="text-xs text-slate-400 block">Projected Throughput</span>
            <div className="text-2xl font-bold font-mono text-emerald-400 mt-1 tabular-nums">
              ~{estimatedTps} tokens/sec
            </div>
            <span className="text-[11px] text-slate-400 block mt-1">
              With {selectedEngine} continuous batching.
            </span>
          </div>

          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
            <span className="text-xs text-slate-400 block">VRAM Footprint / Node</span>
            <div className="text-2xl font-bold font-mono text-cyan-400 mt-1 tabular-nums">
              {estimatedVramPerReplica} GB
            </div>
            <span className="text-[11px] text-slate-400 block mt-1">
              Fits on 1x H100 80GB or 1x A100 80GB.
            </span>
          </div>

          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
            <span className="text-xs text-slate-400 block">Air-Gap Egress Verification</span>
            <div className="text-2xl font-bold font-mono text-amber-300 mt-1 flex items-center gap-1.5">
              <Check className="w-5 h-5 text-emerald-400" />
              <span>0 B/s Out</span>
            </div>
            <span className="text-[11px] text-slate-400 block mt-1">
              Zero outbound telemetry packets emitted.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
