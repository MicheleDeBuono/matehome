import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Surface, Text, useTheme, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import UWBSimulatorService from '../../services/UWBSimulatorService';
import DataAnalysisService from '../../services/DataAnalysisService';

const MetricCard = ({ title, value, icon, color, unit = '' }) => {
  const theme = useTheme();
  
  return (
    <Surface style={styles.metricCard}>
      <MaterialCommunityIcons name={icon} size={24} color={color || theme.colors.primary} />
      <Text style={styles.metricTitle}>{title}</Text>
      <Text style={[styles.metricValue, { color: color || theme.colors.primary }]}>
        {value}{unit}
      </Text>
    </Surface>
  );
};

export default function LiveDataView({ deviceId, roomName }) {
  const [sensorData, setSensorData] = useState(null);
  const [simulator, setSimulator] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    // Inizializza il simulatore
    const uwbSimulator = new UWBSimulatorService(deviceId, roomName);
    setSimulator(uwbSimulator);

    // Sottoscrivi agli aggiornamenti
    const unsubscribe = uwbSimulator.addListener(data => {
      setSensorData(data);
      DataAnalysisService.analyzeReading(data);
    });

    // Avvia la simulazione
    uwbSimulator.startSimulation();

    return () => {
      unsubscribe();
      uwbSimulator.stopSimulation();
    };
  }, [deviceId, roomName]);

  if (!sensorData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text>Connecting to sensor...</Text>
      </View>
    );
  }

  // Determina il colore per l'agitazione
  const getAgitationColor = (value) => {
    if (value > 80) return theme.colors.error;
    if (value > 50) return theme.colors.warning;
    return theme.colors.primary;
  };

  // Determina il colore per il respiro
  const getBreathingColor = (state) => {
    switch (state) {
      case 'irregular':
      case 'rapid':
        return theme.colors.warning;
      case 'slow':
        return theme.colors.notification;
      default:
        return theme.colors.primary;
    }
  };

  // Converti l'indice di attività in testo
  const getActivityText = (index) => {
    switch (index) {
      case 0: return 'None';
      case 1: return 'Low';
      case 2: return 'Medium';
      case 3: return 'High';
      default: return 'Unknown';
    }
  };

  return (
    <View style={styles.container}>
      {/* Stato del dispositivo */}
      <View style={styles.statusContainer}>
        <MaterialCommunityIcons 
          name={sensorData.isDeviceOnline ? 'wifi-check' : 'wifi-alert'} 
          size={20} 
          color={sensorData.isDeviceOnline ? theme.colors.primary : theme.colors.error} 
        />
        <Text style={styles.statusText}>
          {sensorData.isDeviceOnline ? 'Online' : 'Offline'}
        </Text>
        <Text style={styles.timestamp}>
          Last update: {new Date(sensorData.timestamp).toLocaleTimeString()}
        </Text>
      </View>

      {/* Metriche principali */}
      <View style={styles.metricsGrid}>
        <MetricCard
          title="Presence"
          value={sensorData.presence === 'present' ? 'Yes' : 'No'}
          icon={sensorData.presence === 'present' ? 'account-check' : 'account-off'}
          color={sensorData.presence === 'present' ? theme.colors.primary : theme.colors.error}
        />

        <MetricCard
          title="Activity"
          value={getActivityText(sensorData.activityIndex)}
          icon="run"
          color={theme.colors.primary}
        />

        <MetricCard
          title="Agitation"
          value={sensorData.agitation}
          unit="%"
          icon="pulse"
          color={getAgitationColor(sensorData.agitation)}
        />

        <MetricCard
          title="Breathing"
          value={sensorData.breathing}
          icon="lungs"
          color={getBreathingColor(sensorData.breathing)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusText: {
    marginLeft: 8,
    fontWeight: 'bold',
  },
  timestamp: {
    marginLeft: 'auto',
    fontSize: 12,
    color: '#666',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: -8,
  },
  metricCard: {
    width: '48%',
    padding: 16,
    marginHorizontal: '1%',
    marginBottom: 16,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2,
  },
  metricTitle: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  metricValue: {
    marginTop: 4,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
