'use client';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Paper {
  id: string;
  title: string;
  authors: string[];
  year: number;
  venue: string;
  abstract: string;
  arxivId?: string;
  doi?: string;
  citationCount: number;
  tags: string[];
  difficulty: 'foundational' | 'intermediate' | 'advanced';
  readStatus: 'unread' | 'reading' | 'done';
  coverColor: string;
}

export interface CurriculumModule {
  id: string;
  title: string;
  stage: 'foundational' | 'intermediate' | 'advanced';
  description: string;
  papers: Paper[];
  estimatedHours: number;
  coverageScore: number;
}

export interface Curriculum {
  id: string;
  topic: string;
  createdAt: string;
  modules: CurriculumModule[];
  totalPapers: number;
  coveragePercent: number;
  gapCount: number;
  contradictionCount: number;
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'paper' | 'concept';
  moduleId: string;
  x: number;
  y: number;
  weight: number;
  color: string;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  relation: 'builds-on' | 'cites' | 'contradicts';
}

export interface CritiqueItem {
  id: string;
  type: 'gap' | 'contradiction' | 'outdated' | 'weak-source';
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  affectedPaperId?: string;
  affectedModuleId?: string;
  suggestion: string;
  status: 'open' | 'applied' | 'dismissed';
}

export interface CritiqueResponse {
  curriculumId: string;
  summary: string;
  overallScore: number;
  items: CritiqueItem[];
}

export interface Workspace {
  id: string;
  topic: string;
  description: string;
  createdAt: string;
  paperCount: number;
  coveragePercent: number;
  status: 'idle' | 'running' | 'done' | 'error';
  color: string;
}

// ─── Vendor Disclosures & Contract Artifacts ──────────────────────────────────

