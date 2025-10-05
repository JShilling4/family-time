import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { SchedulableTriggerInputTypes } from 'expo-notifications';

export async function requestNotificationPermissions(): Promise<boolean> {
  if (!Device.isDevice) {
    return false;
  }
  const settings = await Notifications.getPermissionsAsync();
  if (settings.granted || settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL) {
    return true;
  }
  const res = await Notifications.requestPermissionsAsync();
  return res.granted || res.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL || false;
}

export async function scheduleLocalNotificationAt(date: Date, body: string, data?: Record<string, unknown>) {
  return Notifications.scheduleNotificationAsync({
    content: {
      title: 'Family Time',
      body,
      data,
    },
    trigger: { type: SchedulableTriggerInputTypes.DATE, date },
  });
}

export async function cancelNotification(id: string) {
  try {
    await Notifications.cancelScheduledNotificationAsync(id);
  } catch {
    // ignore
  }
}

export function configureNotificationHandling() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
      // Newer expo-notifications versions require these on iOS
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}



