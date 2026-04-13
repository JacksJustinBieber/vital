const { db } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Insight {
  static create(userId, data) {
    const id = uuidv4();
    
    const stmt = db.prepare(`
      INSERT INTO insights (id, user_id, type, title, description, action, confidence)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(id, userId, data.type, data.title, data.description, data.action, data.confidence);
    
    return this.findById(id);
  }

  static createBatch(userId, insights) {
    const stmt = db.prepare(`
      INSERT INTO insights (id, user_id, type, title, description, action, confidence)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    const insertMany = db.transaction((insights) => {
      for (const insight of insights) {
        stmt.run(uuidv4(), userId, insight.type, insight.title, insight.description, insight.action, insight.confidence);
      }
    });
    
    insertMany(insights);
  }

  static findById(id) {
    const stmt = db.prepare('SELECT * FROM insights WHERE id = ?');
    return stmt.get(id);
  }

  static getActive(userId) {
    const stmt = db.prepare(`
      SELECT * FROM insights
      WHERE user_id = ? AND is_dismissed = 0
      ORDER BY created_at DESC
    `);
    return stmt.all(userId);
  }

  static getAll(userId, limit = 50) {
    const stmt = db.prepare(`
      SELECT * FROM insights
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT ?
    `);
    return stmt.all(userId, limit);
  }

  static markAsRead(id, userId) {
    const stmt = db.prepare('UPDATE insights SET is_read = 1 WHERE id = ? AND user_id = ?');
    return stmt.run(id, userId);
  }

  static dismiss(id, userId) {
    const stmt = db.prepare('UPDATE insights SET is_dismissed = 1 WHERE id = ? AND user_id = ?');
    return stmt.run(id, userId);
  }

  static deleteAll(userId) {
    const stmt = db.prepare('DELETE FROM insights WHERE user_id = ?');
    return stmt.run(userId);
  }

  static deleteOlderThan(userId, date) {
    const stmt = db.prepare('DELETE FROM insights WHERE user_id = ? AND created_at < ?');
    return stmt.run(userId, date);
  }
}

module.exports = Insight;