export const MOCK_PAPERS: Paper[] = [
  {
    id: 'p001',
    title: 'CloudGate Infrastructure: Master Services Agreement & SLA',
    authors: ['CloudGate Legal', 'DevOps Ops Team'],
    year: 2024,
    venue: 'MSA v3.2',
    abstract: 'Primary cloud hosting agreement specifying 99.95% monthly uptime SLA, automated failover parameters, Tier-IV data center guarantees, and data residency in AWS ap-south-1 (Mumbai). Includes 30-day termination for breach clause.',
    arxivId: 'CG-MSA-2024',
    citationCount: 420,
    tags: ['cloud-infra', 'SLA', 'uptime-guarantee', 'tier-4'],
    difficulty: 'foundational',
    readStatus: 'done',
    coverColor: '#0284c7',
  },
  {
    id: 'p002',
    title: 'PayNex Gateway: Data Processing Addendum (DPDP / GDPR)',
    authors: ['PayNex Compliance', 'Data Privacy Officer'],
    year: 2024,
    venue: 'DPA-RBI-2024',
    abstract: 'Comprehensive subprocessor data processing terms complying with DPDP Act 2023 and RBI card-on-file tokenization guidelines. Stipulates strict 72-hour CERT-In incident notification and zero cross-border telemetry routing without prior written consent.',
    arxivId: 'PX-DPA-901',
    citationCount: 1100,
    tags: ['DPDP-act', 'tokenization', 'RBI-mandate', 'subprocessor'],
    difficulty: 'foundational',
    readStatus: 'done',
    coverColor: '#1e3a8a',
  },
  {
    id: 'p003',
    title: 'MedVault Health AI: SOC2 Type II & HIPAA Security Assessment',
    authors: ['KPMG Assurance', 'MedVault InfoSec'],
    year: 2024,
    venue: 'SOC2-Type-II',
    abstract: 'Independent audit report evaluating Trust Services Criteria: Security, Availability, and Confidentiality. Flags 1 medium finding regarding quarterly access recertifications, remediated in Q3 2024.',
    arxivId: 'MV-SOC2-2024',
    citationCount: 890,
    tags: ['SOC2-Type-II', 'HIPAA', 'access-control', 'encryption-at-rest'],
    difficulty: 'intermediate',
    readStatus: 'reading',
    coverColor: '#059669',
  },
  {
    id: 'p004',
    title: 'Apex Logistics Express: Cash-on-Delivery (COD) Merchant Terms',
    authors: ['Apex Risk Operations', 'Logistics Finance'],
    year: 2023,
    venue: 'COD-SLA-v4',
    abstract: 'Covers dynamic cash collection reconciliation, 3-day payout settlement cycles via RazorpayX, and an automated INR 25 Lakhs rolling reserve escrow against RTO shipment loss.',
    arxivId: 'APEX-COD-08',
    citationCount: 340,
    tags: ['COD-fraud', 'escrow-holdback', 'RTO-risk', 'razorpayx'],
    difficulty: 'intermediate',
    readStatus: 'unread',
    coverColor: '#d97706',
  },
  {
    id: 'p005',
    title: 'SwiftKYC Biometric Verification: UIDAI & AML Compliance Charter',
    authors: ['SwiftKYC Legal', 'Regulatory Counsel'],
    year: 2024,
    venue: 'AML-KYB-Cert',
    abstract: 'Outlines video-KYC and Penny Drop account verification workflows complying with RBI Master Direction on KYC (2016) and PMLA obligations for fintech onboarding.',
    arxivId: 'SKYC-PMLA-12',
    citationCount: 520,
    tags: ['KYB-verification', 'penny-drop', 'PMLA', 'UIDAI'],
    difficulty: 'intermediate',
    readStatus: 'unread',
    coverColor: '#7c3aed',
  },
  {
    id: 'p006',
    title: 'TransactShield: Chargeback Guarantee & Dispute Arbitration Terms',
    authors: ['TransactShield Risk', 'Underwriting Team'],
    year: 2024,
    venue: 'CB-SHIELD-24',
    abstract: 'Defines 100% indemnity on fraudulent chargebacks for card-not-present (CNP) e-commerce transactions, subject to strict 3D Secure 2.0 dynamic authentication verification.',
    arxivId: 'TS-3DS-44',
    citationCount: 680,
    tags: ['chargeback-fraud', '3DS-2.0', 'indemnity', 'fraud-shield'],
    difficulty: 'advanced',
    readStatus: 'unread',
    coverColor: '#dc2626',
  },
  {
    id: 'p007',
    title: 'FinCore Systems: MCA Audited Balance Sheet & Working Capital Audit',
    authors: ['Deloitte India', 'Statutory Auditor'],
    year: 2024,
    venue: 'FY23-24-Audit',
    abstract: 'Audited statutory financial statements demonstrating INR 142 Cr annual turnover, positive EBITDA margins, and 18 months of verified cash runway, mitigating counterparty insolvency risk.',
    arxivId: 'FC-MCA-2024',
    citationCount: 920,
    tags: ['financial-runway', 'MCA-21', 'working-capital', 'solvency'],
    difficulty: 'advanced',
    readStatus: 'unread',
    coverColor: '#0284c7',
  },
  {
    id: 'p008',
    title: 'SecureNet Telemetry: Subprocessor 4th-Party Data Flow Graph',
    authors: ['SecureNet Security Lab'],
    year: 2024,
    venue: 'INFRA-MAP-Q3',
    abstract: 'Maps 4th-party data dependencies across CDN providers, telemetry aggregation clusters, and monitoring daemons, ensuring zero unencrypted egress to non-whitelisted regions.',
    arxivId: 'SN-DATA-09',
    citationCount: 410,
    tags: ['4th-party-risk', 'data-residency', 'egress-firewall', 'subprocessor'],
    difficulty: 'intermediate',
    readStatus: 'unread',
    coverColor: '#059669',
  },
];

// ─── Diligence Curriculum ─────────────────────────────────────────────────────

export const MOCK_CURRICULUM: Curriculum = {
  id: 'curr-risk-001',
  topic: 'CloudGate Infrastructure — Enterprise Vendor Due Diligence Trail',
  createdAt: '2024-08-20T10:30:00Z',
  totalPapers: 8,
  coveragePercent: 88,
  gapCount: 2,
  contradictionCount: 1,
  modules: [
    {
      id: 'mod-001',
      title: 'Tier 1: Corporate Registry & MCA Legal Standing',
      stage: 'foundational',
      description: 'Verification of MCA-21 active registration, GSTIN 3B return regularity, active director KYC, and clean AML/sanctions screening.',
      estimatedHours: 4,
      coverageScore: 98,
      papers: [MOCK_PAPERS[0], MOCK_PAPERS[6]],
    },
    {
      id: 'mod-002',
      title: 'Tier 2: Cyber, SOC2 & InfoSec Governance',
      stage: 'intermediate',
      description: 'Auditing SOC2 Type II trust criteria, penetration testing reports, AES-256 encryption at rest, and 72-hour CERT-In incident notification SLA.',
      estimatedHours: 6,
      coverageScore: 88,
      papers: [MOCK_PAPERS[1], MOCK_PAPERS[2]],
    },
    {
      id: 'mod-003',
      title: 'Tier 3: Payout Escrow, COD & Credit Health',
      stage: 'intermediate',
      description: 'Evaluating cash runway solvency, RazorpayX automated settlement controls, rolling reserve holdbacks, and default safeguards.',
      estimatedHours: 5,
      coverageScore: 82,
      papers: [MOCK_PAPERS[3], MOCK_PAPERS[4]],
    },
    {
      id: 'mod-004',
      title: 'Tier 4: Contractual MSA, DPDP & Indemnity Enforceability',
      stage: 'advanced',
      description: 'Validating uncapped liability for gross negligence, 4th-party subprocessor telemetry bounds, and cross-border data transfer covenants.',
      estimatedHours: 8,
      coverageScore: 78,
      papers: [MOCK_PAPERS[5], MOCK_PAPERS[7]],
    },
  ],
};

