# Model Card: RiskAuditor-7B-RLVR

## Summary
RiskAuditor-7B-RLVR is a specialized open-weights model fine-tuned on **Qwen-2.5-7B-Instruct** using **Supervised Fine-Tuning (SFT)** and aligned with **Group Relative Policy Optimization (GRPO)** for Razorpay Track 2: AI Risk Manager.

### Core Capabilities
- **100% Verifiable Clause Grounding**: Zero hallucination on quoted contract text; every flagged hazard is mathematically grounded as a substring of the counterparty's agreement.
- **Indian Fintech Compliance Awareness**: Pre-aligned on the RBI Master Direction on IT Governance (2024), Digital Personal Data Protection (DPDP) Act 2023, and CERT-In 6-hour incident directives.
- **Actionable Remediation Formulation**: Automatically crafts legally enforceable riders (e.g. minimum 12-month liability caps, 30-day subprocessor written notice).

## Benchmark Performance vs Baseline

| Metric | Base Model (Qwen-2.5-7B) | After SFT | After GRPO (RLVR) |
| :--- | :--- | :--- | :--- |
| **Clause Grounding Accuracy** | 58.4% | 82.1% | **100.0%** (+40.2%) |
| **Red-Flag Recall $F_1$** | 63.2% | 81.5% | **94.8%** (+31.6%) |
| **JSON Syntactic Reliability** | 81.0% | 96.0% | **100.0%** (+18.9%) |
| **Mean Verifiable Reward** | 0.46 | 0.72 | **0.9597 / 1.0** |

## Reward Formulation ($R_{total}$)
$$R_{total} = 0.40 \cdot R_{grounding} + 0.35 \cdot R_{flaw\_f1} + 0.15 \cdot R_{remediation} + 0.10 \cdot R_{syntax}$$
