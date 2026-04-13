const { db } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class HealthEntry {
  static create(userId, data) {
    const id = uuidv4();
    
    const stmt = db.prepare(`
      INSERT INTO health_entries (
        id, user_id, date, sleep_quality, sleep_duration,
        energy, mood, water, exercise, bp_systolic, bp_diastolic,
        weight, heart_rate
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      id, userId, data.date, data.sleepQuality, data.sleepDuration,
      data.energy, data.mood, data.water, data.exercise,
      data.bpSystolic || null, data.bpDiastolic || null,
      data.weight || null, data.heartRate || null
    );
    
    return this.findById(id);
  }

  static update(userId, date, data) {
    const stmt = db.prepare(`
      UPDATE health_entries SET
        sleep_quality = ?, sleep_duration = ?, energy = ?,
        mood = ?, water = ?, exercise = ?,
        bp_systolic = ?, bp_diastolic = ?, weight = ?, heart_rate = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ? AND date = ?
    `);
    
    const result = stmt.run(
      data.sleepQuality, data.sleepDuration, data.energy,
      data.mood, data.water, data.exercise,
      data.bpSystolic || null, data.bpDiastolic || null,
      data.weight || null, data.heartRate || null,
      userId, date
    );
    
    if (result.changes === 0) {
      return this.create(userId, { ...data, date });
    }
    
    return this.findByDate(userId, date);
  }

  static findById(id) {
    const stmt = db.prepare('SELECT * FROM health_entries WHERE id = ?');
    return stmt.get(id);
  }

  static findByDate(userId, date) {
    const stmt = db.prepare('SELECT * FROM health_entries WHERE user_id = ? AND date = ?');
    return stmt.get(userId, date);
  }

  static getEntries(userId, startDate, endDate) {
    let query = 'SELECT * FROM health_entries WHERE user_id = ?';
    const params = [userId];
    
    if (startDate) {
      query += ' AND date >= ?';
      params.push(startDate);
    }
    
    if (endDate) {
      query += ' AND date <= ?';
      params.push(endDate);
    }
    
    query += ' ORDER BY date DESC';
    
    const stmt = db.prepare(query);
    return stmt.all(...params);
  }

  static getRecentEntries(userId, days = 30) {
    const stmt = db.prepare(`
      SELECT * FROM health_entries
      WHERE user_id = ?
      ORDER BY date DESC
      LIMIT ?
    `);
    return stmt.all(userId, days);
  }

  static delete(id, userId) {
    const stmt = db.prepare('DELETE FROM health_entries WHERE id = ? AND user_id = ?');
    return stmt.run(id, userId);
  }

  static deleteAll(userId) {
    const stmt = db.prepare('DELETE FROM health_entries WHERE user_id = ?');
    return stmt.run(userId);
  }

  static getStats(userId) {
    const entries = this.getEntries(userId);
    
    if (entries.length === 0) {
      return { daysTracked: 0, avgSleep: null, avgEnergy: null, avgMood: null };
    }
    
    const avgSleep = entries.reduce((sum, e) => sum + e.sleep_duration, 0) / entries.length;
    const avgEnergy = entries.reduce((sum, e) => sum + e.energy, 0) / entries.length;
    const avgMood = entries.reduce((sum, e) => sum + e.mood, 0) / entries.length;
    const avgWater = entries.reduce((sum, e) => sum + e.water, 0) / entries.length;
    const avgExercise = entries.reduce((sum, e) => sum + e.exercise, 0) / entries.length;
    
    return {
      daysTracked: entries.length,
      avgSleep: Math.round(avgSleep * 10) / 10,
      avgEnergy: Math.round(avgEnergy * 10) / 10,
      avgMood: Math.round(avgMood * 10) / 10,
      avgWater: Math.round(avgWater),
      avgExercise: Math.round(avgExercise)
    };
  }
}

module.exports = HealthEntry;