// ─── Entity & Supply Chain Graph ──────────────────────────────────────────────

export const MOCK_GRAPH_NODES: GraphNode[] = [
  { id: 'p001', label: 'CloudGate Infra (Primary Vendor)', type: 'paper', moduleId: 'mod-001', x: 300, y: 200, weight: 10, color: '#0284c7' },
  { id: 'p002', label: 'PayNex Gateway (Subprocessor)', type: 'paper', moduleId: 'mod-001', x: 180, y: 320, weight: 9, color: '#1e3a8a' },
  { id: 'p003', label: 'MedVault AI (Healthcare Module)', type: 'paper', moduleId: 'mod-002', x: 450, y: 150, weight: 8, color: '#059669' },
  { id: 'p004', label: 'Apex COD Logistics', type: 'paper', moduleId: 'mod-002', x: 560, y: 280, weight: 6, color: '#d97706' },
  { id: 'p005', label: 'SwiftKYC Biometrics', type: 'paper', moduleId: 'mod-003', x: 420, y: 380, weight: 7, color: '#7c3aed' },
  { id: 'p006', label: 'TransactShield CNP', type: 'paper', moduleId: 'mod-003', x: 280, y: 450, weight: 5, color: '#dc2626' },
  { id: 'p007', label: 'FinCore Balance Sheet', type: 'paper', moduleId: 'mod-004', x: 600, y: 150, weight: 6, color: '#0284c7' },
  { id: 'p008', label: 'SecureNet Telemetry (4th-Party)', type: 'paper', moduleId: 'mod-004', x: 160, y: 180, weight: 6, color: '#059669' },
  { id: 'c001', label: 'MCA-21 Active Entity', type: 'concept', moduleId: 'mod-001', x: 340, y: 100, weight: 7, color: '#0284c7' },
  { id: 'c002', label: 'SOC2 Type II Scope', type: 'concept', moduleId: 'mod-001', x: 120, y: 240, weight: 6, color: '#1e3a8a' },
  { id: 'c003', label: 'DPDP Data Addendum', type: 'concept', moduleId: 'mod-003', x: 500, y: 420, weight: 5, color: '#059669' },
];

export const MOCK_GRAPH_EDGES: GraphEdge[] = [
  { id: 'e001', source: 'p001', target: 'c001', relation: 'builds-on' },
  { id: 'e002', source: 'p002', target: 'p001', relation: 'builds-on' },
  { id: 'e003', source: 'p002', target: 'c002', relation: 'builds-on' },
  { id: 'e004', source: 'p003', target: 'p001', relation: 'builds-on' },
  { id: 'e005', source: 'p003', target: 'p004', relation: 'cites' },
  { id: 'e006', source: 'p005', target: 'p003', relation: 'builds-on' },
  { id: 'e007', source: 'p005', target: 'c003', relation: 'builds-on' },
  { id: 'e008', source: 'p006', target: 'p005', relation: 'builds-on' },
  { id: 'e009', source: 'p006', target: 'c003', relation: 'cites' },
  { id: 'e010', source: 'p007', target: 'p003', relation: 'builds-on' },
  { id: 'e011', source: 'p008', target: 'p002', relation: 'builds-on' },
  { id: 'e012', source: 'p004', target: 'p001', relation: 'cites' },
  { id: 'e013', source: 'p007', target: 'p005', relation: 'cites' },
  { id: 'e014', source: 'p008', target: 'c001', relation: 'cites' },
  { id: 'e015', source: 'p006', target: 'p007', relation: 'contradicts' },
];

