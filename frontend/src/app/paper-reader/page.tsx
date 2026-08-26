'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import AppShell from '@/components/AppShell';
import LibraryExplorer from './components/LibraryExplorer';
import NotesPanel from '@/components/NotesPanel';
import { MOCK_PAPERS, type Paper } from '@/lib/mock/data';
import { ExternalLink, StickyNote, FileText, Users, Calendar, ShieldCheck, CheckCircle2, BookMarked, Circle } from 'lucide-react';

const READ_STATUS_CONFIG = {
  done: { icon: CheckCircle2, color: '#059669', label: 'Audited' },
  reading: { icon: BookMarked, color: '#0284c7', label: 'In Review' },
  unread: { icon: Circle, color: '#64748b', label: 'Pending' },
};

function PaperDetail({ paper }: { paper: Paper }) {
  const statusCfg = READ_STATUS_CONFIG[paper.readStatus];
  const StatusIcon = statusCfg.icon;

  return (
    <motion.div
      key={paper.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="flex-1 overflow-y-auto scrollbar-thin p-6"
    >
      {/* Paper header */}
      <div
        className="clay-card p-6 mb-5"
        style={{
          background: 'rgba(255, 255, 255, 0.92)',
          borderLeft: `4px solid ${paper.coverColor}`,
        }}
      >
        <div className="flex items-start gap-4 mb-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-extrabold shrink-0 shadow-sm"
            style={{ background: `${paper.coverColor}18`, color: paper.coverColor }}
          >
            <FileText size={22} />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-extrabold text-[#0c2340] leading-tight mb-1.5">{paper.title}</h1>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span
                className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md"
                style={{
                  background: `${paper.coverColor}15`,
                  color: paper.coverColor,
                }}
              >
                {paper.difficulty.toUpperCase()} RISK TIER
              </span>
              <div className="flex items-center gap-1">
                <StatusIcon size={12} style={{ color: statusCfg.color } as React.CSSProperties} />
                <span className="text-[11px] font-mono font-bold" style={{ color: statusCfg.color }}>{statusCfg.label}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Metadata grid */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-black/5">
          {[
            { icon: Users, label: 'Signatories & Custodians', value: paper.authors.join(', ') },
            { icon: Calendar, label: 'Agreement Version', value: `${paper.venue} (${paper.year})` },
            { icon: ShieldCheck, label: 'Audit Reference', value: paper.arxivId || 'DOC-REG-2024' },
            { icon: FileText, label: 'Compliance Impact', value: 'High Priority Counterparty' },
          ].map((meta) => {
            const Icon = meta.icon;
            return (
              <div key={meta.label} className="flex items-start gap-2">
                <Icon size={13} className="text-[#64748b] mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] font-mono text-[#64748b] uppercase">{meta.label}</p>
                  <p className="text-xs font-bold text-[#0c2340] truncate">{meta.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        {paper.arxivId && (
          <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between">
            <span className="text-xs font-mono text-[#64748b]">Cryptographic Doc Hash: 8f4a9b2c...7e1</span>
            <span className="text-xs font-bold text-[#0284c7] flex items-center gap-1">
              Verified by RiskOS Ingestion <ShieldCheck size={12} />
            </span>
          </div>
        )}
      </div>

      {/* Abstract / Scope */}
      <div
        className="clay-card p-5 mb-5"
        style={{
          background: 'rgba(255, 255, 255, 0.88)',
        }}
      >
        <p className="text-[10px] font-mono font-bold text-[#64748b] uppercase tracking-wider mb-2">Executive Clause Summary & Scope</p>
        <p className="text-xs text-[#334155] leading-relaxed font-medium">{paper.abstract}</p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {paper.tags.map((tag) => (
          <span
            key={tag}
            className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-[#0c2340] border border-slate-200"
          >
            #{tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export default function PaperReaderPage() {
  const [selectedPaper, setSelectedPaper] = useState<Paper>(MOCK_PAPERS[0]);
  const [notesOpen, setNotesOpenState] = useState(false);

  useEffect(() => {
    const applyHash = () => {
      if (window.location.hash === '#notes') setNotesOpenState(true);
    };
    applyHash();
    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
  }, []);

  const setNotesOpen = useCallback((next: boolean | ((prev: boolean) => boolean)) => {
    setNotesOpenState((prev) => {
      const resolved = typeof next === 'function' ? next(prev) : next;
      const newHash = resolved ? '#notes' : '';
      if (window.location.hash !== newHash) {
        history.replaceState(null, '', `${window.location.pathname}${newHash}`);
      }
      return resolved;
    });
  }, []);

  return (
    <AppShell topic={selectedPaper.title} agentStatus="idle">
      <div className="flex flex-col lg:flex-row h-full overflow-hidden">
        {/* Left: Library Explorer */}
        <div
          className="w-full lg:w-88 shrink-0 p-4 lg:border-r overflow-hidden flex flex-col max-h-[44vh] lg:max-h-none border-b lg:border-b-0"
          style={{ borderColor: 'rgba(0,0,0,0.06)' }}
        >
          <LibraryExplorer onSelectPaper={setSelectedPaper} />
        </div>

        {/* Right: Paper detail */}
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden relative">
          {/* Toolbar */}
          <div
            className="flex items-center justify-between gap-3 px-6 py-3 border-b shrink-0 bg-white/60 backdrop-blur-md"
            style={{ borderColor: 'rgba(0,0,0,0.06)' }}
          >
            <p className="text-xs font-bold text-[#0c2340] truncate min-w-0">{selectedPaper.title}</p>
            <button
              onClick={() => setNotesOpen((v) => !v)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 shrink-0 ${
                notesOpen
                  ? 'clay-btn-primary'
                  : 'clay-btn-secondary'
              }`}
              aria-label="Toggle audit notes panel"
            >
              <StickyNote size={13} />
              <span>Auditor Notes</span>
            </button>
          </div>

          <PaperDetail paper={selectedPaper} />
        </div>
      </div>

      {/* Notes panel */}
      <NotesPanel
        open={notesOpen}
        onClose={() => setNotesOpen(false)}
        paperId={selectedPaper.id}
      />
    </AppShell>
  );
}