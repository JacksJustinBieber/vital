const HealthEntry = require('../models/HealthEntry');
const PatternDetectionService = require('../services/PatternDetectionService');
const Insight = require('../models/Insight');

class HealthController {
  static createEntry(req, res) {
    try {
      const userId = req.user.id;
      const { date, sleepQuality, sleepDuration, energy, mood, water, exercise, bpSystolic, bpDiastolic, weight, heartRate } = req.body;

      if (!date || sleepQuality === undefined || sleepDuration === undefined || energy === undefined || mood === undefined) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      if (sleepQuality < 1 || sleepQuality > 10 || energy < 1 || energy > 10 || mood < 1 || mood > 10) {
        return res.status(400).json({ error: 'Values must be between 1 and 10' });
      }

      const existingEntry = HealthEntry.findByDate(userId, date);
      
      let entry;
      if (existingEntry) {
        entry = HealthEntry.update(userId, date, {
          sleepQuality, sleepDuration, energy, mood, water, exercise,
          bpSystolic, bpDiastolic, weight, heartRate
        });
      } else {
        entry = HealthEntry.create(userId, {
          date, sleepQuality, sleepDuration, energy, mood, water, exercise,
          bpSystolic, bpDiastolic, weight, heartRate
        });
      }

      const insights = PatternDetectionService.generateAndSaveInsights(userId);

      res.status(201).json({ entry, insightsGenerated: insights.length });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create entry' });
    }
  }

  static getEntries(req, res) {
    try {
      const userId = req.user.id;
      const { startDate, endDate, days } = req.query;

      let entries;
      if (days) {
        entries = HealthEntry.getRecentEntries(userId, parseInt(days));
      } else {
        entries = HealthEntry.getEntries(userId, startDate, endDate);
      }

      res.json({ entries });
    } catch (error) {
      res.status(500).json({ error: 'Failed to get entries' });
    }
  }

  static getEntry(req, res) {
    try {
      const userId = req.user.id;
      const { date } = req.params;

      const entry = HealthEntry.findByDate(userId, date);

      if (!entry) {
        return res.status(404).json({ error: 'Entry not found' });
      }

      res.json({ entry });
    } catch (error) {
      res.status(500).json({ error: 'Failed to get entry' });
    }
  }

  static updateEntry(req, res) {
    try {
      const userId = req.user.id;
      const { date } = req.params;
      const { sleepQuality, sleepDuration, energy, mood, water, exercise, bpSystolic, bpDiastolic, weight, heartRate } = req.body;

      const entry = HealthEntry.update(userId, date, {
        sleepQuality, sleepDuration, energy, mood, water, exercise,
        bpSystolic, bpDiastolic, weight, heartRate
      });

      const insights = PatternDetectionService.generateAndSaveInsights(userId);

      res.json({ entry, insightsGenerated: insights.length });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update entry' });
    }
  }

  static deleteEntry(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const result = HealthEntry.delete(id, userId);

      if (result.changes === 0) {
        return res.status(404).json({ error: 'Entry not found' });
      }

      res.json({ message: 'Entry deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete entry' });
    }
  }

  static getStats(req, res) {
    try {
      const userId = req.user.id;

      const stats = HealthEntry.getStats(userId);
      const insightsCount = Insight.getActive(userId).length;

      res.json({ ...stats, insightsCount });
    } catch (error) {
      res.status(500).json({ error: 'Failed to get stats' });
    }
  }

  static exportData(req, res) {
    try {
      const userId = req.user.id;

      const entries = HealthEntry.getEntries(userId);
      const insights = Insight.getAll(userId, 100);

      res.json({
        exportedAt: new Date().toISOString(),
        entries,
        insights
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to export data' });
    }
  }

  static deleteAllData(req, res) {
    try {
      const userId = req.user.id;

      HealthEntry.deleteAll(userId);
      Insight.deleteAll(userId);

      res.json({ message: 'All data deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete data' });
    }
  }
}

module.exports = HealthController;