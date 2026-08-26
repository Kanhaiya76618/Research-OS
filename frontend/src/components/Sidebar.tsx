'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Home,
  BookOpen,
  FileText,
  ClipboardCheck,
  FlaskConical,
  Glasses,
  Landmark,
  LayoutDashboard,
  PanelLeftClose,
  PanelLeftOpen,
  Layers,
  ShieldCheck,
  Search,
  Command,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const WORKSTATION_ITEMS = [
  { href: '/', label: 'Discovery', step: '01', icon: Home, desc: 'Vendor Intake & Frameworks' },
  { href: '/curriculum-view', label: 'Diligence', step: '02', icon: BookOpen, desc: '4-Tier Verification Trail' },
  { href: '/paper-reader', label: 'Disclosures', step: '03', icon: FileText, desc: 'Contracts & Audit Artifacts' },
  { href: '/preflight', label: 'Pre-Flight', step: '04', icon: ClipboardCheck, desc: 'Mitigation & Escrow Planner' },
  { href: '/archive', label: 'Fraud Archive', step: '05', icon: FlaskConical, desc: 'Incident Memory & Defaults' },
  { href: '/reviewer', label: 'Auditor Dojo', step: '06', icon: Glasses, desc: 'AuditorZero Planted Flaws' },
  { href: '/grantcraft', label: 'Risk Committee', step: '07', icon: Landmark, desc: '3-Skeptic Defense Panel' },
  { href: '/dashboard', label: 'CRO Executive', step: '08', icon: LayoutDashboard, desc: 'Dossier Memo & PDF Export' },
];

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`relative flex flex-col h-full z-30 shrink-0 transition-all duration-300 ease-in-out ${
        collapsed ? 'w-16' : 'w-64'
      }`}
      style={{
        background: 'rgba(255, 255, 255, 0.88)',
        backdropFilter: 'blur(32px) saturate(2)',
        WebkitBackdropFilter: 'blur(32px) saturate(2)',
        borderRight: '1px solid rgba(12, 35, 64, 0.08)',
        boxShadow: '4px 0 24px rgba(12, 35, 64, 0.03)',
      }}
    >
      {/* Header / Brand */}
      <div className="flex items-center justify-between h-14 px-3.5 border-b border-black/6 shrink-0">
        {!collapsed ? (
          <>
            <Link href="/" className="flex items-center gap-2.5 min-w-0 overflow-hidden group">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center font-extrabold text-xs text-white shadow-sm shrink-0 transition-transform duration-150 group-hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #0c2340 0%, #0284c7 100%)',
                  boxShadow: '2px 2px 6px rgba(2, 132, 199, 0.3), inset 1px 1px 2px rgba(255, 255, 255, 0.6)',
                }}
              >
                R
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-extrabold text-[#0c2340] tracking-tight leading-none truncate">
                  RiskOS
                </span>
                <span className="text-[9px] font-mono text-[#0284c7] tracking-wider uppercase font-bold truncate">
                  Razorpay Risk
                </span>
              </div>
            </Link>

            <button
              onClick={onToggle}
              className="p-1.5 rounded-lg text-[#64748b] hover:text-[#0c2340] hover:bg-black/4 transition-colors shrink-0"
              title="Collapse Sidebar"
              aria-label="Collapse Sidebar"
            >
              <PanelLeftClose size={16} />
            </button>
          </>
        ) : (
          <button
            onClick={onToggle}
            className="w-9 h-9 mx-auto rounded-xl flex items-center justify-center font-extrabold text-xs text-white shadow-sm transition-transform duration-150 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #0c2340 0%, #0284c7 100%)',
              boxShadow: '2px 2px 6px rgba(2, 132, 199, 0.3), inset 1px 1px 2px rgba(255, 255, 255, 0.6)',
            }}
            title="Expand Sidebar"
            aria-label="Expand Sidebar"
          >
            R
          </button>
        )}
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin py-3 px-2">
        {!collapsed && (
          <div className="flex items-center gap-1.5 px-2.5 mb-2">
            <Layers size={12} className="text-[#0284c7]" />
            <span className="text-[10px] font-mono font-bold text-[#64748b] uppercase tracking-wider">
              Risk Workstations
            </span>
          </div>
        )}

        <nav className="space-y-1">
          {WORKSTATION_ITEMS.map((item) => {
            const active = pathname === item.href;
            const ItemIcon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? `${item.step}. ${item.label} — ${item.desc}` : undefined}
                className={`relative group flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-all duration-150 ${
                  active
                    ? 'text-[#0c2340] font-bold'
                    : 'text-[#64748b] hover:text-[#0c2340] hover:bg-slate-100/60 font-medium'
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="sidebar-active-pill"
                    className="absolute inset-0 rounded-xl -z-10"
                    style={{
                      background: '#ffffff',
                      boxShadow:
                        '2px 2px 8px rgba(148, 163, 184, 0.25), -2px -2px 6px rgba(255, 255, 255, 0.9), inset 1px 1px 1px rgba(255, 255, 255, 1)',
                      border: '1px solid rgba(2, 132, 199, 0.25)',
                    }}
                    transition={{ type: 'spring', stiffness: 450, damping: 34 }}
                  />
                )}

                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    active
                      ? 'bg-[#0284c7] text-white shadow-sm'
                      : 'bg-slate-100/80 text-[#64748b] group-hover:text-[#0284c7] group-hover:bg-sky-50'
                  }`}
                >
                  <ItemIcon size={14} />
                </div>

                {!collapsed && (
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs truncate">{item.label}</span>
                      <span
                        className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${
                          active ? 'bg-sky-100 text-[#0284c7]' : 'text-[#94a3b8]'
                        }`}
                      >
                        {item.step}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#94a3b8] leading-tight truncate">{item.desc}</p>
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Profile */}
      <div className="border-t border-black/6 p-2 shrink-0">
        {!collapsed ? (
          <div className="clay-card p-2.5 flex items-center gap-2.5" style={{ background: 'rgba(255, 255, 255, 0.9)' }}>
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-[10px] shadow-sm shrink-0"
              style={{ background: 'linear-gradient(135deg, #0c2340 0%, #0284c7 100%)' }}
            >
              KM
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <p className="text-xs font-bold text-[#0c2340] truncate">Risk Auditor</p>
                <ShieldCheck size={11} className="text-[#059669]" />
              </div>
              <p className="text-[9px] font-mono text-[#64748b] truncate">Track 2: AI Risk Manager</p>
            </div>
          </div>
        ) : (
          <div
            className="w-8 h-8 mx-auto rounded-xl flex items-center justify-center text-white font-bold text-[10px] shadow-sm cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #0c2340 0%, #0284c7 100%)' }}
            title="Risk Auditor — Track 2"
          >
            KM
          </div>
        )}
      </div>
    </aside>
  );
}