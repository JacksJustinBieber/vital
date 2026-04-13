const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const { authMiddleware } = require('../middleware/auth');

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

router.get('/profile', authMiddleware, AuthController.getProfile);
router.put('/password', authMiddleware, AuthController.updatePassword);
router.delete('/account', authMiddleware, AuthController.deleteAccount);

module.exports = router;