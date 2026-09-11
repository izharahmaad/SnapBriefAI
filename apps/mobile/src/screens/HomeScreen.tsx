import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
    label: 'Concept',
    icon: 'bulb-outline' as const,
    text:
      'Idea: Build a lightweight mobile tool that turns rough notes into structured briefs with a clear summary, action items, priority, and useful tags.',
  },
  {
    label: 'Action',
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
    'Resolve any blockers before final sign-off.',
  ],
  tags: ['strategy', 'launch', 'planning'],
  priority: 'High',
  due_date: undefined,
};

export default function HomeScreen() {
  const { width } = useWindowDimensions();

  const compact = width < 380;
  const wide = width >= 600;

  const horizontalPadding = compact
    ? 16
    : wide
      ? 28
      : 20;

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

  const remaining = CHARACTER_LIMIT - text.length;

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

  function selectQuickStart(value: string) {
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
    <View style={styles.screen}>
      <ScrollView
        style={styles.page}
        contentContainerStyle={[
          styles.content,
          {
            paddingHorizontal: horizontalPadding,
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.brandCluster}>
            <View style={styles.brandPill}>
              <View style={styles.brandDot} />
              <Text style={styles.brandText}>SNAPBRIEF AI</Text>
            </View>

            <Text style={styles.headerSubtitle}>
              Executive clarity engine
            </Text>
          </View>

          <View style={styles.headerActions}>
            <View style={styles.activePill}>
              <View style={styles.activeDot} />
              <Text style={styles.activeText}>ACTIVE</Text>
            </View>

            <View style={styles.profileButton}>
              <Text style={styles.profileText}>SB</Text>
            </View>
          </View>
        </View>

        {/* HERO */}
        <View style={styles.hero}>
          <Text style={styles.heroEyebrow}>
            EXECUTIVE INTELLIGENCE ENGINE
          </Text>

          <Text
            style={[
              styles.heroTitle,
              compact && styles.heroTitleCompact,
            ]}
          >
            Messy notes into
            {'\n'}
            <Text style={styles.heroAccent}>
              executive clarity.
            </Text>
          </Text>

          <Text style={styles.heroDescription}>
            Distill unformatted streams, transcripts, messages,
            and raw notes into focused, actionable briefs.
          </Text>

          <View style={styles.heroStats}>
            <View style={styles.heroStat}>
              <View style={styles.statDot} />
              <Text style={styles.statText}>4s typical latency</Text>
            </View>

            <View style={styles.heroStat}>
              <Ionicons
                name="lock-closed-outline"
                size={12}
                color={colors.accent}
              />

              <Text style={styles.statText}>
                Confidential cache
              </Text>
            </View>
          </View>

          {/* Contained visual tile */}
          <View style={styles.visualWrap}>
            <View style={styles.visualTile}>
              <Image
                source={HERO_IMAGE}
                resizeMode="contain"
                style={styles.heroImage}
              />

              <View
                pointerEvents="none"
                style={styles.visualOverlay}
              />

              <View style={styles.visualLabel}>
                <View style={styles.visualLabelDot} />
                <Text style={styles.visualLabelText}>
                  SYNTHESIS
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* INPUT SECTION */}
        <View style={styles.sectionHeader}>
          <SectionTitle
            eyebrow="01 / INPUT BUFFER"
            title="Raw input"
          />

          <Pressable
            onPress={loadExample}
            hitSlop={8}
            style={({ pressed }) => [
              styles.loadButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.loadText}>Load sample</Text>
            <Ionicons
              name="arrow-forward"
              size={13}
              color={colors.accent}
            />
          </Pressable>
        </View>

        {/* INPUT CARD */}
        <GlassCard style={styles.inputCard}>
          <View style={styles.inputHeader}>
            <View style={styles.bufferPill}>
              <View style={styles.bufferDot} />
              <Text style={styles.bufferText}>
                INPUT BUFFER
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
                <Text style={styles.clearText}>Clear</Text>
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
            placeholder="Type or paste raw thoughts, transcripts, Slack threads, strategic notes..."
            placeholderTextColor={colors.dim}
            style={[
              styles.input,
              compact && styles.inputCompact,
            ]}
          />

          <View style={styles.inputBottom}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipsRow}
            >
              {QUICK_STARTS.map((item) => {
                const active = text === item.text;

                return (
                  <Pressable
                    key={item.label}
                    onPress={() =>
                      selectQuickStart(item.text)
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

            <Text
              style={[
                styles.counter,
                remaining < 300 && styles.counterWarning,
              ]}
            >
              {text.length.toLocaleString()} / 3,000
            </Text>
          </View>

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${progress * 100}%`,
                },
              ]}
            />
          </View>
        </GlassCard>

        {/* PRIMARY ACTION */}
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
          <View style={styles.primaryButtonContent}>
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
                  ? 'Synthesizing brief'
                  : 'Synthesize executive brief'}
              </Text>

              <Text style={styles.primarySubtitle}>
                {loading
                  ? 'Processing your input...'
                  : 'Convert noise into actionable signal'}
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

        {/* RESULT / SPECIMEN */}
        <View style={styles.resultSection}>
          <View style={styles.sectionHeader}>
            <SectionTitle
              eyebrow="02 / SYNTHESIZED MEMO"
              title={brief ? 'The signal is ready.' : 'Output preview'}
            />

            <View style={styles.resultStatus}>
              <View style={styles.resultStatusDot} />

              <Text style={styles.resultStatusText}>
                {brief ? 'LIVE RESULT' : 'SAMPLE SPECIMEN'}
              </Text>
            </View>
          </View>

          {brief ? (
            <BriefResult brief={brief} />
          ) : (
            <View style={styles.sampleResultCard}>
              <View style={styles.sampleTop}>
                <View style={styles.sampleTags}>
                  <View style={styles.sampleTag}>
                    <Text style={styles.sampleTagText}>
                      STRATEGY
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.sampleTag,
                      styles.sampleTagAccent,
                    ]}
                  >
                    <Text
                      style={[
                        styles.sampleTagText,
                        styles.sampleTagAccentText,
                      ]}
                    >
                      Q3 ROADMAP
                    </Text>
                  </View>
                </View>

                <Text style={styles.samplePriority}>
                  HIGH
                </Text>
              </View>

              <Text style={styles.sampleTitle}>
                {SAMPLE_BRIEF.title}
              </Text>

              <Text style={styles.sampleMeta}>
                SAMPLE SPECIMEN · EXECUTIVE OPERATIONS
              </Text>

              <View style={styles.takeawayBox}>
                <Text style={styles.takeawayLabel}>
                  KEY TAKEAWAYS
                </Text>

                {SAMPLE_BRIEF.key_points.map(
                  (point, index) => (
                    <View
                      style={styles.takeawayRow}
                      key={`${point}-${index}`}
                    >
                      <View style={styles.takeawayDot} />
                      <Text style={styles.takeawayText}>
                        {point}
                      </Text>
                    </View>
                  )
                )}
              </View>

              <View style={styles.actionsPreview}>
                <Text style={styles.actionsLabel}>
                  ASSIGNED DELIVERABLES
                </Text>

                {SAMPLE_BRIEF.actions
                  .slice(0, 3)
                  .map((action, index) => (
                    <View
                      style={styles.actionPreview}
                      key={`${action}-${index}`}
                    >
                      <View style={styles.actionCheck}>
                        <Ionicons
                          name="checkmark"
                          size={10}
                          color={colors.bg}
                        />
                      </View>

                      <Text
                        style={styles.actionPreviewText}
                        numberOfLines={1}
                      >
                        {action}
                      </Text>

                      <View style={styles.ownerBadge}>
                        <Text style={styles.ownerText}>
                          READY
                        </Text>
                      </View>
                    </View>
                  ))}
              </View>
            </View>
          )}

          <View style={styles.disclaimer}>
            <Ionicons
              name="information-circle-outline"
              size={14}
              color={colors.dim}
            />

            <Text style={styles.disclaimerText}>
              AI-generated output should be reviewed before
              important decisions or external sharing.
            </Text>
          </View>

          {brief ? (
            <Pressable
              onPress={startAnother}
              style={({ pressed }) => [
                styles.newBriefButton,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons
                name="add-outline"
                size={16}
                color={colors.accent}
              />

              <Text style={styles.newBriefText}>
                Create another brief
              </Text>
            </Pressable>
          ) : null}
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },

  page: {
    flex: 1,
    backgroundColor: colors.bg,
  },

  content: {
    paddingTop: 14,
    paddingBottom: 30,
  },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  brandCluster: {
    flex: 1,
  },

  brandPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  brandDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
    marginRight: 7,
  },

  brandText: {
    color: colors.accentSoft,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1.4,
  },

  headerSubtitle: {
    color: colors.dim,
    fontSize: 9,
    marginTop: 7,
    marginLeft: 2,
  },

  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginLeft: 10,
  },

  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 7,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
    marginRight: 5,
  },

  activeText: {
    color: colors.muted,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.9,
  },

  profileButton: {
    width: 36,
    height: 36,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.border,
  },

  profileText: {
    color: colors.accentSoft,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.7,
  },

  /* Hero */
  hero: {
    overflow: 'hidden',
    borderRadius: 23,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 24,
  },

  heroEyebrow: {
    color: colors.accent,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1.4,
    marginBottom: 10,
  },

  heroTitle: {
    color: colors.white,
    fontSize: 30,
    lineHeight: 33,
    fontWeight: '800',
    letterSpacing: -1,
  },

  heroTitleCompact: {
    fontSize: 27,
    lineHeight: 30,
  },

  heroAccent: {
    color: colors.white,
  },

  heroDescription: {
    color: colors.text,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 12,
    maxWidth: 500,
  },

  heroStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 13,
    marginTop: 16,
    paddingTop: 13,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  heroStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  statDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
    marginRight: 5,
  },

  statText: {
    color: colors.muted,
    fontSize: 9,
    fontWeight: '600',
    marginLeft: 4,
  },

  visualWrap: {
    alignItems: 'center',
    marginTop: 18,
  },

  visualTile: {
    position: 'relative',
    width: 154,
    height: 154,
    borderRadius: 19,
    overflow: 'hidden',
    backgroundColor: '#031012',
    borderWidth: 1,
    borderColor: colors.border,
  },

  heroImage: {
    width: '100%',
    height: '100%',
    opacity: 0.92,
  },

  visualOverlay: {
    ...StyleSheet.absoluteFill,
    borderWidth: 1,
    borderColor: 'rgba(45, 225, 214, 0.05)',
    borderRadius: 19,
  },

  visualLabel: {
    position: 'absolute',
    left: 10,
    top: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 5,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(6, 17, 19, 0.72)',
    borderWidth: 1,
    borderColor: 'rgba(45, 225, 214, 0.12)',
  },

  visualLabelDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.accent,
    marginRight: 5,
  },

  visualLabelText: {
    color: colors.accentSoft,
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 0.9,
  },

  /* Section */
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 10,
  },

  loadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 2,
  },

  loadText: {
    color: colors.accent,
    fontSize: 9,
    fontWeight: '800',
    marginRight: 5,
  },

  pressed: {
    opacity: 0.62,
  },

  /* Input */
  inputCard: {
    padding: 14,
    borderRadius: 20,
  },

  inputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  bufferPill: {
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
    fontSize: 9,
    fontWeight: '700',
    marginRight: 2,
  },

  input: {
    minHeight: 155,
    maxHeight: 290,
    color: colors.white,
    fontSize: 15,
    lineHeight: 24,
    fontWeight: '500',
    paddingTop: 12,
    paddingBottom: 9,
  },

  inputCompact: {
    minHeight: 145,
    fontSize: 14,
    lineHeight: 22,
  },

  inputBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },

  chipsRow: {
    gap: 6,
    paddingRight: 8,
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
    backgroundColor: 'rgba(45, 225, 214, 0.06)',
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
    marginLeft: 5,
  },

  counterWarning: {
    color: colors.accentSoft,
  },

  progressTrack: {
    width: '100%',
    height: 2,
    borderRadius: radius.pill,
    backgroundColor: colors.surface2,
    overflow: 'hidden',
    marginTop: 9,
  },

  progressFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: radius.pill,
  },

  /* Primary action */
  primaryButton: {
    minHeight: 62,
    marginTop: 13,
    paddingHorizontal: 12,
    borderRadius: 19,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.accent,
  },

  primaryButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },

  primaryButtonDisabled: {
    opacity: 0.4,
  },

  primaryButtonContent: {
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
    marginBottom: 3,
  },

  errorText: {
    color: colors.muted,
    fontSize: 9,
    lineHeight: 15,
  },

  /* Result */
  resultSection: {
    marginTop: 28,
  },

  resultStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 3,
  },

  resultStatusDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.accent,
    marginRight: 5,
  },

  resultStatusText: {
    color: colors.accentSoft,
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 0.8,
  },

  /* Sample preview */
  sampleResultCard: {
    padding: 15,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  sampleTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  sampleTags: {
    flexDirection: 'row',
    gap: 6,
  },

  sampleTag: {
    paddingHorizontal: 7,
    paddingVertical: 5,
    borderRadius: radius.pill,
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.border,
  },

  sampleTagAccent: {
    backgroundColor: 'rgba(45, 225, 214, 0.05)',
    borderColor: 'rgba(45, 225, 214, 0.15)',
  },

  sampleTagText: {
    color: colors.muted,
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 0.8,
  },

  sampleTagAccentText: {
    color: colors.accentSoft,
  },

  samplePriority: {
    color: colors.accent,
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 1,
  },

  sampleTitle: {
    color: colors.white,
    fontSize: 21,
    lineHeight: 25,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginTop: 14,
  },

  sampleMeta: {
    color: colors.dim,
    fontSize: 7,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: 7,
  },

  takeawayBox: {
    marginTop: 17,
    padding: 13,
    borderRadius: 15,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
  },

  takeawayLabel: {
    color: colors.accent,
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 1.1,
    marginBottom: 10,
  },

  takeawayRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 9,
  },

  takeawayDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
    marginTop: 5,
    marginRight: 8,
  },

  takeawayText: {
    flex: 1,
    color: colors.text,
    fontSize: 11,
    lineHeight: 17,
  },

  actionsPreview: {
    marginTop: 16,
  },

  actionsLabel: {
    color: colors.dim,
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 1.1,
    marginBottom: 8,
  },

  actionPreview: {
    minHeight: 37,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    borderRadius: 11,
    backgroundColor: colors.surface2,
    marginBottom: 6,
  },

  actionCheck: {
    width: 19,
    height: 19,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    marginRight: 8,
  },

  actionPreviewText: {
    flex: 1,
    color: colors.text,
    fontSize: 10,
    marginRight: 7,
  },

  ownerBadge: {
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.bg,
  },

  ownerText: {
    color: colors.muted,
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 10,
    paddingHorizontal: 3,
  },

  disclaimerText: {
    flex: 1,
    color: colors.dim,
    fontSize: 8,
    lineHeight: 14,
    marginLeft: 6,
  },

  newBriefButton: {
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
    height: 16,
  },
});