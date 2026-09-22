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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

import { colors, radius, spacing } from '@/theme';

type Slide = {
  eyebrow: string;
  title: string;
  description: string;
};

const SLIDES: Slide[] = [
  {
    eyebrow: 'WELCOME TO SNAPBRIEF',
    title: 'Turn scattered thoughts\ninto clear direction.',
    description:
      'Capture notes, ideas, meetings, or transcripts. SnapBrief turns them into structured briefs you can actually use.',
  },
  {
    eyebrow: 'SMART STRUCTURE',
    title: 'Less organizing.\nMore clarity.',
    description:
      'SnapBrief finds the important details and turns raw information into summaries, priorities, tags, and next actions.',
  },
  {
    eyebrow: 'READY TO CREATE',
    title: 'Capture it.\nStructure it.\nMove forward.',
    description:
      'Create a clear brief in seconds and keep your important thoughts ready to revisit whenever you need them.',
  },
];

function BrandMark({ size = 38 }: { size?: number }) {
  return (
    <View
      style={[
        styles.brandMark,
        {
          width: size,
          height: size,
          borderRadius: size * 0.3,
        },
      ]}
    >
      <Ionicons
        name="document-text-outline"
        size={size * 0.48}
        color={colors.bg}
      />
    </View>
  );
}

function VisualOne({ width }: { width: number }) {
  const cardWidth = Math.min(width - 42, 330);

  return (
    <View style={styles.visual}>
      <View style={[styles.flowCard, { width: cardWidth }]}>
        <View style={styles.cardTop}>
          <View style={styles.iconSmall}>
            <Ionicons
              name="create-outline"
              size={14}
              color={colors.accent}
            />
          </View>

          <Text style={styles.cardLabel}>RAW INPUT</Text>
        </View>

        <Text style={styles.rawTitle}>Friday client meeting</Text>

        <View style={styles.rawLines}>
          <View style={[styles.rawLine, { width: '92%' }]} />
          <View style={[styles.rawLine, { width: '75%' }]} />
          <View style={[styles.rawLine, { width: '84%' }]} />
        </View>
      </View>

      <View style={styles.transform}>
        <View style={styles.transformLine} />

        <View style={styles.transformIcon}>
          <Ionicons
            name="sparkles"
            size={13}
            color={colors.bg}
          />
        </View>

        <View style={styles.transformLine} />
      </View>

      <View style={[styles.flowCard, styles.resultCard, { width: cardWidth }]}>
        <View style={styles.cardTop}>
          <View style={styles.iconSmallActive}>
            <Ionicons
              name="checkmark"
              size={13}
              color={colors.bg}
            />
          </View>

          <Text style={styles.cardLabelActive}>STRUCTURED BRIEF</Text>
        </View>

        <Text style={styles.resultTitle}>Website redesign</Text>

        <View style={styles.resultMeta}>
          <Ionicons
            name="calendar-outline"
            size={13}
            color={colors.accent}
          />

          <Text style={styles.resultMetaText}>
            Friday · 3:00 PM
          </Text>
        </View>

        <View style={styles.resultMeta}>
          <Ionicons
            name="flag-outline"
            size={13}
            color={colors.accent}
          />

          <Text style={styles.resultMetaText}>
            High priority
          </Text>
        </View>
      </View>
    </View>
  );
}

function VisualTwo({ width }: { width: number }) {
  const cardWidth = Math.min(width - 42, 335);

  return (
    <View style={styles.visual}>
      <View style={[styles.structureCard, { width: cardWidth }]}>
        <View style={styles.structureHeader}>
          <View>
            <Text style={styles.cardLabelActive}>AI STRUCTURE</Text>
            <Text style={styles.structureTitle}>
              One input. Clear output.
            </Text>
          </View>

          <View style={styles.activeIcon}>
            <Ionicons
              name="sparkles"
              size={14}
              color={colors.bg}
            />
          </View>
        </View>

        <StructureRow
          icon="document-text-outline"
          title="Summary"
          text="The main context, reduced to what matters."
        />

        <StructureRow
          icon="checkmark-circle-outline"
          title="Actions"
          text="Clear next steps extracted from the input."
        />

        <StructureRow
          icon="flag-outline"
          title="Priority"
          text="Important items surfaced for attention."
        />

        <StructureRow
          icon="pricetag-outline"
          title="Tags"
          text="Useful labels for finding it later."
          last
        />
      </View>
    </View>
  );
}

function StructureRow({
  icon,
  title,
  text,
  last = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  text: string;
  last?: boolean;
}) {
  return (
    <View
      style={[
        styles.structureRow,
        !last && styles.structureRowBorder,
      ]}
    >
      <View style={styles.rowIcon}>
        <Ionicons
          name={icon}
          size={14}
          color={colors.accent}
        />
      </View>

      <View style={styles.rowCopy}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowText}>{text}</Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={13}
        color={colors.dim}
      />
    </View>
  );
}

