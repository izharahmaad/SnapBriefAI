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
  priority: 'High',
  due_date: undefined,
};

export default function HomeScreen() {
  const { width } = useWindowDimensions();

  const compact = width < 380;
  const horizontalPadding = compact ? 16 : 20;

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
          : 'Could not create the brief. Please try again.'
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
      contentContainerStyle={[
        styles.content,
        { paddingHorizontal: horizontalPadding },
      ]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <View style={styles.brandRow}>
            <View style={styles.brandDot} />

            <Text style={styles.brand}>
              SNAPBRIEF AI
            </Text>
          </View>

          <Text style={styles.headerSubtitle}>
            Executive clarity engine
          </Text>
        </View>

        <View style={styles.statusPill}>
          <View style={styles.statusDot} />

          <Text style={styles.statusText}>
            ACTIVE
          </Text>
        </View>
      </View>

      {/* HERO */}
      <View style={styles.hero}>
        <ImageBackground
          source={HERO_IMAGE}
          resizeMode="cover"
          style={styles.heroImage}
          imageStyle={styles.heroImageStyle}
        >
          <LinearGradient
            colors={[
              'rgba(6, 17, 19, 0.20)',
              'rgba(6, 17, 19, 0.20)',
              'rgba(6, 17, 19, 0.92)',
            ]}
            locations={[0, 0.38, 1]}
            style={styles.heroGradient}
          >
            <View style={styles.heroTop}>
              <View style={styles.heroPill}>
                <View style={styles.heroPillDot} />

                <Text style={styles.heroPillText}>
                  EXECUTIVE INTELLIGENCE
                </Text>
              </View>

              <View style={styles.heroIconButton}>
                <Ionicons
                  name="sparkles-outline"
                  size={16}
                  color={colors.white}
                />
              </View>
            </View>

            <View style={styles.heroCopy}>
              <Text
                style={[
                  styles.heroTitle,
                  compact && styles.heroTitleCompact,
                ]}
              >
                Turn messy notes into
                {'\n'}
                <Text style={styles.heroAccent}>
                  clear decisions.
                </Text>
              </Text>

              <Text style={styles.heroDescription}>
                Distill rough thoughts, meeting notes,
                messages and ideas into focused briefs,
                clear priorities and next actions.
              </Text>

              <View style={styles.heroMeta}>
                <View style={styles.heroMetaItem}>
                  <Ionicons
                    name="flash-outline"
                    size={12}
                    color={colors.accent}
                  />

                  <Text style={styles.heroMetaText}>
                    4s typical synthesis
                  </Text>
                </View>

                <View style={styles.heroMetaItem}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={12}
                    color={colors.accent}
                  />

                  <Text style={styles.heroMetaText}>
                    Local cache
                  </Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>
      </View>

      {/* METRICS */}
      <View style={styles.metrics}>
        <Metric
          value={brief ? '1' : '0'}
          label="CURRENT BRIEF"
        />

        <View style={styles.metricDivider} />

        <Metric
          value="AI"
          label="ENGINE STATUS"
        />

        <View style={styles.metricDivider} />

        <Metric
          value="3K"
          label="INPUT CAPACITY"
        />
      </View>

      {/* DAILY / WORKSPACE CARD */}
      <GlassCard style={styles.dailyCard}>
        <View style={styles.dailyHeader}>
          <View style={styles.dailyLeft}>
            <View style={styles.dailyIcon}>
              <Ionicons
                name="analytics-outline"
                size={17}
                color={colors.accent}
              />
            </View>

            <View>
              <Text style={styles.dailyTitle}>
                Today's workspace
              </Text>

              <Text style={styles.dailySubtitle}>
                Keep the thinking moving.
              </Text>
            </View>
          </View>

          <Text style={styles.dailyPercent}>
            {brief ? '100%' : '0%'}
          </Text>
        </View>

        <View style={styles.dailyTrack}>
          <View
            style={[
              styles.dailyProgress,
              {
                width: brief ? '100%' : '6%',
              },
            ]}
          />
        </View>
      </GlassCard>

      {/* INPUT */}
      <View style={styles.sectionHeader}>
        <SectionTitle
          eyebrow="01 / INPUT BUFFER"
          title="Start with the raw version."
        />

        <Pressable
          onPress={loadExample}
          hitSlop={8}
          style={({ pressed }) => [
            styles.actionLink,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.actionLinkText}>
            Example
          </Text>

          <Ionicons
            name="arrow-forward"
            size={13}
            color={colors.accent}
          />
        </Pressable>
      </View>

      <GlassCard style={styles.editorCard}>
        <View style={styles.editorHeader}>
          <View style={styles.bufferBadge}>
            <View style={styles.bufferDot} />

            <Text style={styles.bufferText}>
              RAW INPUT
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
                size={14}
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

      {/* MAIN ACTION */}
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
        <View style={styles.primaryLeft}>
          <View style={styles.primaryIcon}>
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

      {/* ERROR */}
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

      {/* OUTPUT */}
      <View style={styles.outputSection}>
        <View style={styles.sectionHeader}>
          <SectionTitle
            eyebrow="02 / OUTPUT"
            title={brief ? 'The signal is ready.' : 'Brief preview.'}
          />

          <View style={styles.outputStatus}>
            <View style={styles.outputDot} />

            <Text style={styles.outputStatusText}>
              {brief ? 'LIVE' : 'READY'}
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
              <Ionicons
                name="add-outline"
                size={16}
                color={colors.accent}
              />

              <Text style={styles.newBriefText}>
                Start another brief
              </Text>
            </Pressable>
          </>
        ) : (
          <View style={styles.previewCard}>
            <View style={styles.previewHeader}>
              <View style={styles.previewBadge}>
                <Ionicons
                  name="sparkles-outline"
                  size={11}
                  color={colors.accent}
                />

                <Text style={styles.previewBadgeText}>
                  SAMPLE OUTPUT
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

            <Text style={styles.previewLabel}>
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
              )
            )}

            <Text
              style={[
                styles.previewLabel,
                styles.actionsLabel,
              ]}
            >
              NEXT ACTIONS
            </Text>

            {SAMPLE_BRIEF.actions.slice(0, 2).map(
              (action, index) => (
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
              )
            )}
          </View>
        )}
      </View>

      <View style={styles.bottomSpace} />
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
    paddingTop: 13,
    paddingBottom: 115,
  },

  /* Header */

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  brandDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
    marginRight: 7,
  },

  brand: {
    color: colors.accentSoft,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.6,
  },

  headerSubtitle: {
    color: colors.dim,
    fontSize: 9,
    marginTop: 6,
  },

  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 7,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.accent,
    marginRight: 5,
  },

  statusText: {
    color: colors.muted,
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 0.9,
  },

  /* Hero */

  hero: {
    height: 470,
    overflow: 'hidden',
    borderRadius: 24,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 22,
  },

  heroImage: {
    flex: 1,
  },

  heroImageStyle: {
    width: '100%',
    height: '100%',
  },

  heroGradient: {
    flex: 1,
    justifyContent: 'space-between',
  },

  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 13,
    paddingTop: 13,
  },

  heroPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(6, 17, 19, 0.70)',
    borderWidth: 1,
    borderColor: 'rgba(146, 255, 247, 0.12)',
  },

  heroPillDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.accent,
    marginRight: 5,
  },

  heroPillText: {
    color: colors.accentSoft,
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 0.9,
  },

  heroIconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(6, 17, 19, 0.58)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },

  heroCopy: {
    paddingHorizontal: 19,
    paddingBottom: 20,
  },

  heroTitle: {
    color: colors.white,
    fontSize: 34,
    lineHeight: 37,
    fontWeight: '800',
    letterSpacing: -1.2,
  },

  heroTitleCompact: {
    fontSize: 29,
    lineHeight: 32,
  },

  heroAccent: {
    color: colors.accent,
  },

  heroDescription: {
    color: 'rgba(243, 255, 254, 0.86)',
    fontSize: 12,
    lineHeight: 19,
    marginTop: 11,
    maxWidth: 340,
  },

  heroMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 15,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.12)',
  },

  heroMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  heroMetaText: {
    color: 'rgba(243, 255, 254, 0.68)',
    fontSize: 8,
    fontWeight: '600',
    marginLeft: 4,
  },

  /* Metrics */

  metrics: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 17,
  },

  metric: {
    flex: 1,
  },

  metricDivider: {
    width: 1,
    height: 43,
    backgroundColor: colors.border,
    marginHorizontal: 13,
  },

  metricValue: {
    color: colors.white,
    fontSize: 25,
    lineHeight: 29,
    fontWeight: '800',
    letterSpacing: -0.6,
  },

  metricLabel: {
    color: colors.dim,
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: 3,
  },

  metricLine: {
    width: 25,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.accent,
    marginTop: 7,
  },

  /* Daily */

  dailyCard: {
    padding: 13,
    borderRadius: 18,
    marginBottom: 27,
  },

  dailyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  dailyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  dailyIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(45, 225, 214, 0.07)',
    borderWidth: 1,
    borderColor: colors.border,
  },

  dailyTitle: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '800',
    marginLeft: 9,
  },

  dailySubtitle: {
    color: colors.dim,
    fontSize: 8,
    marginLeft: 9,
    marginTop: 2,
  },

  dailyPercent: {
    color: colors.accentSoft,
    fontSize: 11,
    fontWeight: '800',
  },

  dailyTrack: {
    height: 4,
    borderRadius: 3,
    overflow: 'hidden',
    backgroundColor: colors.surface2,
    marginTop: 11,
  },

  dailyProgress: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: colors.accent,
  },

  /* Section */

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 10,
  },

  actionLink: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 2,
  },

  actionLinkText: {
    color: colors.accent,
    fontSize: 8,
    fontWeight: '800',
    marginRight: 5,
  },

  pressed: {
    opacity: 0.62,
  },

  /* Editor */

  editorCard: {
    padding: 13,
    borderRadius: 20,
  },

  editorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  bufferBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: radius.pill,
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.border,
  },

  bufferDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.accent,
    marginRight: 5,
  },

  bufferText: {
    color: colors.accentSoft,
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 1,
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
    minHeight: 150,
    maxHeight: 285,
    color: colors.white,
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '500',
    paddingTop: 12,
    paddingBottom: 10,
  },

  inputCompact: {
    minHeight: 140,
    fontSize: 13,
    lineHeight: 21,
  },

  quickRow: {
    flex: 1,
  },

  quickContent: {
    gap: 6,
    paddingRight: 8,
  },

  inputFooter: {
    flexDirection: 'row',
    alignItems: 'center',
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
    borderColor: colors.accent,
  },

  quickChipPressed: {
    opacity: 0.68,
  },

  quickChipText: {
    color: colors.muted,
    fontSize: 8,
    fontWeight: '700',
    marginLeft: 4,
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
    marginTop: 9,
  },

  inputProgressValue: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: radius.pill,
  },

  /* Primary */

  primaryButton: {
    minHeight: 63,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginTop: 12,
    borderRadius: 20,
    backgroundColor: colors.accent,
  },

  primaryButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },

  primaryButtonDisabled: {
    opacity: 0.4,
  },

  primaryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  primaryIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(6, 17, 19, 0.10)',
    marginRight: 10,
  },

  primaryCopy: {
    flex: 1,
  },

  primaryTitle: {
    color: colors.bg,
    fontSize: 13,
    fontWeight: '800',
  },

  primarySubtitle: {
    color: 'rgba(6, 17, 19, 0.58)',
    fontSize: 8,
    fontWeight: '600',
    marginTop: 2,
  },

  primaryArrow: {
    width: 39,
    height: 39,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(6, 17, 19, 0.10)',
  },

  /* Error */

  errorCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 11,
    padding: 11,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 124, 135, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 124, 135, 0.15)',
  },

  errorIcon: {
    width: 30,
    height: 30,
    borderRadius: 9,
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

  /* Output */

  outputSection: {
    marginTop: 29,
  },

  outputStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 3,
  },

  outputDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.accent,
    marginRight: 5,
  },

  outputStatusText: {
    color: colors.accentSoft,
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 0.8,
  },

  /* Preview */

  previewCard: {
    padding: 15,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  previewBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(45, 225, 214, 0.06)',
    borderWidth: 1,
    borderColor: colors.border,
  },

  previewBadgeText: {
    color: colors.accentSoft,
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginLeft: 4,
  },

  previewPriority: {
    color: colors.accent,
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 1,
  },

  previewTitle: {
    color: colors.white,
    fontSize: 21,
    lineHeight: 25,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginTop: 14,
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
    marginVertical: 15,
  },

  previewLabel: {
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
    marginBottom: 8,
  },

  previewBullet: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.accent,
    marginTop: 5,
    marginRight: 8,
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

  previewCheck: {
    width: 19,
    height: 19,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    marginRight: 8,
  },

  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 10,
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
    paddingHorizontal: 14,
    paddingVertical: 9,
    marginTop: 12,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
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