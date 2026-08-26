import { callClaudeJSON } from '../llm';
import { getFullStudentRecord } from '../orchestrator/knowledgeGraph';

export interface CommitteeObjection {
  skeptic: 'legal_regulatory_skeptic' | 'infosec_cyber_skeptic' | 'financial_credit_skeptic';
  hazardTitle: string;
  crossExaminationQuery: string;
  severity: 'minor' | 'major' | 'blocking';
  requiredStipulation: string;
}

export interface RiskCommitteeVerdict {
  targetVendor: string;
  verdict: 'Approved' | 'Conditional Mitigation' | 'Rejected (High Risk)' | 'fund' | 'revise_and_resubmit' | 'reject';
  compositeRiskScore: number; // 0-100
  objections: CommitteeObjection[];
  mandatoryStipulations: string[];
  reviewedAt: string;
  revisionPriorities?: string[];
}

export type PanelVerdict = RiskCommitteeVerdict;

const SYSTEM = `You are a 3-Member Skeptical Risk Committee for Razorpay RiskOS (Track 2: AI Risk Manager).
You cross-examine a vendor onboarding proposal and contract draft before commercial go-ahead:

1. 'legal_regulatory_skeptic': Attacks DPDP 2023 consent gaps, liability caps below 12-month fees, exclusion of data breach indemnity, non-compliance with RBI Master Direction 2024.
2. 'infosec_cyber_skeptic': Attacks unverified SOC2 Type II scopes, lack of 72h/6h CERT-In breach reporting, unencrypted 4th-party subprocessor data egress, lack of source code / vulnerability escrow.
3. 'financial_credit_skeptic': Attacks vendor cash runway, concentration risk, COD chargeback default probability, and failure to establish RazorpayX automated reserve escrow.

Produce 2-4 sharp objections total across the 3 skeptics.
verdict:
- "Approved": only if zero major or blocking objections remain.
- "Conditional Mitigation": if solvable with mandatory stipulations (e.g. 15% escrow hold, mandatory DPDP addendum).
- "Rejected (High Risk)": if structural fraud, ghost UBO, or unresolvable compliance breaches exist.

Respond ONLY with JSON:
{
  "targetVendor": string,
  "verdict": "Approved" | "Conditional Mitigation" | "Rejected (High Risk)",
  "compositeRiskScore": number,
  "objections": [{ "skeptic": "legal_regulatory_skeptic" | "infosec_cyber_skeptic" | "financial_credit_skeptic", "hazardTitle": string, "crossExaminationQuery": string, "severity": "minor" | "major" | "blocking", "requiredStipulation": string }],
  "mandatoryStipulations": string[]
}`;

export async function reviewProposal(vendorOrStudentId: string, proposalText: string): Promise<RiskCommitteeVerdict> {
  const rec = getFullStudentRecord(vendorOrStudentId);

  const archive = rec.archiveEntries.length
    ? rec.archiveEntries
        .map((e) => `Incident: ${e.attempted} | Failure mode: ${e.failureMode} | Lesson: ${e.lesson}`)
        .join('\n')
    : '(none yet)';

  const plans = rec.plans.length
    ? rec.plans
        .map(
          (p) =>
            `Objective: ${p.objective || p.vendorObjective} | Archive warnings: ${(p.archiveWarnings || p.archiveEchoWarnings || []).join('; ') || 'none'} | Compliance gaps: ${(p.prereqGaps || p.complianceGaps || []).join('; ') || 'none'}`
        )
        .join('\n')
    : '(none yet)';

  const user = `VENDOR PROPOSAL & CONTRACT SUMMARY:
${proposalText}

INSTITUTIONAL DEFAULT ARCHIVE:
${archive}

ACTIVE PRE-FLIGHT PLANS:
${plans}`;

  const verdict = await callClaudeJSON<Omit<RiskCommitteeVerdict, 'reviewedAt'>>({
    system: SYSTEM,
    user,
    maxTokens: 2500,
    tier: 'heavy',
  });
  return { ...verdict, reviewedAt: new Date().toISOString() };
}

