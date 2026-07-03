const router = require('express').Router();
const verifyToken = require('../middleware/auth');
const applicationController = require('../controllers/applicationController');

router.get('/', verifyToken, applicationController.getApplications);
router.post('/', verifyToken, applicationController.addApplication);
router.put('/:id', verifyToken, applicationController.updateApplication);
router.delete('/:id', verifyToken, applicationController.deleteApplication);

module.exports = router;