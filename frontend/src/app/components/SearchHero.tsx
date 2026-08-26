'use client';
import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight, ShieldCheck, Command, AlertTriangle, Building2 } from 'lucide-react';
import PipelineLoader from '@/components/PipelineLoader';
import { generateCurriculum } from '@/lib/api';
import { getStudentId } from '@/lib/studentId';

const VENDOR_SUGGESTIONS = [
  { id: 'cloudgate-infra.io', title: 'CloudGate Infrastructure (Multi-Cloud Subprocessor)', tier: 'Tier 1 Critical', risk: 'Medium Risk' },
  { id: 'paynex-gateway.com', title: 'PayNex Payment Aggregator (Merchant Payouts)', tier: 'Tier 1 Critical', risk: 'Low Risk' },
  { id: 'medvault-health.ai', title: 'MedVault Health AI (HIPAA Healthcare SaaS)', tier: 'Tier 2 High', risk: 'High Risk' },
  { id: 'apex-logistics.in', title: 'Apex Logistics & COD Delivery (Vendor GSTIN: 27AABCU9603R1ZM)', tier: 'Tier 3 Operational', risk: 'Medium Risk' },
  { id: 'datalake-analytics.co', title: 'DataLake Cross-Border Analytics (Subprocessor Transfer)', tier: 'Tier 2 High', risk: 'High Risk' },
];

type PipelineState = 'idle' | 'running' | 'done';

export default function SearchHero() {
  const [query, setQuery] = useState('');
  const [pipelineState, setPipelineState] = useState<PipelineState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const filteredSuggestions = query.length > 1
    ? VENDOR_SUGGESTIONS.filter(
        (s) => s.id.toLowerCase().includes(query.toLowerCase()) || s.title.toLowerCase().includes(query.toLowerCase())
      )
    : VENDOR_SUGGESTIONS;

  const handleSubmit = useCallback(async () => {
    if (!query.trim() || pipelineState === 'running') return;
    setShowSuggestions(false);
    setError(null);
    setPipelineState('running');
    try {
      const path = await generateCurriculum(query.trim(), getStudentId());
      sessionStorage.setItem('researchos-learning-path', JSON.stringify(path));
      setPipelineState('done');
      setTimeout(() => router.push('/curriculum-view'), 600);
    } catch (err) {
      setPipelineState('idle');
      setError(err instanceof Error ? err.message : String(err));
    }
  }, [query, pipelineState, router]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
    if (e.key === 'Escape') setShowSuggestions(false);
  };

  return (
    <div className="flex flex-col items-center pt-8 pb-10">
      {/* Eyebrow badge with tactile clay pill */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full clay-badge"
        style={{
          background: '#ffffff',
          border: '1px solid rgba(2,132,199,0.25)',
        }}
      >
        <ShieldCheck size={13} className="text-[#0284c7]" />
        <span className="text-[11px] font-mono font-bold text-[#0c2340] tracking-wide">
          Razorpay Track 2 · AI Vendor & Merchant Risk Manager
        </span>
      </motion.div>

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30, delay: 0.05 }}
        className="text-4xl lg:text-5xl xl:text-6xl font-extrabold text-center leading-tight mb-3 tracking-tight"
      >
        <span className="text-[#0c2340]">Autonomous Due Diligence</span>
        <br />
        <span className="bg-gradient-to-r from-[#0284c7] via-[#1e3a8a] to-[#0d9488] bg-clip-text text-transparent">
          before you sign or payout.
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="text-sm text-[#475569] text-center max-w-2xl mb-8 leading-relaxed font-medium"
      >
        Input any vendor domain, legal entity, or GSTIN. RiskOS autonomously maps 4-tier due diligence trails, audits contractual red flags, cross-checks fraud archives, and runs automated risk committee defense.
      </motion.p>

      {/* Tactile Claymorphism Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30, delay: 0.1 }}
        className="relative w-full max-w-2xl"
      >
        <div
          className="relative rounded-2xl clay-card transition-all duration-200"
          style={{
            background: 'rgba(255, 255, 255, 0.88)',
            border: '1px solid rgba(255, 255, 255, 0.95)',
          }}
        >
          <div className="flex items-center gap-3 px-5 py-3.5">
            <Search size={18} className="text-[#0284c7] shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true); }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              onKeyDown={handleKeyDown}
              placeholder="Enter vendor domain, GSTIN, or company name — e.g. cloudgate-infra.io"
              aria-label="Vendor domain or legal entity"
              className="flex-1 bg-transparent text-sm text-[#0c2340] placeholder-[#94a3b8] outline-none font-semibold"
              autoComplete="off"
              disabled={pipelineState === 'running'}
            />
            <div className="flex items-center gap-2 shrink-0">
              <span className="kbd-hint hidden sm:flex items-center gap-0.5 text-[#64748b]">
                <Command size={9} />K
              </span>
              <motion.button
                onClick={handleSubmit}
                disabled={!query.trim() || pipelineState === 'running'}
                className="clay-btn-primary flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <span>{pipelineState === 'running' ? 'Auditing…' : 'Run Due Diligence'}</span>
                <ArrowRight size={13} />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Error state */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              role="alert"
              className="flex items-start gap-2 mt-3 px-4 py-3 rounded-2xl"
              style={{
                background: 'rgba(220,38,38,0.08)',
                border: '1px solid rgba(220,38,38,0.25)',
              }}
            >
              <AlertTriangle size={13} className="text-[#dc2626] shrink-0 mt-0.5" />
              <p className="text-xs text-[#dc2626] font-medium leading-relaxed">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Suggestions dropdown with claymorphism elevation */}
        <AnimatePresence>
          {showSuggestions && filteredSuggestions.length > 0 && pipelineState === 'idle' && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="absolute left-0 right-0 top-full mt-2 rounded-2xl overflow-hidden z-50 clay-card"
              style={{
                background: 'rgba(255,255,255,0.96)',
                boxShadow: '0 20px 60px rgba(12,35,64,0.14), 0 4px 16px rgba(0,0,0,0.06)',
              }}
            >
              <div className="px-4 py-2.5 border-b border-black/6 bg-slate-50/50 flex items-center justify-between">
                <p className="eyebrow text-[#0284c7]">Featured Vendor Profiles</p>
                <span className="text-[10px] font-mono text-[#64748b]">Razorpay Ecosystem</span>
              </div>
              {filteredSuggestions.map((s, i) => (
                <motion.button
                  key={s.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  onMouseDown={() => { setQuery(s.id); setShowSuggestions(false); setTimeout(() => inputRef.current?.focus(), 0); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#0c2340] hover:bg-sky-50/80 transition-colors duration-100 text-left border-b border-black/4 last:border-0"
                >
                  <Building2 size={14} className="text-[#0284c7] shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#0c2340]">{s.id}</span>
                      <span className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded bg-blue-50 text-[#0284c7] border border-blue-100">
                        {s.tier}
                      </span>
                    </div>
                    <p className="text-xs text-[#64748b] truncate mt-0.5">{s.title}</p>
                  </div>
                  <span className={`text-[10px] font-mono font-bold shrink-0 ${
                    s.risk.includes('Low') ? 'text-emerald-600' : s.risk.includes('Medium') ? 'text-amber-600' : 'text-red-600'
                  }`}>
                    {s.risk}
                  </span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Pipeline loader */}
      <AnimatePresence>
        {pipelineState !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="w-full max-w-2xl mt-5"
          >
            <PipelineLoader state={pipelineState} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
