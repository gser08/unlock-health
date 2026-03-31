import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { isOctober } from '../utils/donationLogic';

// Default notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {
  useEffect(() => {
    async function setupNotifications() {
      // Only schedule in October to prevent annoying users out of season
      if (!isOctober()) return;

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        return;
      }

      // First clear any existing ones so we don't multiply them
      await Notifications.cancelAllScheduledNotificationsAsync();

      // Schedule a daily repeating notification at 10:00 AM
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "¡Desbloquea una donación hoy! 🎀",
          body: "Tómate 1 minuto para practicar tu autoexamen. Una marca donará por ti.",
          data: { data: 'goes here' },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: 10,
          minute: 0,
        },
      });
    }

    setupNotifications();
  }, []);

  return (
    <>
      <StatusBar style="light" />
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </>
  );
}
