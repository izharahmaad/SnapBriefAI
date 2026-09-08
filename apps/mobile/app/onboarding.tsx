import React, { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

const COLORS = {
  background: '#071113',
  surface: '#0D1A1D',
  surfaceLight: '#112326',
  primary: '#27D7D0',
  primarySoft: '#8AF4EF',
  primaryDark: '#159E9A',
  white: '#F4FFFF',
  text: '#D9E9E8',
  muted: '#87A3A3',
  border: '#1B393C',
};

const SLIDES = [
  {
    eyebrow: 'WELCOME TO SNAPBRIEF',
    title: 'Turn messy thoughts\ninto clear briefs.',
    description:
      'Capture your ideas, notes, and conversations in seconds. SnapBrief uses AI to turn them into something you can actually use.',
  },
  {
    eyebrow: 'LET AI ORGANIZE IT',
    title: 'From raw notes\nto clear action.',
    description:
      'SnapBrief finds the important details, summarizes the context, and turns scattered notes into focused next steps.',
  },
  {
    eyebrow: 'READY WHEN YOU ARE',
    title: 'Capture it.\nStructure it.\nMove forward.',
    description:
      'Get concise summaries, action items, priorities, and useful tags without spending time formatting everything yourself.',
  },
];

function BrandMark() {
  return (
    <View style={styles.brandMark}>
      <LinearGradient
        colors={[COLORS.primarySoft, COLORS.primary, COLORS.primaryDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.brandGradient}
      >
        <Ionicons name="flash" size={24} color={COLORS.background} />
      </LinearGradient>
    </View>
  );
}

function FeatureVisual({ index }: { index: number }) {
  if (index === 0) {
    return (
      <View style={styles.visualFrame}>
        <View style={styles.glowOne} />
        <View style={styles.glowTwo} />

        <View style={styles.noteCard}>
          <View style={styles.noteTop}>
            <View style={styles.tinyDot} />
            <Text style={styles.noteLabel}>RAW NOTES</Text>
          </View>

          <Text style={styles.noteText}>
            client meeting friday 3pm{'\n'}
            redesign homepage{'\n'}
            budget maybe 120k{'\n'}
            discuss payment
          </Text>

          <View style={styles.lineShort} />
          <View style={styles.lineLong} />
        </View>

        <View style={styles.centerIcon}>
          <Ionicons name="sparkles" size={21} color={COLORS.background} />
        </View>

        <View style={styles.briefCard}>
          <View style={styles.briefTop}>
            <View style={styles.briefIcon}>
              <Ionicons
                name="checkmark"
                size={13}
                color={COLORS.background}
              />
            </View>

            <Text style={styles.briefLabel}>AI BRIEF</Text>
          </View>

          <Text style={styles.briefTitle}>Website Redesign</Text>

          <View style={styles.briefRow}>
            <Ionicons
              name="calendar-outline"
              size={13}
              color={COLORS.primary}
            />
            <Text style={styles.briefRowText}>Friday · 3:00 PM</Text>
          </View>

          <View style={styles.briefRow}>
            <Ionicons
              name="flash-outline"
              size={13}
              color={COLORS.primary}
            />
            <Text style={styles.briefRowText}>High priority</Text>
          </View>
        </View>
      </View>
    );
  }

  if (index === 1) {
    return (
      <View style={styles.visualFrame}>
        <View style={styles.glowOne} />
        <View style={styles.glowTwo} />

        <View style={[styles.flowCard, styles.flowBack]}>
          <Text style={styles.flowSmall}>RAW</Text>
          <Text style={styles.flowLarge}>Notes</Text>

          <View style={styles.flowLines}>
            <View style={styles.flowLineOne} />
            <View style={styles.flowLineTwo} />
            <View style={styles.flowLineThree} />
          </View>
        </View>

        <View style={styles.flowArrow}>
          <Ionicons
            name="arrow-forward"
            size={17}
            color={COLORS.primary}
          />
        </View>

        <View style={[styles.flowCard, styles.flowFront]}>
          <View style={styles.flowHeader}>
            <View style={styles.checkCircle}>
              <Ionicons
                name="checkmark"
                size={11}
                color={COLORS.background}
              />
            </View>

            <Text style={styles.flowSmall}>AI</Text>
          </View>

          <Text style={styles.flowLarge}>Clarity</Text>

          <View style={styles.miniPill}>
            <Text style={styles.miniPillText}>Summary</Text>
          </View>

          <View style={styles.miniPill}>
            <Text style={styles.miniPillText}>Actions</Text>
          </View>

          <View style={styles.miniPill}>
            <Text style={styles.miniPillText}>Priority</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.visualFrame}>
      <View style={styles.glowOne} />
      <View style={styles.glowTwo} />

      <View style={styles.finalCard}>
        <View style={styles.finalHeader}>
          <View>
            <Text style={styles.finalEyebrow}>YOUR BRIEF</Text>
            <Text style={styles.finalTitle}>Ready to act</Text>
          </View>

          <View style={styles.finalBadge}>
            <Ionicons
              name="sparkles"
              size={13}
              color={COLORS.background}
            />
          </View>
        </View>

        <View style={styles.statRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>04</Text>
            <Text style={styles.statLabel}>Points</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statNumber}>03</Text>
            <Text style={styles.statLabel}>Actions</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statNumber}>01</Text>
            <Text style={styles.statLabel}>Priority</Text>
          </View>
        </View>

        <View style={styles.actionItem}>
          <View style={styles.actionIcon}>
            <Ionicons
              name="arrow-forward"
              size={12}
              color={COLORS.background}
            />
          </View>

          <Text style={styles.actionText}>Send revised proposal</Text>
        </View>

        <View style={styles.actionItem}>
          <View style={styles.actionIcon}>
            <Ionicons
              name="arrow-forward"
              size={12}
              color={COLORS.background}
            />
          </View>

          <Text style={styles.actionText}>Confirm payment terms</Text>
        </View>
      </View>
    </View>
  );
}

export default function OnboardingScreen() {
  const scrollRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const completeOnboarding = async () => {
    await AsyncStorage.setItem(
      'snapbrief_onboarding_complete',
      'true'
    );

    router.replace('/(tabs)');
  };

  const next = () => {
    if (currentIndex === SLIDES.length - 1) {
      completeOnboarding();
      return;
    }

    const nextIndex = currentIndex + 1;

    scrollRef.current?.scrollTo({
      x: nextIndex * width,
      animated: true,
    });

    setCurrentIndex(nextIndex);
  };

  const handleScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const index = Math.round(
      event.nativeEvent.contentOffset.x / width
    );

    setCurrentIndex(index);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topBar}>
          <View style={styles.brand}>
            <BrandMark />

            <View>
              <Text style={styles.brandName}>SnapBrief</Text>
              <Text style={styles.brandCaption}>
                AI NOTES, MADE USEFUL
              </Text>
            </View>
          </View>

          {currentIndex < SLIDES.length - 1 && (
            <Pressable
              onPress={completeOnboarding}
              hitSlop={12}
              style={styles.skipButton}
            >
              <Text style={styles.skipText}>Skip</Text>
            </Pressable>
          )}
        </View>

        <Animated.ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScrollEnd}
          scrollEventThrottle={16}
          bounces={false}
        >
          {SLIDES.map((item, index) => (
            <View style={styles.slide} key={item.eyebrow}>
              <View style={styles.visualWrap}>
                <FeatureVisual index={index} />
              </View>

              <View style={styles.copy}>
                <View style={styles.eyebrowRow}>
                  <View style={styles.eyebrowLine} />

                  <Text style={styles.eyebrow}>
                    {item.eyebrow}
                  </Text>
                </View>

                <Text style={styles.title}>{item.title}</Text>

                <Text style={styles.description}>
                  {item.description}
                </Text>
              </View>
            </View>
          ))}
        </Animated.ScrollView>

        <View style={styles.bottom}>
          <View style={styles.indicators}>
            {SLIDES.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  index === currentIndex &&
                    styles.indicatorActive,
                ]}
              />
            ))}
          </View>

          <Pressable
            onPress={next}
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.primaryButtonPressed,
            ]}
          >
            <Text style={styles.primaryButtonText}>
              {currentIndex === SLIDES.length - 1
                ? 'Start creating'
                : 'Continue'}
            </Text>

            <View style={styles.buttonIcon}>
              <Ionicons
                name={
                  currentIndex === SLIDES.length - 1
                    ? 'arrow-forward'
                    : 'chevron-forward'
                }
                size={17}
                color={COLORS.background}
              />
            </View>
          </Pressable>

          <Text style={styles.privacy}>
            Your notes stay yours. AI is used only to structure what
            you provide.
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  safeArea: {
    flex: 1,
  },

  topBar: {
    height: 76,
    paddingHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },

  brandMark: {
    width: 42,
    height: 42,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: COLORS.primary,
    shadowOpacity: 0.25,
    shadowRadius: 14,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    elevation: 8,
  },

  brandGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  brandName: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.3,
  },

  brandCaption: {
    color: COLORS.muted,
    fontSize: 7.5,
    fontWeight: '800',
    letterSpacing: 1.3,
    marginTop: 2,
  },

  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },

  skipText: {
    color: COLORS.muted,
    fontSize: 14,
    fontWeight: '600',
  },

  slide: {
    width,
    paddingHorizontal: 22,
  },

  visualWrap: {
    height: 345,
    alignItems: 'center',
    justifyContent: 'center',
  },

  visualFrame: {
    width: width - 44,
    height: 320,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },

  glowOne: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 180,
    backgroundColor: COLORS.primary,
    opacity: 0.07,
    top: 50,
    left: 70,
  },

  glowTwo: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 120,
    backgroundColor: COLORS.primarySoft,
    opacity: 0.05,
    bottom: 30,
    right: 80,
  },

  noteCard: {
    position: 'absolute',
    width: 236,
    minHeight: 156,
    top: 55,
    left: 4,
    backgroundColor: '#0D191B',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    padding: 17,
    transform: [{ rotate: '-5deg' }],
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    elevation: 8,
  },

  noteTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 14,
  },

  tinyDot: {
    width: 6,
    height: 6,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
  },

  noteLabel: {
    color: COLORS.muted,
    fontSize: 8.5,
    fontWeight: '800',
    letterSpacing: 1,
  },

  noteText: {
    color: '#AFC5C4',
    fontSize: 12,
    lineHeight: 20,
  },

  lineShort: {
    width: '40%',
    height: 4,
    borderRadius: 5,
    backgroundColor: '#203336',
    marginTop: 13,
  },

  lineLong: {
    width: '66%',
    height: 4,
    borderRadius: 5,
    backgroundColor: '#203336',
    marginTop: 6,
  },

  centerIcon: {
    position: 'absolute',
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    left: width / 2 - 23,
    top: 126,
    zIndex: 5,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.32,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 9,
  },

  briefCard: {
    position: 'absolute',
    width: 224,
    minHeight: 185,
    right: 3,
    bottom: 34,
    backgroundColor: '#102123',
    borderWidth: 1,
    borderColor: '#285155',
    borderRadius: 21,
    padding: 16,
    transform: [{ rotate: '5deg' }],
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    elevation: 10,
  },

  briefTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 13,
  },

  briefIcon: {
    width: 20,
    height: 20,
    borderRadius: 7,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  briefLabel: {
    color: COLORS.primarySoft,
    fontSize: 8.5,
    fontWeight: '800',
    letterSpacing: 1,
  },

  briefTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 14,
  },

  briefRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },

  briefRowText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '600',
  },

  flowCard: {
    position: 'absolute',
    width: 224,
    height: 205,
    borderRadius: 22,
    borderWidth: 1,
    padding: 19,
  },

  flowBack: {
    left: 5,
    top: 55,
    backgroundColor: '#0C1719',
    borderColor: COLORS.border,
    transform: [{ rotate: '-6deg' }],
  },

  flowFront: {
    right: 4,
    bottom: 30,
    backgroundColor: '#112426',
    borderColor: '#2A5558',
    transform: [{ rotate: '5deg' }],
  },

  flowSmall: {
    color: COLORS.muted,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1.2,
  },

  flowLarge: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: '800',
    marginTop: 10,
    letterSpacing: -1,
  },

  flowLines: {
    marginTop: 22,
    gap: 10,
  },

  flowLineOne: {
    width: '82%',
    height: 6,
    borderRadius: 4,
    backgroundColor: '#294246',
  },

  flowLineTwo: {
    width: '64%',
    height: 6,
    borderRadius: 4,
    backgroundColor: '#22383B',
  },

  flowLineThree: {
    width: '74%',
    height: 6,
    borderRadius: 4,
    backgroundColor: '#22383B',
  },

  flowArrow: {
    position: 'absolute',
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    left: width / 2 - 21,
    top: 133,
    zIndex: 10,
  },

  flowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  miniPill: {
    alignSelf: 'flex-start',
    marginTop: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#173236',
    borderWidth: 1,
    borderColor: '#265055',
  },

  miniPillText: {
    color: COLORS.primarySoft,
    fontSize: 9,
    fontWeight: '700',
  },

  finalCard: {
    width: 310,
    minHeight: 255,
    backgroundColor: '#102124',
    borderWidth: 1,
    borderColor: '#295256',
    borderRadius: 24,
    padding: 21,
    shadowColor: '#000',
    shadowOpacity: 0.28,
    shadowRadius: 26,
    shadowOffset: {
      width: 0,
      height: 17,
    },
    elevation: 10,
  },

  finalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 22,
  },

  finalEyebrow: {
    color: COLORS.primary,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1.25,
  },

  finalTitle: {
    color: COLORS.white,
    fontSize: 25,
    fontWeight: '800',
    marginTop: 4,
    letterSpacing: -0.7,
  },

  finalBadge: {
    width: 33,
    height: 33,
    borderRadius: 11,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  statRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 19,
  },

  statBox: {
    flex: 1,
    backgroundColor: '#0C1A1C',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 10,
    alignItems: 'center',
  },

  statNumber: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: '800',
  },

  statLabel: {
    color: COLORS.muted,
    fontSize: 8.5,
    fontWeight: '700',
    marginTop: 2,
  },

  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    marginBottom: 10,
  },

  actionIcon: {
    width: 20,
    height: 20,
    borderRadius: 7,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  actionText: {
    color: COLORS.text,
    fontSize: 11,
    fontWeight: '600',
  },

  copy: {
    paddingTop: 2,
  },

  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },

  eyebrowLine: {
    width: 22,
    height: 2,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
  },

  eyebrow: {
    color: COLORS.primary,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.5,
  },

  title: {
    color: COLORS.white,
    fontSize: 35,
    lineHeight: 39,
    fontWeight: '900',
    letterSpacing: -1.2,
  },

  description: {
    color: COLORS.muted,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 14,
    maxWidth: 345,
  },

  bottom: {
    paddingHorizontal: 22,
    paddingTop: 8,
    paddingBottom: 20,
  },

  indicators: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },

  indicator: {
    height: 5,
    width: 5,
    borderRadius: 5,
    backgroundColor: '#294346',
  },

  indicatorActive: {
    width: 25,
    backgroundColor: COLORS.primary,
  },

  primaryButton: {
    height: 58,
    borderRadius: 17,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  primaryButtonPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.985 }],
  },

  primaryButtonText: {
    color: COLORS.background,
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: -0.1,
  },

  buttonIcon: {
    position: 'absolute',
    right: 7,
    top: 7,
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: 'rgba(7,17,19,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  privacy: {
    color: '#537274',
    textAlign: 'center',
    fontSize: 9.5,
    lineHeight: 14,
    marginTop: 11,
  },
});
