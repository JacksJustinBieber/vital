const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'vitalwatch.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

function initializeDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS health_entries (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      date TEXT NOT NULL,
      sleep_quality INTEGER NOT NULL,
      sleep_duration REAL NOT NULL,
      energy INTEGER NOT NULL,
      mood INTEGER NOT NULL,
      water INTEGER NOT NULL,
      exercise INTEGER NOT NULL,
      bp_systolic INTEGER,
      bp_diastolic INTEGER,
      weight REAL,
      heart_rate INTEGER,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(user_id, date)
    );

    CREATE TABLE IF NOT EXISTS insights (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      action TEXT NOT NULL,
      confidence TEXT NOT NULL,
      is_read INTEGER DEFAULT 0,
      is_dismissed INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_health_entries_user_date ON health_entries(user_id, date);
    CREATE INDEX IF NOT EXISTS idx_insights_user ON insights(user_id);
  `);

  console.log('Database initialized successfully');
}

module.exports = { db, initializeDatabase };