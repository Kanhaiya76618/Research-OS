'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AppShell from '@/components/AppShell';
import { Landmark, AlertTriangle, Loader2, Scale, Lock, DollarSign, ListOrdered, RotateCcw, CheckCircle2, XCircle } from 'lucide-react';
import { reviewProposal, type PanelVerdict } from '@/lib/api';
import { getStudentId } from '@/lib/studentId';

const RISK_PANELISTS = {
  methods_skeptic: { label: 'Legal & Regulatory Skeptic', icon: Scale, color: '#1e3a8a' },
  impact_skeptic: { label: 'Cyber & InfoSec Skeptic', icon: Lock, color: '#0284c7' },
  feasibility_skeptic: { label: 'Financial & Credit Skeptic', icon: DollarSign, color: '#d97706' },
} as const;

const SEVERITY = {
  minor: { color: '#64748b', bg: 'rgba(100,116,139,0.1)', ring: 'transparent' },
  major: { color: '#d97706', bg: 'rgba(217,119,6,0.12)', ring: 'rgba(217,119,6,0.3)' },
  blocking: { color: '#dc2626', bg: 'rgba(220,38,38,0.14)', ring: 'rgba(220,38,38,0.5)' },
} as const;

const VERDICTS = {
  fund: { label: 'APPROVED VENDOR', color: '#059669', bg: 'rgba(5,150,105,0.08)', note: 'The committee approves onboarding with standard Razorpay terms.' },
  revise_and_resubmit: { label: 'CONDITIONAL APPROVAL', color: '#d97706', bg: 'rgba(217,119,6,0.08)', note: 'Onboarding approved ONLY AFTER satisfying the critical stipulations below.' },
  reject: { label: 'REJECT VENDOR', color: '#dc2626', bg: 'rgba(220,38,38,0.08)', note: 'The committee rejects this vendor due to unmitigated counterparty / regulatory hazards.' },
} as const;

