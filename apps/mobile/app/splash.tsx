import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { colors, radius } from '@/theme';

export default function SplashScreen() {
  const markScale = useRef(new Animated.Value(0.86)).current;
  const markOpacity = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentY = useRef(new Animated.Value(10)).current;
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let mounted = true;

    Animated.sequence([
      Animated.parallel([
        Animated.timing(markOpacity, {
          toValue: 1,
          duration: 350,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),

        Animated.spring(markScale, {
          toValue: 1,
          friction: 7,
          tension: 70,
          useNativeDriver: true,
        }),
      ]),

      Animated.parallel([
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 320,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),

        Animated.timing(contentY, {
          toValue: 0,
          duration: 320,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),

      Animated.timing(progress, {
        toValue: 1,
        duration: 650,
        easing: Easing.out(Easing.cubic),
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
    contentOpacity,
    contentY,
    markOpacity,
    markScale,
    progress,
  ]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* =========================================================
          BRAND
      ========================================================= */}

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
            size={29}
            color={colors.bg}
          />
        </Animated.View>

        {/* =======================================================
            IDENTITY
        ======================================================= */}

        <Animated.View
          style={[
            styles.identity,
            {
              opacity: contentOpacity,
              transform: [{ translateY: contentY }],
            },
          ]}
        >
          <Text style={styles.wordmark}>
            SnapBrief
          </Text>

          <Text style={styles.tagline}>
            Turn noise into clarity.
          </Text>

          {/* =====================================================
              LOADING
          ===================================================== */}

          <View style={styles.progressTrack}>
            <Animated.View
              style={[
                styles.progressValue,
                {
                  width: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>
        </Animated.View>
      </View>

      {/* =========================================================
          FOOTER
      ========================================================= */}

      <Animated.View
        style={[
          styles.footer,
          {
            opacity: contentOpacity,
          },
        ]}
      >
        <Text style={styles.footerLabel}>
          SNAPBRIEF AI
        </Text>

        <View style={styles.footerDot} />

        <Text style={styles.footerText}>
          AI NOTES, MADE USEFUL
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  /* ============================================================
     SCREEN
  ============================================================ */

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
    paddingHorizontal: 28,
  },

  /* ============================================================
     BRAND MARK
  ============================================================ */

  mark: {
    width: 64,
    height: 64,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: colors.accent,

    shadowColor: colors.accent,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.14,
    shadowRadius: 14,
    elevation: 6,

    marginBottom: 18,
  },

  /* ============================================================
     IDENTITY
  ============================================================ */

  identity: {
    alignItems: 'center',
  },

  wordmark: {
    color: colors.white,
    fontSize: 29,
    lineHeight: 34,
    fontWeight: '800',
    letterSpacing: -0.8,
  },

  tagline: {
    color: colors.muted,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '500',
    marginTop: 6,
  },

  /* ============================================================
     PROGRESS
  ============================================================ */

  progressTrack: {
    width: 84,
    height: 2,
    overflow: 'hidden',
    borderRadius: radius.pill,
    backgroundColor: colors.border,
    marginTop: 20,
  },

  progressValue: {
    height: '100%',
    borderRadius: radius.pill,
    backgroundColor: colors.accent,
  },

  /* ============================================================
     FOOTER
  ============================================================ */

  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 29,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  footerLabel: {
    color: colors.accentSoft,
    fontSize: 7,
    lineHeight: 9,
    fontWeight: '900',
    letterSpacing: 1.15,
  },

  footerDot: {
    width: 3,
    height: 3,
    borderRadius: radius.pill,
    backgroundColor: colors.border,
    marginHorizontal: 7,
  },

  footerText: {
    color: colors.dim,
    fontSize: 7,
    lineHeight: 9,
    fontWeight: '800',
    letterSpacing: 0.9,
  },
});