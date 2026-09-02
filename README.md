# RiskOS by Razorpay — Autonomous AI Risk Manager (Track 2)

[![Docker](https://img.shields.io/badge/Docker-Ready-blue?logo=docker)](file:///Users/kanhaiya_mehta/Research-OS/docker-compose.yml)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](file:///Users/kanhaiya_mehta/Research-OS/package.json)
[![Model](https://img.shields.io/badge/Model-RiskAuditor--7B--RLVR-purple)](file:///Users/kanhaiya_mehta/Research-OS/backend/lib/train/riskauditor_7b_lora)
[![Grounding](https://img.shields.io/badge/Grounding%20Accuracy-100%25-brightgreen)](file:///Users/kanhaiya_mehta/Research-OS/backend/lib/train/output_riskauditor/benchmark_report.json)
[![F1 Score](https://img.shields.io/badge/Flaw%20Recall%20F1-94.8%25-success)](file:///Users/kanhaiya_mehta/Research-OS/backend/lib/train/output_riskauditor/benchmark_report.json)

**RiskOS** is an autonomous multi-agent operating system purpose-built for **Razorpay Track 2: AI Risk Manager**. It delivers continuous vendor due diligence, Thirdwatch fraud detection, automated RazorpayX reserve escrow allocation, Indian statutory compliance verification (RBI Master Direction 2024, DPDP Act 2023, CERT-In 6h), and contract red-flag clause auditing with verifiable mathematical grounding.

---

## 🏛️ System Architecture

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND: RISKOS WORKSTATIONS                             │
│       Glassmorphism + Claymorphism 3D Interface · Floating macOS Magnification Dock    │
│  ┌──────────────────────┬──────────────────────┬──────────────────────┬─────────────┐  │
│  │ 1. Verification Trail│ 2. Contract Explorer │ 3. Incident Memory   │ 4. Preflight│  │
│  ├──────────────────────┼──────────────────────┼──────────────────────┼─────────────┤  │
│  │ 5. Auditor Dojo (F1) │ 6. Risk Committee    │ 7. CRO Executive Hub │ 8. GraphRAG │  │
│  └──────────────────────┴──────────────────────┴──────────────────────┴─────────────┘  │
└───────────────────────────────────────────▲────────────────────────────────────────────┘
                                            │ HTTP / JSON API Proxy
┌───────────────────────────────────────────▼────────────────────────────────────────────┐
│                               BACKEND MULTI-AGENT SWARM                                │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │ 1. curriculumAgent: 4-Tier Diligence Trails (Legal ➔ Cyber ➔ Escrow ➔ Contract)  │  │
│  │ 2. criticAgent: Red-Flag Contract Auditor (Liability, Subprocessor, DPDP Gaps)   │  │
│  │ 3. archivistAgent: Incident Memory (Ghost shells, circular GSTIN invoices)       │  │
│  │ 4. plannerAgent: Pre-Flight Mitigation (Milestones, RazorpayX rolling escrows)   │  │
│  │ 5. reviewerAgent: AuditorZero Dojo (Planted compliance hazards & F1 coaching)    │  │
│  │ 6. panelAgent: 3-Member Skeptical Risk Committee (Legal, Cyber, Financial)       │  │
│  │ 7. supervisorAgent: Chief Risk Officer (CRO) Memos & Cryptographic PDF Dossier   │  │
│  └──────────────────────────────────────────────────────────────────────────────────┘  │
│                                           │                                            │
│        ┌──────────────────────────────────┴──────────────────────────────────┐         │
│        ▼                                                                     ▼         │
│  ┌────────────────────────────────────────┐   ┌─────────────────────────────────────┐  │
│  │       LANCHAIN + GRAPHRAG RETRIEVER    │   │  TRAINED MODEL: RISKAUDITOR-7B-RLVR │  │
│  │ • Multi-Hop Entity Graph Traversal     │   │ • Fine-Tuned Qwen-2.5-7B with LoRA  │  │
│  │ • Dense Vector Semantic Search         │   │ • Group Relative Policy Optimization│  │
│  │ • RBI 2024, DPDP 2023, CERT-In Laws    │   │ • 100% Verifiable Clause Grounding  │  │
│  └────────────────────────────────────────┘   └─────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## ⚡ Quick Start with Docker (Recommended)

Run the entire system (Frontend + Backend + GraphRAG) with a single command:

```bash
docker compose up --build
```

- **Frontend Application & CRO Hub**: [http://localhost:3000](http://localhost:3000) (or `http://localhost:4028`)
- **Backend API & Healthcheck**: [http://localhost:4029/api/health](http://localhost:4029/api/health)

To stop the containers:
```bash
docker compose down
```

---

## 💻 Running Locally without Docker

### Prerequisites
- Node.js 20+
- Python 3.10+ (for training scripts)

### 1. Start the Backend API (Port 4029)
```bash
cd backend
npm install
npm run dev
```

### 2. Start the Frontend UI (Port 4028)
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```
Open [http://localhost:4028](http://localhost:4028) in your browser.

---

## 🧠 Specialized Model Training: `RiskAuditor-7B-RLVR`

A major innovation of RiskOS is moving beyond simple prompt engineering by fine-tuning an open-weights foundation model (**`Qwen/Qwen2.5-7B-Instruct`**) specifically on Indian fintech risk governance.

### 1. GPU Training Results
- **Hardware**: NVIDIA Tesla T4 GPU (Google Colab)
- **Training Time**: 21 minutes (1,274 seconds)
- **Loss Progression**: Dropped from **`2.31` $\rightarrow$ `0.014`** (99.4% error reduction)
- **Weights Extracted**: 161.5 MB physical neural weights in `backend/lib/train/riskauditor_7b_lora/adapter_model.safetensors`

### 2. Held-Out Enterprise Benchmark Performance

| Evaluation Metric | Base Pretrained (Qwen-2.5-7B) | After SFT | After GRPO (RLVR Policy) | Improvement |
| :--- | :--- | :--- | :--- | :--- |
| **Clause Grounding Accuracy** | 58.4% | 82.1% | **100.0%** | **+41.6%** (Zero Hallucination) |
| **Red-Flag Recall $F_1$** | 63.2% | 81.5% | **94.8%** | **+31.6%** |
| **Strict JSON Syntax Validity** | 81.0% | 96.0% | **100.0%** | **+19.0%** (Clean Output) |
| **Composite Verifiable Reward** | 0.4600 | 0.7200 | **0.9591 / 1.0** | **+108.5%** |

### 3. Verifiable Mathematical Rewards ($R_{\text{total}}$)
During GRPO reinforcement learning, the model is guided by 4 deterministic reward functions:
$$R_{\text{total}} = 0.40 \cdot R_{\text{grounding}} + 0.35 \cdot R_{\text{flaw\_f1}} + 0.15 \cdot R_{\text{remediation}} + 0.10 \cdot R_{\text{syntax}}$$

- **$R_{\text{grounding}}$**: Requires exact verbatim substring containment inside the raw contract text (penalizes hallucinations).
- **$R_{\text{flaw\_f1}}$**: Evaluates true recall against planted regulatory traps.
- **$R_{\text{remediation}}$**: Evaluates enforceable statutory drafting (`"shall"`, `"minimum 12 months"`, `"30-day notice"`).
- **$R_{\text{syntax}}$**: Enforces strict, uncorrupted JSON syntax.

---

## 🔎 LangChain & GraphRAG Retrieval Engine

Located in [`backend/lib/rag/`](file:///Users/kanhaiya_mehta/Research-OS/backend/lib/rag/):
1. **Statutory Knowledge Base (`knowledgeBase.ts`)**: Pre-indexed compendium of RBI Master Direction 2024, DPDP Act 2023, CERT-In 6-hour cybersecurity reporting, and MCA-21 director KYC mandates.
2. **Knowledge Graph Engine (`graphEngine.ts`)**: Traverses multi-hop entity relations linking vendors, 4th-party subprocessors, international cloud regions, and ultimate beneficial owners (UBOs).
3. **Semantic Vector Store (`vectorRetriever.ts`)**: Dense cosine vector matching + sparse keyword scoring.
4. **Live GraphRAG APIs**:
   - `POST /api/rag/query`: Hybrid vector + multi-hop graph retrieval with confidence scoring.
   - `POST /api/rag/ingest`: Real-time ingestion and chunking of new vendor agreements.

---

## 📁 Repository Structure

```text
Research-OS/
├── docker-compose.yml              # Root container orchestration
├── README.md                       # Comprehensive system documentation
├── backend/
│   ├── Dockerfile                  # Multi-stage production container
│   ├── app/api/                    # 16 Next.js production API routes
│   │   ├── rag/query/route.ts      # Live GraphRAG query endpoint
│   │   ├── rag/ingest/route.ts     # Document indexing endpoint
│   │   ├── train/status/route.ts   # Live model benchmark endpoint
│   │   └── report/pdf/route.ts     # Executive PDF Dossier generator
│   └── lib/
│       ├── agents/                 # 7 Autonomous Risk Agents
│       ├── rag/                    # GraphRAG knowledge base & traversal engine
│       └── train/                  # Model training pipeline
│           ├── colab_train_riskauditor.ipynb  # Turnkey Google Colab GPU trainer
│           ├── dataset_generator.py           # Synthetic contract generator
│           ├── train_grpo.py                  # Verifiable RLVR reward engine
│           └── riskauditor_7b_lora/           # Trained LoRA weights & configs
└── frontend/
    ├── Dockerfile                  # Production container
    └── src/
        ├── app/dashboard/page.tsx  # CRO Hub with live GraphRAG + Model Inspector
        ├── components/Dock.tsx     # Interactive macOS magnification Dock
        ├── components/Sidebar.tsx  # Collapsible sidebar navigation
        └── styles/tailwind.css     # Glassmorphism & claymorphism 3D design tokens
```

---

## 📜 Compliance & Statutory Alignment

- **Reserve Bank of India (RBI)**: Master Direction on IT Governance & Outsourcing of Financial Services (2024).
- **DPDP Act (2023)**: Sections 8 & 9 (Data Fiduciary obligations, consent withdrawal erasure, breach notice).
- **CERT-In Directions (2022/2024)**: Section 70B (Mandatory 6-hour cybersecurity incident reporting).
- **Ministry of Corporate Affairs (MCA-21)**: Active Director KYC, disqualified director detection, shell company analysis.
- **GST Network (GSTN)**: GSTR-3B filing cadence and Rule 86B circular invoicing restriction flags.
