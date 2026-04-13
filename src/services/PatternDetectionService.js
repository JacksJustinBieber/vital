const HealthEntry = require('../models/HealthEntry');
const Insight = require('../models/Insight');

class PatternDetectionService {
  static analyze(userId) {
    const entries = HealthEntry.getRecentEntries(userId, 30);
    
    if (entries.length < 7) {
      return [];
    }

    const insights = [];
    const recentData = entries.reverse();

    const sleepDeprivationInsight = this.detectSleepDeprivation(recentData);
    if (sleepDeprivationInsight) insights.push(sleepDeprivationInsight);

    const energyDeclineInsight = this.detectEnergyDecline(recentData);
    if (energyDeclineInsight) insights.push(energyDeclineInsight);

    const hydrationInsight = this.detectHydrationImpact(recentData);
    if (hydrationInsight) insights.push(hydrationInsight);

    const exerciseInsight = this.detectExerciseSensitivity(recentData);
    if (exerciseInsight) insights.push(exerciseInsight);

    const moodInsight = this.detectMoodPattern(recentData);
    if (moodInsight) insights.push(moodInsight);

    const bpInsight = this.detectBloodPressureTrend(recentData);
    if (bpInsight) insights.push(bpInsight);

    const weightInsight = this.detectWeightTrend(recentData);
    if (weightInsight) insights.push(weightInsight);

    return insights;
  }

  static detectSleepDeprivation(data) {
    if (data.length < 7) return null;

    const lowSleepDays = data.filter(d => d.sleep_duration < 6);
    
    if (lowSleepDays.length >= 5) {
      const lowEnergyDays = lowSleepDays.filter(d => d.energy < 5);
      const confidence = lowEnergyDays.length >= 4 ? 'high' : 'medium';

      return {
        type: 'alert',
        title: 'Sleep Deprivation Pattern Detected',
        description: `You've had ${lowSleepDays.length} nights with less than 6 hours of sleep in the past week. Combined with low energy levels, this could be affecting your metabolic health and cognitive function.`,
        action: 'Prioritize sleep hygiene. Consider a consistent bedtime and aim for 7-9 hours. If this persists, discuss with your doctor.',
        confidence
      };
    }

    return null;
  }

  static detectEnergyDecline(data) {
    if (data.length < 14) return null;

    const lastWeek = data.slice(-7);
    const prevWeek = data.slice(-14, -7);

    const avgEnergyLast = lastWeek.reduce((sum, d) => sum + d.energy, 0) / 7;
    const avgEnergyPrev = prevWeek.reduce((sum, d) => sum + d.energy, 0) / 7;

    const avgSleepLast = lastWeek.reduce((sum, d) => sum + d.sleep_duration, 0) / 7;
    const avgSleepPrev = prevWeek.reduce((sum, d) => sum + d.sleep_duration, 0) / 7;

    if (avgEnergyLast < avgEnergyPrev - 1 && avgSleepLast < avgSleepPrev) {
      return {
        type: 'warning',
        title: 'Energy & Sleep Decline Pattern',
        description: 'Your energy levels have been trending downward over the past two weeks, accompanied by reduced sleep. This combination can indicate metabolic or hormonal changes.',
        action: 'Consider blood work to check thyroid function (TSH, T4). Ask your doctor: "Could my energy decline indicate a metabolic or thyroid issue?"',
        confidence: 'medium'
      };
    }

    return null;
  }

  static detectHydrationImpact(data) {
    if (data.length < 7) return null;

    const lowWaterDays = data.filter(d => d.water < 4);
    
    if (lowWaterDays.length >= 7) {
      const lowEnergyOnLowWater = lowWaterDays.filter(d => d.energy < 5);
      
      if (lowEnergyOnLowWater.length >= 4) {
        return {
          type: 'info',
          title: 'Hydration-Energy Correlation',
          description: `On days when you drank less than 4 glasses of water, ${lowEnergyOnLowWater.length} of them also had low energy levels. Chronic dehydration can significantly impact energy and mood.`,
          action: 'Aim for 8-10 glasses daily. Set reminders. Consider: "I\'ve noticed my energy drops on low-water days."',
          confidence: 'high'
        };
      }
    }

    return null;
  }

