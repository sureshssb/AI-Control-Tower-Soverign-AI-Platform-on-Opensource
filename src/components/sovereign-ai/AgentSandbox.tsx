import React, { useState } from 'react';
import { AgentSandboxRecord, EditionType } from '../../types/platform';
import { Bot, Terminal, Shield, Play, CheckCircle2, Lock, Cpu, RefreshCw, AlertTriangle } from 'lucide-react';

interface AgentSandboxProps {
  sandboxes: AgentSandboxRecord[];
  currentEdition: EditionType;
}

export const AgentSandbox: React.FC<AgentSandboxProps> = ({ sandboxes, currentEdition }) => {
  const [activeSandboxId, setActiveSandboxId] = useState<string>(sandboxes[0]?.id || '');
  const [testToolCommand, setTestToolCommand] = useState<string>('SELECT count(*), risk_score FROM internal_banking_ledger WHERE flag = 1;');
  const [isExecutingTool, setIsExecutingTool] = useState(false);
  const [executionResult, setExecutionResult] = useState<{
    output: string;
    networkPacketsBlocked: number;
    enclaveAttestation: string;
    durationMs: number;
  } | null>(null);

  const selectedAgent = sandboxes.find((s) => s.id === activeSandboxId) || sandboxes[0];

  const handleExecuteTool = () => {
    setIsExecutingTool(true);
    setExecutionResult(null);

    setTimeout(() => {
      setIsExecutingTool(false);
      setExecutionResult({
        output: 'Rows returned: 42 records.\nQuery verified against readonly local schema.\nZero external network interfaces reachable.',
        networkPacketsBlocked: 3, // Blocked attempts to resolve external DNS or external endpoints
        enclaveAttestation: 'AMD SEV-SNP Enclave Measurement: SHA256[9a8b...14e2]',
        durationMs: 14,
      });
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Bot className="w-4 h-4 text-emerald-400" />
              Sovereign Agent Sandboxes & Enclaves
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Isolated tool execution runtime for autonomous reasoning agents with kernel-level network egress kill switches.
            </p>
          </div>

          <span className="text-xs font-mono text-cyan-300 bg-cyan-950/60 px-2.5 py-1 rounded border border-cyan-800/50">
            gVisor & MicroVM Hypervisor Enclaves
          </span>
        </div>
      </div>

      {/* Sandboxes Fleet Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sandboxes.map((agent) => {
          const isSelected = agent.id === activeSandboxId;
          const isUnlocked = currentEdition === 'sovereign' ||
                            (currentEdition === 'enterprise' && agent.minEdition !== 'sovereign') ||
                            agent.minEdition === 'community';

          return (
            <div
              key={agent.id}
              onClick={() => setActiveSandboxId(agent.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-slate-800/90 border-emerald-500 shadow-lg shadow-emerald-950/40'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              } ${!isUnlocked ? 'opacity-70' : ''}`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h4 className="text-xs font-bold text-white">{agent.name}</h4>
                  <div className="text-[11px] text-slate-400">{agent.role}</div>
                </div>

                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-emerald-400 border border-slate-800">
                  {agent.status}
                </span>
              </div>

              <div className="space-y-1.5 text-[11px] mt-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Foundation Model:</span>
                  <span className="font-mono text-slate-200">{agent.baseModel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Memory Isolation:</span>
                  <span className="font-mono text-cyan-400">{agent.memoryIsolation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Egress Boundary:</span>
                  <span className="font-mono text-amber-300">{agent.egressPolicy}</span>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>{agent.allowedTools.length} sandboxed tools</span>
                <span className="font-mono text-slate-300">{agent.activeSessions} active sessions</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Agent Tool Execution Sandbox Terminal */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              Isolated Tool Execution Console: {selectedAgent.name}
            </h4>
            <span className="text-[11px] text-slate-400">
              Isolation: {selectedAgent.memoryIsolation} · Network: {selectedAgent.egressPolicy}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Tools Authorized:</span>
            <div className="flex gap-1">
              {selectedAgent.allowedTools.map((t, idx) => (
                <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800 font-mono">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Execute Sandboxed Command / Tool Call Payload
            </label>
            <input
              type="text"
              value={testToolCommand}
              onChange={(e) => setTestToolCommand(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleExecuteTool}
              disabled={isExecutingTool}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {isExecutingTool ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Play className="w-3.5 h-3.5" />
              )}
              <span>Run in MicroVM Sandbox</span>
            </button>
          </div>

          {executionResult && (
            <div className="mt-3 p-4 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs space-y-2">
              <div className="text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Execution Succeeded in {executionResult.durationMs}ms (Isolated Hypervisor)</span>
              </div>
              <div className="text-slate-300 whitespace-pre-wrap bg-slate-900/80 p-2.5 rounded border border-slate-800">
                {executionResult.output}
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-[11px]">
                <div className="text-amber-400">
                  Outbound Egress Attempts Deflected: {executionResult.networkPacketsBlocked} packets
                </div>
                <div className="text-slate-400 truncate">
                  {executionResult.enclaveAttestation}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
