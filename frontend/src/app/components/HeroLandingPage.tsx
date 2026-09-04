'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
  ChevronRight,
  ShieldCheck,
  Lock,
  Scale,
  Zap,
  Flame,
  Activity,
  Award,
  BookOpen,
  UploadCloud,
} from 'lucide-react';

/* -------------------------------------------------------------------------- */
/* Section 1: Glassmorphic Top Navbar                                         */
/* -------------------------------------------------------------------------- */
export function GlassNavbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-3.5 flex items-center justify-between gap-4">
        {/* Brand Logo matching Image 2 */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0c2340] via-[#0284c7] to-[#0d9488] p-[1.5px] shadow-sm group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-[#0284c7]" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg tracking-tight text-[#0c2340] leading-none">
              RiskOS
            </span>
            <span className="text-[9px] font-extrabold tracking-widest text-[#0284c7] uppercase mt-0.5">
              BY RAZORPAY
            </span>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-xs font-semibold text-slate-600">
          <a href="#workstations" className="hover:text-[#0c2340] transition-colors">
            Workstations
          </a>
          <a href="#graphrag" className="hover:text-[#0c2340] transition-colors">
            GraphRAG
          </a>
          <a href="#benchmarks" className="hover:text-[#0c2340] transition-colors">
            Benchmarks
          </a>
          <a href="#compliance" className="hover:text-[#0c2340] transition-colors">
            Compliance
          </a>
          <a href="#architecture" className="hover:text-[#0c2340] transition-colors">
            Architecture
          </a>
        </nav>

        {/* Right side status + CTA */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Active status pill */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100/90 border border-slate-200/80 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-mono font-medium text-slate-700">
              9 Agents Active · <span className="font-semibold text-[#0c2340]">RiskAuditor-7B</span>
            </span>
          </div>

          {/* Primary CTA */}
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-[#1e3a8a] hover:bg-[#0c2340] rounded-xl shadow-md transition-all active:scale-95"
          >
            <span>Launch Workstation</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

/* -------------------------------------------------------------------------- */
/* Main 2-Column Hero Component (Matching Image 2 Pixel-by-Pixel)             */
/* -------------------------------------------------------------------------- */
export default function HeroLandingPage() {
  return (
    <div className="relative w-full bg-gradient-to-b from-[#f8fafc] via-[#f1f5f9] to-[#ffffff] overflow-hidden">
      {/* Background Ambient Glows */}
      <div
        className="absolute top-0 right-1/4 w-[650px] h-[550px] rounded-full pointer-events-none -z-10"
        style={{
          background: 'radial-gradient(circle, rgba(2, 132, 199, 0.08) 0%, transparent 70%)',
          filter: 'blur(70px)',
        }}
      />
      <div
        className="absolute top-1/3 left-0 w-[550px] h-[500px] rounded-full pointer-events-none -z-10"
        style={{
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.06) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      {/* Main 2-Column Hero Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-16 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* ----------------- LEFT COLUMN: COPY & CTAS ----------------- */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 flex flex-col items-start text-left"
          >
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase bg-white/90 text-slate-700 border border-slate-200/90 shadow-xs mb-6">
              <span className="text-[#0284c7]">✦</span>
              <span>RAZORPAY TRACK 2: AI RISK MANAGER · VERIFIABLE GROUNDING ENGINE</span>
            </div>

            {/* H1 Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black text-[#0c2340] tracking-tight leading-[1.08]">
              Autonomous Risk Swarm for{' '}
              <span className="text-[#0284c7]">FinTech Due Diligence</span> &{' '}
              <span className="text-[#0c2340]">Contract Auditing.</span>
            </h1>

            {/* Subheading */}
            <p className="text-sm sm:text-base text-slate-600 font-medium mt-6 leading-relaxed max-w-xl">
              Instantly audit vendor agreements, trace 4th-party subprocessor leaks across{' '}
              <strong className="text-[#0c2340] font-semibold">RBI Master Direction 2024</strong> and{' '}
              <strong className="text-[#0c2340] font-semibold">DPDP Act 2023</strong> frameworks, and automate{' '}
              <strong className="text-[#0c2340] font-semibold">RazorpayX escrow reserve holds</strong> before signing high-liability contracts.
            </p>

            {/* Dual CTAs (Row) */}
            <div className="flex items-center gap-3.5 mt-8 flex-wrap">
              <Link
                href="/paper-reader"
                className="flex items-center gap-2 px-6 py-3.5 text-xs sm:text-sm font-extrabold text-white bg-[#0c2340] hover:bg-[#1e3a8a] rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95"
              >
                <ShieldAlert size={16} className="text-sky-300" />
                <span>Audit a Counterparty Contract</span>
              </Link>

              <Link
                href="/curriculum-view#graph"
                className="flex items-center gap-2 px-6 py-3.5 text-xs sm:text-sm font-extrabold text-[#0c2340] bg-white hover:bg-slate-50 rounded-xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all active:scale-95"
              >
                <Network size={16} className="text-[#0284c7]" />
                <span>Explore GraphRAG Supply Chain</span>
              </Link>
            </div>

            {/* 3 Pill Badges Below Buttons (Matching Image 2) */}
            <div className="flex items-center gap-2.5 mt-8 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <span>✓</span> 100% Verbatim Grounding
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-800 border border-sky-200">
                <span>✓</span> 9-Agent Autonomous Swarm
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                <span>✓</span> RBI + DPDP 2023 Compliant
              </span>
            </div>
          </motion.div>

          {/* ----------------- RIGHT COLUMN: CARD (IMAGE 2 EXACT CLONE) ----------------- */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-6 w-full"
          >
            {/* The White Card Container */}
            <div
              className="w-full rounded-2xl bg-white p-5 sm:p-6 border border-slate-200/90 shadow-xl transition-shadow"
              style={{
                boxShadow: '0 20px 40px -15px rgba(12, 35, 64, 0.08), 0 0 0 1px rgba(226, 232, 240, 0.8)',
              }}
            >
              {/* Card Header Row 1: VENDOR AUDIT DOSSIER | 74/100 · HIGH RISK */}
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <div className="flex items-center gap-2 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <BookOpen size={14} className="text-[#0284c7]" />
                  <span>VENDOR AUDIT DOSSIER</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold font-mono bg-amber-50 text-amber-800 border border-amber-200">
                  74/100 · HIGH RISK
                </span>
              </div>

              {/* Card Header Row 2: CloudGate Infrastructure Ltd. | Live Analysis */}
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <h3 className="text-lg font-black text-[#0c2340] tracking-tight">
                  CloudGate Infrastructure Ltd.
                </h3>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Live Analysis</span>
                </div>
              </div>

              {/* Risk Gradient Meter Bar (Green to Red at 74%) */}
              <div className="w-full mb-5">
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden relative">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-600"
                    style={{ width: '74%' }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-slate-400 font-bold mt-1">
                  <span>LOW</span>
                  <span>HIGH</span>
                </div>
              </div>

              {/* Red-Flag Block: LIABILITY EVASION · CRITICAL (Soft amber/yellow background) */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-amber-50/50 border border-amber-200/90 mb-3.5">
                <div className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase font-mono text-amber-900 mb-2">
                  <AlertTriangle size={13} className="text-amber-600" />
                  <span>LIABILITY EVASION · CRITICAL</span>
                </div>

                {/* Quoted clause with amber left vertical line */}
                <div className="border-l-2 border-amber-400 pl-3 py-0.5 mb-2.5">
                  <p className="text-xs font-mono italic text-slate-800 leading-relaxed">
                    &ldquo;IN NO EVENT SHALL VENDOR AGGREGATE LIABILITY EXCEED TOTAL AMOUNTS PAID IN THE 1 MONTH PRECEDING THE CLAIM.&rdquo;
                  </p>
                </div>

                {/* Emerald 100% Verbatim Grounding Pill */}
                <div className="mb-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold font-mono bg-emerald-100/90 text-emerald-800 border border-emerald-200">
                    <span>✓</span> 100% Verbatim Match in Source Text
                  </span>
                </div>

                {/* Remediation line */}
                <p className="text-[11px] text-slate-700 leading-snug">
                  <strong className="text-slate-900">Remediation:</strong> Enforce uncapped data breach indemnity & 12-month platform fee minimum.
                </p>
              </div>

              {/* GraphRAG Supply Chain Trail Box */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 mb-3.5 text-xs">
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase font-mono text-slate-600 mb-2">
                  <Network size={13} className="text-[#0284c7]" />
                  <span>GRAPHRAG SUPPLY CHAIN TRAIL</span>
                </div>

                <div className="flex items-center gap-2 flex-wrap font-mono text-[11px] mb-2">
                  <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-[#0c2340] font-semibold">
                    CloudGate Ltd.
                  </span>
                  <span className="text-slate-400 font-bold">➔</span>
                  <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-[#0c2340] font-semibold">
                    Elastic NV (US-East)
                  </span>
                  <span className="text-slate-400 font-bold">➔</span>
                </div>

                <div>
                  <span className="inline-block px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-rose-50 text-rose-800 border border-rose-200">
                    4th-Party Egress · No RBI Consent
                  </span>
                </div>
              </div>

              {/* RazorpayX Escrow Reserve Triggered Box */}
              <div className="p-3 sm:p-3.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                    <Lock size={15} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#0c2340] block">
                      RazorpayX Escrow Reserve Triggered
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      20% Rolling Hold Active
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Auto-Applied
                </span>
              </div>

              {/* Card Footer: 9 Colored Dots | RiskAuditor-7B LoRA */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <div className="flex items-center gap-1.5">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                  </span>
                  <span className="text-[10px] text-slate-400 ml-1">9 agents · 6 complete</span>
                </div>
                <span className="text-[10px] font-bold text-[#0284c7]">RiskAuditor-7B LoRA</span>
              </div>

            </div>
          </motion.div>

        </div>
      </div>

      {/* Section 4: Metrics Ribbon */}
      <MetricsRibbon />

      {/* Section 5: 10 Workstations Grid */}
      <WorkstationsGrid />

      {/* Section 6: Statutory Compliance Badges */}
      <ComplianceBadges />

      {/* Section 7: Bottom CTA Banner (Matching User's Reference Image) */}
      <BottomCtaBanner />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Section 4: Metrics Ribbon Component                                        */
/* -------------------------------------------------------------------------- */
export function MetricsRibbon() {
  const stats = [
    {
      value: '100.0%',
      label: 'Verbatim Clause Grounding',
      subtext: 'Zero legal hallucination via GRPO RLVR',
      color: '#059669',
      icon: Award,
    },
    {
      value: '94.8%',
      label: 'Red-Flag Recall F1',
      subtext: 'Across liability, subprocessor & DPDP gaps',
      color: '#0284c7',
      icon: Activity,
    },
    {
      value: '21 min',
      label: 'GPU Fine-Tuned Model',
      subtext: 'Tesla T4, loss dropped 2.31 ➔ 0.014',
      color: '#7c3aed',
      icon: Cpu,
    },
    {
      value: '< 6 Hours',
      label: 'CERT-In SLA Adherence',
      subtext: 'Mandatory breach detection & escalation',
      color: '#d97706',
      icon: Flame,
    },
  ];

  return (
    <section id="benchmarks" className="w-full py-12 border-y border-slate-200/80 bg-white/70 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((st, i) => {
            const Icon = st.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: `${st.color}15`, color: st.color }}
                  >
                    <Icon size={18} />
                  </div>
                  <span className="text-[10px] font-mono uppercase font-bold text-slate-400">BENCHMARK</span>
                </div>
                <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-[#0c2340]">
                  {st.value}
                </div>
                <p className="text-xs font-bold text-[#0c2340] mt-1">{st.label}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{st.subtext}</p>
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
    },
    {
      id: '02',
      title: 'Red-Flag Contract Auditor',
      href: '/paper-reader',
      description: 'Verbatim clause extraction for liability evasion, missing BAAs, and CERT-In 6-hour reporting gaps.',
      icon: FileText,
      color: '#dc2626',
    },
    {
      id: '03',
      title: 'GraphRAG Entity Traversal',
      href: '/curriculum-view#graph',
      description: 'Multi-hop entity relations linking vendors, 4th-party subprocessors, UBO directors, and jurisdictions.',
      icon: GitBranch,
      color: '#0d9488',
    },
    {
      id: '04',
      title: 'Institutional Incident Memory',
      href: '/archive',
      description: 'Persistent post-mortem archive of circular GSTIN invoice scams, chargeback fraud, and shell companies.',
      icon: Archive,
      color: '#d97706',
    },
    {
      id: '05',
      title: 'Pre-Flight Mitigation Planner',
      href: '/preflight',
      description: 'Generates phased onboarding milestones and automated RazorpayX rolling escrow triggers.',
      icon: ClipboardCheck,
      color: '#059669',
    },
    {
      id: '06',
      title: 'AuditorZero Training Dojo',
      href: '/reviewer',
      description: 'Interactive dojo with planted subtle compliance flaws to train junior analysts with F1 scorecards.',
      icon: Glasses,
      color: '#7c3aed',
    },
    {
      id: '07',
      title: '3-Skeptic Risk Committee',
      href: '/grantcraft',
      description: 'Adversarial cross-examination by Legal/Regulatory, Cyber, and Credit AI skeptics with binding votes.',
      icon: Landmark,
      color: '#0c2340',
    },
    {
      id: '08',
      title: 'CRO Executive Hub',
      href: '/dashboard',
      description: 'Consolidated executive risk intelligence with one-click cryptographic PDF Dossier generation.',
      icon: LayoutDashboard,
      color: '#0284c7',
    },
    {
      id: '09',
      title: 'Spotlight Search (Cmd+K)',
      href: '/#search',
      description: 'Omni-search indexing counterparties, statutory articles, and historical incident echoes in milliseconds.',
      icon: Search,
      color: '#38bdf8',
    },
    {
      id: '10',
      title: 'Auditor Scratchpad',
      href: '/paper-reader',
      description: 'Encrypted local redlining scratchpad for contract negotiation riders and legal counsel notes.',
      icon: PenTool,
      color: '#10b981',
    },
  ];

  return (
    <section id="workstations" className="w-full py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase bg-sky-50 text-[#0284c7] border border-sky-200">
            TEN MISSION-CRITICAL STATIONS
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0c2340] tracking-tight mt-3">
            An Integrated Risk Operating System
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            From initial GSTIN intake to final CRO sign-off, each workstation automates a specialized layer of counterparty defense.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {workstations.map((ws, i) => {
            const Icon = ws.icon;
            return (
              <motion.div
                key={ws.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                whileHover={{ y: -3 }}
                className="group flex flex-col justify-between p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: `${ws.color}15`, color: ws.color }}
                    >
                      <Icon size={16} />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-400">{ws.id}</span>
                  </div>
                  <h3 className="text-xs font-black text-[#0c2340] group-hover:text-[#0284c7] transition-colors">
                    {ws.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    {ws.description}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href={ws.href}
                    className="text-[11px] font-bold text-[#0c2340] group-hover:text-[#0284c7] flex items-center gap-1 transition-colors"
                  >
                    Open Station <ChevronRight size={12} />
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
    { title: 'RBI Master Direction 2024', subtitle: 'IT Governance & Outsourcing', tag: 'Mandatory Audit' },
    { title: 'DPDP Act 2023', subtitle: 'Data Fiduciary Obligations', tag: '72h Breach Notice' },
    { title: 'CERT-In Directions', subtitle: 'Cybersecurity Mandate', tag: '6-Hour Incident SLA' },
    { title: 'MCA-21 KYB', subtitle: 'Active Director DIN Verification', tag: 'UBO Tracing' },
    { title: 'GSTN Rule 86B', subtitle: 'Circular Invoicing Protection', tag: 'Escrow Reserve Hold' },
  ];

  return (
    <section id="compliance" className="w-full py-10 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {standards.map((st, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs shadow-xs"
            >
              <ShieldCheck size={14} className="text-[#0284c7]" />
              <span className="font-bold text-[#0c2340]">{st.title}</span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-600 font-medium">{st.subtitle}</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 ml-1">
                {st.tag}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Section 7: Bottom CTA Banner Component (Exact Match to User Screenshot)    */
/* -------------------------------------------------------------------------- */
export function BottomCtaBanner() {
  return (
    <section className="w-full py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div
        className="relative rounded-[28px] overflow-hidden p-8 sm:p-12 lg:p-14 text-white shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, #091a30 0%, #0c2340 45%, #18386b 100%)',
          boxShadow: '0 25px 50px -12px rgba(12, 35, 64, 0.35)',
        }}
      >
        {/* Subtle Ambient Radial Glow */}
        <div
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full pointer-events-none opacity-25"
          style={{
            background: 'radial-gradient(circle, #38bdf8 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Heading, Subtext & 3 Bottom Metrics */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              {/* Eyebrow Pill */}
              <div className="flex items-center gap-2 text-[11px] font-mono font-bold tracking-wider text-emerald-400 uppercase mb-4">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>9 AGENTS ACTIVE · SYSTEM READY</span>
              </div>

              {/* H2 Title */}
              <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-black text-white tracking-tight leading-[1.12]">
                Audit Your First Counterparty Contract Today.
              </h2>

              {/* Subtext */}
              <p className="text-sm sm:text-base text-slate-300 font-normal mt-4 leading-relaxed max-w-xl">
                Upload any vendor MSA, DPA, or SOC2 disclosure and receive a fully grounded, RBI-compliant risk dossier in under 4 minutes — with automated escrow triggers if needed.
              </p>
            </div>

            {/* 3 Metrics Row (Exact Match) */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 mt-10 pt-6 border-t border-white/15">
              <div>
                <div className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight">
                  &lt; 4 min
                </div>
                <div className="text-[10px] sm:text-[11px] font-mono font-bold uppercase text-slate-400 mt-1">
                  AUDIT TIME
                </div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight">
                  ₹0
                </div>
                <div className="text-[10px] sm:text-[11px] font-mono font-bold uppercase text-slate-400 mt-1">
                  HALLUCINATION COST
                </div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight">
                  100%
                </div>
                <div className="text-[10px] sm:text-[11px] font-mono font-bold uppercase text-slate-400 mt-1">
                  VERBATIM GROUNDING
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Floating Frosted Glass Card */}
          <div className="lg:col-span-5 w-full">
            <div
              className="rounded-2xl p-6 sm:p-7 border border-white/20 shadow-2xl"
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
              }}
            >
              {/* Card Header */}
              <div className="flex items-center gap-2 text-white font-bold text-base mb-1">
                <ShieldAlert size={18} className="text-sky-400" />
                <span>Start Risk Audit</span>
              </div>
              <p className="text-xs text-slate-300 mb-5">
                Upload MSA, DPA, or SOC2 · Supports PDF, DOCX, TXT
              </p>

              {/* Buttons */}
              <div className="flex flex-col gap-3">
                <Link
                  href="/paper-reader"
                  className="w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#0c2340] hover:bg-[#07192f] border border-white/20 flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98"
                >
                  <UploadCloud size={16} className="text-sky-400" />
                  <span>Audit a Counterparty Contract</span>
                </Link>

                <Link
                  href="/curriculum-view#graph"
                  className="w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-[#0c2340] bg-white hover:bg-slate-100 flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
                >
                  <Network size={16} className="text-[#0284c7]" />
                  <span>Explore GraphRAG Supply Chain</span>
                </Link>
              </div>

              {/* Security Micro Caption */}
              <div className="mt-4 text-center">
                <span className="text-[10px] font-mono text-slate-300/80 flex items-center justify-center gap-1.5">
                  <Lock size={11} className="text-slate-300" />
                  <span>Zero-knowledge · Encrypted at rest · DPDP 2023 compliant</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

