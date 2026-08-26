import { Resend } from 'resend';
import { callClaude } from '../llm';
import type { SupervisorReport } from './supervisorAgent';

const SYSTEM =
  "You format an executive risk briefing email from the Chief Risk Officer (CRO). 3-4 crisp sentences detailing the vendor's composite risk rating, mandatory escrow/remediation stipulations, and sign-off verdict. Professional fintech tone, no greeting or sign-off line.";

export async function sendProgressReport({
  toEmail,
  studentId,
  supervisor,
  pdfBuffer,
}: {
  toEmail: string;
  studentId: string;
  supervisor: SupervisorReport;
  pdfBuffer: Buffer;
}): Promise<{ id: string | null }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error('RESEND_API_KEY is not set');
  const resend = new Resend(apiKey);

  const narrativeText = supervisor.croSignOffDirective || supervisor.executiveSummary || supervisor.overallNarrative || 'Executive risk memo generated.';

  const body = await callClaude({
    system: SYSTEM,
    user: narrativeText,
    maxTokens: 300,
  });

  const html =
    `<div style="font-family: sans-serif; color: #0c2340;">` +
    `<h3 style="color: #0284c7; margin-bottom: 8px;">RiskOS — CRO Executive Risk Briefing</h3>` +
    `<p style="font-size: 14px; line-height: 1.6;">${body.replace(/\n/g, '<br/>')}</p>` +
    `<hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 16px 0;" />` +
    `<span style="color:#64748b;font-size:12px">Full cryptographically signed Vendor Risk Dossier attached as PDF.</span>` +
    `</div>`;

  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_ADDRESS || 'RiskOS by Razorpay <risk-alerts@resend.dev>',
    to: [toEmail],
    subject: `RiskOS Executive Dossier — Counterparty Risk Memo (${supervisor.compositeRiskRating || 'Under Review'})`,
    html,
    attachments: [{ filename: 'riskos-vendor-dossier.pdf', content: pdfBuffer }],
  });
  if (error) throw new Error(`Resend failed for vendor/student ${studentId}: ${error.message}`);
  return { id: data?.id ?? null };
}

