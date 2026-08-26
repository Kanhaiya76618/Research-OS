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

  const analyzed = await callClaudeJSON<{
    onboardingMilestones: string[];
    enforceableControls: string[];
    slaSuccessCriteria: string[];
    archiveEchoWarnings: string[];
    complianceGaps: string[];
  }>({ system: SYSTEM, user, maxTokens: 2500, tier: 'heavy' });

  return {
    vendorObjective: proposal.objective,
    plannedArchitecture: proposal.plannedApproach,
    ...analyzed,
    createdAt: new Date().toISOString(),
  };
}

