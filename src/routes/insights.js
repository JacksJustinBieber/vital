const express = require('express');
const router = express.Router();
const InsightController = require('../controllers/InsightController');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', InsightController.getInsights);
router.get('/:id', InsightController.getInsight);
router.put('/:id/read', InsightController.markAsRead);
router.put('/:id/dismiss', InsightController.dismiss);
router.post('/regenerate', InsightController.regenerate);

module.exports = router;