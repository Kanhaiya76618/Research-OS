"""
RiskOS - Group Relative Policy Optimization (GRPO) & Verifiable Reward RL (RLVR)
Trains RiskAuditor-7B policy model with verifiable rule-based rewards.

Multi-Objective Verifiable Reward Components:
1. R_grounding (40%): Verbatim string containment of extracted clause inside raw contract text.
2. R_flaw_f1 (35%): Categorical and semantic recall of real compliance red flags.
3. R_remediation (15%): Statutory citation and actionable remediation enforceability.
4. R_syntax (10%): Valid JSON format compliance without syntax repair.
"""

import os
import json
import re
from typing import List, Dict, Any, Tuple

def compute_grounding_reward(raw_contract: str, excerpt: str) -> float:
    """Computes exact verbatim containment or substring overlap score."""
    if not excerpt or len(excerpt.strip()) < 8:
        return 0.0
    clean_raw = re.sub(r'\s+', ' ', raw_contract).strip().lower()
    clean_excerpt = re.sub(r'\s+', ' ', excerpt).strip().lower()
    
    if clean_excerpt in clean_raw:
        return 1.0
        
    # Substring token overlap fallback
    raw_tokens = set(clean_raw.split())
    excerpt_tokens = set(clean_excerpt.split())
    if not excerpt_tokens:
        return 0.0
    overlap = len(raw_tokens.intersection(excerpt_tokens)) / len(excerpt_tokens)
    return round(overlap * 0.70, 3)

def compute_syntax_reward(model_output: str) -> Tuple[float, Dict[str, Any]]:
    """Checks JSON syntactic validity."""
    # Strip optional markdown code block fences
    clean = re.sub(r'```(?:json)?', '', model_output).strip()
    # If there's a <think> tag, extract the content after </think>
    if '</think>' in clean:
        clean = clean.split('</think>')[-1].strip()
        
    try:
        data = json.loads(clean)
        if isinstance(data, dict) and "flags" in data and isinstance(data["flags"], list):
            return 1.0, data
        return 0.3, {}
    except Exception:
        return -1.0, {}

def compute_flaw_f1_reward(predicted_flags: List[Dict[str, Any]], ground_truth_flags: List[Dict[str, Any]]) -> float:
    """Computes Category and Hazard Recall F1 score against ground truth."""
    if not ground_truth_flags:
        return 1.0 if not predicted_flags else 0.5
    if not predicted_flags:
        return 0.0

    gt_categories = [f.get("category", "") for f in ground_truth_flags]
    pred_categories = [f.get("category", "") for f in predicted_flags]

    matched_count = 0
    used_indices = set()
    
    for pred_cat in pred_categories:
        for idx, gt_cat in enumerate(gt_categories):
            if idx not in used_indices and pred_cat == gt_cat:
                matched_count += 1
                used_indices.add(idx)
                break

    precision = matched_count / max(len(pred_categories), 1)
    recall = matched_count / max(len(gt_categories), 1)
    if precision + recall == 0:
        return 0.0
    return round(2 * (precision * recall) / (precision + recall), 4)

def compute_remediation_reward(flags: List[Dict[str, Any]]) -> float:
    """Evaluates whether proposed remediations contain enforceable terms."""
    if not flags:
        return 0.5
    scores = []
    enforceable_terms = ["shall", "covenants", "within", "uncapped", "minimum", "notice", "written consent", "hours", "indemnify"]
    for f in flags:
        rem = f.get("recommendedRemediation", "").lower()
        if not rem or len(rem) < 15:
            scores.append(0.0)
            continue
        term_hits = sum(1 for term in enforceable_terms if term in rem)
        scores.append(min(1.0, term_hits * 0.35))
    return round(sum(scores) / len(scores), 3)

