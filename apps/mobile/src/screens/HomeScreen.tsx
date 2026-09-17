import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BriefResult } from '@/components/BriefResult';
import { GlassCard } from '@/components/GlassCard';
import { SectionTitle } from '@/components/SectionTitle';
import { examples } from '@/constants/examples';
import { generateBrief } from '@/lib/api';
import { saveBrief } from '@/lib/storage';
import { colors, radius, spacing } from '@/theme';
import { Brief } from '@/types/brief';

const CHARACTER_LIMIT = 3000;

const HERO_IMAGE = require('../../assets/images/snapbrief-crystal.png');

const QUICK_STARTS = [
  {
    label: 'Meeting',
    icon: 'people-outline' as const,
    text:
      'Meeting notes: We discussed the launch timeline, assigned owners for the remaining tasks, and agreed to review progress again on Friday.',
  },
  {
    label: 'Idea',
    icon: 'bulb-outline' as const,
    text:
      'Idea: Build a lightweight mobile tool that turns rough notes into structured briefs with a clear summary, action items, priority, and useful tags.',
  },
  {
    label: 'Tasks',
    icon: 'checkmark-circle-outline' as const,
    text:
      'Tasks: Finish the landing page, test the API connection, update the README, review the mobile UI, and prepare the final GitHub push.',
  },
];

