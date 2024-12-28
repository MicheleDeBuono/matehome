import React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import { Surface, Text } from 'react-native-paper';

// Nota: In produzione useremo una libreria di grafici come react-native-chart-kit
// Per ora facciamo un placeholder
export default function ActivityChart() {
  return (
    <Surface style={styles.container}>
      <Text style={styles.title}>Activity Level</Text>
      <View style={styles.chartPlaceholder}>
        <View style={[styles.bar, { height: '60%' }]} />
        <View style={[styles.bar, { height: '80%' }]} />
        <View style={[styles.bar, { height: '40%' }]} />
        <View style={[styles.bar, { height: '90%' }]} />
        <View style={[styles.bar, { height: '70%' }]} />
        <View style={[styles.bar, { height: '50%' }]} />
        <View style={[styles.bar, { height: '65%' }]} />
      </View>
      <Text style={styles.subtitle}>Last 7 Days</Text>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  chartPlaceholder: {
    height: 200,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
  },
  bar: {
    width: 30,
    backgroundColor: '#007AFF',
    borderRadius: 4,
    opacity: 0.8,
  },
});
