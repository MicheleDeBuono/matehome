import React, { useState } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { Text, List, Switch, Button, Portal, Modal, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSettings } from '../context/SettingsContext';
import SettingsSection from '../components/settings/SettingsSection';
import DeviceItem from '../components/settings/DeviceItem';

export default function SettingsScreen({ navigation }) {
  const { settings, toggleDevice, updateDevice, updateNotificationSettings } = useSettings();
  const [editingDevice, setEditingDevice] = useState(null);
  const [deviceName, setDeviceName] = useState('');
  const [deviceLocation, setDeviceLocation] = useState('');

  const handleEditDevice = (device) => {
    setEditingDevice(device);
    setDeviceName(device.name);
    setDeviceLocation(device.location);
  };

  const handleSaveDevice = async () => {
    if (editingDevice) {
      await updateDevice(editingDevice.id, {
        name: deviceName,
        location: deviceLocation,
      });
      setEditingDevice(null);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <SettingsSection title="Devices">
          {settings.devices.map(device => (
            <DeviceItem
              key={device.id}
              device={device}
              onToggle={toggleDevice}
              onEdit={handleEditDevice}
            />
          ))}
        </SettingsSection>

        <SettingsSection title="Notifications">
          <List.Item
            title="Inactivity Alerts"
            description="Alert when no movement is detected"
            right={() => (
              <Switch
                value={settings.notifications.inactivity}
                onValueChange={(value) => 
                  updateNotificationSettings({ inactivity: value })
                }
              />
            )}
          />
          <List.Item
            title="Fall Detection"
            description="Alert when a fall is detected"
            right={() => (
              <Switch
                value={settings.notifications.fallDetection}
                onValueChange={(value) =>
                  updateNotificationSettings({ fallDetection: value })
                }
              />
            )}
          />
          <List.Item
            title="Room Temperature"
            description="Alert when temperature is out of range"
            right={() => (
              <Switch
                value={settings.notifications.roomTemperature}
                onValueChange={(value) =>
                  updateNotificationSettings({ roomTemperature: value })
                }
              />
            )}
          />
          <List.Item
            title="Email Notifications"
            right={() => (
              <Switch
                value={settings.notifications.emailNotifications}
                onValueChange={(value) =>
                  updateNotificationSettings({ emailNotifications: value })
                }
              />
            )}
          />
          <List.Item
            title="SMS Notifications"
            right={() => (
              <Switch
                value={settings.notifications.smsNotifications}
                onValueChange={(value) =>
                  updateNotificationSettings({ smsNotifications: value })
                }
              />
            )}
          />
          <List.Item
            title="Preview Notifications"
            description="Test how different alerts will appear"
            onPress={() => navigation.navigate('NotificationPreview')}
            right={props => <List.Icon {...props} icon="bell-ring" />}
          />
        </SettingsSection>

        <SettingsSection title="Profile">
          <List.Item
            title="Emergency Contacts"
            description={`${settings.profile.emergencyContacts.length} contacts`}
            onPress={() => navigation.navigate('EmergencyContacts')}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />
          <List.Item
            title="Language"
            description={settings.profile.language.toUpperCase()}
            onPress={() => navigation.navigate('Language')}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />
          <List.Item
            title="Measurement Unit"
            description={settings.profile.measurementUnit}
            onPress={() => navigation.navigate('MeasurementUnit')}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />
        </SettingsSection>
      </ScrollView>

      <Portal>
        <Modal
          visible={!!editingDevice}
          onDismiss={() => setEditingDevice(null)}
          contentContainerStyle={styles.modalContainer}
        >
          <Text style={styles.modalTitle}>Edit Device</Text>
          <TextInput
            label="Device Name"
            value={deviceName}
            onChangeText={setDeviceName}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Location"
            value={deviceLocation}
            onChangeText={setDeviceLocation}
            mode="outlined"
            style={styles.input}
          />
          <View style={styles.modalButtons}>
            <Button
              mode="outlined"
              onPress={() => setEditingDevice(null)}
              style={styles.modalButton}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleSaveDevice}
              style={styles.modalButton}
            >
              Save
            </Button>
          </View>
        </Modal>
      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalButton: {
    marginLeft: 8,
  },
});
