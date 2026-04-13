const express = require('express');
const router = express.Router();
const HealthController = require('../controllers/HealthController');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

router.post('/entries', HealthController.createEntry);
router.get('/entries', HealthController.getEntries);
router.get('/entries/:date', HealthController.getEntry);
router.put('/entries/:date', HealthController.updateEntry);
router.delete('/entries/:id', HealthController.deleteEntry);

router.get('/stats', HealthController.getStats);
router.get('/export', HealthController.exportData);
router.delete('/data', HealthController.deleteAllData);

module.exports = router;