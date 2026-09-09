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
import { Brief } from '@/types/brief';

const COLORS = {
  bg: '#061113',
  panel: '#0B181B',
  panelRaised: '#102326',
  panelSoft: '#0D2023',

  aqua: '#2DE1D6',
  aquaSoft: '#92FFF7',
  aquaDeep: '#12AAA4',

  white: '#F3FFFE',
  text: '#D7E8E7',
  muted: '#87A6A5',
  dim: '#5D7778',

  border: '#1B383A',
  borderStrong: '#2A5558',

  danger: '#FF7C87',
};

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

export default function HomeScreen() {
  const { width } = useWindowDimensions();

  const isCompact = width < 380;
  const horizontalPadding = isCompact ? 16 : width > 600 ? 28 : 20;

  const [text, setText] = useState(examples[0] ?? '');
  const [brief, setBrief] = useState<Brief | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const characterLimit = 3000;

  const progress = useMemo(() => {
    if (!text.length) return 0;
    return Math.min(text.length / characterLimit, 1);
  }, [text.length]);

  const remainingCharacters = characterLimit - text.length;

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
                size={15}
                color={COLORS.bg}
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

        <View style={styles.heroTopRow}>
          <View style={styles.heroBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.heroBadgeText}>AI BRIEF BUILDER</Text>
          </View>

          <View style={styles.heroIcon}>
            <Ionicons
              name="flash-outline"
              size={18}
              color={COLORS.aqua}
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
          <Text style={styles.heroTitleAccent}>Sharp output.</Text>
        </Text>

        <Text style={styles.heroCopy}>
          Turn rough notes, messages, ideas, or meeting summaries
          into a clear brief you can actually use.
        </Text>

        <View style={styles.heroMetaRow}>
          <View style={styles.metaItem}>
            <Ionicons
              name="time-outline"
              size={15}
              color={COLORS.dim}
            />
            <Text style={styles.metaText}>Usually takes a few seconds</Text>
          </View>

          <View style={styles.metaItem}>
            <Ionicons
              name="shield-checkmark-outline"
              size={15}
              color={COLORS.dim}
            />
            <Text style={styles.metaText}>Review before sharing</Text>
          </View>
        </View>
      </View>

      {/* Input section */}
      <View style={styles.sectionHeader}>
        <SectionTitle
          eyebrow="01 / INPUT"
          title="What do you need to structure?"
        />

        <Pressable
          onPress={loadExample}
          style={({ pressed }) => [
            styles.exampleButton,
            pressed && styles.pressedSoft,
          ]}
        >
          <Ionicons
            name="shuffle-outline"
            size={15}
            color={COLORS.muted}
          />
          <Text style={styles.exampleText}>Try example</Text>
        </Pressable>
      </View>

      {/* Input card */}
      <GlassCard style={styles.editorCard}>
        <View style={styles.editorTopRow}>
          <View style={styles.noteBadge}>
            <Ionicons
              name="document-text-outline"
              size={14}
              color={COLORS.aqua}
            />
            <Text style={styles.noteBadgeText}>NOTE</Text>
          </View>

          {text.length > 0 ? (
            <Pressable
              onPress={clearInput}
              hitSlop={8}
              style={({ pressed }) => [
                styles.clearButton,
                pressed && styles.pressedSoft,
              ]}
            >
              <Ionicons
                name="close-outline"
                size={17}
                color={COLORS.dim}
              />
              <Text style={styles.clearText}>Clear</Text>
            </Pressable>
          ) : null}
        </View>

        <TextInput
          value={text}
          onChangeText={(value) => {
            setText(value);
            if (error) setError('');
          }}
          multiline
          textAlignVertical="top"
          autoCapitalize="sentences"
          autoCorrect
          spellCheck
          maxLength={characterLimit}
          placeholder="Paste meeting notes, messages, ideas, reminders..."
          placeholderTextColor={COLORS.dim}
          style={[
            styles.input,
            isCompact && styles.inputCompact,
          ]}
        />

        <View style={styles.editorFooter}>
          <View style={styles.privateStatus}>
            <Ionicons
              name="lock-closed-outline"
              size={13}
              color={COLORS.dim}
            />
            <Text style={styles.privateText}>
              Stored locally after generation
            </Text>
          </View>

          <Text
            style={[
              styles.counter,
              remainingCharacters < 300 && styles.counterWarning,
            ]}
          >
            {text.length}/{characterLimit}
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

      {/* Quick starts */}
      <View style={styles.quickSection}>
        <Text style={styles.quickLabel}>QUICK START</Text>

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
                  size={15}
                  color={active ? COLORS.aqua : COLORS.muted}
                />

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

      {/* Main action */}
      <Pressable
        onPress={createBrief}
        disabled={loading || !text.trim()}
        style={({ pressed }) => [
          styles.createButton,
          pressed && !loading && styles.createButtonPressed,
          (!text.trim() || loading) && styles.createButtonDisabled,
        ]}
      >
        <View style={styles.createButtonLeft}>
          <View style={styles.createIcon}>
            {loading ? (
              <ActivityIndicator
                size="small"
                color={COLORS.bg}
              />
            ) : (
              <Ionicons
                name="sparkles"
                size={18}
                color={COLORS.bg}
              />
            )}
          </View>

          <View>
            <Text style={styles.createText}>
              {loading ? 'Building your brief...' : 'Create brief'}
            </Text>

            {!loading ? (
              <Text style={styles.createSubtext}>
                Turn this into something actionable
              </Text>
            ) : (
              <Text style={styles.createSubtext}>
                Analyzing and structuring your notes
              </Text>
            )}
          </View>
        </View>

        {!loading ? (
          <View style={styles.arrowCircle}>
            <Ionicons
              name="arrow-forward"
              size={18}
              color={COLORS.bg}
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
              size={18}
              color={COLORS.danger}
            />
          </View>

          <View style={styles.errorBody}>
            <Text style={styles.errorTitle}>Something went wrong</Text>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        </View>
      ) : null}

      {/* Result */}
      {brief ? (
        <View style={styles.resultSection}>
          <View style={styles.resultHeader}>
            <View style={styles.resultTitleWrap}>
              <SectionTitle
                eyebrow="02 / RESULT"
                title="Here’s the signal."
              />
            </View>

            <View style={styles.successBadge}>
              <Ionicons
                name="checkmark"
                size={14}
                color={COLORS.bg}
              />
            </View>
          </View>

          <BriefResult brief={brief} />

          <View style={styles.disclaimerCard}>
            <Ionicons
              name="information-circle-outline"
              size={16}
              color={COLORS.dim}
            />

            <Text style={styles.disclaimer}>
              AI-generated result. Review important dates, numbers,
              names, and commitments before sending.
            </Text>
          </View>

          <Pressable
            onPress={startAnother}
            style={({ pressed }) => [
              styles.newBriefButton,
              pressed && styles.pressedSoft,
            ]}
          >
            <Ionicons
              name="add-outline"
              size={18}
              color={COLORS.aqua}
            />
            <Text style={styles.newBriefText}>Start another brief</Text>
          </Pressable>
        </View>
      ) : (
        /* Empty state */
        <GlassCard style={styles.tipCard}>
          <View style={styles.tipIcon}>
            <Ionicons
              name="bulb-outline"
              size={20}
              color={COLORS.aqua}
            />
          </View>

          <View style={styles.tipBody}>
            <Text style={styles.tipTitle}>
              Keep your notes messy.
            </Text>

            <Text style={styles.tipText}>
              You do not need to rewrite anything first. Paste the
              rough version and let SnapBrief organize the important
              parts for you.
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
    backgroundColor: COLORS.bg,
  },

  content: {
    paddingTop: 18,
    paddingBottom: 32,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 22,
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
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.aqua,
    marginRight: 9,
  },

  brandName: {
    color: COLORS.aquaSoft,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.8,
  },

  headerTitle: {
    color: COLORS.white,
    fontSize: 24,
    lineHeight: 29,
    fontWeight: '700',
    letterSpacing: -0.6,
  },

  headerTitleCompact: {
    fontSize: 22,
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.panelRaised,
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    marginLeft: 14,
  },

  avatarText: {
    color: COLORS.aquaSoft,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
  },

  hero: {
    overflow: 'hidden',
    borderRadius: 28,
    padding: 22,
    backgroundColor: COLORS.panel,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 28,
  },

  heroGlow: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    right: -80,
    top: -70,
    backgroundColor: 'rgba(45, 225, 214, 0.08)',
  },

  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 22,
  },

  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 100,
    backgroundColor: COLORS.panelRaised,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.aqua,
    marginRight: 7,
  },

  heroBadgeText: {
    color: COLORS.muted,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.3,
  },

  heroIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(45, 225, 214, 0.08)',
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
  },

  heroTitle: {
    color: COLORS.white,
    fontSize: 38,
    lineHeight: 41,
    fontWeight: '800',
    letterSpacing: -1.5,
  },

  heroTitleCompact: {
    fontSize: 32,
    lineHeight: 35,
  },

  heroTitleAccent: {
    color: COLORS.aqua,
  },

  heroCopy: {
    color: COLORS.text,
    fontSize: 15,
    lineHeight: 23,
    marginTop: 16,
    maxWidth: 550,
  },

  heroMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    marginTop: 21,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },

  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  metaText: {
    color: COLORS.dim,
    fontSize: 11,
    marginLeft: 6,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 12,
  },

  exampleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 100,
    backgroundColor: COLORS.panel,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  pressedSoft: {
    opacity: 0.72,
  },

  exampleText: {
    color: COLORS.muted,
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 5,
  },

  editorCard: {
    padding: 16,
    borderRadius: 22,
    backgroundColor: COLORS.panel,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  editorTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  noteBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 100,
    backgroundColor: 'rgba(45, 225, 214, 0.07)',
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  noteBadgeText: {
    color: COLORS.aquaSoft,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
    marginLeft: 6,
  },

  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 4,
  },

  clearText: {
    color: COLORS.dim,
    fontSize: 11,
    marginLeft: 3,
  },

  input: {
    minHeight: 190,
    maxHeight: 310,
    color: COLORS.white,
    fontSize: 16,
    lineHeight: 25,
    fontWeight: '500',
    paddingTop: 7,
    paddingBottom: 7,
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
    marginTop: 5,
  },

  privateStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },

  privateText: {
    color: COLORS.dim,
    fontSize: 10,
    marginLeft: 5,
  },

  counter: {
    color: COLORS.dim,
    fontSize: 10,
    fontWeight: '700',
    marginLeft: 12,
  },

  counterWarning: {
    color: COLORS.aquaSoft,
  },

  progressTrack: {
    height: 3,
    width: '100%',
    borderRadius: 99,
    backgroundColor: COLORS.panelRaised,
    overflow: 'hidden',
    marginTop: 11,
  },

  progressFill: {
    height: '100%',
    borderRadius: 99,
    backgroundColor: COLORS.aqua,
  },

  quickSection: {
    marginTop: 18,
    marginBottom: 18,
  },

  quickLabel: {
    color: COLORS.dim,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 9,
  },

  quickRow: {
    gap: 8,
    paddingRight: 4,
  },

  quickChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 100,
    backgroundColor: COLORS.panel,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  quickChipActive: {
    backgroundColor: 'rgba(45, 225, 214, 0.09)',
    borderColor: COLORS.borderStrong,
  },

  quickChipPressed: {
    opacity: 0.72,
  },

  quickChipText: {
    color: COLORS.muted,
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 6,
  },

  quickChipTextActive: {
    color: COLORS.aquaSoft,
  },

  createButton: {
    minHeight: 70,
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.aqua,
  },

  createButtonPressed: {
    transform: [{ scale: 0.99 }],
    opacity: 0.9,
  },

  createButtonDisabled: {
    opacity: 0.42,
  },

  createButtonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  createIcon: {
    width: 44,
    height: 44,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(6, 17, 19, 0.12)',
    marginRight: 11,
  },

  createText: {
    color: COLORS.bg,
    fontSize: 16,
    fontWeight: '800',
  },

  createSubtext: {
    color: 'rgba(6, 17, 19, 0.66)',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },

  arrowCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(6, 17, 19, 0.12)',
  },

  errorCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 14,
    padding: 14,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 124, 135, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 124, 135, 0.18)',
  },

  errorIcon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 124, 135, 0.08)',
    marginRight: 11,
  },

  errorBody: {
    flex: 1,
  },

  errorTitle: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 3,
  },

  errorText: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 17,
  },

  resultSection: {
    marginTop: 30,
  },

  resultHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 13,
  },

  resultTitleWrap: {
    flex: 1,
  },

  successBadge: {
    width: 29,
    height: 29,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.aqua,
    marginLeft: 12,
  },

  disclaimerCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 13,
    marginTop: 12,
    borderRadius: 15,
    backgroundColor: COLORS.panel,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  disclaimer: {
    flex: 1,
    color: COLORS.dim,
    fontSize: 10,
    lineHeight: 16,
  },

  newBriefButton: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 11,
    borderRadius: 100,
    marginTop: 15,
    backgroundColor: COLORS.panel,
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
  },

  newBriefText: {
    color: COLORS.aquaSoft,
    fontSize: 11,
    fontWeight: '800',
    marginLeft: 6,
  },

  tipCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 18,
    padding: 16,
    borderRadius: 19,
    backgroundColor: COLORS.panel,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  tipIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(45, 225, 214, 0.07)',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 12,
  },

  tipBody: {
    flex: 1,
  },

  tipTitle: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 5,
  },

  tipText: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 17,
  },

  footerSpace: {
    height: 20,
  },
});