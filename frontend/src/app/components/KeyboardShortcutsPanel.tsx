'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Command } from 'lucide-react';

const SHORTCUTS = [
  { keys: ['⌘', 'K'], label: 'Spotlight Search' },
  { keys: ['G', 'D'], label: 'Intake Discovery' },
  { keys: ['G', 'T'], label: 'Diligence Trail' },
  { keys: ['G', 'C'], label: 'Contract Disclosures' },
  { keys: ['G', 'P'], label: 'Pre-Flight Planner' },
  { keys: ['G', 'A'], label: 'Fraud Archive' },
  { keys: ['G', 'J'], label: 'Auditor Dojo' },
  { keys: ['G', 'R'], label: 'Risk Committee' },
  { keys: ['G', 'X'], label: 'CRO Executive Hub' },
];

export default function KeyboardShortcutsPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30, delay: 0.2 }}
      className="clay-card p-4 h-full"
      style={{
        background: 'rgba(255, 255, 255, 0.88)',
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Command size={13} className="text-[#0284c7]" />
        <span className="text-xs font-bold text-[#0c2340]">Keyboard Shortcuts</span>
      </div>
      <div className="space-y-1.5">
        {SHORTCUTS.map((s, i) => (
          <motion.div
            key={`shortcut-${i}`}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 + i * 0.04 }}
            className="flex items-center justify-between py-1 border-b border-black/4 last:border-0"
          >
            <span className="text-[11px] font-medium text-[#64748b]">{s.label}</span>
            <div className="flex items-center gap-1">
              {s.keys.map((k, ki) => (
                <React.Fragment key={ki}>
                  <kbd className="px-1.5 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[10px] font-mono font-bold text-[#0c2340]">
                    {k}
                  </kbd>
                  {ki < s.keys.length - 1 && (
                    <span className="text-[9px] text-[#94a3b8]">+</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
      <div className="mt-3 pt-2.5 border-t border-black/6">
        <p className="text-[10px] text-[#64748b] font-mono">
          Global shortcuts for RiskOS by Razorpay
        </p>
      </div>
    </motion.div>
  );
}