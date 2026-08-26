'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, AlertOctagon, AlertTriangle, FileWarning } from 'lucide-react';

export default function CoverageMeter() {
  const diligencePercent = 88;
  const criticalRedFlags = 2;
  const complianceGaps = 3;
  const totalChecks = 15;
  const circumference = 2 * Math.PI * 36;
  const strokeDashoffset = circumference - (diligencePercent / 100) * circumference;

  const healthColor = diligencePercent >= 80 ? '#0d9488' : diligencePercent >= 60 ? '#d97706' : '#dc2626';

  return (
    <div
      className="clay-card p-4"
      style={{
        background: 'rgba(255, 255, 255, 0.88)',
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <ShieldCheck size={14} className="text-[#0284c7]" />
        <span className="text-xs font-bold text-[#0c2340]">Diligence & Risk Score</span>
      </div>

      {/* Ring with tactile clay highlight */}
      <div className="flex items-center gap-4 mb-3">
        <div className="relative shrink-0">
          <svg width="88" height="88" viewBox="0 0 88 88" className="coverage-ring">
            <circle cx="44" cy="44" r="36" fill="none" stroke="rgba(148,163,184,0.15)" strokeWidth="6" />
            <motion.circle
              cx="44"
              cy="44"
              r="36"
              fill="none"
              stroke={healthColor}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
              transform="rotate(-90 44 44)"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-bold" style={{ color: healthColor }}>{diligencePercent}%</span>
            <span className="text-[8px] font-mono text-[#64748b] uppercase">Verified</span>
          </div>
        </div>

        <div className="flex-1 space-y-2">
          {[
            { label: 'Total Checks', value: `${totalChecks} items`, color: '#0284c7', icon: ShieldCheck },
            { label: 'Red Flags', value: `${criticalRedFlags} clauses`, color: '#dc2626', icon: AlertOctagon },
            { label: 'Pending Docs', value: `${complianceGaps} files`, color: '#d97706', icon: FileWarning },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center gap-2">
                <Icon size={11} style={{ color: item.color }} />
                <span className="text-[10px] text-[#64748b] font-medium flex-1">{item.label}</span>
                <span className="text-[11px] font-bold font-mono" style={{ color: item.color }}>{item.value}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Diligence bar */}
      <div className="space-y-1 pt-2 border-t border-black/5">
        <div className="flex justify-between">
          <span className="text-[10px] font-mono text-[#64748b]">Onboarding Risk Tier</span>
          <span className="text-[10px] font-mono font-bold text-emerald-600">
            Low Counterparty Risk
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden border border-slate-200/50">
          <motion.div
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, #0284c7, ${healthColor})` }}
            initial={{ width: 0 }}
            animate={{ width: `${diligencePercent}%` }}
            transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>
    </div>
  );
}
