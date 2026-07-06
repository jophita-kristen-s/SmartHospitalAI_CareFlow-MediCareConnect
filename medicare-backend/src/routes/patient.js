//const router = require('express').Router();
//const auth   = require('../middleware/auth');
//const ctrl   = require('../controllers/patientController');

//router.get('/appointments',  auth, ctrl.getAppointments);
//router.post('/appointments', auth, ctrl.createAppointment);
//router.post('/emergency',    auth, ctrl.createEmergency);
//router.get('/admission',     auth, ctrl.getAdmissions);
//router.get('/history',       auth, ctrl.getHistory);

//module.exports = router;

const router = require('express').Router();
const auth   = require('../middleware/auth');
const ctrl   = require('../controllers/patientController');

router.get('/appointments',  auth, ctrl.getAppointments);
router.post('/appointments', auth, ctrl.createAppointment);

module.exports = router;