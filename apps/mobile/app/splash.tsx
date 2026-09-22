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
import { StatusBar } from 'expo-status-bar';

const COLORS = {
  bg: '#061113',
  aqua: '#2DE1D6',
  aquaSoft: '#92FFF7',
  white: '#F3FFFE',
  muted: '#6F8C8C',
};

export default function SplashScreen() {
  const markScale = useRef(new Animated.Value(0.72)).current;
  const markOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const lineWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let mounted = true;

    Animated.sequence([
      Animated.parallel([
        Animated.timing(markOpacity, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.spring(markScale, {
          toValue: 1,
          friction: 7,
          tension: 60,
          useNativeDriver: true,
        }),
      ]),

      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 350,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),

      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 350,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),

      Animated.timing(lineWidth, {
        toValue: 1,
        duration: 550,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }),
    ]).start();

    const timer = setTimeout(async () => {
      if (!mounted) return;

      try {
        const completed = await AsyncStorage.getItem(
          'snapbrief_onboarding_complete'
        );

        if (!mounted) return;

        if (completed) {
          router.replace('/(tabs)');
        } else {
          router.replace('/onboarding');
        }
      } catch {
        if (!mounted) return;
        router.replace('/onboarding');
      }
    }, 1800);

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [
    markScale,
    markOpacity,
    textOpacity,
    taglineOpacity,
    lineWidth,
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
          <Text style={styles.markSymbol}>✦</Text>
        </Animated.View>

        <Animated.Text
          style={[
            styles.title,
            {
              opacity: textOpacity,
            },
          ]}
        >
          SNAPBRIEF
        </Animated.Text>

        <Animated.Text
          style={[
            styles.aiText,
            {
              opacity: textOpacity,
            },
          ]}
        >
          AI
        </Animated.Text>

        <Animated.Text
          style={[
            styles.tagline,
            {
              opacity: taglineOpacity,
            },
          ]}
        >
          Turn noise into clarity.
        </Animated.Text>

        <Animated.View
          style={[
            styles.line,
            {
              width: lineWidth.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '42%'],
              }),
            },
          ]}
        />
      </View>

      <Text style={styles.bottomText}>Simple. Clear. Actionable.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },

  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  mark: {
    width: 68,
    height: 68,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.aqua,
    marginBottom: 20,

    shadowColor: COLORS.aqua,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 8,
  },

  markSymbol: {
    color: COLORS.bg,
    fontSize: 30,
    fontWeight: '800',
    marginTop: -2,
  },

  title: {
    color: COLORS.white,
    fontSize: 25,
    fontWeight: '800',
    letterSpacing: 4,
  },

  aiText: {
    color: COLORS.aqua,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 4,
    marginTop: 5,
  },

  tagline: {
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: '500',
    marginTop: 18,
    letterSpacing: 0.2,
  },

  line: {
    height: 2,
    borderRadius: 10,
    backgroundColor: COLORS.aqua,
    marginTop: 22,
  },

  bottomText: {
    position: 'absolute',
    bottom: 34,
    color: COLORS.muted,
    fontSize: 10,
    letterSpacing: 0.8,
  },
});