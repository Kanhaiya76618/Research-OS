'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

import AppShell from '@/components/AppShell';
import CurriculumBoard from './components/CurriculumBoard';
import CoverageMeter from './components/CoverageMeter';
import CriticPanel from './components/CriticPanel';
import KnowledgeGraphView from './components/KnowledgeGraphView';
import { Layers, GitBranch, ShieldCheck } from 'lucide-react';

type ViewMode = 'curriculum' | 'graph';

export default function CurriculumViewPage() {
  const [viewMode, setViewModeState] = useState<ViewMode>('curriculum');

  useEffect(() => {
    const applyHash = () => {
      const hash = window.location.hash;
      setViewModeState(hash === '#graph' ? 'graph' : 'curriculum');
      if (hash === '#critique') {
        requestAnimationFrame(() => {
          document.getElementById('critic-panel')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
      }
    };
    applyHash();
    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
  }, []);

  const setViewMode = useCallback((mode: ViewMode) => {
    setViewModeState(mode);
    const newHash = mode === 'graph' ? '#graph' : '';
    if (window.location.hash !== newHash) {
      history.replaceState(null, '', `${window.location.pathname}${newHash}`);
    }
  }, []);

  return (
    <AppShell topic="CloudGate Infrastructure Due Diligence" agentStatus="done">
      <div className="flex flex-col h-full">
        {/* View switcher with claymorphism pill tabs */}
        <div
          className="flex items-center justify-between px-6 py-2.5 border-b"
          style={{ borderColor: 'rgba(12,35,64,0.06)', background: 'rgba(255,255,255,0.75)' }}
        >
          <div className="flex items-center gap-1.5">
            {[
              { id: 'curriculum' as ViewMode, label: '4-Tier Diligence Trail', icon: Layers },
              { id: 'graph' as ViewMode, label: 'Entity & Supply Graph', icon: GitBranch },
            ].map((tab) => {
              const TabIcon = tab.icon;
              const active = viewMode === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setViewMode(tab.id)}
                  aria-pressed={active}
                  className={`relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-150 ${
                    active ? 'text-[#0c2340]' : 'text-[#64748b] hover:text-[#0c2340] hover:bg-black/4'
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="curriculum-tab-pill"
                      className="absolute inset-0 rounded-xl -z-10"
                      style={{
                        background: '#ffffff',
                        boxShadow: '2px 2px 8px rgba(148,163,184,0.3), -2px -2px 6px rgba(255,255,255,0.9), inset 1px 1px 1px rgba(255,255,255,1)',
                        border: '1px solid rgba(2,132,199,0.25)',
                      }}
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  <TabIcon size={13} className={active ? 'text-[#0284c7]' : 'text-[#64748b]'} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <span className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <ShieldCheck size={11} /> 14/15 Verifications Complete
            </span>
          </div>
        </div>

        {/* Main layout */}
        <div className="flex flex-1 overflow-hidden">
          {viewMode === 'curriculum' ? (
            <>
              {/* Left: Diligence Trail Board */}
              <div className="flex-1 overflow-hidden">
                <CurriculumBoard />
              </div>

              {/* Right sidebar */}
              <div
                className="w-80 shrink-0 overflow-y-auto scrollbar-thin p-4 space-y-4 border-l"
                style={{ borderColor: 'rgba(12,35,64,0.06)', background: 'rgba(255,255,255,0.45)' }}
              >
                <CoverageMeter />
                <div id="critic-panel">
                  <CriticPanel />
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 overflow-hidden">
              <KnowledgeGraphView />
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}