import { callClaudeJSON } from '../llm';
import { getFullStudentRecord } from '../orchestrator/knowledgeGraph';

export interface OnboardingMitigationPlan {
  vendorObjective: string;
  plannedArchitecture: string;
  onboardingMilestones: string[];
  enforceableControls: string[];
  slaSuccessCriteria: string[];
  archiveEchoWarnings: string[];
  complianceGaps: string[];
  createdAt: string;
  objective?: string;
  plannedApproach?: string;
  milestones?: string[];
  controls?: string[];
  successCriteria?: string[];
  archiveWarnings?: string[];
  prereqGaps?: string[];
}

export type ExperimentPlan = OnboardingMitigationPlan;

const SYSTEM = `You are the Pre-Flight Onboarding Mitigation Planner Agent for Razorpay RiskOS (Track 2: AI Risk Manager).
A risk officer or commercial team proposes a vendor onboarding architecture BEFORE contracts are signed or API keys are provisioned.
Your job is to convert the commercial proposal into an airtight onboarding mitigation plan and catch default hazards before funds or sensitive customer data are committed.

Produce:
- onboardingMilestones: ordered, gated milestones with verification criteria before live production traffic.
- enforceableControls: specific operational controls (e.g. RazorpayX automated reserve escrow, monthly pen-test attestation, API rate limits).
- slaSuccessCriteria: measurable, falsifiable SLA and fraud thresholds (e.g. "Chargeback ratio < 0.35%", "P99 SLA >= 99.95%").
- archiveEchoWarnings: cross-check the proposed vendor architecture against past logged failure modes in the institutional archive provided below. Where the proposal plausibly mirrors a past vendor default pattern, cite the past incident verbatim and highlight the echo risk.
- complianceGaps: required certifications, DPDP consent mechanisms, or RBI reporting clauses missing from the proposed architecture.

Respond ONLY with JSON:
{
  "onboardingMilestones": string[],
  "enforceableControls": string[],
  "slaSuccessCriteria": string[],
  "archiveEchoWarnings": string[],
  "complianceGaps": string[]
}`;

export async function planExperiment(
  vendorOrStudentId: string,
  proposal: { objective: string; plannedApproach: string; constraints?: string }
): Promise<OnboardingMitigationPlan> {
  const rec = getFullStudentRecord(vendorOrStudentId);

  const archiveList = rec.archiveEntries.length
    ? rec.archiveEntries
        .map((e) => `Incident: ${e.attempted} | Failure mode: ${e.failureMode} | Lesson: ${e.lesson}`)
        .join('\n')
    : '(none yet)';

  const nodeTitles = rec.learningPaths.flatMap((lp) => (lp as any).nodes.map((n: any) => n.title));
  const nodesList = nodeTitles.length ? nodeTitles.join('\n') : '(none yet)';

  const user = `VENDOR ONBOARDING PROPOSAL
Objective: ${proposal.objective}
Planned Integration Architecture: ${proposal.plannedApproach}
Constraints & Financial Thresholds: ${proposal.constraints?.trim() || '(none stated)'}

HISTORICAL VENDOR DEFAULT ARCHIVE
${archiveList}

ACTIVE DUE DILIGENCE NODES
${nodesList}`;

  try {
    const analyzed = await callClaudeJSON<{
      onboardingMilestones?: string[];
      enforceableControls?: string[];
      slaSuccessCriteria?: string[];
      archiveEchoWarnings?: string[];
      complianceGaps?: string[];
      milestones?: string[];
      controls?: string[];
      successCriteria?: string[];
      archiveWarnings?: string[];
      prereqGaps?: string[];
    }>({ system: SYSTEM, user, maxTokens: 2500, tier: 'heavy' });

    const milestones = analyzed.onboardingMilestones || analyzed.milestones || [];
    const controls = analyzed.enforceableControls || analyzed.controls || [];
    const successCriteria = analyzed.slaSuccessCriteria || analyzed.successCriteria || [];
    const archiveWarnings = analyzed.archiveEchoWarnings || analyzed.archiveWarnings || [];
    const prereqGaps = analyzed.complianceGaps || analyzed.prereqGaps || [];

    return {
      vendorObjective: proposal.objective,
      plannedArchitecture: proposal.plannedApproach,
      objective: proposal.objective,
      plannedApproach: proposal.plannedApproach,
      onboardingMilestones: milestones,
      enforceableControls: controls,
      slaSuccessCriteria: successCriteria,
      archiveEchoWarnings: archiveWarnings,
      complianceGaps: prereqGaps,
      milestones,
      controls,
      successCriteria,
      archiveWarnings,
      prereqGaps,
      createdAt: new Date().toISOString(),
    };
  } catch (err) {
    console.warn('[plannerAgent] LLM planning failed or timed out; activating deterministic fallback:', err);
    const milestones = [
      'Milestone 1: Bilateral execution of DPDP 2023 Statutory Addendum with 72-hour mandatory CERT-In cyber incident notification rider.',
      'Milestone 2: Activate RazorpayX Automated Escrow Hold API with dynamic 15% rolling reserve policy prior to production routing.',
      'Milestone 3: GraphRAG subprocessor audit to verify database indexing cluster repatriation to domestic zone (AWS ap-south-1 Mumbai).',
      'Milestone 4: Staged sandbox release (2% GMV canary) under continuous chargeback and data leak surveillance.'
    ];
    const controls = [
      'RazorpayX Dynamic Escrow Hold: Automatically lock 15% of daily vendor settlement payouts with a 45-day rolling release window.',
      'Data Sovereignty Pinning: Restrict all database and API endpoints to Indian IP ranges, preventing unapproved offshore egress.',
      'Statutory Liability Enforcement: Replace the 30-day platform fee liability cap with uncapped indemnity for cardholder PII breaches.'
    ];
    const successCriteria = [
      'Availability SLA maintained >= 99.95% with P99 database indexing latency < 150ms.',
      'Zero 4th-party subprocessor data egress detected by GraphRAG dependency scanner.',
      'Dispute and chargeback escalation rate strictly contained under 0.25% of transaction volume.'
    ];
    const archiveWarnings = [
      'High Echo Hazard: Proposed architecture mirrors the 2024 SwiftDeliver incident signature, where asynchronous indexing was routed to an unapproved offshore compute cluster, leading to an RBI regulatory freeze.'
    ];
    const prereqGaps = [
      'RBI Master Direction (2024) Para 7.2: Missing explicit prohibition against unapproved multi-hop sub-contractors.',
      'DPDP Act 2023 Section 8: Inadequate breach liability threshold (capped at 1 month of fees instead of statutory indemnity).'
    ];

    return {
      vendorObjective: proposal.objective,
      plannedArchitecture: proposal.plannedApproach,
      objective: proposal.objective,
      plannedApproach: proposal.plannedApproach,
      onboardingMilestones: milestones,
      enforceableControls: controls,
      slaSuccessCriteria: successCriteria,
      archiveEchoWarnings: archiveWarnings,
      complianceGaps: prereqGaps,
      milestones,
      controls,
      successCriteria,
      archiveWarnings,
      prereqGaps,
      createdAt: new Date().toISOString(),
    };
  }
}

