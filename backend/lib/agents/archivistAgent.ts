import { callClaudeJSON } from '../llm';
import { getFullStudentRecord } from '../orchestrator/knowledgeGraph';

export interface FraudIncidentEntry {
  vendorOrIncident: string;
  defaultPattern: string;
  financialImpact: string;
  failureMode: string;
  lesson: string;
  similarPriorIncidents: string[];
  loggedAt: string;
  attempted?: string;
  outcome?: string;
  hypothesis?: string;
}

export type ArchiveEntry = FraudIncidentEntry;

const SYSTEM = `You are the Incident Memory Archivist Agent for Razorpay RiskOS (Track 2: AI Risk Manager).
An institutional risk officer logs a vendor fraud pattern, payment default, or compliance breach autopsy.
Your job is to make this failure reusable as institutional memory to prevent future defaults across the Razorpay vendor supply chain.

Produce:
- failureMode: one short, specific phrase categorizing the root hazard (e.g. "shell_ubo_fraud", "unverified_subprocessor_breach", "liability_cap_exhaustion", "cod_remittance_shortfall", "circular_gstin_invoicing").
- lesson: 1-2 sentences on what mandatory underwriting gate, escrow hold, or contractual rider Razorpay must enforce on future counterparties.
- similarPriorIncidents: from the prior logged incident entries provided below, list the "vendorOrIncident" text of any that share the exact root failure mode. Empty array if none — never force a match.

Respond ONLY with JSON:
{ "failureMode": string, "lesson": string, "similarPriorIncidents": string[] }`;

export async function logExperiment(
  vendorOrStudentId: string,
  entry: { attempted: string; outcome: string; hypothesis: string }
): Promise<FraudIncidentEntry> {
  const record = getFullStudentRecord(vendorOrStudentId);
  const prior = record.archiveEntries;
  const priorList = prior.length
    ? prior
        .map((e: any, i: number) => `${i + 1}. Vendor/Incident: ${e.attempted || e.vendorOrIncident} | Failure mode: ${e.failureMode}`)
        .join('\n')
    : '(none yet)';

  const user = `NEW VENDOR DEFAULT / BREACH INCIDENT
Vendor / Attempted: ${entry.attempted}
Observed Outcome / Impact: ${entry.outcome}
Hypothesis / Contract Vulnerability: ${entry.hypothesis}

PRIOR INSTITUTIONAL DEFAULT ARCHIVE
${priorList}`;

  const analyzed = await callClaudeJSON<{
    failureMode: string;
    lesson: string;
    similarPriorIncidents: string[];
  }>({ system: SYSTEM, user, maxTokens: 1500 });

  return {
    vendorOrIncident: entry.attempted,
    defaultPattern: entry.hypothesis,
    financialImpact: entry.outcome,
    ...analyzed,
    loggedAt: new Date().toISOString(),
  };
}