// ─── Red-Flag & Contract Audit Critique ───────────────────────────────────────

export const MOCK_CRITIQUE: CritiqueResponse = {
  curriculumId: 'curr-risk-001',
  summary: 'The vendor profile shows strong corporate registration and audited balance sheet metrics. However, high-severity contractual and cyber risks remain: Section 14 limits aggregate liability to 1 month fees, and the DPDP subprocessor disclosure lacks explicit 72h CERT-In breach notification.',
  overallScore: 88,
  items: [
    {
      id: 'cr-001',
      type: 'gap',
      severity: 'high',
      title: 'Liability Cap: 1-Month Fee Limitation',
      description: 'Vendor agreement Section 14 caps all direct and consequential damages to the previous 30 days of SaaS subscription fees (INR 1.8 Lakhs), completely inadequate for payment system outages or data loss.',
      affectedModuleId: 'mod-004',
      suggestion: 'Demand uncapped liability for data breaches, confidentiality violations, and willful misconduct.',
      status: 'open',
    },
    {
      id: 'cr-002',
      type: 'contradiction',
      severity: 'high',
      title: 'Missing CERT-In 72h Incident Notification',
      description: 'The security disclosure promises "prompt incident notification" without specifying the statutory 72-hour window mandated by Indian CERT-In and DPDP Act 2023.',
      affectedPaperId: 'p002',
      suggestion: 'Insert standard Razorpay CERT-In 72h notification clause with liquidated damages for delayed reporting.',
      status: 'open',
    },
    {
      id: 'cr-003',
      type: 'gap',
      severity: 'medium',
      title: 'Undisclosed 4th-Party Telemetry Routing',
      description: 'The architecture appendix indicates error telemetry is relayed to an unverified US log analysis subprocessor outside Mumbai data residency bounds.',
      affectedModuleId: 'mod-002',
      suggestion: 'Require local telemetry aggregation within AWS ap-south-1 or executed Standard Contractual Clauses (SCC).',
      status: 'open',
    },
    {
      id: 'cr-004',
      type: 'outdated',
      severity: 'medium',
      title: 'SOC2 Type II Audit Window Expiring in 45 Days',
      description: 'The provided SOC2 Type II report coverage period ends on October 31, 2024. A bridge letter or fresh audit report has not yet been submitted.',
      affectedPaperId: 'p003',
      suggestion: 'Require vendor to provide continuous audit bridge letter as a condition precedent for contract execution.',
      status: 'open',
    },
    {
      id: 'cr-005',
      type: 'weak-source',
      severity: 'low',
      title: 'Self-Attested ISO 27001 Checklist',
      description: 'Vendor provided a self-attested ISO checklist for their Singapore subsidiary rather than a third-party accredited auditor certificate.',
      affectedPaperId: 'p007',
      suggestion: 'Request verified IAF-accredited certification copy before releasing Singapore cross-border routing.',
      status: 'open',
    },
  ],
};

// ─── Active Diligence Workspaces ──────────────────────────────────────────────

export const MOCK_WORKSPACES: Workspace[] = [
  {
    id: 'ws-001',
    topic: 'CloudGate Infrastructure Ltd.',
    description: 'Multi-cloud hosting & Tier-4 DB cluster vendor — Tier 1 Critical',
    createdAt: '2024-08-20T10:30:00Z',
    paperCount: 8,
    coveragePercent: 88,
    status: 'done',
    color: '#0284c7',
  },
  {
    id: 'ws-002',
    topic: 'PayNex Gateway Technologies',
    description: 'White-label payment gateway subprocessor — Tier 1 Critical',
    createdAt: '2024-08-18T14:00:00Z',
    paperCount: 12,
    coveragePercent: 94,
    status: 'done',
    color: '#1e3a8a',
  },
  {
    id: 'ws-003',
    topic: 'Apex Logistics Express COD',
    description: 'E-commerce COD collection & last-mile delivery partner — Tier 2 High',
    createdAt: '2024-08-15T09:00:00Z',
    paperCount: 6,
    coveragePercent: 62,
    status: 'running',
    color: '#d97706',
  },
  {
    id: 'ws-004',
    topic: 'SwiftKYC Biometric Services',
    description: 'Merchant onboarding video-KYC & Penny Drop verification — Tier 2 High',
    createdAt: '2024-08-10T16:00:00Z',
    paperCount: 9,
    coveragePercent: 78,
    status: 'idle',
    color: '#7c3aed',
  },
];

// ─── RiskOS Multi-Agent Ecosystem ─────────────────────────────────────────────

