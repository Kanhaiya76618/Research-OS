"""
RiskOS - Red-Flag Contract Auditor Dataset Generator (RiskAuditor-V1)
Generates high-fidelity training data for fine-tuning and verifiable reward RL (GRPO).

Each record includes:
- Prompt: System audit instructions + Raw contract text
- Target Output: Chain-of-Thought reasoning (<think>...</think>) + Verified JSON RedFlagClause payload
- Ground Truth: Exact verbatim excerpt, violation category, severity, and remediation
"""

import os
import json
import random

DATASET_DIR = os.path.dirname(os.path.abspath(__file__)) + "/data"
os.makedirs(DATASET_DIR, exist_ok=True)

CATEGORIES = ['liability_evasion', 'unverified_cert', 'subprocessor_risk', 'regulatory_gap']
SEVERITIES = ['low', 'medium', 'high', 'critical']

VENDORS = [
    ("CloudGate Infrastructure Ltd.", "Cloud Hosting & Bare Metal Clusters"),
    ("PayNex Global Technologies", "Payment Gateway & Tokenization Vault"),
    ("Apex Logistics Express", "COD Collection & Last-Mile Delivery"),
    ("SwiftKYC Biometrics Ltd.", "Merchant Video-KYC & Penny Drop"),
    ("TransactShield AI", "Fraud Scoring & Device Fingerprinting"),
    ("SecureVault Cloud Services", "PCI-DSS Level 1 Card Vaulting"),
    ("DataRoute Telemetry Inc.", "APM & Production Log Ingestion"),
    ("HyperStream Messaging NV", "Transactional SMS & OTP Aggregator")
]

