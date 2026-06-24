import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { theme } from '../theme/theme';
import { StatusBar } from 'expo-status-bar';
import { NotificationService } from '../notifications/NotificationService';
import { useEffect, useState } from 'react';
import { initializeDatabase } from '../database/database';
import { View, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function RootLayout() {
  const [isDbReady, setIsDbReady] = useState(false);

  useEffect(() => {
    async function setup() {
      try {
        await initializeDatabase();
        await NotificationService.setup();
      } catch (e) {
        console.error("Setup error:", e);
      } finally {
        setIsDbReady(true);
      }
    }
    setup();
  }, []);

  if (!isDbReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0284c7" />
      </View>
    );
  }

  return (
    <PaperProvider 
      theme={theme} 
      settings={{
        icon: props => <MaterialCommunityIcons {...props} />,
      }}
    >
      <StatusBar style="dark" />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="add-customer" options={{ presentation: 'modal', title: 'Add Customer' }} />
        <Stack.Screen name="add-extra" options={{ presentation: 'modal', title: 'Add Extras' }} />
        <Stack.Screen name="edit-customer" options={{ presentation: 'modal', title: 'Edit Customer' }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </PaperProvider>
  );
}
