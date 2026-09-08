import React, { useRef, useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const COLORS = {
  background: '#061113',
  surface: '#0B181B',
  surfaceElevated: '#102326',
  surfaceMuted: '#132B2E',

  primary: '#2DE1D6',
  primarySoft: '#92FFF7',
  primaryDark: '#12AAA4',

  white: '#F3FFFE',
  text: '#D7E8E7',
  muted: '#87A6A5',
  subtle: '#5D7778',

  border: '#1B383A',
  borderStrong: '#2A5558',
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
      'Drop in rough notes, ideas, or meeting details. SnapBrief uses AI to turn them into something clear, useful, and ready to act on.',
  },
  {
    eyebrow: 'LET AI DO THE SORTING',
    title: 'Less formatting.\nMore clarity.',
    description:
      'SnapBrief finds the important details, summarizes the context, and turns scattered information into focused next steps.',
  },
  {
    eyebrow: 'READY WHEN YOU ARE',
    title: 'Capture it.\nStructure it.\nMove forward.',
    description:
      'Get a clean summary, action items, priority, due dates, and tags in seconds — without manually organizing everything.',
  },
];

function BrandMark({ size = 42 }: { size?: number }) {
  return (
    <View
      style={[
        styles.brandMarkShadow,
        {
          width: size,
          height: size,
          borderRadius: size * 0.34,
        },
      ]}
    >
      <LinearGradient
        colors={[
          COLORS.primarySoft,
          COLORS.primary,
          COLORS.primaryDark,
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.brandMark,
          {
            borderRadius: size * 0.34,
          },
        ]}
      >
        <Ionicons
          name="flash"
          size={size * 0.52}
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
      pointerEvents="none"
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

function FirstVisual({ cardWidth }: { cardWidth: number }) {
  const rawWidth = Math.min(cardWidth * 0.72, 245);
  const resultWidth = Math.min(cardWidth * 0.68, 230);

  return (
    <View style={styles.visualArea}>
      <Glow
        size={Math.min(cardWidth * 0.65, 210)}
        top={40}
        left={cardWidth * 0.17}
        opacity={0.065}
      />

      <Glow
        size={95}
        top={185}
        left={cardWidth * 0.62}
        opacity={0.045}
      />

      <View
        style={[
          styles.rawCard,
          {
            width: rawWidth,
            left: Math.max(0, cardWidth * 0.01),
          },
        ]}
      >
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

      <View
        style={[
          styles.magicButton,
          {
            left: cardWidth / 2 - 23,
          },
        ]}
      >
        <Ionicons
          name="sparkles"
          size={20}
          color={COLORS.background}
        />
      </View>

      <View
        style={[
          styles.resultCard,
          {
            width: resultWidth,
            right: Math.max(0, cardWidth * 0.01),
          },
        ]}
      >
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

function SecondVisual({ cardWidth }: { cardWidth: number }) {
  const flowWidth = Math.min(cardWidth * 0.69, 225);

  return (
    <View style={styles.visualArea}>
      <Glow
        size={Math.min(cardWidth * 0.65, 210)}
        top={48}
        left={cardWidth * 0.16}
        opacity={0.06}
      />

      <View
        style={[
          styles.transformCard,
          styles.transformBack,
          {
            width: flowWidth,
          },
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

      <View
        style={[
          styles.arrowCircle,
          {
            left: cardWidth / 2 - 21,
          },
        ]}
      >
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
          {
            width: flowWidth,
          },
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

function ThirdVisual({ cardWidth }: { cardWidth: number }) {
  const width = Math.min(cardWidth * 0.92, 335);

  return (
    <View style={styles.visualArea}>
      <Glow
        size={Math.min(cardWidth * 0.65, 210)}
        top={42}
        left={cardWidth * 0.17}
        opacity={0.07}
      />

      <View style={[styles.readyCard, { width }]}>
        <View style={styles.readyHeader}>
          <View style={styles.readyTitleBlock}>
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

function SlideVisual({
  index,
  width,
}: {
  index: number;
  width: number;
}) {
  if (index === 0) {
    return <FirstVisual cardWidth={width} />;
  }

  if (index === 1) {
    return <SecondVisual cardWidth={width} />;
  }

  return <ThirdVisual cardWidth={width} />;
}

export default function OnboardingScreen() {
  const { width, height } = useWindowDimensions();

  const isSmallPhone = height < 700;
  const isLargeScreen = width >= 600;

  const contentWidth = Math.min(width - 32, 520);

  const visualHeight = isSmallPhone
    ? Math.min(height * 0.34, 265)
    : isLargeScreen
      ? Math.min(height * 0.40, 390)
      : Math.min(height * 0.42, 340);

  const titleSize = isLargeScreen
    ? 43
    : isSmallPhone
      ? 29
      : 34;

  const titleLineHeight = isLargeScreen
    ? 48
    : isSmallPhone
      ? 34
      : 39;

  const descriptionSize = isLargeScreen ? 16 : 14;

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

  const goNext = () => {
    if (currentIndex === SLIDES.length - 1) {
      finishOnboarding();
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
    const nextIndex = Math.round(
      event.nativeEvent.contentOffset.x / width
    );

    if (
      nextIndex >= 0 &&
      nextIndex < SLIDES.length
    ) {
      setCurrentIndex(nextIndex);
    }
  };

  const slide = SLIDES[currentIndex];

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.background}
      />

      <SafeAreaView
        style={[
          styles.safeArea,
          {
            paddingHorizontal: isLargeScreen ? 34 : 16,
          },
        ]}
        edges={['top', 'bottom']}
      >
        <View
          style={[
            styles.screenContent,
            {
              width: contentWidth,
              alignSelf: 'center',
            },
          ]}
        >
          <View
            style={[
              styles.topBar,
              {
                height: isSmallPhone ? 64 : 72,
              },
            ]}
          >
            <View style={styles.brand}>
              <BrandMark size={isSmallPhone ? 38 : 42} />

              <View>
                <Text
                  style={[
                    styles.brandName,
                    isLargeScreen && styles.brandNameLarge,
                  ]}
                >
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

          <View style={{ flex: 1 }}>
            <ScrollView
              ref={scrollRef}
              horizontal
              pagingEnabled
              bounces={false}
              showsHorizontalScrollIndicator={false}
              scrollEventThrottle={16}
              onMomentumScrollEnd={handleScrollEnd}
              decelerationRate="fast"
            >
              {SLIDES.map((item, index) => (
                <View
                  style={[
                    styles.slide,
                    {
                      width: width,
                      paddingHorizontal: 0,
                    },
                  ]}
                  key={item.eyebrow}
                >
                  <View
                    style={[
                      styles.visualWrap,
                      {
                        height: visualHeight,
                      },
                    ]}
                  >
                    <SlideVisual
                      index={index}
                      width={contentWidth}
                    />
                  </View>

                  <View style={styles.copy}>
                    <View style={styles.eyebrowRow}>
                      <View style={styles.eyebrowLine} />

                      <Text style={styles.eyebrow}>
                        {item.eyebrow}
                      </Text>
                    </View>

                    <Text
                      style={[
                        styles.title,
                        {
                          fontSize: titleSize,
                          lineHeight: titleLineHeight,
                        },
                      ]}
                    >
                      {item.title}
                    </Text>

                    <Text
                      style={[
                        styles.description,
                        {
                          fontSize: descriptionSize,
                          lineHeight: descriptionSize * 1.55,
                        },
                      ]}
                    >
                      {item.description}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>

          <View
            style={[
              styles.bottom,
              {
                paddingBottom: isSmallPhone ? 10 : 15,
              },
            ]}
          >
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
              onPress={goNext}
              disabled={finishing}
              style={({ pressed }) => [
                styles.primaryButton,
                {
                  height: isSmallPhone ? 53 : 58,
                },
                pressed && styles.buttonPressed,
                finishing && styles.buttonDisabled,
              ]}
            >
              <Text
                style={[
                  styles.primaryButtonText,
                  isLargeScreen && styles.primaryButtonTextLarge,
                ]}
              >
                {finishing
                  ? 'Opening…'
                  : currentIndex === SLIDES.length - 1
                    ? 'Start creating'
                    : 'Continue'}
              </Text>

              {!finishing && (
                <View
                  style={[
                    styles.buttonIcon,
                    {
                      width: isSmallPhone ? 39 : 44,
                      height: isSmallPhone ? 39 : 44,
                      borderRadius: isSmallPhone ? 12 : 14,
                      top: isSmallPhone ? 7 : 7,
                      right: isSmallPhone ? 7 : 7,
                    },
                  ]}
                >
                  <Ionicons
                    name="arrow-forward"
                    size={17}
                    color={COLORS.background}
                  />
                </View>
              )}
            </Pressable>

            <Text
              style={[
                styles.footerText,
                isLargeScreen && styles.footerTextLarge,
              ]}
            >
              Your notes stay yours. SnapBrief only structures
              what you choose to provide.
            </Text>
          </View>
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

  screenContent: {
    flex: 1,
  },

  topBar: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  brandMarkShadow: {
    overflow: 'hidden',
    shadowColor: COLORS.primary,
    shadowOpacity: 0.24,
    shadowRadius: 15,
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
    letterSpacing: -0.45,
  },

  brandNameLarge: {
    fontSize: 18,
  },

  brandCaption: {
    color: COLORS.subtle,
    fontSize: 7.5,
    fontWeight: '800',
    letterSpacing: 1.15,
    marginTop: 2,
  },

  skipButton: {
    paddingVertical: 10,
    paddingHorizontal: 5,
  },

  skipText: {
    color: COLORS.muted,
    fontSize: 14,
    fontWeight: '600',
  },

  slide: {
    justifyContent: 'flex-start',
  },

  visualWrap: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  visualArea: {
    width: '100%',
    height: '100%',
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
    minHeight: 153,
    top: '11%',
    padding: 16,
    borderRadius: 21,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    transform: [{ rotate: '-5deg' }],
    shadowColor: '#000',
    shadowOpacity: 0.23,
    shadowRadius: 20,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    elevation: 7,
  },

  resultCard: {
    position: 'absolute',
    minHeight: 178,
    bottom: '7%',
    padding: 17,
    borderRadius: 21,
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    transform: [{ rotate: '4.5deg' }],
    shadowColor: '#000',
    shadowOpacity: 0.28,
    shadowRadius: 21,
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
    letterSpacing: 1.1,
  },

  rawText: {
    color: '#B4C9C8',
    fontSize: 11.8,
    lineHeight: 20,
  },

  fakeLineShort: {
    width: '41%',
    height: 4,
    borderRadius: 4,
    backgroundColor: '#21383A',
    marginTop: 12,
  },

  fakeLineLong: {
    width: '68%',
    height: 4,
    borderRadius: 4,
    backgroundColor: '#1B3032',
    marginTop: 6,
  },

  magicButton: {
    position: 'absolute',
    width: 46,
    height: 46,
    borderRadius: 16,
    top: '37%',
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.34,
    shadowRadius: 18,
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
    letterSpacing: 1.05,
  },

  resultTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.6,
    marginBottom: 14,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },

  infoText: {
    color: COLORS.text,
    fontSize: 11.8,
    fontWeight: '600',
  },

  transformCard: {
    position: 'absolute',
    height: 200,
    padding: 19,
    borderRadius: 22,
    borderWidth: 1,
  },

  transformBack: {
    left: 0,
    top: '15%',
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    transform: [{ rotate: '-5.5deg' }],
  },

  transformFront: {
    right: 0,
    bottom: '9%',
    backgroundColor: COLORS.surfaceElevated,
    borderColor: COLORS.borderStrong,
    transform: [{ rotate: '4.5deg' }],
  },

  transformLabel: {
    color: COLORS.muted,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1.15,
  },

  transformTitle: {
    color: COLORS.white,
    fontSize: 27,
    fontWeight: '800',
    letterSpacing: -1,
    marginTop: 9,
  },

  stackLines: {
    marginTop: 21,
    gap: 9,
  },

  stackLine: {
    height: 6,
    borderRadius: 5,
    backgroundColor: '#253C3E',
  },

  arrowCircle: {
    position: 'absolute',
    width: 43,
    height: 43,
    borderRadius: 15,
    top: '39%',
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
    marginTop: 9,
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
    minHeight: 258,
    padding: 21,
    borderRadius: 25,
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    shadowColor: '#000',
    shadowOpacity: 0.27,
    shadowRadius: 25,
    shadowOffset: {
      width: 0,
      height: 15,
    },
    elevation: 10,
  },

  readyHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 19,
  },

  readyTitleBlock: {
    flex: 1,
    paddingRight: 12,
  },

  readyEyebrow: {
    color: COLORS.primary,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1.25,
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
    letterSpacing: 0.65,
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
    flex: 1,
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
    paddingTop: 4,
    paddingHorizontal: 0,
  },

  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 11,
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
    letterSpacing: 1.4,
  },

  title: {
    color: COLORS.white,
    fontWeight: '900',
    letterSpacing: -1.25,
  },

  description: {
    color: COLORS.muted,
    marginTop: 13,
    maxWidth: 470,
  },

  bottom: {
    paddingTop: 10,
  },

  indicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 14,
  },

  indicator: {
    width: 5,
    height: 5,
    borderRadius: 5,
    backgroundColor: '#294345',
  },

  indicatorActive: {
    width: 26,
    backgroundColor: COLORS.primary,
  },

  primaryButton: {
    width: '100%',
    borderRadius: 999,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: COLORS.primary,
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: {
      width: 0,
      height: 7,
    },
    elevation: 5,
  },

  buttonPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.988 }],
  },

  buttonDisabled: {
    opacity: 0.65,
  },

  primaryButtonText: {
    color: COLORS.background,
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: -0.1,
  },

  primaryButtonTextLarge: {
    fontSize: 16,
  },

  buttonIcon: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(6,17,19,0.10)',
  },

  footerText: {
    color: '#527071',
    textAlign: 'center',
    fontSize: 9.5,
    lineHeight: 14,
    marginTop: 9,
    paddingHorizontal: 10,
  },

  footerTextLarge: {
    fontSize: 10.5,
  },
});
