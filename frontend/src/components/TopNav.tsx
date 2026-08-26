'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Search, Command, Bell, PanelLeft, PanelLeftClose } from 'lucide-react';
import SpotlightSearch from './SpotlightSearch';
import StatusBadge from './StatusBadge';

interface TopNavProps {
  topic?: string;
  agentStatus?: 'idle' | 'running' | 'done' | 'error';
}

function HealthDot() {
  const [state, setState] = useState<'green' | 'amber' | 'red' | null>(null);
  const [title, setTitle] = useState('Checking backend health…');

  useEffect(() => {
    fetch('/api/health')
      .then((r) => r.json())
      .then((h) => {
        const keys = `Keys — LLM: ${h.env?.llmKey ? 'present' : 'missing'}, Fallback: ${h.env?.fallbackKey ? 'present' : 'missing'}, Resend: ${h.env?.resendKey ? 'present' : 'missing'}, Semantic Scholar: ${h.env?.s2Key ? 'present' : 'missing'}`;
        setTitle(keys);
        setState(h.ok && h.env?.llmKey ? 'green' : h.ok ? 'amber' : 'red');
      })
      .catch(() => {
        setTitle('Backend unreachable');
        setState('red');
      });
  }, []);

  if (!state) return null;
  const colors = { green: '#059669', amber: '#d97706', red: '#dc2626' };
  return (
    <span
      className="w-2 h-2 rounded-full shrink-0"
      style={{ background: colors[state] }}
      title={title}
      role="status"
      aria-label={title}
    />
  );
}

export default function TopNav({
  topic = 'Enterprise Vendor Risk',
  agentStatus = 'idle',
}: TopNavProps) {
  const [spotlightOpen, setSpotlightOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSpotlightOpen(true);
      }
      if (e.key === 'Escape') {
        setNotifOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <>
      {/* Clean Glassmorphic & Claymorphic Top Bar */}
      <header
        className="h-12 flex items-center justify-between px-4 shrink-0 z-20 relative"
        style={{
          background: 'rgba(255, 255, 255, 0.82)',
          backdropFilter: 'blur(32px) saturate(2)',
          WebkitBackdropFilter: 'blur(32px) saturate(2)',
          borderBottom: '1px solid rgba(12, 35, 64, 0.08)',
          boxShadow: '0 4px 16px rgba(12, 35, 64, 0.03), inset 0 1px 0 rgba(255, 255, 255, 1)',
        }}
      >
        {/* Left — Clean System Status Pill */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-bold text-[#0284c7] bg-sky-50 px-2.5 py-1 rounded-xl border border-sky-200 shadow-sm flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0284c7] animate-pulse" />
            RiskOS Live
          </span>
        </div>

        {/* Center — Clean Context Indicator */}
        <div className="flex-1 min-w-0 hidden md:flex items-center justify-center gap-2 px-3 text-xs text-[#64748b]">
          <span className="font-bold text-[#0c2340]">Track 2: AI Risk Manager</span>
          <span className="text-slate-300">•</span>
          <span className="text-[#0284c7] font-medium truncate max-w-[320px]">{topic}</span>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          <HealthDot />
          <StatusBadge status={agentStatus} />

          {/* Search Trigger */}
          <button
            onClick={() => setSpotlightOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl clay-card text-xs text-[#64748b] hover:text-[#0c2340] transition-all duration-150"
            aria-label="Open search (⌘K)"
          >
            <Search size={12} className="text-[#0284c7]" />
            <span className="font-medium hidden lg:inline">Search</span>
            <span className="kbd-hint flex items-center gap-0.5 font-mono text-[9px]">
              <Command size={9} />K
            </span>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen((v) => !v)}
              className="relative p-2 rounded-xl text-[#64748b] hover:text-[#0c2340] hover:bg-black/4 transition-all duration-150"
              aria-label="Notifications"
            >
              <Bell size={14} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#dc2626]" />
            </button>
            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  className="absolute right-0 top-10 w-72 rounded-2xl overflow-hidden z-50 clay-card"
                  style={{
                    background: 'rgba(255,255,255,0.96)',
                    backdropFilter: 'blur(32px)',
                    WebkitBackdropFilter: 'blur(32px)',
                    border: '1px solid rgba(0,0,0,0.08)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
                  }}
                >
                  <div className="px-3 py-2.5 border-b border-black/6">
                    <p className="text-xs font-bold text-[#0c2340]">Risk Alerts & Audit Updates</p>
                  </div>
                  {[
                    { id: 'n1', text: 'Critical red flag in CloudGate Section 14 (1-Mo Cap)', time: '2m ago', dot: '#dc2626' },
                    { id: 'n2', text: 'PayNex DPA verified: 72h CERT-In clause confirmed', time: '18m ago', dot: '#059669' },
                    { id: 'n3', text: 'Historical echo match: SwiftDeliver default signature', time: '1h ago', dot: '#d97706' },
                  ].map((n) => (
                    <div key={n.id} className="px-3 py-2.5 hover:bg-black/4 cursor-pointer border-b border-black/4 last:border-0 flex items-start gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: n.dot }} />
                      <div>
                        <p className="text-xs text-[#0c2340] font-medium leading-snug">{n.text}</p>
                        <p className="text-[10px] font-mono text-[#64748b] mt-0.5">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Badge */}
          <div
            className="w-7 h-7 rounded-xl flex items-center justify-center cursor-pointer text-white font-bold text-[10px] shadow-sm"
            style={{ background: 'linear-gradient(135deg, #0c2340 0%, #0284c7 100%)' }}
            title="Risk Auditor"
          >
            KM
          </div>
        </div>
      </header>

      <SpotlightSearch open={spotlightOpen} onClose={() => setSpotlightOpen(false)} />
    </>
  );
}
