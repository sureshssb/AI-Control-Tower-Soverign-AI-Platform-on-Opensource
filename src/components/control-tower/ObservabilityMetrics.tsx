import React, { useState } from 'react';
import { EditionType } from '../../types/platform';
import { 
  Activity, DollarSign, Clock, Zap, ShieldAlert, BarChart3, 
  ArrowUpRight, Download, Share2, Filter 
} from 'lucide-react';

interface ObservabilityMetricsProps {
  currentEdition: EditionType;
}

export const ObservabilityMetrics: React.FC<ObservabilityMetricsProps> = ({ currentEdition }) => {
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d'>('24h');

  const departmentAllocations = [
    { dept: 'Autonomous Systems & Robotics', tokensM: 142.8, costEst: '$428.40', sharePct: 38, model: 'Llama 3.3 70B' },
    { dept: 'Quantitative Risk & Finance', tokensM: 98.4, costEst: '$295.20', sharePct: 26, model: 'DeepSeek R1 671B' },
    { dept: 'Platform Software Engineering', tokensM: 74.2, costEst: '$148.40', sharePct: 20, model: 'Qwen 2.5 Coder' },
    { dept: 'Legal & Regulatory Compliance', tokensM: 38.6, costEst: '$115.80', sharePct: 10, model: 'Mistral Large 2' },
    { dept: 'Internal Ops & IT Helpdesk', tokensM: 22.1, costEst: '$44.20', sharePct: 6, model: 'Phi-4 Mini' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Controls & Time Range Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-xl p-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            Control Tower Observability & Cost Allocator
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time inference telemetry, latency percentiles, and departmental token budgets across sovereign nodes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg bg-slate-950 p-1 border border-slate-800 text-xs">
            {(['1h', '24h', '7d'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  timeRange === r
                    ? 'bg-slate-800 text-cyan-300 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            onClick={() => {}}
            className="px-3 py-1.5 text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export OTel Metrics</span>
          </button>
        </div>
      </div>

      {/* KPI Stat Cards (Structured Stat Grid per Frontend Design constitution) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Ingested Tokens</span>
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-white mt-2">
            376.1M
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-mono">
            <span>+18.4%</span>
            <span className="text-slate-400 font-sans">vs previous period</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>P95 Time-To-First-Token</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-white mt-2">
            34.2 ms
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">
            P50: 18ms · P99: 58ms (vLLM Engine)
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Air-Gap Cost Equivalence</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-white mt-2">
            $1,032.00
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 font-mono">
            Saved 84% vs Commercial SaaS API
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Policy Interception Rate</span>
            <ShieldAlert className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-white mt-2">
            2.41%
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">
            1,894 PII redactions · 42 blocks
          </div>
        </div>
      </div>

      {/* Department Token & Cost Allocation (Tabular View) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Departmental Cost & Token Allocation Breakdown
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Granular tenant chargeback enabled via Enterprise Control Tower identity bindings.
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-400">
            5 Active Cost Centers
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/70 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                <th className="py-2.5 px-4">Department / Tenant</th>
                <th className="py-2.5 px-4">Primary Sovereign Model</th>
                <th className="py-2.5 px-4 text-right">Tokens (Million)</th>
                <th className="py-2.5 px-4 text-right">Cost Allocation</th>
                <th className="py-2.5 px-4">Fleet Workload Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {departmentAllocations.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-semibold text-white">
                    {item.dept}
                  </td>
                  <td className="py-3 px-4 text-slate-300 font-mono text-[11px]">
                    {item.model}
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-200">
                    {item.tokensM.toFixed(1)}M
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums text-emerald-400 font-semibold">
                    {item.costEst}
                  </td>
                  <td className="py-3 px-4 w-48">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-cyan-500 rounded-full"
                          style={{ width: `${item.sharePct}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-mono tabular-nums text-slate-400 w-8 text-right">
                        {item.sharePct}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
