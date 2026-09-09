import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />

      <Stack
        initialRouteName="splash"
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: '#061113',
          },
          animation: 'fade',
        }}
      >
        <Stack.Screen
          name="splash"
          options={{
            gestureEnabled: false,
            animation: 'none',
          }}
        />

        <Stack.Screen
          name="onboarding"
          options={{
            gestureEnabled: false,
          }}
        />

        <Stack.Screen
          name="(tabs)"
          options={{
            gestureEnabled: false,
          }}
        />
      </Stack>
    </>
  );
}