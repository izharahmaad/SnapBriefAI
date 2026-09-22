import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import { colors } from '@/theme';

export default function SplashScreen() {
  const markScale = useRef(new Animated.Value(0.88)).current;
  const markOpacity = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const lineProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let mounted = true;

    Animated.sequence([
      Animated.parallel([
        Animated.timing(markOpacity, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),

        Animated.spring(markScale, {
          toValue: 1,
          friction: 7,
          tension: 70,
          useNativeDriver: true,
        }),
      ]),

      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 350,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),

      Animated.timing(lineProgress, {
        toValue: 1,
        duration: 650,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }),
    ]).start();

    const timer = setTimeout(async () => {
      if (!mounted) {
        return;
      }

      try {
        const completed = await AsyncStorage.getItem(
          'snapbrief_onboarding_complete',
        );

        if (!mounted) {
          return;
        }

        router.replace(
          completed ? '/(tabs)' : '/onboarding',
        );
      } catch {
        if (!mounted) {
          return;
        }

        router.replace('/onboarding');
      }
    }, 1750);

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [
    markScale,
    markOpacity,
    contentOpacity,
    lineProgress,
  ]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.center}>
        <Animated.View
          style={[
            styles.mark,
            {
              opacity: markOpacity,
              transform: [{ scale: markScale }],
            },
          ]}
        >
          <Ionicons
            name="document-text-outline"
            size={30}
            color={colors.bg}
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.content,
            {
              opacity: contentOpacity,
            },
          ]}
        >
          <Text style={styles.wordmark}>
            SnapBrief
          </Text>

          <Text style={styles.tagline}>
            Turn noise into clarity.
          </Text>

          <View style={styles.lineTrack}>
            <Animated.View
              style={[
                styles.lineActive,
                {
                  width: lineProgress.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>
        </Animated.View>
      </View>

      <Animated.Text
        style={[
          styles.bottomText,
          {
            opacity: contentOpacity,
          },
        ]}
      >
        AI NOTES · MADE USEFUL
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },

  center: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },

  mark: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    shadowColor: colors.accent,
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 7,
    marginBottom: 18,
  },

  content: {
    alignItems: 'center',
  },

  wordmark: {
    color: colors.white,
    fontSize: 27,
    lineHeight: 32,
    fontWeight: '800',
    letterSpacing: -0.7,
  },

  tagline: {
    color: colors.muted,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '500',
    marginTop: 7,
  },

  lineTrack: {
    width: 86,
    height: 2,
    overflow: 'hidden',
    borderRadius: 999,
    backgroundColor: colors.border,
    marginTop: 20,
  },

  lineActive: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: colors.accent,
  },

  bottomText: {
    position: 'absolute',
    bottom: 30,
    color: colors.dim,
    fontSize: 7,
    lineHeight: 9,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
});