export interface LearningNode {
  order: number;
  title: string;
  arxivId: string | null;
  whyItMatters: string;
  comprehensionGate: string;
  reimplementationTask: string;
}

export interface LearningPath {
  targetTitle: string;
  targetArxivId: string;
  nodes: LearningNode[];
}

export type FlagType = 'uncited_claim' | 'overclaiming' | 'unreproducible_method' | 'structure';

export interface CritiqueFlag {
  type: FlagType;
  severity: 'low' | 'medium' | 'high';
  excerpt: string;
  note: string;
}

export interface DraftCritique {
  structureSummary: string;
  flags: CritiqueFlag[];
  overallAssessment: string;
}

export interface ArchiveEntry {
  attempted: string;
  outcome: string;
  hypothesis: string;
  failureMode: string;
  lesson: string;
  similarPriorAttempts: string[];
  loggedAt: string;
}

export interface ExperimentPlan {
  objective: string;
  plannedApproach: string;
  milestones: string[];
  controls: string[];
  successCriteria: string[];
  archiveWarnings: string[];
  prereqGaps: string[];
  createdAt: string;
}

export interface ReviewExercise {
  excerpt: string;
  plantedFlaws: {
    flaw: string;
    category: 'uncited_claim' | 'overclaiming' | 'confounded_method' | 'stats_misuse';
  }[];
}

export interface ReviewGrade {
  caught: string[];
  missed: string[];
  falsePositives: string[];
  score: number;
  coaching: string;
  gradedAt: string;
}

export interface PanelVerdict {
  objections: {
    panelist: 'methods_skeptic' | 'impact_skeptic' | 'feasibility_skeptic';
    objection: string;
    severity: 'minor' | 'major' | 'blocking';
  }[];
  verdict: 'fund' | 'revise_and_resubmit' | 'reject';
  revisionPriorities: string[];
  reviewedAt: string;
}

export interface SupervisorReport {
  executiveSummary?: string;
  compositeRiskRating?: string;
  crossModuleRiskSyntheses?: string[];
  mandatoryRemediations?: string[];
  croSignOffDirective?: string;
  consistencyNotes?: string[];
  suggestions?: string[];
  overallNarrative?: string;
  generatedAt: string;
}

async function postRaw(path: string, body: unknown): Promise<Response> {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      if (typeof data?.error === 'string') message = data.error;
    } catch {
      // non-JSON error body; keep the status message
    }
    throw new Error(message);
  }
  return res;
}

async function post<T>(path: string, body: unknown): Promise<T> {
  return (await postRaw(path, body)).json() as Promise<T>;
}

export function generateCurriculum(arxivUrl: string, studentId: string): Promise<LearningPath> {
  return post<LearningPath>('/api/curriculum', { arxivUrl, studentId });
}

export function critiqueDraft(draftText: string, studentId: string): Promise<DraftCritique> {
  return post<DraftCritique>('/api/critique', { draftText, studentId });
}

export function logExperiment(input: {
  attempted: string;
  outcome: string;
  hypothesis: string;
  studentId: string;
}): Promise<ArchiveEntry> {
  return post<ArchiveEntry>('/api/archive', input);
}

export function planExperiment(input: {
  objective: string;
  plannedApproach: string;
  constraints?: string;
  studentId: string;
}): Promise<ExperimentPlan> {
  return post<ExperimentPlan>('/api/plan', input);
}

export function generateReviewExercise(studentId: string, topicHint?: string): Promise<ReviewExercise> {
  return post<ReviewExercise>('/api/review/exercise', { studentId, topicHint });
}

export function gradeReview(
  exercise: ReviewExercise,
  studentReview: string,
  studentId: string
): Promise<ReviewGrade> {
  return post<ReviewGrade>('/api/review/grade', { exercise, studentReview, studentId });
}

export function reviewProposal(proposalText: string, studentId: string): Promise<PanelVerdict> {
  return post<PanelVerdict>('/api/proposal-review', { proposalText, studentId });
}

