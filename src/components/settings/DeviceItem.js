import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Switch, IconButton, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function DeviceItem({ device, onToggle, onEdit }) {
  const theme = useTheme();
  
  const getStatusColor = () => {
    if (!device.isConnected) return '#666';
    return device.isActive ? theme.colors.primary : '#666';
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftContent}>
        <MaterialCommunityIcons
          name={device.isConnected ? "radar" : "radar-off"}
          size={24}
          color={getStatusColor()}
          style={styles.icon}
        />
        <View>
          <Text style={styles.name}>{device.name}</Text>
          <Text style={styles.status}>
            {device.isConnected ? 'Connected' : 'Disconnected'}
            {device.isConnected && ` • ${device.location}`}
          </Text>
        </View>
      </View>
      
      <View style={styles.rightContent}>
        <Switch
          value={device.isActive}
          onValueChange={() => onToggle(device.id)}
          disabled={!device.isConnected}
        />
        <IconButton
          icon="pencil"
          size={20}
          onPress={() => onEdit(device)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
  },
  status: {
    fontSize: 14,
    color: '#666',
  },
});
