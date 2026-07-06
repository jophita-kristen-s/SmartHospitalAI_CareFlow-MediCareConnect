/**
 * ─────────────────────────────────────────────────────
 *  drugConflictService.js
 *  Detects dangerous drug-drug interactions.
 *
 *  Uses a local interaction database + severity scoring.
 *  Severity Levels:
 *    CRITICAL  - Life-threatening, do NOT prescribe
 *    MAJOR     - Risk of serious harm, seek alternative
 *    MODERATE  - Monitor closely, dose adjustment needed
 *    MINOR     - Mild effect, usually manageable
 * ─────────────────────────────────────────────────────
 */

/**
 * Check new medication(s) against existing medications for conflicts.
 *
 * @param {Array} newMeds      - ["Warfarin", "Aspirin"]
 * @param {Array} existingMeds - ["Metformin", "Lisinopril"]
 * @returns {Object}           - { safe, conflicts[], warnings[], recommendation }
 */
function checkDrugConflicts(newMeds, existingMeds) {
  const conflicts  = [];
  const warnings   = [];

  const allNewNorm = newMeds.map(normalizeDrug);
  const allExistNorm = existingMeds.map(normalizeDrug);

  // ── Check each new drug against each existing drug ─────────────────────────
  for (const newDrug of allNewNorm) {
    for (const existingDrug of allExistNorm) {
      const interaction = findInteraction(newDrug, existingDrug);
      if (interaction) {
        const entry = {
          drug1:       capitalize(newDrug),
          drug2:       capitalize(existingDrug),
          severity:    interaction.severity,
          effect:      interaction.effect,
          mechanism:   interaction.mechanism || '',
          suggestion:  interaction.suggestion || 'Consult physician before prescribing'
        };

        if (['CRITICAL', 'MAJOR'].includes(interaction.severity)) {
          conflicts.push(entry);
        } else {
          warnings.push(entry);
        }
      }
    }

    // ── Check new drug against other new drugs too ───────────────────────────
    for (const otherNew of allNewNorm) {
      if (otherNew !== newDrug) {
        const interaction = findInteraction(newDrug, otherNew);
        if (interaction && !alreadyFound(conflicts, warnings, newDrug, otherNew)) {
          const entry = {
            drug1:      capitalize(newDrug),
            drug2:      capitalize(otherNew),
            severity:   interaction.severity,
            effect:     interaction.effect,
            mechanism:  interaction.mechanism || '',
            suggestion: interaction.suggestion || 'Consult physician before prescribing'
          };
          if (['CRITICAL', 'MAJOR'].includes(interaction.severity)) {
            conflicts.push(entry);
          } else {
            warnings.push(entry);
          }
        }
      }
    }
  }

  const safe = conflicts.length === 0;

  return {
    safe,
    conflictCount: conflicts.length,
    warningCount:  warnings.length,
    conflicts,
    warnings,
    recommendation: buildRecommendation(safe, conflicts, warnings),
    checkedAt: new Date().toISOString()
  };
}

/**
 * Find interaction between two drugs in the database.
 * Checks both directions (A-B and B-A).
 */
function findInteraction(drugA, drugB) {
  const key1 = `${drugA}|${drugB}`;
  const key2 = `${drugB}|${drugA}`;
  return INTERACTION_DB[key1] || INTERACTION_DB[key2] || null;
}

function alreadyFound(conflicts, warnings, a, b) {
  const all = [...conflicts, ...warnings];
  return all.some(
    c => (c.drug1.toLowerCase() === a && c.drug2.toLowerCase() === b) ||
         (c.drug1.toLowerCase() === b && c.drug2.toLowerCase() === a)
  );
}

function normalizeDrug(name) {
  return name.toLowerCase().trim().replace(/\s+/g, '_');
}

