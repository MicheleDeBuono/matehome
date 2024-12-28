import NotificationService from './NotificationService';

class DataAnalysisService {
  constructor() {
    this.dataHistory = new Map(); // deviceId -> array of readings
    this.alertThresholds = {
      inactivityMinutes: 30,
      highAgitationThreshold: 80,
      irregularBreathingCount: 5
    };
  }

  // Analizza nuovi dati in arrivo
  analyzeReading(reading) {
    const deviceId = reading.deviceId;
    
    // Aggiorna lo storico
    if (!this.dataHistory.has(deviceId)) {
      this.dataHistory.set(deviceId, []);
    }
    const history = this.dataHistory.get(deviceId);
    history.push(reading);
    
    // Mantieni solo l'ultima ora di dati
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    while (history.length > 0 && new Date(history[0].timestamp) < oneHourAgo) {
      history.shift();
    }

    // Esegui le analisi
    this.checkInactivity(reading, history);
    this.checkAgitation(reading, history);
    this.checkBreathing(reading, history);
    this.checkPresence(reading, history);
  }

  // Controlla periodi di inattività
  checkInactivity(currentReading, history) {
    if (currentReading.activityIndex === 0) {
      const lastActivity = history.findLast(r => r.activityIndex > 0);
      if (lastActivity) {
        const inactiveMinutes = (new Date(currentReading.timestamp) - new Date(lastActivity.timestamp)) / (1000 * 60);
        if (inactiveMinutes >= this.alertThresholds.inactivityMinutes) {
          NotificationService.scheduleNotification({
            title: '⚠️ Inactivity Alert',
            body: `No movement detected in ${currentReading.roomName} for ${Math.round(inactiveMinutes)} minutes`,
            data: { type: 'inactivity', location: currentReading.roomName }
          });
        }
      }
    }
  }

  // Analizza livelli di agitazione
  checkAgitation(currentReading, history) {
    if (currentReading.agitation > this.alertThresholds.highAgitationThreshold) {
      const recentReadings = history.slice(-5);
      const avgAgitation = recentReadings.reduce((sum, r) => sum + r.agitation, 0) / recentReadings.length;
      
      if (avgAgitation > this.alertThresholds.highAgitationThreshold) {
        NotificationService.scheduleNotification({
          title: '🚨 High Agitation Alert',
          body: `Unusually high agitation detected in ${currentReading.roomName}`,
          data: { type: 'agitation', location: currentReading.roomName }
        });
      }
    }
  }

  // Analizza pattern respiratori
  checkBreathing(currentReading, history) {
    if (currentReading.breathing !== 'normal') {
      const recentReadings = history.slice(-this.alertThresholds.irregularBreathingCount);
      const irregularCount = recentReadings.filter(r => r.breathing !== 'normal').length;
      
      if (irregularCount >= this.alertThresholds.irregularBreathingCount) {
        NotificationService.scheduleNotification({
          title: '⚕️ Breathing Pattern Alert',
          body: `Irregular breathing pattern detected in ${currentReading.roomName}`,
          data: { type: 'breathing', location: currentReading.roomName }
        });
      }
    }
  }

  // Analizza cambiamenti di presenza
  checkPresence(currentReading, history) {
    if (history.length < 2) return;
    
    const previousReading = history[history.length - 2];
    if (previousReading.presence !== currentReading.presence) {
      if (currentReading.presence === 'absent') {
        NotificationService.scheduleNotification({
          title: '👤 Presence Update',
          body: `No presence detected in ${currentReading.roomName}`,
          data: { type: 'presence', location: currentReading.roomName }
        });
      }
    }
  }

  // Genera report giornaliero
  generateDailyReport(deviceId) {
    const history = this.dataHistory.get(deviceId) || [];
    const last24Hours = history.filter(r => 
      new Date(r.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)
    );

    if (last24Hours.length === 0) return null;

    // Calcola statistiche
    const activityLevels = last24Hours.map(r => r.activityIndex);
    const avgActivity = activityLevels.reduce((a, b) => a + b, 0) / activityLevels.length;
    
    const agitationLevels = last24Hours.map(r => r.agitation);
    const avgAgitation = agitationLevels.reduce((a, b) => a + b, 0) / agitationLevels.length;
    
    const breathingPatterns = last24Hours.map(r => r.breathing);
    const irregularBreathingCount = breathingPatterns.filter(b => b !== 'normal').length;

    // Calcola le ore di presenza
    const presenceMinutes = last24Hours.filter(r => r.presence === 'present').length;
    const presenceHours = (presenceMinutes * (24 / last24Hours.length)).toFixed(1);

    return {
      date: new Date().toISOString(),
      deviceId,
      roomName: last24Hours[0].roomName,
      statistics: {
        averageActivityIndex: avgActivity.toFixed(2),
        averageAgitation: avgAgitation.toFixed(2),
        irregularBreathingEvents: irregularBreathingCount,
        presenceHours: presenceHours,
        totalReadings: last24Hours.length
      },
      activityPattern: this.analyzeActivityPattern(last24Hours)
    };
  }

  // Analizza il pattern di attività
  analyzeActivityPattern(readings) {
    const hourlyActivity = new Array(24).fill(0);
    const hourlyCounts = new Array(24).fill(0);

    readings.forEach(reading => {
      const hour = new Date(reading.timestamp).getHours();
      hourlyActivity[hour] += reading.activityIndex;
      hourlyCounts[hour]++;
    });

    return hourlyActivity.map((total, hour) => ({
      hour,
      averageActivity: hourlyCounts[hour] ? (total / hourlyCounts[hour]).toFixed(2) : 0
    }));
  }
}

export default new DataAnalysisService();
