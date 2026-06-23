import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { theme } from '../theme/theme';
import { StatusBar } from 'expo-status-bar';
import { NotificationService } from '../notifications/NotificationService';
import { useEffect } from 'react';

export default function RootLayout() {
  useEffect(() => {
    NotificationService.setup();
  }, []);

  return (
    <PaperProvider theme={theme}>
      <StatusBar style="dark" />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="add-customer" options={{ presentation: 'modal', title: 'Add Customer' }} />
        <Stack.Screen name="edit-customer" options={{ presentation: 'modal', title: 'Edit Customer' }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </PaperProvider>
  );
}
