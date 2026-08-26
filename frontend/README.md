# RiskOS Frontend — AI Risk Manager (Razorpay Track 2)

## Overview

RiskOS is a high-performance Next.js 15 frontend application crafted for autonomous vendor risk assessment, fraud prevention, contract auditing, and compliance verification.

---

## Running Locally

```bash
cd frontend
npm install
npm run dev
# → http://localhost:4028
```

---

## Design System

- **Visual Language**: Modern Razorpay fintech styling blending **Glassmorphism** (frosted translucent backdrop, ambient glows, border gradients) and **Claymorphism** (soft 3D tactile dual-shadows, inset highlights, elevated pill buttons).
- **Brand Palette**:
  - Razorpay Navy: `#0c2340`
  - Royal Blue: `#1e3a8a`
  - Sky Blue: `#0284c7`
  - Emerald Green: `#059669`
  - Hazard Red: `#dc2626`
  - Amber Warning: `#d97706`
  - Purple AI: `#7c3aed`
- **Typography**: DM Sans (headings and metrics), JetBrains Mono (GSTINs, hashes, and clauses).
- **Motion**: Framer Motion spring physics with tactile active states (`scale: 0.98`).

---

## Workstations & Routes

| Route | Workstation | Description |
| :--- | :--- | :--- |
| `/` | **Risk Intake Engine** | Domain, GSTIN, and corporate profile search with risk framework cards |
| `/curriculum-view` | **4-Tier Diligence Trail & Graph** | Tier 1 (Legal) $\to$ Tier 2 (Cyber) $\to$ Tier 3 (Escrow) $\to$ Tier 4 (MSA) & 3D Entity Network |
| `/preflight` | **Pre-Flight Mitigation Planner** | Converts commercial proposals into escrow milestones, SLA controls & failure warnings |
| `/archive` | **Fraud & Default Archive** | Institutional memory of ghost shell companies, invoice fraud, and COD defaults |
| `/reviewer` | **AuditorZero Training Dojo** | Fictional vendor proposals with 3 planted red flags; verifiable review grading |
| `/grantcraft` | **Risk Committee Defense** | Adversarial interrogation by Legal, InfoSec, and Financial AI skeptics |
| `/dashboard` | **CRO Executive Hub** | Cross-module risk intelligence memo with one-click PDF Dossier generation |
| `/paper-reader` | **Contract & Disclosure Explorer** | 3D CoverFlow, Grid, and List document browser with audit note-taking sheet |

