import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { SettingsRepository } from '../database/repositories/SettingsRepository';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true, // Legacy support
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    };
  },
});

export class NotificationService {
  private static notifiedWarningIds = new Set<number>();
  private static notifiedExpiredIds = new Set<number>();

  static async setup() {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Pool Timers',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.warn('Failed to get push token for push notification!');
    }
  }

  /**
   * Process a list of sessions and send grouped notifications for new warnings or expirations.
   * This is called by the tick engine.
   */
  static async processSessionNotifications(
    sessions: { id: number; customer_name: string; isWarning: boolean; isExpired: boolean }[]
  ) {
    const newWarnings: string[] = [];
    const newExpired: string[] = [];

    for (const session of sessions) {
      // Check Expirations
      if (session.isExpired && !this.notifiedExpiredIds.has(session.id)) {
        newExpired.push(session.customer_name);
        this.notifiedExpiredIds.add(session.id);
        // Clean up from warning list if it was there
        this.notifiedWarningIds.delete(session.id);
      }
      // Check Warnings (only if not expired)
      else if (session.isWarning && !session.isExpired && !this.notifiedWarningIds.has(session.id)) {
        newWarnings.push(session.customer_name);
        this.notifiedWarningIds.add(session.id);
      }
    }

    // Send Grouped Notification for Expired
    if (newExpired.length > 0) {
      await this.sendLocalNotification(
        'Time is Up! 🚨',
        newExpired.length === 1 
          ? `${newExpired[0]}'s session has expired!`
          : `${newExpired.length} sessions have just expired!`
      );
    }

    // Send Grouped Notification for Warnings
    if (newWarnings.length > 0) {
      await this.sendLocalNotification(
        'Approaching Time Limit ⚠️',
        newWarnings.length === 1
          ? `${newWarnings[0]} is nearing the end of their session.`
          : `${newWarnings.length} sessions are nearing their end.`
      );
    }
  }

  static resetSession(sessionId: number) {
    this.notifiedWarningIds.delete(sessionId);
    this.notifiedExpiredIds.delete(sessionId);
  }

  private static async sendLocalNotification(title: string, body: string) {
    const settings = await SettingsRepository.getSettings();
    const shouldVibrate = settings?.vibration_enabled ?? true;
    const shouldPlaySound = settings?.sound_enabled ?? true;

    // Trigger local notification immediately
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: shouldPlaySound,
      },
      trigger: Platform.OS === 'android' ? { seconds: 1, channelId: 'default' } : null,
    });
  }
}