  static detectExerciseSensitivity(data) {
    if (data.length < 10) return null;

    const highExerciseDays = data.filter(d => d.exercise > 60);
    
    if (highExerciseDays.length >= 3) {
      let fatigueCount = 0;
      
      for (let i = 0; i < data.length - 1; i++) {
        if (data[i].exercise > 60 && data[i + 1].energy < data[i].energy - 2) {
          fatigueCount++;
        }
      }

      if (fatigueCount >= 2) {
        return {
          type: 'warning',
          title: 'Post-Exercise Recovery Pattern',
          description: 'On days following intense exercise, your energy appears significantly lower. This could indicate overtraining, poor recovery, or underlying issues.',
          action: 'Consider moderate exercise until you recover. Ask your doctor about: "Exercise intolerance" and potential adrenal or thyroid evaluation.',
          confidence: 'low'
        };
      }
    }

    return null;
  }

  static detectMoodPattern(data) {
    if (data.length < 10) return null;

    const avgMood = data.reduce((sum, d) => sum + d.mood, 0) / data.length;
    
    if (avgMood < 5) {
      const lowMoodDays = data.filter(d => d.mood < 5).length;
      
      if (lowMoodDays >= 5) {
        return {
          type: 'info',
          title: 'Low Mood Pattern',
          description: `You've reported low mood on ${lowMoodDays} of the last ${data.length} days. This could be related to sleep, diet, or other factors.`,
          action: 'Consider discussing with a healthcare provider. Small changes: sunlight exposure, regular exercise, and social connection can help.',
          confidence: 'medium'
        };
      }
    }

    return null;
  }

  static detectBloodPressureTrend(data) {
    const bpData = data.filter(d => d.bp_systolic && d.bp_diastolic);
    
    if (bpData.length >= 5) {
      const elevatedCount = bpData.filter(d => d.bp_systolic > 130 || d.bp_diastolic > 85).length;
      
      if (elevatedCount >= 4) {
        return {
          type: 'alert',
          title: 'Elevated Blood Pressure Trend',
          description: `${elevatedCount} of your last ${bpData.length} readings show elevated blood pressure (above 130/85). This warrants attention.`,
          action: 'Schedule a blood pressure check with your doctor. Ask about: "Pre-hypertension management" and home monitoring.',
          confidence: 'high'
        };
      }
    }

    return null;
  }

  static detectWeightTrend(data) {
    const weightData = data.filter(d => d.weight);
    
    if (weightData.length >= 7) {
      const firstWeight = weightData[0].weight;
      const recentWeight = weightData[weightData.length - 1].weight;
      const weightChange = recentWeight - firstWeight;

      if (Math.abs(weightChange) > 2) {
        return {
          type: 'info',
          title: weightChange > 0 ? 'Weight Increase Noted' : 'Weight Decrease Noted',
          description: `Your weight has changed by ${Math.abs(weightChange).toFixed(1)} kg over ${weightData.length} days. ${weightChange > 0 ? 'Unexplained weight gain' : 'Unexplained weight loss'} can indicate various health factors.`,
          action: 'If this change is unintentional, discuss with your doctor. Consider metabolic panel and thyroid function tests.',
          confidence: 'medium'
        };
      }
    }

    return null;
  }

  static generateAndSaveInsights(userId) {
    Insight.deleteOlderThan(userId, new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());
    
    const insights = this.analyze(userId);
    
    if (insights.length > 0) {
      Insight.createBatch(userId, insights);
    }
    
    return insights;
  }
}

module.exports = PatternDetectionService;