function capitalize(name) {
  return name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function buildRecommendation(safe, conflicts, warnings) {
  if (conflicts.length > 0) {
    const critical = conflicts.filter(c => c.severity === 'CRITICAL');
    if (critical.length > 0) {
      return `⛔ DO NOT PRESCRIBE — ${critical.length} life-threatening interaction(s) detected. Immediate physician review required.`;
    }
    return `⚠️ MAJOR interactions detected. Physician must review and approve before dispensing.`;
  }
  if (warnings.length > 0) {
    return `🔔 ${warnings.length} moderate/minor interaction(s). Monitor patient closely. Dose adjustment may be required.`;
  }
  return '✅ No known interactions detected. Safe to prescribe.';
}

// ─────────────────────────────────────────────────────────────────────────────
//  DRUG INTERACTION DATABASE
//  Format: "drug_a|drug_b": { severity, effect, mechanism, suggestion }
//
//  Common Indian hospital drugs included.
//  Expand this object with more entries as needed.
// ─────────────────────────────────────────────────────────────────────────────
const INTERACTION_DB = {
  // ── BLOOD THINNERS ──────────────────────────────────────────────────────────
  'warfarin|aspirin': {
    severity: 'CRITICAL',
    effect: 'Greatly increased bleeding risk — can be life-threatening',
    mechanism: 'Both inhibit clotting; additive anticoagulant effect',
    suggestion: 'Avoid combination. If necessary, use minimal aspirin dose with close INR monitoring.'
  },
  'warfarin|ibuprofen': {
    severity: 'MAJOR',
    effect: 'Increased bleeding risk and GI ulceration',
    mechanism: 'NSAIDs displace warfarin from protein binding and inhibit platelet aggregation',
    suggestion: 'Use paracetamol for pain relief instead of ibuprofen.'
  },
  'warfarin|metronidazole': {
    severity: 'MAJOR',
    effect: 'Significantly elevated warfarin effect causing bleeding',
    mechanism: 'Metronidazole inhibits CYP2C9 enzyme that metabolizes warfarin',
    suggestion: 'Reduce warfarin dose and monitor INR closely.'
  },
  'warfarin|ciprofloxacin': {
    severity: 'MAJOR',
    effect: 'Enhanced anticoagulant effect, bleeding risk',
    mechanism: 'Ciprofloxacin inhibits warfarin metabolism',
    suggestion: 'Monitor INR closely; reduce warfarin dose if needed.'
  },

  // ── DIABETES MEDICATIONS ────────────────────────────────────────────────────
  'metformin|contrast_dye': {
    severity: 'MAJOR',
    effect: 'Risk of lactic acidosis',
    mechanism: 'Iodinated contrast media can reduce renal function, causing metformin accumulation',
    suggestion: 'Stop metformin 48h before and after contrast procedure.'
  },
  'metformin|alcohol': {
    severity: 'MAJOR',
    effect: 'Increased risk of lactic acidosis and hypoglycemia',
    suggestion: 'Advise patient to avoid alcohol.'
  },
  'glipizide|fluconazole': {
    severity: 'MAJOR',
    effect: 'Severe hypoglycemia',
    mechanism: 'Fluconazole inhibits CYP2C9, increasing glipizide levels',
    suggestion: 'Monitor blood glucose closely; reduce glipizide dose.'
  },
  'insulin|alcohol': {
    severity: 'MAJOR',
    effect: 'Severe unpredictable hypoglycemia',
    suggestion: 'Advise strict avoidance of alcohol.'
  },

  // ── HEART / BP MEDICATIONS ──────────────────────────────────────────────────
  'amlodipine|simvastatin': {
    severity: 'MODERATE',
    effect: 'Increased simvastatin levels — muscle damage risk (myopathy)',
    mechanism: 'Amlodipine inhibits CYP3A4 metabolism of simvastatin',
    suggestion: 'Limit simvastatin dose to 20mg/day. Consider switching to rosuvastatin.'
  },
  'lisinopril|potassium': {
    severity: 'MAJOR',
    effect: 'Dangerous hyperkalemia (high potassium) — cardiac arrhythmia risk',
    mechanism: 'ACE inhibitors reduce potassium excretion',
    suggestion: 'Avoid potassium supplements. Monitor serum potassium levels.'
  },
  'lisinopril|spironolactone': {
    severity: 'MAJOR',
    effect: 'Hyperkalemia risk',
    suggestion: 'Only use together under close monitoring of potassium levels.'
  },
  'digoxin|amiodarone': {
    severity: 'MAJOR',
    effect: 'Digoxin toxicity — nausea, arrhythmias, visual disturbances',
    mechanism: 'Amiodarone raises digoxin levels by 70-100%',
    suggestion: 'Reduce digoxin dose by 50% when starting amiodarone. Monitor levels.'
  },
  'atenolol|verapamil': {
    severity: 'CRITICAL',
    effect: 'Complete heart block and cardiac arrest possible',
    mechanism: 'Combined negative chronotropic and dromotropic effects',
    suggestion: 'Contraindicated. Use alternative antihypertensive.'
  },

  // ── ANTIBIOTICS ─────────────────────────────────────────────────────────────
  'ciprofloxacin|antacid': {
    severity: 'MODERATE',
    effect: 'Reduced ciprofloxacin absorption',
    mechanism: 'Antacids chelate ciprofloxacin in GI tract',
    suggestion: 'Take ciprofloxacin 2 hours before or 6 hours after antacids.'
  },
  'azithromycin|amiodarone': {
    severity: 'MAJOR',
    effect: 'Dangerous QT prolongation — fatal arrhythmia risk',
    suggestion: 'Avoid combination. Use alternative antibiotic.'
  },

  // ── PAIN MEDICATIONS ────────────────────────────────────────────────────────
  'tramadol|ssri': {
    severity: 'MAJOR',
    effect: 'Serotonin syndrome — fever, agitation, seizures',
    mechanism: 'Both increase serotonergic activity',
    suggestion: 'Avoid combination. Use alternative pain management.'
  },
  'tramadol|antidepressant': {
    severity: 'MAJOR',
    effect: 'Serotonin syndrome risk',
    suggestion: 'Use with caution; monitor for serotonin syndrome symptoms.'
  },
  'aspirin|ibuprofen': {
    severity: 'MODERATE',
    effect: 'Ibuprofen may block aspirin\'s cardioprotective effect',
    suggestion: 'Take aspirin at least 30 min before ibuprofen.'
  },
  'paracetamol|alcohol': {
    severity: 'MAJOR',
    effect: 'Severe hepatotoxicity (liver damage)',
    mechanism: 'Alcohol induces CYP2E1, increasing toxic metabolite of paracetamol',
    suggestion: 'Strictly avoid alcohol with paracetamol.'
  },

  // ── PSYCHIATRIC MEDICATIONS ─────────────────────────────────────────────────
  'fluoxetine|maoi': {
    severity: 'CRITICAL',
    effect: 'Serotonin syndrome — can be fatal',
    mechanism: 'Combined serotonergic effect is overwhelming',
    suggestion: 'Contraindicated. Wait 14 days after stopping MAOI before starting fluoxetine.'
  },
  'lithium|ibuprofen': {
    severity: 'MAJOR',
    effect: 'Lithium toxicity — tremors, confusion, renal failure',
    mechanism: 'NSAIDs reduce renal lithium clearance',
    suggestion: 'Avoid NSAIDs. Use paracetamol for pain.'
  },

  // ── BLOOD PRESSURE (COMMON IN INDIA) ────────────────────────────────────────
  'telmisartan|potassium_supplement': {
    severity: 'MAJOR',
    effect: 'Hyperkalemia',
    suggestion: 'Monitor serum potassium. Avoid potassium supplements.'
  },
  'ramipril|nsaid': {
    severity: 'MAJOR',
    effect: 'Reduced antihypertensive effect and renal impairment',
    suggestion: 'Avoid NSAIDs. Use paracetamol for pain relief.'
  },

  // ── ONCOLOGY (COMMON FOR CANCER PATIENTS) ───────────────────────────────────
  'methotrexate|aspirin': {
    severity: 'CRITICAL',
    effect: 'Methotrexate toxicity — bone marrow suppression, mucositis',
    mechanism: 'Aspirin reduces renal clearance of methotrexate',
    suggestion: 'Contraindicated. Do not use together.'
  },
  'methotrexate|ibuprofen': {
    severity: 'CRITICAL',
    effect: 'Severe methotrexate toxicity',
    suggestion: 'Absolutely contraindicated.'
  },
  'methotrexate|co_trimoxazole': {
    severity: 'CRITICAL',
    effect: 'Severe bone marrow suppression',
    mechanism: 'Additive antifolate effects',
    suggestion: 'Contraindicated. Use alternative antibiotic.'
  }
};

module.exports = { checkDrugConflicts, INTERACTION_DB };
