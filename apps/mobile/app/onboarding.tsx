import React, { useRef, useState } from 'react';
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

const COLORS = {
  background: '#061113',
  surface: '#0B181B',
  surfaceElevated: '#102326',
  surfaceMuted: '#132B2E',

  primary: '#2DE1D6',
  primaryLight: '#92FFF7',
  primaryDark: '#12AAA4',

  white: '#F3FFFE',
  text: '#D7E8E7',
  muted: '#8AA6A5',
  subtle: '#5D7778',

  border: '#1B383A',
  borderStrong: '#285254',
};

type Slide = {
  eyebrow: string;
  title: string;
  description: string;
};

const SLIDES: Slide[] = [
  {
    eyebrow: 'WELCOME TO SNAPBRIEF',
    title: 'Turn messy thoughts\ninto clear briefs.',
    description:
      'Drop in your rough notes, ideas, or meeting details. SnapBrief uses AI to turn them into something clear, useful, and ready to act on.',
  },
  {
    eyebrow: 'LET AI DO THE SORTING',
    title: 'Less formatting.\nMore clarity.',
    description:
      'SnapBrief picks out the important details, summarizes the context, and turns scattered information into focused next steps.',
  },
  {
    eyebrow: 'READY WHEN YOU ARE',
    title: 'Capture it.\nStructure it.\nMove forward.',
    description:
      'Get a clean summary, action items, priority, due dates, and tags in seconds — without manually organizing everything.',
  },
];

function BrandMark() {
  return (
    <View style={styles.brandMarkShadow}>
      <LinearGradient
        colors={[
          COLORS.primaryLight,
          COLORS.primary,
          COLORS.primaryDark,
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.brandMark}
      >
        <Ionicons
          name="flash"
          size={21}
          color={COLORS.background}
        />
      </LinearGradient>
    </View>
  );
}

function Glow({
  size,
  top,
  left,
  opacity,
}: {
  size: number;
  top: number;
  left: number;
  opacity: number;
}) {
  return (
    <View
      style={[
        styles.glow,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          top,
          left,
          opacity,
        },
      ]}
    />
  );
}

function FirstVisual() {
  return (
    <View style={styles.visualArea}>
      <Glow size={190} top={56} left={58} opacity={0.07} />
      <Glow size={100} top={180} left={208} opacity={0.05} />

      <View style={styles.rawCard}>
        <View style={styles.cardHeader}>
          <View style={styles.statusDot} />
          <Text style={styles.microLabel}>RAW NOTES</Text>
        </View>

        <Text style={styles.rawText}>
          client meeting friday 3pm{'\n'}
          redesign homepage{'\n'}
          budget around 120k{'\n'}
          discuss payment terms
        </Text>

        <View style={styles.fakeLineShort} />
        <View style={styles.fakeLineLong} />
      </View>

      <View style={styles.magicButton}>
        <Ionicons
          name="sparkles"
          size={20}
          color={COLORS.background}
        />
      </View>

      <View style={styles.resultCard}>
        <View style={styles.cardHeader}>
          <View style={styles.resultIcon}>
            <Ionicons
              name="checkmark"
              size={12}
              color={COLORS.background}
            />
          </View>

          <Text style={styles.resultLabel}>AI BRIEF</Text>
        </View>

        <Text style={styles.resultTitle}>Website Redesign</Text>

        <View style={styles.infoRow}>
          <Ionicons
            name="calendar-outline"
            size={14}
            color={COLORS.primary}
          />
          <Text style={styles.infoText}>Friday · 3:00 PM</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons
            name="flag-outline"
            size={14}
            color={COLORS.primary}
          />
          <Text style={styles.infoText}>High priority</Text>
        </View>
      </View>
    </View>
  );
}

