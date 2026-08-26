'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, X, AlertOctagon, Zap, Lock, Scale, Loader2 } from 'lucide-react';
import { critiqueDraft, type DraftCritique, type CritiqueFlag } from '@/lib/api';
import { getStudentId } from '@/lib/studentId';

const REDFLAG_TYPE_CONFIG: Record<string, { icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>, color: string, bg: string, label: string }> = {
  uncited_claim: { icon: AlertOctagon, color: '#dc2626', bg: 'rgba(220,38,38,0.08)', label: 'Unverified Cert' },
  overclaiming: { icon: Scale, color: '#d97706', bg: 'rgba(217,119,6,0.08)', label: 'Liability Evasion' },
  unreproducible_method: { icon: Lock, color: '#7c3aed', bg: 'rgba(124,58,237,0.08)', label: 'Subprocessor Risk' },
  structure: { icon: Zap, color: '#0284c7', bg: 'rgba(2,132,199,0.08)', label: 'Regulatory Gap' },
};

const SEVERITY_DOTS: Record<string, string> = {
  high: '#dc2626',
  medium: '#d97706',
  low: '#64748b',
};

function FlagCard({ flag }: { flag: CritiqueFlag }) {
  const cfg = REDFLAG_TYPE_CONFIG[flag.type] || REDFLAG_TYPE_CONFIG.uncited_claim;
  const FlagIcon = cfg.icon;
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="rounded-xl p-3 mb-2.5 shadow-sm"
      style={{ background: cfg.bg, border: `1px solid ${cfg.color}25`, borderLeft: `3px solid ${cfg.color}` }}
    >
      <div className="flex items-start gap-2">
        <FlagIcon size={13} className="shrink-0" style={{ color: cfg.color, marginTop: 2 } as React.CSSProperties} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md" style={{ background: `${cfg.color}15`, color: cfg.color }}>
              {cfg.label}
            </span>
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: SEVERITY_DOTS[flag.severity] || '#dc2626' }} />
            <span className="text-[9px] font-mono font-bold text-[#64748b] uppercase">{flag.severity}</span>
          </div>
          <p className="text-[10px] italic font-mono text-[#0f172a] leading-relaxed mb-1 bg-white/60 p-1.5 rounded border border-black/4">
            &ldquo;{flag.excerpt}&rdquo;
          </p>
          <p className="text-[10px] text-[#475569] font-medium leading-relaxed">{flag.note}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function CriticPanel() {
  const [open, setOpen] = useState(true);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [critique, setCritique] = useState<DraftCritique | null>(null);

  const run = async () => {
    if (!draft.trim() || loading) return;
    setLoading(true);
    setError(null);
    try {
      setCritique(await critiqueDraft(draft.trim(), getStudentId()));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="clay-card overflow-hidden"
      style={{
        background: 'rgba(255, 255, 255, 0.88)',
      }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 px-4 py-3 border-b border-black/6 hover:bg-black/2 transition-colors"
        aria-expanded={open}
      >
        <ShieldAlert size={14} className="text-[#dc2626]" />
        <span className="text-xs font-bold text-[#0c2340] flex-1 text-left">Red-Flag Contract Auditor</span>
        {critique && critique.flags.length > 0 && (
          <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-red-100 text-[#dc2626]">
            {critique.flags.length} Flags
          </span>
        )}
        <motion.div animate={{ rotate: open ? 0 : -90 }} transition={{ type: 'spring', stiffness: 400, damping: 30 }}>
          <X size={12} className="text-[#64748b]" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            className="overflow-hidden"
          >
            <div className="p-3.5">
              <label htmlFor="critic-draft" className="text-[10px] font-mono font-bold text-[#64748b] uppercase tracking-wider block mb-1.5">
                Vendor Agreement / Disclosure Text
              </label>
              <textarea
                id="critic-draft"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={5}
                placeholder="Paste vendor MSA, SLA terms, or security disclosure — RiskOS audits for liability caps, subprocessor leaks, missing BAA, and DPDP gaps."
                className="w-full text-xs leading-relaxed rounded-xl p-3 clay-input outline-none focus:ring-2 focus:ring-[#0284c7]/30 text-[#0c2340] placeholder:text-[#94a3b8] resize-y"
                disabled={loading}
              />
              <button
                onClick={run}
                disabled={!draft.trim() || loading}
                className="mt-2.5 w-full flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold clay-btn-danger disabled:opacity-40"
              >
                {loading && <Loader2 size={12} className="animate-spin" />}
                {loading ? 'Auditing Clauses…' : 'Audit Red Flags'}
              </button>

              {error && (
                <div
                  role="alert"
                  className="flex items-start gap-2 mt-2 px-3 py-2.5 rounded-xl bg-red-50 border border-red-200"
                >
                  <ShieldAlert size={12} className="text-[#dc2626] shrink-0 mt-0.5" />
                  <p className="text-xs text-[#dc2626] font-medium leading-relaxed">{error}</p>
                </div>
              )}

              {critique && !loading && (
                <div className="mt-3">
                  <div className="rounded-xl p-3 mb-3 bg-slate-50 border border-slate-200">
                    <p className="text-xs font-semibold text-[#0c2340] leading-relaxed">{critique.structureSummary}</p>
                  </div>
                  {critique.flags.length > 0 ? (
                    critique.flags.map((flag, i) => <FlagCard key={i} flag={flag} />)
                  ) : (
                    <p className="text-xs text-[#64748b] text-center py-2">No critical red flags detected.</p>
                  )}
                  <div className="rounded-xl p-3 mt-1.5 bg-sky-50 border border-sky-200">
                    <p className="text-xs font-medium text-[#0c2340] leading-relaxed">{critique.overallAssessment}</p>
                  </div>
                </div>
              )}

              {!critique && !loading && !error && (
                <p className="text-[11px] text-[#64748b] text-center pt-3 pb-1">
                  Paste vendor contract excerpt to audit clauses against Razorpay risk guidelines.
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
