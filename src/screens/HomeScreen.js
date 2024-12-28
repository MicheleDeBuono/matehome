import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, Button, IconButton, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import StatusCard from '../components/dashboard/StatusCard';
import ActivityChart from '../components/dashboard/ActivityChart';

export default function HomeScreen({ navigation }) {
  const { user, logout } = useAuth();
  const theme = useTheme();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text variant="titleMedium">Welcome back,</Text>
          <Text variant="headlineSmall" style={styles.userName}>{user?.name}</Text>
        </View>
        <IconButton
          icon="cog"
          size={24}
          onPress={() => navigation.navigate('Settings')}
        />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.cardsContainer}>
          <StatusCard
            title="Current Status"
            value="Active"
            icon="account-check"
            status="success"
          />
          <StatusCard
            title="Heart Rate"
            value="72 bpm"
            icon="heart-pulse"
            status="normal"
          />
        </View>

        <View style={styles.cardsContainer}>
          <StatusCard
            title="Room Temperature"
            value="22°C"
            icon="thermometer"
            status="normal"
          />
          <StatusCard
            title="Last Movement"
            value="2m ago"
            icon="clock-outline"
            status="normal"
          />
        </View>

        <ActivityChart />

        <Button
          mode="outlined"
          onPress={logout}
          style={styles.logoutButton}
        >
          Logout
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    elevation: 2,
  },
  userName: {
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  cardsContainer: {
    flexDirection: 'row',
    padding: 8,
  },
  logoutButton: {
    margin: 16,
  },
});