function VisualThree({ width }: { width: number }) {
  const cardWidth = Math.min(width - 42, 340);

  return (
    <View style={styles.visual}>
      <View style={[styles.readyCard, { width: cardWidth }]}>
        <View style={styles.readyHeader}>
          <View>
            <Text style={styles.cardLabelActive}>YOUR BRIEF</Text>

            <Text style={styles.readyTitle}>
              Ready to act
            </Text>
          </View>

          <View style={styles.activeIcon}>
            <Ionicons
              name="arrow-forward"
              size={14}
              color={colors.bg}
            />
          </View>
        </View>

        <View style={styles.stats}>
          <Stat value="04" label="POINTS" />
          <Stat value="03" label="ACTIONS" />
          <Stat value="01" label="PRIORITY" />
        </View>

        <View style={styles.actionRow}>
          <View style={styles.actionIcon}>
            <Ionicons
              name="arrow-forward"
              size={11}
              color={colors.bg}
            />
          </View>

          <Text style={styles.actionText}>
            Send revised proposal
          </Text>
        </View>

        <View style={styles.actionRow}>
          <View style={styles.actionIcon}>
            <Ionicons
              name="arrow-forward"
              size={11}
              color={colors.bg}
            />
          </View>

          <Text style={styles.actionText}>
            Confirm payment terms
          </Text>
        </View>

        <View style={styles.priorityRow}>
          <View style={styles.priorityDot} />

          <Text style={styles.priorityText}>
            HIGH PRIORITY
          </Text>
        </View>
      </View>
    </View>
  );
}

function Stat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
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
    return <VisualOne width={width} />;
  }

  if (index === 1) {
    return <VisualTwo width={width} />;
  }

  return <VisualThree width={width} />;
}

