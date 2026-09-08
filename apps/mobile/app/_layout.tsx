import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkOnboarding = async () => {
      try {
        const completed = await AsyncStorage.getItem(
          'snapbrief_onboarding_complete'
        );

        if (!mounted) return;

        setShowOnboarding(!completed);
      } catch {
        if (!mounted) return;

        // Safer fallback: show onboarding if storage cannot be read.
        setShowOnboarding(true);
      } finally {
        if (mounted) {
          setCheckingOnboarding(false);
        }
      }
    };

    checkOnboarding();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (checkingOnboarding) return;

    // Give Expo Router one render cycle to mount the Stack.
    const timer = setTimeout(() => {
      if (showOnboarding) {
        router.replace('/onboarding');
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [checkingOnboarding, showOnboarding]);

  if (checkingOnboarding) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#071113',
        }}
      />
    );
  }

  return (
    <>
      <StatusBar style="light" />

      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: '#071113',
          },
        }}
      >
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