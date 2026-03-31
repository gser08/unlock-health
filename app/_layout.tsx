import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  // NOTE: expo-notifications Push functionality was removed from Expo Go in SDK 53+.
  // Notifications will be re-enabled when we switch to a Development Build.
  // For now, the layout is clean so the app can load without crashing.

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
