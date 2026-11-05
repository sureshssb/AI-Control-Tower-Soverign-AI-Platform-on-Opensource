# Open Sovereign AI Control Platform (OSAI)

> **The Unified Open-Source Operating and Governance Layer for Enterprise AI & Sovereign Deployments**

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Architecture](https://img.shields.io/badge/Architecture-Dual--Plane%20(Control%20%2B%20Data)-cyan.svg)](#architecture)
[![Editions](https://img.shields.io/badge/Editions-Community%20%7C%20Enterprise%20%7C%20Sovereign-emerald.svg)](#commercial-editions)
[![Air-Gap](https://img.shields.io/badge/Sovereignty-100%25%20Air--Gap%20Certified-amber.svg)](#sovereign-edition)

The **Open Sovereign AI Control Platform** provides a complete operating and governance layer for running artificial intelligence securely in enterprise, government, and high-security environments. 

Rather than deploying disconnected point solutions for governance, observability, and private model serving, the platform organizes enterprise AI into a clean **Dual-Plane Architecture** delivered as **one unified product with three progressively unlocked commercial editions**.

---

## Table of Contents

- [Core Architectural Decision](#core-architectural-decision)
- [The Two Products on Top](#the-two-products-on-top)
  - [1. AI Control Tower (Control Plane)](#1-ai-control-tower-control-plane)
  - [2. Sovereign AI Platform (Data Plane)](#2-sovereign-ai-platform-data-plane)
- [Commercial Edition Model](#commercial-edition-model)
  - [Community → Enterprise → Sovereign](#community--enterprise--sovereign)
  - [Capability Entitlement Matrix](#capability-entitlement-matrix)
- [System Architecture & Data Flow](#system-architecture--data-flow)
- [Quick Start](#quick-start)
  - [Prerequisites](#prerequisites)
  - [1. Community Edition (Local Docker Compose)](#1-community-edition-local-docker-compose)
  - [2. Enterprise Edition (Kubernetes via Helm)](#2-enterprise-edition-kubernetes-via-helm)
  - [3. Sovereign Edition (100% Air-Gapped Bare Metal)](#3-sovereign-edition-100-air-gapped-bare-metal)
- [Network Ports & Service Endpoints](#network-ports--service-endpoints)
- [Configuration Reference](#configuration-reference)
- [Governance & Regulatory Compliance](#governance--regulatory-compliance)
- [Repository Structure](#repository-structure)
- [License](#license)

---

## Core Architectural Decision
┌────────────────────────────────────────────────────────────────────────┐
│ AI CONTROL TOWER │
│ (Control Plane) │
│ │
│ • Model Inventory & Registry • Real-time Guardrails & DLP │
│ • Observability & Cost Allocator • Cryptographic Audit Ledger │
└──────────────────────────────────┬─────────────────────────────────────┘
│
mTLS 1.3 / gRPC Control Bus & Air-Gap Diode
│
┌──────────────────────────────────┴─────────────────────────────────────┐
│ SOVEREIGN AI PLATFORM │
│ (Infrastructure & Data Plane) │
│ │
│ • GPU Cluster Orchestration • Private Model Serving (vLLM) │
│ • Air-Gapped Sovereign RAG Vault • Isolated Agent Enclaves │
└────────────────────────────────────────────────────────────────────────┘
Code
The fundamental design decision is the strict separation of concerns between:
1. **Control Plane (`AI Control Tower`)**: Enforces policy, inspects prompts, catalogues models, aggregates telemetry, and signs tamper-evident audit records.
2. **Data / Infrastructure Plane (`Sovereign AI Platform`)**: Executes private model weights, manages physical GPUs (H100/A100/MI300), indexes confidential vector stores, and executes agent sandboxes with zero external network egress.

---

## The Two Products on Top

### 1. AI Control Tower (Control Plane)
The governance, compliance, and observability headquarters:
- **Model Inventory & Catalog**: Authoritative registry for open-source weights (Llama 3.3, DeepSeek R1, Mistral Large, Qwen 2.5 Coder, Phi-4) and proxy gateways. Tracks licenses, parameter sizes, quantization, and context lengths.
- **EU AI Act Risk Categorization**: Automated categorization under Minimal Risk, Limited Risk, and Annex III High Risk use cases with mandatory human-in-the-loop triggers.
- **In-Line Policy & Guardrail Engine**: Sub-4ms inline inspection engine providing PII scrubbing (SSNs, IBANs, API keys), prompt injection/jailbreak defense, and cross-border data residency geofencing.
- **Observability & Departmental Cost Allocation**: Centralized token counters, P50/P95/P99 latency tracking (TTFT, inter-token), and cost center attribution across business units.
- **Cryptographic Audit Ledger**: Immutable WORM (Write Once, Read Many) log storing SHA-256 digests of every prompt, residency node stamps, and hardware TPM attestations.

### 2. Sovereign AI Platform (Data Plane)
The self-hosted private compute and inference infrastructure:
- **Bare-Metal GPU Orchestration**: Cluster topology management across NVIDIA H100 SXM5, A100 NVLink, B200, and AMD Instinct MI300X with live VRAM allocation, node drain, and air-gap quarantine switches.
- **Private Model Serving Engine**: Powered by vLLM, TensorRT-LLM, and Ollama with continuous dynamic batching, PagedAttention KV-cache management, and FP8/INT4/BF16 precision tuning.
- **Air-Gapped Sovereign RAG Vault**: Private vector databases (Qdrant, Milvus, Chroma) running fully offline with hardware TPM-sealed partitions and local sovereign embeddings (BAAI/BGE, e5).
- **Isolated Agent Sandboxes**: MicroVM (Kata / Firecracker) and gVisor sandboxes running code interpreters and SQL querying tools under strict zero-egress network policies.

---

## Commercial Edition Model

### Community → Enterprise → Sovereign
The platform is packaged as **one core product with three progressive commercial editions** rather than three fragmented codebases. Organizations begin with the free, open-source Community edition and upgrade to Enterprise or Sovereign editions via entitlement flags without refactoring their models or data pipelines.

| Dimension | Community Edition | Enterprise Edition | Sovereign Edition |
| :--- | :--- | :--- | :--- |
| **Target Audience** | Developers, startups, labs | Enterprises, banks, healthcare | Defense, national security, critical infra |
| **Licensing** | Apache 2.0 (Open Source) | Commercial Subscription | Sovereign Government Agreement |
| **Pricing** | Free Forever | Per GPU Node / Month | Annual Sovereign Infrastructure Program |
| **Deployment** | Single Node / Local Docker / K8s | Multi-Cluster, Multi-Cloud VPC | 100% Offline Air-Gapped Bare Metal |
| **Control Plane** | Local Catalog & SQLite/Postgres | Multi-Region Hub & Spoke | Air-Gap Diode & WORM Storage |
| **Data Plane** | Local vLLM / Ollama | HA Autoscaled Cluster | Bare-Metal RDMA / InfiniBand |
| **Confidential Computing** | Software standard | Cloud Enclaves (Optional) | Native AMD SEV-SNP & Intel TDX |
| **Updates** | Docker Pull / Git | Enterprise Registry CI/CD | Cryptographically Signed Offline Media |

### Capability Entitlement Matrix

| Feature Module | Community | Enterprise | Sovereign |
| :--- | :---: | :---: | :---: |
| Single-Node Model Serving (vLLM / Ollama) | Included | Included | Included |
| Basic Regex & Keyword Guardrails | Included | Included | Included |
| Local Token Telemetry & SQLite/Postgres Logs | Included | Included | Included |
| Multi-Cluster Control Tower Federation | — | Included | Included |
| Semantic DLP Embeddings & Semantic Firewall | — | Included | Included |
| EU AI Act Annex III Compliance Automations | — | Included | Included |
| SSO (SAML 2.0, OIDC) & Department Quotas | — | Included | Included |
| OpenTelemetry & Datadog Streaming Exporter | — | Included | Included |
| 100% Air-Gapped & Zero Network Egress Certification | — | — | Included |
| Hardware TPM 2.0 Cryptographic Attestation | — | — | Included |
| AMD SEV-SNP / Intel TDX Hardware Enclaves | — | — | Included |
| Hardware Geofence Egress Diode | — | — | Included |
| Offline Cryptographic Update Bundle Ingestion | — | — | Included |

---

## System Architecture & Data Flow
[ Client Application / User ]
│
▼ (Port 8080: Ingress Prompt)
┌─────────────────────────────────────────────────────────────┐
│ AI CONTROL TOWER (Control Plane) │
│ 1. In-Line PII & DLP Scrubber (SSN/IBAN Redaction) │
│ 2. Heuristic Prompt Injection & Jailbreak Defense │
│ 3. Data Sovereignty & Geofence Validator │
│ 4. SHA-256 Hash Digest Recorded in WORM Ledger │
└──────────────────────────────┬──────────────────────────────┘
│ (mTLS 1.3 / gRPC internal stream)
▼
┌─────────────────────────────────────────────────────────────┐
│ SOVEREIGN AI PLATFORM (Data Plane) │
│ 1. Local vLLM / TensorRT-LLM Continuous Batching Engine │
│ 2. Private Sovereign RAG Retrieval (Qdrant / Milvus) │
│ 3. PagedAttention KV-Cache Execution on NVIDIA H100 Cards │
│ 4. Zero External Network Egress Verified │
└──────────────────────────────┬──────────────────────────────┘
│
▼ (Port 8000: Model Completion)
[ Client Application Receives Cryptographically Audited Tokens ]
Code
---

## Quick Start

### Prerequisites
- Linux (Ubuntu 22.04+ or RHEL 9+)
- Docker 24.0+ & Docker Compose v2
- NVIDIA GPU Driver 535+ and NVIDIA Container Toolkit (for GPU inference)

### 1. Community Edition (Local Docker Compose)

```bash
# Clone the repository
git clone https://github.com/open-sovereign-ai/platform.git
cd platform

# Launch Community Stack
docker compose -f deployments/docker-compose.community.yml up -d
Access the interfaces:
AI Control Tower Console: http://localhost:8080
OpenAI-Compatible Inference Endpoint: http://localhost:8000/v1/chat/completions
Prometheus Telemetry: http://localhost:9090
2. Enterprise Edition (Kubernetes via Helm)
Bash
# Add the Open Sovereign AI Helm repository
helm repo add osai https://charts.open-sovereign-ai.org
helm repo update

# Install Enterprise Edition
helm install osai-cluster osai/open-sovereign-ai \
  --namespace osai-system --create-namespace \
  -f deployments/helm/values-enterprise.yaml \
  --set global.edition=enterprise \
  --set global.dataResidency.region="de-fra-datacenter-1"
3. Sovereign Edition (100% Air-Gapped Bare Metal)
Bash
# 1. Mount signed offline distribution media
mount /dev/sdb1 /mnt/airgap-media

# 2. Run the verified offline installer
cd /mnt/airgap-media
sha256sum -c release_manifest.sha256
sudo ./sovereign-airgap-install.sh --region="de-bsi-vault-alpha" --enable-tpm
Network Ports & Service Endpoints
Port	Protocol	Component	Purpose
8080	HTTP / HTTPS	AI Control Tower	Web UI, Governance REST API, Model Catalog
8000	HTTP / HTTPS	Sovereign AI Engine	OpenAI-compatible inference (/v1/chat/completions)
9090	HTTP	Telemetry Collector	Prometheus metrics / OpenTelemetry exporter
50051	gRPC (mTLS)	Sovereignty Bridge	Internal Control Plane ⇄ Data Plane communication
6333	gRPC / HTTP	Sovereign RAG	Offline Qdrant / Milvus vector index store
Configuration Reference
Key environment variables configurable in .env or Helm values.yaml:
Env
# Platform Edition: community | enterprise | sovereign
OSAI_EDITION="sovereign"

# Data Residency Pinning
OSAI_RESIDENCY_REGION="Frankfurt-Vault-Alpha"
OSAI_STRICT_GEOFENCE="true"

# Control Tower Policy Enforcement
POLICY_PII_SCRUBBER="enabled"
POLICY_PROMPT_INJECTION="enabled"
POLICY_EU_AI_ACT_AUDIT="enabled"

# Sovereign AI Inference Engine
MODEL_ENGINE="vLLM"
PRIMARY_MODEL="meta-llama/Llama-3.3-70B-Instruct"
QUANTIZATION="FP8"
GPU_MEMORY_UTILIZATION="0.88"
MAX_MODEL_LEN="65536"

# Security & Hardware Attestation
AIRGAP_EGRESS_BLOCK="true"
HARDWARE_TPM_SEAL="true"
CONFIDENTIAL_COMPUTE="amd-sev-snp"
Governance & Regulatory Compliance
EU AI Act Ready: Automated classification matrix compliant with Annex III obligations for high-risk AI systems, providing automated logging, technical documentation, and record retention.
NIST AI RMF: Built according to the NIST Artificial Intelligence Risk Management Framework core functions (Govern, Map, Measure, Manage).
Immutable WORM Audit: Every inference transaction is stamped with a SHA-256 prompt hash, model ID, residency zone, and hardware TPM digital signature.
Repository Structure
Code
├── deployments/                  # Deployment automation
│   ├── docker-compose.community.yml
│   ├── docker-compose.enterprise.yml
│   └── helm/values-sovereign.yaml
├── src/
│   ├── components/
│   │   ├── control-tower/        # Control Plane UI & API bindings
│   │   │   ├── ModelInventory.tsx
│   │   │   ├── PolicyGuardrails.tsx
│   │   │   ├── ObservabilityMetrics.tsx
│   │   │   └── AuditLedger.tsx
│   │   ├── sovereign-ai/         # Data Plane UI & runtime controls
│   │   │   ├── GpuOrchestrator.tsx
│   │   │   ├── ModelServingEngine.tsx
│   │   │   ├── SovereignRagVault.tsx
│   │   │   └── AgentSandbox.tsx
│   │   ├── editions/             # Commercial matrix & entitlement
│   │   │   └── EditionComparison.tsx
│   │   └── manifests/            # Manifest generators
│   │       └── DeploymentManifestGenerator.tsx
│   ├── data/initialData.ts       # Baseline catalog, nodes & policies
│   ├── types/platform.ts         # TypeScript interfaces
│   ├── App.tsx                   # Unified platform application
│   └── main.tsx
├── package.json
└── README.md
License
The Open Sovereign AI Control Platform core is licensed under the Apache License 2.0.
Commercial editions (Enterprise and Sovereign) are provided under commercial license terms with advanced multi-cluster federation, hardware TPM attestation, and certified air-gap support.
Code
### Highlights of What's Included:
1. **Architectural Separation**: Clarifies Control Plane (AI Control Tower) vs Data Plane (Sovereign AI Platform).
2. **Commercial Editions Framework**: Full breakdown of the **Community → Enterprise → Sovereign** progressive unlocking model on a single core codebase.
3. **Quick Start Commands**: Docker Compose, Kubernetes Helm, and 100% offline air-gap script guides.
4. **Ports, Environment Variables, and Compliance**: Clear reference tables for EU AI Act, NIST AI RMF, and network topologies.

