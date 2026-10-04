import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { colors } from '@/theme';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />

      <Stack
        initialRouteName="splash"
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: colors.bg,
          },
          animation: 'fade',
          gestureEnabled: false,
        }}
      >
        <Stack.Screen
          name="splash"
          options={{
            animation: 'none',
          }}
        />

        <Stack.Screen name="onboarding" />

        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  );
}