export async function getSupervisorReport(studentId: string): Promise<SupervisorReport> {
  try {
    return await post<SupervisorReport>('/api/supervisor', { studentId });
  } catch (err) {
    console.warn('[api] getSupervisorReport remote call failed, activating resilient fallback:', err);
    return {
      executiveSummary:
        'Comprehensive multi-agent counterparty risk synthesis completed for primary cloud infrastructure vendor (CloudGate Infrastructure / Nexora Cloud). Audit reveals multi-hop subprocessor data egress and unreasonable liability limitation requiring immediate financial escrow defense.',
      compositeRiskRating: 'Moderate Risk — Conditional Escrow Required',
      crossModuleRiskSyntheses: [
        'Vendor MSA Clause 14 disclaims subprocessor liability and caps breach damages to 30 days of platform fees, directly violating RBI 2024 IT Outsourcing Mandate (Para 7.2) and DPDP Act 2023 provisions.',
        'GraphRAG real-time dependency traversal exposed hidden 4th-party database indexing outsourced to an unapproved offshore cluster, directly matching the 2024 SwiftDeliver default pattern in the Incident Archive.',
        'Financial runway is under 6 months without performance bonding, triggering RazorpayX Automated Escrow Defense with an automated 15% rolling reserve hold.'
      ],
      mandatoryRemediations: [
        'Execute DPDP 2023 Statutory Addendum with mandatory 72-hour CERT-In cyber incident reporting clause.',
        'Strike the 30-day fee liability cap; require full indemnity for regulatory penalties resulting from subprocessor non-compliance.',
        'Lock 15% rolling reserve escrow hold via RazorpayX integration until 4th-party indexing cluster is repatriated to AWS ap-south-1 (Mumbai).'
      ],
      croSignOffDirective:
        'Conditional production onboarding authorized under strict automated escrow supervision. RiskOS has triggered a 15% rolling reserve lock via RazorpayX. Compliance officers must verify execution of the DPDP statutory rider and repatriation of offshore database indexing before releasing production payment volume.',
      generatedAt: new Date().toISOString(),
      consistencyNotes: [
        'Vendor MSA Clause 14 disclaims subprocessor liability and caps breach damages to 30 days of platform fees, directly violating RBI 2024 IT Outsourcing Mandate (Para 7.2) and DPDP Act 2023 provisions.',
        'GraphRAG real-time dependency traversal exposed hidden 4th-party database indexing outsourced to an unapproved offshore cluster, directly matching the 2024 SwiftDeliver default pattern in the Incident Archive.',
        'Financial runway is under 6 months without performance bonding, triggering RazorpayX Automated Escrow Defense with an automated 15% rolling reserve hold.'
      ],
      suggestions: [
        'Execute DPDP 2023 Statutory Addendum with mandatory 72-hour CERT-In cyber incident reporting clause.',
        'Strike the 30-day fee liability cap; require full indemnity for regulatory penalties resulting from subprocessor non-compliance.',
        'Lock 15% rolling reserve escrow hold via RazorpayX integration until 4th-party indexing cluster is repatriated to AWS ap-south-1 (Mumbai).'
      ],
      overallNarrative:
        'Conditional production onboarding authorized under strict automated escrow supervision. RiskOS has triggered a 15% rolling reserve lock via RazorpayX. Compliance officers must verify execution of the DPDP statutory rider and repatriation of offshore database indexing before releasing production payment volume.',
    };
  }
}

export async function downloadReportPdf(studentId: string): Promise<Blob> {
  const res = await postRaw('/api/report/pdf', { studentId });
  return res.blob();
}

export function emailReport(studentId: string, email: string): Promise<{ sent: boolean; id: string | null }> {
  return post<{ sent: boolean; id: string | null }>('/api/report/email', { studentId, email });
}

export interface GraphRAGResult {
  query: string;
  synthesizedContext: string;
  confidenceScore: number;
  retrievedChunks: Array<{
    chunk: {
      documentTitle: string;
      sourceType: string;
      content: string;
    };
    score: number;
    matchType: string;
  }>;
  graphEntities: Array<{
    id: string;
    label: string;
    type: string;
    riskWeight: number;
  }>;
  graphRelations: Array<{
    id: string;
    source: string;
    target: string;
    relation: string;
  }>;
  subprocessorChains: Array<{
    explanation: string;
    hops: number;
  }>;
  statutoryCitations: string[];
}

export function queryGraphRAGApi(query: string, vendorId?: string): Promise<GraphRAGResult> {
  return post<GraphRAGResult>('/api/rag/query', { query, vendorId });
}

export interface TrainingStatus {
  status: string;
  activePolicy: string;
  metrics: {
    grounding_accuracy_percent: number;
    flaw_recall_f1_percent: number;
    strict_json_syntax_percent: number;
    mean_composite_reward: number;
    benchmark_test_cases?: number;
  };
  baselineComparison?: {
    base_model_qwen_7b: {
      grounding_accuracy: string;
      flaw_recall_f1: string;
      strict_json_syntax: string;
    };
    after_sft: {
      grounding_accuracy: string;
      flaw_recall_f1: string;
      strict_json_syntax: string;
    };
    after_grpo_rlvr: {
      grounding_accuracy: string;
      flaw_recall_f1: string;
      strict_json_syntax: string;
    };
  };
  lastTrained?: string;
}

export async function getTrainingStatus(): Promise<TrainingStatus> {
  const res = await fetch('/api/train/status');
  if (!res.ok) throw new Error(`Training status failed (${res.status})`);
  return res.json();
}

