const router = require('express').Router();
const auth   = require('../middleware/auth');
const ctrl   = require('../controllers/medicareController');

router.get('/prescriptions',  auth, ctrl.getPrescriptions);
router.post('/prescriptions', auth, ctrl.createPrescription);
router.post('/drug-check',    auth, ctrl.drugCheck);

module.exports = router;