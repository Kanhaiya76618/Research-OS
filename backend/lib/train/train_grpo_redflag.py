"""
RiskOS - Verifiable-Reward Reinforcement Learning (GRPO) Training Script
Purpose: Train a specialized open-weights model (e.g. Qwen-2.5-7B-Instruct or Llama-3.1-8B)
to perform precise contract red-flag detection with grounded verbatim clause extractions.

Reward Functions:
1. Grounding Reward (R_grounding): Verifiable string containment of the extracted excerpt inside the raw contract text.
2. Flaw Recall F1 (R_f1): Semantic & category alignment against ground-truth compliance hazards.
3. Strict Syntax Reward (R_syntax): Enforces valid JSON without sentinel repair.
"""

import json
import re
from typing import List, Dict, Any

def compute_grounding_reward(raw_contract: str, excerpt: str) -> float:
    """Verifies that the quoted excerpt is a substring of the raw contract text."""
    if not excerpt or len(excerpt.strip()) < 10:
        return 0.0
    clean_raw = re.sub(r'\s+', ' ', raw_contract).strip().lower()
    clean_excerpt = re.sub(r'\s+', ' ', excerpt).strip().lower()
    if clean_excerpt in clean_raw:
        return 1.0
    # Partial token overlap fallback
    raw_tokens = set(clean_raw.split())
    excerpt_tokens = set(clean_excerpt.split())
    overlap = len(raw_tokens.intersection(excerpt_tokens)) / max(len(excerpt_tokens), 1)
    return round(overlap * 0.75, 3)

def compute_syntax_reward(model_output: str) -> tuple[float, Dict[str, Any]]:
    """Checks strict JSON format conformance."""
    clean_text = re.sub(r'^\s*```(?:json)?\s*', '', model_output, flags=re.IGNORECASE)
    clean_text = re.sub(r'\s*```\s*$', '', clean_text).strip()
    try:
        parsed = json.loads(clean_text)
        if isinstance(parsed, dict) and "flags" in parsed and isinstance(parsed["flags"], list):
            return 1.0, parsed
        return 0.2, {}
    except Exception:
        return -1.0, {}

def compute_composite_reward(prompt: str, raw_contract: str, model_output: str, ground_truth_flaws: List[str]) -> float:
    syntax_r, parsed = compute_syntax_reward(model_output)
    if syntax_r < 0:
        return -1.0

    flags = parsed.get("flags", [])
    if not flags:
        return 0.1

    # Evaluate Grounding
    grounding_scores = [compute_grounding_reward(raw_contract, f.get("excerpt", "")) for f in flags]
    avg_grounding = sum(grounding_scores) / max(len(grounding_scores), 1)

    # Evaluate F1 against planted ground-truth hazards
    detected_notes = [f.get("hazardNote", "").lower() for f in flags]
    caught_count = 0
    for gt in ground_truth_flaws:
        gt_tokens = set(gt.lower().split())
        for note in detected_notes:
            note_tokens = set(note.split())
            if len(gt_tokens.intersection(note_tokens)) / max(len(gt_tokens), 1) >= 0.4:
                caught_count += 1
                break

    recall = caught_count / max(len(ground_truth_flaws), 1)
    precision = caught_count / max(len(flags), 1)
    f1 = 2 * (precision * recall) / max((precision + recall), 1e-5)

    # Composite GRPO reward: 40% Grounding + 50% F1 Recall + 10% Syntax
    r_total = 0.4 * avg_grounding + 0.5 * f1 + 0.1 * syntax_r
    return round(r_total, 4)

if __name__ == "__main__":
    print("RiskOS Verifiable Reward Engine initialized.")
    sample_contract = (
        "Section 14. Limitation of Liability. IN NO EVENT SHALL VENDOR AGGREGATE LIABILITY "
        "EXCEED THE TOTAL AMOUNTS PAID BY RAZORPAY IN THE ONE (1) MONTH PRECEDING THE CLAIM. "
        "VENDOR DISCLAIMS ALL DIRECT, INDIRECT, AND DATA BREACH INDEMNIFICATION."
    )
    sample_response = json.dumps({
        "vendorName": "Sample Vendor",
        "flags": [{
            "category": "liability_evasion",
            "severity": "critical",
            "excerpt": "IN NO EVENT SHALL VENDOR AGGREGATE LIABILITY EXCEED THE TOTAL AMOUNTS PAID BY RAZORPAY IN THE ONE (1) MONTH PRECEDING THE CLAIM",
            "hazardNote": "One month fee cap severely limits recovery in data breach scenarios",
            "recommendedRemediation": "Set aggregate cap to minimum 12 months fees with uncapped breach indemnity"
        }]
    })
    reward = compute_composite_reward("", sample_contract, sample_response, ["One month fee liability cap"])
    print(f"Sample Model Output Reward: {reward} / 1.0")
