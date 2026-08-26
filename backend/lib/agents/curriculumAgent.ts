import { callClaudeJSON } from '../llm';

export interface DiligenceGate {
  order: number;
  tier: 'Tier 1: Corporate & Legal' | 'Tier 2: Cyber & InfoSec' | 'Tier 3: Financial & Payouts' | 'Tier 4: Contractual & SLA';
  title: string;
  entityOrDocId: string | null;
  whyItMatters: string;
  verificationGate: string;
  remediationDeliverable: string;
  riskWeight: number; // 0-100
}

export type LearningNode = DiligenceGate;

export interface DiligenceTrail {
  targetVendor: string;
  targetDomainOrGstin: string;
  overallRiskTier: 'Low' | 'Medium' | 'High' | 'Critical';
  diligenceScore: number; // 0-100
  nodes: DiligenceGate[];
}

export type LearningPath = DiligenceTrail;

const SYSTEM = `You are the Due Diligence Agent for Razorpay RiskOS (Track 2: AI Risk Manager).
Given a target vendor, merchant domain, or GSTIN, generate a comprehensive 4-Tier Due Diligence Verification Trail:
- Tier 1: Corporate & Legal Structure (MCA-21 active filings, GSTIN cadence, UBO ultimate beneficial ownership, CIN registration).
- Tier 2: Cyber & InfoSec Posture (SOC2 Type II report scope, ISO 27001, AWS/GCP subprocessor telemetry, 72h CERT-In compliance).
- Tier 3: Financial & Payout Health (RazorpayX settlement integrity, cash runway, chargeback ratios, escrow/reserve hold requirements).
- Tier 4: Contractual SLA & Indemnification (MSA aggregate liability caps, DPDP 2023 data localization, IP indemnity exclusions, subprocessor change notification window).

For each node provide:
- tier: the exact tier name.
- title: concise title of the verification checkpoint.
- entityOrDocId: identifier (e.g. GSTIN, MCA CIN, SOC2 Hash, or MSA-SEC-14).
- whyItMatters: 1-2 specific sentences on why this checkpoint is critical to preventing financial/compliance default.
- verificationGate: ONE strict verification test or audit question.
- remediationDeliverable: the mandatory contractual rider, escrow trigger, or cert required to pass.
- riskWeight: integer from 10 to 30.

Respond ONLY with JSON matching:
{
  "targetVendor": string,
  "targetDomainOrGstin": string,
  "overallRiskTier": "Low" | "Medium" | "High" | "Critical",
  "diligenceScore": number,
  "nodes": [{ "order": number, "tier": "Tier 1: Corporate & Legal" | "Tier 2: Cyber & InfoSec" | "Tier 3: Financial & Payouts" | "Tier 4: Contractual & SLA", "title": string, "entityOrDocId": string | null, "whyItMatters": string, "verificationGate": string, "remediationDeliverable": string, "riskWeight": number }]
}`;

export async function buildLearningPath(vendorQuery: string): Promise<DiligenceTrail> {
  const user = `VENDOR INTAKE QUERY: ${vendorQuery}

Generate a structured 4-Tier Due Diligence Verification Trail with 4 to 8 critical verification gates across Corporate, Cyber, Payout, and Contractual compliance.`;

  const trail = await callClaudeJSON<DiligenceTrail>({ system: SYSTEM, user, maxTokens: 4000 });
  trail.targetVendor = trail.targetVendor || vendorQuery;
  trail.targetDomainOrGstin = trail.targetDomainOrGstin || vendorQuery;
  return trail;
}

