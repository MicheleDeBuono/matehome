import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsContext = createContext({});

const DEFAULT_SETTINGS = {
  devices: [
    {
      id: '1',
      name: 'Living Room Sensor',
      location: 'Living Room',
      isConnected: true,
      isActive: true,
      macAddress: '00:11:22:33:44:55',
    },
    {
      id: '2',
      name: 'Bedroom Sensor',
      location: 'Bedroom',
      isConnected: true,
      isActive: true,
      macAddress: '66:77:88:99:AA:BB',
    },
  ],
  notifications: {
    inactivity: true,
    inactivityThreshold: 30, // minutes
    fallDetection: true,
    roomTemperature: true,
    temperatureThreshold: { min: 18, max: 28 },
    notificationSound: true,
    emailNotifications: true,
    smsNotifications: false,
  },
  profile: {
    emergencyContacts: [],
    timezone: 'Europe/Rome',
    language: 'en',
    measurementUnit: 'metric',
  },
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const stored = await AsyncStorage.getItem('@settings');
      if (stored) {
        setSettings(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (newSettings) => {
    try {
      await AsyncStorage.setItem('@settings', JSON.stringify(newSettings));
      setSettings(newSettings);
      return true;
    } catch (error) {
      console.error('Error saving settings:', error);
      return false;
    }
  };

  // Device management
  const toggleDevice = async (deviceId) => {
    const newSettings = {
      ...settings,
      devices: settings.devices.map(device =>
        device.id === deviceId
          ? { ...device, isActive: !device.isActive }
          : device
      ),
    };
    return saveSettings(newSettings);
  };

  const updateDevice = async (deviceId, updates) => {
    const newSettings = {
      ...settings,
      devices: settings.devices.map(device =>
        device.id === deviceId
          ? { ...device, ...updates }
          : device
      ),
    };
    return saveSettings(newSettings);
  };

  // Notification preferences
  const updateNotificationSettings = async (updates) => {
    const newSettings = {
      ...settings,
      notifications: {
        ...settings.notifications,
        ...updates,
      },
    };
    return saveSettings(newSettings);
  };

  // Profile management
  const updateProfile = async (updates) => {
    const newSettings = {
      ...settings,
      profile: {
        ...settings.profile,
        ...updates,
      },
    };
    return saveSettings(newSettings);
  };

  const addEmergencyContact = async (contact) => {
    const newSettings = {
      ...settings,
      profile: {
        ...settings.profile,
        emergencyContacts: [...settings.profile.emergencyContacts, contact],
      },
    };
    return saveSettings(newSettings);
  };

  const removeEmergencyContact = async (contactId) => {
    const newSettings = {
      ...settings,
      profile: {
        ...settings.profile,
        emergencyContacts: settings.profile.emergencyContacts.filter(
          contact => contact.id !== contactId
        ),
      },
    };
    return saveSettings(newSettings);
  };

  return (
    <SettingsContext.Provider value={{
      settings,
      loading,
      toggleDevice,
      updateDevice,
      updateNotificationSettings,
      updateProfile,
      addEmergencyContact,
      removeEmergencyContact,
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
