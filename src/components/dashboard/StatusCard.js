import React from 'react';
import { StyleSheet } from 'react-native';
import { Surface, Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function StatusCard({ title, value, icon, status = 'normal' }) {
  const theme = useTheme();
  
  const getStatusColor = () => {
    switch (status) {
      case 'warning':
        return '#FFA500';
      case 'error':
        return '#FF0000';
      case 'success':
        return '#4CAF50';
      default:
        return theme.colors.primary;
    }
  };

  return (
    <Surface style={styles.card}>
      <MaterialCommunityIcons 
        name={icon} 
        size={24} 
        color={getStatusColor()} 
        style={styles.icon}
      />
      <Text style={styles.title}>{title}</Text>
      <Text style={[styles.value, { color: getStatusColor() }]}>{value}</Text>
    </Surface>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    marginHorizontal: 8,
    marginVertical: 8,
    flex: 1,
    minHeight: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    marginBottom: 4,
    textAlign: 'center',
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