CLAUSE_TEMPLATES = [
    # 1. Liability Evasion
    {
        "category": "liability_evasion",
        "severity": "critical",
        "clause_title": "Section 14. Limitation of Liability",
        "bad_clause": "IN NO EVENT SHALL VENDOR AGGREGATE LIABILITY ARISING OUT OF OR RELATED TO THIS AGREEMENT EXCEED THE FEES ACTUALLY PAID BY CUSTOMER TO VENDOR IN THE ONE (1) MONTH IMMEDIATELY PRECEDING THE CLAIM. VENDOR DISCLAIMS ALL LIABILITY FOR DATA BREACHES, DATA CORRUPTION, OR REGULATORY FINES.",
        "hazard_note": "Limits total liability to 1 month of subscription fees while disclaiming all data breach and regulatory liability, violating RBI PA/PG risk norms.",
        "remediation": "Vendor aggregate liability for data breaches, confidentiality violations, and gross negligence shall be uncapped, and in other claims capped at minimum 12 months fees."
    },
    {
        "category": "liability_evasion",
        "severity": "high",
        "clause_title": "Section 9. Indemnification Exclusion",
        "bad_clause": "CUSTOMER AGREES TO DEFEND AND INDEMNIFY VENDOR AGAINST ANY THIRD-PARTY LAWSUIT OR GOVERNMENT INVESTIGATION RESULTING FROM SYSTEM COMPROMISE OR SECURITY INCIDENTS ON VENDOR PLATFORM.",
        "hazard_note": "Reverses standard enterprise indemnification, forcing Razorpay to defend the vendor against vendor's own security lapses.",
        "remediation": "Vendor shall unconditionally defend, indemnify, and hold harmless Razorpay against all third-party claims, penalties, and damages arising from vendor security compromise."
    },

    # 2. Subprocessor Risk
    {
        "category": "subprocessor_risk",
        "severity": "critical",
        "clause_title": "Section 8. Subprocessor Appointments & Offshore Transfers",
        "bad_clause": "Vendor reserves the unilateral right to appoint, replace, or route customer personal and transaction telemetry to third-party subprocessors located in any international jurisdiction without prior notice or customer consent.",
        "hazard_note": "Permits unnotified offshore routing of payment telemetry without 30-day notice, violating RBI IT Outsourcing Directions and DPDP Act 2023.",
        "remediation": "Vendor shall provide minimum 30 days prior written notice before onboarding subprocessors. Razorpay reserves the right to reject subprocessors on compliance grounds."
    },
    {
        "category": "subprocessor_risk",
        "severity": "high",
        "clause_title": "Section 11. Fourth-Party Supply Chain Audit",
        "bad_clause": "Vendor shall not be required to pass audit covenants, security testing rights, or inspection obligations to its downstream cloud and infrastructure providers.",
        "hazard_note": "Severely weakens supply chain governance by blocking inspection of 4th-party hosting providers.",
        "remediation": "Vendor shall contractually bind all approved subprocessors to security and audit obligations at least as stringent as those set forth in this Agreement."
    },

    # 3. Regulatory Gap
    {
        "category": "regulatory_gap",
        "severity": "critical",
        "clause_title": "Section 16. Security Incident Notification",
        "bad_clause": "In the event of an unauthorized security breach affecting Customer confidential data, Vendor shall use commercially reasonable efforts to notify Customer within thirty (30) business days following completion of internal forensic reviews.",
        "hazard_note": "30 business day notification window flagrantly violates CERT-In 6-hour reporting mandate and DPDP 24h compliance timeline.",
        "remediation": "Vendor covenants to notify Razorpay Security Operations immediately, and in no event later than four (4) hours following any confirmed or suspected cybersecurity incident."
    },
    {
        "category": "regulatory_gap",
        "severity": "high",
        "clause_title": "Section 19. Data Protection Board & DPDP Consent Revocation",
        "bad_clause": "Customer acknowledges that data once submitted into Vendor pipeline cannot be deleted, anonymized, or purged upon consumer consent withdrawal due to immutable architecture.",
        "hazard_note": "Violates India DPDP Act 2023 Section 6(4) requiring Data Fiduciaries and Processors to erase personal data upon consent withdrawal.",
        "remediation": "Vendor shall support automated data deletion and verifiable cryptographic erasure within 48 hours of receiving a valid data subject revocation notice."
    },

    # 4. Unverified Certification
    {
        "category": "unverified_cert",
        "severity": "high",
        "clause_title": "Schedule B. Information Security Governance",
        "bad_clause": "Vendor self-certifies compliance with ISO/IEC 27001 standards via internal annual self-assessment questionnaire. External third-party auditor reports and SOC2 Type II attestations are not provided.",
        "hazard_note": "Relies exclusively on unverified internal self-attestation without external accredited audit certification.",
        "remediation": "Vendor shall annually provide an unexpired SOC2 Type II report and ISO/IEC 27001:2022 certificate audited by an accredited independent assessor."
    },
    {
        "category": "unverified_cert",
        "severity": "medium",
        "clause_title": "Schedule C. Penetration Testing & Vulnerability Disclosure",
        "bad_clause": "Vendor performs periodic internal vulnerability scans. External grey-box penetration testing and vulnerability disclosures to Customer are disclaimed as proprietary trade secrets.",
        "hazard_note": "Refuses to disclose external penetration test findings or remediation timelines, concealing zero-day risks.",
        "remediation": "Vendor shall deliver an annual executive summary of third-party penetration testing and commit to remediating Critical/High CVEs within 15 calendar days."
    }
]

BOILERPLATE_SECTIONS = [
    "1. Term and Termination. This Agreement commences on the Effective Date and continues for a period of twelve (12) months, renewing automatically unless terminated with 60 days written notice.",
    "2. Scope of Services. Vendor shall provide enterprise software platform access in accordance with published documentation and standard service level commitments.",
    "3. Intellectual Property. Each party retains all rights, title, and interest in and to its pre-existing intellectual property, trademarks, and proprietary software architecture.",
    "4. Confidentiality. Recipient agrees to hold Discloser's Proprietary Information in strict confidence using the same degree of care it uses for its own confidential assets, but not less than reasonable care.",
    "5. Governing Law. This Agreement shall be governed by and construed in accordance with the laws of India, and the courts in Bengaluru, Karnataka shall have exclusive jurisdiction."
]

