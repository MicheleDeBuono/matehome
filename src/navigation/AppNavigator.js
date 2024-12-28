import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import EmergencyContactsScreen from '../screens/settings/EmergencyContactsScreen';
import LanguageScreen from '../screens/settings/LanguageScreen';
import MeasurementUnitScreen from '../screens/settings/MeasurementUnitScreen';
import NotificationPreviewScreen from '../screens/settings/NotificationPreviewScreen';
import ReportScreen from '../screens/ReportScreen';
import { ActivityIndicator, View } from 'react-native';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          // Authenticated stack
          <>
            <Stack.Screen 
              name="Home" 
              component={HomeScreen}
              options={{ title: 'MATE HOME 2' }}
            />
            <Stack.Screen 
              name="Settings" 
              component={SettingsScreen}
              options={{ title: 'Settings' }}
            />
            <Stack.Screen
              name="EmergencyContacts"
              component={EmergencyContactsScreen}
              options={{ title: 'Emergency Contacts' }}
            />
            <Stack.Screen
              name="Language"
              component={LanguageScreen}
              options={{ title: 'Language' }}
            />
            <Stack.Screen
              name="MeasurementUnit"
              component={MeasurementUnitScreen}
              options={{ title: 'Measurement Unit' }}
            />
            <Stack.Screen
              name="NotificationPreview"
              component={NotificationPreviewScreen}
              options={{ title: 'Notification Preview' }}
            />
            <Stack.Screen
              name="Report"
              component={ReportScreen}
              options={{ title: 'Activity Report' }}
            />
          </>
        ) : (
          // Auth stack
          <>
            <Stack.Screen 
              name="Login" 
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="Register" 
              component={RegisterScreen}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
