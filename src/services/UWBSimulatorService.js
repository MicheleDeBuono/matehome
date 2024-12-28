class UWBSimulatorService {
  // Costanti per la simulazione
  static ACTIVITY_LEVELS = {
    NONE: 0,      // Nessuna attività
    LOW: 1,       // Attività bassa (es. seduto, dormendo)
    MEDIUM: 2,    // Attività media (es. camminando lentamente)
    HIGH: 3       // Attività alta (es. camminando velocemente o agitazione)
  };

  static PRESENCE_STATES = {
    ABSENT: 'absent',
    PRESENT: 'present'
  };

  static BREATHING_STATES = {
    NORMAL: 'normal',
    IRREGULAR: 'irregular',
    RAPID: 'rapid',
    SLOW: 'slow'
  };

  constructor(deviceId, roomName) {
    this.deviceId = deviceId;
    this.roomName = roomName;
    this.isSimulating = false;
    this.currentData = this.getInitialState();
    this.listeners = new Set();
  }

  getInitialState() {
    return {
      deviceId: this.deviceId,
      roomName: this.roomName,
      timestamp: new Date().toISOString(),
      presence: UWBSimulatorService.PRESENCE_STATES.ABSENT,
      breathing: UWBSimulatorService.BREATHING_STATES.NORMAL,
      activityIndex: UWBSimulatorService.ACTIVITY_LEVELS.NONE,
      agitation: 0, // 0-100
      isDeviceOnline: true
    };
  }

  // Simula variazioni naturali nei dati
  simulateNaturalVariation(value, min, max, maxChange) {
    const change = (Math.random() * 2 - 1) * maxChange;
    return Math.min(max, Math.max(min, value + change));
  }

  // Genera dati simulati basati su scenari realistici
  generateSimulatedData() {
    const now = new Date();
    const hour = now.getHours();

    // Simula pattern giornalieri
    let presence = Math.random() > 0.1 ? 
      UWBSimulatorService.PRESENCE_STATES.PRESENT : 
      UWBSimulatorService.PRESENCE_STATES.ABSENT;

    let activityIndex = UWBSimulatorService.ACTIVITY_LEVELS.LOW;
    let breathing = UWBSimulatorService.BREATHING_STATES.NORMAL;
    let agitation = this.currentData.agitation;

    // Pattern notturni (22:00 - 06:00)
    if (hour >= 22 || hour < 6) {
      activityIndex = UWBSimulatorService.ACTIVITY_LEVELS.LOW;
      breathing = Math.random() > 0.9 ? 
        UWBSimulatorService.BREATHING_STATES.IRREGULAR : 
        UWBSimulatorService.BREATHING_STATES.NORMAL;
      agitation = this.simulateNaturalVariation(agitation, 0, 30, 5);
    }
    // Pattern mattutini (06:00 - 10:00)
    else if (hour >= 6 && hour < 10) {
      activityIndex = UWBSimulatorService.ACTIVITY_LEVELS.MEDIUM;
      breathing = UWBSimulatorService.BREATHING_STATES.NORMAL;
      agitation = this.simulateNaturalVariation(agitation, 10, 50, 10);
    }
    // Pattern giornalieri (10:00 - 22:00)
    else {
      activityIndex = Math.random() > 0.7 ? 
        UWBSimulatorService.ACTIVITY_LEVELS.MEDIUM : 
        UWBSimulatorService.ACTIVITY_LEVELS.LOW;
      breathing = UWBSimulatorService.BREATHING_STATES.NORMAL;
      agitation = this.simulateNaturalVariation(agitation, 5, 70, 15);
    }

    // Simula occasionalmente scenari di emergenza
    if (Math.random() < 0.01) { // 1% di probabilità
      activityIndex = UWBSimulatorService.ACTIVITY_LEVELS.HIGH;
      breathing = UWBSimulatorService.BREATHING_STATES.RAPID;
      agitation = Math.min(100, agitation + 40);
    }

    return {
      ...this.currentData,
      timestamp: now.toISOString(),
      presence,
      breathing,
      activityIndex,
      agitation: Math.round(agitation),
      isDeviceOnline: Math.random() > 0.01 // 1% di probabilità di offline
    };
  }

  // Inizia la simulazione
  startSimulation(interval = 1000) {
    if (this.isSimulating) return;
    
    this.isSimulating = true;
    this.simulationInterval = setInterval(() => {
      this.currentData = this.generateSimulatedData();
      this.notifyListeners(this.currentData);
    }, interval);
  }

  // Ferma la simulazione
  stopSimulation() {
    if (!this.isSimulating) return;
    
    clearInterval(this.simulationInterval);
    this.isSimulating = false;
    this.currentData = this.getInitialState();
    this.notifyListeners(this.currentData);
  }

  // Gestione dei listener per i dati
  addListener(callback) {
    this.listeners.add(callback);
    callback(this.currentData); // Invia subito i dati correnti
    return () => this.listeners.delete(callback);
  }

  notifyListeners(data) {
    this.listeners.forEach(callback => callback(data));
  }
}

export default UWBSimulatorService;