export default function OnboardingScreen() {
  const { width, height } = useWindowDimensions();

  const isSmallPhone = height < 700;
  const isLargeScreen = width >= 600;

  const contentWidth = Math.min(width - 32, 520);

  const visualHeight = isSmallPhone
    ? 245
    : isLargeScreen
      ? 350
      : 285;

  const titleSize = isLargeScreen
    ? 42
    : isSmallPhone
      ? 29
      : 34;

  const titleLineHeight = isLargeScreen
    ? 48
    : isSmallPhone
      ? 34
      : 40;

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
        'true',
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
  };

  const handleScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const nextIndex = Math.round(
      event.nativeEvent.contentOffset.x / width,
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
      <StatusBar barStyle="light-content" />

      <SafeAreaView
        style={styles.safeArea}
        edges={['top', 'bottom']}
      >
        <View style={styles.topBarWrap}>
          <View
            style={[
              styles.topBar,
              {
                width: contentWidth,
                height: isSmallPhone ? 60 : 68,
              },
            ]}
          >
            <View style={styles.brand}>
              <BrandMark size={isSmallPhone ? 36 : 40} />

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
                style={({ pressed }) => [
                  styles.skipButton,
                  pressed && styles.skipPressed,
                ]}
              >
                <Text style={styles.skipText}>
                  Skip
                </Text>
              </Pressable>
            )}
          </View>
        </View>

        <View style={styles.contentArea}>
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
                key={item.eyebrow}
                style={[
                  styles.slide,
                  {
                    width,
                  },
                ]}
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

                <View
                  style={[
                    styles.copy,
                    {
                      width: contentWidth,
                    },
                  ]}
                >
                  <View style={styles.eyebrowRow}>
                    <View style={styles.eyebrowDot} />

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
              width: contentWidth,
              paddingBottom: isSmallPhone ? 7 : 12,
            },
          ]}
        >
          <View style={styles.progressRow}>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressActive,
                  {
                    width: `${((currentIndex + 1) / SLIDES.length) * 100}%`,
                  },
                ]}
              />
            </View>

            <Text style={styles.progressText}>
              {String(currentIndex + 1).padStart(2, '0')} /{' '}
              {String(SLIDES.length).padStart(2, '0')}
            </Text>
          </View>

          <Pressable
            onPress={goNext}
            disabled={finishing}
            style={({ pressed }) => [
              styles.primaryButton,
              {
                height: isSmallPhone ? 52 : 56,
              },
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
                  color={colors.bg}
                />
              </View>
            )}
          </Pressable>

          <Text style={styles.footerText}>
            Your notes stay yours. SnapBrief only structures
            what you choose to provide.
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },

  safeArea: {
    flex: 1,
  },

  topBarWrap: {
    width: '100%',
    alignItems: 'center',
  },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  brand: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  brandMark: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    marginRight: 10,
  },

  brandName: {
    color: colors.white,
    fontSize: 16,
    lineHeight: 19,
    fontWeight: '800',
    letterSpacing: -0.45,
  },

  brandNameLarge: {
    fontSize: 18,
  },

  brandCaption: {
    color: colors.dim,
    fontSize: 7,
    lineHeight: 9,
    fontWeight: '800',
    letterSpacing: 1.05,
    marginTop: 2,
  },

  skipButton: {
    paddingVertical: 9,
    paddingHorizontal: 4,
  },

  skipPressed: {
    opacity: 0.55,
  },

  skipText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '600',
  },

  contentArea: {
    flex: 1,
  },

  slide: {
    alignItems: 'center',
  },

  visualWrap: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  visual: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  flowCard: {
    padding: 16,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  resultCard: {
    backgroundColor: colors.surface2,
    borderColor: 'rgba(45, 225, 214, 0.18)',
  },

  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },

  iconSmall: {
    width: 27,
    height: 27,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(45, 225, 214, 0.07)',
    marginRight: 8,
  },

  iconSmallActive: {
    width: 27,
    height: 27,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    marginRight: 8,
  },

  cardLabel: {
    color: colors.dim,
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 1.15,
  },

  cardLabelActive: {
    color: colors.accentSoft,
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 1.15,
  },

  rawTitle: {
    color: colors.white,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '800',
    letterSpacing: -0.35,
  },

  rawLines: {
    marginTop: 14,
  },

  rawLine: {
    height: 4,
    borderRadius: 999,
    backgroundColor: colors.border,
    marginTop: 6,
  },

  transform: {
    height: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  transformLine: {
    width: 50,
    height: 1,
    backgroundColor: colors.border,
  },

  transformIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    marginHorizontal: 8,
  },

  resultTitle: {
    color: colors.white,
    fontSize: 20,
    lineHeight: 25,
    fontWeight: '800',
    letterSpacing: -0.55,
    marginBottom: 13,
  },

  resultMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 7,
  },

  resultMetaText: {
    color: colors.text,
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 7,
  },

  structureCard: {
    overflow: 'hidden',
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  structureHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  structureTitle: {
    color: colors.white,
    fontSize: 19,
    lineHeight: 24,
    fontWeight: '800',
    letterSpacing: -0.45,
    marginTop: 5,
  },

  activeIcon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
  },

  structureRow: {
    minHeight: 63,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },

  structureRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  rowIcon: {
    width: 31,
    height: 31,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(45, 225, 214, 0.055)',
    marginRight: 10,
  },

  rowCopy: {
    flex: 1,
    paddingRight: 10,
  },

  rowTitle: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '800',
  },

  rowText: {
    color: colors.dim,
    fontSize: 8,
    lineHeight: 13,
    marginTop: 3,
  },

  readyCard: {
    padding: 18,
    borderRadius: radius.xl,
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: 'rgba(45, 225, 214, 0.16)',
  },

  readyHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 18,
  },

  readyTitle: {
    color: colors.white,
    fontSize: 24,
    lineHeight: 29,
    fontWeight: '800',
    letterSpacing: -0.65,
    marginTop: 5,
  },

  stats: {
    flexDirection: 'row',
    marginBottom: 17,
  },

  stat: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 7,
    borderRadius: 12,
  },

  statValue: {
    color: colors.white,
    fontSize: 16,
    lineHeight: 19,
    fontWeight: '900',
  },

  statLabel: {
    color: colors.dim,
    fontSize: 6.5,
    lineHeight: 8,
    fontWeight: '800',
    letterSpacing: 0.7,
    marginTop: 3,
  },

  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  actionIcon: {
    width: 20,
    height: 20,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    marginRight: 9,
  },

  actionText: {
    flex: 1,
    color: colors.text,
    fontSize: 10,
    lineHeight: 15,
    fontWeight: '600',
  },

  priorityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  priorityDot: {
    width: 5,
    height: 5,
    borderRadius: 999,
    backgroundColor: colors.accent,
    marginRight: 6,
  },

  priorityText: {
    color: colors.accentSoft,
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 1,
  },

  copy: {
    paddingTop: 8,
  },

  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  eyebrowDot: {
    width: 5,
    height: 5,
    borderRadius: 999,
    backgroundColor: colors.accent,
    marginRight: 7,
  },

  eyebrow: {
    color: colors.accent,
    fontSize: 8,
    lineHeight: 10,
    fontWeight: '900',
    letterSpacing: 1.35,
  },

  title: {
    color: colors.white,
    fontWeight: '900',
    letterSpacing: -1.15,
  },

  description: {
    color: colors.muted,
    maxWidth: 470,
    marginTop: 12,
  },

  bottom: {
    alignSelf: 'center',
    paddingTop: 8,
  },

  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  progressTrack: {
    flex: 1,
    height: 3,
    overflow: 'hidden',
    borderRadius: 999,
    backgroundColor: colors.border,
    marginRight: 10,
  },

  progressActive: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: colors.accent,
  },

  progressText: {
    color: colors.dim,
    fontSize: 7,
    lineHeight: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },

  primaryButton: {
    width: '100%',
    borderRadius: radius.pill,
    backgroundColor: colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  buttonPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.988 }],
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  primaryButtonText: {
    color: colors.bg,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '900',
  },

  buttonIcon: {
    position: 'absolute',
    right: 7,
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(6, 17, 19, 0.10)',
  },

  footerText: {
    color: colors.dim,
    textAlign: 'center',
    fontSize: 8.5,
    lineHeight: 13,
    marginTop: 8,
    paddingHorizontal: 10,
  },
});