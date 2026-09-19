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

  // Taller hero so the image becomes the main visual identity.
  const heroHeight = compact ? 505 : 555;

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
          HERO
      ========================================================= */}
      <View style={[styles.hero, { height: heroHeight }]}>
        <ImageBackground
          source={HERO_IMAGE}
          resizeMode="cover"
          style={styles.heroImage}
          imageStyle={styles.heroImageStyle}
        >
          <LinearGradient
            colors={[
              'rgba(6, 17, 19, 0.10)',
              'rgba(6, 17, 19, 0.08)',
              'rgba(6, 17, 19, 0.24)',
              'rgba(6, 17, 19, 0.66)',
              'rgba(6, 17, 19, 0.98)',
            ]}
            locations={[0, 0.27, 0.48, 0.74, 1]}
            style={StyleSheet.absoluteFill}
          />

          {/* TOP NAV */}
          <View
            style={[
              styles.navbar,
              {
                paddingTop: Math.max(insets.top + 6, 18),
              },
            ]}
          >
            <View style={styles.brandGroup}>
              <View style={styles.brandMark}>
                <Ionicons
                  name="document-text-outline"
                  size={17}
                  color={colors.bg}
                />
              </View>

              <View>
                <Text style={styles.brand}>
                  SNAPBRIEF AI
                </Text>

                <Text style={styles.brandSubtitle}>
                  Clarity for everything you capture
                </Text>
              </View>
            </View>

            <View style={styles.liveStatus}>
              <View style={styles.liveDot} />

              <Text style={styles.liveText}>
                ACTIVE
              </Text>
            </View>
          </View>

          {/* HERO COPY */}
          <View style={styles.heroContent}>
            <Text style={styles.heroEyebrow}>
              AI-POWERED BRIEFING
            </Text>

            <View style={styles.heroRule} />

            <Text
              style={[
                styles.heroTitle,
                compact && styles.heroTitleCompact,
              ]}
            >
              Turn scattered thoughts
              {'\n'}
              into{' '}
              <Text style={styles.heroAccent}>
                clear direction.
              </Text>
            </Text>

            <Text style={styles.heroDescription}>
              Capture notes, meetings, ideas and transcripts.
              SnapBrief turns them into structured briefs,
              priorities and next actions.
            </Text>

            <View style={styles.heroMeta}>
              <View style={styles.heroMetaItem}>
                <Ionicons
                  name="flash-outline"
                  size={11}
                  color={colors.accent}
                />

                <Text style={styles.heroMetaText}>
                  Fast synthesis
                </Text>
              </View>

              <View style={styles.metaDivider} />

              <View style={styles.heroMetaItem}>
                <Ionicons
                  name="layers-outline"
                  size={11}
                  color={colors.accent}
                />

                <Text style={styles.heroMetaText}>
                  Structured output
                </Text>
              </View>

              <View style={styles.metaDivider} />

              <View style={styles.heroMetaItem}>
                <Ionicons
                  name="text-outline"
                  size={11}
                  color={colors.accent}
                />

                <Text style={styles.heroMetaText}>
                  3K input
                </Text>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>

      {/* =========================================================
          PAGE CONTENT
      ========================================================= */}
      <View
        style={[
          styles.body,
          { paddingHorizontal: horizontalPadding },
        ]}
      >
        {/* METRICS */}
        <View style={styles.metrics}>
          <Metric
            value={brief ? '01' : '00'}
            label="BRIEFS"
          />

          <View style={styles.metricDivider} />

          <Metric
            value="AI"
            label="ENGINE"
          />

          <View style={styles.metricDivider} />

          <Metric
            value="3K"
            label="CAPACITY"
          />
        </View>

        {/* =======================================================
            INPUT
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

        <GlassCard style={styles.editorCard}>
          <View style={styles.editorHeader}>
            <View>
              <Text style={styles.inputLabel}>
                RAW INPUT
              </Text>

              <Text style={styles.inputCaption}>
                Paste anything. SnapBrief structures it.
              </Text>
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
                <Text style={styles.clearText}>
                  Clear
                </Text>

                <Ionicons
                  name="close-outline"
                  size={13}
                  color={colors.dim}
                />
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
                    <Ionicons
                      name={item.icon}
                      size={11}
                      color={
                        active
                          ? colors.accent
                          : colors.muted
                      }
                    />

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
            SYNTHESIZE
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
          <View style={styles.primaryIcon}>
            {loading ? (
              <ActivityIndicator
                size="small"
                color={colors.bg}
              />
            ) : (
              <Ionicons
                name="sparkles-outline"
                size={18}
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
                size={18}
                color={colors.bg}
              />
            </View>
          ) : null}
        </Pressable>

        {/* ERROR */}
        {error ? (
          <View style={styles.errorCard}>
            <Ionicons
              name="alert-circle-outline"
              size={17}
              color={colors.danger}
            />

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

            <Text style={styles.outputStatus}>
              {brief ? 'LIVE' : 'PREVIEW'}
            </Text>
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
                <Ionicons
                  name="add-outline"
                  size={15}
                  color={colors.accent}
                />

                <Text style={styles.newBriefText}>
                  Start another brief
                </Text>
              </Pressable>
            </>
          ) : (
            <View style={styles.preview}>
              <View style={styles.previewAccent} />

              <View style={styles.previewBody}>
                <View style={styles.previewHeader}>
                  <View>
                    <Text style={styles.previewEyebrow}>
                      SAMPLE OUTPUT
                    </Text>

                    <Text style={styles.previewLabel}>
                      Generated brief
                    </Text>
                  </View>

                  <Text style={styles.previewPriority}>
                    HIGH
                  </Text>
                </View>

                <Text style={styles.previewTitle}>
                  {SAMPLE_BRIEF.title}
                </Text>

                <Text style={styles.previewSummary}>
                  {SAMPLE_BRIEF.summary}
                </Text>

                <View style={styles.previewDivider} />

                <Text style={styles.previewSectionLabel}>
                  KEY POINTS
                </Text>

                {SAMPLE_BRIEF.key_points.map(
                  (point, index) => (
                    <View
                      key={`${point}-${index}`}
                      style={styles.previewRow}
                    >
                      <View style={styles.previewBullet} />

                      <Text style={styles.previewText}>
                        {point}
                      </Text>
                    </View>
                  ),
                )}

                <Text
                  style={[
                    styles.previewSectionLabel,
                    styles.actionsLabel,
                  ]}
                >
                  NEXT ACTIONS
                </Text>

                {SAMPLE_BRIEF.actions
                  .slice(0, 2)
                  .map((action, index) => (
                    <View
                      key={`${action}-${index}`}
                      style={styles.previewAction}
                    >
                      <Ionicons
                        name="checkmark"
                        size={12}
                        color={colors.accent}
                      />

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

function Metric({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricValue}>
        {value}
      </Text>

      <Text style={styles.metricLabel}>
        {label}
      </Text>

      <View style={styles.metricLine} />
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
    transform: [{ scale: 1.035 }],
  },

  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
  },

  brandGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  brandMark: {
    width: 35,
    height: 35,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    marginRight: 9,
  },

  brand: {
    color: colors.white,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.5,
  },

  brandSubtitle: {
    color: 'rgba(243, 255, 254, 0.58)',
    fontSize: 8,
    marginTop: 3,
  },

  liveStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 2,
  },

  liveDot: {
    width: 5,
    height: 5,
    borderRadius: 999,
    backgroundColor: colors.accent,
    marginRight: 5,
  },

  liveText: {
    color: 'rgba(243, 255, 254, 0.74)',
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 0.9,
  },

  heroContent: {
    marginTop: 'auto',
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  heroEyebrow: {
    color: colors.accentSoft,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1.5,
  },

  heroRule: {
    width: 34,
    height: 1,
    backgroundColor: 'rgba(146, 255, 247, 0.28)',
    marginTop: 8,
    marginBottom: 13,
  },

  heroTitle: {
    color: colors.white,
    fontSize: 37,
    lineHeight: 41,
    fontWeight: '900',
    letterSpacing: -1.4,
  },

  heroTitleCompact: {
    fontSize: 31,
    lineHeight: 35,
  },

  heroAccent: {
    color: colors.accent,
  },

  heroDescription: {
    color: 'rgba(243, 255, 254, 0.76)',
    fontSize: 12,
    lineHeight: 19,
    marginTop: 12,
    maxWidth: 365,
  },

  heroMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 17,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.11)',
  },

  heroMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  heroMetaText: {
    color: 'rgba(243, 255, 254, 0.64)',
    fontSize: 8,
    fontWeight: '600',
    marginLeft: 4,
  },

  metaDivider: {
    width: 3,
    height: 3,
    borderRadius: 999,
    backgroundColor: colors.accent,
    marginHorizontal: 9,
  },

  /* ============================================================
     BODY
  ============================================================ */

  body: {
    paddingTop: spacing.xl,
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

  metricLine: {
    width: 22,
    height: 2,
    borderRadius: 999,
    backgroundColor: colors.accent,
    marginTop: 7,
  },

  metricDivider: {
    width: 1,
    height: 38,
    backgroundColor: colors.border,
    marginHorizontal: 13,
  },

  /* ============================================================
     SECTION HEADER
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

  outputStatus: {
    color: colors.accentSoft,
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 0.9,
    paddingBottom: 3,
  },

  /* ============================================================
     INPUT
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

  inputLabel: {
    color: colors.accentSoft,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1.2,
  },

  inputCaption: {
    color: colors.dim,
    fontSize: 8,
    marginTop: 3,
  },

  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  clearText: {
    color: colors.dim,
    fontSize: 8,
    fontWeight: '700',
    marginRight: 2,
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
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.border,
  },

  quickChipActive: {
    backgroundColor: 'rgba(45, 225, 214, 0.07)',
    borderColor: 'rgba(45, 225, 214, 0.28)',
  },

  quickChipPressed: {
    opacity: 0.68,
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
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: colors.surface2,
    marginTop: 10,
  },

  inputProgressValue: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 999,
  },

  /* ============================================================
     PRIMARY CTA
  ============================================================ */

  primaryButton: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginTop: 12,
    borderRadius: radius.pill,
    backgroundColor: colors.accent,
  },

  primaryButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },

  primaryButtonDisabled: {
    opacity: 0.38,
  },

  primaryIcon: {
    width: 48,
    height: 48,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(6, 17, 19, 0.10)',
  },

  primaryCopy: {
    flex: 1,
    marginLeft: 10,
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
    width: 48,
    height: 48,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(6, 17, 19, 0.10)',
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

  errorBody: {
    flex: 1,
    marginLeft: 8,
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

  previewEyebrow: {
    color: colors.accentSoft,
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 1.2,
  },

  previewLabel: {
    color: colors.dim,
    fontSize: 9,
    marginTop: 2,
  },

  previewPriority: {
    color: colors.accent,
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 1,
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

  previewSectionLabel: {
    color: colors.accent,
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 1.1,
    marginBottom: 9,
  },

  actionsLabel: {
    marginTop: 4,
  },

  previewRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 9,
  },

  previewBullet: {
    width: 5,
    height: 5,
    borderRadius: 999,
    backgroundColor: colors.accent,
    marginTop: 5,
    marginRight: 9,
  },

  previewText: {
    flex: 1,
    color: colors.text,
    fontSize: 10,
    lineHeight: 16,
  },

  previewAction: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 34,
    paddingHorizontal: 8,
    borderRadius: 10,
    backgroundColor: colors.surface2,
    marginBottom: 6,
  },

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
    paddingHorizontal: 13,
    paddingVertical: 8,
    marginTop: 13,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(45, 225, 214, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(45, 225, 214, 0.12)',
  },

  newBriefText: {
    color: colors.accentSoft,
    fontSize: 9,
    fontWeight: '800',
    marginLeft: 5,
  },

  bottomSpace: {
    height: 20,
  },
});