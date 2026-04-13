const { db } = require('../config/database');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

class User {
  static create(email, password) {
    const id = uuidv4();
    const passwordHash = bcrypt.hashSync(password, 10);
    
    const stmt = db.prepare(`
      INSERT INTO users (id, email, password_hash)
      VALUES (?, ?, ?)
    `);
    
    try {
      stmt.run(id, email.toLowerCase(), passwordHash);
      return { id, email: email.toLowerCase() };
    } catch (error) {
      if (error.message.includes('UNIQUE constraint')) {
        throw new Error('Email already exists');
      }
      throw error;
    }
  }

  static findByEmail(email) {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email.toLowerCase());
  }

  static findById(id) {
    const stmt = db.prepare('SELECT id, email, created_at FROM users WHERE id = ?');
    return stmt.get(id);
  }

  static verifyPassword(user, password) {
    return bcrypt.compareSync(password, user.password_hash);
  }

  static updatePassword(userId, newPassword) {
    const passwordHash = bcrypt.hashSync(newPassword, 10);
    const stmt = db.prepare(`
      UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    return stmt.run(userId, passwordHash);
  }

  static delete(userId) {
    const stmt = db.prepare('DELETE FROM users WHERE id = ?');
    return stmt.run(userId);
  }
}

module.exports = User;