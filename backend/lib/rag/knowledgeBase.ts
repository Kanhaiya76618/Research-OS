/**
 * RiskOS Regulatory & Compliance Knowledge Base
 * Authoritative Indian & Global Fintech Regulatory Compendium:
 * - RBI Master Direction on Outsourcing & IT Governance (2024)
 * - Digital Personal Data Protection Act (DPDP Act 2023)
 * - CERT-In Cybersecurity Directives (6-Hour Mandatory Reporting)
 * - MCA-21 & GSTIN Fraud / Circular Invoicing Typologies
 * - PCI-DSS v4.0 & SOC2 Trust Services Criteria
 */

export interface RegulatoryDocument {
  id: string;
  authority: 'RBI' | 'DPDP' | 'CERT-In' | 'MCA-21' | 'GSTN' | 'PCI-SSC';
  title: string;
  section: string;
  category: 'liability_evasion' | 'subprocessor_risk' | 'unverified_cert' | 'regulatory_gap' | 'financial_fraud';
  mandate: string;
  enforcementThreshold: string;
  requiredContractClause: string;
  keywords: string[];
}

export const REGULATORY_COMPENDIUM: RegulatoryDocument[] = [
  {
    id: 'reg-rbi-it-01',
    authority: 'RBI',
    title: 'Master Direction on Information Technology Governance, Risk, Controls and Assurance (2024)',
    section: 'Section 18.2 — Vendor Outsourcing & Concentration Risk',
    category: 'subprocessor_risk',
    mandate: 'Regulated entities and payment aggregators cannot outsource core risk assessment functions. Any sub-contractor or subprocessor appointed by a primary vendor must be formally pre-approved in writing with explicit audit and inspection rights granted to RBI inspectors.',
    enforcementThreshold: 'Mandatory 30-day prior written notice for 4th-party subprocessor appointments.',
    requiredContractClause: 'Vendor agrees that Razorpay and the Reserve Bank of India (RBI) retain unconditional audit and inspection rights over vendor and all approved sub-processors. Vendor shall not engage subprocessors without 30 calendar days prior written consent.',
    keywords: ['rbi', 'outsourcing', 'subprocessor', 'audit rights', 'concentration risk', 'master direction', 'inspection'],
  },
  {
    id: 'reg-dpdp-01',
    authority: 'DPDP',
    title: 'Digital Personal Data Protection Act (2023)',
    section: 'Section 8(6) & Section 9 — Data Processor Obligations & Breach Notification',
    category: 'regulatory_gap',
    mandate: 'Data Fiduciaries and Processors must implement appropriate technical and organizational measures to ensure compliance. In the event of a personal data breach, the Data Fiduciary shall give the Data Protection Board and each affected Data Principal notification in the prescribed form.',
    enforcementThreshold: 'Fines up to ₹250 Crores for failure to prevent or report data breaches.',
    requiredContractClause: 'In the event of any confirmed or suspected personal data breach, Vendor shall notify Razorpay immediately, and in no event later than twenty-four (24) hours from initial discovery, with continuous forensic updates.',
    keywords: ['dpdp', 'personal data', 'breach notification', 'data fiduciary', 'data processor', 'data protection board', 'privacy'],
  },
  {
    id: 'reg-cert-in-01',
    authority: 'CERT-In',
    title: 'Cyber Security Directions under Section 70B(6) of IT Act, 2000',
    section: 'Direction 2.1(i) — Mandatory 6-Hour Cyber Incident Reporting',
    category: 'regulatory_gap',
    mandate: 'Any service provider, intermediary, data center, or body corporate handling ICT systems in India must mandatorily report cybersecurity incidents (ransomware, unauthorized data access, DDoS) to CERT-In within 6 hours of noticing or being brought to notice.',
    enforcementThreshold: 'Mandatory 6-hour reporting window; imprisonment up to 1 year and fines under Section 70B.',
    requiredContractClause: 'Vendor warrants strict compliance with CERT-In directions and covenants to inform Razorpay Security Operations within four (4) hours of any cyber incident impacting or potentially impacting customer payment infrastructure.',
    keywords: ['cert-in', 'cyber incident', '6 hours', 'breach reporting', 'it act', 'ransomware', 'cybersecurity'],
  },
  {
    id: 'reg-rbi-liability-01',
    authority: 'RBI',
    title: 'RBI Guidelines on Regulation of Payment Aggregators and Payment Gateways (PA/PG)',
    section: 'Section 12 — Liability and Escrow Account Settlement',
    category: 'liability_evasion',
    mandate: 'Payment intermediaries cannot limit their indemnity or liability for data breaches, gross negligence, or fraudulent transactions to fractional subscription fees. Customer funds and settlement accounts must remain ring-fenced.',
    enforcementThreshold: 'Liability for willful misconduct, security compromise, or gross negligence cannot be capped below the total transaction volume at risk.',
    requiredContractClause: 'Vendor aggregate liability for data breaches, confidentiality breaches, intellectual property infringement, and gross negligence shall be uncapped, or capped at not less than twelve (12) months of aggregate platform fees.',
    keywords: ['liability', 'indemnity', 'cap', 'escrow', 'payment aggregator', 'rbi settlement', 'negligence'],
  },
  {
    id: 'reg-mca-gstin-01',
    authority: 'MCA-21',
    title: 'Companies Act Section 248 & GST Circular Invoicing Rules',
    section: 'Rule 86B — Restriction on Use of Input Tax Credit & UBO Verification',
    category: 'financial_fraud',
    mandate: 'Entities with delayed GSTR-3B filings exceeding 90 days, mismatched GSTR-1 outwards, or disqualified directors under Section 164(2) present severe circular invoicing and shell counterparty hazard.',
    enforcementThreshold: 'Immediate suspension of payment settlement and automatic 20% rolling reserve hold in RazorpayX escrow.',
    requiredContractClause: 'Razorpay reserves the immediate right to withhold settlements or trigger automated escrow reserve allocation if counterparty GSTIN status is canceled, suspended, or subjected to Rule 86B restrictions.',
    keywords: ['gstin', 'mca', 'shell company', 'ubo', 'gstr-3b', 'circular invoicing', 'disqualified director', 'escrow hold'],
  },
  {
    id: 'reg-soc2-pci-01',
    authority: 'PCI-SSC',
    title: 'PCI-DSS v4.0 & AICPA SOC2 Type II Standards',
    section: 'Requirement 12.8 — Third-Party Service Provider (TPSP) Monitoring',
    category: 'unverified_cert',
    mandate: 'Entities handling payment card data or tokenized PANs must provide active, unexpired Attestation of Compliance (AOC) signed by a Qualified Security Assessor (QSA). Self-attestation is strictly non-compliant.',
    enforcementThreshold: 'Annual AOC submission required within 30 days of certificate expiry; unverified self-attestations rejected.',
    requiredContractClause: 'Vendor shall provide an updated SOC2 Type II report and PCI-DSS Level 1 AOC annually. Failure to provide audited certifications within 30 days of expiry constitutes a material breach entitling immediate termination.',
    keywords: ['soc2', 'pci-dss', 'aoc', 'qsa', 'attestation', 'certification', 'trust services criteria'],
  },
];
