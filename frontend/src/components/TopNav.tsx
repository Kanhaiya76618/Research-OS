'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, FileText, Search, Command, Bell, ChevronDown, FlaskConical, LayoutDashboard, ClipboardCheck, Glasses, Landmark } from 'lucide-react';
import SpotlightSearch from './SpotlightSearch';
import StatusBadge from './StatusBadge';
import Icon from '@/components/ui/AppIcon';


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
  const colors = { green: '#0d9488', amber: '#d97706', red: '#dc2626' };
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
  { href: '/', label: 'Discovery', icon: Home },
  { href: '/curriculum-view', label: 'Diligence', icon: BookOpen },
  { href: '/paper-reader', label: 'Disclosures', icon: FileText },
  { href: '/preflight', label: 'Pre-Flight', icon: ClipboardCheck },
  { href: '/archive', label: 'Fraud Archive', icon: FlaskConical },
  { href: '/reviewer', label: 'Auditor Dojo', icon: Glasses },
  { href: '/grantcraft', label: 'Risk Committee', icon: Landmark },
  { href: '/dashboard', label: 'CRO Executive', icon: LayoutDashboard },
];

export default function TopNav({ topic = 'Enterprise Vendor Risk', agentStatus = 'idle' }: TopNavProps) {
  const pathname = usePathname();
  const [spotlightOpen, setSpotlightOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSpotlightOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <>
      {/* macOS + Claymorphism top bar */}
      <header
        className="h-12 flex items-center justify-between px-4 shrink-0 z-40 relative"
        style={{
          background: 'rgba(255,255,255,0.78)',
          backdropFilter: 'blur(32px) saturate(2)',
          WebkitBackdropFilter: 'blur(32px) saturate(2)',
          borderBottom: '1px solid rgba(12,35,64,0.06)',
          boxShadow: '0 4px 16px rgba(12,35,64,0.04), inset 0 1px 0 rgba(255,255,255,1)',
        }}
      >
        <div className="flex items-center gap-3">
          {/* Logo & App Name */}
          <Link href="/" className="flex items-center gap-2 group">
            <div
              className="w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs text-white"
              style={{
                background: 'linear-gradient(135deg, #0c2340 0%, #0284c7 100%)',
                boxShadow: '2px 2px 6px rgba(2,132,199,0.3), inset 1px 1px 2px rgba(255,255,255,0.5)',
              }}
            >
              R
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-[#0c2340] tracking-tight leading-none">RiskOS</span>
              <span className="text-[9px] font-mono text-[#0284c7] tracking-wider uppercase font-semibold">Razorpay Risk</span>
            </div>
          </Link>

          {/* Nav items */}
          <nav className="hidden lg:flex items-center gap-1 ml-4">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href;
              const ItemIcon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-150 ${
                    active 
                      ? 'text-[#0c2340] font-semibold' 
                      : 'text-[#64748b] hover:text-[#0c2340] hover:bg-black/4'
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="topnav-active-pill"
                      className="absolute inset-0 rounded-xl -z-10"
                      style={{ 
                        background: '#ffffff', 
                        boxShadow: '2px 2px 8px rgba(148,163,184,0.3), -2px -2px 6px rgba(255,255,255,0.9), inset 1px 1px 1px rgba(255,255,255,1)',
                        border: '1px solid rgba(2,132,199,0.2)'
                      }}
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  <ItemIcon size={12} className={active ? 'text-[#0284c7]' : 'text-[#64748b]'} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Center — breadcrumb */}
        <div className="flex-1 min-w-0 hidden xl:flex items-center justify-center gap-1.5 px-3 text-xs text-[#64748b]">
          <span className="font-semibold text-[#0c2340]">Track 2: AI Risk Manager</span>
          <ChevronDown size={10} className="rotate-[-90deg] text-[#94a3b8]" />
          <span className="text-[#0284c7] font-medium truncate max-w-[220px]">{topic}</span>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <HealthDot />
          <StatusBadge status={agentStatus} />

          {/* Search trigger */}
          <button
            onClick={() => setSpotlightOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/5 border border-black/8 text-xs text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-black/8 transition-all duration-150"
            aria-label="Open search (⌘K)"
          >
            <Search size={12} />
            <span className="hidden lg:block">Search</span>
            <span className="kbd-hint flex items-center gap-0.5">
              <Command size={9} />K
            </span>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen((v) => !v)}
              className="relative p-1.5 rounded-md text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-black/5 transition-all duration-150"
              aria-label="Notifications"
            >
              <Bell size={14} />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#4f46e5]" />
            </button>
            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  className="absolute right-0 top-9 w-72 rounded-xl overflow-hidden z-50"
                  style={{
                    background: 'rgba(255,255,255,0.92)',
                    backdropFilter: 'blur(32px)',
                    WebkitBackdropFilter: 'blur(32px)',
                    border: '1px solid rgba(0,0,0,0.08)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
                  }}
                >
                  <div className="px-3 py-2 border-b border-black/6">
                    <p className="text-xs font-semibold text-[#1d1d1f]">Notifications</p>
                  </div>
                  {[
                    { id: 'n1', text: 'Critique ready for "Transformer Survey"', time: '2m ago', dot: '#4f46e5' },
                    { id: 'n2', text: 'New papers added to Diffusion Models', time: '18m ago', dot: '#0d9488' },
                    { id: 'n3', text: 'Knowledge graph rebuilt — 47 nodes', time: '1h ago', dot: '#d97706' },
                  ].map((n) => (
                    <div key={n.id} className="px-3 py-2.5 hover:bg-black/4 cursor-pointer border-b border-black/4 last:border-0 flex items-start gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: n.dot }} />
                      <div>
                        <p className="text-xs text-[#1d1d1f]">{n.text}</p>
                        <p className="text-[10px] font-mono text-[#6e6e73] mt-0.5">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Avatar */}
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] flex items-center justify-center cursor-pointer">
            <span className="text-[9px] font-bold text-white">AK</span>
          </div>
        </div>
      </header>

      <SpotlightSearch open={spotlightOpen} onClose={() => setSpotlightOpen(false)} />
    </>
  );
}