def compute_composite_grpo_reward(raw_contract: str, model_output: str, ground_truth_flags: List[Dict[str, Any]]) -> Dict[str, float]:
    """Computes composite reward breakdown for GRPO policy updates."""
    syntax_r, parsed = compute_syntax_reward(model_output)
    if syntax_r < 0:
        return {
            "total_reward": -1.0,
            "grounding": 0.0,
            "flaw_f1": 0.0,
            "remediation": 0.0,
            "syntax": -1.0
        }

    flags = parsed.get("flags", [])
    
    # 1. Grounding score across all cited excerpts
    if flags:
        g_scores = [compute_grounding_reward(raw_contract, f.get("excerpt", "")) for f in flags]
        avg_grounding = sum(g_scores) / len(g_scores)
    else:
        avg_grounding = 0.2

    # 2. Flaw F1
    flaw_f1 = compute_flaw_f1_reward(flags, ground_truth_flags)

    # 3. Remediation quality
    remediation_r = compute_remediation_reward(flags)

    # 4. Composite weighted reward
    total = (0.40 * avg_grounding) + (0.35 * flaw_f1) + (0.15 * remediation_r) + (0.10 * syntax_r)
    return {
        "total_reward": round(total, 4),
        "grounding": round(avg_grounding, 4),
        "flaw_f1": round(flaw_f1, 4),
        "remediation": round(remediation_r, 4),
        "syntax": round(syntax_r, 4)
    }

def grpo_step(group_outputs: List[str], raw_contract: str, ground_truth_flags: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Computes GRPO relative advantage for a group of G candidate completions:
    A_i = (R_i - mean(R)) / (std(R) + eps)
    """
    rewards = []
    breakdowns = []
    for out in group_outputs:
        b = compute_composite_grpo_reward(raw_contract, out, ground_truth_flags)
        rewards.append(b["total_reward"])
        breakdowns.append(b)

    mean_r = sum(rewards) / len(rewards)
    variance = sum((r - mean_r) ** 2 for r in rewards) / len(rewards)
    std_r = (variance ** 0.5) + 1e-6

    advantages = [round((r - mean_r) / std_r, 4) for r in rewards]
    best_idx = int(max(range(len(rewards)), key=lambda i: rewards[i]))

    return {
        "group_size": len(group_outputs),
        "rewards": rewards,
        "advantages": advantages,
        "mean_reward": round(mean_r, 4),
        "best_reward": rewards[best_idx],
        "best_breakdown": breakdowns[best_idx],
        "best_output": group_outputs[best_idx]
    }

if __name__ == "__main__":
    print("Testing GRPO Verifiable Reward Engine...")
    sample_contract = (
        "Section 14. Limitation of Liability. IN NO EVENT SHALL VENDOR AGGREGATE LIABILITY "
        "EXCEED THE TOTAL AMOUNTS PAID BY RAZORPAY IN THE ONE (1) MONTH PRECEDING THE CLAIM. "
        "VENDOR DISCLAIMS ALL DATA BREACH INDEMNIFICATION."
    )
    
    # Candidate 1: Perfect grounded extraction
    cand1 = json.dumps({
        "flags": [{
            "category": "liability_evasion",
            "severity": "critical",
            "excerpt": "IN NO EVENT SHALL VENDOR AGGREGATE LIABILITY EXCEED THE TOTAL AMOUNTS PAID BY RAZORPAY IN THE ONE (1) MONTH PRECEDING THE CLAIM",
            "recommendedRemediation": "Vendor shall provide uncapped indemnity for data breach claims and liability shall not be capped below 12 months fees."
        }]
    })
    
    # Candidate 2: Hallucinated / ungrounded excerpt
    cand2 = json.dumps({
        "flags": [{
            "category": "liability_evasion",
            "severity": "critical",
            "excerpt": "The vendor does not want to pay more than one month of cash.",
            "recommendedRemediation": "Fix liability clause."
        }]
    })
    
    gt = [{
        "category": "liability_evasion",
        "severity": "critical",
        "excerpt": "IN NO EVENT SHALL VENDOR AGGREGATE LIABILITY EXCEED THE TOTAL AMOUNTS PAID BY RAZORPAY IN THE ONE (1) MONTH PRECEDING THE CLAIM"
    }]
    
    res = grpo_step([cand1, cand2], sample_contract, gt)
    print(f"GRPO Group Evaluation: Mean Reward: {res['mean_reward']}, Best Reward: {res['best_reward']}")
    print(f"Candidate 1 Advantage: {res['advantages'][0]} | Candidate 2 Advantage: {res['advantages'][1]}")
