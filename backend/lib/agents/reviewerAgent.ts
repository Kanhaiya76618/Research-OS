import { callClaudeJSON } from '../llm';
import { getFullStudentRecord } from '../orchestrator/knowledgeGraph';

export interface AuditorDojoExercise {
  vendorContext: string;
  contractExcerpt: string;
  plantedFlaws: {
    flaw: string;
    category: 'unverified_cert' | 'liability_evasion' | 'subprocessor_risk' | 'regulatory_gap';
    targetClauseSnippet: string;
  }[];
}

export type ReviewExercise = AuditorDojoExercise;

export interface AuditorDojoGrade {
  caught: string[];
  missed: string[];
  falsePositives: string[];
  score: number; // 0.0 to 1.0
  accuracyPercent: number;
  coachingFeedback: string;
  gradedAt: string;
}

export type ReviewGrade = AuditorDojoGrade;

const EXERCISE_SYSTEM = `You are the AuditorZero Simulator Agent for Razorpay RiskOS (Track 2: AI Risk Manager).
Write a SHORT (160-230 word) realistic fictional vendor Master Services Agreement (MSA) or DPA excerpt containing EXACTLY 3 DELIBERATELY PLANTED RED FLAGS drawn from:
- 'unverified_cert': e.g. Self-attested ISO without accreditation body, expired SOC2 Type II date.
- 'liability_evasion': e.g. Capping data breach indemnity to 1 month subscription fee, disclaiming direct loss.
- 'subprocessor_risk': e.g. Unrestricted 4th-party subprocessor appointment without 30-day notice, overseas data egress.
- 'regulatory_gap': e.g. Failing to commit to 6h CERT-In reporting or DPDP 2023 consent revokability.

Rules:
- Realistic enterprise legal terminology.
- The 3 flaws must be subtle but identifiable by a sharp compliance auditor.
- Never label or explicitly call out the flaws in the excerpt text itself.

Respond ONLY with JSON:
{
  "vendorContext": string,
  "contractExcerpt": string,
  "plantedFlaws": [{ "flaw": string, "category": "unverified_cert" | "liability_evasion" | "subprocessor_risk" | "regulatory_gap", "targetClauseSnippet": string }]
}`;

const GRADE_SYSTEM = `You are the AuditorZero Examiner Agent for Razorpay RiskOS.
Grade an auditor's submitted critique of a fictional vendor excerpt against the 3 planted red flags.

- caught: planted flaws the auditor correctly flagged (evaluate by substance, paraphrase is fine).
- missed: planted flaws the auditor failed to identify.
- falsePositives: items flagged by the auditor that are standard boilerplate and not genuine flaws.
- score: caught.length / plantedFlaws.length (rounded to 2 decimals).
- accuracyPercent: Math.round(score * 100).
- coachingFeedback: 2-3 sentences of coaching on specific blind spots (e.g. subprocessor egress or liability disclaimers).

Respond ONLY with JSON:
{ "caught": string[], "missed": string[], "falsePositives": string[], "score": number, "accuracyPercent": number, "coachingFeedback": string }`;

export async function generateExercise(vendorOrStudentId: string, topicHint?: string): Promise<AuditorDojoExercise> {
  const rec = getFullStudentRecord(vendorOrStudentId);
  const nodeTitles = rec.learningPaths.flatMap((lp) => (lp as any).nodes.map((n: any) => n.title));

  const user = `TOPIC HINT: ${topicHint?.trim() || 'Fintech Cloud Payment Infrastructure & Subprocessors'}

CURRENT AUDIT DOMAIN:
${nodeTitles.length ? nodeTitles.join('\n') : 'Enterprise Fintech Infrastructure'}`;

  return callClaudeJSON<AuditorDojoExercise>({ system: EXERCISE_SYSTEM, user, maxTokens: 2000 });
}

export async function gradeReview(exercise: AuditorDojoExercise, studentReview: string): Promise<AuditorDojoGrade> {
  const user = `EXCERPT
${exercise.contractExcerpt}

PLANTED HAZARDS
${exercise.plantedFlaws.map((f, i) => `${i + 1}. [${f.category}] ${f.flaw} (Snippet: "${f.targetClauseSnippet}")`).join('\n')}

AUDITOR'S SUBMITTED REVIEW
${studentReview}`;

  const graded = await callClaudeJSON<Omit<AuditorDojoGrade, 'gradedAt'>>({
    system: GRADE_SYSTEM,
    user,
    maxTokens: 1500,
  });
  return { ...graded, gradedAt: new Date().toISOString() };
}

