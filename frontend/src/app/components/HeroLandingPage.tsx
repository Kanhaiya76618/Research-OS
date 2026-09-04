'use client';
import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import Link from 'next/link';
import {
  ShieldAlert,
  Network,
  Cpu,
  Layers,
  FileText,
  GitBranch,
  Archive,
  ClipboardCheck,
  Glasses,
  Landmark,
  LayoutDashboard,
  Search,
  PenTool,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Lock,
  Scale,
  Zap,
  Flame,
  Activity,
  Award,
} from 'lucide-react';

/* -------------------------------------------------------------------------- */
/* Animated Counter for Metrics                                               */
/* -------------------------------------------------------------------------- */
function AnimatedCounter({ value, suffix = '', decimals = 0 }: { value: number; suffix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const motionVal = useMotionValue(0);
  const springVal = useSpring(motionVal, { damping: 28, stiffness: 90 });
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    if (inView) {
      motionVal.set(value);
    }
  }, [inView, motionVal, value]);

  useEffect(() => {
    return springVal.on('change', (latest) => {
      setDisplay(latest.toFixed(decimals));
    });
  }, [springVal, decimals]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Section 1: Glassmorphic Navbar Component                                   */
/* -------------------------------------------------------------------------- */
export function GlassNavbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/75 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-[#0c2340] to-[#1e3a8a] flex items-center justify-center shadow-md shadow-[#0c2340]/10 border border-white/20 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-5 h-5 text-sky-400" />
            <span className="absolute -inset-0.5 rounded-xl bg-sky-400/20 blur-[6px] -z-10 group-hover:opacity-100 opacity-60 transition-opacity" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-[#0c2340]">RiskOS</span>
              <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold tracking-wide uppercase bg-sky-100 text-[#0284c7] border border-sky-200">
                by Razorpay
              </span>
            </div>
            <span className="text-[10px] font-medium text-slate-500 tracking-wider">AI RISK MANAGER · TRACK 2</span>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs font-semibold text-slate-600">
          <a
            href="#workstations"
            className="px-3 py-1.5 rounded-lg hover:text-[#0c2340] hover:bg-slate-100/70 transition-colors"
          >
            Workstations
          </a>
          <a
            href="#mockup"
            className="px-3 py-1.5 rounded-lg hover:text-[#0c2340] hover:bg-slate-100/70 transition-colors"
          >
            GraphRAG Intelligence
          </a>
          <a
            href="#metrics"
            className="px-3 py-1.5 rounded-lg hover:text-[#0c2340] hover:bg-slate-100/70 transition-colors"
          >
            Model Benchmarks
          </a>
          <a
            href="#compliance"
            className="px-3 py-1.5 rounded-lg hover:text-[#0c2340] hover:bg-slate-100/70 transition-colors"
          >
            Regulatory Engine
          </a>
          <Link
            href="/dashboard"
            className="px-3 py-1.5 rounded-lg hover:text-[#0c2340] hover:bg-slate-100/70 transition-colors"
          >
            CRO Hub
          </Link>
        </nav>

        {/* Right side status + CTA */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Active Agent & Policy Status Pill */}
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-slate-100/90 border border-slate-200/80 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#059669]" />
            </span>
            <span className="text-[11px] font-mono font-medium text-slate-700 truncate max-w-[210px] xl:max-w-none">
              9 Agents Active · <span className="text-[#0284c7] font-semibold">RiskAuditor-7B (LoRA + GRPO)</span>
            </span>
          </div>

          {/* Primary CTA */}
          <Link
            href="/dashboard"
            className="clay-btn-primary flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs font-bold rounded-xl shadow-md transition-all active:scale-95"
          >
            <Zap size={13} className="text-sky-200 fill-sky-200" />
            <span>Launch Workstation</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

/* -------------------------------------------------------------------------- */
/* Section 3: Floating Interactive Mockup Card Component                      */
/* -------------------------------------------------------------------------- */
export function HeroMockupCard() {
  const [activeTab, setActiveTab] = useState<'clause' | 'graph' | 'escrow'>('clause');

  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="relative w-full max-w-2xl mx-auto"
    >
      {/* Ambient background glow behind mockup */}
      <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-sky-400/20 via-indigo-500/15 to-emerald-400/20 blur-xl opacity-75 pointer-events-none -z-10" />

      {/* Floating animation wrapper */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
        whileHover={{ scale: 1.015 }}
        className="clay-card rounded-2xl p-5 sm:p-6 border border-white/80 shadow-2xl transition-shadow"
        style={{
          background: 'rgba(255, 255, 255, 0.94)',
          boxShadow: '8px 12px 28px rgba(12,35,64,0.08), -6px -6px 20px rgba(255,255,255,0.95)',
        }}
      >
        {/* Mockup Header */}
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-3 mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-center">
              <ShieldAlert size={16} className="text-[#0284c7]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-[#0c2340] tracking-tight">CloudGate Infrastructure Ltd.</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-slate-100 text-slate-600 border border-slate-200">
                  MSA & DPA AUDIT
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-mono">CIN: U72200KA2019PTC128491 · Verified MCA-21</p>
            </div>
          </div>

          {/* Risk Score Pill */}
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black font-mono bg-rose-50 text-rose-700 border border-rose-200 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              Risk Score: 74/100 · HIGH RISK
            </span>
          </div>
        </div>

        {/* Mockup Tab Selector */}
        <div className="flex items-center gap-1.5 mb-3 p-1 rounded-xl bg-slate-100/90 border border-slate-200/60 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('clause')}
            className={`flex-1 py-1 px-2.5 rounded-lg transition-all ${
              activeTab === 'clause'
                ? 'bg-white text-[#0c2340] shadow-sm font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Red-Flag Clause
          </button>
          <button
            onClick={() => setActiveTab('graph')}
            className={`flex-1 py-1 px-2.5 rounded-lg transition-all ${
              activeTab === 'graph'
                ? 'bg-white text-[#0c2340] shadow-sm font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            GraphRAG Supply Chain
          </button>
          <button
            onClick={() => setActiveTab('escrow')}
            className={`flex-1 py-1 px-2.5 rounded-lg transition-all ${
              activeTab === 'escrow'
                ? 'bg-white text-[#0c2340] shadow-sm font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            RazorpayX Escrow Action
          </button>
        </div>

        {/* Tab 1: Red-Flag Clause with 100% Verbatim Grounding */}
        {activeTab === 'clause' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-200/80">
              <div className="flex items-center justify-between mb-1.5">
                <span className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-rose-800 font-mono">
                  <AlertTriangle size={13} className="text-rose-600 shrink-0" />
                  LIABILITY EVASION [CRITICAL]
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                  <CheckCircle2 size={11} className="text-emerald-600" />
                  100% Verbatim Match in Source Text
                </span>
              </div>
              <p className="text-xs font-mono text-slate-800 bg-white/80 p-2.5 rounded-lg border border-slate-200/60 leading-relaxed">
                &ldquo;IN NO EVENT SHALL VENDOR AGGREGATE LIABILITY ARISING OUT OF THIS AGREEMENT EXCEED TOTAL AMOUNTS PAID BY RAZORPAY IN THE ONE (1) MONTH IMMEDIATELY PRECEDING THE CLAIM. VENDOR DISCLAIMS ALL DATA BREACH INDEMNIFICATION.&rdquo;
              </p>
              <div className="mt-2 text-[11px] text-slate-600 leading-snug">
                <strong className="text-rose-900">Statutory Violation:</strong> Caps liability below statutory exposure in violation of RBI PA/PG Direction Sec 12 & DPDP Act 2023 Sec 8.
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200/70 text-[11px] text-slate-700">
              <span className="font-bold text-emerald-900 flex items-center gap-1 mb-1">
                <Sparkles size={12} className="text-emerald-700" />
                RiskAuditor-7B Enforceable Remediation Rider:
              </span>
              <p className="font-mono text-[11px] text-slate-800">
                &ldquo;Vendor shall provide uncapped indemnification for data security compromises and gross negligence; liability for core platform failure shall not be capped below 12 months fees.&rdquo;
              </p>
            </div>
          </motion.div>
        )}

        {/* Tab 2: GraphRAG Supply Chain Trail */}
        {activeTab === 'graph' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <span className="text-[11px] font-bold text-[#0c2340] uppercase tracking-wider block font-mono">
                Multi-Hop Supply Chain Traversal:
              </span>
              <div className="space-y-2 font-mono text-[11px]">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200">
                  <span className="px-2 py-0.5 rounded bg-sky-100 text-[#0284c7] font-bold text-[10px]">Node 1</span>
                  <span className="font-bold text-[#0c2340]">CloudGate Infrastructure Ltd.</span>
                  <span className="text-slate-400 text-[10px] ml-auto">Primary Counterparty</span>
                </div>
                <div className="flex items-center justify-center">
                  <span className="text-[10px] text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    --[USES_SUBPROCESSOR]--➔
                  </span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-50/80 border border-amber-200">
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">Node 2</span>
                  <span className="font-bold text-amber-900">Elastic NV (US-East Cluster)</span>
                  <span className="text-amber-700 text-[10px] ml-auto">4th-Party Data Egress</span>
                </div>
                <div className="flex items-center justify-center">
                  <span className="text-[10px] text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    --[VIOLATES_REGULATION]--➔
                  </span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-rose-50 border border-rose-200">
                  <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold text-[10px]">Node 3</span>
                  <span className="font-bold text-rose-900">RBI IT Outsourcing Mandate (2024)</span>
                  <span className="text-rose-600 text-[10px] ml-auto">Missing 30-Day Prior Consent</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 3: RazorpayX Automated Escrow Action */}
        {activeTab === 'escrow' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-300/80">
              <div className="flex items-center gap-2 mb-2">
                <Lock size={15} className="text-[#d97706]" />
                <span className="text-xs font-black text-amber-950 uppercase tracking-wide">
                  RazorpayX Escrow Reserve Triggered: 20% Rolling Hold Active
                </span>
              </div>
              <p className="text-xs text-amber-900 leading-relaxed font-medium mb-3">
                Automated payout mitigation locked ₹18.5L in RazorpayX nodal reserve account pending audited SOC2 Type II delivery and revised indemnification rider.
              </p>
              <div className="flex items-center gap-2 text-[11px] font-mono">
                <span className="px-2 py-0.5 rounded bg-amber-200/80 text-amber-900 font-bold">Escrow ID: RX-RES-8841</span>
                <span className="px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200">Auto-Release Threshold: 0 Flaws</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Mockup Footer Micro-Meta */}
        <div className="mt-4 pt-3 border-t border-slate-200/70 flex items-center justify-between text-[10px] text-slate-500 font-mono flex-wrap gap-2">
          <span>Swarm Auditor: criticAgent + GraphRAG</span>
          <Link
            href="/curriculum-view"
            className="text-[#0284c7] hover:underline flex items-center gap-1 font-bold"
          >
            Open in Verification Trail Workstation <ChevronRight size={12} />
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/* Section 4: Metrics Ribbon Component                                        */
/* -------------------------------------------------------------------------- */
export function MetricsRibbon() {
  const stats = [
    {
      value: 100.0,
      suffix: '%',
      decimals: 1,
      label: 'Verbatim Clause Grounding',
      subtext: 'Zero legal hallucination via GRPO RLVR',
      color: '#059669',
      bgColor: 'rgba(5,150,105,0.08)',
      icon: Award,
    },
    {
      value: 94.8,
      suffix: '%',
      decimals: 1,
      label: 'Red-Flag Recall F1',
      subtext: 'Across liability, subprocessor & DPDP gaps',
      color: '#0284c7',
      bgColor: 'rgba(2,132,199,0.08)',
      icon: Activity,
    },
    {
      value: 21,
      suffix: ' min',
      decimals: 0,
      label: 'GPU Fine-Tuned Model',
      subtext: 'Tesla T4, loss dropped 2.31 ➔ 0.014',
      color: '#7c3aed',
      bgColor: 'rgba(124,58,237,0.08)',
      icon: Cpu,
    },
    {
      value: 6,
      prefix: '< ',
      suffix: ' Hours',
      decimals: 0,
      label: 'CERT-In SLA Adherence',
      subtext: 'Mandatory breach detection & escalation',
      color: '#d97706',
      bgColor: 'rgba(217,119,6,0.08)',
      icon: Flame,
    },
  ];

  return (
    <section id="metrics" className="w-full py-12 border-y border-slate-200/80 bg-white/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((st, i) => {
            const Icon = st.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -3, scale: 1.02 }}
                className="clay-card p-5 rounded-2xl border border-white/90 shadow-lg flex flex-col justify-between"
                style={{ background: 'rgba(255,255,255,0.92)' }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center border"
                    style={{ background: st.bgColor, borderColor: `${st.color}25` }}
                  >
                    <Icon size={18} style={{ color: st.color }} />
                  </div>
                  <span className="text-[10px] font-mono uppercase font-bold text-slate-400">BENCHMARK</span>
                </div>

                <div>
                  <div className="text-3xl font-black font-mono tracking-tight text-[#0c2340]">
                    {st.prefix && <span className="text-xl font-bold mr-0.5">{st.prefix}</span>}
                    <AnimatedCounter value={st.value} suffix={st.suffix} decimals={st.decimals} />
                  </div>
                  <p className="text-xs font-bold text-[#0c2340] mt-1">{st.label}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{st.subtext}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Section 5: 10 Workstations Grid Component                                 */
/* -------------------------------------------------------------------------- */
export function WorkstationsGrid() {
  const workstations = [
    {
      id: '01',
      title: '4-Tier Verification Trail',
      href: '/curriculum-view',
      description: 'Progressive diligence gates: Corporate MCA-21 ➔ Cyber SOC2 ➔ Financial Escrow ➔ Contractual SLAs.',
      icon: Layers,
      color: '#1e3a8a',
      badge: 'Due Diligence',
    },
    {
      id: '02',
      title: 'Red-Flag Contract Auditor',
      href: '/paper-reader',
      description: 'Verbatim clause extraction for liability evasion, missing BAAs, and CERT-In 6-hour reporting gaps.',
      icon: FileText,
      color: '#dc2626',
      badge: 'Clause Audits',
    },
    {
      id: '03',
      title: 'GraphRAG Entity Traversal',
      href: '/curriculum-view#graph',
      description: 'Multi-hop entity relations linking vendors, 4th-party subprocessors, UBO directors, and jurisdictions.',
      icon: GitBranch,
      color: '#0d9488',
      badge: 'Supply Chain',
    },
    {
      id: '04',
      title: 'Institutional Incident Memory',
      href: '/archive',
      description: 'Persistent post-mortem archive of circular GSTIN invoice scams, chargeback fraud, and shell companies.',
      icon: Archive,
      color: '#d97706',
      badge: 'Incident History',
    },
    {
      id: '05',
      title: 'Pre-Flight Mitigation Planner',
      href: '/preflight',
      description: 'Generates phased onboarding milestones and automated RazorpayX rolling escrow triggers.',
      icon: ClipboardCheck,
      color: '#059669',
      badge: 'Risk Mitigation',
    },
    {
      id: '06',
      title: 'AuditorZero Training Dojo',
      href: '/reviewer',
      description: 'Interactive dojo with planted subtle compliance flaws to train junior analysts with F1 scorecards.',
      icon: Glasses,
      color: '#7c3aed',
      badge: 'Simulation & F1',
    },
    {
      id: '07',
      title: '3-Skeptic Risk Committee',
      href: '/grantcraft',
      description: 'Adversarial cross-examination by Legal/Regulatory, Cyber, and Credit AI skeptics with binding votes.',
      icon: Landmark,
      color: '#0c2340',
      badge: 'Governance',
    },
    {
      id: '08',
      title: 'CRO Executive Hub',
      href: '/dashboard',
      description: 'Consolidated executive risk intelligence with one-click cryptographic PDF Dossier generation.',
      icon: LayoutDashboard,
      color: '#0284c7',
      badge: 'Executive Synthesis',
    },
    {
      id: '09',
      title: 'Spotlight Search (Cmd+K)',
      href: '/#search',
      description: 'Omni-search indexing counterparties, statutory articles, and historical incident echoes in milliseconds.',
      icon: Search,
      color: '#38bdf8',
      badge: 'Global Query',
    },
    {
      id: '10',
      title: 'Auditor Scratchpad',
      href: '/paper-reader',
      description: 'Encrypted local redlining scratchpad for contract negotiation riders and legal counsel notes.',
      icon: PenTool,
      color: '#10b981',
      badge: 'Contract Redlining',
    },
  ];

  return (
    <section id="workstations" className="w-full py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase bg-sky-50 text-[#0284c7] border border-sky-200">
            TEN MISSION-CRITICAL STATIONS
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0c2340] tracking-tight mt-3">
            An Integrated Risk Operating System
          </h2>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            From initial GSTIN intake to final CRO sign-off, each workstation automates a specialized layer of counterparty defense.
          </p>
        </div>

        {/* 10 Workstations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {workstations.map((ws, i) => {
            const Icon = ws.icon;
            return (
              <motion.div
                key={ws.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                whileHover={{ y: -4, scale: 1.025 }}
                className="group flex flex-col justify-between p-4 rounded-2xl border border-white/90 shadow-md hover:shadow-xl transition-all clay-card"
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  boxShadow: '6px 6px 16px rgba(148, 163, 184, 0.15), -6px -6px 16px rgba(255, 255, 255, 0.95)',
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center border transition-transform group-hover:scale-110"
                      style={{ background: `${ws.color}12`, borderColor: `${ws.color}30` }}
                    >
                      <Icon size={18} style={{ color: ws.color }} />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-400">{ws.id}</span>
                  </div>

                  <span className="text-[9px] font-mono uppercase font-bold text-[#0284c7] tracking-wider block mb-1">
                    {ws.badge}
                  </span>
                  <h3 className="text-xs font-black text-[#0c2340] group-hover:text-[#0284c7] transition-colors leading-snug">
                    {ws.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                    {ws.description}
                  </p>
                </div>

                <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href={ws.href}
                    className="text-[11px] font-bold text-[#0c2340] group-hover:text-[#0284c7] flex items-center gap-1 transition-colors"
                  >
                    Open Station <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Section 6: Statutory Compliance Badges Component                           */
/* -------------------------------------------------------------------------- */
export function ComplianceBadges() {
  const standards = [
    {
      title: 'RBI Master Direction 2024',
      subtitle: 'IT Governance & Outsourcing Risk',
      icon: Scale,
      tag: 'Mandatory Audit Rights',
    },
    {
      title: 'DPDP Act 2023',
      subtitle: 'Data Fiduciary & Subprocessor Consent',
      icon: Lock,
      tag: '72h Breach Notice',
    },
    {
      title: 'CERT-In Directions',
      subtitle: 'Sec 70B Mandatory Cybersecurity',
      icon: ShieldAlert,
      tag: '6-Hour Incident SLA',
    },
    {
      title: 'MCA-21 KYB Verification',
      subtitle: 'Active Director DIN & Shell Prevention',
      icon: ShieldCheck,
      tag: 'Automated UBO Tracing',
    },
    {
      title: 'GSTN Rule 86B',
      subtitle: 'Circular Invoicing & ITC Mismatch',
      icon: Zap,
      tag: 'RazorpayX Escrow Trigger',
    },
  ];

  return (
    <section id="compliance" className="w-full py-12 bg-slate-50/80 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <span className="text-[10px] font-mono uppercase font-bold text-slate-500 tracking-wider">
            PRE-INDEXED STATUTORY COMPLIANCE
          </span>
          <p className="text-xs font-bold text-[#0c2340] mt-1">
            Enforcing Sovereign Indian & International Financial Regulatory Directives
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {standards.map((st, i) => {
            const Icon = st.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.08 }}
                whileHover={{ scale: 1.04 }}
                className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all"
              >
                <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-[#0284c7]">
                  <Icon size={14} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-[#0c2340]">{st.title}</span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {st.tag}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500">{st.subtitle}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Section 2: Main Hero Section (Above the Fold)                              */
/* -------------------------------------------------------------------------- */
export default function HeroLandingPage() {
  return (
    <div className="relative w-full overflow-hidden">
      {/* Background Radial Glows & Grid Pattern */}
      <div className="absolute inset-0 pointer-events-none bg-grid-pattern opacity-60 z-0" />
      <div
        className="absolute -top-32 -left-32 w-[550px] h-[550px] rounded-full pointer-events-none -z-10"
        style={{
          background: 'radial-gradient(circle, rgba(2,132,199,0.12) 0%, transparent 70%)',
          filter: 'blur(70px)',
        }}
      />
      <div
        className="absolute top-1/4 -right-32 w-[600px] h-[600px] rounded-full pointer-events-none -z-10"
        style={{
          background: 'radial-gradient(circle, rgba(99,102,241,0.09) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      <div
        className="absolute bottom-1/4 left-1/3 w-[500px] h-[500px] rounded-full pointer-events-none -z-10"
        style={{
          background: 'radial-gradient(circle, rgba(5,150,105,0.08) 0%, transparent 70%)',
          filter: 'blur(75px)',
        }}
      />

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-16">
        {/* Hero Copy (Stagger Animated) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-4xl mx-auto flex flex-col items-center"
        >
          {/* Eyebrow Pill */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold tracking-wide uppercase bg-sky-50 text-[#0284c7] border border-sky-200/80 shadow-sm mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-[#0284c7] animate-pulse" />
            ✦ RAZORPAY TRACK 2: AI RISK MANAGER · VERIFIABLE GROUNDING ENGINE
          </motion.div>

          {/* H1 Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#0c2340] tracking-tight leading-[1.12]"
          >
            Autonomous Risk Swarm for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0284c7] via-[#1e3a8a] to-[#7c3aed]">
              FinTech Due Diligence
            </span>{' '}
            & Contract Auditing.
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-base sm:text-lg text-slate-600 font-medium max-w-3xl mt-5 leading-relaxed"
          >
            Instantly audit vendor agreements, trace 4th-party subprocessor leaks across{' '}
            <strong className="text-[#0c2340] font-semibold">RBI Master Direction 2024</strong> and{' '}
            <strong className="text-[#0c2340] font-semibold">DPDP Act 2023</strong> frameworks, and automate{' '}
            <strong className="text-[#0c2340] font-semibold">RazorpayX escrow reserve holds</strong> before signing high-liability contracts.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center justify-center gap-3 sm:gap-4 mt-8 flex-wrap"
          >
            <Link
              href="/paper-reader"
              className="clay-btn-primary flex items-center gap-2 px-6 py-3.5 text-sm font-extrabold rounded-2xl shadow-xl transition-transform active:scale-95"
            >
              <ShieldAlert size={16} className="text-sky-200" />
              <span>Audit a Counterparty Contract</span>
              <ArrowRight size={14} className="ml-1" />
            </Link>

            <Link
              href="/curriculum-view#graph"
              className="clay-btn-secondary flex items-center gap-2 px-6 py-3.5 text-sm font-extrabold rounded-2xl border border-slate-200/90 shadow-md hover:bg-slate-50 transition-transform active:scale-95 text-[#0c2340]"
            >
              <Network size={16} className="text-[#0284c7]" />
              <span>Explore GraphRAG Supply Chain</span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Section 3: Interactive Floating Mockup Card */}
        <div id="mockup" className="mt-14 sm:mt-16">
          <HeroMockupCard />
        </div>
      </div>

      {/* Section 4: Metrics Ribbon */}
      <MetricsRibbon />

      {/* Section 5: 10 Workstations Grid */}
      <WorkstationsGrid />

      {/* Section 6: Statutory Compliance Badges */}
      <ComplianceBadges />
    </div>
  );
}