def generate_synthetic_contract(vendor_name: str, domain_service: str):
    num_flaws = random.choices([1, 2, 3], weights=[0.3, 0.5, 0.2])[0]
    selected_flaws = random.sample(CLAUSE_TEMPLATES, num_flaws)
    
    sections = []
    sections.append(f"MASTER SERVICES AGREEMENT ({vendor_name.upper()})")
    sections.append(f"Counterparty: {vendor_name} | Scope: {domain_service}")
    sections.append(BOILERPLATE_SECTIONS[0])
    sections.append(BOILERPLATE_SECTIONS[1])
    
    ground_truth_flags = []
    
    for i, flaw in enumerate(selected_flaws):
        sections.append(f"{flaw['clause_title']}\n{flaw['bad_clause']}")
        ground_truth_flags.append({
            "category": flaw["category"],
            "severity": flaw["severity"],
            "section": flaw["clause_title"],
            "excerpt": flaw["bad_clause"],
            "hazardNote": flaw["hazard_note"],
            "recommendedRemediation": flaw["remediation"]
        })
        if i < len(BOILERPLATE_SECTIONS) - 2:
            sections.append(BOILERPLATE_SECTIONS[i + 2])
            
    raw_contract_text = "\n\n".join(sections)
    return raw_contract_text, ground_truth_flags

def generate_dataset(num_samples=150):
    dataset = []
    for i in range(num_samples):
        vendor_name, domain_service = random.choice(VENDORS)
        raw_text, ground_truth_flags = generate_synthetic_contract(vendor_name, domain_service)
        
        # Construct Chain of Thought
        cot_steps = []
        cot_steps.append("1. Reading contract sections for clause-level risk extraction.")
        for idx, f in enumerate(ground_truth_flags):
            cot_steps.append(f"2.{idx+1} Flagged [{f['category']} · {f['severity']}] in {f['section']}: Quoting exact text.")
            cot_steps.append(f"   -> Verbatim excerpt match confirmed against source text.")
            cot_steps.append(f"   -> Enforceable rider formulated for Razorpay risk mitigation.")
        
        think_block = "<think>\n" + "\n".join(cot_steps) + "\n</think>"
        
        risk_score = min(100, sum({"low": 15, "medium": 30, "high": 60, "critical": 90}.get(f["severity"], 40) for f in ground_truth_flags) // max(len(ground_truth_flags), 1))
        cro_rec = "Reject Counterparty" if risk_score >= 80 else "Require Escrow / Redlines" if risk_score >= 40 else "Approve"
        
        target_payload = {
            "vendorName": vendor_name,
            "documentTitle": f"Master Services Agreement ({vendor_name})",
            "overallComplianceSummary": f"Automated audit identified {len(ground_truth_flags)} compliance vulnerabilities across statutory liability, DPDP 2023, and subprocessor governance.",
            "riskScore": risk_score,
            "flags": ground_truth_flags,
            "croSignOffRecommendation": cro_rec
        }
        
        full_completion = f"{think_block}\n```json\n{json.dumps(target_payload, indent=2)}\n```"
        
        dataset.append({
            "id": f"risk-train-{i:04d}",
            "vendor": vendor_name,
            "prompt": f"You are the Red-Flag Contract Auditor Agent for Razorpay RiskOS (Track 2: AI Risk Manager).\nAudit the following contract:\n\n{raw_text}",
            "raw_contract": raw_text,
            "completion": full_completion,
            "ground_truth_flags": ground_truth_flags
        })
        
    return dataset

if __name__ == "__main__":
    print("Generating RiskAuditor-V1 dataset...")
    full_data = generate_dataset(200)
    
    # Split 75% train, 15% val, 10% test benchmark
    n = len(full_data)
    train_split = int(n * 0.75)
    val_split = int(n * 0.90)
    
    train_data = full_data[:train_split]
    val_data = full_data[train_split:val_split]
    test_data = full_data[val_split:]
    
    with open(f"{DATASET_DIR}/train.jsonl", "w") as f:
        for item in train_data:
            f.write(json.dumps(item) + "\n")
            
    with open(f"{DATASET_DIR}/val.jsonl", "w") as f:
        for item in val_data:
            f.write(json.dumps(item) + "\n")
            
    with open(f"{DATASET_DIR}/test_benchmark.jsonl", "w") as f:
        for item in test_data:
            f.write(json.dumps(item) + "\n")
            
    print(f"Dataset generated successfully in {DATASET_DIR}:")
    print(f"- Train: {len(train_data)} examples")
    print(f"- Validation: {len(val_data)} examples")
    print(f"- Benchmark Test: {len(test_data)} examples")
