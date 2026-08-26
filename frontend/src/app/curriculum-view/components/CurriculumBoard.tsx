'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ChevronRight, ShieldCheck, Building2, HelpCircle, CheckCircle2, Search, Lock, Scale, DollarSign } from 'lucide-react';
import type { LearningPath, LearningNode } from '@/lib/api';

const DEFAULT_SAMPLE_TRAIL: LearningPath = {
  targetTitle: 'CloudGate Infrastructure (Vendor Due Diligence Dossier)',
  targetArxivId: 'cloudgate-infra.io',
  nodes: [
    {
      order: 1,
      title: 'Tier 1: Corporate Entity & Sanction Screening',
      arxivId: 'MCA-CIN: U72900KA2021PTC148892',
      whyItMatters: 'Verifies ultimate beneficial owners (UBOs), Indian MCA corporate active status, GSTIN filing consistency, and global OFAC/AML sanction lists.',
      comprehensionGate: 'Confirm no director holds disqualifications under Section 164(2) and UBO ownership does not route through FATF grey-list jurisdictions.',
      reimplementationTask: 'Upload MCA Certificate of Incorporation, GSTIN return history (GSTR-3B last 6 months), and certified UBO organogram.',
    },
    {
      order: 2,
      title: 'Tier 2: Cyber Security, SOC2 & Subprocessor Flow',
      arxivId: 'SOC2-Type-II / ISO-27001:2022',
      whyItMatters: 'Evaluates customer data encryption at rest (AES-256), multi-tenant isolation in AWS Mumbai / Hyderabad, and 4th-party subprocessor data telemetry.',
      comprehensionGate: 'Ensure all subprocessor data transfers comply with Indian DPDP Act 2023 and no telemetry logs unencrypted PII.',
      reimplementationTask: 'Provide latest SOC2 Type II Audit Report with zero unmediated exceptions, penetration test summary, and Data Processing Addendum (DPA).',
    },
    {
      order: 3,
      title: 'Tier 3: Financial Health, Payout Runways & Credit Risk',
      arxivId: 'RazorpayX Financial Assessment',
      whyItMatters: 'Analyzes EBITDA margins, 18-month cash runway, single-customer revenue dependency, and vendor bank account validation via Penny Drop.',
      comprehensionGate: 'Verify vendor debt-to-equity ratio < 1.5 and monthly vendor payout volatility does not trigger chargeback reserve thresholds.',
      reimplementationTask: 'Provide audited P&L statement for FY23-24, Penny Drop bank verification confirmation, and 12-month projected cash flow statement.',
    },
    {
      order: 4,
      title: 'Tier 4: Contractual Liability, SLA Indemnity & Escrow',
      arxivId: 'Master Services Agreement (MSA)',
      whyItMatters: 'Checks for unlimited indemnity for data breaches, 99.95% uptime SLA credit penalties, and 72-hour mandatory security incident notification clauses.',
      comprehensionGate: 'Verify that liability for confidentiality breaches is uncapped and termination for cause includes immediate escrow data return.',
      reimplementationTask: 'Execute Razorpay Standard Vendor Agreement with uncapped IP/data breach indemnity and 72h CERT-In incident notification clause.',
    },
  ],
};

const TIER_ICONS = [Building2, Lock, DollarSign, Scale];
const TIER_COLORS = ['#0284c7', '#0d9488', '#d97706', '#1e3a8a'];

function NodeCard({ node, index }: { node: LearningNode; index: number }) {
  const [expanded, setExpanded] = useState(index === 0);
  const TierIcon = TIER_ICONS[index % TIER_ICONS.length];
  const tierColor = TIER_COLORS[index % TIER_COLORS.length];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30, delay: index * 0.05 }}
      className="clay-card overflow-hidden mb-3"
      style={{
        background: 'rgba(255, 255, 255, 0.85)',
      }}
    >
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-3.5 px-5 py-4 text-left hover:bg-black/2 transition-colors"
        aria-expanded={expanded}
      >
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-sm"
          style={{ background: tierColor }}
        >
          <TierIcon size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-[#0c2340] truncate">{node.title}</p>
          {node.arxivId && (
            <p className="text-[11px] font-mono text-[#64748b] mt-0.5">{node.arxivId}</p>
          )}
        </div>
        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
          Verification Gate Active
        </span>
        <motion.div animate={{ rotate: expanded ? 90 : 0 }} transition={{ type: 'spring', stiffness: 400, damping: 30 }}>
          <ChevronRight size={16} className="text-[#64748b]" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-2 border-t border-black/5 space-y-3.5">
              <p className="text-xs text-[#334155] leading-relaxed font-medium">{node.whyItMatters}</p>

              {/* Verification Gate Box */}
              <div
                className="rounded-xl p-3.5"
                style={{ background: 'rgba(2,132,199,0.06)', border: '1px solid rgba(2,132,199,0.18)' }}
              >
                <div className="flex items-center gap-1.5 mb-1.5">
                  <HelpCircle size={13} className="text-[#0284c7]" />
                  <span className="text-[10px] font-mono font-bold text-[#0284c7] uppercase tracking-wider">
                    Due Diligence Verification Gate
                  </span>
                </div>
                <p className="text-xs text-[#1e293b] leading-relaxed">{node.comprehensionGate}</p>
              </div>

              {/* Required Audit Evidence Box */}
              <div
                className="rounded-xl p-3.5"
                style={{ background: 'rgba(13,148,136,0.06)', border: '1px solid rgba(13,148,136,0.18)' }}
              >
                <div className="flex items-center gap-1.5 mb-1.5">
                  <CheckCircle2 size={13} className="text-[#0d9488]" />
                  <span className="text-[10px] font-mono font-bold text-[#0d9488] uppercase tracking-wider">
                    Required Compliance Deliverables
                  </span>
                </div>
                <p className="text-xs text-[#1e293b] leading-relaxed">{node.reimplementationTask}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function CurriculumBoard() {
  const [path, setPath] = useState<LearningPath | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('researchos-learning-path');
      if (raw) setPath(JSON.parse(raw));
      else setPath(DEFAULT_SAMPLE_TRAIL);
    } catch {
      setPath(DEFAULT_SAMPLE_TRAIL);
    }
    setLoaded(true);
  }, []);

  if (!loaded) return null;

  const currentPath = path || DEFAULT_SAMPLE_TRAIL;

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin p-6">
      {/* Header stats banner */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="clay-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-sky-100 text-[#0284c7]">
            <Building2 size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-[#0c2340] truncate">{currentPath.targetTitle}</p>
            <p className="text-[10px] font-mono text-[#64748b]">Active Target Entity</p>
          </div>
        </div>

        <div className="clay-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-emerald-100 text-emerald-700">
            <ShieldCheck size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-[#0c2340]">{currentPath.nodes.length} Phased Verification Tiers</p>
            <p className="text-[10px] font-mono text-[#64748b]">Razorpay ThirdWatch Framework</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {currentPath.nodes.map((node, i) => (
          <NodeCard key={`${node.order}-${node.title}`} node={node} index={i} />
        ))}
      </div>
    </div>
  );
}
