const Insight = require('../models/Insight');
const PatternDetectionService = require('../services/PatternDetectionService');

class InsightController {
  static getInsights(req, res) {
    try {
      const userId = req.user.id;
      const { includeDismissed } = req.query;

      let insights;
      if (includeDismissed === 'true') {
        insights = Insight.getAll(userId);
      } else {
        insights = Insight.getActive(userId);
      }

      res.json({ insights });
    } catch (error) {
      res.status(500).json({ error: 'Failed to get insights' });
    }
  }

  static getInsight(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const insight = Insight.findById(id);

      if (!insight || insight.user_id !== userId) {
        return res.status(404).json({ error: 'Insight not found' });
      }

      res.json({ insight });
    } catch (error) {
      res.status(500).json({ error: 'Failed to get insight' });
    }
  }

  static markAsRead(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const result = Insight.markAsRead(id, userId);

      if (result.changes === 0) {
        return res.status(404).json({ error: 'Insight not found' });
      }

      res.json({ message: 'Insight marked as read' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to mark insight as read' });
    }
  }

  static dismiss(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const result = Insight.dismiss(id, userId);

      if (result.changes === 0) {
        return res.status(404).json({ error: 'Insight not found' });
      }

      res.json({ message: 'Insight dismissed' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to dismiss insight' });
    }
  }

  static regenerate(req, res) {
    try {
      const userId = req.user.id;

      Insight.deleteAll(userId);
      const insights = PatternDetectionService.generateAndSaveInsights(userId);

      res.json({ insights, count: insights.length });
    } catch (error) {
      res.status(500).json({ error: 'Failed to regenerate insights' });
    }
  }
}

module.exports = InsightController;