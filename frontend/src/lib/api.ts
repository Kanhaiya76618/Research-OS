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
  consistencyNotes: string[];
  suggestions: string[];
  overallNarrative: string;
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

export function getSupervisorReport(studentId: string): Promise<SupervisorReport> {
  return post<SupervisorReport>('/api/supervisor', { studentId });
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

