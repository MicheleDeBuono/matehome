import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { List, RadioButton, Text, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSettings } from '../../context/SettingsContext';

const UNITS = {
  metric: {
    name: 'Metric',
    temperature: '°C',
    distance: 'meters',
    weight: 'kg',
  },
  imperial: {
    name: 'Imperial',
    temperature: '°F',
    distance: 'feet',
    weight: 'lbs',
  },
};

export default function MeasurementUnitScreen() {
  const { settings, updateProfile } = useSettings();

  const handleUnitChange = async (unit) => {
    await updateProfile({ measurementUnit: unit });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <RadioButton.Group
          onValueChange={handleUnitChange}
          value={settings.profile.measurementUnit}
        >
          {Object.entries(UNITS).map(([key, unit]) => (
            <View key={key}>
              <List.Item
                title={unit.name}
                description={
                  `Temperature: ${unit.temperature}\n` +
                  `Distance: ${unit.distance}\n` +
                  `Weight: ${unit.weight}`
                }
                onPress={() => handleUnitChange(key)}
                right={() => (
                  <RadioButton
                    value={key}
                    status={settings.profile.measurementUnit === key ? 'checked' : 'unchecked'}
                  />
                )}
                style={styles.unitItem}
              />
              <Divider />
            </View>
          ))}
        </RadioButton.Group>

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>About Measurement Units</Text>
          <Text style={styles.infoText}>
            This setting affects how measurements are displayed throughout the app.
            Changes will be applied immediately to all readings and notifications.
          </Text>
          
          <Text style={styles.infoTitle}>Conversions</Text>
          <Text style={styles.infoText}>
            • Temperature: 0°C = 32°F{'\n'}
            • Distance: 1m ≈ 3.28ft{'\n'}
            • Weight: 1kg ≈ 2.2lbs
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  unitItem: {
    backgroundColor: '#fff',
  },
  infoContainer: {
    padding: 16,
    backgroundColor: '#fff',
    marginTop: 20,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
