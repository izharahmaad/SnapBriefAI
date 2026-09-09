import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const prepare = async () => {
      try {
        await AsyncStorage.getItem('snapbrief_onboarding_complete');
      } finally {
        setChecking(false);
      }
    };

    prepare();
  }, []);

  if (checking) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#061113',
        }}
      />
    );
  }

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
        }}
      >
        <Stack.Screen
          name="splash"
          options={{
            gestureEnabled: false,
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