const router = require('express').Router();
const auth   = require('../middleware/auth');
const ctrl   = require('../controllers/hospitalController');

router.get('/:hospitalId/beds',          auth, ctrl.getBeds);
router.get('/:hospitalId/queue',         auth, ctrl.getQueue);
router.patch('/emergency/:id/respond',   auth, ctrl.respondEmergency);

module.exports = router;