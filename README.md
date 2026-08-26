# RiskOS by Razorpay — AI Risk Manager (Track 2)

**RiskOS** is an autonomous multi-agent operating system purpose-built for enterprise vendor risk management, merchant onboarding compliance, contract red-flag audits, and automated fraud prevention.

---

## Key Capabilities

1. **Vendor & Merchant Risk Intake Engine**: Multi-source intake via GSTIN, MCA-21, and domain ingestion with automated risk tiering.
2. **4-Tier Diligence Verification Trail**: Structured verification gates spanning Corporate/Legal, Cyber/InfoSec, Financial/Escrow, and Contractual SLA/Indemnity.
3. **GraphRAG Entity & Supply Chain Risk Network**: 3D interactive knowledge graph mapping corporate structures, ultimate beneficial owners (UBOs), subprocessor telemetry, and contractual conflicts.
4. **Red-Flag Contract Clause Auditor**: Instant identification of liability evasion, subprocessor leaks, missing BAAs, and DPDP / CERT-In compliance gaps.
5. **Pre-Flight Onboarding Mitigation Planner**: Falsifiable milestones, escrow triggers, and automatic echo warnings against historical default patterns.
6. **Institutional Incident Memory Archive**: Persistent memory of ghost companies, circular GSTIN invoices, and chargeback default autopsy reports.
7. **AuditorZero Flaw-Spotting Dojo**: Realistic simulation environment with planted red flags to train and evaluate junior risk auditors.
8. **3-Skeptic Risk Committee Defense**: Adversarial cross-examination by Legal/Regulatory, Cyber/InfoSec, and Financial/Credit AI skeptics.
9. **Chief Risk Officer (CRO) Executive Hub**: Executive risk intelligence briefing with one-click cryptographic PDF Dossier generation and compliance email dispatch.

---

## Layout

```
frontend/   Next.js 15 UI with Glassmorphism + Claymorphism — see frontend/README.md
backend/    Next.js API — Multi-agent orchestration, LangChain/GraphRAG, and PDF renderer
```

---

## Running Locally

### Backend (Port 4029):
```bash
cd backend
npm install
npm run dev
```

### Frontend (Port 4028):
```bash
cd frontend
npm install
npm run dev
```

---

## Architecture & Design System

- **Design Tokens**: Razorpay Navy (`#0c2340`), Royal Blue (`#1e3a8a`), Sky (`#0284c7`), Emerald (`#059669`).
- **UI Paradigm**: Glassmorphism (frosted translucent backdrop, ambient glows) + Claymorphism (soft 3D tactile dual-shadows, inset highlights, elevated pill buttons).
- **Agent Ecosystem**: Hybrid LLM policy (Grok API, Claude 3.5 Sonnet, Gemini 1.5 Pro) with Verifiable-Reward RL (GRPO) for clause grounding.

