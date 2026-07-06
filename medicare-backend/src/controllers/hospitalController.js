const Bed         = require('../models/Bed');
const Emergency   = require('../models/Emergency');
const Appointment = require('../models/Appointment');
const User        = require('../models/User');

exports.getBeds = async (req, res) => {
  console.log('📥 GET /api/hospital/:hospitalId/beds');
  console.log('🏥 Hospital ID:', req.params.hospitalId);

  const beds = await Bed.findAll({
    where: { hospitalId: req.params.hospitalId },
  });

  console.log(`✅ Found ${beds.length} beds`);
  res.json(beds);
};

exports.getQueue = async (req, res) => {
  console.log('📥 GET /api/hospital/:hospitalId/queue');
  console.log('🏥 Hospital ID:', req.params.hospitalId);

  try {
    const appointments = await Appointment.findAll({
      order: [['createdAt', 'DESC']],
    });

    console.log(`✅ Found ${appointments.length} appointments in queue`);

    const result = await Promise.all(
      appointments.map(async (appt) => {
        const patient = await User.findByPk(appt.patientId, {
          attributes: ['id', 'name', 'email', 'phone'],
        });
        console.log(`   👤 Patient: ${patient?.name} | Date: ${appt.scheduledAt} | Status: ${appt.status}`);
        return { ...appt.toJSON(), patient };
      })
    );

    res.json(result);
  } catch (err) {
    console.log('❌ Error fetching queue:', err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.respondEmergency = async (req, res) => {
  console.log('📥 PATCH /api/hospital/emergency/:id/respond');
  console.log('🚨 Emergency ID:', req.params.id);

  const emg = await Emergency.findByPk(req.params.id);
  if (!emg) {
    console.log('❌ Emergency not found');
    return res.status(404).json({ message: 'Not found' });
  }

  await emg.update({ status: 'responding' });
  console.log('✅ Emergency status updated to: responding');

  req.io.emit('emergency:update', emg);
  console.log('📡 Socket event emitted: emergency:update');
  res.json(emg);
};