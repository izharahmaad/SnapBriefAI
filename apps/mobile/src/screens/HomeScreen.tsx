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
  {
    label: 'Client',
    icon: 'briefcase-outline' as const,
    text:
      'Client notes: The client wants the first version to be simple, fast, mobile-friendly, and easy to understand. They also want clear next steps.',
  },
];

const HERO_IMAGE = require('../../assets/images/snapbrief-crystal.png');

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
      {/* ───────────────── HEADER ───────────────── */}
      <View style={styles.header}>
        <View style={styles.headerBrand}>
          <View style={styles.brandRow}>
            <View style={styles.brandDot} />
            <Text style={styles.brandText}>SNAPBRIEF AI</Text>
          </View>

          <Text style={styles.headerTitle}>
            Executive intelligence,
            {'\n'}
            without the clutter.
          </Text>
        </View>

        <View style={styles.readyBadge}>
          <View style={styles.readyDot} />
          <Text style={styles.readyText}>READY</Text>
        </View>
      </View>

      {/* ───────────────── HERO ───────────────── */}
      <View style={styles.hero}>
        <View style={styles.heroContent}>
          <Text style={styles.heroEyebrow}>
            EXECUTIVE INTELLIGENCE ENGINE
          </Text>

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
            Distill unstructured thoughts, meeting notes,
            messages and ideas into concise briefs with clear
            priorities and next actions.
          </Text>

          <View style={styles.heroMeta}>
            <View style={styles.heroMetaItem}>
              <View style={styles.metaStatusDot} />
              <Text style={styles.heroMetaText}>
                AI processing ready
              </Text>
            </View>

            <View style={styles.heroMetaItem}>
              <Ionicons
                name="lock-closed-outline"
                size={13}
                color={colors.accent}
              />
              <Text style={styles.heroMetaText}>
                Local result cache
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.heroVisual}>
          <Image
            source={HERO_IMAGE}
            resizeMode="cover"
            style={styles.heroImage}
          />

          <View style={styles.imageFrame} />

          <View style={styles.visualBadge}>
            <Ionicons
              name="sparkles"
              size={12}
              color={colors.accent}
            />

            <Text style={styles.visualBadgeText}>
              SYNTHESIS
            </Text>
          </View>
        </View>
      </View>

      {/* ───────────────── INPUT ───────────────── */}
      <View style={styles.sectionHeading}>
        <SectionTitle
          eyebrow="01 / INPUT BUFFER"
          title="What should SnapBrief structure?"
        />

        <Pressable
          onPress={loadExample}
          hitSlop={8}
          style={({ pressed }) => [
            styles.loadButton,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.loadButtonText}>
            Try sample
          </Text>

          <Ionicons
            name="arrow-forward"
            size={14}
            color={colors.accent}
          />
        </Pressable>
      </View>

      <GlassCard style={styles.editorCard}>
        <View style={styles.editorTop}>
          <View style={styles.bufferBadge}>
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
                size={15}
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
          placeholder="Type or paste raw thoughts, transcripts, Slack threads, meeting notes..."
          placeholderTextColor={colors.dim}
          style={[
            styles.input,
            compact && styles.inputCompact,
          ]}
        />

        <View style={styles.inputFooter}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickRow}
          >
            {QUICK_STARTS.map((item) => {
              const active = text === item.text;

              return (
                <Pressable
                  key={item.label}
                  onPress={() => selectQuickStart(item.text)}
                  style={({ pressed }) => [
                    styles.quickChip,
                    active && styles.quickChipActive,
                    pressed && styles.quickChipPressed,
                  ]}
                >
                  <Ionicons
                    name={item.icon}
                    size={12}
                    color={
                      active
                        ? colors.accent
                        : colors.muted
                    }
                  />

                  <Text
                    style={[
                      styles.quickText,
                      active && styles.quickTextActive,
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
            {text.length.toLocaleString()} /{' '}
            {CHARACTER_LIMIT.toLocaleString()}
          </Text>
        </View>

        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progress,
              {
                width: `${progress * 100}%`,
              },
            ]}
          />
        </View>
      </GlassCard>

      {/* ───────────────── ACTION ───────────────── */}
      <Pressable
        onPress={createBrief}
        disabled={loading || !text.trim()}
        style={({ pressed }) => [
          styles.createButton,
          pressed &&
            !loading &&
            styles.createButtonPressed,
          (!text.trim() || loading) &&
            styles.createButtonDisabled,
        ]}
      >
        <View style={styles.createLeft}>
          <View style={styles.createIcon}>
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

          <View>
            <Text style={styles.createTitle}>
              {loading
                ? 'Synthesizing brief'
                : 'Synthesize executive brief'}
            </Text>

            <Text style={styles.createSubtext}>
              {loading
                ? 'Analyzing your input...'
                : 'Convert unstructured input into signal'}
            </Text>
          </View>
        </View>

        {!loading ? (
          <View style={styles.actionArrow}>
            <Ionicons
              name="arrow-forward"
              size={18}
              color={colors.bg}
            />
          </View>
        ) : null}
      </Pressable>

      {/* ───────────────── ERROR ───────────────── */}
      {error ? (
        <View style={styles.errorCard}>
          <View style={styles.errorIcon}>
            <Ionicons
              name="alert-circle-outline"
              size={17}
              color={colors.danger}
            />
          </View>

          <View style={styles.errorContent}>
            <Text style={styles.errorTitle}>
              Generation failed
            </Text>

            <Text style={styles.errorText}>
              {error}
            </Text>
          </View>
        </View>
      ) : null}

      {/* ───────────────── RESULT ───────────────── */}
      {brief ? (
        <View style={styles.resultSection}>
          <View style={styles.sectionHeading}>
            <SectionTitle
              eyebrow="02 / SYNTHESIZED BRIEF"
              title="The signal is ready."
            />

            <View style={styles.liveBadge}>
              <View style={styles.liveBadgeDot} />

              <Text style={styles.liveBadgeText}>
                LIVE RESULT
              </Text>
            </View>
          </View>

          <BriefResult brief={brief} />

          <View style={styles.disclaimer}>
            <Ionicons
              name="information-circle-outline"
              size={15}
              color={colors.dim}
            />

            <Text style={styles.disclaimerText}>
              AI-generated output. Review important dates,
              numbers, names and commitments before sharing.
            </Text>
          </View>

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
        </View>
      ) : (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Ionicons
              name="layers-outline"
              size={17}
              color={colors.accent}
            />
          </View>

          <View style={styles.emptyContent}>
            <Text style={styles.emptyTitle}>
              Your workspace is ready.
            </Text>

            <Text style={styles.emptyText}>
              Paste the raw version. SnapBrief handles the
              structure.
            </Text>
          </View>
        </View>
      )}

      <View style={styles.bottomSpace} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.bg,
  },

  content: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 22,
  },

  headerBrand: {
    flex: 1,
    paddingRight: 15,
  },

  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 9,
  },

  brandDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.accent,
    marginRight: 8,
  },

  brandText: {
    color: colors.accentSoft,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.7,
  },

  headerTitle: {
    color: colors.white,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '700',
    letterSpacing: -0.25,
  },

  readyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 7,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  readyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
    marginRight: 6,
  },

  readyText: {
    color: colors.muted,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1.1,
  },

  /* Hero */
  hero: {
    overflow: 'hidden',
    minHeight: 400,
    borderRadius: 25,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 28,
  },

  heroContent: {
    padding: 20,
    paddingBottom: 17,
  },

  heroEyebrow: {
    color: colors.accent,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1.4,
    marginBottom: 11,
  },

  heroTitle: {
    color: colors.white,
    fontSize: 30,
    lineHeight: 33,
    fontWeight: '800',
    letterSpacing: -1.1,
  },

  heroTitleCompact: {
    fontSize: 27,
    lineHeight: 30,
  },

  heroAccent: {
    color: colors.accent,
  },

  heroDescription: {
    color: colors.text,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 13,
  },

  heroMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    marginTop: 17,
    paddingTop: 13,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  heroMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  metaStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
    marginRight: 6,
  },

  heroMetaText: {
    color: colors.muted,
    fontSize: 9,
    fontWeight: '600',
  },

  heroVisual: {
    height: 185,
    marginHorizontal: 12,
    marginBottom: 12,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#031012',
    borderWidth: 1,
    borderColor: colors.border,
  },

  heroImage: {
    width: '100%',
    height: '100%',
    opacity: 0.94,
  },

  imageFrame: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    borderColor: 'rgba(146, 255, 247, 0.07)',
    borderRadius: 18,
  },

  visualBadge: {
    position: 'absolute',
    left: 12,
    top: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(6, 17, 19, 0.78)',
    borderWidth: 1,
    borderColor: 'rgba(45, 225, 214, 0.16)',
  },

  visualBadgeText: {
    color: colors.accentSoft,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1,
    marginLeft: 5,
  },

  /* Section */
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 11,
  },

  loadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 3,
  },

  loadButtonText: {
    color: colors.accent,
    fontSize: 10,
    fontWeight: '800',
    marginRight: 5,
  },

  pressed: {
    opacity: 0.62,
  },

  /* Editor */
  editorCard: {
    padding: 14,
    borderRadius: 21,
  },

  editorTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  bufferBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(45, 225, 214, 0.05)',
    borderWidth: 1,
    borderColor: colors.border,
  },

  bufferDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.accent,
    marginRight: 6,
  },

  bufferText: {
    color: colors.accentSoft,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1.1,
  },

  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },

  clearText: {
    color: colors.dim,
    fontSize: 9,
    fontWeight: '700',
    marginRight: 2,
  },

  input: {
    minHeight: 175,
    maxHeight: 300,
    color: colors.white,
    fontSize: 15,
    lineHeight: 24,
    fontWeight: '500',
    paddingTop: 8,
    paddingBottom: 8,
  },

  inputCompact: {
    minHeight: 155,
    fontSize: 14,
    lineHeight: 22,
  },

  inputFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
  },

  quickRow: {
    gap: 7,
    paddingRight: 7,
  },

  quickChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 7,
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

  quickText: {
    color: colors.muted,
    fontSize: 9,
    fontWeight: '700',
    marginLeft: 5,
  },

  quickTextActive: {
    color: colors.accentSoft,
  },

  counter: {
    color: colors.dim,
    fontSize: 9,
    fontWeight: '700',
    marginLeft: 7,
  },

  counterWarning: {
    color: colors.accentSoft,
  },

  progressTrack: {
    height: 2,
    borderRadius: radius.pill,
    backgroundColor: colors.surface2,
    marginTop: 10,
    overflow: 'hidden',
  },

  progress: {
    height: '100%',
    borderRadius: radius.pill,
    backgroundColor: colors.accent,
  },

  /* Action */
  createButton: {
    minHeight: 66,
    marginTop: 14,
    borderRadius: 20,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.accent,
  },

  createButtonPressed: {
    transform: [{ scale: 0.99 }],
    opacity: 0.9,
  },

  createButtonDisabled: {
    opacity: 0.38,
  },

  createLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  createIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(6, 17, 19, 0.10)',
    marginRight: 10,
  },

  createTitle: {
    color: colors.bg,
    fontSize: 14,
    fontWeight: '800',
  },

  createSubtext: {
    color: 'rgba(6, 17, 19, 0.60)',
    fontSize: 9,
    fontWeight: '600',
    marginTop: 2,
  },

  actionArrow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(6, 17, 19, 0.10)',
  },

  /* Error */
  errorCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 12,
    padding: 12,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 124, 135, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 124, 135, 0.15)',
  },

  errorIcon: {
    width: 31,
    height: 31,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 124, 135, 0.06)',
    marginRight: 9,
  },

  errorContent: {
    flex: 1,
  },

  errorTitle: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 3,
  },

  errorText: {
    color: colors.muted,
    fontSize: 10,
    lineHeight: 16,
  },

  /* Result */
  resultSection: {
    marginTop: 30,
  },

  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 3,
  },

  liveBadgeDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.accent,
    marginRight: 5,
  },

  liveBadgeText: {
    color: colors.accentSoft,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.9,
  },

  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 11,
    padding: 11,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  disclaimerText: {
    flex: 1,
    color: colors.dim,
    fontSize: 9,
    lineHeight: 15,
    marginLeft: 7,
  },

  newBriefButton: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 13,
  },

  newBriefText: {
    color: colors.accentSoft,
    fontSize: 10,
    fontWeight: '800',
    marginLeft: 5,
  },

  /* Empty */
  emptyState: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 17,
    padding: 13,
    borderRadius: 17,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  emptyIcon: {
    width: 35,
    height: 35,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(45, 225, 214, 0.05)',
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 10,
  },

  emptyContent: {
    flex: 1,
  },

  emptyTitle: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 3,
  },

  emptyText: {
    color: colors.muted,
    fontSize: 9,
    lineHeight: 15,
  },

  bottomSpace: {
    height: 18,
  },
});