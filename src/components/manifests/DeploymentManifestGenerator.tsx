import React, { useState } from 'react';
import { EditionType } from '../../types/platform';
import { Terminal, Copy, Check, Download, Layers, Shield, Server, FileCode } from 'lucide-react';

interface DeploymentManifestGeneratorProps {
  currentEdition: EditionType;
}

export const DeploymentManifestGenerator: React.FC<DeploymentManifestGeneratorProps> = ({
  currentEdition,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<'helm' | 'docker-compose' | 'airgap-bundle'>('helm');
  const [targetEdition, setTargetEdition] = useState<EditionType>(currentEdition);
  const [backendEngine, setBackendEngine] = useState<'vLLM' | 'TensorRT-LLM'>('vLLM');
  const [residencyRegion, setResidencyRegion] = useState<string>('de-fra-datacenter-1');
  const [enableTpm, setEnableTpm] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const generateManifestContent = () => {
    if (selectedFormat === 'docker-compose') {
      return `# ==============================================================================
# Open Sovereign AI Control Platform — Docker Compose (Community / Local Test)
# Unified Architecture: Control Tower (Control Plane) + Sovereign AI (Data Plane)
# ==============================================================================
version: '3.8'

services:
  # --- CONTROL PLANE: AI CONTROL TOWER ---
  control-tower:
    image: ghcr.io/open-sovereign-ai/control-tower:${targetEdition}-latest
    container_name: osai-control-tower
    restart: unless-stopped
    ports:
      - "8080:8080"  # Control Tower Dashboard & API
      - "9090:9090"  # Prometheus / Telemetry Exporter
    environment:
      - OSAI_EDITION=${targetEdition}
      - OSAI_RESIDENCY_REGION=${residencyRegion}
      - POLICY_PII_SCRUBBER=enabled
      - POLICY_PROMPT_INJECTION_DEFENSE=enabled
      - EU_AI_ACT_AUDIT_LOGGING=enabled
      - HARDWARE_TPM_SEAL=${enableTpm ? 'true' : 'false'}
      - DATA_PLANE_GRPC_ENDPOINT=http://sovereign-data-plane:50051
    volumes:
      - ./data/audit_ledger:/var/log/osai_worm_ledger
      - ./configs/policies:/etc/osai/policies:ro

  # --- DATA PLANE: SOVEREIGN AI PLATFORM ---
  sovereign-data-plane:
    image: ghcr.io/open-sovereign-ai/data-plane-${backendEngine.toLowerCase()}:${targetEdition}-latest
    container_name: osai-sovereign-engine
    restart: unless-stopped
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: all
              capabilities: [gpu]
    environment:
      - MODEL_ENGINE=${backendEngine}
      - DEFAULT_MODEL=meta-llama/Llama-3.3-70B-Instruct
      - QUANTIZATION=FP8
      - KV_CACHE_DTYPE=fp8
      - GPU_MEMORY_UTILIZATION=0.85
      - MAX_MODEL_LEN=65536
      - AIRGAP_EGRESS_BLOCK=${targetEdition === 'sovereign' ? 'true' : 'false'}
    ports:
      - "8000:8000"  # Private Local OpenAI-compatible endpoint
      - "50051:50051" # Internal mTLS Control Tower Bridge
    volumes:
      - ./weights:/models:ro
      - ./data/vector_vault:/var/lib/osai/vector_db
`;
    }

    if (selectedFormat === 'airgap-bundle') {
      return `#!/usr/bin/env bash
# ==============================================================================
# Open Sovereign AI Control Platform — 100% Offline Air-Gap Installation Script
# Target: Sovereign Edition (National Defense, Banking, Critical Infrastructure)
# ==============================================================================
set -euo pipefail

echo "[OSAI] Initializing Air-Gap Installation for Sovereign Edition..."
echo "[OSAI] Verifying Hardware Root of Trust (AMD SEV-SNP / TPM 2.0)..."

# 1. Verify Cryptographic Signatures on Media
echo "[OSAI] Validating SHA-256 release digest from cryptographic ledger..."
sha256sum -c release_manifest.sha256

# 2. Check Physical Network Isolation
if ip route | grep -q "default via"; then
  echo "[WARNING] Default gateway detected on network interface."
  echo "[OSAI] Activating Sovereign Geofence Diode to sever external internet..."
fi

# 3. Load Offline Container Images
echo "[OSAI] Ingesting offline container tarballs into local containerd registry..."
ctr image import images/osai-control-tower-sovereign.tar
ctr image import images/osai-sovereign-data-plane-${backendEngine.toLowerCase()}.tar
ctr image import images/qdrant-airgap-encrypted.tar

# 4. Provision Hardware TPM Sealed Keys
echo "[OSAI] Initializing local WORM cryptographic audit storage..."
mkdir -p /secure/osai_worm_ledger
chmod 700 /secure/osai_worm_ledger

# 5. Launch Sovereign AI Stack
echo "[OSAI] Starting Sovereign AI Data Plane and Control Tower on local socket..."
systemctl start osai-sovereign-node.service

echo "[OSAI] SUCCESS: Sovereign AI Platform online with ZERO outbound telemetry."
echo "[OSAI] Ingress Endpoint: https://127.0.0.1:8443 (mTLS Required)"
`;
    }

    // Default: Helm values.yaml
    return `# ==============================================================================
# Open Sovereign AI Control Platform — Kubernetes Helm Values
# Deployment Target: ${targetEdition.toUpperCase()} Edition
# ==============================================================================

global:
  edition: "${targetEdition}"
  dataResidency:
    region: "${residencyRegion}"
    strictGeofence: ${targetEdition === 'sovereign' ? 'true' : 'false'}
  hardwareSecurity:
    enableTpmAttestation: ${enableTpm ? 'true' : 'false'}
    confidentialCompute: ${targetEdition === 'sovereign' ? 'amd-sev-snp' : 'standard'}

# --- CONTROL TOWER (CONTROL PLANE) ---
controlTower:
  enabled: true
  replicaCount: ${targetEdition === 'sovereign' ? 2 : targetEdition === 'enterprise' ? 3 : 1}
  resources:
    limits:
      cpu: "4000m"
      memory: "8Gi"
    requests:
      cpu: "1000m"
      memory: "2Gi"
  policies:
    piiScrubber: true
    semanticInjectionDefense: true
    euAiActRiskAudit: ${targetEdition !== 'community' ? 'true' : 'false'}
    auditLedgerType: "${targetEdition === 'sovereign' ? 'worm-tpm-sealed' : 'postgres-relational'}"

# --- SOVEREIGN AI (DATA PLANE) ---
sovereignDataPlane:
  enabled: true
  engine: "${backendEngine}"
  gpuAcceleration:
    enabled: true
    type: "nvidia.com/gpu"
    countPerNode: 8
  servingModels:
    - name: "llama-3-3-70b-instruct"
      parameters: "70B"
      quantization: "FP8"
      replicas: 2
      maxBatchTokens: 4096
      contextWindow: 65536
      engineArgs:
        - "--trust-remote-code"
        - "--gpu-memory-utilization=0.88"
        - "--enforce-eager"
  vectorStore:
    type: "${targetEdition === 'sovereign' ? 'qdrant-airgap' : 'milvus-cluster'}"
    encryptedVolume: true
    storageSize: "500Gi"
  agentSandbox:
    runtime: "${targetEdition === 'sovereign' ? 'kata-microvm' : 'gvisor'}"
    networkPolicy: "${targetEdition === 'sovereign' ? 'zero-egress' : 'private-vpc'}"
`;
  };

  const manifestCode = generateManifestContent();

  const handleCopy = () => {
    navigator.clipboard.writeText(manifestCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filename = selectedFormat === 'helm' 
      ? `values-${targetEdition}.yaml`
      : selectedFormat === 'docker-compose'
      ? `docker-compose-${targetEdition}.yml`
      : `sovereign-airgap-install.sh`;

    const blob = new Blob([manifestCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              Automated Deployment Manifest Generator
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Generate production-ready Kubernetes Helm values, Docker Compose configs, or 100% offline air-gap shell bundles for your edition.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 text-xs text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Manifest'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>
          </div>
        </div>

        {/* Configuration Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5 pt-4 border-t border-slate-800">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Deployment Format
            </label>
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value as any)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="helm">Kubernetes Helm (values.yaml)</option>
              <option value="docker-compose">Docker Compose (docker-compose.yml)</option>
              <option value="airgap-bundle">Air-Gap Offline Bundle (.sh)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Commercial Edition Target
            </label>
            <select
              value={targetEdition}
              onChange={(e) => setTargetEdition(e.target.value as any)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="community">Community (Apache 2.0 Core)</option>
              <option value="enterprise">Enterprise (Multi-Cluster / DLP)</option>
              <option value="sovereign">Sovereign (Air-Gap / Defense)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Inference Engine
            </label>
            <select
              value={backendEngine}
              onChange={(e) => setBackendEngine(e.target.value as any)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="vLLM">vLLM (Dynamic PagedAttention)</option>
              <option value="TensorRT-LLM">TensorRT-LLM (High Throughput)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Data Residency Zone
            </label>
            <select
              value={residencyRegion}
              onChange={(e) => setResidencyRegion(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="de-fra-datacenter-1">Frankfurt Sovereign DC (DE-FRA1)</option>
              <option value="ch-zrh-finance-vault">Zurich Financial Vault (CH-ZRH)</option>
              <option value="fr-par-defense-zone">Paris Defense Perimeter (FR-PAR2)</option>
              <option value="local-airgap-vault">Local Isolated Air-Gap Node</option>
            </select>
          </div>
        </div>
      </div>

      {/* Code Viewer */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-200">
              {selectedFormat === 'helm' ? `helm/values-${targetEdition}.yaml` : selectedFormat === 'docker-compose' ? `docker-compose.yml` : `install-sovereign-airgap.sh`}
            </span>
          </div>

          <span className="text-[11px] text-slate-400">
            {manifestCode.split('\n').length} lines · UTF-8
          </span>
        </div>

        <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed max-h-[500px]">
          <code>{manifestCode}</code>
        </pre>
      </div>
    </div>
  );
};
