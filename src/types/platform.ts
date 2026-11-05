export type EditionType = 'community' | 'enterprise' | 'sovereign';

export type ProductPlane = 'control-tower' | 'sovereign-ai' | 'architecture' | 'editions' | 'manifests';

export type RiskTier = 'minimal' | 'limited' | 'high' | 'prohibited';

export interface ModelRecord {
  id: string;
  name: string;
  family: string;
  parameters: string;
  version: string;
  license: string;
  servingBackend: 'vLLM' | 'TensorRT-LLM' | 'Ollama' | 'External Proxy';
  hostingLocation: 'On-Premises Air-Gap' | 'Private Sovereign Cloud' | 'Enterprise VPC' | 'Commercial API Gateway';
  dataResidency: string; // e.g. "Frankfurt, EU-Central", "Local Airgap Node", "US-East"
  riskTier: RiskTier;
  approvalStatus: 'approved' | 'restricted' | 'pending_audit' | 'revoked';
  contextWindow: number;
  quantization: 'FP8' | 'INT4' | 'BF16' | 'FP16' | 'Unquantized';
  minEdition: EditionType;
  throughputTps: number;
  averageLatencyMs: number;
  activeReplicas: number;
}

export interface GuardrailPolicy {
  id: string;
  name: string;
  category: 'pii_dlp' | 'prompt_injection' | 'data_sovereignty' | 'toxic_content' | 'jailbreak_defense';
  enabled: boolean;
  action: 'redact' | 'block' | 'flag_and_forward' | 'quarantine';
  minEdition: EditionType;
  description: string;
  rulesEnforced: string[];
}

export interface AuditRecord {
  id: string;
  timestamp: string;
  actor: string;
  department: string;
  model: string;
  direction: 'ingress' | 'egress';
  promptHash: string;
  policyResult: 'passed' | 'redacted' | 'blocked' | 'quarantined';
  appliedPolicies: string[];
  residencyNode: string;
  cryptographicSignature: string;
  latencyMs: number;
  promptTokens: number;
  completionTokens: number;
}

export interface GpuNode {
  id: string;
  name: string;
  cluster: string;
  gpuType: 'NVIDIA H100 80GB SXM5' | 'NVIDIA A100 80GB NVLink' | 'NVIDIA B200 192GB' | 'AMD Instinct MI300X';
  gpuCount: number;
  vramTotalGb: number;
  vramUsedGb: number;
  utilizationPct: number;
  temperatureC: number;
  powerWatts: number;
  airGapped: boolean;
  status: 'healthy' | 'high_load' | 'quarantined' | 'offline';
  hostedModels: string[];
  location: string;
}

export interface RagIndex {
  id: string;
  name: string;
  collection: string;
  documentsCount: number;
  vectorsCount: number;
  embeddingModel: string;
  vectorDb: 'Milvus Sovereign' | 'Qdrant Airgap' | 'Chroma Local' | 'pgvector Enterprise';
  encryption: 'AES-256-GCM' | 'Hardware TPM Sealed' | 'Standard TLS';
  minEdition: EditionType;
  isolationLevel: 'Tenant VPC' | 'Air-Gap Physical Partition' | 'Namespace RBAC';
  status: 'indexed' | 'syncing' | 'optimizing';
}

export interface AgentSandboxRecord {
  id: string;
  name: string;
  role: string;
  baseModel: string;
  allowedTools: string[];
  egressPolicy: 'Zero External Egress (Air-Gap)' | 'Approved Private VPC Only' | 'Filtered Gateway';
  memoryIsolation: 'Hypervisor-Enclave' | 'Docker gVisor' | 'Process Namespace';
  minEdition: EditionType;
  activeSessions: number;
  status: 'active' | 'idle' | 'restricted';
}
