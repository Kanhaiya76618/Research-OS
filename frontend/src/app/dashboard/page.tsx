'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AppShell from '@/components/AppShell';
import { LayoutDashboard, AlertTriangle, Loader2, Link2, Lightbulb, Download, Mail, CheckCircle, ShieldCheck, FileCheck2 } from 'lucide-react';
import { getSupervisorReport, downloadReportPdf, emailReport, type SupervisorReport } from '@/lib/api';
import { getStudentId } from '@/lib/studentId';

function InlineError({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="flex items-start gap-2 mt-3 px-3.5 py-2.5 rounded-xl bg-red-50 border border-red-200"
    >
      <AlertTriangle size={13} className="text-[#dc2626] shrink-0 mt-0.5" />
      <p className="text-xs text-[#dc2626] font-medium leading-relaxed">{message}</p>
    </div>
  );
}

export default function DashboardPage() {
  const [report, setReport] = useState<SupervisorReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const [email, setEmail] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  const runCheck = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      setReport(await getSupervisorReport(getStudentId()));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const downloadPdf = async () => {
    if (pdfLoading) return;
    setPdfLoading(true);
    setPdfError(null);
    try {
      const blob = await downloadReportPdf(getStudentId());
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'razorpay-vendor-risk-dossier.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setPdfError(err instanceof Error ? err.message : String(err));
    } finally {
      setPdfLoading(false);
    }
  };

  const sendEmail = async () => {
    if (emailLoading || !email.trim()) return;
    setEmailLoading(true);
    setEmailError(null);
    setEmailSent(false);
    try {
      await emailReport(getStudentId(), email.trim());
      setEmailSent(true);
    } catch (err) {
      setEmailError(err instanceof Error ? err.message : String(err));
    } finally {
      setEmailLoading(false);
    }
  };

  return (
    <AppShell topic="Chief Risk Officer (CRO) Executive Hub" agentStatus={loading || pdfLoading || emailLoading ? 'running' : 'idle'}>
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
          <div>
            <div className="flex items-center gap-2">
              <LayoutDashboard size={20} className="text-[#0284c7]" />
              <h1 className="text-xl font-extrabold text-[#0c2340] tracking-tight">CRO Executive Risk Intelligence Hub</h1>
            </div>
            <p className="text-xs text-[#64748b] font-medium mt-1">
              Synthesizes diligence trails, contract audits, incident memory, and committee decisions into an executive sign-off memo.
            </p>
          </div>
          <button
            onClick={runCheck}
            disabled={loading}
            className="clay-btn-primary flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold disabled:opacity-40"
          >
            {loading && <Loader2 size={13} className="animate-spin" />}
            <span>{loading ? 'Synthesizing Risk Data…' : 'Generate CRO Audit Memo'}</span>
          </button>
        </div>

        {error && <InlineError message={error} />}

        {!report && !loading && !error && (
          <div className="clay-card p-8 text-center" style={{ background: 'rgba(255,255,255,0.85)' }}>
            <FileCheck2 size={24} className="text-[#0284c7] mx-auto mb-2" />
            <p className="text-sm font-bold text-[#0c2340] mb-1">No CRO Audit Memo Generated</p>
            <p className="text-xs text-[#64748b] max-w-md mx-auto leading-relaxed">
              Click &ldquo;Generate CRO Audit Memo&rdquo; to cross-examine vendor due diligence progress, red-flag severity, historical fraud echoes, and risk committee stipulations into a unified briefing.
            </p>
          </div>
        )}

        <AnimatePresence>
          {report && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="space-y-5 mt-2"
            >
              {/* Narrative */}
              <div
                className="clay-card p-6"
                style={{
                  background: 'rgba(2,132,199,0.06)',
                  border: '1px solid rgba(2,132,199,0.2)',
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck size={16} className="text-[#0284c7]" />
                  <p className="text-xs font-bold text-[#0c2340] uppercase tracking-wider">Chief Risk Officer Executive Synthesis</p>
                </div>
                <p className="text-xs text-[#1e293b] leading-relaxed font-medium">{report.overallNarrative}</p>
                <p className="text-[10px] font-mono text-[#64748b] mt-3 pt-2 border-t border-black/4">
                  Dossier synthesized: {new Date(report.generatedAt).toLocaleString()}
                </p>
              </div>

              {/* Consistency notes */}
              <div className="clay-card p-5" style={{ background: 'rgba(255,255,255,0.88)', borderLeft: '4px solid #d97706' }}>
                <div className="flex items-center gap-2 mb-2.5">
                  <Link2 size={15} className="text-[#d97706]" />
                  <span className="text-xs font-bold text-[#0c2340]">Cross-Entity Risk & Compliance Consistency</span>
                </div>
                {report.consistencyNotes.length > 0 ? (
                  <ul className="space-y-2">
                    {report.consistencyNotes.map((n, i) => (
                      <li key={i} className="text-xs text-[#334155] leading-relaxed flex gap-2 font-medium">
                        <span className="text-[#d97706] font-bold shrink-0">&bull;</span>
                        {n}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-[#64748b]">No multi-module discrepancies detected.</p>
                )}
              </div>

              {/* Suggestions */}
              <div className="clay-card p-5" style={{ background: 'rgba(255,255,255,0.88)', borderLeft: '4px solid #059669' }}>
                <div className="flex items-center gap-2 mb-2.5">
                  <Lightbulb size={15} className="text-[#059669]" />
                  <span className="text-xs font-bold text-[#0c2340]">Mandatory Risk Mitigation Directives</span>
                </div>
                {report.suggestions.length > 0 ? (
                  <ul className="space-y-2">
                    {report.suggestions.map((s, i) => (
                      <li key={i} className="text-xs text-[#334155] leading-relaxed flex gap-2 font-medium">
                        <span className="text-[#059669] font-bold shrink-0">&bull;</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-[#64748b]">No additional risk directives issued.</p>
                )}
              </div>

              {/* Export */}
              <div className="clay-card p-6" style={{ background: 'rgba(255,255,255,0.92)' }}>
                <p className="text-xs font-bold text-[#0c2340] mb-3">Executive Export & Payout Release</p>
                <div className="flex items-center gap-3 flex-wrap">
                  <button
                    onClick={downloadPdf}
                    disabled={pdfLoading}
                    className="clay-btn-primary flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold disabled:opacity-40"
                  >
                    {pdfLoading ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
                    <span>{pdfLoading ? 'Generating Dossier PDF…' : 'Download Risk Dossier PDF'}</span>
                  </button>

                  <div className="flex items-center gap-2 flex-1 min-w-[260px]">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="compliance@razorpay.com"
                      aria-label="Email address for the report"
                      className="flex-1 min-w-0 text-xs rounded-xl p-2.5 clay-input outline-none focus:ring-2 focus:ring-[#0284c7]/30 text-[#0c2340] placeholder:text-[#94a3b8] font-medium"
                      disabled={emailLoading}
                    />
                    <button
                      onClick={sendEmail}
                      disabled={emailLoading || !email.trim()}
                      className="clay-btn-secondary flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold disabled:opacity-40 shrink-0"
                    >
                      {emailLoading ? <Loader2 size={13} className="animate-spin" /> : <Mail size={13} />}
                      <span>{emailLoading ? 'Dispatching…' : 'Email Dossier'}</span>
                    </button>
                  </div>
                </div>

                {emailSent && (
                  <p className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold mt-3" role="status">
                    <CheckCircle size={13} /> Official Risk Assessment Dossier dispatched to compliance inbox.
                  </p>
                )}
                {pdfError && <InlineError message={pdfError} />}
                {emailError && <InlineError message={emailError} />}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppShell>
  );
}
