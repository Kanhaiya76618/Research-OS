'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Scale, Lock, RefreshCw, FileSpreadsheet, Globe2 } from 'lucide-react';

const RISK_DOMAINS = [
  {
    id: 'rd-001',
    title: 'Payment Gateway & Payout Fraud (RazorpayX)',
    description: 'Invoice manipulation, ghost vendor accounts, bank account verification, and automated shell company detection.',
    icon: RefreshCw,
    controls: 12,
    color: '#0284c7',
    tags: ['RazorpayX', 'Payouts', 'KYB / AML'],
  },
  {
    id: 'rd-002',
    title: 'Subprocessor & Cyber Security (SOC2 / ISO 27001)',
    description: 'Multi-tenant data isolation, encryption-at-rest keys, subprocessor data flow, and continuous penetration audits.',
    icon: Lock,
    controls: 18,
    color: '#0d9488',
    tags: ['InfoSec', 'SOC2 Type II', 'ISO 27001'],
  },
  {
    id: 'rd-003',
    title: 'Merchant Onboarding Risk & Fraud Rings (Thirdwatch)',
    description: 'Graph-based synthetic identity detection, chargeback prediction, website catalog scans, and prohibited goods.',
    icon: ShieldCheck,
    controls: 14,
    color: '#1e3a8a',
    tags: ['Thirdwatch', 'Magic Checkout', 'Chargebacks'],
  },
  {
    id: 'rd-004',
    title: 'Contractual Liability & SLA Enforcement',
    description: 'Indemnity caps, 72h data breach notification clauses, termination for cause, and regulatory escrow requirements.',
    icon: Scale,
    controls: 10,
    color: '#dc2626',
    tags: ['Legal Redlines', 'SLA Caps', 'Compliance'],
  },
  {
    id: 'rd-005',
    title: 'COD & Last-Mile Delivery Logistics Risk (RTO)',
    description: 'Address profiling, fraudulent COD buyer velocity, delivery return-to-origin loss minimization, and dispute escrow.',
    icon: FileSpreadsheet,
    controls: 9,
    color: '#d97706',
    tags: ['RTO Fraud', 'COD PrePay', 'Logistics'],
  },
  {
    id: 'rd-006',
    title: 'Cross-Border & Data Sovereignty (DPDP / GDPR)',
    description: 'Cross-border telemetry data transfers, Indian DPDP Act 2023 compliance, EU Standard Contractual Clauses (SCCs).',
    icon: Globe2,
    controls: 11,
    color: '#7c3aed',
    tags: ['DPDP Act', 'GDPR', 'Data Residency'],
  },
];

export default function FeaturedTopics() {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <ShieldCheck size={16} className="text-[#0284c7]" />
        <span className="text-sm font-bold text-[#0c2340] tracking-tight">Razorpay Risk & Compliance Frameworks</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {RISK_DOMAINS.map((domain, i) => {
          const Icon = domain.icon;
          return (
            <motion.div
              key={domain.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30, delay: i * 0.05 }}
              whileHover={{ y: -3, scale: 1.01 }}
            >
              <Link href="/curriculum-view">
                <div
                  className="clay-card p-4 cursor-pointer h-full group transition-all duration-200"
                  style={{
                    background: 'rgba(255, 255, 255, 0.82)',
                  }}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: `${domain.color}15`, border: `1px solid ${domain.color}25` }}
                    >
                      <Icon size={14} style={{ color: domain.color }} />
                    </div>
                    <p className="flex-1 text-xs font-bold text-[#0c2340] leading-tight mt-0.5">{domain.title}</p>
                    <ArrowRight
                      size={13}
                      className="text-[#94a3b8] group-hover:text-[#0284c7] transition-colors shrink-0 mt-0.5"
                    />
                  </div>

                  <p className="text-[11px] text-[#64748b] leading-relaxed mb-3 line-clamp-2">
                    {domain.description}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-black/4">
                    <div className="flex flex-wrap gap-1">
                      {domain.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded-full"
                          style={{
                            background: `${domain.color}12`,
                            color: domain.color,
                            border: `1px solid ${domain.color}22`,
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-[10px] font-mono font-semibold text-[#64748b]">{domain.controls} Controls</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}