import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { Text, Button, Surface, Snackbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import NotificationService from '../../services/NotificationService';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function NotificationPreviewScreen() {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '' });

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    const granted = await NotificationService.requestPermissions();
    setPermissionGranted(granted);
  };

  const showSnackbar = (message) => {
    setSnackbar({ visible: true, message });
  };

  const PreviewCard = ({ title, description, icon, onPreview }) => (
    <Surface style={styles.card}>
      <View style={styles.cardHeader}>
        <MaterialCommunityIcons name={icon} size={24} color="#007AFF" />
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      <Text style={styles.cardDescription}>{description}</Text>
      <Button
        mode="contained"
        onPress={async () => {
          await onPreview();
          showSnackbar('Preview notification sent!');
        }}
        disabled={!permissionGranted}
        style={styles.previewButton}
      >
        Preview Notification
      </Button>
    </Surface>
  );

  return (
    <SafeAreaView style={styles.container}>
      {!permissionGranted && (
        <Surface style={styles.warningCard}>
          <MaterialCommunityIcons name="alert" size={24} color="#FFA500" />
          <View style={styles.warningContent}>
            <Text style={styles.warningTitle}>Notifications Disabled</Text>
            <Text style={styles.warningText}>
              Please enable notifications in your device settings to preview alerts.
            </Text>
            <Button
              mode="contained"
              onPress={checkPermissions}
              style={styles.warningButton}
            >
              Check Permissions
            </Button>
          </View>
        </Surface>
      )}

      <ScrollView>
        <PreviewCard
          title="Inactivity Alert"
          description="Preview how inactivity alerts will appear when no movement is detected."
          icon="clock-alert"
          onPreview={NotificationService.previewInactivityAlert}
        />

        <PreviewCard
          title="Fall Detection"
          description="Preview emergency notifications for fall detection events."
          icon="alert-circle"
          onPreview={NotificationService.previewFallDetection}
        />

        <PreviewCard
          title="Temperature Alert"
          description="Preview alerts for room temperature anomalies."
          icon="thermometer"
          onPreview={NotificationService.previewTemperatureAlert}
        />

        <PreviewCard
          title="Device Status"
          description="Preview notifications about device connectivity issues."
          icon="wifi-alert"
          onPreview={NotificationService.previewDeviceOffline}
        />

        <PreviewCard
          title="Emergency Contact"
          description="Preview notifications about emergency contact actions."
          icon="account-alert"
          onPreview={NotificationService.previewEmergencyContact}
        />
      </ScrollView>

      <Snackbar
        visible={snackbar.visible}
        onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
        duration={2000}
      >
        {snackbar.message}
      </Snackbar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  warningCard: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
  },
  warningContent: {
    marginLeft: 16,
    flex: 1,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  warningText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  warningButton: {
    marginTop: 8,
  },
  card: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  previewButton: {
    marginTop: 8,
  },
});
