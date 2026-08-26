'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AppShell from '@/components/AppShell';
import { Glasses, AlertTriangle, Loader2, CheckCircle, XCircle, RotateCcw, ShieldAlert, Sparkles, Target } from 'lucide-react';
import { generateReviewExercise, gradeReview, type ReviewExercise, type ReviewGrade } from '@/lib/api';
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

function ResultList({ title, items, color, icon: Icon }: {
  title: string;
  items: string[];
  color: string;
  icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
}) {
  if (items.length === 0) return null;
  return (
    <div className="clay-card p-5" style={{ background: 'rgba(255,255,255,0.88)', borderLeft: `4px solid ${color}` }}>
      <div className="flex items-center gap-2 mb-2.5">
        <Icon size={15} style={{ color } as React.CSSProperties} />
        <span className="text-xs font-bold text-[#0c2340]">{title}</span>
        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full" style={{ background: `${color}15`, color }}>
          {items.length}
        </span>
      </div>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="text-xs text-[#334155] leading-relaxed flex gap-2 font-medium">
            <span className="font-bold shrink-0" style={{ color }}>&bull;</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ReviewerPage() {
  const [topicHint, setTopicHint] = useState('');
  const [exercise, setExercise] = useState<ReviewExercise | null>(null);
  const [review, setReview] = useState('');
  const [grade, setGrade] = useState<ReviewGrade | null>(null);
  const [genLoading, setGenLoading] = useState(false);
  const [gradeLoading, setGradeLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    if (genLoading) return;
    setGenLoading(true);
    setError(null);
    setGrade(null);
    setReview('');
    try {
      setExercise(await generateReviewExercise(getStudentId(), topicHint.trim() || undefined));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setGenLoading(false);
    }
  };

  const submitReview = async () => {
    if (!exercise || !review.trim() || gradeLoading) return;
    setGradeLoading(true);
    setError(null);
    try {
      setGrade(await gradeReview(exercise, review.trim(), getStudentId()));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setGradeLoading(false);
    }
  };

  const reset = () => {
    setExercise(null);
    setGrade(null);
    setReview('');
    setError(null);
  };

  return (
    <AppShell topic="AuditorZero — Vendor Flaw-Spotting Dojo" agentStatus={genLoading || gradeLoading ? 'running' : 'idle'}>
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="flex items-center gap-2 mb-2">
          <Glasses size={20} className="text-[#7c3aed]" />
          <h1 className="text-xl font-extrabold text-[#0c2340] tracking-tight">AuditorZero — Compliance & Fraud Dojo</h1>
        </div>
        <p className="text-xs text-[#64748b] font-medium mb-6">
          AuditorZero generates realistic vendor proposals with exactly 3 planted compliance, security, or financial red flags. Audit the text, submit your findings, and receive verifiable grading on what you caught and what you missed.
        </p>

        {/* Generate controls */}
        {!exercise && (
          <div className="clay-card p-6 mb-8" style={{ background: 'rgba(255,255,255,0.92)' }}>
            <label htmlFor="rz-topic" className="text-[10px] font-mono font-bold text-[#64748b] uppercase tracking-wider block mb-1">
              Vendor Domain / Scenario Focus (Optional)
            </label>
            <div className="flex items-center gap-2.5">
              <input
                id="rz-topic"
                value={topicHint}
                onChange={(e) => setTopicHint(e.target.value)}
                placeholder="e.g. Payment Gateway Subprocessor or COD Logistics Vendor"
                className="flex-1 min-w-0 text-xs rounded-xl p-3 clay-input outline-none focus:ring-2 focus:ring-[#7c3aed]/30 text-[#0c2340] placeholder:text-[#94a3b8] font-medium"
                disabled={genLoading}
              />
              <button
                onClick={generate}
                disabled={genLoading}
                className="clay-btn-primary flex items-center gap-1.5 px-5 py-3 text-xs font-bold shrink-0 disabled:opacity-40"
                style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)' }}
              >
                {genLoading && <Loader2 size={13} className="animate-spin" />}
                <Sparkles size={13} />
                <span>{genLoading ? 'Synthesizing…' : 'Generate Audit Challenge'}</span>
              </button>
            </div>
            {error && <InlineError message={error} />}
            {!genLoading && !error && (
              <div className="mt-4 pt-3 border-t border-black/5 flex items-center gap-2 text-xs text-[#64748b]">
                <Target size={13} className="text-[#7c3aed]" />
                <span>Challenges test your acuity on SOC2 scope exclusions, circular GST invoicing, and DPDP liability caps.</span>
              </div>
            )}
          </div>
        )}

        {/* Exercise + review */}
        <AnimatePresence>
          {exercise && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="space-y-5"
            >
              <div className="clay-card p-6" style={{ background: 'rgba(255,255,255,0.92)' }}>
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-black/5">
                  <ShieldAlert size={15} className="text-[#dc2626]" />
                  <p className="text-xs font-bold text-[#0c2340]">Vendor Disclosure Excerpt — Find the 3 Planted Red Flags</p>
                </div>
                <p className="text-xs font-mono text-[#0f172a] leading-relaxed whitespace-pre-wrap bg-slate-50 p-4 rounded-xl border border-slate-200">
                  {exercise.excerpt}
                </p>
              </div>

              {!grade && (
                <div className="clay-card p-6" style={{ background: 'rgba(255,255,255,0.92)' }}>
                  <label htmlFor="rz-review" className="text-[10px] font-mono font-bold text-[#64748b] uppercase tracking-wider block mb-1.5">
                    Your Audit Findings & Objections
                  </label>
                  <textarea
                    id="rz-review"
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    rows={5}
                    placeholder="Identify the 3 flaws: point to specific contractual clauses, missing certifications, or fraudulent claims in the text."
                    className="w-full text-xs leading-relaxed rounded-xl p-3 clay-input outline-none focus:ring-2 focus:ring-[#7c3aed]/30 text-[#0c2340] placeholder:text-[#94a3b8] font-medium resize-y"
                    disabled={gradeLoading}
                  />
                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={submitReview}
                      disabled={!review.trim() || gradeLoading}
                      className="clay-btn-primary flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold disabled:opacity-40"
                      style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)' }}
                    >
                      {gradeLoading && <Loader2 size={13} className="animate-spin" />}
                      <span>{gradeLoading ? 'Grading Audit…' : 'Submit Audit Report'}</span>
                    </button>
                    <button
                      onClick={reset}
                      className="clay-btn-secondary flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold"
                    >
                      <RotateCcw size={12} /> New Challenge
                    </button>
                  </div>
                  {error && <InlineError message={error} />}
                </div>
              )}

              {/* Results */}
              {grade && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="space-y-4"
                >
                  <div
                    className="clay-card p-6 flex items-center justify-between gap-6"
                    style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.25)' }}
                  >
                    <div>
                      <p className="text-[10px] font-mono font-bold text-[#7c3aed] uppercase tracking-wider mb-1">Auditor Score</p>
                      <p className="text-3xl font-extrabold text-[#7c3aed]">
                        {grade.caught.length}/{exercise.plantedFlaws.length}
                        <span className="text-sm font-mono text-[#64748b] ml-2">({grade.score})</span>
                      </p>
                    </div>
                    <div className="flex-1 border-l border-purple-200 pl-4">
                      <p className="text-xs font-bold text-[#0c2340] mb-0.5">Auditor Feedback</p>
                      <p className="text-xs text-[#334155] leading-relaxed font-medium">{grade.coaching}</p>
                    </div>
                  </div>

                  <ResultList title="Verified Red Flags Caught" items={grade.caught} color="#059669" icon={CheckCircle} />
                  <ResultList title="Critical Hazards Missed" items={grade.missed} color="#dc2626" icon={XCircle} />
                  <ResultList title="False Alarms / Unsubstantiated Objections" items={grade.falsePositives} color="#d97706" icon={AlertTriangle} />

                  <button
                    onClick={reset}
                    className="clay-btn-primary flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold"
                    style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)' }}
                  >
                    <RotateCcw size={13} /> Try Another Audit Scenario
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppShell>
  );
}
