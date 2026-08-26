'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Building2, ShieldCheck, ShieldAlert } from 'lucide-react';
import WorkspaceSwitcher from '@/components/WorkspaceSwitcher';

interface VendorWorkspace {
  id: string;
  vendorName: string;
  category: string;
  riskScore: number;
  riskTier: 'Tier 1 Critical' | 'Tier 2 High' | 'Tier 3 Operational';
  color: string;
  status: 'Audited' | 'Review Required' | 'Conditional';
  diligencePercent: number;
  checksCompleted: number;
  totalChecks: number;
}

const SAMPLE_VENDORS: VendorWorkspace[] = [
  {
    id: 'vw-001',
    vendorName: 'CloudGate Infrastructure',
    category: 'Multi-Cloud Hosting & DB',
    riskScore: 32,
    riskTier: 'Tier 1 Critical',
    color: '#0284c7',
    status: 'Audited',
    diligencePercent: 92,
    checksCompleted: 14,
    totalChecks: 15,
  },
  {
    id: 'vw-002',
    vendorName: 'PayNex Gateway Pvt Ltd',
    category: 'Payment Aggregator & Payouts',
    riskScore: 24,
    riskTier: 'Tier 1 Critical',
    color: '#059669',
    status: 'Audited',
    diligencePercent: 88,
    checksCompleted: 15,
    totalChecks: 16,
  },
  {
    id: 'vw-003',
    vendorName: 'Apex Logistics & COD Fleet',
    category: 'Delivery & Last-Mile COD',
    riskScore: 58,
    riskTier: 'Tier 3 Operational',
    color: '#d97706',
    status: 'Conditional',
    diligencePercent: 74,
    checksCompleted: 11,
    totalChecks: 14,
  },
  {
    id: 'vw-004',
    vendorName: 'MedVault Health AI SaaS',
    category: 'Patient Data & AI Diagnostic',
    riskScore: 78,
    riskTier: 'Tier 2 High',
    color: '#dc2626',
    status: 'Review Required',
    diligencePercent: 55,
    checksCompleted: 7,
    totalChecks: 13,
  },
];

export default function RecentWorkspaces() {
  const [switcherOpen, setSwitcherOpen] = useState(false);

  return (
    <>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Building2 size={16} className="text-[#0284c7]" />
            <span className="text-sm font-bold text-[#0c2340] tracking-tight">Active Vendor Due Diligence Workspaces</span>
          </div>
          <button
            onClick={() => setSwitcherOpen(true)}
            className="text-xs font-semibold text-[#0284c7] hover:text-[#0c2340] transition-colors flex items-center gap-1"
          >
            All Vendors <ArrowRight size={11} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {SAMPLE_VENDORS.map((ws, i) => (
            <motion.div
              key={ws.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30, delay: i * 0.06 }}
              whileHover={{ y: -3, scale: 1.01 }}
            >
              <Link href="/curriculum-view">
                <div
                  className="clay-card p-4 cursor-pointer h-full transition-all duration-200"
                  style={{
                    background: 'rgba(255, 255, 255, 0.85)',
                  }}
                >
                  {/* Top Bar with Tier Badge */}
                  <div className="flex items-start justify-between gap-2 mb-2.5">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm"
                      style={{ background: `${ws.color}18`, color: ws.color, border: `1px solid ${ws.color}25` }}
                    >
                      {ws.vendorName[0]}
                    </div>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-[#475569] border border-slate-200">
                      {ws.riskTier}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-[#0c2340] line-clamp-1 leading-tight mb-0.5">
                    {ws.vendorName}
                  </p>
                  <p className="text-[11px] text-[#64748b] truncate mb-3">
                    {ws.category}
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5">
                      {ws.riskScore < 40 ? (
                        <ShieldCheck size={12} className="text-emerald-600" />
                      ) : (
                        <ShieldAlert size={12} className="text-red-600" />
                      )}
                      <span className="text-[11px] font-bold" style={{ color: ws.color }}>
                        Risk Score: {ws.riskScore}/100
                      </span>
                    </div>
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      ws.status === 'Audited' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      ws.status === 'Conditional' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      {ws.status}
                    </span>
                  </div>

                  {/* Diligence Completion Bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-[#64748b]">Diligence Progress</span>
                      <span className="text-[10px] font-mono font-bold" style={{ color: ws.color }}>
                        {ws.diligencePercent}%
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden border border-slate-200/60">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: ws.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${ws.diligencePercent}%` }}
                        transition={{ duration: 0.8, delay: 0.3 + i * 0.1, ease: 'easeOut' }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-black/4">
                    <span className="text-[10px] font-mono text-[#64748b]">{ws.checksCompleted}/{ws.totalChecks} Checks</span>
                    <span className="text-[10px] font-semibold text-[#0284c7]">Open Dossier &rarr;</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
      <WorkspaceSwitcher open={switcherOpen} onClose={() => setSwitcherOpen(false)} />
    </>
  );
}