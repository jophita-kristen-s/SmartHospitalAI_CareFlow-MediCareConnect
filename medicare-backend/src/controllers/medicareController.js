const Prescription = require('../models/Prescription');

// A simple in-memory drug interaction check (expand with real DB)
const DANGEROUS_COMBOS = [
  ['warfarin', 'aspirin'],
  ['metformin', 'alcohol'],
];

exports.getPrescriptions = async (req, res) => {
  const list = await Prescription.findAll({ where: { patientId: req.user.id } });
  res.json(list);
};

exports.createPrescription = async (req, res) => {
  const pres = await Prescription.create({ ...req.body, doctorId: req.user.id });
  res.status(201).json(pres);
};

exports.drugCheck = (req, res) => {
  const { drugs } = req.body; // ['warfarin', 'aspirin']
  const names = drugs.map(d => d.toLowerCase());
  const warnings = DANGEROUS_COMBOS.filter(
    combo => combo.every(drug => names.includes(drug))
  );
  res.json({ safe: warnings.length === 0, warnings });
};