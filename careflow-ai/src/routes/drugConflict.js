/**
 * Drug Conflict Detection Routes
 * Base: /api/ai/drugs
 */

const express = require('express');
const router  = express.Router();
const { checkDrugConflicts } = require('../services/drugConflictService');

/**
 * POST /api/ai/drugs/check
 *
 * Body: {
 *   newMedications:      ["Warfarin", "Aspirin"],
 *   existingMedications: ["Metformin", "Lisinopril"]
 * }
 *
 * Response: {
 *   safe: false,
 *   conflicts: [{ drug1, drug2, severity, effect, suggestion }],
 *   warnings: [...],
 *   recommendation: "..."
 * }
 */
router.post('/check', (req, res) => {
  try {
    const { newMedications, existingMedications } = req.body;

    if (!newMedications || !Array.isArray(newMedications) || newMedications.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'newMedications array is required'
      });
    }

    const existing = existingMedications || [];
    const result   = checkDrugConflicts(newMedications, existing);

    res.json({
      success: true,
      input: {
        newMedications,
        existingMedications: existing
      },
      result
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/ai/drugs/test
 * Quick test showing critical, major, and safe scenarios.
 */
router.get('/test', (req, res) => {
  const tests = [
    {
      label: 'CRITICAL - Warfarin + Aspirin',
      newMedications: ['Warfarin'],
      existingMedications: ['Aspirin']
    },
    {
      label: 'MAJOR - Methotrexate + Ibuprofen (Cancer patient)',
      newMedications: ['Ibuprofen'],
      existingMedications: ['Methotrexate']
    },
    {
      label: 'SAFE - Paracetamol + Amoxicillin',
      newMedications: ['Paracetamol'],
      existingMedications: ['Amoxicillin']
    }
  ];

  const results = tests.map(t => ({
    label:  t.label,
    result: checkDrugConflicts(t.newMedications, t.existingMedications)
  }));

  res.json({ success: true, tests: results });
});

module.exports = router;
