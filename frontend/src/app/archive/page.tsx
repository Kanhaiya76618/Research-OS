'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AppShell from '@/components/AppShell';
import { ShieldAlert, AlertTriangle, Loader2, Repeat, Building2, Flame } from 'lucide-react';
import { logExperiment, type ArchiveEntry } from '@/lib/api';
import { getStudentId } from '@/lib/studentId';

const SAMPLE_HISTORICAL_INCIDENTS: ArchiveEntry[] = [
  {
    attempted: 'Onboarded fast-payout logistics vendor "QuickTransit Express" without GSTIN 3B reconciliation',
    hypothesis: 'Assumed low counterparty risk due to clean directors record and signed SLA',
    outcome: 'Vendor defaulted on INR 42 Lakhs COD collected from consumers; GSTIN was cancelled retrospectively due to shell invoicing',
    failureMode: 'ShellCompanyInvoicingMismatch',
    lesson: 'Never waive 6-month GSTR-3B active return verification and enforce dynamic COD settlement escrow for first 90 days.',
    similarPriorAttempts: [
      'Failed payout to SwiftDeliver Pvt Ltd in Q2 2023 (similar fake GST registration)',
      'Escrow shortfall in ApexExpress COD payout in Q4 2022',
    ],
    loggedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    attempted: 'Approved cross-border analytics tool without DPDP subprocessor telemetry audit',
    hypothesis: 'Assumed EU-US Data Privacy Framework covered Indian consumer transaction data',
    outcome: 'Subprocessor routed unencrypted payment telemetry through unsanctioned Asian proxy servers, triggering CERT-In notice',
    failureMode: 'SubprocessorTelemetryLeak',
    lesson: 'Mandate strict DPDP Act Data Processing Addendum (DPA) with 72h CERT-In breach notification clauses.',
    similarPriorAttempts: [],
    loggedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
];

function EntryCard({ entry }: { entry: ArchiveEntry }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="clay-card p-5 mb-4"
      style={{
        background: 'rgba(255, 255, 255, 0.88)',
      }}
    >
      <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
        <p className="text-sm font-bold text-[#0c2340] leading-tight flex-1 min-w-0">{entry.attempted}</p>
        <span
          className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full shrink-0 bg-amber-50 text-amber-800 border border-amber-200"
        >
          {entry.failureMode}
        </span>
      </div>
      <p className="text-xs font-mono text-[#64748b] bg-slate-50 p-2 rounded-lg border border-slate-200/60 mb-2">
        <strong className="text-[#0c2340]">Hypothesis:</strong> {entry.hypothesis} <br />
        <strong className="text-red-700">Actual Outcome:</strong> {entry.outcome}
      </p>
      <p className="text-xs text-[#334155] leading-relaxed font-medium">
        <strong className="text-[#0c2340]">Audit Lesson:</strong> {entry.lesson}
      </p>

      {entry.similarPriorAttempts && entry.similarPriorAttempts.length > 0 && (
        <div
          className="mt-3.5 rounded-xl p-3.5"
          style={{
            background: 'rgba(220,38,38,0.06)',
            border: '1px solid rgba(220,38,38,0.2)',
            borderLeft: '4px solid #dc2626',
          }}
          role="status"
        >
          <div className="flex items-center gap-1.5 mb-1.5">
            <Repeat size={13} className="text-[#dc2626]" />
            <span className="text-xs font-bold text-[#dc2626]">
              Echoes {entry.similarPriorAttempts.length} Prior Fraud/Breach Incident{entry.similarPriorAttempts.length > 1 ? 's' : ''}
            </span>
          </div>
          <ul className="space-y-1">
            {entry.similarPriorAttempts.map((a, i) => (
              <li key={i} className="text-xs text-[#7a1d1d] font-medium leading-relaxed">
                &bull; {a}
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-[10px] font-mono text-[#94a3b8] mt-3 pt-2 border-t border-black/4">
        Logged at: {new Date(entry.loggedAt).toLocaleString()}
      </p>
    </motion.div>
  );
}

export default function ArchivePage() {
  const [attempted, setAttempted] = useState('');
  const [hypothesis, setHypothesis] = useState('');
  const [outcome, setOutcome] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [entries, setEntries] = useState<ArchiveEntry[]>(SAMPLE_HISTORICAL_INCIDENTS);

  const canSubmit = attempted.trim() && hypothesis.trim() && outcome.trim() && !loading;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setError(null);
    try {
      const entry = await logExperiment({
        attempted: attempted.trim(),
        hypothesis: hypothesis.trim(),
        outcome: outcome.trim(),
        studentId: getStudentId(),
      });
      setEntries((prev) => [entry, ...prev]);
      setAttempted('');
      setHypothesis('');
      setOutcome('');
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell topic="Historical Fraud & Vendor Default Archive" agentStatus={loading ? 'running' : 'idle'}>
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="flex items-center gap-2 mb-2">
          <ShieldAlert size={20} className="text-[#d97706]" />
          <h1 className="text-xl font-extrabold text-[#0c2340] tracking-tight">Historical Fraud & Vendor Default Archive</h1>
        </div>
        <p className="text-xs text-[#64748b] font-medium mb-6">
          The Archivist Agent stores vendor fraud patterns, breach autopsy reports, and payment default post-mortems — warning you loudly when a new vendor exhibits identical risk signatures.
        </p>

        {/* Log form */}
        <form onSubmit={submit} className="clay-card p-5 mb-8" style={{ background: 'rgba(255,255,255,0.9)' }}>
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-black/5">
            <Flame size={15} className="text-[#dc2626]" />
            <span className="text-xs font-bold text-[#0c2340]">Log New Vendor Default / Security Incident</span>
          </div>

          <label htmlFor="arc-attempted" className="text-[10px] font-mono font-bold text-[#64748b] uppercase tracking-wider block mb-1">
            Vendor Action / Contract Attempted
          </label>
          <input
            id="arc-attempted"
            value={attempted}
            onChange={(e) => setAttempted(e.target.value)}
            placeholder="e.g. Approved 30-day payout credit terms for SaaS provider with 2-month cash runway"
            className="w-full text-xs rounded-xl p-3 mb-3 clay-input outline-none focus:ring-2 focus:ring-[#0284c7]/30 text-[#0c2340] placeholder:text-[#94a3b8] font-medium"
            disabled={loading}
          />

          <label htmlFor="arc-hypothesis" className="text-[10px] font-mono font-bold text-[#64748b] uppercase tracking-wider block mb-1">
            Initial Due Diligence Assumption
          </label>
          <input
            id="arc-hypothesis"
            value={hypothesis}
            onChange={(e) => setHypothesis(e.target.value)}
            placeholder="e.g. Expected Series A funding close to replenish working capital before Q3"
            className="w-full text-xs rounded-xl p-3 mb-3 clay-input outline-none focus:ring-2 focus:ring-[#0284c7]/30 text-[#0c2340] placeholder:text-[#94a3b8] font-medium"
            disabled={loading}
          />

          <label htmlFor="arc-outcome" className="text-[10px] font-mono font-bold text-[#64748b] uppercase tracking-wider block mb-1">
            Actual Fraud / Breach / Default Outcome
          </label>
          <textarea
            id="arc-outcome"
            value={outcome}
            onChange={(e) => setOutcome(e.target.value)}
            rows={3}
            placeholder="e.g. Funding fell through; vendor halted database access abruptly, leaving unverified customer data in limbo."
            className="w-full text-xs leading-relaxed rounded-xl p-3 clay-input outline-none focus:ring-2 focus:ring-[#0284c7]/30 text-[#0c2340] placeholder:text-[#94a3b8] font-medium resize-y"
            disabled={loading}
          />

          <button
            type="submit"
            disabled={!canSubmit}
            className="mt-4 flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold clay-btn-primary disabled:opacity-40"
          >
            {loading && <Loader2 size={13} className="animate-spin" />}
            <span>{loading ? 'Analyzing Failure Mode…' : 'Log Incident to Risk Memory'}</span>
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

        {/* Entries */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-[#0c2340]">Institutional Risk Memory ({entries.length} Records)</span>
        </div>

        <div className="space-y-3">
          <AnimatePresence>
            {entries.map((e) => (
              <EntryCard key={e.loggedAt + e.attempted} entry={e} />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </AppShell>
  );
}