function SecondVisual() {
  return (
    <View style={styles.visualArea}>
      <Glow size={190} top={60} left={62} opacity={0.06} />
      <Glow size={120} top={165} left={202} opacity={0.05} />

      <View
        style={[
          styles.transformCard,
          styles.transformBack,
        ]}
      >
        <Text style={styles.transformLabel}>RAW</Text>
        <Text style={styles.transformTitle}>Notes</Text>

        <View style={styles.stackLines}>
          <View style={[styles.stackLine, { width: '86%' }]} />
          <View style={[styles.stackLine, { width: '69%' }]} />
          <View style={[styles.stackLine, { width: '78%' }]} />
          <View style={[styles.stackLine, { width: '58%' }]} />
        </View>
      </View>

      <View style={styles.arrowCircle}>
        <Ionicons
          name="arrow-forward"
          size={17}
          color={COLORS.primary}
        />
      </View>

      <View
        style={[
          styles.transformCard,
          styles.transformFront,
        ]}
      >
        <View style={styles.aiHeader}>
          <View style={styles.aiDot}>
            <Ionicons
              name="sparkles"
              size={10}
              color={COLORS.background}
            />
          </View>

          <Text style={styles.transformLabel}>AI</Text>
        </View>

        <Text style={styles.transformTitle}>Clarity</Text>

        <View style={styles.tag}>
          <Ionicons
            name="document-text-outline"
            size={12}
            color={COLORS.primary}
          />
          <Text style={styles.tagText}>Summary</Text>
        </View>

        <View style={styles.tag}>
          <Ionicons
            name="checkmark-circle-outline"
            size={12}
            color={COLORS.primary}
          />
          <Text style={styles.tagText}>Actions</Text>
        </View>

        <View style={styles.tag}>
          <Ionicons
            name="flag-outline"
            size={12}
            color={COLORS.primary}
          />
          <Text style={styles.tagText}>Priority</Text>
        </View>
      </View>
    </View>
  );
}

function ThirdVisual() {
  return (
    <View style={styles.visualArea}>
      <Glow size={200} top={52} left={53} opacity={0.07} />
      <Glow size={115} top={182} left={205} opacity={0.05} />

      <View style={styles.readyCard}>
        <View style={styles.readyHeader}>
          <View>
            <Text style={styles.readyEyebrow}>YOUR BRIEF</Text>
            <Text style={styles.readyTitle}>Ready to act</Text>
          </View>

          <View style={styles.readySpark}>
            <Ionicons
              name="sparkles"
              size={14}
              color={COLORS.background}
            />
          </View>
        </View>

        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>04</Text>
            <Text style={styles.statLabel}>POINTS</Text>
          </View>

          <View style={styles.stat}>
            <Text style={styles.statNumber}>03</Text>
            <Text style={styles.statLabel}>ACTIONS</Text>
          </View>

          <View style={styles.stat}>
            <Text style={styles.statNumber}>01</Text>
            <Text style={styles.statLabel}>PRIORITY</Text>
          </View>
        </View>

        <View style={styles.actionRow}>
          <View style={styles.actionCircle}>
            <Ionicons
              name="arrow-forward"
              size={11}
              color={COLORS.background}
            />
          </View>
          <Text style={styles.actionText}>
            Send revised proposal
          </Text>
        </View>

        <View style={styles.actionRow}>
          <View style={styles.actionCircle}>
            <Ionicons
              name="arrow-forward"
              size={11}
              color={COLORS.background}
            />
          </View>
          <Text style={styles.actionText}>
            Confirm payment terms
          </Text>
        </View>

        <View style={styles.priorityStrip}>
          <View style={styles.priorityDot} />
          <Text style={styles.priorityText}>
            HIGH PRIORITY
          </Text>
        </View>
      </View>
    </View>
  );
}

function SlideVisual({ index }: { index: number }) {
  if (index === 0) {
    return <FirstVisual />;
  }

  if (index === 1) {
    return <SecondVisual />;
  }

  return <ThirdVisual />;
}

