const Appointment = require('../models/Appointment');
const Emergency   = require('../models/Emergency');
const Admission   = require('../models/Admission');
const Prescription= require('../models/Prescription');

exports.createAppointment = async (req, res) => {
  console.log('📥 POST /api/patient/appointments');
  console.log('👤 Patient ID:', req.user.id);
  console.log('📋 Data received:', req.body);

  try {
    const appt = await Appointment.create({
      ...req.body,
      patientId: req.user.id,
    });

    console.log('✅ Appointment saved to DB:', appt.id);
    res.status(201).json(appt);
  } catch (err) {
    console.log('❌ Error saving appointment:', err.message);
    res.status(400).json({ error: err.message });
  }
};

exports.getAppointments = async (req, res) => {
  console.log('📥 GET /api/patient/appointments');
  console.log('👤 Patient ID:', req.user.id);

  try {
    const appts = await Appointment.findAll({
      where: { patientId: req.user.id },
      order: [['createdAt', 'DESC']],
    });

    console.log(`✅ Found ${appts.length} appointments for patient`);
    res.json(appts);
  } catch (err) {
    console.log('❌ Error fetching appointments:', err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.createEmergency = async (req, res) => {
  console.log('🚨 POST /api/patient/emergency');
  console.log('👤 Patient ID:', req.user.id);
  console.log('📋 Data received:', req.body);

  try {
    const emg = await Emergency.create({
      ...req.body,
      patientId: req.user.id,
    });

    console.log('✅ Emergency saved to DB:', emg.id);
    req.io.emit('emergency:new', emg);
    console.log('📡 Socket event emitted: emergency:new');
    res.status(201).json(emg);
  } catch (err) {
    console.log('❌ Error saving emergency:', err.message);
    res.status(400).json({ error: err.message });
  }
};

exports.getAdmissions = async (req, res) => {
  console.log('📥 GET /api/patient/admission');
  console.log('👤 Patient ID:', req.user.id);

  const records = await Admission.findAll({
    where: { patientId: req.user.id },
  });

  console.log(`✅ Found ${records.length} admissions`);
  res.json(records);
};

exports.getHistory = async (req, res) => {
  console.log('📥 GET /api/patient/history');
  console.log('👤 Patient ID:', req.user.id);

  const [appts, admissions, prescriptions] = await Promise.all([
    Appointment.findAll({ where: { patientId: req.user.id } }),
    Admission.findAll({   where: { patientId: req.user.id } }),
    Prescription.findAll({ where: { patientId: req.user.id } }),
  ]);

  console.log(`✅ History fetched — appts: ${appts.length}, admissions: ${admissions.length}, prescriptions: ${prescriptions.length}`);
  res.json({ appts, admissions, prescriptions });
};