const SAMPLE_BRIEF: Brief = {
  id: 'sample',
  title: 'Launch Planning & Execution',
  summary:
    'The launch plan is moving forward with clear ownership, a Friday review point, and a focused set of remaining deliverables.',
  key_points: [
    'Launch timeline has been defined and ownership is assigned.',
    'Remaining work should be reviewed before the Friday checkpoint.',
  ],
  actions: [
    'Confirm owners for outstanding launch tasks.',
    'Review implementation progress before Friday.',
    'Resolve blockers before final sign-off.',
  ],
  tags: ['strategy', 'launch'],
  priority: 'high',
  due_date: undefined,
  created_at: new Date().toISOString(),
};

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const compact = width < 380;
  const horizontalPadding = compact ? 16 : 20;
  const heroHeight = compact ? 470 : 510;

  const [text, setText] = useState(examples[0] ?? '');
  const [brief, setBrief] = useState<Brief | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const progress = useMemo(() => {
    if (!text.length) {
      return 0;
    }

    return Math.min(text.length / CHARACTER_LIMIT, 1);
  }, [text.length]);

  async function createBrief() {
    const trimmed = text.trim();

    if (!trimmed || loading) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const output = await generateBrief(trimmed);

      const nextBrief: Brief = {
        ...output,
        id: `${Date.now()}`,
        created_at: new Date().toISOString(),
      };

      setBrief(nextBrief);
      await saveBrief(nextBrief);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Could not create the brief. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  }

  function loadExample() {
    const index = Math.floor(Math.random() * examples.length);

    setText(examples[index] ?? '');
    setBrief(null);
    setError('');
  }

  function chooseQuickStart(value: string) {
    setText(value);
    setBrief(null);
    setError('');
  }

  function clearInput() {
    setText('');
    setBrief(null);
    setError('');
  }

  function startAnother() {
    setText('');
    setBrief(null);
    setError('');
  }

  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* =========================================================
          FULL-BLEED HERO
      ========================================================= */}
      <View style={[styles.hero, { height: heroHeight }]}>
        <ImageBackground
          source={HERO_IMAGE}
          resizeMode="cover"
          style={styles.heroImage}
          imageStyle={styles.heroImageStyle}
        >
          {/* Image treatment */}
          <LinearGradient
            colors={[
              'rgba(6, 17, 19, 0.16)',
              'rgba(6, 17, 19, 0.04)',
              'rgba(6, 17, 19, 0.16)',
              'rgba(6, 17, 19, 0.98)',
            ]}
            locations={[0, 0.32, 0.58, 1]}
            style={styles.heroOverlay}
          />

          {/* Subtle visual geometry */}
          <View pointerEvents="none" style={styles.heroOrbLarge} />
          <View pointerEvents="none" style={styles.heroOrbSmall} />
          <View pointerEvents="none" style={styles.heroFrame} />

          {/* HERO NAVBAR */}
          <View
            style={[
              styles.heroNavbar,
              { paddingTop: Math.max(insets.top + 6, 18) },
            ]}
          >
            <View style={styles.brandBlock}>
              <View style={styles.brandMark}>
                <LinearGradient
                  colors={[
                    colors.accentSoft,
                    colors.accent,
                  ]}
                  style={styles.brandMarkGradient}
                >
                  <Ionicons
                    name="sparkles"
                    size={15}
                    color={colors.bg}
                  />
                </LinearGradient>
              </View>

              <View>
                <Text style={styles.brand}>
                  SNAPBRIEF AI
                </Text>

                <Text style={styles.brandSubtitle}>
                  Intelligence for your notes
                </Text>
              </View>
            </View>

            <View style={styles.navActions}>
              <View style={styles.livePill}>
                <View style={styles.liveDot} />

                <Text style={styles.liveText}>
                  LIVE
                </Text>
              </View>

              <View style={styles.navCircle}>
                <Ionicons
                  name="notifications-outline"
                  size={17}
                  color={colors.white}
                />
              </View>
            </View>
          </View>

          {/* HERO CONTENT */}
          <View style={styles.heroContent}>
            <View style={styles.heroEyebrow}>
              <View style={styles.heroEyebrowDot} />

              <Text style={styles.heroEyebrowText}>
                EXECUTIVE INTELLIGENCE
              </Text>

              <View style={styles.heroEyebrowRule} />
            </View>

            <Text
              style={[
                styles.heroTitle,
                compact && styles.heroTitleCompact,
              ]}
            >
              Turn messy notes
              {'\n'}
              into{' '}
              <Text style={styles.heroTitleAccent}>
                clear decisions.
              </Text>
            </Text>

            <Text style={styles.heroDescription}>
              Transform raw thoughts, meeting notes and
              scattered ideas into structured briefs,
              priorities and next actions.
            </Text>

            {/* HERO SIGNALS */}
            <View style={styles.heroSignals}>
              <HeroSignal
                icon="flash-outline"
                label="Fast synthesis"
              />

              <View style={styles.heroSignalDivider} />

              <HeroSignal
                icon="shield-checkmark-outline"
                label="Private cache"
              />

              <View style={styles.heroSignalDivider} />

              <HeroSignal
                icon="layers-outline"
                label="Structured output"
              />
            </View>
          </View>
        </ImageBackground>
      </View>

      {/* =========================================================
          BODY
      ========================================================= */}
      <View
        style={[
          styles.body,
          { paddingHorizontal: horizontalPadding },
        ]}
      >
        {/* =======================================================
            METRICS
        ======================================================= */}
        <View style={styles.metrics}>
          <Metric
            value={brief ? '01' : '00'}
            label="BRIEFS"
            icon="document-text-outline"
          />

          <View style={styles.metricDivider} />

          <Metric
            value="AI"
            label="ENGINE"
            icon="sparkles-outline"
          />

          <View style={styles.metricDivider} />

          <Metric
            value="3K"
            label="CAPACITY"
            icon="text-outline"
          />
        </View>

        {/* =======================================================
            INPUT SECTION
        ======================================================= */}
        <View style={styles.sectionHeader}>
          <SectionTitle
            eyebrow="01 / INPUT"
            title="Start with the raw version."
          />

          <Pressable
            onPress={loadExample}
            hitSlop={8}
            style={({ pressed }) => [
              styles.exampleButton,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons
              name="shuffle-outline"
              size={13}
              color={colors.accent}
            />

            <Text style={styles.exampleText}>
              Example
            </Text>
          </Pressable>
        </View>

        {/* EDITOR */}
        <GlassCard style={styles.editorCard}>
          <View style={styles.editorHeader}>
            <View style={styles.inputIdentity}>
              <View style={styles.inputIconCircle}>
                <Ionicons
                  name="create-outline"
                  size={13}
                  color={colors.accent}
                />
              </View>

              <View>
                <Text style={styles.inputLabel}>
                  RAW INPUT
                </Text>

                <Text style={styles.inputCaption}>
                  Paste anything. We'll structure it.
                </Text>
              </View>
            </View>

            {text.length > 0 ? (
              <Pressable
                onPress={clearInput}
                hitSlop={8}
                style={({ pressed }) => [
                  styles.clearButton,
                  pressed && styles.pressed,
                ]}
              >
                <Ionicons
                  name="close"
                  size={12}
                  color={colors.dim}
                />

                <Text style={styles.clearText}>
                  Clear
                </Text>
              </Pressable>
            ) : null}
          </View>

          <TextInput
            value={text}
            onChangeText={(value) => {
              setText(value);

              if (error) {
                setError('');
              }
            }}
            multiline
            textAlignVertical="top"
            autoCapitalize="sentences"
            autoCorrect
            spellCheck
            maxLength={CHARACTER_LIMIT}
            placeholder="Paste meeting notes, ideas, transcripts, messages..."
            placeholderTextColor={colors.dim}
            style={[
              styles.input,
              compact && styles.inputCompact,
            ]}
          />

          {/* QUICK STARTS */}
          <View style={styles.quickRow}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.quickContent}
            >
              {QUICK_STARTS.map((item) => {
                const active = text === item.text;

                return (
                  <Pressable
                    key={item.label}
                    onPress={() =>
                      chooseQuickStart(item.text)
                    }
                    style={({ pressed }) => [
                      styles.quickChip,
                      active && styles.quickChipActive,
                      pressed && styles.quickChipPressed,
                    ]}
                  >
                    <View
                      style={[
                        styles.quickIcon,
                        active &&
                          styles.quickIconActive,
                      ]}
                    >
                      <Ionicons
                        name={item.icon}
                        size={10}
                        color={
                          active
                            ? colors.bg
                            : colors.muted
                        }
                      />
                    </View>

                    <Text
                      style={[
                        styles.quickChipText,
                        active &&
                          styles.quickChipTextActive,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <Text style={styles.counter}>
              {text.length}/3000
            </Text>
          </View>

          <View style={styles.inputProgress}>
            <View
              style={[
                styles.inputProgressValue,
                {
                  width: `${progress * 100}%`,
                },
              ]}
            />
          </View>
        </GlassCard>

        {/* =======================================================
            MAIN CTA
        ======================================================= */}
        <Pressable
          onPress={createBrief}
          disabled={loading || !text.trim()}
          style={({ pressed }) => [
            styles.primaryButton,
            pressed &&
              !loading &&
              styles.primaryButtonPressed,
            (!text.trim() || loading) &&
              styles.primaryButtonDisabled,
          ]}
        >
          <View style={styles.primaryIconCircle}>
            {loading ? (
              <ActivityIndicator
                size="small"
                color={colors.bg}
              />
            ) : (
              <Ionicons
                name="sparkles"
                size={17}
                color={colors.bg}
              />
            )}
          </View>

          <View style={styles.primaryCopy}>
            <Text style={styles.primaryTitle}>
              {loading
                ? 'Synthesizing brief...'
                : 'Synthesize brief'}
            </Text>

            <Text style={styles.primarySubtitle}>
              {loading
                ? 'Reading and structuring your input'
                : 'Turn raw thinking into useful signal'}
            </Text>
          </View>

          {!loading ? (
            <View style={styles.primaryArrow}>
              <Ionicons
                name="arrow-forward"
                size={17}
                color={colors.bg}
              />
            </View>
          ) : null}
        </Pressable>

        {/* =======================================================
            ERROR
        ======================================================= */}
        {error ? (
          <View style={styles.errorCard}>
            <View style={styles.errorIcon}>
              <Ionicons
                name="alert-circle-outline"
                size={16}
                color={colors.danger}
              />
            </View>

            <View style={styles.errorBody}>
              <Text style={styles.errorTitle}>
                Generation failed
              </Text>

              <Text style={styles.errorText}>
                {error}
              </Text>
            </View>
          </View>
        ) : null}

        {/* =======================================================
            OUTPUT
        ======================================================= */}
        <View style={styles.outputSection}>
          <View style={styles.sectionHeader}>
            <SectionTitle
              eyebrow="02 / OUTPUT"
              title={
                brief
                  ? 'The signal is ready.'
                  : 'See what SnapBrief creates.'
              }
            />

            <View style={styles.outputStatus}>
              <View style={styles.outputDot} />

              <Text style={styles.outputStatusText}>
                {brief ? 'LIVE' : 'PREVIEW'}
              </Text>
            </View>
          </View>

          {brief ? (
            <>
              <BriefResult brief={brief} />

              <View style={styles.disclaimer}>
                <Ionicons
                  name="information-circle-outline"
                  size={14}
                  color={colors.dim}
                />

                <Text style={styles.disclaimerText}>
                  AI-generated output. Review important
                  dates, numbers, names and commitments
                  before sharing.
                </Text>
              </View>

              <Pressable
                onPress={startAnother}
                style={({ pressed }) => [
                  styles.newBrief,
                  pressed && styles.pressed,
                ]}
              >
                <View style={styles.newBriefIcon}>
                  <Ionicons
                    name="add"
                    size={14}
                    color={colors.bg}
                  />
                </View>

                <Text style={styles.newBriefText}>
                  Start another brief
                </Text>
              </Pressable>
            </>
          ) : (
            <View style={styles.preview}>
              <View style={styles.previewAccent} />

              <View style={styles.previewBody}>
                {/* Preview header */}
                <View style={styles.previewHeader}>
                  <View style={styles.previewIdentity}>
                    <View style={styles.previewIcon}>
                      <Ionicons
                        name="sparkles"
                        size={11}
                        color={colors.bg}
                      />
                    </View>

                    <View>
                      <Text style={styles.previewEyebrow}>
                        SNAPBRIEF
                      </Text>

                      <Text style={styles.previewLabel}>
                        Sample generated brief
                      </Text>
                    </View>
                  </View>

                  <View style={styles.previewPriorityPill}>
                    <View
                      style={styles.previewPriorityDot}
                    />

                    <Text style={styles.previewPriority}>
                      HIGH
                    </Text>
                  </View>
                </View>

                <Text style={styles.previewTitle}>
                  {SAMPLE_BRIEF.title}
                </Text>

                <Text style={styles.previewSummary}>
                  {SAMPLE_BRIEF.summary}
                </Text>

                <View style={styles.previewDivider} />

                {/* Key points */}
                <View style={styles.previewSectionHead}>
                  <Text style={styles.previewSectionNumber}>
                    01
                  </Text>

                  <Text style={styles.previewSectionTitle}>
                    Key points
                  </Text>
                </View>

                {SAMPLE_BRIEF.key_points.map(
                  (point, index) => (
                    <View
                      key={`${point}-${index}`}
                      style={styles.previewRow}
                    >
                      <View style={styles.previewBullet}>
                        <View
                          style={styles.previewBulletInner}
                        />
                      </View>

                      <Text style={styles.previewText}>
                        {point}
                      </Text>
                    </View>
                  ),
                )}

                {/* Actions */}
                <View
                  style={[
                    styles.previewSectionHead,
                    styles.previewActionsHead,
                  ]}
                >
                  <Text style={styles.previewSectionNumber}>
                    02
                  </Text>

                  <Text style={styles.previewSectionTitle}>
                    Next actions
                  </Text>
                </View>

                {SAMPLE_BRIEF.actions
                  .slice(0, 2)
                  .map((action, index) => (
                    <View
                      key={`${action}-${index}`}
                      style={styles.previewAction}
                    >
                      <View style={styles.previewCheck}>
                        <Ionicons
                          name="checkmark"
                          size={10}
                          color={colors.bg}
                        />
                      </View>

                      <Text style={styles.previewText}>
                        {action}
                      </Text>
                    </View>
                  ))}
              </View>
            </View>
          )}
        </View>

        <View style={styles.bottomSpace} />
      </View>
    </ScrollView>
  );
}

function SnapBriefMark() {
  return (
    <View style={styles.brandMark}>
      <LinearGradient
        colors={[
          colors.accentSoft,
          colors.accent,
        ]}
        style={styles.brandMarkGradient}
      >
        <Ionicons
          name="sparkles"
          size={15}
          color={colors.bg}
        />
      </LinearGradient>
    </View>
  );
}

function HeroSignal({
  icon,
  label,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}) {
  return (
    <View style={styles.heroSignal}>
      <View style={styles.heroSignalIcon}>
        <Ionicons
          name={icon}
          size={11}
          color={colors.accent}
        />
      </View>

      <Text style={styles.heroSignalText}>
        {label}
      </Text>
    </View>
  );
}

function Metric({
  value,
  label,
  icon,
}: {
  value: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <View style={styles.metric}>
      <View style={styles.metricTop}>
        <Text style={styles.metricValue}>
          {value}
        </Text>

        <Ionicons
          name={icon}
          size={12}
          color={colors.accent}
        />
      </View>

      <Text style={styles.metricLabel}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.bg,
  },

  content: {
    paddingBottom: 115,
  },

  /* ============================================================
     HERO
  ============================================================ */

  hero: {
    width: '100%',
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },

  heroImage: {
    flex: 1,
    width: '100%',
  },

  heroImageStyle: {
    width: '100%',
    height: '100%',
    transform: [{ scale: 1.08 }],
  },

  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
  },

  heroOrbLarge: {
    position: 'absolute',
    width: 270,
    height: 270,
    borderRadius: 999,
    top: 115,
    right: -115,
    borderWidth: 1,
    borderColor: 'rgba(146, 255, 247, 0.08)',
    backgroundColor: 'rgba(45, 225, 214, 0.018)',
  },

  heroOrbSmall: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 999,
    top: 180,
    right: 30,
    borderWidth: 1,
    borderColor: 'rgba(146, 255, 247, 0.07)',
  },

  heroFrame: {
    position: 'absolute',
    left: 18,
    right: 18,
    top: 105,
    height: 210,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 34,
  },

  heroNavbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
  },

  brandBlock: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  brandMark: {
    width: 38,
    height: 38,
    borderRadius: 999,
    overflow: 'hidden',
    marginRight: 10,
  },

  brandMarkGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  brand: {
    color: colors.white,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.6,
  },

  brandSubtitle: {
    color: 'rgba(243, 255, 254, 0.58)',
    fontSize: 8,
    marginTop: 3,
  },

  navActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 7,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(6, 17, 19, 0.52)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.10)',
  },

  liveDot: {
    width: 5,
    height: 5,
    borderRadius: 999,
    backgroundColor: colors.accent,
    marginRight: 5,
  },

  liveText: {
    color: 'rgba(243, 255, 254, 0.78)',
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 0.9,
  },

  navCircle: {
    width: 38,
    height: 38,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(6, 17, 19, 0.48)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.10)',
  },

  heroContent: {
    paddingHorizontal: 19,
    paddingBottom: 27,
    marginTop: 'auto',
  },

  heroEyebrow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  heroEyebrowDot: {
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: colors.accent,
    marginRight: 7,
  },

  heroEyebrowText: {
    color: colors.accentSoft,
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 1.3,
  },

  heroEyebrowRule: {
    width: 34,
    height: 1,
    backgroundColor: 'rgba(146, 255, 247, 0.25)',
    marginLeft: 9,
  },

  heroTitle: {
    color: colors.white,
    fontSize: 36,
    lineHeight: 40,
    fontWeight: '900',
    letterSpacing: -1.35,
  },

  heroTitleCompact: {
    fontSize: 30,
    lineHeight: 34,
  },

  heroTitleAccent: {
    color: colors.accent,
  },

  heroDescription: {
    color: 'rgba(243, 255, 254, 0.76)',
    fontSize: 12,
    lineHeight: 19,
    marginTop: 11,
    maxWidth: 360,
  },

  heroSignals: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 17,
    paddingTop: 13,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.12)',
  },

  heroSignal: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },

  heroSignalIcon: {
    width: 22,
    height: 22,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(45, 225, 214, 0.10)',
  },

  heroSignalText: {
    color: 'rgba(243, 255, 254, 0.66)',
    fontSize: 8,
    fontWeight: '600',
    marginLeft: 5,
  },

  heroSignalDivider: {
    width: 1,
    height: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.11)',
    marginHorizontal: 9,
  },

  /* ============================================================
     BODY
  ============================================================ */

  body: {
    paddingTop: 21,
  },

  /* ============================================================
     METRICS
  ============================================================ */

  metrics: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },

  metric: {
    flex: 1,
  },

  metricTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 6,
  },

  metricValue: {
    color: colors.white,
    fontSize: 24,
    lineHeight: 28,
    fontWeight: '900',
    letterSpacing: -0.7,
  },

  metricLabel: {
    color: colors.dim,
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: 4,
  },

  metricDivider: {
    width: 1,
    height: 39,
    backgroundColor: colors.border,
    marginHorizontal: 13,
  },

  /* ============================================================
     SECTIONS
  ============================================================ */

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 12,
  },

  exampleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 2,
  },

  exampleText: {
    color: colors.accent,
    fontSize: 8,
    fontWeight: '800',
    marginLeft: 5,
  },

  pressed: {
    opacity: 0.6,
  },

  /* ============================================================
     EDITOR
  ============================================================ */

  editorCard: {
    padding: 15,
    borderRadius: radius.xl,
  },

  editorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  inputIdentity: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  inputIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(45, 225, 214, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(45, 225, 214, 0.13)',
    marginRight: 9,
  },

  inputLabel: {
    color: colors.accentSoft,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1.2,
  },

  inputCaption: {
    color: colors.dim,
    fontSize: 8,
    marginTop: 2,
  },

  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8,
  },

  clearText: {
    color: colors.dim,
    fontSize: 8,
    fontWeight: '700',
    marginLeft: 3,
  },

  input: {
    minHeight: 158,
    maxHeight: 285,
    color: colors.white,
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '500',
    paddingTop: 15,
    paddingBottom: 10,
  },

  inputCompact: {
    minHeight: 145,
    fontSize: 13,
    lineHeight: 21,
  },

  quickRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  quickContent: {
    flexGrow: 1,
    gap: 6,
    paddingRight: 7,
  },

  quickChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.border,
  },

  quickChipActive: {
    backgroundColor: 'rgba(45, 225, 214, 0.08)',
    borderColor: 'rgba(45, 225, 214, 0.30)',
  },

  quickChipPressed: {
    opacity: 0.68,
  },

  quickIcon: {
    width: 18,
    height: 18,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(135, 166, 165, 0.08)',
  },

  quickIconActive: {
    backgroundColor: colors.accent,
  },

  quickChipText: {
    color: colors.muted,
    fontSize: 8,
    fontWeight: '700',
    marginLeft: 5,
  },

  quickChipTextActive: {
    color: colors.accentSoft,
  },

  counter: {
    color: colors.dim,
    fontSize: 8,
    fontWeight: '700',
    marginLeft: 7,
  },

  inputProgress: {
    height: 2,
    borderRadius: radius.pill,
    overflow: 'hidden',
    backgroundColor: colors.surface2,
    marginTop: 10,
  },

  inputProgressValue: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: radius.pill,
  },

  /* ============================================================
     PRIMARY CTA
  ============================================================ */

  primaryButton: {
    minHeight: 68,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginTop: 12,
    borderRadius: radius.pill,
    backgroundColor: colors.accent,
  },

  primaryButtonPressed: {
    opacity: 0.90,
    transform: [{ scale: 0.985 }],
  },

  primaryButtonDisabled: {
    opacity: 0.38,
  },

  primaryIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(6, 17, 19, 0.10)',
    marginLeft: 1,
  },

  primaryCopy: {
    flex: 1,
    marginLeft: 11,
  },

  primaryTitle: {
    color: colors.bg,
    fontSize: 14,
    fontWeight: '900',
  },

  primarySubtitle: {
    color: 'rgba(6, 17, 19, 0.56)',
    fontSize: 8,
    fontWeight: '600',
    marginTop: 2,
  },

  primaryArrow: {
    width: 50,
    height: 50,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(6, 17, 19, 0.10)',
    marginRight: 1,
  },

  /* ============================================================
     ERROR
  ============================================================ */

  errorCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 11,
    padding: 11,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(255, 124, 135, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 124, 135, 0.15)',
  },

  errorIcon: {
    width: 30,
    height: 30,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 124, 135, 0.06)',
    marginRight: 8,
  },

  errorBody: {
    flex: 1,
  },

  errorTitle: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '800',
    marginBottom: 2,
  },

  errorText: {
    color: colors.muted,
    fontSize: 9,
    lineHeight: 15,
  },

  /* ============================================================
     OUTPUT
  ============================================================ */

  outputSection: {
    marginTop: 34,
  },

  outputStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 3,
  },

  outputDot: {
    width: 5,
    height: 5,
    borderRadius: 999,
    backgroundColor: colors.accent,
    marginRight: 5,
  },

  outputStatusText: {
    color: colors.accentSoft,
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 0.8,
  },

  /* ============================================================
     PREVIEW
  ============================================================ */

  preview: {
    flexDirection: 'row',
    overflow: 'hidden',
    backgroundColor: 'rgba(11, 24, 27, 0.58)',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(146, 255, 247, 0.08)',
  },

  previewAccent: {
    width: 3,
    backgroundColor: colors.accent,
  },

  previewBody: {
    flex: 1,
    padding: 16,
  },

  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  previewIdentity: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  previewIcon: {
    width: 30,
    height: 30,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    marginRight: 9,
  },

  previewEyebrow: {
    color: colors.accentSoft,
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 1.3,
  },

  previewLabel: {
    color: colors.dim,
    fontSize: 9,
    marginTop: 2,
  },

  previewPriorityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(45, 225, 214, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(45, 225, 214, 0.12)',
  },

  previewPriorityDot: {
    width: 5,
    height: 5,
    borderRadius: 999,
    backgroundColor: colors.accent,
    marginRight: 5,
  },

  previewPriority: {
    color: colors.accentSoft,
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 0.9,
  },

  previewTitle: {
    color: colors.white,
    fontSize: 21,
    lineHeight: 26,
    fontWeight: '900',
    letterSpacing: -0.55,
    marginTop: 15,
  },

  previewSummary: {
    color: colors.muted,
    fontSize: 10,
    lineHeight: 17,
    marginTop: 7,
  },

  previewDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },

  previewSectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  previewSectionNumber: {
    width: 27,
    color: colors.accent,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.7,
  },

  previewSectionTitle: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '800',
  },

  previewRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 9,
  },

  previewBullet: {
    width: 19,
    height: 19,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(45, 225, 214, 0.07)',
    marginRight: 9,
    marginTop: 1,
  },

  previewBulletInner: {
    width: 5,
    height: 5,
    borderRadius: 999,
    backgroundColor: colors.accent,
  },

  previewText: {
    flex: 1,
    color: colors.text,
    fontSize: 10,
    lineHeight: 16,
  },

  previewActionsHead: {
    marginTop: 4,
  },

  previewAction: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 34,
    paddingHorizontal: 8,
    borderRadius: radius.md,
    backgroundColor: colors.surface2,
    marginBottom: 6,
  },

  previewCheck: {
    width: 19,
    height: 19,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    marginRight: 8,
  },

  /* ============================================================
     GENERATED RESULT
  ============================================================ */

  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 11,
    paddingHorizontal: 2,
  },

  disclaimerText: {
    flex: 1,
    color: colors.dim,
    fontSize: 8,
    lineHeight: 14,
    marginLeft: 6,
  },

  newBrief: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 14,
    paddingLeft: 5,
    paddingVertical: 5,
    marginTop: 13,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(45, 225, 214, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(45, 225, 214, 0.13)',
  },

  newBriefIcon: {
    width: 27,
    height: 27,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    marginRight: 6,
  },

  newBriefText: {
    color: colors.accentSoft,
    fontSize: 9,
    fontWeight: '800',
  },

  bottomSpace: {
    height: 20,
  },
});