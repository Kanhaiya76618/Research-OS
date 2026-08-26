'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, FileText, Search, Command, Bell, ChevronDown, FlaskConical, LayoutDashboard, ClipboardCheck, Glasses, Landmark, Check, Layers } from 'lucide-react';
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

const NAV_ITEMS = [
  { href: '/', label: 'Discovery', step: '01', icon: Home, desc: 'Vendor Intake & Frameworks' },
  { href: '/curriculum-view', label: 'Diligence', step: '02', icon: BookOpen, desc: '4-Tier Verification Trail' },
  { href: '/paper-reader', label: 'Disclosures', step: '03', icon: FileText, desc: 'Contracts & Audit Artifacts' },
  { href: '/preflight', label: 'Pre-Flight', step: '04', icon: ClipboardCheck, desc: 'Mitigation & Escrow Planner' },
  { href: '/archive', label: 'Fraud Archive', step: '05', icon: FlaskConical, desc: 'Incident Memory & Defaults' },
  { href: '/reviewer', label: 'Auditor Dojo', step: '06', icon: Glasses, desc: 'AuditorZero Planted Flaws' },
  { href: '/grantcraft', label: 'Risk Committee', step: '07', icon: Landmark, desc: '3-Skeptic Defense Panel' },
  { href: '/dashboard', label: 'CRO Executive', step: '08', icon: LayoutDashboard, desc: 'Dossier Memo & PDF Export' },
];

export default function TopNav({ topic = 'Enterprise Vendor Risk', agentStatus = 'idle' }: TopNavProps) {
  const pathname = usePathname();
  const [spotlightOpen, setSpotlightOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [toggleMenuOpen, setToggleMenuOpen] = useState(false);
  const toggleMenuRef = useRef<HTMLDivElement>(null);

  // Determine current active item
  const currentNav = NAV_ITEMS.find((item) => item.href === pathname) || NAV_ITEMS[0];
  const CurrentIcon = currentNav.icon;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSpotlightOpen(true);
      }
      if (e.key === 'Escape') {
        setToggleMenuOpen(false);
        setNotifOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Outside click handler for toggle menu
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (toggleMenuRef.current && !toggleMenuRef.current.contains(e.target as Node)) {
        setToggleMenuOpen(false);
      }
    };
    if (toggleMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [toggleMenuOpen]);

  return (
    <>
      {/* Clean Glassmorphic & Claymorphic Top Bar */}
      <header
        className="h-12 flex items-center justify-between px-4 shrink-0 z-40 relative"
        style={{
          background: 'rgba(255, 255, 255, 0.82)',
          backdropFilter: 'blur(32px) saturate(2)',
          WebkitBackdropFilter: 'blur(32px) saturate(2)',
          borderBottom: '1px solid rgba(12, 35, 64, 0.08)',
          boxShadow: '0 4px 16px rgba(12, 35, 64, 0.03), inset 0 1px 0 rgba(255, 255, 255, 1)',
        }}
      >
        <div className="flex items-center gap-3">
          {/* Logo & App Branding */}
          <Link href="/" className="flex items-center gap-2 group mr-1">
            <div
              className="w-7 h-7 rounded-xl flex items-center justify-center font-extrabold text-xs text-white shadow-sm transition-transform duration-150 group-hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #0c2340 0%, #0284c7 100%)',
                boxShadow: '2px 2px 6px rgba(2, 132, 199, 0.3), inset 1px 1px 2px rgba(255, 255, 255, 0.6)',
              }}
            >
              R
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-extrabold text-[#0c2340] tracking-tight leading-none">RiskOS</span>
              <span className="text-[9px] font-mono text-[#0284c7] tracking-wider uppercase font-bold">Razorpay</span>
            </div>
          </Link>

          {/* Sleek Workstation Toggle Bar Button */}
          <div className="relative" ref={toggleMenuRef}>
            <button
              onClick={() => setToggleMenuOpen((v) => !v)}
              className="clay-card-interactive flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold text-[#0c2340] border border-black/6 hover:border-[#0284c7]/40 transition-all duration-150"
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
              }}
              aria-expanded={toggleMenuOpen}
              aria-label="Toggle Workstation Menu"
            >
              <div className="w-5 h-5 rounded-lg bg-[#0284c7]/10 flex items-center justify-center text-[#0284c7]">
                <CurrentIcon size={12} />
              </div>
              <span className="font-bold text-[#0c2340]">{currentNav.label}</span>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-[#64748b] hidden sm:inline-block">
                Step {currentNav.step}
              </span>
              <ChevronDown
                size={12}
                className={`text-[#64748b] transition-transform duration-200 ${toggleMenuOpen ? 'rotate-180 text-[#0284c7]' : ''}`}
              />
            </button>

            {/* Toggle Dropdown Menu Popover */}
            <AnimatePresence>
              {toggleMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  className="absolute left-0 top-10 w-80 sm:w-96 rounded-2xl p-3 z-50 clay-card"
                  style={{
                    background: 'rgba(255, 255, 255, 0.96)',
                    backdropFilter: 'blur(36px)',
                    WebkitBackdropFilter: 'blur(36px)',
                    border: '1px solid rgba(2, 132, 199, 0.2)',
                    boxShadow: '0 20px 48px rgba(12, 35, 64, 0.16), 0 4px 12px rgba(0, 0, 0, 0.06)',
                  }}
                >
                  <div className="flex items-center justify-between px-2 py-1.5 mb-2 border-b border-black/5">
                    <div className="flex items-center gap-1.5">
                      <Layers size={13} className="text-[#0284c7]" />
                      <span className="text-[11px] font-bold text-[#0c2340] uppercase tracking-wider">
                        RiskOS Workstations
                      </span>
                    </div>
                    <span className="text-[9px] font-mono text-[#64748b]">8-Step Diligence Flow</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {NAV_ITEMS.map((item) => {
                      const active = pathname === item.href;
                      const ItemIcon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setToggleMenuOpen(false)}
                          className={`flex items-start gap-2.5 p-2.5 rounded-xl transition-all duration-150 ${
                            active
                              ? 'bg-sky-50 border border-sky-200 text-[#0c2340]'
                              : 'hover:bg-slate-50 text-[#334155] border border-transparent'
                          }`}
                        >
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                              active
                                ? 'bg-[#0284c7] text-white shadow-sm'
                                : 'bg-slate-100 text-[#64748b]'
                            }`}
                          >
                            <ItemIcon size={14} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold truncate">{item.label}</span>
                              {active && <Check size={12} className="text-[#0284c7] shrink-0" />}
                            </div>
                            <p className="text-[10px] text-[#64748b] leading-tight truncate">{item.desc}</p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-black/5 flex items-center justify-between px-2 text-[10px] font-mono text-[#64748b]">
                    <span>Pro tip: Press ⌘K to jump anywhere</span>
                    <kbd className="px-1.5 py-0.5 rounded bg-slate-100 text-[#0c2340] border border-slate-200 font-bold">Esc</kbd>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Center — Clean Context Indicator */}
        <div className="flex-1 min-w-0 hidden md:flex items-center justify-center gap-2 px-3 text-xs text-[#64748b]">
          <span className="font-bold text-[#0c2340]">Track 2: AI Risk Manager</span>
          <span className="text-slate-300">•</span>
          <span className="text-[#0284c7] font-medium truncate max-w-[280px]">{topic}</span>
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
