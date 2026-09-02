import { callClaudeJSON } from '../llm';
import { getStudentContext } from '../orchestrator/knowledgeGraph';
import { queryGraphRAG } from '../rag/ragPipeline';

export type RedFlagCategory = 'unverified_cert' | 'liability_evasion' | 'subprocessor_risk' | 'regulatory_gap';
export type FlagType = RedFlagCategory;

export interface RedFlagClause {
  category: RedFlagCategory;
  severity: 'low' | 'medium' | 'high' | 'critical';
  section: string;
  excerpt: string;
  hazardNote: string;
  recommendedRemediation: string;
}

export type CritiqueFlag = RedFlagClause;

export interface ContractAuditResult {
  vendorName: string;
  documentTitle: string;
  overallComplianceSummary: string;
  riskScore: number; // 0 (safest) to 100 (critical hazard)
  flags: RedFlagClause[];
  croSignOffRecommendation: 'Approve' | 'Require Escrow / Redlines' | 'Reject Counterparty';
}

export type DraftCritique = ContractAuditResult;

const SYSTEM = `You are the Red-Flag Contract Auditor Agent for Razorpay RiskOS (Track 2: AI Risk Manager).
Your mission is to audit enterprise vendor Master Services Agreements (MSAs), Data Protection Agreements (DPAs), and Security Disclosures.

Analyze the contract text for exact clause vulnerabilities in these 4 categories:
1. 'unverified_cert': Outdated ISO/SOC2 certificates, self-attested questionnaires with missing external auditor sign-offs, unverified PCI-DSS Level 1 compliance.
2. 'liability_evasion': Aggregate liability capped to 1-month or negligible fees, exclusion of direct damages for data breaches or gross negligence, unilateral indemnification limits.
3. 'subprocessor_risk': Unrestricted right to add 4th-party subprocessors without 30-day prior written consent, unencrypted offshore data egress, lack of audit rights over supply chain.
4. 'regulatory_gap': Failure to commit to 6-hour CERT-In incident reporting, violation of India DPDP Act 2023 consent/localization directives, missing RBI Master Direction 2024 compliance.

Rules:
- Quote the EXACT clause sentence in "excerpt" — never hallucinate or generalize.
- Provide a razor-sharp "hazardNote" detailing financial/regulatory exposure for Razorpay.
- Provide an enforceable "recommendedRemediation" clause.

Respond ONLY with JSON matching:
{
  "vendorName": string,
  "documentTitle": string,
  "overallComplianceSummary": string,
  "riskScore": number,
  "flags": [{ "category": "unverified_cert" | "liability_evasion" | "subprocessor_risk" | "regulatory_gap", "severity": "low" | "medium" | "high" | "critical", "section": string, "excerpt": string, "hazardNote": string, "recommendedRemediation": string }],
  "croSignOffRecommendation": "Approve" | "Require Escrow / Redlines" | "Reject Counterparty"
}`;

export async function critiqueDraft(contractText: string, vendorOrStudentId: string): Promise<ContractAuditResult> {
  const context = getStudentContext(vendorOrStudentId);
  
  // Query GraphRAG for relevant statutory mandates & entity relations
  let ragContext = '';
  try {
    const ragResult = await queryGraphRAG(contractText.slice(0, 400), { vendorId: vendorOrStudentId });
    ragContext = ragResult.synthesizedContext;
  } catch (err) {
    ragContext = '(GraphRAG offline, proceeding with standard knowledge)';
  }

  const user = `INSTITUTIONAL RISK CONTEXT: ${context}

GRAPHRAG REGULATORY & SUPPLY CHAIN INTEL:
${ragContext}

VENDOR CONTRACT TEXT FOR AUDIT:
${contractText}`;

  return callClaudeJSON<ContractAuditResult>({ system: SYSTEM, user, maxTokens: 3500 });
}