export interface AgentInfo {
  id: string;
  name: string;
  role: string;
  description: string;
  color: string;
  stage: number;
}

export const MOCK_AGENTS: AgentInfo[] = [
  {
    id: 'dueDiligence',
    name: 'Due Diligence Agent',
    role: '4-Tier Verification Trail',
    description: 'Sequences MCA registry, GSTIN 3B returns, SOC2 certs, and financial runway into structured verification gates.',
    color: '#0284c7',
    stage: 1,
  },
  {
    id: 'redFlag',
    name: 'Red-Flag Clause Auditor',
    role: 'Contract & Security Critique',
    description: 'Audits MSAs, SLAs, and security disclosures for liability caps, subprocessor leaks, missing BAAs, and DPDP gaps.',
    color: '#dc2626',
    stage: 2,
  },
  {
    id: 'incidentArchive',
    name: 'Incident Memory Agent',
    role: 'Fraud & Default Archive',
    description: 'Matches incoming vendor profiles against historical ghost shell companies, invoice fraud, and chargeback default patterns.',
    color: '#d97706',
    stage: 3,
  },
  {
    id: 'riskCommittee',
    name: 'Risk Committee Defense',
    role: '3-Skeptic Panel',
    description: 'Adversarial evaluation by Legal/Regulatory, Cyber/InfoSec, and Financial/Credit skeptics before onboarding sign-off.',
    color: '#1e3a8a',
    stage: 4,
  },
];

// ─── Assistant QA ─────────────────────────────────────────────────────────────

export interface AssistantQA {
  id: string;
  question: string;
  answer: string;
}

export const MOCK_ASSISTANT_QA: AssistantQA[] = [
  {
    id: 'qa-001',
    question: 'How do I run due diligence on a new vendor?',
    answer: 'Enter the vendor domain or GSTIN on the Intake Engine and click “Run Diligence Pipeline”. RiskOS synthesizes corporate registry, cyber certificates, and contract disclosures into a 4-tier verification trail.',
  },
  {
    id: 'qa-002',
    question: 'What does the Red-Flag Contract Auditor check?',
    answer: 'It inspects agreements for 1-month liability caps, missing 72h CERT-In breach clauses, undisclosed 4th-party telemetry routing, and lack of continuous SOC2 penetration audits.',
  },
  {
    id: 'qa-003',
    question: 'What is the Historical Fraud & Default Archive?',
    answer: 'A persistent organizational risk memory storing past vendor breach post-mortems, shell company defaults, and COD shortfall patterns — warning you immediately if a new vendor repeats these signatures.',
  },
  {
    id: 'qa-004',
    question: 'How does the Risk Committee make decisions?',
    answer: 'Three independent AI skeptics (Legal, InfoSec, Financial) interrogate your diligence dossier. You receive an official verdict: APPROVED, CONDITIONAL APPROVAL (with mandatory stipulations), or REJECTED.',
  },
];

export const ASSISTANT_FALLBACK =
  "I am RiskOS Assistant — your AI copilot for vendor risk, compliance checks, and Razorpay due diligence.";

// ─── Search Results ───────────────────────────────────────────────────────────

export interface SearchResult {
  id: string;
  type: 'paper' | 'topic' | 'note' | 'workspace';
  title: string;
  subtitle: string;
  href: string;
}

export const MOCK_SEARCH_RESULTS: SearchResult[] = [
  { id: 'sr-001', type: 'paper', title: 'CloudGate Infrastructure Master Agreement', subtitle: '99.95% SLA · AWS ap-south-1 · Tier-1 Critical', href: '/paper-reader' },
  { id: 'sr-002', type: 'paper', title: 'PayNex Gateway Data Processing Addendum', subtitle: 'DPDP Act 2023 · RBI Tokenization · 72h CERT-In', href: '/paper-reader' },
  { id: 'sr-003', type: 'topic', title: 'CloudGate Infrastructure Due Diligence Trail', subtitle: 'Active Workspace · 8 Disclosures · 88% Verified', href: '/curriculum-view' },
  { id: 'sr-004', type: 'workspace', title: 'PayNex Gateway Risk Profile', subtitle: 'Workspace · 12 Disclosures · 94% Verified', href: '/curriculum-view' },
  { id: 'sr-005', type: 'note', title: 'Audit Note: 1-Month Liability Cap Dispute', subtitle: 'Legal Stipulation · CloudGate Section 14', href: '/paper-reader' },
];

