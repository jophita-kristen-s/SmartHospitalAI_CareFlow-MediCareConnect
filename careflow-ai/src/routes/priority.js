/**
 * Priority Scoring Routes
 * Base: /api/ai/priority
 */

const express = require('express');
const router  = express.Router();
const { computePriorityScore } = require('../services/priorityService');

/**
 * POST /api/ai/priority/score
 *
 * Body: {
 *   condition: "cardiac_arrest",
 *   conditionType: "emergency",
 *   isEmergency: true,
 *   age: 65,
 *   waitingMinutes: 0,
 *   vitalSigns: {
 *     heartRate: 130,
 *     bloodPressureSystolic: 90,
 *     oxygenSat: 88,
 *     temperature: 38.5
 *   }
 * }
 */
router.post('/score', (req, res) => {
  try {
    const patient = req.body;

    if (!patient.condition) {
      return res.status(400).json({
        success: false,
        error: 'condition is required'
      });
    }

    const result = computePriorityScore(patient);

    res.json({
      success: true,
      patient: {
        condition:    patient.condition,
        age:          patient.age,
        isEmergency:  patient.isEmergency
      },
      priority: result
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/ai/priority/batch
 * Score multiple patients at once — for queue ordering.
 *
 * Body: { patients: [{ id, ...patientFields }] }
 * Returns: patients sorted by priority score (highest first)
 */
router.post('/batch', (req, res) => {
  try {
    const { patients } = req.body;

    if (!patients || !Array.isArray(patients)) {
      return res.status(400).json({ success: false, error: 'patients array required' });
    }

    const scored = patients.map(p => ({
      id:       p.id,
      name:     p.name,
      priority: computePriorityScore(p)
    }));

    // Sort highest priority first
    scored.sort((a, b) => b.priority.score - a.priority.score);

    res.json({
      success: true,
      count: scored.length,
      queue: scored
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/ai/priority/test
 */
router.get('/test', (req, res) => {
  const testCases = [
    {
      label: 'Cardiac Arrest Patient',
      input: { condition: 'cardiac_arrest', conditionType: 'emergency', isEmergency: true, age: 60,
               vitalSigns: { heartRate: 140, oxygenSat: 85, bloodPressureSystolic: 80 } }
    },
    {
      label: 'Cancer Stage 3 Patient',
      input: { condition: 'cancer_stage3', conditionType: 'cancer', isEmergency: false, age: 45 }
    },
    {
      label: 'Routine Checkup',
      input: { condition: 'fever', conditionType: 'general', isEmergency: false, age: 30,
               vitalSigns: { temperature: 38.2 } }
    }
  ];

  const results = testCases.map(tc => ({
    label:    tc.label,
    priority: computePriorityScore(tc.input)
  }));

  res.json({ success: true, tests: results });
});

module.exports = router;
