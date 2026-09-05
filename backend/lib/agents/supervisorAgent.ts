import { callClaudeJSON } from '../llm';
import { getFullStudentRecord } from '../orchestrator/knowledgeGraph';

export interface CroExecutiveMemo {
  executiveSummary: string;
  compositeRiskRating: 'Low Risk — Approved' | 'Moderate Risk — Conditional Escrow Required' | 'Critical Risk — Rejected';
  crossModuleRiskSyntheses: string[];
  mandatoryRemediations: string[];
  croSignOffDirective: string;
  generatedAt: string;
  consistencyNotes?: string[];
  suggestions?: string[];
  overallNarrative?: string;
}

export type SupervisorReport = CroExecutiveMemo;

const SYSTEM = `You are the Chief Risk Officer (CRO) Supervisor Agent for Razorpay RiskOS (Track 2: AI Risk Manager).
You do not perform basic text extraction yourself — you synthesize what all 6 specialized agents produced across the vendor's audit record (4-tier due diligence trail, contract red-flag audit, incident memory defaults, onboarding mitigation plan, auditor dojo results, and 3-skeptic committee verdicts).

Your mission:
- crossModuleRiskSyntheses: produce concrete, cross-referenced findings (e.g. "Vendor MSA Clause 14 disclaims subprocessor liability, directly matching the 2024 SwiftDeliver default pattern in the Incident Archive", "Financial runway is 4 months, violating Tier 3 threshold without automated RazorpayX daily escrow hold").
- mandatoryRemediations: concrete stipulations required before production go-live (e.g. "Execute DPDP 2023 addendum with 72h CERT-In clause", "Hold 15% rolling reserve in RazorpayX").
- croSignOffDirective: 3-4 authoritative, executive sentences summarizing the final risk verdict and instructions for compliance officers.

Respond ONLY with JSON:
{
  "executiveSummary": string,
  "compositeRiskRating": "Low Risk — Approved" | "Moderate Risk — Conditional Escrow Required" | "Critical Risk — Rejected",
  "crossModuleRiskSyntheses": string[],
  "mandatoryRemediations": string[],
  "croSignOffDirective": string
}`;

export async function synthesize(vendorOrStudentId: string): Promise<CroExecutiveMemo> {
  const rec = getFullStudentRecord(vendorOrStudentId);

  const paths = rec.learningPaths.length
    ? rec.learningPaths
        .map((lp: any) => `Target: ${lp.targetVendor || lp.targetTitle}\nTiers/Nodes: ${(lp.nodes || []).map((n: any) => n.title).join('; ')}`)
        .join('\n\n')
    : '(none yet)';

  const critiques = rec.critiques.length
    ? rec.critiques
        .map(
          (c: any) =>
            `Summary: ${c.overallComplianceSummary || c.structureSummary}\nFlags: ${(c.flags || [])
              .map((f: any) => `${f.category || f.type} (${f.severity}): ${f.excerpt || ''}`)
              .join(' | ')}`
        )
        .join('\n\n')
    : '(none yet)';

  const archive = rec.archiveEntries.length
    ? rec.archiveEntries
        .map((e: any) => `Incident: ${e.attempted || e.vendorOrIncident} | Failure mode: ${e.failureMode} | Lesson: ${e.lesson}`)
        .join('\n')
    : '(none yet)';

  const plans = rec.plans.length
    ? rec.plans
        .map(
          (p: any) =>
            `Objective: ${p.vendorObjective || p.objective} | Archive warnings: ${(p.archiveEchoWarnings || p.archiveWarnings || []).length} | Gaps: ${(p.complianceGaps || p.prereqGaps || []).length}`
        )
        .join('\n')
    : '(none yet)';

  const reviews = rec.reviewGrades.length
    ? rec.reviewGrades
        .map((g: any) => `Score: ${g.score} | Missed flaws: ${(g.missed || []).length}`)
        .join('\n')
    : '(none yet)';

  const verdicts = rec.panelVerdicts.length
    ? rec.panelVerdicts
        .map(
          (v: any) =>
            `Verdict: ${v.verdict} | Objections: ${(v.objections || []).length} | Stipulations: ${(v.mandatoryStipulations || []).join('; ')}`
        )
        .join('\n')
    : '(none yet)';

  const user = `DILIGENCE VERIFICATION TRAILS:
${paths}

RED-FLAG CONTRACT AUDITS:
${critiques}

INSTITUTIONAL DEFAULT ARCHIVE MATCHES:
${archive}

PRE-FLIGHT MITIGATION PLANS:
${plans}

AUDITOR DOJO SIMULATION GRADES:
${reviews}

3-SKEPTIC RISK COMMITTEE VERDICTS:
${verdicts}`;

  const report = await callClaudeJSON<Omit<CroExecutiveMemo, 'generatedAt'>>({
    system: SYSTEM,
    user,
    maxTokens: 2500,
    tier: 'heavy',
  });
  return {
    ...report,
    generatedAt: new Date().toISOString(),
    consistencyNotes: report.crossModuleRiskSyntheses || [],
    suggestions: report.mandatoryRemediations || [],
    overallNarrative: report.croSignOffDirective || report.executiveSummary || '',
  };
}

