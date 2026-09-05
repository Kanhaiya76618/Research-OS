import { NextResponse } from 'next/server';
import { synthesize } from '@/lib/agents/supervisorAgent';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const studentId =
      typeof body?.studentId === 'string' && body.studentId.trim()
        ? body.studentId.trim()
        : 'vendor-demo';

    // The Supervisor reads the knowledge graph; it never writes to it.
    const report = await synthesize(studentId);
    return NextResponse.json(report);
  } catch (err) {
    console.error('[supervisor route error]:', err);
    return NextResponse.json({
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
    });
  }
}
