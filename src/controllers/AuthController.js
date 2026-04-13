const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

class AuthController {
  static register(req, res) {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }
      
      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
      }
      
      const user = User.create(email, password);
      const token = generateToken(user.id);
      
      res.status(201).json({
        user: { id: user.id, email: user.email },
        token
      });
    } catch (error) {
      if (error.message === 'Email already exists') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: 'Failed to create user' });
    }
  }

  static login(req, res) {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }
      
      const user = User.findByEmail(email);
      
      if (!user || !User.verifyPassword(user, password)) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      
      const token = generateToken(user.id);
      
      res.json({
        user: { id: user.id, email: user.email },
        token
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to login' });
    }
  }

  static getProfile(req, res) {
    res.json({ user: req.user });
  }

  static updatePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Current and new password are required' });
      }
      
      const user = User.findById(req.user.id);
      
      if (!User.verifyPassword(user, currentPassword)) {
        return res.status(401).json({ error: 'Current password is incorrect' });
      }
      
      if (newPassword.length < 6) {
        return res.status(400).json({ error: 'New password must be at least 6 characters' });
      }
      
      User.updatePassword(req.user.id, newPassword);
      
      res.json({ message: 'Password updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update password' });
    }
  }

  static deleteAccount(req, res) {
    try {
      User.delete(req.user.id);
      res.json({ message: 'Account deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete account' });
    }
  }
}

module.exports = AuthController;