export default function OnboardingScreen() {
  const scrollRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [finishing, setFinishing] = useState(false);

  const finishOnboarding = async () => {
    if (finishing) {
      return;
    }

    setFinishing(true);

    try {
      await AsyncStorage.setItem(
        'snapbrief_onboarding_complete',
        'true'
      );

      requestAnimationFrame(() => {
        router.replace('/(tabs)');
      });
    } catch {
      setFinishing(false);
    }
  };

  const handleNext = () => {
    if (currentIndex === SLIDES.length - 1) {
      finishOnboarding();
      return;
    }

    const nextIndex = currentIndex + 1;

    scrollRef.current?.scrollTo({
      x: nextIndex * width,
      animated: true,
    });
  };

  const handleScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const nextIndex = Math.round(
      event.nativeEvent.contentOffset.x / width
    );

    if (
      nextIndex >= 0 &&
      nextIndex < SLIDES.length &&
      nextIndex !== currentIndex
    ) {
      setCurrentIndex(nextIndex);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.background}
      />

      <SafeAreaView
        style={styles.safeArea}
        edges={['top', 'bottom']}
      >
        <View style={styles.topBar}>
          <View style={styles.brand}>
            <BrandMark />

            <View>
              <Text style={styles.brandName}>
                SnapBrief
              </Text>
              <Text style={styles.brandCaption}>
                AI NOTES, MADE USEFUL
              </Text>
            </View>
          </View>

          {currentIndex < SLIDES.length - 1 && (
            <Pressable
              onPress={finishOnboarding}
              disabled={finishing}
              hitSlop={12}
              style={styles.skipButton}
            >
              <Text style={styles.skipText}>Skip</Text>
            </Pressable>
          )}
        </View>

        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          bounces={false}
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onMomentumScrollEnd={handleScrollEnd}
          contentContainerStyle={styles.scrollContent}
        >
          {SLIDES.map((slide, index) => (
            <View style={styles.slide} key={slide.eyebrow}>
              <View style={styles.visualWrap}>
                <SlideVisual index={index} />
              </View>

              <View style={styles.copy}>
                <View style={styles.eyebrowRow}>
                  <View style={styles.eyebrowLine} />

                  <Text style={styles.eyebrow}>
                    {slide.eyebrow}
                  </Text>
                </View>

                <Text style={styles.title}>
                  {slide.title}
                </Text>

                <Text style={styles.description}>
                  {slide.description}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={styles.bottom}>
          <View style={styles.indicatorRow}>
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
            onPress={handleNext}
            disabled={finishing}
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.buttonPressed,
              finishing && styles.buttonDisabled,
            ]}
          >
            <Text style={styles.primaryButtonText}>
              {finishing
                ? 'Opening…'
                : currentIndex === SLIDES.length - 1
                  ? 'Start creating'
                  : 'Continue'}
            </Text>

            {!finishing && (
              <View style={styles.buttonIcon}>
                <Ionicons
                  name="arrow-forward"
                  size={17}
                  color={COLORS.background}
                />
              </View>
            )}
          </Pressable>

          <Text style={styles.footerText}>
            Your notes stay yours. SnapBrief only structures what
            you choose to provide.
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
    height: 74,
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

  brandMarkShadow: {
    width: 41,
    height: 41,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: COLORS.primary,
    shadowOpacity: 0.28,
    shadowRadius: 16,
    shadowOffset: {
      width: 0,
      height: 7,
    },
    elevation: 8,
  },

  brandMark: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  brandName: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.4,
  },

  brandCaption: {
    color: COLORS.subtle,
    fontSize: 7.5,
    fontWeight: '800',
    letterSpacing: 1.25,
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

  scrollContent: {
    alignItems: 'stretch',
  },

  slide: {
    width,
    paddingHorizontal: 22,
  },

  visualWrap: {
    height: Math.min(height * 0.42, 355),
    alignItems: 'center',
    justifyContent: 'center',
  },

  visualArea: {
    width: width - 44,
    height: 330,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },

  glow: {
    position: 'absolute',
    backgroundColor: COLORS.primary,
  },

  rawCard: {
    position: 'absolute',
    width: 234,
    height: 158,
    top: 48,
    left: 3,
    padding: 17,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    transform: [{ rotate: '-5deg' }],
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    elevation: 8,
  },

  resultCard: {
    position: 'absolute',
    width: 224,
    minHeight: 184,
    bottom: 30,
    right: 2,
    padding: 17,
    borderRadius: 21,
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    transform: [{ rotate: '5deg' }],
    shadowColor: '#000',
    shadowOpacity: 0.28,
    shadowRadius: 20,
    shadowOffset: {
      width: 0,
      height: 13,
    },
    elevation: 10,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 12,
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
  },

  microLabel: {
    color: COLORS.muted,
    fontSize: 8.5,
    fontWeight: '800',
    letterSpacing: 1.15,
  },

  rawText: {
    color: '#B2C8C7',
    fontSize: 12,
    lineHeight: 20,
  },

  fakeLineShort: {
    width: '40%',
    height: 4,
    borderRadius: 4,
    backgroundColor: '#203638',
    marginTop: 12,
  },

  fakeLineLong: {
    width: '69%',
    height: 4,
    borderRadius: 4,
    backgroundColor: '#1B3032',
    marginTop: 6,
  },

  magicButton: {
    position: 'absolute',
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    top: 123,
    left: width / 2 - 23,
    zIndex: 5,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.35,
    shadowRadius: 19,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 10,
  },

  resultIcon: {
    width: 20,
    height: 20,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
  },

  resultLabel: {
    color: COLORS.primaryLight,
    fontSize: 8.5,
    fontWeight: '800',
    letterSpacing: 1.1,
  },

  resultTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.6,
    marginBottom: 15,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 11,
  },

  infoText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '600',
  },

  transformCard: {
    position: 'absolute',
    width: 224,
    height: 205,
    padding: 19,
    borderRadius: 22,
    borderWidth: 1,
  },

  transformBack: {
    left: 5,
    top: 52,
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    transform: [{ rotate: '-6deg' }],
  },

  transformFront: {
    right: 3,
    bottom: 31,
    backgroundColor: COLORS.surfaceElevated,
    borderColor: COLORS.borderStrong,
    transform: [{ rotate: '5deg' }],
  },

  transformLabel: {
    color: COLORS.muted,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1.2,
  },

  transformTitle: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -1,
    marginTop: 10,
  },

  stackLines: {
    marginTop: 21,
    gap: 10,
  },

  stackLine: {
    height: 6,
    borderRadius: 4,
    backgroundColor: '#243B3D',
  },

  arrowCircle: {
    position: 'absolute',
    width: 43,
    height: 43,
    borderRadius: 14,
    left: width / 2 - 21.5,
    top: 130,
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
  },

  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  aiDot: {
    width: 20,
    height: 20,
    borderRadius: 7,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  tag: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginTop: 10,
    borderRadius: 9,
    backgroundColor: '#173437',
    borderWidth: 1,
    borderColor: '#275255',
  },

  tagText: {
    color: COLORS.primaryLight,
    fontSize: 9,
    fontWeight: '700',
  },

  readyCard: {
    width: 312,
    minHeight: 265,
    padding: 21,
    borderRadius: 24,
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    shadowColor: '#000',
    shadowOpacity: 0.28,
    shadowRadius: 26,
    shadowOffset: {
      width: 0,
      height: 16,
    },
    elevation: 10,
  },

  readyHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 19,
  },

  readyEyebrow: {
    color: COLORS.primary,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1.3,
  },

  readyTitle: {
    color: COLORS.white,
    fontSize: 25,
    fontWeight: '800',
    letterSpacing: -0.7,
    marginTop: 4,
  },

  readySpark: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  stats: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 18,
  },

  stat: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#0B191B',
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  statNumber: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: '800',
  },

  statLabel: {
    color: COLORS.subtle,
    fontSize: 7.5,
    fontWeight: '800',
    letterSpacing: 0.7,
    marginTop: 2,
  },

  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    marginBottom: 10,
  },

  actionCircle: {
    width: 20,
    height: 20,
    borderRadius: 7,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  actionText: {
    color: COLORS.text,
    fontSize: 11.5,
    fontWeight: '600',
  },

  priorityStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: 2,
    paddingTop: 11,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },

  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
  },

  priorityText: {
    color: COLORS.primaryLight,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1,
  },

  copy: {
    paddingTop: 5,
  },

  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },

  eyebrowLine: {
    width: 23,
    height: 2,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
  },

  eyebrow: {
    color: COLORS.primary,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.45,
  },

  title: {
    color: COLORS.white,
    fontSize: 35,
    lineHeight: 39,
    fontWeight: '900',
    letterSpacing: -1.3,
  },

  description: {
    color: COLORS.muted,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 14,
    maxWidth: 355,
  },

  bottom: {
    paddingHorizontal: 22,
    paddingTop: 9,
    paddingBottom: 15,
  },

  indicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 15,
  },

  indicator: {
    width: 5,
    height: 5,
    borderRadius: 5,
    backgroundColor: '#294345',
  },

  indicatorActive: {
    width: 25,
    backgroundColor: COLORS.primary,
  },

  primaryButton: {
    height: 58,
    borderRadius: 17,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  buttonPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.985 }],
  },

  buttonDisabled: {
    opacity: 0.65,
  },

  primaryButtonText: {
    color: COLORS.background,
    fontSize: 15,
    fontWeight: '900',
  },

  buttonIcon: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: 'rgba(6,17,19,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  footerText: {
    color: '#527071',
    textAlign: 'center',
    fontSize: 9.5,
    lineHeight: 14,
    marginTop: 10,
  },
});
