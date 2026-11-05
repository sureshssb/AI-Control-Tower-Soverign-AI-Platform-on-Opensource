import React, { useState } from 'react';
import { AuditRecord, EditionType } from '../../types/platform';
import { 
  Lock, Search, ShieldCheck, AlertOctagon, Download, CheckCircle2, 
  FileText, ExternalLink, HardDrive, KeyRound 
} from 'lucide-react';

interface AuditLedgerProps {
  logs: AuditRecord[];
  currentEdition: EditionType;
}

export const AuditLedger: React.FC<AuditLedgerProps> = ({ logs, currentEdition }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [verdictFilter, setVerdictFilter] = useState<string>('all');
  const [selectedRecord, setSelectedRecord] = useState<AuditRecord | null>(null);

  const filteredLogs = logs.filter((l) => {
    const matchesSearch = l.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          l.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          l.promptHash.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          l.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVerdict = verdictFilter === 'all' || l.policyResult === verdictFilter;
    return matchesSearch && matchesVerdict;
  });

  const handleExportAudit = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(filteredLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `sovereign_audit_ledger_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-5">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-lg">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by actor, prompt SHA-256 hash, model..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <select
            value={verdictFilter}
            onChange={(e) => setVerdictFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="all">All Verdicts</option>
            <option value="passed">Passed</option>
            <option value="redacted">Redacted</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>

        <button
          onClick={handleExportAudit}
          className="px-3.5 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
        >
          <Download className="w-4 h-4 text-cyan-400" />
          <span>Export Forensic Audit Trail</span>
        </button>
      </div>

      {/* Audit Log Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/70 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Timestamp & Record ID</th>
                <th className="py-3 px-4">Actor / Department</th>
                <th className="py-3 px-4">Model & Residency Node</th>
                <th className="py-3 px-4">Prompt SHA-256 Digest</th>
                <th className="py-3 px-4 text-center">Policy Verdict</th>
                <th className="py-3 px-4 text-right">Tokens</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono text-[11px]">
              {filteredLogs.map((log) => (
                <tr
                  key={log.id}
                  className="hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="text-white font-medium">{log.id}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{log.timestamp}</div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="text-slate-200">{log.actor}</div>
                    <div className="text-[10px] text-slate-400 font-sans">{log.department}</div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="text-cyan-300 font-sans font-medium">{log.model}</div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <HardDrive className="w-3 h-3 text-emerald-400" />
                      <span>{log.residencyNode}</span>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-slate-400 text-[10px]">
                    <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800/80">
                      {log.promptHash}
                    </span>
                    <div className="text-[9px] text-slate-400 mt-1">
                      Sig: {log.cryptographicSignature}
                    </div>
                  </td>

                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                        log.policyResult === 'passed'
                          ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/60'
                          : log.policyResult === 'redacted'
                          ? 'bg-amber-950/70 text-amber-300 border border-amber-800/60'
                          : 'bg-red-950/70 text-red-300 border border-red-800/60'
                      }`}
                    >
                      {log.policyResult}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right tabular-nums text-slate-300">
                    <div>{log.promptTokens + log.completionTokens} total</div>
                    <div className="text-[10px] text-slate-400">
                      {log.promptTokens} in / {log.completionTokens} out
                    </div>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedRecord(log)}
                      className="text-xs text-cyan-400 hover:text-cyan-300 font-sans font-medium cursor-pointer"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Inspect Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl relative">
            <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-cyan-400" />
              Cryptographic Audit Certificate ({selectedRecord.id})
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Immutable provenance record stored in WORM forensic storage.
            </p>

            <div className="space-y-3 bg-slate-950 p-4 rounded-lg border border-slate-800 text-xs font-mono">
              <div>
                <span className="text-slate-400">Timestamp: </span>
                <span className="text-slate-200">{selectedRecord.timestamp} UTC</span>
              </div>
              <div>
                <span className="text-slate-400">Requesting Actor: </span>
                <span className="text-slate-200">{selectedRecord.actor} ({selectedRecord.department})</span>
              </div>
              <div>
                <span className="text-slate-400">Serving Sovereign Model: </span>
                <span className="text-cyan-400">{selectedRecord.model}</span>
              </div>
              <div>
                <span className="text-slate-400">Physical Residency Node: </span>
                <span className="text-emerald-400">{selectedRecord.residencyNode}</span>
              </div>
              <div>
                <span className="text-slate-400">Prompt Hash: </span>
                <div className="text-[11px] text-slate-300 break-all bg-slate-900 p-1.5 rounded mt-0.5">
                  {selectedRecord.promptHash}
                </div>
              </div>
              <div>
                <span className="text-slate-400">Cryptographic Seal: </span>
                <div className="text-[11px] text-amber-300 break-all bg-slate-900 p-1.5 rounded mt-0.5">
                  {selectedRecord.cryptographicSignature}
                </div>
              </div>
              <div>
                <span className="text-slate-400">Enforced Policies: </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedRecord.appliedPolicies.map((p, idx) => (
                    <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-1.5 text-xs font-medium text-white bg-slate-800 hover:bg-slate-700 rounded-lg cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
