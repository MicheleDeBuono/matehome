import * as Notifications from 'expo-notifications';

// Configurazione delle notifiche
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

class NotificationService {
  static async requestPermissions() {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  }

  static async scheduleNotification({ title, body, data, delay = 0 }) {
    return await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: true,
      },
      trigger: delay ? { seconds: delay } : null,
    });
  }

  // Esempi di notifiche di emergenza
  static async previewInactivityAlert() {
    return this.scheduleNotification({
      title: '⚠️ Inactivity Alert',
      body: 'No movement detected in Living Room for 30 minutes. Tap to check the status.',
      data: { type: 'inactivity', location: 'Living Room' },
      delay: 1,
    });
  }

  static async previewFallDetection() {
    return this.scheduleNotification({
      title: '🚨 Fall Detected',
      body: 'Possible fall detected in Bedroom. Emergency contacts will be notified if no response.',
      data: { type: 'fall', location: 'Bedroom' },
      delay: 1,
    });
  }

  static async previewTemperatureAlert() {
    return this.scheduleNotification({
      title: '🌡️ Temperature Alert',
      body: 'Room temperature is too high (29°C). Consider adjusting the thermostat.',
      data: { type: 'temperature', value: 29 },
      delay: 1,
    });
  }

  static async previewDeviceOffline() {
    return this.scheduleNotification({
      title: '📡 Device Offline',
      body: 'Living Room sensor is offline. Please check the device connection.',
      data: { type: 'device', status: 'offline' },
      delay: 1,
    });
  }

  static async previewEmergencyContact() {
    return this.scheduleNotification({
      title: '👥 Emergency Contact Update',
      body: 'Emergency contact John Doe has been notified about the recent alert.',
      data: { type: 'contact', action: 'notified' },
      delay: 1,
    });
  }
}

export default NotificationService;
