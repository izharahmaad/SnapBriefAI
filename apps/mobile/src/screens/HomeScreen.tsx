import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
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

const CHARACTER_LIMIT = 3000;

export default function HomeScreen() {
  const { width } = useWindowDimensions();

  const isCompact = width < 380;
  const isWide = width >= 600;

  const horizontalPadding = isCompact
    ? 16
    : isWide
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

  const remainingCharacters = CHARACTER_LIMIT - text.length;

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
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.brandBlock}>
          <View style={styles.brandRow}>
            <View style={styles.brandMark}>
              <Ionicons
                name="sparkles"
                size={14}
                color={colors.bg}
              />
            </View>

            <Text style={styles.brandName}>SNAPBRIEF AI</Text>
          </View>

          <Text
            style={[
              styles.headerTitle,
              isCompact && styles.headerTitleCompact,
            ]}
          >
            Make clarity happen.
          </Text>
        </View>

        <View style={styles.avatar}>
          <Text style={styles.avatarText}>SB</Text>
        </View>
      </View>

      {/* Hero */}
      <View style={styles.hero}>
        <View style={styles.heroGlow} />

        <View style={styles.heroHeader}>
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>AI BRIEF BUILDER</Text>
          </View>

          <View style={styles.heroIcon}>
            <Ionicons
              name="flash-outline"
              size={17}
              color={colors.accent}
            />
          </View>
        </View>

        <Text
          style={[
            styles.heroTitle,
            isCompact && styles.heroTitleCompact,
          ]}
        >
          Messy input.{'\n'}
          <Text style={styles.heroAccent}>Sharp output.</Text>
        </Text>

        <Text style={styles.heroDescription}>
          Turn rough notes, messages, ideas, and meeting summaries
          into a clear brief you can actually use.
        </Text>

        <View style={styles.heroFooter}>
          <View style={styles.metaItem}>
            <Ionicons
              name="time-outline"
              size={14}
              color={colors.dim}
            />
            <Text style={styles.metaText}>
              Usually takes a few seconds
            </Text>
          </View>

          <View style={styles.metaItem}>
            <Ionicons
              name="shield-checkmark-outline"
              size={14}
              color={colors.dim}
            />
            <Text style={styles.metaText}>
              Review before sharing
            </Text>
          </View>
        </View>
      </View>

      {/* Input heading */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleContainer}>
          <SectionTitle
            eyebrow="01 / INPUT"
            title="What do you need to structure?"
          />
        </View>

        <Pressable
          onPress={loadExample}
          hitSlop={6}
          style={({ pressed }) => [
            styles.secondaryButton,
            pressed && styles.pressed,
          ]}
        >
          <Ionicons
            name="shuffle-outline"
            size={14}
            color={colors.muted}
          />

          <Text style={styles.secondaryButtonText}>
            Example
          </Text>
        </Pressable>
      </View>

      {/* Editor */}
      <GlassCard style={styles.editorCard}>
        <View style={styles.editorHeader}>
          <View style={styles.noteBadge}>
            <Ionicons
              name="document-text-outline"
              size={13}
              color={colors.accent}
            />

            <Text style={styles.noteBadgeText}>NOTE</Text>
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
                name="close-outline"
                size={16}
                color={colors.dim}
              />

              <Text style={styles.clearText}>Clear</Text>
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
          placeholder="Paste meeting notes, messages, ideas, reminders..."
          placeholderTextColor={colors.dim}
          style={[
            styles.input,
            isCompact && styles.inputCompact,
          ]}
        />

        <View style={styles.editorFooter}>
          <View style={styles.localStatus}>
            <View style={styles.localStatusIcon}>
              <Ionicons
                name="lock-closed-outline"
                size={10}
                color={colors.dim}
              />
            </View>

            <Text style={styles.localStatusText}>
              Stored locally after generation
            </Text>
          </View>

          <Text
            style={[
              styles.counter,
              remainingCharacters < 300 && styles.counterWarning,
            ]}
          >
            {text.length}/{CHARACTER_LIMIT}
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

      {/* Quick start */}
      <View style={styles.quickSection}>
        <View style={styles.quickHeader}>
          <Text style={styles.quickLabel}>QUICK START</Text>

          <Text style={styles.quickHint}>
            Start with a format
          </Text>
        </View>

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
                <View
                  style={[
                    styles.quickIcon,
                    active && styles.quickIconActive,
                  ]}
                >
                  <Ionicons
                    name={item.icon}
                    size={13}
                    color={
                      active
                        ? colors.accent
                        : colors.muted
                    }
                  />
                </View>

                <Text
                  style={[
                    styles.quickChipText,
                    active && styles.quickChipTextActive,
                  ]}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Create button */}
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

          <View style={styles.createCopy}>
            <Text style={styles.createTitle}>
              {loading
                ? 'Building your brief...'
                : 'Create brief'}
            </Text>

            <Text style={styles.createSubtitle}>
              {loading
                ? 'Analyzing and structuring your notes'
                : 'Turn this into something actionable'}
            </Text>
          </View>
        </View>

        {!loading ? (
          <View style={styles.arrowCircle}>
            <Ionicons
              name="arrow-forward"
              size={17}
              color={colors.bg}
            />
          </View>
        ) : null}
      </Pressable>

      {/* Error */}
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
              Something went wrong
            </Text>

            <Text style={styles.errorText}>
              {error}
            </Text>
          </View>
        </View>
      ) : null}

      {/* Result */}
      {brief ? (
        <View style={styles.resultSection}>
          <View style={styles.resultHeader}>
            <View style={styles.resultTitleContainer}>
              <SectionTitle
                eyebrow="02 / RESULT"
                title="Here’s the signal."
              />
            </View>

            <View style={styles.successBadge}>
              <Ionicons
                name="checkmark"
                size={14}
                color={colors.bg}
              />
            </View>
          </View>

          <BriefResult brief={brief} />

          <View style={styles.disclaimerCard}>
            <View style={styles.disclaimerIcon}>
              <Ionicons
                name="information-circle-outline"
                size={15}
                color={colors.dim}
              />
            </View>

            <Text style={styles.disclaimer}>
              AI-generated result. Review important dates,
              numbers, names, and commitments before sending.
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
              size={17}
              color={colors.accent}
            />

            <Text style={styles.newBriefText}>
              Start another brief
            </Text>
          </Pressable>
        </View>
      ) : (
        <GlassCard style={styles.tipCard}>
          <View style={styles.tipIcon}>
            <Ionicons
              name="bulb-outline"
              size={19}
              color={colors.accent}
            />
          </View>

          <View style={styles.tipBody}>
            <Text style={styles.tipTitle}>
              Keep your notes messy.
            </Text>

            <Text style={styles.tipText}>
              You do not need to rewrite anything first.
              Paste the rough version and let SnapBrief
              organize the important parts for you.
            </Text>
          </View>
        </GlassCard>
      )}

      <View style={styles.footerSpace} />
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

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },

  brandBlock: {
    flex: 1,
  },

  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 7,
  },

  brandMark: {
    width: 27,
    height: 27,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    marginRight: 8,
  },

  brandName: {
    color: colors.accentSoft,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.8,
  },

  headerTitle: {
    color: colors.white,
    fontSize: 24,
    lineHeight: 29,
    fontWeight: '800',
    letterSpacing: -0.7,
  },

  headerTitleCompact: {
    fontSize: 21,
    lineHeight: 26,
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.border,
    marginLeft: spacing.md,
  },

  avatarText: {
    color: colors.accentSoft,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.7,
  },

  hero: {
    position: 'relative',
    overflow: 'hidden',
    padding: spacing.xl,
    borderRadius: 26,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xxl,
  },

  heroGlow: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    right: -95,
    top: -90,
    backgroundColor: 'rgba(45, 225, 214, 0.07)',
  },

  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 22,
  },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: radius.pill,
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.border,
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
    marginRight: 7,
  },

  statusText: {
    color: colors.muted,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1.2,
  },

  heroIcon: {
    width: 37,
    height: 37,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(45, 225, 214, 0.06)',
    borderWidth: 1,
    borderColor: colors.border,
  },

  heroTitle: {
    color: colors.white,
    fontSize: 38,
    lineHeight: 41,
    fontWeight: '800',
    letterSpacing: -1.6,
  },

  heroTitleCompact: {
    fontSize: 31,
    lineHeight: 35,
  },

  heroAccent: {
    color: colors.accent,
  },

  heroDescription: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 15,
    maxWidth: 560,
  },

  heroFooter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  metaText: {
    color: colors.dim,
    fontSize: 10,
    marginLeft: 5,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 12,
  },

  sectionTitleContainer: {
    flex: 1,
  },

  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  secondaryButtonText: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: '700',
    marginLeft: 5,
  },

  pressed: {
    opacity: 0.68,
  },

  editorCard: {
    padding: spacing.md,
    borderRadius: 22,
  },

  editorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  noteBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(45, 225, 214, 0.06)',
    borderWidth: 1,
    borderColor: colors.border,
  },

  noteBadgeText: {
    color: colors.accentSoft,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1,
    marginLeft: 5,
  },

  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 3,
    paddingVertical: 4,
  },

  clearText: {
    color: colors.dim,
    fontSize: 10,
    marginLeft: 3,
  },

  input: {
    minHeight: 190,
    maxHeight: 310,
    color: colors.white,
    fontSize: 16,
    lineHeight: 25,
    fontWeight: '500',
    paddingTop: 8,
    paddingBottom: 8,
  },

  inputCompact: {
    minHeight: 170,
    fontSize: 15,
    lineHeight: 23,
  },

  editorFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },

  localStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },

  localStatusIcon: {
    width: 20,
    height: 20,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface2,
    borderWidth: 1,
    borderColor: colors.border,
  },

  localStatusText: {
    color: colors.dim,
    fontSize: 9,
    marginLeft: 6,
  },

  counter: {
    color: colors.dim,
    fontSize: 9,
    fontWeight: '700',
    marginLeft: 10,
  },

  counterWarning: {
    color: colors.accentSoft,
  },

  progressTrack: {
    height: 3,
    width: '100%',
    borderRadius: radius.pill,
    backgroundColor: colors.surface2,
    overflow: 'hidden',
    marginTop: 10,
  },

  progressFill: {
    height: '100%',
    borderRadius: radius.pill,
    backgroundColor: colors.accent,
  },

  quickSection: {
    marginTop: 18,
    marginBottom: 17,
  },

  quickHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 9,
  },

  quickLabel: {
    color: colors.dim,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1.4,
  },

  quickHint: {
    color: colors.dim,
    fontSize: 9,
  },

  quickRow: {
    gap: 8,
    paddingRight: 4,
  },

  quickChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
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

  quickIcon: {
    width: 23,
    height: 23,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface2,
  },

  quickIconActive: {
    backgroundColor: 'rgba(45, 225, 214, 0.09)',
  },

  quickChipText: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: '700',
    marginLeft: 6,
  },

  quickChipTextActive: {
    color: colors.accentSoft,
  },

  createButton: {
    minHeight: 68,
    borderRadius: 21,
    paddingHorizontal: 13,
    paddingVertical: 10,
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
    opacity: 0.4,
  },

  createLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  createIcon: {
    width: 43,
    height: 43,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(6, 17, 19, 0.11)',
    marginRight: 11,
  },

  createCopy: {
    flex: 1,
  },

  createTitle: {
    color: colors.bg,
    fontSize: 15,
    fontWeight: '800',
  },

  createSubtitle: {
    color: 'rgba(6, 17, 19, 0.62)',
    fontSize: 9,
    fontWeight: '600',
    marginTop: 2,
  },

  arrowCircle: {
    width: 41,
    height: 41,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(6, 17, 19, 0.11)',
  },

  errorCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 13,
    padding: 13,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 124, 135, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 124, 135, 0.16)',
  },

  errorIcon: {
    width: 33,
    height: 33,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 124, 135, 0.07)',
    marginRight: 10,
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

  resultSection: {
    marginTop: 29,
  },

  resultHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  resultTitleContainer: {
    flex: 1,
  },

  successBadge: {
    width: 29,
    height: 29,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    marginLeft: 12,
  },

  disclaimerCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    marginTop: 11,
    borderRadius: 15,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  disclaimerIcon: {
    width: 22,
    height: 22,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface2,
    marginRight: 7,
  },

  disclaimer: {
    flex: 1,
    color: colors.dim,
    fontSize: 9,
    lineHeight: 15,
  },

  newBriefButton: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: radius.pill,
    marginTop: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  newBriefText: {
    color: colors.accentSoft,
    fontSize: 10,
    fontWeight: '800',
    marginLeft: 5,
  },

  tipCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 17,
    padding: spacing.md,
    borderRadius: 19,
  },

  tipIcon: {
    width: 39,
    height: 39,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(45, 225, 214, 0.06)',
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 11,
  },

  tipBody: {
    flex: 1,
  },

  tipTitle: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 4,
  },

  tipText: {
    color: colors.muted,
    fontSize: 10,
    lineHeight: 16,
  },

  footerSpace: {
    height: 18,
  },
});