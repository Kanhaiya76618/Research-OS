'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import AppShell from '@/components/AppShell';
import { ClipboardCheck, AlertTriangle, Loader2, ListOrdered, ShieldCheck, Target, Layers, ArrowRight } from 'lucide-react';
import { planExperiment, type ExperimentPlan } from '@/lib/api';
import { getStudentId } from '@/lib/studentId';

function BulletSection({ icon: Icon, color, title, items }: {
  icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
  color: string;
  title: string;
  items: string[];
}) {
  return (
    <div className="clay-card p-5" style={{ background: 'rgba(255,255,255,0.88)' }}>
      <div className="flex items-center gap-2 mb-2.5">
        <Icon size={15} style={{ color } as React.CSSProperties} />
        <span className="text-xs font-bold text-[#0c2340]">{title}</span>
      </div>
      {items.length > 0 ? (
        <ul className="space-y-2">
          {items.map((item, i) => (
            <li key={i} className="text-xs text-[#334155] leading-relaxed flex gap-2 font-medium">
              <span className="font-bold shrink-0" style={{ color }}>&bull;</span>
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-[#64748b]">None specified.</p>
      )}
    </div>
  );
}

export default function PreFlightPage() {
  const [objective, setObjective] = useState('');
  const [approach, setApproach] = useState('');
  const [constraints, setConstraints] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<ExperimentPlan | null>(null);

  const canSubmit = objective.trim() && approach.trim() && !loading;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setError(null);
    try {
      setPlan(
        await planExperiment({
          objective: objective.trim(),
          plannedApproach: approach.trim(),
          constraints: constraints.trim() || undefined,
          studentId: getStudentId(),
        })
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell topic="Pre-Flight Onboarding Mitigation Planner" agentStatus={loading ? 'running' : 'idle'}>
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="flex items-center gap-2 mb-2">
          <ClipboardCheck size={20} className="text-[#0284c7]" />
          <h1 className="text-xl font-extrabold text-[#0c2340] tracking-tight">Pre-Flight Onboarding & Risk Mitigation Planner</h1>
        </div>
        <p className="text-xs text-[#64748b] font-medium mb-6">
          Pre-register vendor onboarding terms before signing. The Planner Agent converts business proposals into phased milestones, controls, and escrow triggers — alerting you if terms replicate prior default patterns.
        </p>

        {/* Proposal form */}
        <form onSubmit={submit} className="clay-card p-5 mb-8" style={{ background: 'rgba(255,255,255,0.92)' }}>
          <label htmlFor="pf-objective" className="text-[10px] font-mono font-bold text-[#64748b] uppercase tracking-wider block mb-1">
            Vendor Engagement Objective
          </label>
          <input
            id="pf-objective"
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            placeholder="e.g. Onboard CloudGate Infra as multi-cloud database subprocessor with 99.95% uptime SLA"
            className="w-full text-xs rounded-xl p-3 mb-3.5 clay-input outline-none focus:ring-2 focus:ring-[#0284c7]/30 text-[#0c2340] placeholder:text-[#94a3b8] font-medium"
            disabled={loading}
          />

          <label htmlFor="pf-approach" className="text-[10px] font-mono font-bold text-[#64748b] uppercase tracking-wider block mb-1">
            Commercial & Technical Payout Terms
          </label>
          <textarea
            id="pf-approach"
            value={approach}
            onChange={(e) => setApproach(e.target.value)}
            rows={3}
            placeholder="e.g. Monthly vendor payout of INR 18 Lakhs via RazorpayX, annual agreement with 30-day termination for cause, SOC2 Type II annual audit audit requirement."
            className="w-full text-xs leading-relaxed rounded-xl p-3 mb-3.5 clay-input outline-none focus:ring-2 focus:ring-[#0284c7]/30 text-[#0c2340] placeholder:text-[#94a3b8] font-medium resize-y"
            disabled={loading}
          />

          <label htmlFor="pf-constraints" className="text-[10px] font-mono font-bold text-[#64748b] uppercase tracking-wider block mb-1">
            Risk Mitigation Safeguards & Escrow Triggers (Optional)
          </label>
          <input
            id="pf-constraints"
            value={constraints}
            onChange={(e) => setConstraints(e.target.value)}
            placeholder="e.g. 15% rolling reserve holdback for 60 days, CERT-In 72h notice clause, Penny Drop verified account"
            className="w-full text-xs rounded-xl p-3 clay-input outline-none focus:ring-2 focus:ring-[#0284c7]/30 text-[#0c2340] placeholder:text-[#94a3b8] font-medium"
            disabled={loading}
          />

          <button
            type="submit"
            disabled={!canSubmit}
            className="mt-4 flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold clay-btn-primary disabled:opacity-40"
          >
            {loading && <Loader2 size={13} className="animate-spin" />}
            <span>{loading ? 'Evaluating Mitigation Plan…' : 'Run Pre-Flight Risk Plan'}</span>
          </button>

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
        </form>

        {!plan && !loading && !error && (
          <div className="clay-card p-8 text-center" style={{ background: 'rgba(255,255,255,0.85)' }}>
            <ClipboardCheck size={24} className="text-[#0284c7] mx-auto mb-2" />
            <p className="text-sm font-bold text-[#0c2340] mb-1">No onboarding proposal evaluated yet</p>
            <p className="text-xs text-[#64748b] max-w-md mx-auto leading-relaxed">
              Submit commercial terms and engagement scope above. The Planner Agent will establish falsifiable milestones, audit controls, and check your historical failure archive.
            </p>
          </div>
        )}

        <AnimatePresence>
          {plan && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="space-y-4"
            >
              {/* Historical Incident Echo Warnings */}
              {plan.archiveWarnings && plan.archiveWarnings.length > 0 && (
                <motion.div
                  initial={{ scale: 0.97 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  role="alert"
                  className="rounded-2xl p-5"
                  style={{
                    background: 'rgba(220,38,38,0.08)',
                    border: '2px solid rgba(220,38,38,0.4)',
                    boxShadow: '0 8px 32px rgba(220,38,38,0.12)',
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle size={17} className="text-[#dc2626]" />
                    <span className="text-sm font-bold text-[#dc2626]">
                      Historical Default Pattern Detected:
                    </span>
                  </div>
                  <ul className="space-y-1.5">
                    {plan.archiveWarnings.map((w, i) => (
                      <li key={i} className="text-xs text-[#7a1d1d] leading-relaxed font-semibold flex gap-2">
                        <span className="text-[#dc2626] font-bold shrink-0">&bull;</span>
                        {w}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Diligence Prerequisite Gaps */}
              {plan.prereqGaps && plan.prereqGaps.length > 0 && (
                <div
                  className="clay-card p-5"
                  style={{
                    background: 'rgba(2,132,199,0.06)',
                    border: '1px solid rgba(2,132,199,0.25)',
                    borderLeft: '4px solid #0284c7',
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Layers size={15} className="text-[#0284c7]" />
                    <span className="text-xs font-bold text-[#0c2340]">Missing Due Diligence Prerequisites</span>
                  </div>
                  <ul className="space-y-1.5 mb-3">
                    {plan.prereqGaps.map((g, i) => (
                      <li key={i} className="text-xs text-[#1e293b] leading-relaxed flex gap-2 font-medium">
                        <span className="text-[#0284c7] font-bold shrink-0">&bull;</span>
                        {g}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/curriculum-view"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#0284c7] hover:text-[#0c2340] transition-colors"
                  >
                    Open Due Diligence Trail <ArrowRight size={12} />
                  </Link>
                </div>
              )}

              <BulletSection icon={ListOrdered} color="#0284c7" title="Onboarding Milestones & SLA Gates" items={plan.milestones} />
              <BulletSection icon={ShieldCheck} color="#0d9488" title="Enforceable Audit Controls & Escrow Rules" items={plan.controls} />
              <BulletSection icon={Target} color="#1e3a8a" title="Falsifiable Onboarding Acceptance Criteria" items={plan.successCriteria} />

              <p className="text-[10px] font-mono text-[#94a3b8] pt-2">
                Plan audited: {new Date(plan.createdAt).toLocaleString()}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppShell>
  );
}