export default function GrantCraftPage() {
  const [proposal, setProposal] = useState('');
  const [verdict, setVerdict] = useState<PanelVerdict | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!proposal.trim() || loading) return;
    setLoading(true);
    setError(null);
    try {
      setVerdict(await reviewProposal(proposal.trim(), getStudentId()));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const vCfg = verdict ? VERDICTS[verdict.verdict] : null;

  return (
    <AppShell topic="Risk Committee Defense" agentStatus={loading ? 'running' : 'idle'}>
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="flex items-center gap-2 mb-2">
          <Landmark size={20} className="text-[#0c2340]" />
          <h1 className="text-xl font-extrabold text-[#0c2340] tracking-tight">Risk & Compliance Committee Defense</h1>
        </div>
        <p className="text-xs text-[#64748b] font-medium mb-6">
          Defend your vendor onboarding dossier before an adversarial 3-member committee: Legal/Regulatory, Cyber/InfoSec, and Financial/Credit skeptics who scrutinize clauses and cross-examine past default records.
        </p>

        {/* Proposal form */}
        <div className="clay-card p-5 mb-8" style={{ background: 'rgba(255,255,255,0.92)' }}>
          <label htmlFor="gc-proposal" className="text-[10px] font-mono font-bold text-[#64748b] uppercase tracking-wider block mb-1">
            Vendor Onboarding Proposal & Due Diligence Dossier
          </label>
          <textarea
            id="gc-proposal"
            value={proposal}
            onChange={(e) => setProposal(e.target.value)}
            rows={7}
            placeholder="Paste your vendor proposal, PreFlight onboarding plan, or executive contract summary for committee evaluation."
            className="w-full text-xs leading-relaxed rounded-xl p-3 clay-input outline-none focus:ring-2 focus:ring-[#0284c7]/30 text-[#0c2340] placeholder:text-[#94a3b8] font-medium resize-y"
            disabled={loading}
          />
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-black/4">
            <span className="text-[11px] text-[#64748b]">
              Tip: Paste PreFlight output or raw vendor disclosure clauses.
            </span>
            <button
              onClick={submit}
              disabled={!proposal.trim() || loading}
              className="clay-btn-primary flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold disabled:opacity-40"
            >
              {loading && <Loader2 size={13} className="animate-spin" />}
              <span>{loading ? 'Committee Deliberating…' : 'Face Risk Committee'}</span>
            </button>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                role="alert"
                className="flex items-start gap-2 mt-3 px-3 py-2.5 rounded-xl bg-red-50 border border-red-200"
              >
                <AlertTriangle size={13} className="text-[#dc2626] shrink-0 mt-0.5" />
                <p className="text-xs text-[#dc2626] font-medium leading-relaxed">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {!verdict && !loading && !error && (
          <div className="clay-card p-8 text-center" style={{ background: 'rgba(255,255,255,0.85)' }}>
            <Landmark size={24} className="text-[#0c2340] mx-auto mb-2" />
            <p className="text-sm font-bold text-[#0c2340] mb-1">The Committee Awaits</p>
            <p className="text-xs text-[#64748b] max-w-md mx-auto leading-relaxed">
              Three skeptics (Legal, Cyber, and Financial) will vigorously interrogate your vendor terms, citing past default echoes and prerequisite reading gaps.
            </p>
          </div>
        )}

        <AnimatePresence>
          {verdict && vCfg && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="space-y-5"
            >
              {/* Verdict banner */}
              <div
                className="clay-card p-6 flex items-center justify-between gap-4"
                style={{ background: vCfg.bg, border: `1.5px solid ${vCfg.color}40` }}
              >
                <div className="flex items-center gap-3.5">
                  {verdict.verdict === 'fund' ? (
                    <CheckCircle2 size={28} style={{ color: vCfg.color }} />
                  ) : verdict.verdict === 'reject' ? (
                    <XCircle size={28} style={{ color: vCfg.color }} />
                  ) : (
                    <AlertTriangle size={28} style={{ color: vCfg.color }} />
                  )}
                  <div>
                    <p className="text-xl font-extrabold tracking-tight" style={{ color: vCfg.color }}>{vCfg.label}</p>
                    <p className="text-xs text-[#334155] font-medium mt-0.5">{vCfg.note}</p>
                  </div>
                </div>
                <button
                  onClick={() => setVerdict(null)}
                  className="clay-btn-secondary flex items-center gap-1.5 px-4 py-2 text-xs font-bold shrink-0"
                >
                  <RotateCcw size={12} /> Revise & Re-submit
                </button>
              </div>

              {/* Committee Objections */}
              <div className="space-y-3">
                <p className="text-xs font-bold text-[#0c2340]">Committee Interrogation & Objections</p>
                {verdict.objections.map((o, i) => {
                  const p = RISK_PANELISTS[o.panelist] || RISK_PANELISTS.methods_skeptic;
                  const s = SEVERITY[o.severity] || SEVERITY.minor;
                  const PIcon = p.icon;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08, type: 'spring', stiffness: 300, damping: 28 }}
                      className="clay-card p-5"
                      style={{
                        background: 'rgba(255, 255, 255, 0.88)',
                        borderLeft: `4px solid ${p.color}`,
                        boxShadow: o.severity === 'blocking' ? `0 6px 24px ${s.ring}` : undefined,
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <PIcon size={14} style={{ color: p.color } as React.CSSProperties} />
                        <span className="text-xs font-bold text-[#0c2340]">{p.label}</span>
                        <span
                          className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase ml-auto"
                          style={{ background: s.bg, color: s.color }}
                        >
                          {o.severity}
                        </span>
                      </div>
                      <p className="text-xs text-[#334155] font-medium leading-relaxed">{o.objection}</p>
                    </motion.div>
                  );
                })}
              </div>

              {/* Mandatory Revision Priorities */}
              <div className="clay-card p-5" style={{ background: 'rgba(255, 255, 255, 0.9)' }}>
                <div className="flex items-center gap-1.5 mb-2.5">
                  <ListOrdered size={14} className="text-[#0284c7]" />
                  <span className="text-xs font-bold text-[#0c2340]">Mandatory Stipulations for Approval</span>
                </div>
                {verdict.revisionPriorities.length > 0 ? (
                  <ol className="space-y-2">
                    {verdict.revisionPriorities.map((r, i) => (
                      <li key={i} className="text-xs text-[#334155] leading-relaxed flex gap-2 font-medium">
                        <span className="font-mono font-bold text-[#0284c7] shrink-0">{i + 1}.</span>
                        {r}
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="text-xs text-[#64748b]">None — committee cleared all terms without stipulations.</p>
                )}
              </div>

              <p className="text-[10px] font-mono text-[#94a3b8]">
                Committee review finalized: {new Date(verdict.reviewedAt).toLocaleString()}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppShell>
  );
}
