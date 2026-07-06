/**
 * ─────────────────────────────────────────────────────
 *  priorityService.js
 *  Assigns patient priority scores for queue management.
 *
 *  Priority Tiers:
 *   P1 - CRITICAL   (score 90-100) → Immediate
 *   P2 - HIGH       (score 70-89)  → Within 15 min
 *   P3 - MEDIUM     (score 40-69)  → Within 1 hour
 *   P4 - LOW        (score 0-39)   → Normal queue
 * ─────────────────────────────────────────────────────
 */

/**
 * Compute full priority score for a patient.
 *
 * @param {Object} patient - {
 *   condition,        // "cardiac_arrest" | "cancer_stage3" | "fever" etc.
 *   isEmergency,      // boolean
 *   vitalSigns,       // { heartRate, bloodPressure, oxygenSat, temperature }
 *   age,              // number
 *   conditionType,    // "cancer" | "emergency" | "chronic" | "general"
 *   waitingMinutes,   // how long already waiting
 * }
 * @returns {Object} - { score, tier, label, color, estimatedWait, reasoning }
 */
function computePriorityScore(patient) {
  let score = 0;
  const reasons = [];

  // ── 1. Base score from condition type ──────────────────────────────────────
  const conditionBase = getConditionBaseScore(patient.condition, patient.conditionType);
  score += conditionBase.score;
  reasons.push(conditionBase.reason);

  // ── 2. Emergency flag ──────────────────────────────────────────────────────
  if (patient.isEmergency) {
    score += 30;
    reasons.push('🚨 Emergency flag +30');
  }

  // ── 3. Vital signs scoring ─────────────────────────────────────────────────
  if (patient.vitalSigns) {
    const vitalScore = scoreVitals(patient.vitalSigns);
    score += vitalScore.score;
    if (vitalScore.score > 0) reasons.push(vitalScore.reason);
  }

  // ── 4. Age adjustments ─────────────────────────────────────────────────────
  if (patient.age) {
    if (patient.age < 5) {
      score += 10;
      reasons.push('👶 Infant (<5 yrs) +10');
    } else if (patient.age > 70) {
      score += 8;
      reasons.push('👴 Senior (>70 yrs) +8');
    }
  }

  // ── 5. Wait time penalty (fairness) ───────────────────────────────────────
  if (patient.waitingMinutes && patient.waitingMinutes > 60) {
    const bonus = Math.min(10, Math.floor(patient.waitingMinutes / 30));
    score += bonus;
    if (bonus > 0) reasons.push(`⏳ Long wait bonus +${bonus}`);
  }

  // ── Clamp to 0–100 ─────────────────────────────────────────────────────────
  score = Math.min(100, Math.max(0, Math.round(score)));

  // ── Determine tier ─────────────────────────────────────────────────────────
  const tier = getTier(score);

  return {
    score,
    tier:          tier.code,
    label:         tier.label,
    color:         tier.color,
    badge:         tier.badge,
    estimatedWait: tier.estimatedWait,
    reasoning:     reasons
  };
}

/**
 * Get base score for medical condition.
 */
function getConditionBaseScore(condition = '', conditionType = '') {
  const c = condition.toLowerCase();
  const t = conditionType.toLowerCase();

  // Life-threatening emergencies
  if (['cardiac_arrest', 'heart_attack', 'stroke', 'choking', 'drowning', 'anaphylaxis'].includes(c)) {
    return { score: 60, reason: `🔴 Life-threatening: ${condition} +60` };
  }

  // Cancer emergencies
  if (t === 'cancer' || c.includes('cancer') || c.includes('oncology') || c.includes('tumor')) {
    if (c.includes('stage4') || c.includes('stage 4') || c.includes('critical')) {
      return { score: 55, reason: '🎗️ Cancer Stage 4 Critical +55' };
    }
    if (c.includes('stage3') || c.includes('stage 3')) {
      return { score: 45, reason: '🎗️ Cancer Stage 3 +45' };
    }
    return { score: 40, reason: '🎗️ Cancer patient +40' };
  }

  // Accidents and trauma
  if (['accident', 'trauma', 'fracture', 'burns', 'hemorrhage', 'bleeding'].includes(c)) {
    return { score: 50, reason: `🟠 Trauma/Accident: ${condition} +50` };
  }

  // Respiratory
  if (['breathing_difficulty', 'asthma_attack', 'pneumonia'].includes(c)) {
    return { score: 45, reason: `🟠 Respiratory: ${condition} +45` };
  }

  // Moderate conditions
  if (['high_fever', 'severe_pain', 'appendicitis', 'kidney_stones'].includes(c)) {
    return { score: 30, reason: `🟡 Moderate: ${condition} +30` };
  }

  // General / routine
  return { score: 10, reason: `🟢 General visit: ${condition} +10` };
}

/**
 * Score vital signs for priority boost.
 */
function scoreVitals(vitals) {
  let score = 0;
  const flags = [];

  // Oxygen saturation
  if (vitals.oxygenSat !== undefined) {
    if (vitals.oxygenSat < 90)       { score += 20; flags.push('⚠️ SpO2 critical <90%'); }
    else if (vitals.oxygenSat < 94)  { score += 10; flags.push('⚠️ SpO2 low <94%'); }
  }

  // Heart rate
  if (vitals.heartRate !== undefined) {
    if (vitals.heartRate > 150 || vitals.heartRate < 40) {
      score += 15; flags.push('⚠️ Heart rate critical');
    } else if (vitals.heartRate > 120 || vitals.heartRate < 55) {
      score += 8; flags.push('⚠️ Heart rate abnormal');
    }
  }

  // Blood pressure (systolic)
  if (vitals.bloodPressureSystolic !== undefined) {
    const sys = vitals.bloodPressureSystolic;
    if (sys > 180 || sys < 80) { score += 15; flags.push('⚠️ BP critical'); }
    else if (sys > 160 || sys < 90) { score += 7; flags.push('⚠️ BP abnormal'); }
  }

  // Temperature (°C)
  if (vitals.temperature !== undefined) {
    if (vitals.temperature > 40 || vitals.temperature < 35) {
      score += 10; flags.push('⚠️ Temperature critical');
    }
  }

  return {
    score,
    reason: flags.length > 0 ? flags.join(', ') : ''
  };
}

/**
 * Map score to priority tier.
 */
function getTier(score) {
  if (score >= 90) return {
    code: 'P1', label: 'CRITICAL',  color: '#FF0000',
    badge: '🔴 P1', estimatedWait: 'Immediate'
  };
  if (score >= 70) return {
    code: 'P2', label: 'HIGH',      color: '#FF6600',
    badge: '🟠 P2', estimatedWait: 'Within 15 minutes'
  };
  if (score >= 40) return {
    code: 'P3', label: 'MEDIUM',    color: '#FFB300',
    badge: '🟡 P3', estimatedWait: 'Within 1 hour'
  };
  return {
    code: 'P4', label: 'LOW',       color: '#4CAF50',
    badge: '🟢 P4', estimatedWait: 'Normal queue'
  };
}

module.exports = { computePriorityScore, getTier };
